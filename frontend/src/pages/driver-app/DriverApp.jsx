import React, { useState, useEffect } from 'react';
import './DriverApp.css';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import HomeDashboard from './HomeDashboard';
import TripDetails from './TripDetails';
import NavigationScreen from './NavigationScreen';
import NearbyServices from './NearbyServices';
import NotificationsScreen from './NotificationsScreen';
import ProfileScreen from './ProfileScreen';
import AIRouteScreen from './AIRouteScreen';
import AITrafficScreen from './AITrafficScreen';
import AIWeatherScreen from './AIWeatherScreen';
import AIFuelScreen from './AIFuelScreen';

const DriverApp = () => {
  const getInitialScreen = () => {
    try {
      const savedUser = localStorage.getItem('cargolink_user') || localStorage.getItem('cargolink_driver_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.isLoggedIn) {
          return 'home';
        }
      }
    } catch (e) {
      // ignore parsing error
    }
    return 'login';
  };

  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [nearbyCategory, setNearbyCategory] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Shared Trip State for Arrived / Complete Trip flow
  const [sharedTripState, setSharedTripState] = useState(() => {
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
    // Check for persistent authentication immediately
    try {
      const savedUser = localStorage.getItem('cargolink_user') || localStorage.getItem('cargolink_driver_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.isLoggedIn) {
          setCurrentScreen('home');
          setIsCheckingAuth(false);
          return;
        }
      }
    } catch (e) {
      // ignore parsing error
    }
    setCurrentScreen('login');
    setIsCheckingAuth(false);
  }, []);

  const navigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleOpenNearbyCategory = (cat) => {
    setNearbyCategory(cat);
    setCurrentScreen('nearby');
  };

  const handleUpdateTripState = (updated) => {
    setSharedTripState(updated);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('cargolink_user');
      localStorage.removeItem('cargolink_driver_user');
    } catch (e) {}
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => navigate('login')} />;
      case 'login':
        return <LoginScreen onNext={() => navigate('home')} />;
      case 'home':
        return (
          <HomeDashboard
            onHome={() => navigate('home')}
            onTrips={() => navigate('tripdetails')}
            onOpenTrip={() => navigate('tripdetails')}
            onOpenNav={() => navigate('navigation')}
            onNearby={() => handleOpenNearbyCategory(null)}
            onNearbyCategory={handleOpenNearbyCategory}
            onNotifications={() => navigate('notifications')}
            onProfile={() => navigate('profile')}
            onAIRoute={() => navigate('ai-route')}
            onAITraffic={() => navigate('ai-traffic')}
            onAIWeather={() => navigate('ai-weather')}
            onAIFuel={() => navigate('ai-fuel')}
            sharedTripState={sharedTripState}
          />
        );
      case 'tripdetails':
        return (
          <TripDetails
            onBack={() => navigate('home')}
            onOpenNav={() => navigate('navigation')}
            onHome={() => navigate('home')}
            onTrips={() => navigate('tripdetails')}
            onNotifications={() => navigate('notifications')}
            onProfile={() => navigate('profile')}
            sharedTripState={sharedTripState}
            onUpdateTripState={handleUpdateTripState}
          />
        );
      case 'navigation':
        return (
          <NavigationScreen
            onBack={() => navigate('tripdetails')}
            onComplete={() => navigate('home')}
          />
        );
      case 'nearby':
        return <NearbyServices onBack={() => navigate('home')} initialCategory={nearbyCategory} />;
      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => navigate('home')}
            onHome={() => navigate('home')}
            onTrips={() => navigate('tripdetails')}
            onNotifications={() => navigate('notifications')}
            onProfile={() => navigate('profile')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => navigate('home')}
            onLogout={handleLogout}
            onHome={() => navigate('home')}
            onTrips={() => navigate('tripdetails')}
            onNotifications={() => navigate('notifications')}
            onProfile={() => navigate('profile')}
          />
        );

      /* AI Assistant Screens */
      case 'ai-route':
        return <AIRouteScreen onBack={() => navigate('home')} onSelectNav={() => navigate('navigation')} />;
      case 'ai-traffic':
        return <AITrafficScreen onBack={() => navigate('home')} onSelectNav={() => navigate('navigation')} />;
      case 'ai-weather':
        return <AIWeatherScreen onBack={() => navigate('home')} />;
      case 'ai-fuel':
        return <AIFuelScreen onBack={() => navigate('home')} />;

      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="driver-app-container">
      {/* Fixed Desktop Wrapper */}
      <div className="android-device-wrapper">

        {/* Android Punch-Hole Camera Notch */}
        <div className="android-notch">
          <div className="camera-lens"></div>
          <div className="speaker-earpiece"></div>
        </div>

        {/* Mobile Phone Content Container */}
        <div className="mobile-frame">
          {isCheckingAuth ? (
            <div className="app-screen flex-center" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-warm)' }}>
              <div>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Loading Driver App...</p>
                <div style={{ display: 'inline-flex', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-brown)', animation: 'blink 1s infinite alternate' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-brown)', animation: 'blink 1s infinite alternate 0.2s' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-brown)', animation: 'blink 1s infinite alternate 0.4s' }} />
                </div>
                <style>{`@keyframes blink { from { opacity: 0.4; } to { opacity: 1; } }`}</style>
              </div>
            </div>
          ) : (
            renderScreen()
          )}
        </div>

        {/* Android Home Gesture Indicator Bar */}
        <div className="android-gesture-bar"></div>
      </div>
    </div>
  );
};

export default DriverApp;
