import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation2, AlertTriangle, PauseCircle, CheckCircle2 } from 'lucide-react';

const NavigationScreen = ({ onBack, onComplete }) => {
  const [tripPaused, setTripPaused] = useState(false);
  const [eta, setEta] = useState('2h 28m');
  const [distance, setDistance] = useState('118.4 KM');
  const [speed, setSpeed] = useState(62);

  // Live speed simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(55 + Math.random() * 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-screen" style={{ position: 'relative', backgroundColor: '#F4F1ED' }}>

      {/* Full Screen Interactive Map Simulation */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(180deg, #C8DCC8 0%, #D8E8D0 20%, #E8EFDC 40%, #F0EBD8 65%, #EDE0C8 85%, #E0D4B8 100%)',
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 850" preserveAspectRatio="xMidYMid slice">
            <rect x="0" y="0" width="400" height="850" fill="#D4E8D4" />
            <rect x="280" y="100" width="100" height="80" rx="4" fill="#B8D4B8" opacity="0.7" />
            <rect x="10" y="200" width="80" height="60" rx="4" fill="#C0D8C0" opacity="0.6" />
            <rect x="150" y="500" width="120" height="90" rx="4" fill="#B8D4B8" opacity="0.5" />
            {[[30,150,60,40],[110,150,50,40],[200,140,70,50],[295,160,80,40],[30,320,55,35],[100,310,70,45],[200,300,60,50],[290,305,80,40],[30,480,60,40],[110,470,50,45],[190,465,80,50],[300,470,75,40]].map(([x,y,w,h],i)=>(
              <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#E8E0D0" stroke="#D4C8B4" strokeWidth="0.5" />
            ))}
            {/* Highway Route */}
            <path d="M 200 900 Q 210 700 195 550 Q 185 420 200 300 Q 215 180 205 80" stroke="#C8B898" strokeWidth="22" fill="none" strokeLinecap="round" />
            <path d="M 200 900 Q 210 700 195 550 Q 185 420 200 300 Q 215 180 205 80" stroke="white" strokeWidth="18" fill="none" strokeLinecap="round" />
            {/* Active Route Highlight */}
            <path d="M 200 600 Q 195 500 200 400 Q 210 280 205 180" stroke="#8B5E3C" strokeWidth="6" fill="none" strokeLinecap="round" strokeOpacity="0.9" />

            {/* Markers */}
            <circle cx="205" cy="200" r="14" fill="#4CAF50" />
            <circle cx="205" cy="200" r="6" fill="white" />
            <circle cx="200" cy="80" r="14" fill="#E65100" />
            <circle cx="200" cy="80" r="6" fill="white" />

            {/* Truck Location */}
            <circle cx="197" cy="590" r="20" fill="white" stroke="#8B5E3C" strokeWidth="3" />
            <text x="197" y="596" textAnchor="middle" fontSize="16" fill="#8B5E3C">🚛</text>
          </svg>
        </div>
      </div>

      {/* Top Navigation Bar HUD */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '1.75rem 1.25rem 1rem',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onBack} style={{
            background: 'var(--white)', border: 'none', padding: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <ArrowLeft size={20} color="var(--text-dark-brown)" />
          </button>
          <div style={{
            flex: 1, backgroundColor: 'var(--white)', borderRadius: '16px',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)'
          }}>
            <Navigation2 size={20} color="var(--primary-brown)" />
            <div>
              <p className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.85rem' }}>NH 44 — Express Route</p>
              <p className="text-poppins text-brown" style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7 }}>Continue straight for 28 KM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Speedometer Badge */}
      <div style={{
        position: 'absolute', top: '48%', right: '16px', zIndex: 10,
        backgroundColor: 'var(--white)', borderRadius: '50%', width: '56px', height: '56px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)', border: '2.5px solid var(--primary-brown)'
      }}>
        <span className="text-poppins font-bold text-brown" style={{ fontSize: '1rem', lineHeight: 1 }}>{speed}</span>
        <span className="text-poppins text-brown" style={{ fontSize: '0.55rem', opacity: 0.7 }}>km/h</span>
      </div>

      {/* Bottom Floating Control Panel */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: 'var(--white)',
        borderTopLeftRadius: '26px', borderTopRightRadius: '26px',
        padding: '1.25rem',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>ETA</p>
            <p className="text-poppins font-bold text-brown" style={{ fontSize: '1.25rem', margin: 0 }}>{eta}</p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#F0EAE3' }} />
          <div style={{ textAlign: 'center' }}>
            <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Remaining</p>
            <p className="text-poppins font-bold text-brown" style={{ fontSize: '1.25rem', margin: 0 }}>{distance}</p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#F0EAE3' }} />
          <div style={{ textAlign: 'center' }}>
            <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Traffic</p>
            <p className="text-poppins font-bold" style={{ fontSize: '0.9rem', margin: 0, color: '#2E7D32' }}>Clear</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-beige"
            onClick={() => setTripPaused(!tripPaused)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--primary-brown)', padding: '0.8rem' }}
          >
            <PauseCircle size={18} />
            {tripPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            className="btn-brown"
            onClick={onComplete}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.8rem' }}
          >
            <CheckCircle2 size={18} />
            Complete
          </button>
        </div>
      </div>

    </div>
  );
};

export default NavigationScreen;
