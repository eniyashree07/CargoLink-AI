import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Truck, CreditCard, FileText,
  ChevronRight, Settings, Globe, HelpCircle,
  LogOut, Edit2, Shield, Phone, Award, TrendingUp, Check, X, Camera, Save, Mail, MapPin
} from 'lucide-react';
import BottomNav from './BottomNav';

const ProfileScreen = ({ onBack, onLogout, onHome, onTrips, onNotifications, onProfile }) => {
  const defaultProfile = {
    name: 'John Doe',
    driverId: 'CL-8492',
    phone: '+91 98765 43210',
    email: 'john.doe@cargolink.ai',
    address: '124, Truckers Colony, Salem, TN',
    language: 'English',
    photo: 'https://i.pravatar.cc/150?img=11'
  };

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cargolink_driver_profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showLangPicker, setShowLangPicker] = useState(false);
  const languages = ['English', 'தமிழ் (Tamil)', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)', '<ctrl42>ಕನ್ನಡ (Kannada)'];

  useEffect(() => {
    setEditForm({ ...profile });
  }, [profile]);

  const handleSaveProfile = () => {
    setErrorMsg('');
    if (!editForm.name.trim()) {
      setErrorMsg('Driver Name cannot be empty.');
      return;
    }
    if (!editForm.phone.trim() || editForm.phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!editForm.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!editForm.address.trim()) {
      setErrorMsg('Address cannot be empty.');
      return;
    }

    const updated = { ...editForm };
    setProfile(updated);
    try {
      localStorage.setItem('cargolink_driver_profile', JSON.stringify(updated));
    } catch (e) {}

    setSuccessMsg('Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setErrorMsg('');
  };

  const handlePhotoChange = () => {
    const avatarIds = [12, 13, 33, 53, 68, 11];
    const randomImg = `https://i.pravatar.cc/150?img=${avatarIds[Math.floor(Math.random() * avatarIds.length)]}`;
    setEditForm({ ...editForm, photo: randomImg });
  };

  return (
    <div className="app-screen animate-slide-up">

      {/* Language Picker Modal */}
      {showLangPicker && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            backgroundColor: 'var(--white)', width: '100%',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            padding: '1.5rem', boxShadow: '0 -8px 30px rgba(0,0,0,0.15)'
          }}>
            <h3 className="text-poppins font-bold text-brown" style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Select Preferred Language</h3>
            {languages.map((lang, i) => (
              <div key={i} onClick={() => {
                const updated = { ...profile, language: lang };
                setProfile(updated);
                setEditForm({ ...editForm, language: lang });
                try { localStorage.setItem('cargolink_driver_profile', JSON.stringify(updated)); } catch (e) {}
                setShowLangPicker(false);
              }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 0', borderBottom: i < languages.length - 1 ? '1px solid #F0EAE3' : 'none',
                  cursor: 'pointer'
                }}>
                <span className="text-poppins font-medium text-brown" style={{ fontSize: '0.9rem' }}>{lang}</span>
                {profile.language === lang && <Check size={18} color="var(--primary-brown)" />}
              </div>
            ))}
            <button onClick={() => setShowLangPicker(false)} className="btn-beige" style={{ marginTop: '1rem', color: 'var(--primary-brown)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 90,
          display: 'flex', alignItems: 'flex-end'
        }}>
          <div className="animate-slide-up" style={{
            backgroundColor: 'var(--white)', width: '100%', height: '92%',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '1.1rem' }}>Edit Driver Profile</h3>
              <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="var(--text-dark-brown)" />
              </button>
            </div>

            {errorMsg && (
              <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '8px 12px', borderRadius: '10px', fontSize: '0.78rem', marginBottom: '1rem', fontFamily: 'var(--font-poppins)', fontWeight: 600 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Profile Photo Editor */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary-brown)', margin: '0 auto', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                  <img src={editForm.photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button onClick={handlePhotoChange} type="button" style={{
                  position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--primary-brown)',
                  color: 'white', border: 'none', borderRadius: '50%', padding: '7px', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  <Camera size={14} />
                </button>
              </div>
              <p className="text-poppins" style={{ fontSize: '0.72rem', opacity: 0.65, margin: '6px 0 0 0' }}>Tap camera icon to change profile photo</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>Driver Name</label>
                <input className="input-premium" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                <input className="input-premium" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>Email Address</label>
                <input className="input-premium" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>Address</label>
                <input className="input-premium" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>Preferred Language</label>
                <select
                  className="input-premium"
                  value={editForm.language}
                  onChange={e => setEditForm({ ...editForm, language: e.target.value })}
                  style={{ padding: '0.85rem 1rem' }}
                >
                  {languages.map((l, i) => (
                    <option key={i} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', paddingBottom: '0.5rem' }}>
              <button type="button" className="btn-beige" onClick={handleCancelEdit} style={{ flex: 1, padding: '0.85rem', color: 'var(--primary-brown)' }}>
                Cancel
              </button>
              <button type="button" className="btn-brown" onClick={handleSaveProfile} style={{ flex: 1.5, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="screen-header">
        <button onClick={onBack} style={{ background: 'var(--bg-warm)', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '12px', display: 'flex' }}>
          <ArrowLeft size={20} color="var(--text-dark-brown)" />
        </button>
        <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>Driver Profile</h2>
      </div>

      {/* Scroll Area */}
      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          {successMsg && (
            <div style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '10px 14px', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.82rem', fontFamily: 'var(--font-poppins)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} /> {successMsg}
            </div>
          )}

          {/* Driver Card */}
          <div className="premium-card" style={{ padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem', position: 'relative' }}>
            <button
              onClick={() => { setEditForm({ ...profile }); setIsEditing(true); }}
              style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'var(--bg-warm)', border: 'none', borderRadius: '10px',
                padding: '7px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                color: 'var(--primary-brown)', fontFamily: 'var(--font-poppins)', fontSize: '0.75rem', fontWeight: 600
              }}
            >
              <Edit2 size={15} /> Edit Profile
            </button>

            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px auto', border: '3px solid var(--secondary-beige)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <img src={profile.photo} alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.2rem', margin: '0 0 2px 0' }}>{profile.name}</h2>
            <p className="text-poppins font-medium text-primary" style={{ fontSize: '0.8rem', margin: '0 0 8px 0' }}>Driver ID: {profile.driverId}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '0 0 10px 0' }}>
              <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.75 }}>📱 {profile.phone}</p>
              <p className="text-poppins text-brown" style={{ fontSize: '0.78rem', margin: 0, opacity: 0.75 }}>✉️ {profile.email}</p>
              <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.65 }}>📍 {profile.address}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={15} color="#FF8F00" fill={i <= 4 ? "#FF8F00" : "none"} />
              ))}
              <span className="text-poppins font-bold text-brown" style={{ fontSize: '0.8rem', marginLeft: '4px' }}>4.8 / 5 Rating</span>
            </div>
          </div>

          {/* Performance Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
            {[
              { label: 'Completed Trips', val: '248', icon: <Award size={18} color="#8B5E3C" /> },
              { label: 'Total Earnings', val: '₹22,400', icon: <TrendingUp size={18} color="#2E7D32" /> },
              { label: 'Safety Rating', val: '98%', icon: <Shield size={18} color="#1565C0" /> },
            ].map((st, i) => (
              <div key={i} className="premium-card" style={{ padding: '0.75rem', textAlign: 'center', marginBottom: 0 }}>
                {st.icon}
                <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.88rem', margin: '4px 0 2px 0' }}>{st.val}</p>
                <p className="text-poppins text-brown" style={{ fontSize: '0.65rem', margin: 0, opacity: 0.6 }}>{st.label}</p>
              </div>
            ))}
          </div>

          {/* Preferences & Settings */}
          <h4 className="text-poppins font-bold text-brown" style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem' }}>App Settings & Preferences</h4>
          <div className="premium-card" style={{ padding: '0.5rem 1rem', marginBottom: '1.25rem' }}>
            <div onClick={() => setShowLangPicker(true)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', cursor: 'pointer' }}>
              <span className="text-poppins font-medium text-brown" style={{ fontSize: '0.88rem' }}>Preferred Language</span>
              <span className="text-poppins font-bold text-primary" style={{ fontSize: '0.82rem' }}>{profile.language} ›</span>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={onLogout} style={{
            width: '100%', padding: '0.9rem', borderRadius: '18px', border: '1px solid #FFCDD2',
            backgroundColor: '#FFF5F5', color: '#C62828', fontFamily: 'var(--font-poppins)',
            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 2px 10px rgba(198,40,40,0.06)'
          }}>
            <LogOut size={18} /> Logout from Account
          </button>

        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        active="profile"
        onHome={onHome}
        onTrips={onTrips}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </div>
  );
};

export default ProfileScreen;
