const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Driver = require('../models/Driver');
const CargoOwner = require('../models/CargoOwner');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

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

    let roleSpecificData = {
      employeeId: user.employeeId || null
    };
    if (user.role === 'OWNER') {
      const ownerProfile = await CargoOwner.findOne({ userId: user._id });
      if (ownerProfile) {
        roleSpecificData = {
          ...roleSpecificData,
          companyName: ownerProfile.companyName,
          gstNumber: ownerProfile.gstNumber,
          companyAddress: ownerProfile.companyAddress
        };
      }
    } else if (user.role === 'DRIVER') {
      const driverProfile = await Driver.findOne({ userId: user._id });
      if (driverProfile) {
        roleSpecificData = {
          ...roleSpecificData,
          drivingLicence: driverProfile.drivingLicence,
          truckNumber: driverProfile.truckNumber,
          vehicleType: driverProfile.vehicleType
        };
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        ...roleSpecificData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
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
