import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Briefcase, 
  Wallet, 
  Bell, 
  HelpCircle, 
  User, 
  Truck,
  Users,
  Settings,
  ClipboardList
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  // Define navigation items based on the user role
  const getNavItems = () => {
    switch(role) {
      case 'driver':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/driver' },
          { name: 'My Trips', icon: <Map size={20} />, path: '#' },
          { name: 'Loads', icon: <Briefcase size={20} />, path: '#' },
          { name: 'Earnings', icon: <Wallet size={20} />, path: '#' },
          { name: 'Notifications', icon: <Bell size={20} />, path: '#', badge: 3 },
          { name: 'Support', icon: <HelpCircle size={20} />, path: '#' },
          { name: 'Profile', icon: <User size={20} />, path: '#' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/admin' },
          { name: 'Live Tracking', icon: <Map size={20} />, path: '#' },
          { name: 'Drivers', icon: <Users size={20} />, path: '#' },
          { name: 'Trucks', icon: <Truck size={20} />, path: '#' },
          { name: 'Companies', icon: <Briefcase size={20} />, path: '#' },
          { name: 'Lead Management', icon: <ClipboardList size={20} />, path: '#' },
          { name: 'Approvals', icon: <Bell size={20} />, path: '#', badge: 24 },
          { name: 'Settings', icon: <Settings size={20} />, path: '#' },
        ];
      case 'owner':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/owner' },
          { name: 'Create Shipment', icon: <Briefcase size={20} />, path: '#' },
          { name: 'My Shipments', icon: <Truck size={20} />, path: '#' },
          { name: 'Live Tracking', icon: <Map size={20} />, path: '#' },
          { name: 'Driver Approvals', icon: <Users size={20} />, path: '#' },
          { name: 'Payments', icon: <Wallet size={20} />, path: '#' },
          { name: 'Settings', icon: <Settings size={20} />, path: '#' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Truck size={28} color="var(--primary-blue)" />
        <span className="logo-text">CARGOLINK <strong>AI</strong></span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive && item.path !== '#' ? 'nav-link active' : 'nav-link'}
              >
                {item.icon}
                <span className="nav-text">{item.name}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="profile-widget">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="profile-img" />
          <div className="profile-info">
            <p className="profile-name">
              {role === 'driver' ? 'John Kumar' : role === 'admin' ? 'Admin' : 'ABC Logistics'}
            </p>
            <p className="profile-status">
              {role === 'driver' ? 'On Duty' : 'System Administrator'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
