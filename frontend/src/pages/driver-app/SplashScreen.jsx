import React from 'react';
import { Truck } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  return (
    <div className="app-screen flex-center animate-fade-in" style={{ backgroundColor: 'var(--bg-warm)', padding: '2rem' }}>
      <div style={{ textAlign: 'center', width: '100%' }}>
        
        {/* Logo Icon */}
        <div style={{ 
          width: '100px', 
          height: '100px', 
          backgroundColor: 'var(--white)', 
          borderRadius: '25px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem auto',
          boxShadow: '0 10px 30px rgba(139, 94, 60, 0.15)',
          animation: 'slideUp 0.8s ease-out'
        }}>
          <Truck size={48} color="var(--primary-brown)" />
        </div>

        {/* Brand Name */}
        <h1 className="text-poppins font-bold text-brown" style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'slideUp 0.9s ease-out' }}>
          CargoLink AI
        </h1>

        {/* Tagline */}
        <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.95rem', opacity: 0.7, maxWidth: '280px', margin: '0 auto 3rem auto', animation: 'slideUp 1s ease-out' }}>
          AI Powered Smart Return Load Matching Platform
        </p>

        {/* Loading Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px',
          animation: 'slideUp 1.1s ease-out'
        }}>
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--primary-brown)',
                borderRadius: '50%',
                animation: `bounce 1.4s infinite ease-in-out both`,
                animationDelay: `${i * 0.16}s`
              }}
            />
          ))}
        </div>
        
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>

      </div>
    </div>
  );
};

export default SplashScreen;
