import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Phone, Navigation2, MapPin, Weight,
  Clock, Route, AlertTriangle, Truck, CheckCircle2, Check, Award, IndianRupee
} from 'lucide-react';
import BottomNav from './BottomNav';

const TripDetails = ({
  onBack, onOpenNav, onHome, onTrips, onNotifications, onProfile,
  sharedTripState, onUpdateTripState
}) => {
  const [sosPressed, setSosPressed] = useState(false);
  const [localSuccessMsg, setLocalSuccessMsg] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  // Local state with fallback
  const [tripState, setTripState] = useState(() => {
    if (sharedTripState) return sharedTripState;
    try {
      const saved = localStorage.getItem('cargolink_trip_status');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      status: 'In Progress', // 'In Progress' | 'Arrived at Destination' | 'Completed'
      progress: 76,
      arrivedTime: null,
      completedTime: null,
      duration: '6 hrs 15 mins',
      commission: '₹1,250'
    };
  });

  useEffect(() => {
    if (sharedTripState) {
      setTripState(sharedTripState);
    }
  }, [sharedTripState]);

  const updateState = (newFields) => {
    const updated = { ...tripState, ...newFields };
    setTripState(updated);
    try {
      localStorage.setItem('cargolink_trip_status', JSON.stringify(updated));
    } catch (e) {}
    if (typeof onUpdateTripState === 'function') {
      onUpdateTripState(updated);
    }
  };

  const handleArrivedAtDestination = () => {
    if (tripState.status !== 'In Progress') return;

    const nowStr = new Date().toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    setShowAnimation(true);
    setLocalSuccessMsg('Location reached successfully.');

    updateState({
      status: 'Arrived at Destination',
      progress: 100,
      arrivedTime: nowStr
    });

    setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
  };

  const handleCompleteTrip = () => {
    if (tripState.status === 'Completed') return;

    const nowStr = new Date().toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    setShowAnimation(true);
    setLocalSuccessMsg('Trip completed successfully.');

    updateState({
      status: 'Completed',
      progress: 100,
      completedTime: nowStr
    });

    setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
  };

  const handleSOS = () => {
    setSosPressed(true);
    setTimeout(() => setSosPressed(false), 3000);
  };

  return (
    <div className="app-screen animate-slide-up" style={{ backgroundColor: '#F4F1ED' }}>

      {/* Sticky Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: 'var(--white)',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        boxShadow: '0 4px 15px rgba(139, 94, 60, 0.06)',
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <button onClick={onBack} style={{
          background: 'var(--bg-warm)', border: 'none', padding: '8px',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(139, 94, 60, 0.08)'
        }}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <div>
          <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Trip Details</h2>
          <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.6 }}>Trip ID: CL-20240724-092</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            backgroundColor: tripState.status === 'Completed' ? '#E8F5E9' : tripState.status === 'Arrived at Destination' ? '#FFF3E0' : '#E3F2FD',
            color: tripState.status === 'Completed' ? '#2E7D32' : tripState.status === 'Arrived at Destination' ? '#E65100' : '#1565C0',
            padding: '4px 10px', borderRadius: '20px',
            fontSize: '0.75rem', fontFamily: 'var(--font-poppins)', fontWeight: 600
          }}>
            {tripState.status}
          </span>
        </div>
      </div>

      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          {/* Success Banner & Animation */}
          {localSuccessMsg && (
            <div className="animate-fade-in" style={{
              backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1.5px solid #A5D6A7',
              padding: '12px 16px', borderRadius: '16px', marginBottom: '1rem',
              fontFamily: 'var(--font-poppins)', fontWeight: 600, fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 4px 14px rgba(46,125,50,0.15)'
            }}>
              <CheckCircle2 size={22} className={showAnimation ? 'animate-bounce' : ''} />
              <span>{localSuccessMsg}</span>
            </div>
          )}

          {/* ── ARRIVAL & TRIP COMPLETION ACTIONS ── */}
          <div className="premium-card" style={{ border: '1.5px solid var(--primary-brown)', background: 'linear-gradient(135deg, #FFFFFF 70%, #FDF6F0 100%)', marginBottom: '1rem' }}>
            <h4 className="text-poppins font-bold text-brown" style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>
              Trip Status Management
            </h4>

            {tripState.status === 'In Progress' && (
              <div>
                <button
                  className="btn-brown"
                  onClick={handleArrivedAtDestination}
                  style={{
                    padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: 'var(--primary-brown)', color: 'white'
                  }}
                >
                  <MapPin size={18} /> Arrived at Destination
                </button>
              </div>
            )}

            {tripState.status === 'Arrived at Destination' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '6px 14px',
                  borderRadius: '12px', fontSize: '0.82rem', fontFamily: 'var(--font-poppins)', fontWeight: 700
                }}>
                  <Check size={16} /> Destination Reached ({tripState.arrivedTime || 'Just now'})
                </div>

                <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.7 }}>
                  Location reached successfully. Click below to finalize trip records.
                </p>

                <button
                  className="btn-brown"
                  onClick={handleCompleteTrip}
                  style={{
                    padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    backgroundColor: '#2E7D32', color: 'white'
                  }}
                >
                  <CheckCircle2 size={18} /> Complete Trip
                </button>
              </div>
            )}

            {tripState.status === 'Completed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '6px 14px',
                  borderRadius: '12px', fontSize: '0.85rem', fontFamily: 'var(--font-poppins)', fontWeight: 700,
                  width: 'fit-content'
                }}>
                  <CheckCircle2 size={18} /> Status: Completed
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px', backgroundColor: 'var(--bg-warm)', padding: '10px', borderRadius: '12px' }}>
                  <div>
                    <span className="text-poppins text-brown" style={{ fontSize: '0.68rem', opacity: 0.6, display: 'block' }}>COMPLETED TIME</span>
                    <strong className="text-poppins text-brown" style={{ fontSize: '0.78rem' }}>{tripState.completedTime || 'Today, 03:25 PM'}</strong>
                  </div>
                  <div>
                    <span className="text-poppins text-brown" style={{ fontSize: '0.68rem', opacity: 0.6, display: 'block' }}>TRIP DURATION</span>
                    <strong className="text-poppins text-brown" style={{ fontSize: '0.78rem' }}>{tripState.duration}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span className="text-poppins text-brown" style={{ fontSize: '0.68rem', opacity: 0.6, display: 'block' }}>THIS TRIP COMMISSION</span>
                    <strong className="text-poppins" style={{ fontSize: '1rem', color: '#2E7D32' }}>{tripState.commission}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trip Route Info */}
          <div className="premium-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '80px', height: '80px',
              background: 'linear-gradient(135deg, rgba(139,94,60,0.08), transparent)',
              borderBottomLeftRadius: '60px'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Pickup */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#E8F5E9', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <MapPin size={18} color="#2E7D32" fill="#2E7D32" />
                </div>
                <div>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.72rem', margin: '0 0 2px 0', opacity: 0.6 }}>PICKUP LOCATION</p>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '1rem', margin: '0 0 2px 0' }}>Coimbatore SIDCO Estate</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.6 }}>Peelamedu, Coimbatore - 641004</p>
                </div>
              </div>

              {/* Dashed line */}
              <div style={{ marginLeft: '18px', borderLeft: '2px dashed var(--secondary-beige)', height: '20px' }} />

              {/* Delivery */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#FFF3E0', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <MapPin size={18} color="#E65100" fill="#E65100" />
                </div>
                <div>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.72rem', margin: '0 0 2px 0', opacity: 0.6 }}>DELIVERY LOCATION</p>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '1rem', margin: '0 0 2px 0' }}>Chennai Koyambedu Market</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.6 }}>Koyambedu, Chennai - 600092</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
            {[
              { icon: <Weight size={18} color="#8B5E3C" />, bg: '#FDF6F0', label: 'Load Weight', value: '18 Tons', sub: 'Industrial Goods' },
              { icon: <Clock size={18} color="#1565C0" />, bg: '#E3F2FD', label: 'ETA', value: tripState.status === 'In Progress' ? '2h 30m' : 'Arrived', sub: 'Arrived 03:25 PM' },
              { icon: <Route size={18} color="#7B1FA2" />, bg: '#F3E5F5', label: 'Remaining', value: tripState.status === 'In Progress' ? '120 KM' : '0 KM', sub: 'Of 510 KM total' },
              { icon: <Truck size={18} color="#00695C" />, bg: '#E0F2F1', label: 'Vehicle', value: 'TN 11 AB 1234', sub: '12-Wheeler' },
            ].map((item, i) => (
              <div key={i} className="premium-card" style={{ padding: '0.9rem', marginBottom: 0 }}>
                <div style={{ backgroundColor: item.bg, padding: '7px', borderRadius: '10px', display: 'inline-flex', marginBottom: '8px' }}>
                  {item.icon}
                </div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>{item.label}</p>
                <p className="text-poppins font-bold text-brown" style={{ fontSize: '1rem', margin: '0 0 2px 0' }}>{item.value}</p>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: 0, opacity: 0.55 }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Trip Progress */}
          <div className="premium-card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.9rem' }}>Trip Completion</p>
              <p className="text-poppins font-bold text-primary" style={{ margin: 0, fontSize: '0.9rem' }}>{tripState.progress}%</p>
            </div>
            <div style={{ height: '8px', backgroundColor: '#F0EAE3', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${tripState.progress}%`, height: '100%', borderRadius: '4px',
                background: 'linear-gradient(90deg, #8B5E3C, #2E7D32)',
                transition: 'width 0.6s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span className="text-poppins text-brown" style={{ fontSize: '0.72rem', opacity: 0.6 }}>Coimbatore</span>
              <span className="text-poppins text-brown" style={{ fontSize: '0.72rem', opacity: 0.6 }}>{tripState.progress === 100 ? '510 KM completed' : '390 KM completed'}</span>
              <span className="text-poppins text-brown" style={{ fontSize: '0.72rem', opacity: 0.6 }}>Chennai</span>
            </div>
          </div>

          {/* Map Preview */}
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden', height: '190px', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(180deg, #E8F4E9 0%, #D4EAD6 30%, #F5F0E8 60%, #EDE8DC 100%)',
                position: 'relative', overflow: 'hidden'
              }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path d="M 20 100 Q 100 60 200 80 Q 280 95 350 70" stroke="#C8B8A2" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M 20 100 Q 100 60 200 80 Q 280 95 350 70" stroke="white" strokeWidth="3" fill="none" strokeDasharray="12,10" strokeLinecap="round" />
                  <circle cx="160" cy="95" r="10" fill="#8B5E3C" opacity="0.9" />
                  <circle cx="160" cy="95" r="5" fill="white" />
                  <circle cx="320" cy="75" r="10" fill="#E65100" opacity="0.9" />
                  <circle cx="320" cy="75" r="5" fill="white" />
                  <path d="M 160 95 Q 240 70 320 75" stroke="#8B5E3C" strokeWidth="3" fill="none" strokeDasharray="6,4" />
                </svg>
                <div style={{ position: 'absolute', top: '60px', left: '130px', backgroundColor: 'white', borderRadius: '6px', padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', fontSize: '0.65rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#8B5E3C' }}>
                  📍 You
                </div>
                <div style={{ position: 'absolute', top: '45px', right: '40px', backgroundColor: '#E65100', borderRadius: '6px', padding: '2px 6px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', fontSize: '0.65rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'white' }}>
                  🏁 Dest
                </div>
                <div style={{
                  position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '6px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', gap: '10px', alignItems: 'center'
                }}>
                  <span style={{ fontFamily: 'var(--font-poppins)', fontSize: '0.75rem', fontWeight: 600, color: '#8B5E3C' }}>⏱ {tripState.status === 'In Progress' ? '2h 30m' : '0m'}</span>
                  <div style={{ width: '1px', height: '14px', backgroundColor: '#D6BFA9' }} />
                  <span style={{ fontFamily: 'var(--font-poppins)', fontSize: '0.75rem', fontWeight: 600, color: '#8B5E3C' }}>{tripState.status === 'In Progress' ? '120 KM' : '0 KM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
            <button className="btn-brown" onClick={onOpenNav} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.9rem' }}>
              <Navigation2 size={18} />
              Open Live Navigation
            </button>
            <button className="btn-beige" onClick={() => alert('Dialing Truck Owner: +91 98765 00000')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.9rem', color: 'var(--primary-brown)' }}>
              <Phone size={18} />
              Call Owner
            </button>
          </div>

        </div>
      </div>

      {/* Floating SOS Button */}
      <button
        onClick={handleSOS}
        style={{
          position: 'absolute',
          bottom: '85px',
          right: '16px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: sosPressed ? '#B71C1C' : '#D32F2F',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: sosPressed
            ? '0 0 0 8px rgba(211,47,47,0.2), 0 4px 14px rgba(211,47,47,0.5)'
            : '0 4px 14px rgba(211,47,47,0.4)',
          transition: 'all 0.3s ease',
          zIndex: 60,
          animation: 'sosPulse 2s infinite'
        }}
      >
        <AlertTriangle size={22} color="white" />
        <style>{`
          @keyframes sosPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.4), 0 4px 14px rgba(211,47,47,0.4); }
            50% { box-shadow: 0 0 0 10px rgba(211,47,47,0), 0 4px 14px rgba(211,47,47,0.4); }
          }
        `}</style>
      </button>

      {sosPressed && (
        <div style={{
          position: 'absolute', bottom: '145px', right: '10px',
          backgroundColor: '#D32F2F', color: 'white', padding: '6px 14px',
          borderRadius: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-poppins)',
          fontWeight: 600, zIndex: 60, boxShadow: '0 4px 12px rgba(211,47,47,0.4)'
        }}>
          🚨 Emergency Alert Broadcasted!
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <BottomNav
        active="trips"
        onHome={onHome}
        onTrips={onTrips || (() => {})}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </div>
  );
};

export default TripDetails;
