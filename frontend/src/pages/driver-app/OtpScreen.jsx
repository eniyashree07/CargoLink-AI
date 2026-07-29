import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const OtpScreen = ({ onVerify, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take the last digit if multiple
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join('').length === 4) {
      onVerify();
    }
  };

  return (
    <div className="app-screen animate-slide-up" style={{ padding: '1.5rem', justifyContent: 'flex-start' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <button 
          onClick={onBack}
          style={{ 
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
          }}
        >
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
      </div>

      <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
        Verification Code
      </h2>
      <p className="text-poppins text-brown" style={{ opacity: 0.7, marginBottom: '2.5rem', lineHeight: '1.5' }}>
        We have sent the verification code to <br/> <span className="font-medium">+91 98765 43210</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '2.5rem', justifyContent: 'space-between' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="input-premium"
              style={{
                width: '65px',
                height: '65px',
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                padding: '0',
                borderRadius: '16px'
              }}
            />
          ))}
        </div>

        <button type="submit" className="btn-brown" disabled={otp.join('').length < 4} style={{ opacity: otp.join('').length < 4 ? 0.7 : 1 }}>
          Verify Now
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p className="text-poppins text-brown" style={{ fontSize: '0.9rem' }}>
          Didn't receive code?{' '}
          <span className="font-bold text-primary" style={{ cursor: 'pointer' }}>Resend</span>
        </p>
      </div>

    </div>
  );
};

export default OtpScreen;
