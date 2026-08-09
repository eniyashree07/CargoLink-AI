import React, { useState } from 'react';
import {
  Mail, Lock, Phone, User, CreditCard, Truck, ShieldCheck, Building,
  FileText, MapPin, BadgeCheck, AlertCircle, Eye, EyeOff, CheckCircle2
} from 'lucide-react';
import { authService } from '../../services/authService';

const LoginScreen = ({ onNext }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('driver'); // 'driver' | 'owner' | 'admin'

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

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validateMobile = (val) => /^\d{10}$/.test(val.replace(/\D/g, ''));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your Email Address or Mobile Number.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your Password.');
      return;
    }
    if (loginPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await authService.login(loginIdentifier.trim(), loginPassword);
      const user = response.user || {};
      const userRole = (user.role || role).toLowerCase();
      const fullName = user.fullName || (loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'User');

      // Clear any previous session so a fresh login never shows an old user's name
      localStorage.removeItem('cargolink_owner_user');
      localStorage.removeItem('cargolink_admin_user');
      localStorage.removeItem('cargolink_driver_user');
      localStorage.removeItem('cargolink_driver_profile');

      const userData = {
        identifier: loginIdentifier.trim(),
        name: fullName,
        fullName,
        email: user.email || '',
        phone: user.mobile || '',
        role: userRole,
        isLoggedIn: true,
        rememberMe: rememberMe,
        loginTime: new Date().toISOString(),
        user
      };

      localStorage.setItem('cargolink_user', JSON.stringify(userData));
      localStorage.setItem('cargolink_driver_user', JSON.stringify({ ...userData, fullName }));

      setSuccessMsg(`Welcome back ${fullName}! Logging in...`);

      setTimeout(() => {
        if (typeof onNext === 'function') {
          onNext(userData);
        }
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Role-specific name field validation
    const nameToValidate = role === 'owner' ? ownerName : fullName;
    if (!nameToValidate.trim()) {
      setErrorMsg(`Please enter your ${role === 'owner' ? 'Owner Name' : 'Full Name'}.`);
      return;
    }

    if (!validateMobile(mobileNumber)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password must match.');
      return;
    }

    // Role-specific field validations
    if (role === 'driver') {
      if (!drivingLicence.trim()) {
        setErrorMsg('Please enter your Driving Licence Number.');
        return;
      }
      if (!truckNumber.trim()) {
        setErrorMsg('Please enter your Truck Number.');
        return;
      }
    } else if (role === 'owner') {
      if (!companyName.trim()) {
        setErrorMsg('Please enter your Company Name.');
        return;
      }
      if (!companyAddress.trim()) {
        setErrorMsg('Please enter your Company Address.');
        return;
      }
    } else if (role === 'admin') {
      if (!employeeId.trim()) {
        setErrorMsg('Please enter your Employee ID.');
        return;
      }
    }

    try {
      const response = await authService.register({
        fullName: role === 'owner' ? ownerName : fullName,
        mobile: mobileNumber,
        email: email,
        password: password,
        role: role.toUpperCase(),
        drivingLicence: role === 'driver' ? drivingLicence : undefined,
        truckNumber: role === 'driver' ? truckNumber : undefined,
        vehicleType: role === 'driver' ? vehicleType : undefined,
        ownerName: role === 'owner' ? ownerName : undefined,
        companyName: role === 'owner' ? companyName : undefined,
        gstNumber: role === 'owner' ? gstNumber : undefined,
        companyAddress: role === 'owner' ? companyAddress : undefined,
        employeeId: role === 'admin' ? employeeId : undefined
      });

      const registeredUser = response.user || {};
      const registeredRole = (registeredUser.role || role).toLowerCase();

      // Clear any previous session so a fresh login never shows an old user's name
      localStorage.removeItem('cargolink_owner_user');
      localStorage.removeItem('cargolink_admin_user');
      localStorage.removeItem('cargolink_driver_user');
      localStorage.removeItem('cargolink_driver_profile');

      const userData = {
        name: nameToValidate,
        fullName: nameToValidate,
        email: email,
        phone: mobileNumber,
        role: registeredRole,
        isLoggedIn: true,
        rememberMe: true,
        loginTime: new Date().toISOString(),
        user: registeredUser
      };

      localStorage.setItem('cargolink_user', JSON.stringify(userData));
      if (role === 'owner') {
        localStorage.setItem('cargolink_owner_user', JSON.stringify({
          ...userData,
          ownerName: nameToValidate,
          companyName,
          gstNumber,
          companyAddress
        }));
      } else if (role === 'admin') {
        localStorage.setItem('cargolink_admin_user', JSON.stringify({
          ...userData,
          name: nameToValidate,
          fullName: nameToValidate,
          employeeId: employeeId || '',
          email: email
        }));
      } else {
        localStorage.setItem('cargolink_driver_user', JSON.stringify({
          ...userData,
          fullName: nameToValidate
        }));
      }

    setSuccessMsg(`Account registered successfully as ${role.toUpperCase()}! Redirecting...`);

    setTimeout(() => {
      if (typeof onNext === 'function') {
        onNext(userData);
      }
    }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="app-screen animate-slide-up" style={{ display: 'flex', flexDirection: 'column' }}>

      <div className="screen-scroll-area">
        <div style={{ padding: '1.5rem 1.25rem 3.5rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '18px',
              backgroundColor: '#FDF6F0', color: 'var(--primary-brown)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(139,94,60,0.12)', marginBottom: '0.4rem'
            }}>
              <Truck size={26} />
            </div>
            <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.4rem', margin: '0 0 2px 0' }}>
              CargoLink AI
            </h2>
            <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', opacity: 0.7, margin: 0 }}>
              {mode === 'login' ? 'Sign in to access your portal' : `${role.toUpperCase()} Registration`}
            </p>
          </div>

          {/* Role Selection Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.72rem', display: 'block', marginBottom: '6px', textAlign: 'center' }}>
              SELECT USER ROLE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'driver', label: 'Driver', icon: <Truck size={15} /> },
                { id: 'owner', label: 'Owner', icon: <Building size={15} /> },
                { id: 'admin', label: 'Admin', icon: <ShieldCheck size={15} /> },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setRole(r.id); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    padding: '8px', borderRadius: '12px', border: '1.5px solid',
                    borderColor: role === r.id ? 'var(--primary-brown)' : 'rgba(139,94,60,0.2)',
                    backgroundColor: role === r.id ? 'var(--primary-brown)' : 'var(--white)',
                    color: role === r.id ? 'white' : 'var(--text-dark-brown)',
                    fontFamily: 'var(--font-poppins)', fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: role === r.id ? '0 3px 10px rgba(139,94,60,0.2)' : 'none'
                  }}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex', backgroundColor: '#EDE8DF', borderRadius: '14px',
            padding: '3px', marginBottom: '1.25rem'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: '12px',
                fontFamily: 'var(--font-poppins)', fontSize: '0.85rem', fontWeight: 600,
                backgroundColor: mode === 'login' ? 'var(--white)' : 'transparent',
                color: mode === 'login' ? 'var(--primary-brown)' : 'var(--text-dark-brown)',
                cursor: 'pointer', boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}>
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: '12px',
                fontFamily: 'var(--font-poppins)', fontSize: '0.85rem', fontWeight: 600,
                backgroundColor: mode === 'register' ? 'var(--white)' : 'transparent',
                color: mode === 'register' ? 'var(--primary-brown)' : 'var(--text-dark-brown)',
                cursor: 'pointer', boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}>
              Register ({role.charAt(0).toUpperCase() + role.slice(1)})
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div style={{
              backgroundColor: '#FFEBEE', color: '#C62828', padding: '9px 12px',
              borderRadius: '12px', fontSize: '0.78rem', marginBottom: '1rem',
              fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '9px 12px',
              borderRadius: '12px', fontSize: '0.78rem', marginBottom: '1rem',
              fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          {/* ═══════════════════════════════════════════
             1. UNIFIED LOGIN FORM
             ═══════════════════════════════════════════ */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: 'var(--primary-brown)' }} />
                  <input
                    className="input-premium"
                    style={{ paddingLeft: '38px' }}
                    placeholder="driver@cargolink.ai or 9876543210"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: 'var(--primary-brown)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-premium"
                    style={{ paddingLeft: '38px', paddingRight: '40px' }}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-poppins)', color: 'var(--text-dark-brown)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--primary-brown)', cursor: 'pointer' }}
                  />
                  Remember Me
                </label>
                <span
                  onClick={() => alert('Password reset instructions have been sent to your email/mobile!')}
                  style={{ fontSize: '0.78rem', color: 'var(--primary-brown)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="btn-brown" style={{ marginTop: '0.5rem' }}>
                Sign In
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', fontFamily: 'var(--font-poppins)', color: 'var(--text-dark-brown)' }}>
                Don't have an account?{' '}
                <span onClick={() => { setMode('register'); setErrorMsg(''); }} style={{ color: 'var(--primary-brown)', fontWeight: 700, cursor: 'pointer' }}>
                  Register now
                </span>
              </div>
            </form>
          ) : (
            /* ═══════════════════════════════════════════
               2. ROLE-SPECIFIC REGISTRATION FORMS
               ═══════════════════════════════════════════ */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* ── DRIVER REGISTRATION ── */}
              {role === 'driver' && (
                <>
                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="98765 43210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="email" placeholder="john@cargolink.ai" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Driving Licence Number *</label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="TN 11 20180042341" value={drivingLicence} onChange={e => setDrivingLicence(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Truck Number *</label>
                    <div style={{ position: 'relative' }}>
                      <Truck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="TN 11 AB 1234" value={truckNumber} onChange={e => setTruckNumber(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Vehicle Type *</label>
                    <select className="input-premium" style={{ padding: '0.75rem 1rem' }} value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                      <option value="Mini Truck">Mini Truck</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Container">Container</option>
                      <option value="Trailer">Trailer</option>
                      <option value="Lorry">Lorry</option>
                    </select>
                  </div>
                </>
              )}

              {/* ── OWNER REGISTRATION ── */}
              {role === 'owner' && (
                <>
                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Owner Name *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="Rajesh Kumar" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Company Name *</label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="ABC Logistics Pvt Ltd" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="98765 43210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="email" placeholder="owner@abclogistics.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>GST Number (Optional)</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="33AAAAA0000A1Z5" value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Company Address *</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="100 Feet Road, Guindy, Chennai" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {/* ── ADMIN REGISTRATION ── */}
              {role === 'admin' && (
                <>
                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="Suresh Admin" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Employee ID *</label>
                    <div style={{ position: 'relative' }}>
                      <BadgeCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="EMP-2024-99" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="email" placeholder="admin@cargolink.ai" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} placeholder="98765 43210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.75rem' }}>Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
                      <input className="input-premium" style={{ paddingLeft: '38px', padding: '0.75rem 0.75rem 0.75rem 38px' }} type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn-brown" style={{ marginTop: '0.75rem' }}>
                Register as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', fontFamily: 'var(--font-poppins)', color: 'var(--text-dark-brown)' }}>
                Already have an account?{' '}
                <span onClick={() => { setMode('login'); setErrorMsg(''); }} style={{ color: 'var(--primary-brown)', fontWeight: 700, cursor: 'pointer' }}>
                  Sign In
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
