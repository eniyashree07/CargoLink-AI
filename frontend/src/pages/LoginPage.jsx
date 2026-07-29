import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, User, Building, ShieldCheck, Mail, Lock, Phone,
  FileText, MapPin, BadgeCheck, AlertCircle, CheckCircle2, Eye, EyeOff, CreditCard
} from 'lucide-react';
import './LoginPage.css';
import { authService } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState('login');
  // Selected Role: 'driver' | 'owner' | 'admin'
  const [role, setRole] = useState('driver');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('driver@cargolink.ai');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Common Register Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-Specific Register State
  // Driver
  const [drivingLicence, setDrivingLicence] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Mini Truck');

  // Owner
  const [ownerName, setOwnerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  // Admin
  const [employeeId, setEmployeeId] = useState('');

  // UI Helper States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------
  // VALIDATIONS
  // ----------------------------------------------------
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validateMobile = (val) => /^\d{10}$/.test(val.replace(/\D/g, ''));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your Email Address or Mobile Number.');
      setIsLoading(false);
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your Password.');
      setIsLoading(false);
      return;
    }
    if (loginPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login(loginIdentifier, loginPassword);
      
      const userRole = response.user.role ? response.user.role.toLowerCase() : 'driver';
      const userPayload = {
        name: response.user.fullName || loginIdentifier,
        fullName: response.user.fullName || loginIdentifier,
        identifier: loginIdentifier,
        role: userRole,
        isLoggedIn: true,
        rememberMe: rememberMe,
        user: {
          ...response.user,
          id: response.user.id || response.user._id,
          fullName: response.user.fullName || response.user.full_name || loginIdentifier
        }
      };
      const localStorageUser = { ...userPayload };
      if (userRole === 'owner') {
        Object.assign(localStorageUser, {
          ownerName: response.user.fullName || loginIdentifier,
          companyName: response.user.companyName || '',
          gstNumber: response.user.gstNumber || '',
          companyAddress: response.user.companyAddress || ''
        });
      } else if (userRole === 'driver') {
        Object.assign(localStorageUser, {
          drivingLicence: response.user.drivingLicence || '',
          truckNumber: response.user.truckNumber || '',
          vehicleType: response.user.vehicleType || ''
        });
      }

      localStorage.setItem('cargolink_user', JSON.stringify(localStorageUser));
      if (userRole === 'owner') {
        localStorage.setItem('cargolink_owner_user', JSON.stringify(localStorageUser));
      } else if (userRole === 'driver') {
        localStorage.setItem('cargolink_driver_user', JSON.stringify(localStorageUser));
      } else if (userRole === 'admin') {
        localStorage.setItem('cargolink_admin_user', JSON.stringify(localStorageUser));
      }

      setSuccessMessage(`Welcome back! Logging in as ${response.user.role}...`);
      
      setTimeout(() => {
        if (userRole === 'driver') navigate('/driver-app');
        else if (userRole === 'owner') navigate('/dashboard/owner');
        else if (userRole === 'admin') navigate('/dashboard/admin');
      }, 700);
    } catch (error) {
      const backendMessage = error?.response?.message || error?.message;
      setErrorMessage(backendMessage || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Role-specific name field validation
    const nameToValidate = role === 'owner' ? ownerName : fullName;
    if (!nameToValidate.trim()) {
      setErrorMessage(`Please enter your ${role === 'owner' ? 'Owner Name' : 'Full Name'}.`);
      setIsLoading(false);
      return;
    }

    if (!validateMobile(mobileNumber)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password must match.');
      setIsLoading(false);
      return;
    }

    // Role-specific validations
    if (role === 'driver') {
      if (!drivingLicence.trim()) { setErrorMessage('Please enter your Driving Licence Number.'); setIsLoading(false); return; }
      if (!truckNumber.trim()) { setErrorMessage('Please enter your Truck Number.'); setIsLoading(false); return; }
    } else if (role === 'owner') {
      if (!companyName.trim()) { setErrorMessage('Please enter your Company Name.'); setIsLoading(false); return; }
      if (!companyAddress.trim()) { setErrorMessage('Please enter your Company Address.'); setIsLoading(false); return; }
    } else if (role === 'admin') {
      if (!employeeId.trim()) { setErrorMessage('Please enter your Employee ID.'); setIsLoading(false); return; }
    }

    try {
      const userData = {
        fullName: role === 'owner' ? ownerName : fullName,
        mobile: mobileNumber,
        email: email,
        password: password,
        role: role.toUpperCase(),
        // Driver-specific fields
        drivingLicence: role === 'driver' ? drivingLicence : undefined,
        truckNumber: role === 'driver' ? truckNumber : undefined,
        vehicleType: role === 'driver' ? vehicleType : undefined,
        // Owner-specific fields
        ownerName: role === 'owner' ? ownerName : undefined,
        companyName: role === 'owner' ? companyName : undefined,
        gstNumber: role === 'owner' ? gstNumber : undefined,
        companyAddress: role === 'owner' ? companyAddress : undefined,
        // Admin-specific fields
        employeeId: role === 'admin' ? employeeId : undefined,
      };

      const response = await authService.register(userData);
      const userRole = response.user.role ? response.user.role.toLowerCase() : role;

      // Save auth session (store both `name` and `fullName` for compatibility)
      const regPayload = {
        name: nameToValidate,
        fullName: nameToValidate,
        email: email,
        role: userRole,
        isLoggedIn: true,
        user: {
          ...response.user,
          id: response.user.id || response.user._id,
          fullName: response.user.fullName || nameToValidate
        }
      };
      const localStorageUser = { ...regPayload };
      if (userRole === 'owner') {
        Object.assign(localStorageUser, {
          companyName,
          ownerName,
          gstNumber,
          companyAddress
        });
      } else if (userRole === 'driver') {
        Object.assign(localStorageUser, {
          drivingLicence,
          truckNumber,
          vehicleType
        });
      } else if (userRole === 'admin') {
        Object.assign(localStorageUser, {
          employeeId: employeeId || '',
          name: nameToValidate,
          fullName: nameToValidate
        });
      }

      localStorage.setItem('cargolink_user', JSON.stringify(localStorageUser));
      if (userRole === 'owner') {
        localStorage.setItem('cargolink_owner_user', JSON.stringify(localStorageUser));
      } else if (userRole === 'driver') {
        localStorage.setItem('cargolink_driver_user', JSON.stringify(localStorageUser));
      } else if (userRole === 'admin') {
        localStorage.setItem('cargolink_admin_user', JSON.stringify(localStorageUser));
      }

      setSuccessMessage(`Account registered successfully as ${response.user.role}! Redirecting...`);

      setTimeout(() => {
        const userRole = response.user.role.toLowerCase();
        if (userRole === 'driver') navigate('/driver-app');
        else if (userRole === 'owner') navigate('/dashboard/owner');
        else if (userRole === 'admin') navigate('/dashboard/admin');
      }, 800);
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Animated Blobs */}
      <div className="login-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">

          {/* Logo & Header */}
          <div className="login-header">
            <div className="logo-container">
              <Truck size={30} />
            </div>
            <h1 className="text-poppins font-bold text-brown" style={{ fontSize: '1.6rem', margin: '0 0 4px 0' }}>
              CargoLink AI
            </h1>
            <p className="text-poppins text-brown" style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>
              Smart Logistics & Return Load Platform
            </p>

            {/* Role Switcher */}
            <div className="role-selector" style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                className={`role-btn ${role === 'driver' ? 'active' : ''}`}
                onClick={() => { setRole('driver'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                🚚 Driver
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'owner' ? 'active' : ''}`}
                onClick={() => { setRole('owner'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                🏢 Owner
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => { setRole('admin'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs (Sign In / Register) */}
          <div className="auth-tab-group">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            >
              Register ({role.charAt(0).toUpperCase() + role.slice(1)})
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="success-alert">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════
             1. UNIFIED LOGIN FORM (ALL ROLES)
             ═══════════════════════════════════════════ */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="text-poppins font-medium text-brown" style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem' }}>
                  Email or Mobile Number
                </label>
                <div className="input-icon-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="text"
                    className="input-field-custom"
                    placeholder="driver@cargolink.ai or 9876543210"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="text-poppins font-medium text-brown" style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem' }}>
                  Password
                </label>
                <div className="input-icon-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field-custom"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-poppins)', color: 'var(--text-dark-brown)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--primary-brown)', cursor: 'pointer' }}
                  />
                  Remember Me
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email/mobile!'); }}
                  style={{ fontSize: '0.82rem', color: 'var(--primary-brown)', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </button>

              <div className="toggle-auth-mode">
                Already have an account?
                <button type="button" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════
             2. DRIVER REGISTRATION FORM
             ═══════════════════════════════════════════ */}
          {mode === 'register' && role === 'driver' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-grid">
                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                  <div className="input-icon-wrapper">
                    <User size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Mobile Number *</label>
                  <div className="input-icon-wrapper">
                    <Phone size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="98765 43210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                </div>

                <div className="form-group-full">
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Email Address *</label>
                  <div className="input-icon-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input className="input-field-custom" type="email" placeholder="john.doe@cargolink.ai" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Password *</label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input className="input-field-custom" type="password" placeholder="Min 8 chars" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Confirm Password *</label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input className="input-field-custom" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Driving Licence No *</label>
                  <div className="input-icon-wrapper">
                    <CreditCard size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="TN 11 20180042341" value={drivingLicence} onChange={e => setDrivingLicence(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Truck Number *</label>
                  <div className="input-icon-wrapper">
                    <Truck size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="TN 11 AB 1234" value={truckNumber} onChange={e => setTruckNumber(e.target.value)} />
                  </div>
                </div>

                <div className="form-group-full">
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Vehicle Type *</label>
                  <select className="input-field-custom" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Container">Container</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Lorry">Lorry</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register as Driver'}
              </button>

              <div className="toggle-auth-mode">
                Already have an account?
                <button type="button" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════
             3. OWNER REGISTRATION FORM
             ═══════════════════════════════════════════ */}
          {mode === 'register' && role === 'owner' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-grid">
                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Owner Name *</label>
                  <div className="input-icon-wrapper">
                    <User size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="Rajesh Kumar" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Company Name *</label>
                  <div className="input-icon-wrapper">
                    <Building size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="ABC Logistics Pvt Ltd" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Mobile Number *</label>
                  <div className="input-icon-wrapper">
                    <Phone size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="98765 43210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Email Address *</label>
                  <div className="input-icon-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input className="input-field-custom" type="email" placeholder="owner@abclogistics.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Password *</label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input className="input-field-custom" type="password" placeholder="Min 8 chars" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Confirm Password *</label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input className="input-field-custom" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>

                <div className="form-group-full">
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>GST Number (Optional)</label>
                  <div className="input-icon-wrapper">
                    <FileText size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="33AAAAA0000A1Z5" value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
                  </div>
                </div>

                <div className="form-group-full">
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Company Address *</label>
                  <div className="input-icon-wrapper">
                    <MapPin size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="100 Feet Road, Guindy, Chennai" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                Register as Owner
              </button>

              <div className="toggle-auth-mode">
                Already have an account?
                <button type="button" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════
             4. ADMIN REGISTRATION FORM
             ═══════════════════════════════════════════ */}
          {mode === 'register' && role === 'admin' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-grid">
                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                  <div className="input-icon-wrapper">
                    <User size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="Suresh Admin" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Employee ID *</label>
                  <div className="input-icon-wrapper">
                    <BadgeCheck size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="EMP-2024-99" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Email Address *</label>
                  <div className="input-icon-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input className="input-field-custom" type="email" placeholder="admin@cargolink.ai" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Mobile Number *</label>
                  <div className="input-icon-wrapper">
                    <Phone size={16} className="input-icon" />
                    <input className="input-field-custom" placeholder="98765 43210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Password *</label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input className="input-field-custom" type="password" placeholder="Min 8 chars" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.78rem' }}>Confirm Password *</label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input className="input-field-custom" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register as Admin'}
              </button>

              <div className="toggle-auth-mode">
                Already have an account?
                <button type="button" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
