import React, { useState, useEffect } from 'react';
import {
  Navigation2, Truck, IndianRupee, Map, CloudRain, ShieldAlert,
  Fuel, Home, Briefcase, Bell, User, Sparkles, Mic, Globe
} from 'lucide-react';
import BottomNav from './BottomNav';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { t, getLanguage, setLanguage } from '../../utils/translations';

const HomeDashboard = ({
  onOpenTrip, onNearby, onNotifications, onProfile, onAIRoute,
  onAITraffic, onAIWeather, onAIFuel, onHome, onTrips, onOpenNav,
  onNearbyCategory, sharedTripState
}) => {
  const [onDuty, setOnDuty] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);
  const [currentLang, setCurrentLang] = useState(getLanguage);

  const [userName, setUserName] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('cargolink_user') || localStorage.getItem('cargolink_driver_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const savedProfileStr = localStorage.getItem('cargolink_driver_profile');
      const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;

      return savedUser?.fullName || savedUser?.name || savedProfile?.name || savedProfile?.fullName || 'Driver';
    } catch (e) {
      return 'Driver';
    }
  });

  useEffect(() => {
    const handleUserUpdate = (e) => {
      if (e.detail?.name || e.detail?.fullName) {
        setUserName(e.detail.name || e.detail.fullName);
      }
    };

    const handleLangUpdate = (e) => {
      if (e.detail?.language) {
        setCurrentLang(e.detail.language);
      } else {
        setCurrentLang(getLanguage());
      }
    };

    window.addEventListener('cargolink_user_updated', handleUserUpdate);
    window.addEventListener('cargolink_lang_updated', handleLangUpdate);

    return () => {
      window.removeEventListener('cargolink_user_updated', handleUserUpdate);
      window.removeEventListener('cargolink_lang_updated', handleLangUpdate);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    setCurrentLang(nextLang);
  };

  const getGreetingTime = () => {
    const hr = new Date().getHours();
    if (hr < 12) return t('goodMorning', currentLang);
    if (hr < 17) return t('goodAfternoon', currentLang);
    return t('goodEvening', currentLang);
  };

  const aiCards = [
    { icon: <Map size={18} color="#0288D1" />, bg: '#E1F5FE', title: t('promptFastestRoute', currentLang), desc: 'NH 44 Highway', action: onAIRoute },
    { icon: <ShieldAlert size={18} color="#D32F2F" />, bg: '#FFEBEE', title: 'Traffic Alert', desc: 'Live Monitoring', action: onAITraffic },
    { icon: <CloudRain size={18} color="#0097A7" />, bg: '#E0F7FA', title: 'Weather Alert', desc: 'Rain Forecast', action: onAIWeather },
    { icon: <Fuel size={18} color="#388E3C" />, bg: '#E8F5E9', title: 'Fuel Saving', desc: 'Eco Guidance', action: onAIFuel },
  ];

  return (
    <div className="app-screen animate-fade-in">

      {/* Interactive AI Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        currentLang={currentLang}
      />

      {/* ── Sticky Header ── */}
      <div style={{
        flexShrink: 0,
        padding: '1.6rem 1.5rem 1rem',
        backgroundColor: 'var(--white)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 15px rgba(139,94,60,0.05)',
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={onProfile}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--secondary-beige)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <img src="https://i.pravatar.cc/150?img=11" alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ cursor: 'pointer' }}>
              <p className="text-poppins text-brown" style={{ fontSize: '0.83rem', margin: 0, opacity: 0.75 }}>{getGreetingTime()}</p>
              <h3 className="text-poppins font-bold text-brown" style={{ fontSize: '1.05rem', margin: 0 }}>{userName}</h3>
              <p className="text-poppins text-primary font-medium" style={{ fontSize: '0.72rem', margin: 0 }}>{t('driverId', currentLang)}: CL-8492</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleLanguage}
              style={{
                background: '#FDF6F0', border: '1px solid rgba(139,94,60,0.2)',
                borderRadius: '10px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px',
                cursor: 'pointer', fontFamily: 'var(--font-poppins)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-brown)'
              }}
            >
              <Globe size={14} /> {currentLang === 'ta' ? 'தமிழ்' : 'EN'}
            </button>

            <span className="text-poppins font-medium" style={{ fontSize: '0.82rem', color: onDuty ? '#2E7D32' : 'var(--text-muted)' }}>
              {onDuty ? t('onDuty', currentLang) : t('offDuty', currentLang)}
            </span>
            <div onClick={() => setOnDuty(!onDuty)} style={{
              width: 44, height: 24, backgroundColor: onDuty ? '#E8F5E9' : '#E0E0E0',
              borderRadius: 12, position: 'relative', cursor: 'pointer',
              transition: 'all 0.3s ease', border: onDuty ? '1px solid #A5D6A7' : '1px solid #BDBDBD'
            }}>
              <div style={{
                width: 18, height: 18,
                backgroundColor: onDuty ? '#4CAF50' : '#9E9E9E',
                borderRadius: '50%', position: 'absolute', top: 2,
                left: onDuty ? 22 : 3, transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        </div>

        {/* ── AI VOICE & ASSISTANT BAR ── */}
        <div
          onClick={() => setShowAiModal(true)}
          style={{
            backgroundColor: '#FDF6F0',
            border: '1.5px solid rgba(139,94,60,0.25)',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(139,94,60,0.06)'
          }}
        >
          <div style={{ backgroundColor: 'var(--primary-brown)', padding: '6px', borderRadius: '10px', color: 'white', display: 'flex' }}>
            <Sparkles size={16} />
          </div>
          <span className="text-poppins font-medium text-brown" style={{ flex: 1, fontSize: '0.82rem', opacity: 0.8 }}>
            {t('askOrSpeak', currentLang)}
          </span>
          <div style={{ backgroundColor: 'rgba(139,94,60,0.1)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Mic size={16} color="var(--primary-brown)" />
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          {/* Current Trip */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
            {t('currentTrip', currentLang)}
          </h4>
          <div className="premium-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--primary-brown)' }} />
                  <div style={{ width: 2, height: 25, backgroundColor: 'var(--secondary-beige)', margin: '2px 0' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-brown)' }} />
                </div>
                <div>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>Coimbatore</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: '0 0 10px 0', opacity: 0.6 }}>{t('pickup', currentLang)}</p>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>Chennai</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.6 }}>{t('delivery', currentLang)}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  backgroundColor: sharedTripState?.status === 'Completed' ? '#E8F5E9' : '#FFF3E0',
                  padding: '4px 8px', borderRadius: 8, display: 'inline-block', marginBottom: 8
                }}>
                  <span className="text-poppins font-bold" style={{ color: sharedTripState?.status === 'Completed' ? '#2E7D32' : '#E65100', fontSize: '0.78rem' }}>
                    {sharedTripState?.status || 'In Progress'}
                  </span>
                </div>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.8rem', margin: 0 }}>
                  {sharedTripState?.status === 'Completed' ? t('completed', currentLang) : '120 KM Left'}
                </p>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ height: 6, backgroundColor: '#EDE8DC', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${sharedTripState?.progress || 76}%`, height: '100%',
                  background: 'linear-gradient(90deg,#8B5E3C,#2E7D32)', borderRadius: 3,
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
            <button className="btn-brown" onClick={onOpenTrip} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.75rem' }}>
              <Navigation2 size={18} /> {t('openNav', currentLang)}
            </button>
          </div>

          {/* New Return Load */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ backgroundColor: '#E8EAF6', color: '#3F51B5', padding: '2px 6px', borderRadius: 6, fontSize: '0.7rem' }}>AI MATCH</span>
            {t('availableLoads', currentLang)}
          </h4>
          <div className="premium-card" style={{ border: '1px solid rgba(63,81,181,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-warm)', padding: 8, borderRadius: 10 }}>
                <Truck size={20} color="var(--primary-brown)" />
              </div>
              <div>
                <h5 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.95rem' }}>ABC Logistics Pvt Ltd</h5>
                <p className="text-poppins text-brown" style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Industrial Goods</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem', backgroundColor: 'var(--bg-warm)', padding: 10, borderRadius: 12 }}>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Route</p>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>Chennai ➔ Madurai</p>
              </div>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Weight</p>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>18 Tons</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Pickup Time</p>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>Today, 06:00 PM</p>
              </div>
            </div>
            <button className="btn-beige" onClick={onOpenTrip} style={{ padding: '0.75rem', color: 'var(--primary-brown)' }}>
              {t('viewDetails', currentLang)}
            </button>
          </div>

          {/* Commission */}
          <div className="premium-card" style={{ marginTop: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ backgroundColor: '#E8F5E9', padding: 6, borderRadius: 8 }}>
                <IndianRupee size={16} color="#4CAF50" />
              </div>
              <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.82rem', margin: 0 }}>{t('todaysEarnings', currentLang)}</p>
            </div>
            <h3 className="text-poppins font-bold text-brown" style={{ fontSize: '1.5rem', margin: '0 0 4px 0' }}>₹1,250</h3>
            <span style={{ fontSize: '0.7rem', backgroundColor: sharedTripState?.status === 'Completed' ? '#E8F5E9' : '#FFF3E0', color: sharedTripState?.status === 'Completed' ? '#2E7D32' : '#E65100', padding: '2px 10px', borderRadius: 10, fontWeight: 600 }}>
              {sharedTripState?.status === 'Completed' ? 'Settled' : 'Pending Settlement'}
            </span>
          </div>

          {/* AI Trip Assistant Cards */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }}>
            {t('voiceAssistant', currentLang)}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '0.5rem' }}>
            {aiCards.map((item, i) => (
              <div key={i} className="ai-card" onClick={item.action}>
                <div style={{ backgroundColor: item.bg, padding: 8, borderRadius: 10, display: 'flex', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.8rem', margin: '0 0 2px 0' }}>{item.title}</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: 0, opacity: 0.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Fixed Bottom Navigation ── */}
      <BottomNav
        active="home"
        onHome={onHome || null}
        onTrips={onTrips || onOpenTrip}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </div>
  );
};

export default HomeDashboard;

