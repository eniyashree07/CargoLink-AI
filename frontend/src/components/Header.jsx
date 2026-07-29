import React from 'react';
import { Bell, Search, Globe } from 'lucide-react';
import './Header.css';

const Header = ({ title, userRole }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {userRole === 'driver' && (
          <span className="status-badge status-online">
            <span className="dot"></span> On Duty
          </span>
        )}
      </div>

      <div className="header-right">
        {userRole !== 'driver' && (
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search drivers, trucks, loads..." />
          </div>
        )}
        
        <div className="header-actions">
          <button className="icon-btn">
            <Globe size={20} />
            <span className="lang-text">English</span>
          </button>
          <button className="icon-btn notification-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          {userRole !== 'driver' && (
            <div className="header-profile">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="header-avatar" />
              <div className="header-user">
                <span className="user-name">
                  {userRole === 'admin' ? 'Admin' : 'ABC Logistics'}
                </span>
                <span className="user-role-text">&#9662;</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
