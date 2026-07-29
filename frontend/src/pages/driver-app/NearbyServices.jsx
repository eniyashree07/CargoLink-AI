import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Fuel, Wrench, ParkingSquare, Utensils,
  HeartPulse, ShieldCheck, Coffee, Droplets, Navigation2, Star
} from 'lucide-react';

const services = [
  { id: 'fuel', icon: <Fuel size={28} />, label: 'Fuel Station', color: '#FF6F00', bg: '#FFF8E1', count: 3, items: [
    { name: 'Indian Oil Petrol', distance: '0.8 KM', rating: 4.5, open: true },
    { name: 'HP Fuel Station', distance: '1.2 KM', rating: 4.2, open: true },
    { name: 'BPCL Station', distance: '2.1 KM', rating: 4.0, open: false },
  ]},
  { id: 'mechanic', icon: <Wrench size={28} />, label: 'Mechanic', color: '#1565C0', bg: '#E3F2FD', count: 2, items: [
    { name: 'Raja Auto Works', distance: '1.1 KM', rating: 4.7, open: true },
    { name: 'Sri Ram Garage', distance: '1.9 KM', rating: 4.3, open: true },
  ]},
  { id: 'parking', icon: <ParkingSquare size={28} />, label: 'Parking', color: '#2E7D32', bg: '#E8F5E9', count: 4, items: [
    { name: 'NH44 Truck Bay', distance: '0.3 KM', rating: 4.1, open: true },
    { name: 'NHAI Rest Zone', distance: '0.9 KM', rating: 4.4, open: true },
  ]},
  { id: 'restaurant', icon: <Utensils size={28} />, label: 'Restaurant', color: '#6A1B9A', bg: '#F3E5F5', count: 6, items: [
    { name: 'Dhaba Highway', distance: '0.5 KM', rating: 4.6, open: true },
    { name: 'Hotel Murugan', distance: '1.3 KM', rating: 4.4, open: true },
    { name: 'Anna Mess', distance: '2.0 KM', rating: 4.0, open: false },
  ]},
  { id: 'hospital', icon: <HeartPulse size={28} />, label: 'Hospital', color: '#C62828', bg: '#FFEBEE', count: 2, items: [
    { name: 'Govt Primary HC', distance: '2.3 KM', rating: 3.9, open: true },
    { name: 'JSS Hospital', distance: '3.5 KM', rating: 4.5, open: true },
  ]},
  { id: 'police', icon: <ShieldCheck size={28} />, label: 'Police Station', color: '#1A237E', bg: '#E8EAF6', count: 1, items: [
    { name: 'NH44 Police Post', distance: '1.7 KM', rating: 4.0, open: true },
  ]},
  { id: 'rest', icon: <Coffee size={28} />, label: 'Rest Area', color: '#4E342E', bg: '#EFEBE9', count: 3, items: [
    { name: 'NHAI Driver Rest', distance: '0.7 KM', rating: 4.3, open: true },
    { name: 'Highway Lounge', distance: '1.4 KM', rating: 4.1, open: true },
  ]},
  { id: 'toilet', icon: <Droplets size={28} />, label: 'Toilet', color: '#00695C', bg: '#E0F2F1', count: 5, items: [
    { name: 'Sulabh Complex', distance: '0.4 KM', rating: 3.8, open: true },
    { name: 'NHAI Washroom', distance: '0.9 KM', rating: 4.2, open: true },
  ]},
];

const NearbyServices = ({ onBack, initialCategory }) => {
  const [selected, setSelected] = useState(initialCategory || null);

  useEffect(() => {
    if (initialCategory) {
      setSelected(initialCategory);
    }
  }, [initialCategory]);

  const selectedService = services.find(s => s.id === selected);

  return (
    <div className="app-screen animate-slide-up" style={{ backgroundColor: '#F4F1ED' }}>

      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: 'var(--white)',
        borderBottomLeftRadius: '25px',
        borderBottomRightRadius: '25px',
        boxShadow: '0 4px 15px rgba(139, 94, 60, 0.06)',
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <button
          onClick={selected ? () => setSelected(null) : onBack}
          style={{
            background: 'var(--bg-warm)', border: 'none', padding: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(139, 94, 60, 0.08)'
          }}
        >
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <div>
          <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>
            {selected ? selectedService?.label : 'Nearby Services'}
          </h2>
          <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.6 }}>
            {selected ? `${selectedService?.count} places found` : 'Near your current location'}
          </p>
        </div>
      </div>

      <div className="screen-scroll-area">
        <div className="screen-scroll-content">
          {!selected ? (
            /* Services Grid */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelected(service.id)}
                  style={{
                    background: 'var(--white)',
                    border: '1px solid rgba(139, 94, 60, 0.06)',
                    borderRadius: '20px',
                    padding: '1.1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 6px 20px rgba(139, 94, 60, 0.07)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    backgroundColor: service.bg, borderRadius: '14px',
                    padding: '10px', display: 'inline-flex', width: 'fit-content',
                    color: service.color
                  }}>
                    {service.icon}
                  </div>
                  <div>
                    <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.88rem', margin: '0 0 3px 0' }}>
                      {service.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        backgroundColor: service.bg, color: service.color,
                        padding: '2px 8px', borderRadius: '10px',
                        fontSize: '0.68rem', fontFamily: 'var(--font-poppins)', fontWeight: 600
                      }}>
                        {service.count} nearby
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Service Detail List */
            <div>
              {/* Mini Map Strip */}
              <div className="premium-card" style={{ padding: 0, overflow: 'hidden', height: '130px', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #D4E8D4 0%, #E8EFDC 40%, #EDE8DC 100%)',
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="100%" height="100%" viewBox="0 0 360 130">
                    <rect width="360" height="130" fill="#D8EAD8" />
                    {[[20,30,60,25],[100,20,50,30],[200,15,70,30],[290,25,60,25],[20,80,55,25],[100,75,60,30],[190,72,65,28],[290,78,55,22]].map(([x,y,w,h],i) => (
                      <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#E8E0D0" stroke="#D4C8B4" strokeWidth="0.5" />
                    ))}
                    <path d="M 0 65 Q 90 62 180 68 Q 270 72 360 65" stroke="#D0C4B0" strokeWidth="12" fill="none" />
                    <path d="M 0 65 Q 90 62 180 68 Q 270 72 360 65" stroke="white" strokeWidth="9" fill="none" />
                    {/* Current position */}
                    <circle cx="180" cy="67" r="12" fill="white" stroke="#8B5E3C" strokeWidth="2.5" />
                    <text x="180" y="73" textAnchor="middle" fontSize="14">🚛</text>
                    {/* Service markers */}
                    {[60, 120, 240, 300].map((x, i) => (
                      <g key={i}>
                        <circle cx={x} cy="67" r="8" fill={selectedService?.color} opacity="0.85" />
                        <circle cx={x} cy="67" r="4" fill="white" />
                      </g>
                    ))}
                  </svg>
                  <div style={{ position: 'absolute', bottom: '8px', right: '12px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', padding: '3px 8px', fontSize: '0.65rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#8B5E3C' }}>
                    📍 Your area
                  </div>
                </div>
              </div>

              {/* Service Cards */}
              {selectedService?.items.map((item, i) => (
                <div key={i} className="premium-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    backgroundColor: selectedService.bg, borderRadius: '14px', padding: '10px',
                    color: selectedService.color, flexShrink: 0
                  }}>
                    {selectedService.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <p className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</p>
                      <span style={{
                        backgroundColor: item.open ? '#E8F5E9' : '#FFEBEE',
                        color: item.open ? '#2E7D32' : '#C62828',
                        padding: '2px 7px', borderRadius: '8px',
                        fontSize: '0.65rem', fontFamily: 'var(--font-poppins)', fontWeight: 600
                      }}>
                        {item.open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span className="text-poppins text-brown" style={{ fontSize: '0.78rem', opacity: 0.7 }}>📍 {item.distance}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', fontFamily: 'var(--font-poppins)', color: '#FF8F00', fontWeight: 600 }}>
                        <Star size={12} fill="#FF8F00" color="#FF8F00" /> {item.rating}
                      </span>
                    </div>
                    <button
                      className="btn-brown"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.78rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto' }}
                    >
                      <Navigation2 size={14} />
                      Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyServices;
