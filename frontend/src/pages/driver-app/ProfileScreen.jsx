import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Truck, CreditCard, FileText,
  ChevronRight, Settings, Globe, HelpCircle,
  LogOut, Edit2, Shield, Phone, Award, TrendingUp, Check, X, Camera, Save, Mail, MapPin
} from 'lucide-react';
import BottomNav from './BottomNav';
import { t, getLanguage, setLanguage } from '../../utils/translations';

const ProfileScreen = ({ onBack, onLogout, onHome, onTrips, onNotifications, onProfile }) => {
  const getInitialDriverData = () => {
    try {
      const savedUserStr = localStorage.getItem('cargolink_user') || localStorage.getItem('cargolink_driver_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const currentUser = savedUser?.user || savedUser;

      const savedProfileStr = localStorage.getItem('cargolink_driver_profile');
      const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : {};

      const name = currentUser?.fullName || currentUser?.name || savedUser?.name || savedUser?.fullName || savedProfile.name || savedProfile.fullName || 'Driver';
      const phone = savedProfile.phone || currentUser?.mobile || currentUser?.phone || savedUser?.phone || '+91 98765 43210';
      const email = savedProfile.email || currentUser?.email || savedUser?.email || 'driver@cargolink.ai';
      const address = savedProfile.address || '124, Truckers Colony, Salem, TN';
      const driverId = savedProfile.driverId || currentUser?.driverId || 'CL-8492';
      const photo = savedProfile.photo || 'https://i.pravatar.cc/150?img=11';

      const currentLangCode = getLanguage();
      const language = currentLangCode === 'ta' ? 'தமிழ் (Tamil)' : 'English';

      return { name, driverId, phone, email, address, language, photo };
    } catch (e) {
      return {
        name: 'Driver',
        driverId: 'CL-8492',
        phone: '+91 98765 43210',
        email: 'driver@cargolink.ai',
        address: '124, Truckers Colony, Salem, TN',
        language: 'English',
        photo: 'https://i.pravatar.cc/150?img=11'
      };
    }
  };

  const [profile, setProfile] = useState(getInitialDriverData);
  const [currentLang, setCurrentLang] = useState(getLanguage);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const languages = ['English', 'தமிழ் (Tamil)'];

  useEffect(() => {
    setEditForm({ ...profile });
  }, [profile]);

  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail?.language) {
        setCurrentLang(e.detail.language);
      }
    };
    window.addEventListener('cargolink_lang_updated', handleLangChange);
    return () => window.removeEventListener('cargolink_lang_updated', handleLangChange);
  }, []);

  const handleSaveProfile = () => {
    setErrorMsg('');
    if (!editForm.name.trim()) {
      setErrorMsg(t('nameRequired', currentLang));
      return;
    }
    if (!editForm.phone.trim() || editForm.phone.replace(/\D/g, '').length < 10) {
      setErrorMsg(t('phoneRequired', currentLang));
      return;
    }
    if (!editForm.email.includes('@')) {
      setErrorMsg(t('emailRequired', currentLang));
      return;
    }
    if (!editForm.address.trim()) {
      setErrorMsg(t('addressRequired', currentLang));
      return;
    }

    const updated = { ...editForm };
    setProfile(updated);

    try {
      // Save profile object
      localStorage.setItem('cargolink_driver_profile', JSON.stringify(updated));

      // Also update cargolink_user & cargolink_driver_user for global consistency
      const userStr = localStorage.getItem('cargolink_user');
      if (userStr) {
        const uObj = JSON.parse(userStr);
        uObj.name = updated.name;
        uObj.fullName = updated.name;
        if (uObj.user) {
          uObj.user.fullName = updated.name;
        }
        localStorage.setItem('cargolink_user', JSON.stringify(uObj));
      }

      const dUserStr = localStorage.getItem('cargolink_driver_user');
      if (dUserStr) {
        const dObj = JSON.parse(dUserStr);
        dObj.name = updated.name;
        dObj.fullName = updated.name;
        localStorage.setItem('cargolink_driver_user', JSON.stringify(dObj));
      }

      // Dispatch global event so header and dashboards instantly update name & data
      window.dispatchEvent(new CustomEvent('cargolink_user_updated', {
        detail: { name: updated.name, fullName: updated.name, profile: updated }
      }));
    } catch (e) {}

    setSuccessMsg(t('profileUpdated', currentLang));
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

  const handleSelectLanguage = (selectedLangStr) => {
    const langCode = selectedLangStr.includes('Tamil') || selectedLangStr === 'ta' ? 'ta' : 'en';
    setLanguage(langCode);
    setCurrentLang(langCode);

    const updated = { ...profile, language: selectedLangStr };
    setProfile(updated);
    setEditForm({ ...editForm, language: selectedLangStr });

    try {
      localStorage.setItem('cargolink_driver_profile', JSON.stringify(updated));
    } catch (e) {}
    setShowLangPicker(false);
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
            <h3 className="text-poppins font-bold text-brown" style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
              {t('selectLanguage', currentLang)}
            </h3>
            {languages.map((langStr, i) => (
              <div key={i} onClick={() => handleSelectLanguage(langStr)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 0', borderBottom: i < languages.length - 1 ? '1px solid #F0EAE3' : 'none',
                  cursor: 'pointer'
                }}>
                <span className="text-poppins font-medium text-brown" style={{ fontSize: '0.9rem' }}>{langStr}</span>
                {profile.language === langStr && <Check size={18} color="var(--primary-brown)" />}
              </div>
            ))}
            <button onClick={() => setShowLangPicker(false)} className="btn-beige" style={{ marginTop: '1rem', color: 'var(--primary-brown)' }}>
              {t('cancel', currentLang)}
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
              <h3 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '1.1rem' }}>
                {t('editProfile', currentLang)}
              </h3>
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
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>{t('driverProfile', currentLang)}</label>
                <input className="input-premium" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>{t('mobile', currentLang)}</label>
                <input className="input-premium" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>{t('email', currentLang)}</label>
                <input className="input-premium" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>{t('address', currentLang)}</label>
                <input className="input-premium" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
              </div>
              <div>
                <label className="text-poppins font-bold text-brown" style={{ fontSize: '0.75rem' }}>{t('preferredLanguage', currentLang)}</label>
                <select
                  className="input-premium"
                  value={editForm.language}
                  onChange={e => handleSelectLanguage(e.target.value)}
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
                {t('cancel', currentLang)}
              </button>
              <button type="button" className="btn-brown" onClick={handleSaveProfile} style={{ flex: 1.5, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Save size={16} /> {t('saveChanges', currentLang)}
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
        <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.1rem', margin: 0 }}>
          {t('driverProfile', currentLang)}
        </h2>
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
              <Edit2 size={15} /> {t('editProfile', currentLang)}
            </button>

            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px auto', border: '3px solid var(--secondary-beige)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <img src={profile.photo} alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h2 className="text-poppins font-bold text-brown" style={{ fontSize: '1.2rem', margin: '0 0 2px 0' }}>{profile.name}</h2>
            <p className="text-poppins font-medium text-primary" style={{ fontSize: '0.8rem', margin: '0 0 8px 0' }}>{t('driverId', currentLang)}: {profile.driverId}</p>

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
              { label: t('completedTrips', currentLang), val: '248', icon: <Award size={18} color="#8B5E3C" /> },
              { label: t('totalEarnings', currentLang), val: '₹22,400', icon: <TrendingUp size={18} color="#2E7D32" /> },
              { label: t('safetyRating', currentLang), val: '98%', icon: <Shield size={18} color="#1565C0" /> },
            ].map((st, i) => (
              <div key={i} className="premium-card" style={{ padding: '0.75rem', textAlign: 'center', marginBottom: 0 }}>
                {st.icon}
                <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.88rem', margin: '4px 0 2px 0' }}>{st.val}</p>
                <p className="text-poppins text-brown" style={{ fontSize: '0.65rem', margin: 0, opacity: 0.6 }}>{st.label}</p>
              </div>
            ))}
          </div>

          {/* Preferences & Settings */}
          <h4 className="text-poppins font-bold text-brown" style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem' }}>
            {t('appSettings', currentLang)}
          </h4>
          <div className="premium-card" style={{ padding: '0.5rem 1rem', marginBottom: '1.25rem' }}>
            <div onClick={() => setShowLangPicker(true)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', cursor: 'pointer' }}>
              <span className="text-poppins font-medium text-brown" style={{ fontSize: '0.88rem' }}>
                {t('preferredLanguage', currentLang)}
              </span>
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
            <LogOut size={18} /> {t('logout', currentLang)}
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

