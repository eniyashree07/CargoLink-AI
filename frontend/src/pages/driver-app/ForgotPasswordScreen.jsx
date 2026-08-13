import React, { useState, useRef } from 'react';
import { ArrowLeft, Smartphone, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPasswordScreen = ({ onBack }) => {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'password'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef([]);

  const validateMobile = (val) => /^\d{10}$/.test(val.replace(/\D/g, ''));

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!validateMobile(mobile)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword(mobile);
      setDevOtpHint(response.devOtp || '');
      setOtp(Array(6).fill(''));
      setStep('otp');
      setSuccessMsg('OTP sent successfully to your mobile number.');
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 50);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(mobile);
      setDevOtpHint(response.devOtp || '');
      setOtp(Array(6).fill(''));
      setSuccessMsg('A new OTP has been sent to your mobile number.');
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 50);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length > 1) {
      const newOtp = Array(6).fill('');
      for (let i = 0; i < 6 && i < digitsOnly.length; i++) {
        newOtp[i] = digitsOnly[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(digitsOnly.length, 5);
      if (otpRefs.current[nextIndex]) otpRefs.current[nextIndex].focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digitsOnly;
    setOtp(newOtp);

    if (digitsOnly && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.verifyOtp(mobile, otpValue);
      setResetToken(response.resetToken);
      setNewPassword('');
      setConfirmNewPassword('');
      setStep('password');
      setSuccessMsg('OTP verified successfully. Please set your new password.');
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Password and Confirm Password must match.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword(resetToken, newPassword);
      setSuccessMsg('Password reset successfully! Redirecting to Sign In...');
      setTimeout(() => {
        if (typeof onBack === 'function') onBack();
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('phone');
    setMobile('');
    setOtp(Array(6).fill(''));
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    setDevOtpHint('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const headerStyle = {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    marginRight: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--white)',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(139, 94, 60, 0.08)'
  };

  const stepTitles = {
    phone: 'Forgot Password?',
    otp: 'Verification Code',
    password: 'Set New Password'
  };

  const stepSubtitle = {
    phone: 'Enter your registered mobile number. We will send a 6-digit OTP to reset your password.',
    otp: 'We have sent the 6-digit OTP to your mobile number.',
    password: 'Choose a strong new password for your account.'
  };

  return (
    <div className="app-screen animate-slide-up" style={{ padding: '1.5rem', justifyContent: 'flex-start' }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <button onClick={() => { resetFlow(); onBack(); }} style={headerStyle}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
      </div>

      <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        {stepTitles[step]}
      </h2>
      <p className="text-poppins text-brown" style={{ opacity: 0.7, marginBottom: '2rem', lineHeight: '1.5' }}>
        {stepSubtitle[step]}
      </p>

      {errorMsg && (
        <div style={{
          backgroundColor: '#FFEBEE', color: '#C62828', padding: '9px 12px',
          borderRadius: '12px', fontSize: '0.78rem', marginBottom: '1rem',
          fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <span>⚠</span> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{
          backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '9px 12px',
          borderRadius: '12px', fontSize: '0.78rem', marginBottom: '1rem',
          fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <span>✓</span> {successMsg}
        </div>
      )}

      {/* STEP 1: Phone */}
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
              Mobile Number
            </label>
            <div style={{ position: 'relative' }}>
              <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: 'var(--primary-brown)' }} />
              <input
                className="input-premium"
                style={{ paddingLeft: '38px' }}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>

          <button type="submit" className="btn-brown" disabled={isLoading}>
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={index === 0 ? 6 : 1}
                value={digit}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="input-premium"
                style={{
                  width: '48px',
                  height: '58px',
                  textAlign: 'center',
                  fontSize: '1.35rem',
                  fontWeight: '600',
                  padding: '0',
                  borderRadius: '16px'
                }}
              />
            ))}
          </div>

          {devOtpHint && (
            <div style={{
              backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '9px 12px',
              borderRadius: '12px', fontSize: '0.78rem', marginBottom: '1rem',
              fontFamily: 'var(--font-poppins)', fontWeight: 600, textAlign: 'center'
            }}>
              Demo OTP: <strong>{devOtpHint}</strong> (for testing)
            </div>
          )}

          <button type="submit" className="btn-brown" disabled={isLoading || otp.join('').length !== 6} style={{ opacity: otp.join('').length !== 6 ? 0.7 : 1 }}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {/* STEP 3: New Password */}
      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: 'var(--primary-brown)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-premium"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div>
            <label className="text-poppins font-medium text-brown" style={{ fontSize: '0.76rem', display: 'block', marginBottom: '4px' }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, color: 'var(--primary-brown)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-premium"
                style={{ paddingLeft: '38px' }}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-brown" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {step !== 'password' && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p className="text-poppins text-brown" style={{ fontSize: '0.85rem' }}>
            {step === 'otp' ? (
              <>Didn't receive code?{' '}
                <span className="font-bold text-primary" style={{ cursor: 'pointer' }} onClick={handleResend}>Resend</span>
              </>
            ) : (
              <>Remembered your password?{' '}
                <span className="font-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { resetFlow(); onBack(); }}>Sign In</span>
              </>
            )}
          </p>
        </div>
      )}

    </div>
  );
};

export default ForgotPasswordScreen;
