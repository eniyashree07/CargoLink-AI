import React, { useState } from 'react';
import { ArrowLeft, Navigation, Compass, CheckCircle2, MapPin, Zap, ShieldCheck, Clock, Fuel } from 'lucide-react';

const AIRouteScreen = ({ onBack, onSelectNav }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleStartNav = (routeName) => {
    setSelectedRoute(routeName);
    setTimeout(() => {
      if (typeof onSelectNav === 'function') {
        onSelectNav();
      }
    }, 400);
  };

  const routeOptions = [
    {
      id: 'nh44',
      name: 'via NH 44 (Express Highway)',
      badge: 'AI RECOMMENDED',
      isRecommended: true,
      tag: 'Fastest Route',
      tagBg: '#E8F5E9',
      tagColor: '#2E7D32',
      distance: '480 KM',
      eta: '7 hrs 15 mins',
      remainingDistance: '480 KM remaining',
      traffic: 'Light Traffic (Smooth Flow)',
      trafficColor: '#2E7D32',
      tolls: '₹650',
      fuelCost: '₹3,420 (Eco Shift Active)',
      savings: 'Saves 45 mins vs normal path'
    },
    {
      id: 'sh15',
      name: 'via SH 15 (Scenic Eco Bypass)',
      badge: 'ALTERNATE 1',
      isRecommended: false,
      tag: 'Fuel Saver',
      tagBg: '#E3F2FD',
      tagColor: '#1565C0',
      distance: '495 KM',
      eta: '8 hrs 00 mins',
      remainingDistance: '495 KM remaining',
      traffic: 'Moderate Traffic',
      trafficColor: '#FF8F00',
      tolls: '₹210',
      fuelCost: '₹3,150',
      savings: 'Saves ₹440 Toll fees'
    },
    {
      id: 'nh32',
      name: 'via NH 32 (Coastal Highway Path)',
      badge: 'ALTERNATE 2',
      isRecommended: false,
      tag: 'Heavy Vehicle Lane',
      tagBg: '#FFF3E0',
      tagColor: '#E65100',
      distance: '520 KM',
      eta: '8 hrs 40 mins',
      remainingDistance: '520 KM remaining',
      traffic: 'Smooth Coastal Corridor',
      trafficColor: '#2E7D32',
      tolls: '₹380',
      fuelCost: '₹3,600',
      savings: 'No mountain gradient'
    }
  ];

  return (
    <div className="app-screen animate-slide-in">

      {/* Header */}
      <div className="screen-header">
        <button onClick={onBack} style={{ background: 'var(--bg-warm)', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <div>
          <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Fastest Route & AI Navigation</h2>
          <p className="text-poppins text-brown" style={{ fontSize: '0.72rem', margin: 0, opacity: 0.6 }}>Real-time Smart Load Pathing</p>
        </div>
      </div>

      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          {selectedRoute && (
            <div className="animate-fade-in" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '10px 14px', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> Starting Navigation via {selectedRoute}...
            </div>
          )}

          {/* Map Banner Card */}
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', marginBottom: '1.25rem' }}>
            <div style={{
              height: '170px',
              backgroundColor: '#E0D6C8',
              backgroundImage: 'radial-gradient(#8B5E3C 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ backgroundColor: 'var(--white)', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="var(--primary-brown)" />
                <span className="text-poppins font-bold text-brown" style={{ fontSize: '0.82rem' }}>NH 44 Express (Fastest AI Route)</span>
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '16px', backgroundColor: 'rgba(255,255,255,0.92)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-poppins)', color: 'var(--text-dark-brown)' }}>
                📍 Coimbatore ➔ 🏁 Chennai
              </div>
            </div>
          </div>

          {/* Top Recommended Route Card */}
          <div className="premium-card" style={{ border: '2px solid var(--primary-brown)', background: 'linear-gradient(135deg, #FFFFFF 70%, #FDF6F0 100%)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--primary-brown)', color: 'white', fontSize: '0.68rem', padding: '2px 10px', borderRadius: '10px', fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                AI RECOMMENDED ROUTE
              </span>
              <span className="text-poppins font-bold" style={{ color: '#2E7D32', fontSize: '0.85rem' }}>✓ Fastest Route</span>
            </div>

            <h3 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>
              via NH 44 (Express Route)
            </h3>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', backgroundColor: 'var(--bg-warm)', padding: '10px', borderRadius: '12px' }}>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Estimated Time</p>
                <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem', margin: 0 }}>⏱ 7 hrs 15 mins</p>
              </div>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Remaining Distance</p>
                <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem', margin: 0 }}>🛣 480 KM</p>
              </div>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Traffic Level</p>
                <p className="text-poppins font-bold" style={{ fontSize: '0.82rem', margin: 0, color: '#2E7D32' }}>🟢 Smooth / Light Traffic</p>
              </div>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Toll Cost</p>
                <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>💳 ₹650 (FASTag)</p>
              </div>
            </div>

            <button className="btn-brown" onClick={() => handleStartNav('NH 44 Express')} style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Navigation size={18} /> Start Navigation
            </button>
          </div>

          {/* Detailed Route Comparison Table */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Route Comparison Matrix
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
            {routeOptions.map((rt) => (
              <div key={rt.id} className="premium-card" style={{ marginBottom: 0, border: rt.isRecommended ? '1.5px solid rgba(139,94,60,0.3)' : '1px solid rgba(139,94,60,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ backgroundColor: rt.isRecommended ? 'var(--primary-brown)' : 'var(--bg-warm)', color: rt.isRecommended ? 'white' : 'var(--text-dark-brown)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 600, fontFamily: 'var(--font-poppins)' }}>
                    {rt.badge}
                  </span>
                  <span style={{ backgroundColor: rt.tagBg, color: rt.tagColor, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600, fontFamily: 'var(--font-poppins)' }}>
                    {rt.tag}
                  </span>
                </div>

                <h5 className="text-poppins font-bold text-brown" style={{ margin: '0 0 6px 0', fontSize: '0.92rem' }}>{rt.name}</h5>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px', fontSize: '0.75rem', fontFamily: 'var(--font-poppins)' }}>
                  <div>
                    <span style={{ opacity: 0.6, display: 'block', fontSize: '0.68rem' }}>EST. TIME</span>
                    <strong style={{ color: 'var(--text-dark-brown)' }}>{rt.eta}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: 'block', fontSize: '0.68rem' }}>REMAINING</span>
                    <strong style={{ color: 'var(--text-dark-brown)' }}>{rt.distance}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6, display: 'block', fontSize: '0.68rem' }}>TRAFFIC</span>
                    <strong style={{ color: rt.trafficColor }}>{rt.traffic.split(' ')[0]}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #EDE8DF' }}>
                  <span className="text-poppins" style={{ fontSize: '0.72rem', opacity: 0.75 }}>Toll: {rt.tolls} · Fuel: {rt.fuelCost}</span>
                  <button
                    onClick={() => handleStartNav(rt.name)}
                    style={{
                      backgroundColor: rt.isRecommended ? 'var(--primary-brown)' : 'var(--secondary-beige)',
                      color: rt.isRecommended ? 'white' : 'var(--text-dark-brown)',
                      border: 'none', borderRadius: '10px', padding: '6px 12px',
                      fontSize: '0.75rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Start Navigation
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIRouteScreen;
