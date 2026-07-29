import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, Navigation, MapPin } from 'lucide-react';

const AITrafficScreen = ({ onBack, onSelectNav }) => {
  const [applied, setApplied] = useState(false);

  const handleApplyDetour = () => {
    setApplied(true);
    setTimeout(() => {
      if (onSelectNav) onSelectNav();
      else onBack();
    }, 400);
  };

  return (
    <div className="app-screen animate-slide-in">
      <div className="screen-header">
        <button onClick={onBack} style={{ background: 'var(--bg-warm)', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <div>
          <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Live Traffic Intelligence</h2>
          <p className="text-poppins text-brown" style={{ fontSize: '0.72rem', margin: 0, opacity: 0.6 }}>AI Road Hazard & Congestion Monitoring</p>
        </div>
      </div>

      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          {applied && (
            <div className="animate-fade-in" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '10px 14px', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Detour Applied! Opening Live Navigation...
            </div>
          )}

          <div className="premium-card" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#FF8F00', color: 'white', padding: '10px', borderRadius: '14px', display: 'flex' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-poppins font-bold" style={{ color: '#E65100', margin: '0 0 2px 0', fontSize: '0.95rem' }}>Traffic Delay Ahead</h4>
                <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.8 }}>
                  45 min delay near Krishnagiri Toll Plaza due to road maintenance work.
                </p>
              </div>
            </div>
          </div>

          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>AI Suggested Avoidance</h4>

          <div className="premium-card" style={{ border: '1.5px solid var(--primary-brown)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem' }}>Bypass via Rayakottai Road</span>
              <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>Save 35 Mins</span>
            </div>
            <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: '0 0 12px 0', opacity: 0.7 }}>
              Clear 2-lane highway with minimal heavy truck congestion.
            </p>
            <button className="btn-brown" onClick={handleApplyDetour} style={{ padding: '0.85rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Navigation size={18} /> Apply AI Traffic Detour & Navigate
            </button>
          </div>

          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Live Sector Traffic Status</h4>
          {[
            { location: 'Coimbatore ➔ Salem Sector', status: 'Clear & Smooth', speed: '65 km/h', color: '#2E7D32' },
            { location: 'Salem ➔ Krishnagiri Sector', status: 'Heavy Congestion', speed: '15 km/h', color: '#D32F2F' },
            { location: 'Krishnagiri ➔ Chennai Sector', status: 'Moderate Traffic', speed: '45 km/h', color: '#FF8F00' },
          ].map((sec, i) => (
            <div key={i} className="premium-card" style={{ padding: '0.85rem 1rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="text-poppins font-bold text-brown" style={{ margin: '0 0 2px 0', fontSize: '0.85rem' }}>{sec.location}</p>
                <p className="text-poppins" style={{ margin: 0, fontSize: '0.72rem', color: sec.color, fontWeight: 600 }}>● {sec.status}</p>
              </div>
              <span className="text-poppins font-bold text-brown" style={{ fontSize: '0.82rem', opacity: 0.8 }}>{sec.speed}</span>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default AITrafficScreen;
