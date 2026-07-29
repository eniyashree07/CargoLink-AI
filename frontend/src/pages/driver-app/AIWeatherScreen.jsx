import React from 'react';
import { ArrowLeft, CloudRain, Sun, Wind, Eye, ShieldAlert, AlertTriangle } from 'lucide-react';

const AIWeatherScreen = ({ onBack }) => {
  return (
    <div className="app-screen animate-slide-in">
      <div className="screen-header">
        <button onClick={onBack} style={{ background: 'var(--bg-warm)', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <div>
          <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Weather Information</h2>
          <p className="text-poppins text-brown" style={{ fontSize: '0.72rem', margin: 0, opacity: 0.6 }}>AI Climate Radar & Route Hazards</p>
        </div>
      </div>

      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          <div className="premium-card" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="text-poppins" style={{ fontSize: '0.8rem', opacity: 0.8 }}>Current Route Location</span>
                <h2 className="text-poppins font-bold" style={{ fontSize: '1.5rem', margin: '2px 0 6px 0' }}>28°C · Clear Sky</h2>
                <p className="text-poppins" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.85 }}>Visibility: 8.5 KM · Humidity: 62% · Wind: 14 km/h</p>
              </div>
              <Sun size={42} color="#FFD54F" />
            </div>
          </div>

          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Ahead on Route (Next 3 Hours)</h4>

          <div className="premium-card" style={{ borderLeft: '4px solid #1565C0', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
              <CloudRain size={20} color="#1565C0" />
              <h4 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.9rem' }}>Heavy Rain Warning — Near Dindigul</h4>
            </div>
            <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', opacity: 0.7, margin: '0 0 10px 0' }}>
              Heavy downpour expected from 08:30 PM. Recommended maximum safe speed: 45 km/h.
            </p>
            <span style={{ backgroundColor: '#E3F2FD', color: '#1565C0', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, fontFamily: 'var(--font-poppins)', display: 'inline-block' }}>
              💡 AI Tip: Ensure wipers and fog lamps are switched on
            </span>
          </div>

          <div className="premium-card" style={{ borderLeft: '4px solid #FF8F00' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
              <Wind size={20} color="#FF8F00" />
              <h4 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.9rem' }}>Crosswind Alert — Krishnagiri Gap</h4>
            </div>
            <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', opacity: 0.7, margin: 0 }}>
              Strong gusty winds up to 38 km/h reported on high bridges. Maintain firm steering control.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIWeatherScreen;
