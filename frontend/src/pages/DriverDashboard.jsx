import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import { MapPin, Navigation, Mic, Phone, PhoneCall, AlertOctagon, Fuel, SquareParking, Utensils, Wrench, Truck, ChevronRight, Sparkles } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './DriverDashboard.css';
import '../components/VoiceAssistantModal.css';
import { dashboardService } from '../services/dashboardService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';
import { t, getLanguage } from '../utils/translations';

const DriverDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [driverProfile, setDriverProfile] = useState(null);
  const [userName, setUserName] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cargolink_user') || localStorage.getItem('cargolink_driver_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const savedProfile = localStorage.getItem('cargolink_driver_profile');
      const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;

      return parsedUser?.fullName || parsedUser?.name || parsedProfile?.name || parsedProfile?.fullName || 'Driver';
    } catch (e) {
      return 'Driver';
    }
  });
  const [currentLang, setCurrentLang] = useState(getLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [isVaOpen, setIsVaOpen] = useState(false);

  useEffect(() => {
    const handleUserUpdate = (e) => {
      if (e.detail?.name || e.detail?.fullName) {
        setUserName(e.detail.name || e.detail.fullName);
      }
      if (e.detail?.profile) {
        setDriverProfile(prev => ({ ...prev, ...e.detail.profile }));
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('cargolink_user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const currentUser = parsedUser?.user || parsedUser;

        const savedProfileStr = localStorage.getItem('cargolink_driver_profile');
        const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;

        if (currentUser?.fullName) {
          setUserName(currentUser.fullName);
        } else if (parsedUser?.name) {
          setUserName(parsedUser.name);
        } else if (savedProfile?.name) {
          setUserName(savedProfile.name);
        }

        const data = await dashboardService.getDriverDashboard();
        setDashboardData(data);

        const tripsData = await tripService.getAllTrips();
        setTrips(tripsData);

        if (currentUser?.id) {
          const profile = await driverService.getDriverByUserId(currentUser.id);
          setDriverProfile(profile);
        }
      } catch (error) {
        console.error('Failed to fetch driver dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeTripsCount = dashboardData?.activeTrips ?? 0;
  const completedTripsCount = dashboardData?.completedTrips ?? 0;
  const totalTripsCount = dashboardData?.totalTrips ?? trips.length;
  const pendingTripsCount = dashboardData?.pendingTrips ?? 0;
  const profile = driverProfile || dashboardData?.driverProfile;

  const currentTrip = useMemo(() => trips.find(t => ['ASSIGNED','IN_TRANSIT','in-transit'].includes(t.status)), [trips]);
  const pendingLoads = useMemo(() => trips.filter(t => ['PENDING'].includes(t.status)), [trips]);
  const driverTrips = useMemo(() => trips.filter(t => t.driverId === profile?.id || t.driver === profile?._id || t.driverId?._id === profile?.id), [trips, profile]);

  const todayEarnings = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return driverTrips.filter(t => {
      const d = t.updatedAt || t.deliveryDate || t.createdAt;
      return d && d.startsWith(todayStr);
    }).reduce((sum, t) => sum + (t.amount || t.price || t.fare || 0), 0);
  }, [driverTrips]);

  const todayTripCount = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return driverTrips.filter(t => (t.updatedAt || t.deliveryDate || t.createdAt || '').startsWith(todayStr)).length;
  }, [driverTrips]);

  const earningsChartData = useMemo(() => {
    const days = ['Mon','Tue','Wed','Thu','Fri'];
    return days.map((day, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (4 - idx));
      const dayStr = d.toISOString().split('T')[0];
      const val = driverTrips.filter(t => (t.updatedAt || t.deliveryDate || t.createdAt || '').startsWith(dayStr)).reduce((s, t) => s + (t.amount || t.price || t.fare || 0), 0);
      return { day: day.charAt(0), value: val || (idx === 4 ? todayEarnings : Math.floor(Math.random() * 1000 + 500)) };
    });
  }, [driverTrips, todayEarnings]);

  const recentNotifications = useMemo(() => {
    const notifs = dashboardData?.notifications || [];
    if (notifs.length > 0) return notifs.slice(0, 3);
    const mapStatus = s => s === 'PENDING' ? 'New trip scheduled' : s === 'ASSIGNED' ? 'Trip assigned to you' : s === 'IN_TRANSIT' ? 'Trip in transit' : s === 'DELIVERED' ? 'Trip delivered' : 'Status update';
    return trips.slice(0, 3).map(t => ({
      message: mapStatus(t.status),
      time: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Recently',
      type: t.status === 'IN_TRANSIT' ? 'primary' : t.status === 'DELIVERED' ? 'success' : 'warning'
    }));
  }, [dashboardData, trips]);

  const initials = (profile?.fullName || userName).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const getGreetingTime = () => {
    const hr = new Date().getHours();
    if (hr < 12) return t('goodMorning', currentLang);
    if (hr < 17) return t('goodAfternoon', currentLang);
    return t('goodEvening', currentLang);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="driver" />
      
      <main className="dashboard-main">
        <Header title={`${getGreetingTime()} ${userName}!`} userRole="driver" />
        
        <div className="dashboard-content">

          {/* Greeting Bar */}
          <div className="dd-greeting-bar">
            <div className="dd-greeting-left">
              <h1>{t('welcomeBack', currentLang)} {userName}!</h1>
              <p>{t('driverOverview', currentLang)}</p>
            </div>
            <div className="dd-greeting-right">
              <div className="dd-greeting-stat">
                <span className="label">{t('activeTrips', currentLang)}</span>
                <span className="value">{activeTripsCount}</span>
              </div>
              <div className="dd-greeting-stat">
                <span className="label">{t('completed', currentLang)}</span>
                <span className="value">{completedTripsCount}</span>
              </div>
              <div className="dd-greeting-stat">
                <span className="label">{t('earningsToday', currentLang)}</span>
                <span className="value">₹{todayEarnings.toLocaleString()}</span>
              </div>
              <span className={`dd-status-badge ${profile?.status === 'Available' || profile?.status === 'active' ? 'online' : 'offline'}`}>
                {profile?.status || t('available', currentLang)}
              </span>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="dd-grid-2col">

            {/* Left - Profile + Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Driver Profile */}
              <div className="dd-card">
                <div className="dd-profile-avatar-section">
                  <div className="dd-profile-avatar-large">{initials}</div>
                  <div className="dd-profile-meta">
                    <h3>{profile?.fullName || userName}</h3>
                    <span>{profile?.vehicleType || 'Driver'}</span>
                  </div>
                </div>
                <div className="dd-profile-details">
                  <div className="dd-profile-field">
                    <span className="label">{t('mobile', currentLang)}</span>
                    <span className="value">{profile?.mobile || profile?.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="dd-profile-field">
                    <span className="label">{t('email', currentLang)}</span>
                    <span className="value">{profile?.email || 'driver@cargolink.ai'}</span>
                  </div>
                  <div className="dd-profile-field">
                    <span className="label">{t('truckNo', currentLang)}</span>
                    <span className="value">{profile?.truckNumber || 'TN 11 AB 1234'}</span>
                  </div>
                  <div className="dd-profile-field">
                    <span className="label">{t('licence', currentLang)}</span>
                    <span className="value">{profile?.drivingLicence || 'TN 11 20180042341'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dd-card">
                <div className="dd-card-header">
                  <span className="dd-card-title">{t('quickActions', currentLang)}</span>
                </div>
                <div className="dd-actions-grid">
                  <button className="dd-action-btn" onClick={() => setIsVaOpen(true)}>
                    <Mic className="icon" /><span>{t('voiceAssistant', currentLang)}</span>
                  </button>
                  <button className="dd-action-btn" onClick={() => alert('Calling Fleet Admin: +91 98765 11111')}>
                    <Phone className="icon" /><span>{t('callAdmin', currentLang)}</span>
                  </button>
                  <button className="dd-action-btn" onClick={() => alert('Calling Truck Owner: +91 98765 00000')}>
                    <PhoneCall className="icon" /><span>{t('callOwner', currentLang)}</span>
                  </button>
                  <button className="dd-action-btn danger" onClick={() => alert('🚨 Emergency SOS alert broadcasted to fleet controller!')}>
                    <AlertOctagon className="icon" /><span>{t('emergencySos', currentLang)}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right - Current Trip + New Load */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Current Trip */}
              <div className="dd-card dd-trip-card">
                <div className="dd-trip-header">
                  <div>
                    <div className="dd-trip-label">{currentTrip ? t('currentTrip', currentLang) : t('noActiveTrip', currentLang)}</div>
                    <div className="dd-trip-route">
                      <div>
                        <div className="dd-trip-point">
                          <MapPin size={16} style={{ color: 'var(--dd-brown)', marginTop: 2, minWidth: 16 }} />
                          <div className="dd-trip-point-content">
                            <span>{(currentTrip?.origin || currentTrip?.from || 'Coimbatore')}</span>
                            <small>{t('pickup', currentLang)}</small>
                          </div>
                        </div>
                        <div className="dd-trip-line"></div>
                        <div className="dd-trip-point">
                          <MapPin size={16} style={{ color: 'var(--dd-danger)', marginTop: 2, minWidth: 16 }} />
                          <div className="dd-trip-point-content">
                            <span>{(currentTrip?.destination || currentTrip?.to || 'Chennai')}</span>
                            <small>{t('delivery', currentLang)}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {currentTrip && (
                    <div className="dd-trip-eta-box">
                      <div className="label">{t('eta', currentLang)}</div>
                      <div className="value">{currentTrip?.estimatedDelivery || currentTrip?.eta || (currentTrip?.updatedAt ? new Date(currentTrip.updatedAt).toLocaleDateString() : 'Today, 6 PM')}</div>
                    </div>
                  )}
                </div>

                {currentTrip && (
                  <>
                  <div className="dd-trip-map">
                    <MapPin size={20} style={{ marginRight: 8 }} />
                    Map: {currentTrip.origin || currentTrip.from || 'Coimbatore'} → {currentTrip.destination || currentTrip.to || 'Chennai'}
                  </div>
                  <button className="dd-btn dd-btn-primary dd-btn-full">
                    <Navigation size={18} /> {t('openNav', currentLang)}
                  </button>
                  </>
                )}
              </div>

              {/* New Load */}
              <div className="dd-card">
                <div className="dd-card-header">
                  <span className="dd-card-title">
                    <Truck size={18} />
                    {t('availableLoads', currentLang)}
                  </span>
                  {pendingLoads.length > 0 && (
                    <span className="dd-load-tag available">{pendingLoads.length} Available</span>
                  )}
                </div>

                {pendingLoads.length > 0 ? (
                  <>
                  <div className="dd-load-shipper">{pendingLoads[0].cargoOwnerId?.companyName || pendingLoads[0].cargo || 'ABC Logistics Pvt Ltd'}</div>
                  <div className="dd-load-route">
                    {pendingLoads[0].origin || pendingLoads[0].from || 'Chennai'} <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /> {pendingLoads[0].destination || pendingLoads[0].to || 'Madurai'}
                  </div>
                  
                  <div className="dd-load-stats">
                    <div className="dd-load-stat">
                      <span className="label">Weight</span>
                      <span className="value">{pendingLoads[0].weight || '18 Tons'}</span>
                    </div>
                    <div className="dd-load-stat">
                      <span className="label">Distance</span>
                      <span className="value">{pendingLoads[0].distance || pendingLoads[0].estimatedDuration || '460 KM'}</span>
                    </div>
                    <div className="dd-load-stat">
                      <span className="label">Earnings</span>
                      <span className="value earnings">₹{pendingLoads[0].amount || pendingLoads[0].price || pendingLoads[0].fare || 4850}</span>
                    </div>
                  </div>
                  
                  <div className="dd-load-actions">
                    <button className="dd-btn dd-btn-success">{t('acceptLoad', currentLang)}</button>
                    <button className="dd-btn dd-btn-outline-danger">{t('decline', currentLang)}</button>
                  </div>
                  </>
                ) : (
                  <div className="dd-empty">
                    <Truck size={40} style={{ color: 'var(--dd-text-light)', marginBottom: 12 }} />
                    <p>{t('noPendingLoads', currentLang)}</p>
                    <small>Check back later for new assignments</small>
                  </div>
                )}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <a href="#" className="dd-link">{t('viewDetails', currentLang)} <ChevronRight size={14} style={{ verticalAlign: 'middle' }} /></a>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Row */}
          <div className="dd-bottom-grid">

            {/* Earnings */}
            <div className="dd-card">
              <div className="dd-card-header">
                <span className="dd-card-title">{t('todaysEarnings', currentLang)}</span>
              </div>
              <div className="dd-earnings-val">₹{todayEarnings.toLocaleString()}</div>
              <div className="dd-earnings-sub">{todayTripCount} trip{todayTripCount !== 1 ? 's' : ''} today</div>
              <div className="dd-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsChartData}>
                    <Line type="monotone" dataKey="value" stroke="var(--dd-brown)" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Notifications */}
            <div className="dd-card">
              <div className="dd-card-header">
                <span className="dd-card-title">{t('notifications', currentLang)}</span>
                <a href="#" className="dd-card-link">{t('viewAll', currentLang)}</a>
              </div>
              <div className="dd-notif-list">
                {recentNotifications.length > 0 ? recentNotifications.map((n, i) => (
                  <div className="dd-notif-item" key={i}>
                    <div className={`dd-notif-dot ${n.type || 'primary'}`}></div>
                    <div className="dd-notif-body">
                      <p>{n.message || n.title}</p>
                      <span className="time">{n.time || 'Recently'}</span>
                    </div>
                  </div>
                )) : (
                  <div className="dd-notif-item">
                    <div className="dd-notif-dot primary"></div>
                    <div className="dd-notif-body">
                      <p>No notifications yet</p>
                      <span className="time">—</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Services */}
            <div className="dd-card">
              <div className="dd-card-header">
                <span className="dd-card-title">{t('quickServices', currentLang)}</span>
              </div>
              <div className="dd-services-grid">
                <div className="dd-service-item">
                  <Fuel />
                  <span>{t('fuelStation', currentLang)}</span>
                </div>
                <div className="dd-service-item">
                  <SquareParking />
                  <span>{t('parking', currentLang)}</span>
                </div>
                <div className="dd-service-item">
                  <Utensils />
                  <span>{t('foodCourt', currentLang)}</span>
                </div>
                <div className="dd-service-item">
                  <Wrench />
                  <span>{t('mechanic', currentLang)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Glassmorphism Voice Assistant Button */}
      <button className="va-floating-fab" onClick={() => setIsVaOpen(true)}>
        <Sparkles size={20} />
        <span>{t('voiceAssistant', currentLang)}</span>
      </button>

      {/* Interactive AI Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVaOpen}
        onClose={() => setIsVaOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
};

export default DriverDashboard;

