import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { MapPin, Navigation, Mic, Phone, PhoneCall, AlertOctagon, Fuel, SquareParking, Utensils, Wrench } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './DriverDashboard.css';
import { dashboardService } from '../services/dashboardService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';

const DriverDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [driverProfile, setDriverProfile] = useState(null);
  const [userName, setUserName] = useState('Driver');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('cargolink_user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const currentUser = parsedUser?.user || parsedUser;

        if (currentUser?.fullName) {
          setUserName(currentUser.fullName);
        } else if (parsedUser?.name) {
          setUserName(parsedUser.name);
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
  const unreadNotifications = dashboardData?.unreadNotifications ?? 0;
  const profile = driverProfile || dashboardData?.driverProfile;

  const currentTrip = useMemo(() => trips.find(t => ['ASSIGNED','IN_TRANSIT','in-transit'].includes(t.status)), [trips]);
  const pendingLoads = useMemo(() => trips.filter(t => ['PENDING'].includes(t.status)), [trips]);
  const completedTrips = useMemo(() => trips.filter(t => ['DELIVERED','completed'].includes(t.status)), [trips]);
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

  return (
    <div className="dashboard-layout">
      <Sidebar role="driver" />
      
      <main className="dashboard-main">
        <Header title={`Good Morning, ${userName}! 👋`} userRole="driver" />
        
        <div className="dashboard-content driver-grid">
          {/* Driver Profile Card */}
          <div className="card driver-info-card">
            <div className="driver-info-head">
              <h2 className="text-h3">Driver Profile</h2>
              <span className="badge badge-primary">{profile?.status || 'Available'}</span>
            </div>
            <div className="driver-info-grid">
              <div>
                <p className="text-muted text-xs">Name</p>
                <p className="font-medium">{profile?.fullName || userName}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Mobile</p>
                <p className="font-medium">{profile?.mobile || 'Not available'}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Email</p>
                <p className="font-medium">{profile?.email || 'Not available'}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Truck Number</p>
                <p className="font-medium">{profile?.truckNumber || 'Not available'}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Licence</p>
                <p className="font-medium">{profile?.drivingLicence || 'Not available'}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Vehicle Type</p>
                <p className="font-medium">{profile?.vehicleType || 'Not available'}</p>
              </div>
            </div>
          </div>
          <div className="card trip-card">
            <div className="trip-header">
              <div>
                <span className="text-muted text-sm">{currentTrip ? 'CURRENT TRIP' : 'NO ACTIVE TRIP'}</span>
                <div className="trip-locations">
                  <div className="location">
                    <MapPin size={16} className="text-primary" />
                    <span>{(currentTrip?.origin || currentTrip?.from || 'N/A')}<br/><small className="text-muted">Pickup</small></span>
                  </div>
                  <div className="trip-line"></div>
                  <div className="location">
                    <MapPin size={16} className="text-danger" />
                    <span>{(currentTrip?.destination || currentTrip?.to || 'N/A')}<br/><small className="text-muted">Delivery</small></span>
                  </div>
                </div>
              </div>
              <div className="trip-eta">
                <span className="text-primary text-sm font-medium">{currentTrip ? `Extra: ${currentTrip.estimatedDuration || currentTrip.eta || 'N/A'}` : 'No active trip'}</span>
                <p className="text-sm">ETA: {currentTrip?.estimatedDelivery || currentTrip?.eta || currentTrip?.updatedAt ? new Date(currentTrip.updatedAt || currentTrip.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
            
            {currentTrip && (
              <>
              <div className="trip-map-placeholder">
                <div style={{ width: '100%', height: 200, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, color: '#999', fontSize: '0.9rem' }}>
                  Map: {currentTrip.origin || currentTrip.from} → {currentTrip.destination || currentTrip.to}
                </div>
              </div>

              <button className="btn-primary w-full flex-center gap-2 mt-4">
                <Navigation size={18} /> Open Navigation
              </button>
              </>
            )}
            
            <div className="quick-actions-grid mt-4">
              <button className="action-btn"><Mic size={24} className="text-primary" /><span>Voice Assistant</span></button>
              <button className="action-btn"><Phone size={24} className="text-primary" /><span>Call Admin</span></button>
              <button className="action-btn"><PhoneCall size={24} className="text-primary" /><span>Call Owner</span></button>
              <button className="action-btn danger"><AlertOctagon size={24} className="text-danger" /><span>Emergency SOS</span></button>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="right-column-grid">
            
            {/* New Load Card */}
            <div className="card load-card">
              <div className="flex-between mb-2">
                <span className="badge badge-success text-xs">{pendingLoads.length > 0 ? (pendingLoads.length === 1 ? '1 NEW LOAD AVAILABLE' : `${pendingLoads.length} LOADS AVAILABLE`) : 'NO LOADS AVAILABLE'}</span>
              </div>
              {pendingLoads.length > 0 ? (
                <>
                <h3 className="text-h3 mb-2">{pendingLoads[0].cargoOwnerId?.companyName || pendingLoads[0].cargo || 'Unknown Shipper'}</h3>
                <div className="flex-center gap-2 text-sm text-muted mb-4">
                  <span>{pendingLoads[0].origin || pendingLoads[0].from || 'N/A'}</span> &rarr; <span>{pendingLoads[0].destination || pendingLoads[0].to || 'N/A'}</span>
                </div>
                
                <div className="flex-between mb-4">
                  <div>
                    <p className="text-muted text-xs">Weight</p>
                    <p className="font-medium">{pendingLoads[0].weight || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted text-xs">Distance</p>
                    <p className="font-medium">{pendingLoads[0].distance || pendingLoads[0].estimatedDuration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted text-xs">Earnings</p>
                    <p className="font-medium text-lg text-primary">₹ {pendingLoads[0].amount || pendingLoads[0].price || pendingLoads[0].fare || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex-between gap-4">
                  <button className="btn-success flex-1">Accept Load</button>
                  <button className="btn-danger flex-1">Reject</button>
                </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  <p>No pending loads available right now.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Check back later for new assignments.</p>
                </div>
              )}
              <div className="text-center mt-3">
                <a href="#" className="text-primary text-sm font-medium">View Details</a>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row-grid">
              
              {/* Earnings */}
              <div className="card">
                <p className="text-muted text-sm font-medium mb-1">TODAY'S EARNINGS</p>
                <h2 className="text-h1 mb-1">₹ {todayEarnings.toLocaleString()}</h2>
                <div className="flex-between text-sm mb-4">
                  <span>Trip Count: <strong>{todayTripCount}</strong></span>
                </div>
                <div className="chart-container" style={{ height: '80px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsChartData}>
                      <Line type="monotone" dataKey="value" stroke="var(--primary-blue)" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Notifications */}
              <div className="card">
                <div className="flex-between mb-4">
                  <p className="text-muted text-sm font-medium">NOTIFICATIONS</p>
                  <a href="#" className="text-primary text-xs font-medium">View All</a>
                </div>
                <div className="notification-list">
                  {recentNotifications.length > 0 ? recentNotifications.map((n, i) => (
                    <div className="notification-item" key={i}>
                      <div className={`noti-icon noti-${n.type || 'primary'}`}></div>
                      <div className="noti-content">
                        <p>{n.message || n.title}</p>
                        <span className="time">{n.time || 'Recently'}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="notification-item">
                      <div className="noti-icon noti-primary"></div>
                      <div className="noti-content">
                        <p>No notifications yet</p>
                        <span className="time">—</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Services */}
              <div className="card">
                <p className="text-muted text-sm font-medium mb-4">QUICK SERVICES</p>
                <div className="services-grid">
                  <div className="service-item">
                    <Fuel size={24} />
                    <span>Fuel Station</span>
                  </div>
                  <div className="service-item">
                    <SquareParking size={24} />
                    <span>Parking</span>
                  </div>
                  <div className="service-item">
                    <Utensils size={24} />
                    <span>Food Court</span>
                  </div>
                  <div className="service-item">
                    <Wrench size={24} />
                    <span>Mechanic</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
