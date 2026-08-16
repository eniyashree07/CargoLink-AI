const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Driver = require('../models/Driver');
const CargoOwner = require('../models/CargoOwner');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Pre-built demo accounts (created on first use)
const DEMO_ACCOUNTS = {
  DRIVER: {
    fullName: 'Demo Driver',
    email: 'driver@cargolink.ai',
    mobile: '9876543210',
    password: 'password123',
    driver: {
      drivingLicence: 'TN 11 20180042341',
      truckNumber: 'TN 11 AB 1234',
      vehicleType: 'Mini Truck',
    },
  },
  OWNER: {
    fullName: 'Demo Owner',
    email: 'owner@cargolink.ai',
    mobile: '9876543211',
    password: 'password123',
    owner: {
      companyName: 'ABC Logistics Pvt Ltd',
      gstNumber: '33AAAAA0000A1Z5',
      companyAddress: '100 Feet Road, Guindy, Chennai',
    },
  },
  ADMIN: {
    fullName: 'Demo Admin',
    email: 'admin@cargolink.ai',
    mobile: '9876543212',
    password: 'password123',
    employeeId: 'EMP-2024-99',
  },
};

// Demo Login - auto-creates the demo account on first use, then signs in
router.post('/demo', async (req, res) => {
  try {
    const role = String(req.body.role || 'DRIVER').toUpperCase();
    const demo = DEMO_ACCOUNTS[role];

    if (!demo) {
      return res.status(400).json({ success: false, message: 'Invalid demo role.' });
    }

    let user = await User.findOne({ email: demo.email });
    if (!user) {
      user = new User({
        fullName: demo.fullName,
        email: demo.email,
        mobile: demo.mobile,
        password: demo.password,
        role,
        employeeId: role === 'ADMIN' ? demo.employeeId : null,
      });
      await user.save();

      if (role === 'DRIVER') {
        const driver = new Driver({ userId: user._id, ...demo.driver });
        await driver.save();
      } else if (role === 'OWNER') {
        const cargoOwner = new CargoOwner({ userId: user._id, ...demo.owner });
        await cargoOwner.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const responseUser = await buildResponseUser(user);

    res.json({
      success: true,
      message: 'Demo login successful',
      token,
      user: responseUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Build role-specific user data shared by login/demo endpoints
async function buildResponseUser(user) {
  const base = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile || '',
    role: user.role,
    employeeId: user.employeeId || null
  };

  if (user.role === 'OWNER') {
    const ownerProfile = await CargoOwner.findOne({ userId: user._id });
    if (ownerProfile) {
      Object.assign(base, {
        companyName: ownerProfile.companyName,
        gstNumber: ownerProfile.gstNumber,
        companyAddress: ownerProfile.companyAddress
      });
    }
  } else if (user.role === 'DRIVER') {
    const driverProfile = await Driver.findOne({ userId: user._id });
    if (driverProfile) {
      Object.assign(base, {
        drivingLicence: driverProfile.drivingLicence,
        truckNumber: driverProfile.truckNumber,
        vehicleType: driverProfile.vehicleType
      });
    }
  }

  return base;
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, mobile, email, password, role, employeeId, ...roleSpecificData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email or mobile already registered' 
      });
    }

    // Create user
    const user = new User({
      fullName,
      mobile,
      email,
      password,
      role,
      employeeId: role === 'ADMIN' ? employeeId : null
    });

    await user.save();

    // Create role-specific profile
    let driver = null;
    let cargoOwner = null;

    if (role === 'DRIVER') {
      driver = new Driver({
        userId: user._id,
        drivingLicence: roleSpecificData.drivingLicence,
        truckNumber: roleSpecificData.truckNumber,
        vehicleType: roleSpecificData.vehicleType
      });
      await driver.save();
    } else if (role === 'OWNER') {
      cargoOwner = new CargoOwner({
        userId: user._id,
        companyName: roleSpecificData.companyName,
        gstNumber: roleSpecificData.gstNumber,
        companyAddress: roleSpecificData.companyAddress
      });
      await cargoOwner.save();
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const responseUser = {
      id: user._sid || user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      employeeId: user.employeeId || null
    };

    if (role === 'DRIVER' && driver) {
      responseUser.drivingLicence = driver.drivingLicence;
      responseUser.truckNumber = driver.truckNumber;
      responseUser.vehicleType = driver.vehicleType;
    }

    if (role === 'OWNER' && cargoOwner) {
      responseUser.companyName = cargoOwner.companyName;
      responseUser.gstNumber = cargoOwner.gstNumber;
      responseUser.companyAddress = cargoOwner.companyAddress;
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: responseUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    if (!user.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'This account uses Google Sign-In. Please tap Continue with Google.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const responseUser = await buildResponseUser(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: responseUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Forgot Password - send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const mobile = String(req.body.mobile || '').replace(/\D/g, '');

    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Please enter your mobile number.' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this mobile number.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = expiresAt;
    await user.save();

    console.log(`[FORGOT-PASSWORD] OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully to your mobile number.',
      devOtp: otp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const mobile = String(req.body.mobile || '').replace(/\D/g, '');
    const otp = String(req.body.otp || '').trim();

    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile number and OTP are required.' });
    }

    const user = await User.findOne({ mobile });
    if (!user || !user.resetOtp) {
      return res.status(400).json({ success: false, message: 'No OTP request found. Please request a new OTP.' });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
    }

    const resetToken = jwt.sign(
      { userId: user._id, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Verification token is invalid or expired.' });
    }

    if (!payload || payload.purpose !== 'password-reset') {
      return res.status(400).json({ success: false, message: 'Invalid verification token.' });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
