import React from 'react';
import { ArrowLeft, Fuel, TrendingUp, Zap, CheckCircle2, Leaf } from 'lucide-react';

const AIFuelScreen = ({ onBack }) => {
  return (
    <div className="app-screen animate-slide-in">
      <div className="screen-header">
        <button onClick={onBack} style={{ background: 'var(--bg-warm)', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <div>
          <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Fuel Saving Recommendation</h2>
          <p className="text-poppins text-brown" style={{ fontSize: '0.72rem', margin: 0, opacity: 0.6 }}>AI Engine & Eco-Cruising Coaching</p>
        </div>
      </div>

      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          <div className="premium-card" style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="text-poppins" style={{ fontSize: '0.78rem', opacity: 0.85 }}>Trip Fuel Savings</span>
                <h2 className="text-poppins font-bold" style={{ fontSize: '1.6rem', margin: '2px 0 4px 0' }}>₹1,420 Saved</h2>
                <p className="text-poppins" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.85 }}>Estimated 14.2 Liters saved on current route</p>
              </div>
              <Leaf size={42} color="#81C784" />
            </div>
          </div>

          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>AI Eco Recommendations</h4>

          {[
            { title: 'Maintain Constant Cruising Speed', desc: 'Maintain 55-60 km/h on NH 44 for maximum fuel efficiency.', gain: '+1.8 km/L' },
            { title: 'Minimize Idle Time at Toll Plazas', desc: 'Use FASTag express lanes to reduce idling fuel burn.', gain: '+0.5 L saved' },
            { title: 'Optimal Gear Shifting Point', desc: 'Shift up at 1400 RPM for heavy loaded 12-wheelers.', gain: '+8% efficiency' },
            { title: 'Tire Pressure Optimization', desc: 'Maintain 110 PSI front & rear for 4% fuel friction reduction.', gain: 'Optimal' }
          ].map((item, i) => (
            <div key={i} className="premium-card" style={{ padding: '1rem', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h5 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.88rem' }}>{item.title}</h5>
                <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', fontWeight: 600 }}>{item.gain}</span>
              </div>
              <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.7 }}>{item.desc}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default AIFuelScreen;
