import React, { useState } from 'react';
import {
  ArrowLeft, Truck, IndianRupee, AlertTriangle,
  CloudRain, Map, CheckCircle2, Bell, BellOff
} from 'lucide-react';
import BottomNav from './BottomNav';

const notificationsData = [
  {
    id: 1,
    type: 'trip',
    icon: <Truck size={22} />,
    iconBg: '#FDF6F0',
    iconColor: '#8B5E3C',
    title: 'New Trip Assigned',
    desc: 'Chennai → Madurai | 18 Tons | ABC Logistics Pvt Ltd. Pickup at 06:00 PM today.',
    time: '2 min ago',
    unread: true,
    tag: 'Trip',
    tagBg: '#FDF6F0',
    tagColor: '#8B5E3C',
  },
  {
    id: 2,
    type: 'payment',
    icon: <IndianRupee size={22} />,
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    title: 'Payment Credited',
    desc: '₹4,850 has been credited to your wallet for Trip CL-20240723-087. View payment details.',
    time: '1 hr ago',
    unread: true,
    tag: 'Payment',
    tagBg: '#E8F5E9',
    tagColor: '#2E7D32',
  },
  {
    id: 3,
    type: 'traffic',
    icon: <AlertTriangle size={22} />,
    iconBg: '#FFF8E1',
    iconColor: '#FF8F00',
    title: 'Traffic Alert',
    desc: 'Heavy traffic on NH 44 near Krishnagiri. Expected delay of 45 min. Alternate route suggested.',
    time: '2 hr ago',
    unread: true,
    tag: 'Alert',
    tagBg: '#FFF8E1',
    tagColor: '#FF8F00',
  },
  {
    id: 4,
    type: 'weather',
    icon: <CloudRain size={22} />,
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    title: 'Weather Alert',
    desc: 'Heavy rain expected on Chennai–Madurai route after 8 PM. Drive carefully and reduce speed.',
    time: '3 hr ago',
    unread: false,
    tag: 'Weather',
    tagBg: '#E3F2FD',
    tagColor: '#1565C0',
  },
  {
    id: 5,
    type: 'route',
    icon: <Map size={22} />,
    iconBg: '#F3E5F5',
    iconColor: '#6A1B9A',
    title: 'Route Changed',
    desc: 'AI has updated your route due to road closure near Dindigul. New ETA is 7:45 PM.',
    time: '5 hr ago',
    unread: false,
    tag: 'Route',
    tagBg: '#F3E5F5',
    tagColor: '#6A1B9A',
  },
  {
    id: 6,
    type: 'delivery',
    icon: <CheckCircle2 size={22} />,
    iconBg: '#E8F5E9',
    iconColor: '#1B5E20',
    title: 'Delivery Completed',
    desc: 'Trip CL-20240723-085 (Coimbatore → Chennai) successfully completed. Commission ₹1,250 processing.',
    time: 'Yesterday',
    unread: false,
    tag: 'Completed',
    tagBg: '#E8F5E9',
    tagColor: '#1B5E20',
  },
];

const NotificationsScreen = ({ onBack, onHome, onTrips, onNotifications, onProfile }) => {
  const [items, setItems] = useState(notificationsData);
  const unreadCount = items.filter(n => n.unread).length;

  const markAllRead = () => setItems(items.map(n => ({ ...n, unread: false })));
  const dismiss = (id) => setItems(items.filter(n => n.id !== id));

  return (
    <div className="app-screen animate-slide-up">

      {/* Header */}
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <button onClick={onBack} style={{
            background: 'var(--bg-warm)', border: 'none', padding: '8px',
            cursor: 'pointer', borderRadius: '12px', display: 'flex'
          }}>
            <ArrowLeft size={20} color="var(--text-dark-brown)" />
          </button>
          <div style={{ flex: 1 }}>
            <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Notifications & Alerts</h2>
            <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.6 }}>
              {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-poppins)', fontSize: '0.78rem',
              fontWeight: 600, color: 'var(--primary-brown)'
            }}>
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Notifications List */}
      <div className="screen-scroll-area">
        <div className="screen-scroll-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <BellOff size={48} color="var(--secondary-beige)" style={{ marginBottom: '1rem' }} />
              <p className="text-poppins font-medium text-brown" style={{ opacity: 0.5 }}>No notifications available</p>
            </div>
          ) : items.map((notif) => (
            <div
              key={notif.id}
              className="premium-card"
              style={{
                padding: '1rem',
                marginBottom: 0,
                borderLeft: notif.unread ? `3px solid ${notif.iconColor}` : '3px solid transparent',
                background: notif.unread ? 'var(--white)' : 'rgba(255,255,255,0.7)',
                position: 'relative'
              }}
            >
              {notif.unread && (
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: notif.iconColor
                }} />
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: notif.iconBg, borderRadius: '14px',
                  padding: '10px', color: notif.iconColor, flexShrink: 0
                }}>
                  {notif.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '8px' }}>
                    <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.88rem', margin: 0 }}>
                      {notif.title}
                    </p>
                    <span className="text-poppins text-brown" style={{ fontSize: '0.68rem', opacity: 0.55, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: '0 0 8px 0', opacity: 0.7, lineHeight: 1.5 }}>
                    {notif.desc}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: notif.tagBg, color: notif.tagColor,
                      padding: '2px 10px', borderRadius: '10px',
                      fontSize: '0.68rem', fontFamily: 'var(--font-poppins)', fontWeight: 600
                    }}>
                      {notif.tag}
                    </span>
                    <button onClick={() => dismiss(notif.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.7rem', fontFamily: 'var(--font-poppins)',
                      color: 'var(--text-muted)', textDecoration: 'underline', padding: 0
                    }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        active="notifications"
        onHome={onHome}
        onTrips={onTrips}
        onNotifications={onNotifications || (() => {})}
        onProfile={onProfile}
      />
    </div>
  );
};

export default NotificationsScreen;
