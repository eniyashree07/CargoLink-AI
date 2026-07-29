import React from 'react';
import { Home, Briefcase, Bell, User } from 'lucide-react';

const BottomNav = ({ active, onHome, onTrips, onNotifications, onProfile }) => {
  const navItems = [
    { icon: <Home size={22} />, label: 'Home', key: 'home', action: onHome },
    { icon: <Briefcase size={22} />, label: 'Trips', key: 'trips', action: onTrips },
    { icon: <Bell size={22} />, label: 'Notifications', key: 'notifications', action: onNotifications },
    { icon: <User size={22} />, label: 'Profile', key: 'profile', action: onProfile },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={item.action}
            style={{
              color: isActive ? 'var(--primary-brown)' : 'var(--text-muted)',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
