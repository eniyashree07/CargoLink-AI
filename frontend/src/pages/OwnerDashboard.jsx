import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Users, Map, Bell, BarChart2, User, LogOut,
  Truck, Plus, UserPlus, Navigation2, Search, ChevronRight, ChevronLeft,
  AlertTriangle, CheckCircle2, Clock, TrendingUp, TrendingDown, Sparkles,
  X, Star, Activity, RefreshCw, ArrowRight, Zap, Settings, MapPin, Calendar, Info, Phone,
  Building, Mail, PhoneCall, Shield, Lock, Globe, Moon, Edit, LifeBuoy,
  Sun, Eye, EyeOff, Camera, Save, Palette, Type, Volume2, VolumeX, Monitor, Smartphone
} from 'lucide-react';
import './OwnerDashboard.css';
import { dashboardService } from '../services/dashboardService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';

/* ─── Static data (initially empty — populated from API) ──────────────── */
const ACTIVE_TRIPS = [];
const DRIVERS = [];
const NOTIFICATIONS = [];
const FULL_NOTIFICATIONS = [];

const SIDEBAR_ITEMS = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'loads',         icon: Package,         label: 'Create Load' },
  { id: 'ai',            icon: Sparkles,        label: 'AI Recommendation' },
  { id: 'assign',        icon: UserPlus,        label: 'Assign Driver' },
  { id: 'trips',         icon: Truck,           label: 'Trips' },
  { id: 'tracking',      icon: Map,             label: 'Live Tracking' },
  { id: 'drivers',       icon: Users,           label: 'Drivers', badge: '24 Active' },
  { id: 'notifications', icon: Bell,            label: 'Notifications', badge: '4' },
  { id: 'analytics',     icon: BarChart2,       label: 'Analytics' },
  { id: 'profile',       icon: User,            label: 'Profile' },
  { id: 'settings',      icon: Settings,        label: 'Settings' },
];

const FLOW_STEPS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'loads', label: 'Create Load' },
  { id: 'ai', label: 'AI Recommendation' },
  { id: 'assign', label: 'Assign Driver' },
  { id: 'trips', label: 'Trips' },
  { id: 'tracking', label: 'Live Tracking' },
  { id: 'drivers', label: 'Drivers' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
];

const TRANSLATIONS = {
  'en-US': {
    dashboard: 'Dashboard', loads: 'Create Load', ai: 'AI Recommendation', assign: 'Assign Driver',
    trips: 'Trips', tracking: 'Live Tracking', drivers: 'Drivers', notifications: 'Notifications',
    analytics: 'Analytics', profile: 'Profile', settings: 'Settings', logout: 'Logout',
    mainMenu: 'Main Menu', management: 'Management', account: 'Account',
    goodEvening: 'Good Evening', welcomeBack: 'Welcome back,', activeTrips: 'Active Trips',
    thisMonth: 'This Month', onTimeSla: 'On-Time SLA', fleetAnalytics: 'Fleet Analytics Overview',
    fullReport: 'Full Report', pendingLoads: 'Pending Loads', availableDrivers: 'Available Drivers',
    completedDeliveries: 'Completed Deliveries', quickActions: 'Quick Actions', publishLoad: 'Publish a new load',
    matchDriver: 'Match driver to load', trackTrips: 'Track Trips', liveGpsView: 'Live GPS fleet view',
    manageDrivers: 'Manage fleet drivers', aiFleetStatus: 'AI Fleet Status', coPilotActive: 'Autonomous Co-Pilot Active',
    monitoring: 'Monitoring', fleetNotifications: 'Fleet Notifications', fleetDrivers: 'Fleet Drivers',
    priorityLoad: 'Priority Load', companyProfile: 'Company Profile', editProfile: 'Edit Profile',
    saveProfile: 'Save Profile', cancel: 'Cancel', owner: 'Owner', phone: 'Phone', email: 'Email',
    gstNumber: 'GST Number', companyAddress: 'Company Address', help: 'Help'
  },
  'ta': {
    dashboard: 'முகப்பு', loads: 'சரக்கு பதிவு', ai: 'AI சிபாரிசு', assign: 'ஓட்டுநர் ஒதுக்கீடு',
    trips: 'பயணங்கள்', tracking: 'நேரடி கண்காணிப்பு', drivers: 'ஓட்டுநர்கள்', notifications: 'அறிவிப்புகள்',
    analytics: 'பகுப்பாய்வு', profile: 'சுயவிவரம்', settings: 'அமைப்புகள்', logout: 'வெளியேறு',
    mainMenu: 'முதன்மை மெனு', management: 'மேலாண்மை', account: 'கணக்கு',
    goodEvening: 'வணக்கம்', welcomeBack: 'நல்வரவு,', activeTrips: 'செயலில் உள்ள பயணங்கள்',
    thisMonth: 'இந்த மாதம்', onTimeSla: 'நேரத்திற்கு டெலிவரி', fleetAnalytics: 'வாகன பகுப்பாய்வு',
    fullReport: 'முழு அறிக்கை', pendingLoads: 'நிலுவையில் உள்ள லோடுகள்', availableDrivers: 'கிடைக்கும் ஓட்டுநர்கள்',
    completedDeliveries: 'முடிக்கப்பட்ட டெலிவரிகள்', quickActions: 'விரைவு செயல்பாடுகள்', publishLoad: 'புதிய லோடு உருவாக்கு',
    matchDriver: 'ஓட்டுநரை நியமி', trackTrips: 'பயணங்களை கண்கானி', liveGpsView: 'நேரடி ஜிபிஎஸ் வரைபடம்',
    manageDrivers: 'ஓட்டுநர்களை நிர்வகி', aiFleetStatus: 'AI வாகன நிலை', coPilotActive: 'தன்னியக்க AI செயலில் உள்ளது',
    monitoring: 'கண்காணிக்கிறது', fleetNotifications: 'வாகன அறிவிப்புகள்', fleetDrivers: 'வாகன ஓட்டுநர்கள்',
    priorityLoad: 'முக்கிய பயணம்', companyProfile: 'நிறுவன சுயவிவரம்', editProfile: 'சுயவிவரம் திருத்து',
    saveProfile: 'சுயவிவரம் சேமி', cancel: 'ரத்து செய்', owner: 'உரிமையாளர்', phone: 'தொலைபேசி', email: 'மின்னஞ்சல்',
    gstNumber: 'ஜிஎஸ்டி எண்', companyAddress: 'நிறுவன முகவரி', help: 'உதவி'
  },
  'hi': {
    dashboard: 'डैशबोर्ड', loads: 'लोड बनाएं', ai: 'AI सिफारिश', assign: 'ड्राइवर असाइन करें',
    trips: 'यात्राएं', tracking: 'लाइव ट्रैकिंग', drivers: 'ड्राइवर', notifications: 'सूचनाएं',
    analytics: 'विश्लेषण', profile: 'प्रोफाइल', settings: 'सेटिंग्स', logout: 'लॉग आउट',
    mainMenu: 'मुख्य मेनू', management: 'प्रबंधन', account: 'खाता',
    goodEvening: 'शुभ संध्या', welcomeBack: 'वापसी पर स्वागत है,', activeTrips: 'सक्रिय यात्राएं',
    thisMonth: 'इस महीने', onTimeSla: 'समय पर डिलीवरी', fleetAnalytics: 'फ्लीट विश्लेषण',
    fullReport: 'पूरी रिपोर्ट', pendingLoads: 'लंबित लोड', availableDrivers: 'उपलब्ध ड्राइवर',
    completedDeliveries: 'पूर्ण डिलीवरी', quickActions: 'त्वरित कार्रवाई', publishLoad: 'नया लोड प्रकाशित करें',
    matchDriver: 'ड्राइवर का मिलान करें', trackTrips: 'यात्राएं ट्रैक करें', liveGpsView: 'लाइव जीपीएस व्यू',
    manageDrivers: 'ड्राइवरों को प्रबंधित करें', aiFleetStatus: 'AI फ्लीट स्थिति', coPilotActive: 'स्वचालित सह-पायलट सक्रिय',
    monitoring: 'निगरानी', fleetNotifications: 'फ्लीट सूचनाएं', fleetDrivers: 'फ्लीट ड्राइवर',
    priorityLoad: 'प्राथमिकता लोड', companyProfile: 'कंपनी प्रोफाइल', editProfile: 'प्रोफाइल संपादित करें',
    saveProfile: 'प्रोफाइल सहेजें', cancel: 'रद्द करें', owner: 'मालिक', phone: 'फोन', email: 'ईमेल',
    gstNumber: 'जीएसटी नंबर', companyAddress: 'कंपनी का पता', help: 'सहायता'
  },
  'te': {
    dashboard: 'డాష్‌బోర్డ్', loads: 'లోడ్ సృష్టించు', ai: 'AI సిఫార్సు', assign: 'డ్రైవర్ కేటాయించు',
    trips: 'ట్రిప్పులు', tracking: 'లైవ్ ట్రాకింగ్', drivers: 'డ్రైవర్లు', notifications: 'నోటిఫికేషన్లు',
    analytics: 'విశ్లేషణ', profile: 'ప్రొఫైల్', settings: 'సెట్టింగ్‌లు', logout: 'లాగ్‌అవుట్',
    mainMenu: 'ముఖ్యమైన మెనూ', management: 'నిర్వహణ', account: 'ఖాతా',
    goodEvening: 'శుభ సాయంత్రం', welcomeBack: 'స్వాగతం,', activeTrips: 'యాక్టివ్ ట్రిప్పులు',
    thisMonth: 'ఈ నెల', onTimeSla: 'సమయానికి డెలివరీ', fleetAnalytics: 'ఫ్లీట్ విశ్లేషణ',
    fullReport: 'పూర్తి నివేదిక', pendingLoads: 'పెండింగ్ లోడ్‌లు', availableDrivers: 'అందుబాటులో ఉన్న డ్రైవర్లు',
    completedDeliveries: 'పూర్తయిన డెలివరీలు', quickActions: 'త్వరిత చర్యలు', publishLoad: 'కొత్త లోడ్ ప్రచురించు',
    matchDriver: 'డ్రైవర్‌ను కేటాయించు', trackTrips: 'ట్రిప్పులను ట్రాక్ చేయి', liveGpsView: 'లైవ్ జిపిఎస్ వీక్షణ',
    manageDrivers: 'డ్రైవర్లను నిర్వహించు', aiFleetStatus: 'AI ఫ్లీట్ స్థితి', coPilotActive: 'AI కో-పైలట్ యాక్టివ్‌లో ఉంది',
    monitoring: 'పర్యవేక్షిస్తోంది', fleetNotifications: 'ఫ్లీట్ నోటిఫికేషన్లు', fleetDrivers: 'ఫ్లీట్ డ్రైవర్లు',
    priorityLoad: 'ప్రాధాన్యత లోడ్', companyProfile: 'సంస్థ ప్రొఫైల్', editProfile: 'ప్రొఫైల్ సవరించు',
    saveProfile: 'ప్రొఫైల్ సేవ్ చేయి', cancel: 'రద్దు చేయి', owner: 'యజమాని', phone: 'ఫోన్', email: 'ఇమెయిల్',
    gstNumber: 'GST నంబర్', companyAddress: 'సంస్థ చిరునామా', help: 'సహాయం'
  },
  'kn': {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', loads: 'ಲೋಡ್ ರಚಿಸಿ', ai: 'AI ಶಿಫಾರಸು', assign: 'ಚಾಲಕನನ್ನು ನೇಮಿಸಿ',
    trips: 'ಪ್ರಯಾಣಗಳು', tracking: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್', drivers: 'ಚಾಲಕರು', notifications: 'ಸೂಚನೆಗಳು',
    analytics: 'ವಿಶ್ಲೇಷಣೆ', profile: 'ಪ್ರೊಫೈಲ್', settings: 'ಸಂಯೋಜನೆಗಳು', logout: 'ನಿರ್ಗಮನ',
    mainMenu: 'ಮುಖ್ಯ ಮೆನು', management: 'ನಿರ್ವಹಣೆ', account: 'ಖಾತೆ',
    goodEvening: 'ಶುಭ ಸಂಜೆ', welcomeBack: 'ಸ್ವಾಗತ,', activeTrips: 'ಸಕ್ರಿಯ ಪ್ರಯಾಣಗಳು',
    thisMonth: 'ಈ ತಿಂಗಳು', onTimeSla: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ವಿತರಣೆ', fleetAnalytics: 'ಫ್ಲೀಟ್ ವಿಶ್ಲೇಷಣೆ',
    fullReport: 'ಸಂಪೂರ್ಣ ವರದಿ', pendingLoads: 'ಪೆಂಡಿಂಗ್ ಲೋಡ್‌ಗಳು', availableDrivers: 'ಲಭ್ಯವಿರುವ ಚಾಲಕರು',
    completedDeliveries: 'ಪೂರ್ಣಗೊಂಡ ವಿತರಣೆಗಳು', quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು', publishLoad: 'ಹೊಸ ಲೋಡ್ ಪ್ರಕಟಿಸಿ',
    matchDriver: 'ಚಾಲಕನನ್ನು ಆಯ್ಕೆಮಾಡಿ', trackTrips: 'ಪ್ರಯಾಣಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', liveGpsView: 'ಲೈವ್ GPS ವೀಕ್ಷಣೆ',
    manageDrivers: 'ಚಾಲಕರನ್ನು ನಿರ್ವಹಿಸಿ', aiFleetStatus: 'AI ಫ್ಲೀಟ್ ಸ್ಥಿತಿ', coPilotActive: 'ಸ್ವಯಂಚಾಲಿತ AI ಸಕ್ರಿಯವಾಗಿದೆ',
    monitoring: 'ಮೇಲ್ವಿಚಾರಣೆ', fleetNotifications: 'ಫ್ಲೀಟ್ ಸೂಚನೆಗಳು', fleetDrivers: 'ಫ್ಲೀಟ್ ಚಾಲಕರು',
    priorityLoad: 'ಆದ್ಯತೆಯ ಲೋಡ್', companyProfile: 'ಸಂಸ್ಥೆಯ ಪ್ರೊಫೈಲ್', editProfile: 'ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ',
    saveProfile: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ', cancel: 'ರದ್ದುಗೊಳಿಸಿ', owner: 'ಮಾಲೀಕರು', phone: 'ಫೋನ್', email: 'ಇಮೇಲ್',
    gstNumber: 'GST ಸಂಖ್ಯೆ', companyAddress: 'ಸಂಸ್ಥೆಯ ವಿಳಾಸ', help: 'ಸಹಾಯ'
  }
};

/* ─── Status helpers ───────────────────────────────────────────────────── */
const STATUS_LABEL = { 'in-transit': 'In Transit', pending: 'Pending Driver', delayed: 'Delayed', completed: 'Completed' };
const STATUS_CLASS = { 'in-transit': 'in-transit', pending: 'pending', delayed: 'delayed', completed: 'completed' };

const NotifIcon = ({ type }) => {
  const icons = {
    info:    <Bell    size={16} />,
    warning: <AlertTriangle size={16} />,
    success: <CheckCircle2 size={16} />,
    danger:  <AlertTriangle size={16} />,
  };
  return <div className={`od-notif-icon-box ${type}`}>{icons[type] || icons.info}</div>;
};

/* ═══════════════════════════════════════════════════════════════
   1. CREATE LOAD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const CreateLoadView = ({ setActiveNav, onLoadCreated }) => {
  const [formData, setFormData] = useState({
    pickup: '', dropoff: '', goodsType: '', weight: '', truckType: '',
    pickupDate: '', pickupTime: '', deliveryDate: '', deliveryTime: '', instructions: ''
  });
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const savedUser = localStorage.getItem('cargolink_owner_user') || localStorage.getItem('cargolink_user');
      let cargoOwnerId = null;
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        cargoOwnerId = parsed.id || parsed._id || parsed.user?.id || parsed.user?._id;
      }
      if (!cargoOwnerId) {
        throw new Error('Owner profile not found. Please log in again.');
      }
      await tripService.createTrip({
        origin: formData.pickup,
        destination: formData.dropoff,
        cargoType: formData.goodsType,
        weight: parseFloat(formData.weight),
        truckType: formData.truckType,
        status: 'PENDING',
        cargoOwnerId,
        distance: Math.floor(Math.random() * 500 + 50),
        estimatedDuration: Math.floor(Math.random() * 10 + 2),
        cost: parseFloat(formData.weight) * (Math.floor(Math.random() * 20 + 10))
      });
      setAssignedSuccess(true);
      setIsSubmitting(false);
      if (onLoadCreated) onLoadCreated();
      setTimeout(() => {
        setAssignedSuccess(false);
        if (setActiveNav) setActiveNav('ai');
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      alert('Failed to create load. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({ pickup: '', dropoff: '', goodsType: '', weight: '', truckType: '', pickupDate: '', pickupTime: '', deliveryDate: '', deliveryTime: '', instructions: '' });
    setAssignedSuccess(false);
  };

  return (
    <div className="od-create-load-page">
      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="od-section-title">Create New Load</h2>
          <p className="od-page-sub">Enter shipment details to create a new transport request.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('dashboard')}>← Dashboard</button>
          <button type="button" className="od-btn primary" onClick={() => setActiveNav && setActiveNav('ai')}>AI Recommendation →</button>
        </div>
      </div>

      {assignedSuccess && (
        <div className="od-cl-success-banner" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={20} color="var(--ow-success)" />
          <span>Load created successfully! Redirecting to AI Driver Recommendation...</span>
        </div>
      )}

      <form className="od-cl-form" onSubmit={handleSubmit}>
        <div className="od-card od-cl-card">
          <div className="od-form-row">
            <div className="od-form-group">
              <label className="od-form-label"><MapPin size={14}/> Pickup Location *</label>
              <input required className="od-form-input" placeholder="e.g. Coimbatore ICD Port" value={formData.pickup} onChange={e=>setFormData({...formData, pickup: e.target.value})} />
            </div>
            <div className="od-form-group">
              <label className="od-form-label"><MapPin size={14}/> Delivery Location *</label>
              <input required className="od-form-input" placeholder="e.g. Chennai Port Terminal 2" value={formData.dropoff} onChange={e=>setFormData({...formData, dropoff: e.target.value})} />
            </div>
          </div>
          
          <div className="od-form-row">
            <div className="od-form-group">
              <label className="od-form-label"><Package size={14}/> Goods Type *</label>
              <input required className="od-form-input" placeholder="e.g. Industrial Equipment" value={formData.goodsType} onChange={e=>setFormData({...formData, goodsType: e.target.value})} />
            </div>
            <div className="od-form-group">
              <label className="od-form-label">Load Weight (Tons) *</label>
              <input required type="number" className="od-form-input" placeholder="e.g. 12" value={formData.weight} onChange={e=>setFormData({...formData, weight: e.target.value})} />
            </div>
          </div>

          <div className="od-form-group">
            <label className="od-form-label"><Truck size={14}/> Truck Type *</label>
            <select required className="od-form-select" value={formData.truckType} onChange={e=>setFormData({...formData, truckType: e.target.value})}>
              <option value="">Select Truck Type</option>
              <option value="Open container">Open container</option>
              <option value="Closed container">Closed container</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Refrigerated">Refrigerated</option>
            </select>
          </div>

          <div className="od-form-row">
            <div className="od-form-group">
              <label className="od-form-label"><Calendar size={14}/> Pickup Date *</label>
              <input required type="date" className="od-form-input" value={formData.pickupDate} onChange={e=>setFormData({...formData, pickupDate: e.target.value})} />
            </div>
            <div className="od-form-group">
              <label className="od-form-label"><Clock size={14}/> Pickup Time *</label>
              <input required type="time" className="od-form-input" value={formData.pickupTime} onChange={e=>setFormData({...formData, pickupTime: e.target.value})} />
            </div>
          </div>

          <div className="od-form-row">
            <div className="od-form-group">
              <label className="od-form-label"><Calendar size={14}/> Delivery Date *</label>
              <input required type="date" className="od-form-input" value={formData.deliveryDate} onChange={e=>setFormData({...formData, deliveryDate: e.target.value})} />
            </div>
            <div className="od-form-group">
              <label className="od-form-label"><Clock size={14}/> Expected Delivery Time *</label>
              <input required type="time" className="od-form-input" value={formData.deliveryTime} onChange={e=>setFormData({...formData, deliveryTime: e.target.value})} />
            </div>
          </div>

          <div className="od-form-group">
            <label className="od-form-label"><Info size={14}/> Special Instructions (Optional)</label>
            <textarea className="od-form-input" rows={3} placeholder="Any specific handling instructions..." value={formData.instructions} onChange={e=>setFormData({...formData, instructions: e.target.value})} />
          </div>

          <div className="od-cl-actions">
            <button type="button" className="od-btn ghost" onClick={handleReset}>Reset</button>
            <button type="button" className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('dashboard')}>Cancel</button>
            <button type="submit" className="od-btn primary">Create Load &amp; Get AI Recommendation →</button>
          </div>
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button type="button" className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('dashboard')}>← Back to Dashboard</button>
        <button type="button" className="od-btn primary" onClick={() => setActiveNav && setActiveNav('ai')}>Proceed to AI Recommendation →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   2. AI DRIVER RECOMMENDATION VIEW
   ═══════════════════════════════════════════════════════════════ */
const AIDriverRecommendationView = ({ setActiveNav, drivers }) => {
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleAssign = (driver) => {
    setSelectedDriver(driver.name);
    setAssignedSuccess(true);
    setTimeout(() => { 
      setAssignedSuccess(false); 
      setSelectedDriver(null); 
      if (setActiveNav) setActiveNav('assign');
    }, 1200);
  };

  return (
    <div className="od-create-load-page" style={{ maxWidth: 1000 }}>
      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Sparkles size={24} color="var(--ow-brown)" />
            <h2 className="od-section-title" style={{ margin: 0 }}>AI Driver Recommendation</h2>
          </div>
          <p className="od-page-sub">AI has analyzed all available drivers for your recently created loads based on location, truck type, and ratings.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('loads')}>← Create Load</button>
          <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('assign')}>Assign Driver →</button>
        </div>
      </div>

      <div className="od-card" style={{ padding: 24, marginBottom: 24, borderLeft: '4px solid var(--ow-brown)' }}>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--ow-text-dark)' }}>Pending Load: TR-8102 (Salem → Kochi)</h4>
        <div style={{ display: 'flex', gap: 24, fontSize: '0.85rem', color: 'var(--ow-text-muted)' }}>
          <div><strong>Cargo:</strong> Industrial Equipment (12 Tons)</div>
          <div><strong>Required Truck:</strong> Open container</div>
          <div><strong>Pickup:</strong> Tomorrow, 10:00 AM</div>
        </div>
      </div>

      {assignedSuccess && (
        <div className="od-cl-success-banner" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={20} color="var(--ow-success)" />
          <span>Driver {selectedDriver} recommended &amp; selected. Proceeding to Assign Driver...</span>
        </div>
      )}

      <div className="od-driver-cards-grid">
        {(drivers.length > 0 ? drivers : DRIVERS).slice(0, 3).map((d, i) => (
          <div key={i} className="od-card od-cl-driver-card">
            <div className="od-cl-driver-top">
              <div className="od-driver-avatar lg">{d.initials}</div>
              <div className="od-cl-driver-info">
                <h4>{d.name}</h4>
                <div className="od-driver-rating"><Star size={13} fill="var(--ow-brown)" color="var(--ow-brown)"/> {d.rating}</div>
              </div>
              <div className="od-cl-driver-status">{d.status === 'Available for Dispatch' ? 'Available' : 'Available Soon'}</div>
            </div>
            
            <div className="od-cl-driver-meta" style={{ marginTop: 8 }}>
              <div className="meta-item"><span>Truck No:</span> TN 38 XX 000{i + 1}</div>
              <div className="meta-item"><span>Vehicle:</span> Open container (15T)</div>
              <div className="meta-item"><span>Distance:</span> {12 + i * 5} KM from pickup</div>
              <div className="meta-item"><span>ETA:</span> {25 + i * 10} mins</div>
            </div>
            
            <div className="od-cl-driver-actions">
              <button className="od-btn ghost sm" onClick={() => setActiveNav && setActiveNav('drivers')}>View Driver</button>
              <button className="od-btn primary sm" onClick={() => handleAssign(d)}>Assign Driver</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('loads')}>← Back to Create Load</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('assign')}>Proceed to Assign Driver →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   3. ASSIGN DRIVER VIEW
   ═══════════════════════════════════════════════════════════════ */
const AssignDriverView = ({ setActiveNav, drivers, trips, onRefresh }) => {
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const pendingTrips = trips.filter(t => {
    const s = (t.status || '').toUpperCase();
    return s === 'PENDING';
  });

  useEffect(() => {
    if (pendingTrips.length > 0 && !selectedTripId) {
      setSelectedTripId(pendingTrips[0]._id || pendingTrips[0].id);
    }
  }, [pendingTrips]);

  const getDriverId = (driver) => {
    return driver._id || driver.id || (driver.userId && driver.userId._id) || null;
  };

  const handleAssign = async (driver) => {
    if (!selectedTripId) {
      setAssignError('Please select a trip first');
      return;
    }
    const driverId = getDriverId(driver);
    if (!driverId) {
      setAssignError('Driver ID not found. The driver may not be properly registered.');
      return;
    }
    setIsAssigning(true);
    setAssignError(null);
    try {
      await tripService.assignDriver(selectedTripId, driverId);
      const driverName = driver.userId?.fullName || driver.fullName || driver.name || 'Driver';
      setSelectedDriver(driverName);
      setAssignedSuccess(true);
      if (onRefresh) onRefresh();
      setTimeout(() => {
        setAssignedSuccess(false);
        setSelectedDriver(null);
        setSelectedTripId(null);
        if (setActiveNav) setActiveNav('trips');
      }, 1500);
    } catch (error) {
      setAssignError(error.message || 'Failed to assign driver');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="od-create-load-page" style={{ maxWidth: 1000 }}>
      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <UserPlus size={24} color="var(--ow-brown)" />
            <h2 className="od-section-title" style={{ margin: 0 }}>Assign Driver</h2>
          </div>
          <p className="od-page-sub">Select a pending trip and assign an available driver.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('ai')}>← AI Recommendation</button>
          <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('trips')}>Fleet Trips →</button>
        </div>
      </div>

      {assignError && (
        <div className="od-cl-success-banner" style={{ marginBottom: 20, background: '#FEF2F2', color: 'var(--ow-danger)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={20} />
          <span>{assignError}</span>
        </div>
      )}

      {assignedSuccess && (
        <div className="od-cl-success-banner" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={20} color="var(--ow-success)" />
          <span>Driver {selectedDriver} assigned successfully! Redirecting to Trips...</span>
        </div>
      )}

      {/* Trip Selection */}
      <div className="od-card" style={{ padding: 24, marginBottom: 24, borderLeft: '4px solid var(--ow-brown)' }}>
        <h4 style={{ margin: '0 0 12px', color: 'var(--ow-text-dark)', fontSize: '1rem' }}>Select Pending Trip</h4>
        {pendingTrips.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingTrips.map(trip => {
              const tripId = trip._id || trip.id;
              const isSelected = selectedTripId === tripId;
              return (
                <div
                  key={tripId}
                  onClick={() => { setSelectedTripId(tripId); setAssignError(null); }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${isSelected ? 'var(--ow-brown)' : 'var(--ow-border)'}`,
                    background: isSelected ? 'var(--ow-brown-light)' : 'var(--ow-bg)',
                    cursor: 'pointer', transition: 'var(--transition)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ow-text-dark)', fontSize: '0.9rem' }}>
                      {trip.origin || trip.from || 'N/A'} → {trip.destination || trip.to || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ow-text-muted)', marginTop: 4 }}>
                      {trip.cargoType || 'N/A'} · {trip.weight ? `${trip.weight}T` : 'N/A'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--ow-text-muted)' }}>
                      ₹{trip.amount || trip.price || trip.cost || 'N/A'}
                    </span>
                    {isSelected && <CheckCircle2 size={18} color="var(--ow-brown)" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ow-text-muted)' }}>
            <p>No pending trips available. Create a load first.</p>
          </div>
        )}
      </div>

      {/* Driver Selection */}
      <h4 style={{ margin: '0 0 16px', color: 'var(--ow-text-dark)', fontSize: '1rem' }}>
        Available Drivers {!selectedTripId && <span style={{ fontWeight: 400, fontSize: '0.82rem', color: 'var(--ow-text-light)' }}>(select a trip above)</span>}
      </h4>

      <div className="od-driver-cards-grid">
        {(drivers.length > 0 ? drivers : DRIVERS).map((d, i) => {
          const driverName = d.userId?.fullName || d.fullName || d.name || 'Unknown Driver';
          const initials = driverName.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
          const isAvailable = (d.status || '').toUpperCase() === 'AVAILABLE';
          return (
          <div key={d._id || i} className="od-card od-cl-driver-card" style={{ opacity: isAvailable ? 1 : 0.5 }}>
            <div className="od-cl-driver-top">
              <div className="od-driver-avatar lg">{initials}</div>
              <div className="od-cl-driver-info">
                <h4>{driverName}</h4>
                <div className="od-driver-rating"><Star size={13} fill="var(--ow-brown)" color="var(--ow-brown)"/> {d.rating || 'N/A'}</div>
              </div>
              <div className="od-cl-driver-status" style={{ background: isAvailable ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: isAvailable ? 'var(--ow-success)' : 'var(--ow-danger)' }}>{isAvailable ? 'Available' : d.status === 'ON_TRIP' ? 'On Trip' : d.status || 'Unavailable'}</div>
            </div>
            
            <div className="od-cl-driver-meta" style={{ marginTop: 8 }}>
              <div className="meta-item"><span>Truck No:</span> {d.truckNumber || 'N/A'}</div>
              <div className="meta-item"><span>Vehicle:</span> {d.vehicleType || 'N/A'}</div>
              <div className="meta-item"><span>Status:</span> {isAvailable ? 'Available' : d.status || 'Unavailable'}</div>
            </div>
            
            <div className="od-cl-driver-actions">
              <button className="od-btn ghost sm" onClick={() => setActiveNav && setActiveNav('drivers')}>View Profile</button>
              <button
                className="od-btn primary sm"
                onClick={() => handleAssign(d)}
                disabled={!selectedTripId || !isAvailable || isAssigning}
                style={{ opacity: (!selectedTripId || !isAvailable || isAssigning) ? 0.5 : 1 }}
              >
                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        )})}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('ai')}>← Back to AI Recommendation</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('trips')}>Proceed to Trips →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   4. TRIPS PAGE VIEW
   ═══════════════════════════════════════════════════════════════ */
const TripsPageView = ({ setActiveNav, trips }) => {
  return (
    <div className="od-create-load-page" style={{ maxWidth: 1100 }}>
      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="od-section-title">Fleet Trips</h2>
          <p className="od-page-sub">Monitor all active, pending, and completed trips across your network.</p>
        </div>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('loads')}>+ Create Load</button>
      </div>

      <div className="od-card" style={{ overflowX: 'auto' }}>
        <table className="od-trips-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Driver</th>
              <th>Pickup</th>
              <th>Destination</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(trips.length > 0 ? trips : ACTIVE_TRIPS).map(trip => {
              const tripId = trip.id || trip._id || 'N/A';
              const tripFrom = trip.origin || trip.from || 'N/A';
              const tripTo = trip.destination || trip.to || 'N/A';
              const tripDriver = trip.driver || trip.driverId?.userId?.fullName || trip.driverId?.fullName || 'Unassigned';
              const tripStatus = trip.status === 'IN_TRANSIT' ? 'in-transit' : trip.status === 'PENDING' ? 'pending' : trip.status === 'DELIVERED' ? 'completed' : trip.status === 'DELAYED' ? 'delayed' : (trip.status || 'pending');
              const tripProgress = trip.progress || (tripStatus === 'completed' ? 100 : tripStatus === 'in-transit' ? 50 : 0);
              const tripEta = trip.eta || 'N/A';
              return (
              <tr key={tripId}>
                <td><span className="od-trip-id">{tripId}</span></td>
                <td>
                  <div className="od-driver-cell">
                    <div className="od-driver-mini-avatar">
                      {tripDriver === 'Unassigned' ? '?' : tripDriver.split(' ').map(w=>w[0]).join('')}
                    </div>
                    <span className="od-truncate" style={{ maxWidth: 110, fontWeight: 600 }}>{tripDriver}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{tripFrom}</td>
                <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{tripTo}</td>
                <td>
                  <span className={`od-status-chip ${STATUS_CLASS[tripStatus]}`}>
                    <span className="od-status-dot" />
                    {STATUS_LABEL[tripStatus]}
                  </span>
                </td>
                <td style={{ color: 'var(--ow-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {tripEta}
                </td>
                <td>
                  <div className="od-progress-wrap">
                    <div className="od-progress-bar">
                      <div
                        className={`od-progress-fill ${tripStatus === 'delayed' ? 'warn' : ''}`}
                        style={{ width: `${tripProgress}%` }}
                      />
                    </div>
                    <span className="od-progress-pct">{tripProgress}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {tripStatus !== 'pending' && (
                      <button className="od-btn primary sm" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => setActiveNav && setActiveNav('tracking')}>
                        Track Live
                      </button>
                    )}
                    <button className="od-btn ghost sm" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => setActiveNav && setActiveNav('tracking')}>View</button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('assign')}>← Back to Assign Driver</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('tracking')}>Proceed to Live Tracking →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   5. LIVE TRACKING VIEW
   ═══════════════════════════════════════════════════════════════ */
const LiveTrackingView = ({ setActiveNav, trips }) => {
  const [alertSent, setAlertSent] = useState(false);

  const handleAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 2500);
  };

  return (
    <div className="od-create-load-page" style={{ maxWidth: 1200 }}>
      <div className="od-cl-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="od-icon-btn" onClick={() => setActiveNav && setActiveNav('trips')}><ChevronLeft size={20}/></button>
        <div>
          <h2 className="od-section-title" style={{ margin: 0 }}>Live Tracking: TR-8041</h2>
          <p className="od-page-sub">Ramesh Kumar • TN 37 CZ 4920</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <button className="od-btn ghost" onClick={handleAlert}><Bell size={16} style={{ marginRight: 6 }}/> Alert Driver</button>
          <button className="od-btn primary" onClick={() => alert('Dialing Driver Ramesh Kumar (+91 98765 43210)...')}><Phone size={16} style={{ marginRight: 6 }}/> Call Driver</button>
        </div>
      </div>

      {alertSent && (
        <div className="od-cl-success-banner" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={18} color="var(--ow-success)" />
          <span>High-priority alert sent to Driver Ramesh Kumar.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Map Area */}
        <div className="od-card" style={{ padding: 0, overflow: 'hidden', height: '600px', position: 'relative', background: '#e5e3df' }}>
          <div style={{ width: '100%', height: '100%', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")', opacity: 0.6 }} />
          
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path d="M 200,500 Q 300,450 400,200 T 700,100" fill="none" stroke="var(--ow-brown)" strokeWidth="6" strokeDasharray="12 8" />
            <path d="M 200,500 Q 300,450 350,325" fill="none" stroke="var(--ow-brown)" strokeWidth="6" />
          </svg>

          <div style={{ position: 'absolute', top: 485, left: 185, background: 'var(--ow-white)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ow-brown)' }} /> Coimbatore
          </div>
          
          <div style={{ position: 'absolute', top: 85, left: 690, background: 'var(--ow-white)', padding: '4px 10px', borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ow-success)' }} /> Chennai
          </div>

          <div style={{ position: 'absolute', top: 310, left: 335, background: 'var(--ow-brown)', color: '#fff', padding: '8px 12px', borderRadius: 8, boxShadow: '0 4px 16px rgba(139,94,60,0.4)', fontSize: '1.2rem', animation: 'bounce 2s infinite' }}>
            🚛
          </div>
          
          <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '10px 16px', borderRadius: 12, boxShadow: 'var(--ow-shadow-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--ow-success)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Traffic: Normal</span>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="od-card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}><Navigation2 size={18} color="var(--ow-brown)"/> Trip Status</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ow-text-muted)', fontSize: '0.85rem' }}>Status</span>
                <span className="od-status-chip in-transit"><span className="od-status-dot"/> Live</span>
              </div>
              <div style={{ height: 1, background: 'var(--ow-border)' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ow-text-muted)', fontSize: '0.85rem' }}>Remaining Distance</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ow-text-dark)' }}>60 KM</span>
              </div>
              <div style={{ height: 1, background: 'var(--ow-border)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ow-text-muted)', fontSize: '0.85rem' }}>Estimated Arrival</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ow-success)' }}>04:30 PM</span>
              </div>
              <div style={{ height: 1, background: 'var(--ow-border)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ow-text-muted)', fontSize: '0.85rem' }}>Current Speed</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ow-text-dark)' }}>55 km/h</span>
              </div>
            </div>
          </div>

          <div className="od-card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} color="var(--ow-brown)"/> Driver Info</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="od-driver-avatar lg">RK</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ow-text-dark)' }}>Ramesh Kumar</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--ow-brown)', marginTop: 4 }}>
                  <Star size={12} fill="var(--ow-brown)" /> 4.9 (124 trips)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('trips')}>← Back to Trips</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('drivers')}>Proceed to Drivers →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   6. DRIVERS PAGE VIEW
   ═══════════════════════════════════════════════════════════════ */
const DriversPageView = ({ setActiveNav, drivers }) => {
  return (
    <div className="od-create-load-page" style={{ maxWidth: 1000 }}>
      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="od-section-title">Fleet Drivers</h2>
          <p className="od-page-sub">Manage your drivers, view performance, and track availability.</p>
        </div>
        <button className="od-btn primary" onClick={() => alert('Add Driver module opened. Input details for new fleet driver.')}>+ Add Driver</button>
      </div>

      <div className="od-driver-cards-grid">
        {(drivers.length > 0 ? drivers : DRIVERS).map((d, i) => (
          <div key={i} className="od-card od-cl-driver-card">
            <div className="od-cl-driver-top">
              <div className="od-driver-avatar lg">{d.initials || d.name?.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}</div>
              <div className="od-cl-driver-info">
                <h4>{d.name}</h4>
                <div className="od-driver-rating"><Star size={13} fill="var(--ow-brown)" color="var(--ow-brown)"/> {d.rating || 'N/A'}</div>
              </div>
              <div className="od-cl-driver-status">{d.status?.includes('Available') || d.status === 'AVAILABLE' ? 'Available' : 'On Trip'}</div>
            </div>
            
            <div className="od-cl-driver-meta" style={{ marginTop: 8 }}>
              <div className="meta-item"><span>Status:</span> {d.status}</div>
              <div className="meta-item"><span>Trips:</span> {d.trips || 0} Completed</div>
            </div>
            
            <div className="od-cl-driver-actions">
              <button className="od-btn ghost sm" style={{ flex: 1 }} onClick={() => setActiveNav && setActiveNav('notifications')}>Send Message</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('tracking')}>← Back to Live Tracking</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('notifications')}>Proceed to Notifications →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   7. NOTIFICATIONS PAGE VIEW
   ═══════════════════════════════════════════════════════════════ */
const NotificationsPageView = ({ setActiveNav }) => {
  return (
    <div className="od-create-load-page" style={{ maxWidth: 900 }}>
      <div className="od-cl-header">
        <h2 className="od-section-title">Notifications</h2>
        <p className="od-page-sub">Stay updated with real-time alerts across your fleet operations.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FULL_NOTIFICATIONS.map(n => (
          <div key={n.id} className="od-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, borderLeft: `4px solid ${n.type === 'danger' || n.type === 'warning' ? 'var(--ow-warning)' : n.type === 'success' ? 'var(--ow-success)' : 'var(--ow-brown)'}`, cursor: 'pointer' }} onClick={() => setActiveNav && setActiveNav('analytics')}>
            <NotifIcon type={n.type} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ow-text-dark)' }}>{n.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--ow-text-muted)', fontWeight: 600 }}>{n.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ow-text-light)' }}>{n.desc}</p>
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--ow-bg)', color: n.priority === 'High' ? 'var(--ow-danger)' : 'var(--ow-text-muted)' }}>
              {n.priority} Priority
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('drivers')}>← Back to Drivers</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('analytics')}>Proceed to Analytics →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   8. ANALYTICS PAGE VIEW
   ═══════════════════════════════════════════════════════════════ */
const AnalyticsPageView = ({ setActiveNav, trips, drivers }) => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="od-create-load-page" style={{ maxWidth: 1100 }}>
      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="od-section-title">Analytics Dashboard</h2>
          <p className="od-page-sub">Comprehensive overview of your fleet's performance and revenue.</p>
        </div>
        <div>
          <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('profile')} style={{ marginRight: 12 }}>View Profile</button>
          <button className="od-btn ghost" onClick={() => setTimeRange(timeRange === '30d' ? '7d' : '30d')}>
            <Calendar size={16} style={{ marginRight: 8 }}/> {timeRange === '30d' ? 'Last 30 Days' : 'Last 7 Days'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="od-stats-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[
          { label: 'Total Trips', val: '342', icon: Truck, color: 'var(--ow-brown)' },
          { label: 'Completed Trips', val: '318', icon: CheckCircle2, color: 'var(--ow-success)' },
          { label: 'Pending Trips', val: '14', icon: Clock, color: 'var(--ow-warning)' },
          { label: 'Cancelled Trips', val: '10', icon: X, color: 'var(--ow-danger)' },
          { label: 'Total Revenue', val: '₹14.2L', icon: TrendingUp, color: '#8b5cf6' },
          { label: 'Fuel Saved (AI)', val: '450 L', icon: Activity, color: 'var(--ow-success)' },
          { label: 'CO₂ Saved', val: '1.2 T', icon: Sparkles, color: 'var(--ow-brown)' },
        ].map((stat, i) => (
          <div key={i} className="od-stat-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ background: `${stat.color}15`, color: stat.color, padding: 8, borderRadius: 8 }}>
                <stat.icon size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--ow-text-muted)', fontWeight: 600 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ow-text-dark)' }}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        
        {/* Monthly Trips Chart */}
        <div className="od-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}>Monthly Trips</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, borderBottom: '1px solid var(--ow-border)', paddingBottom: 10 }}>
            {[45, 60, 55, 80, 75, 90, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, var(--ow-brown), var(--ow-beige))', height: `${h}%`, borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--ow-text-muted)' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Success Rate */}
        <div className="od-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}>Delivery Success Rate</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'On-Time Deliveries', pct: 94, color: 'var(--ow-success)' },
              { label: 'Delayed Deliveries', pct: 4, color: 'var(--ow-warning)' },
              { label: 'Failed/Cancelled', pct: 2, color: 'var(--ow-danger)' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>{item.label}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="od-progress-bar" style={{ height: 8, background: 'var(--ow-bg)' }}>
                  <div className="od-progress-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Performance */}
        <div className="od-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}>Driver Performance (Top 3)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DRIVERS.slice(0, 3).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="od-driver-avatar">{d.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ow-text-dark)' }}>{d.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ow-text-muted)' }}>{120 - i * 15} trips completed</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--ow-brown)' }}>
                  <Star size={14} fill="var(--ow-brown)" /> {d.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="od-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}>Monthly Revenue (₹ Lakhs)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, borderBottom: '1px solid var(--ow-border)', paddingBottom: 10 }}>
            {[1.2, 1.8, 1.6, 2.4, 2.1, 2.8, 2.6].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #8b5cf6, rgba(139,92,246,0.3))', height: `${(h/3)*100}%`, borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--ow-text-muted)' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('notifications')}>← Back to Notifications</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('profile')}>Proceed to Profile →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   9. PROFILE PAGE VIEW
   ═══════════════════════════════════════════════════════════════ */
const ProfilePageView = ({ setActiveNav, profileData, setProfileData, t = (k) => k }) => {
  const [toastMsg, setToastMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profileData);

  useEffect(() => {
    setEditForm(profileData);
  }, [profileData]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    setProfileData(editForm);
    setIsEditing(false);
    triggerToast('✅ Profile updated successfully!');
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid var(--ow-border)', background: 'var(--ow-bg)',
    fontFamily: 'var(--font)', fontSize: '0.9rem', color: 'var(--ow-text-dark)',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div className="od-create-load-page" style={{ maxWidth: 800 }}>
      <div className="od-cl-header">
        <h2 className="od-section-title">{t('companyProfile')}</h2>
        <p className="od-page-sub">Manage your company details and business information.</p>
      </div>

      {toastMsg && (
        <div className="od-cl-success-banner" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={18} color="var(--ow-success)" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="od-card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--ow-border)' }}>
          <div className="od-profile-avatar" style={{ width: 80, height: 80, fontSize: '2rem' }}>
            {profileData.companyName.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', color: 'var(--ow-text-dark)' }}>{profileData.companyName}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ow-text-muted)', fontSize: '0.9rem' }}>
              <User size={16} /> {t('owner')}: {profileData.ownerName}
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Company Name</label>
                <input style={inputStyle} value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Owner Name</label>
                <input style={inputStyle} value={editForm.ownerName} onChange={e => setEditForm({...editForm, ownerName: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Email</label>
                <input style={inputStyle} type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Phone</label>
                <input style={inputStyle} value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>GST Number</label>
                <input style={inputStyle} value={editForm.gst} onChange={e => setEditForm({...editForm, gst: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>Company Address</label>
                <input style={inputStyle} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button type="submit" className="od-btn primary"><Save size={16} style={{ marginRight: 6 }}/> {t('saveProfile')}</button>
              <button type="button" className="od-btn ghost" onClick={() => { setEditForm(profileData); setIsEditing(false); }}>{t('cancel')}</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={{ color: 'var(--ow-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{t('gstNumber')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: 'var(--ow-text-dark)' }}><Building size={16} color="var(--ow-brown)"/> {profileData.gst}</div>
              </div>
              <div>
                <div style={{ color: 'var(--ow-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{t('phone')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: 'var(--ow-text-dark)' }}><PhoneCall size={16} color="var(--ow-brown)"/> {profileData.phone}</div>
              </div>
              <div>
                <div style={{ color: 'var(--ow-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{t('email')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: 'var(--ow-text-dark)' }}><Mail size={16} color="var(--ow-brown)"/> {profileData.email}</div>
              </div>
              <div>
                <div style={{ color: 'var(--ow-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>{t('companyAddress')}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontWeight: 500, color: 'var(--ow-text-dark)', lineHeight: 1.4 }}>
                  <MapPin size={16} color="var(--ow-brown)" style={{ marginTop: 2, flexShrink: 0 }}/>
                  {profileData.address}
                </div>
              </div>
            </div>

            <div className="od-cl-actions" style={{ marginTop: 40, borderTop: 'none', paddingTop: 0, justifyContent: 'flex-start' }}>
              <button className="od-btn primary" onClick={() => setIsEditing(true)}><Edit size={16} style={{ marginRight: 6 }}/> {t('editProfile')}</button>
              <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('settings')}><Settings size={16} style={{ marginRight: 6 }}/> {t('settings')}</button>
              <button className="od-btn ghost" onClick={() => triggerToast('CargoLINK Support Desk: Support Ticket #4012 created.')}><LifeBuoy size={16} style={{ marginRight: 6 }}/> {t('help')}</button>
              <button className="od-btn ghost" style={{ marginLeft: 'auto', color: 'var(--ow-danger)' }} onClick={() => window.location.href = '/login'}><LogOut size={16} style={{ marginRight: 6 }}/> {t('logout')}</button>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('analytics')}>← Back to Analytics</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('settings')}>Proceed to Settings →</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   10. SETTINGS PAGE VIEW — FULLY INTERACTIVE
   ═══════════════════════════════════════════════════════════════ */
const SettingsToggle = ({ enabled, onToggle, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
    <span style={{ fontSize: '0.9rem', color: 'var(--ow-text-body)' }}>{label}</span>
    <button
      onClick={onToggle}
      style={{
        width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
        background: enabled ? 'var(--ow-brown)' : 'var(--ow-beige-light)',
        position: 'relative', transition: 'background 0.3s ease',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: enabled ? 25 : 3,
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  </div>
);

const SettingsPageView = ({ setActiveNav, darkMode, setDarkMode, profileData, setProfileData, language, setLanguage, t = (k) => k }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  /* Notification Settings */
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifTrip, setNotifTrip] = useState(true);
  const [notifDelay, setNotifDelay] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifSound, setNotifSound] = useState(true);

  /* Language is passed as prop */

  /* Security */
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  /* Privacy */
  const [dataSharing, setDataSharing] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);
  const [locationHistory, setLocationHistory] = useState(true);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleProfileSave = () => {
    triggerToast('✅ Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (!passwords.current) { triggerToast('⚠️ Please enter current password'); return; }
    if (passwords.newPass.length < 8) { triggerToast('⚠️ New password must be at least 8 characters'); return; }
    if (passwords.newPass !== passwords.confirm) { triggerToast('⚠️ Passwords do not match'); return; }
    setPasswords({ current: '', newPass: '', confirm: '' });
    triggerToast('✅ Password changed successfully!');
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid var(--ow-border)', background: 'var(--ow-bg)',
    fontFamily: 'var(--font)', fontSize: '0.9rem', color: 'var(--ow-text-dark)',
    outline: 'none', transition: 'border-color 0.2s',
  };

  const sectionHeaderStyle = (isExpanded) => ({
    display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0',
    borderBottom: '1px solid var(--ow-border)', cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const SECTIONS = [
    {
      id: 'profile', icon: Edit, title: 'Edit Profile', subtitle: 'Update company info & change password',
      content: (
        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 20, borderBottom: '1px solid var(--ow-border)' }}>
            <div style={{ position: 'relative' }}>
              <div className="od-profile-avatar" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>ABC</div>
              <button style={{
                position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderRadius: '50%',
                background: 'var(--ow-brown)', border: '2px solid var(--ow-white)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <Camera size={13} />
              </button>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ow-text-dark)' }}>{profileData.companyName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ow-text-muted)' }}>Cargo Owner · Verified ✓</div>
            </div>
          </div>

          {/* Profile Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Name</label>
              <input style={inputStyle} value={profileData.companyName} onChange={e => setProfileData({...profileData, companyName: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Owner Name</label>
              <input style={inputStyle} value={profileData.ownerName} onChange={e => setProfileData({...profileData, ownerName: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
              <input style={inputStyle} type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
              <input style={inputStyle} value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GST Number</label>
              <input style={inputStyle} value={profileData.gst} onChange={e => setProfileData({...profileData, gst: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</label>
              <input style={inputStyle} value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} />
            </div>
          </div>
          <button className="od-btn primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleProfileSave}>
            <Save size={16} /> Save Profile
          </button>

          {/* Password Change */}
          <div style={{ marginTop: 12, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--ow-text-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={18} color="var(--ow-brown)" /> Change Password
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Password</label>
                <input
                  style={inputStyle}
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                />
                <button onClick={() => setShowCurrentPass(p => !p)} style={{ position: 'absolute', right: 12, top: 32, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ow-text-muted)' }}>
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
                <input
                  style={inputStyle}
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={passwords.newPass}
                  onChange={e => setPasswords({...passwords, newPass: e.target.value})}
                />
                <button onClick={() => setShowNewPass(p => !p)} style={{ position: 'absolute', right: 12, top: 32, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ow-text-muted)' }}>
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {passwords.newPass && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: passwords.newPass.length >= i * 3 ? (passwords.newPass.length >= 12 ? 'var(--ow-success)' : passwords.newPass.length >= 8 ? 'var(--ow-warning)' : 'var(--ow-danger)') : 'var(--ow-beige-light)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
                <input
                  style={inputStyle}
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                />
                <button onClick={() => setShowConfirmPass(p => !p)} style={{ position: 'absolute', right: 12, top: 32, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ow-text-muted)' }}>
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {passwords.confirm && passwords.newPass !== passwords.confirm && (
                  <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--ow-danger)' }}>Passwords do not match</div>
                )}
              </div>
              <button className="od-btn primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }} onClick={handlePasswordChange}>
                <Shield size={16} /> Update Password
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications', icon: Bell, title: 'Notification Settings', subtitle: 'Manage alerts and notification channels',
      content: (
        <div style={{ padding: '12px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ow-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Channels</div>
            <SettingsToggle enabled={notifEmail} onToggle={() => setNotifEmail(p => !p)} label="📧 Email Notifications" />
            <SettingsToggle enabled={notifPush} onToggle={() => setNotifPush(p => !p)} label="🔔 Push Notifications" />
            <SettingsToggle enabled={notifSMS} onToggle={() => setNotifSMS(p => !p)} label="💬 SMS Alerts" />
          </div>
          <div style={{ borderTop: '1px solid var(--ow-border)', paddingTop: 16, marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ow-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Alert Types</div>
            <SettingsToggle enabled={notifTrip} onToggle={() => setNotifTrip(p => !p)} label="🚛 Trip Updates" />
            <SettingsToggle enabled={notifDelay} onToggle={() => setNotifDelay(p => !p)} label="⚠️ Delay Alerts" />
            <SettingsToggle enabled={notifPayment} onToggle={() => setNotifPayment(p => !p)} label="💰 Payment Notifications" />
          </div>
          <div style={{ borderTop: '1px solid var(--ow-border)', paddingTop: 16 }}>
            <SettingsToggle enabled={notifSound} onToggle={() => setNotifSound(p => !p)} label={notifSound ? '🔊 Notification Sound — ON' : '🔇 Notification Sound — OFF'} />
          </div>
          <button className="od-btn primary" style={{ marginTop: 12 }} onClick={() => triggerToast('✅ Notification preferences saved!')}>Save Preferences</button>
        </div>
      ),
    },
    {
      id: 'language', icon: Globe, title: 'Language', subtitle: `Currently: ${language === 'en-US' ? 'English (US)' : language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : language === 'kn' ? 'Kannada' : 'English (US)'}`,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
              { code: 'hi', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
              { code: 'ta', label: 'Tamil (தமிழ்)', flag: '🇮🇳' },
              { code: 'te', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
              { code: 'kn', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); triggerToast(`✅ Language changed to ${lang.label}`); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderRadius: 12, border: language === lang.code ? '2px solid var(--ow-brown)' : '1.5px solid var(--ow-border)',
                  background: language === lang.code ? 'var(--ow-brown-light)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                  fontFamily: 'var(--font)',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{lang.flag}</span>
                <span style={{ fontWeight: language === lang.code ? 700 : 500, color: 'var(--ow-text-dark)', fontSize: '0.95rem' }}>{lang.label}</span>
                {language === lang.code && <CheckCircle2 size={18} color="var(--ow-brown)" style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'security', icon: Shield, title: 'Security', subtitle: `2FA ${twoFA ? 'Enabled' : 'Disabled'} · Session timeout: ${sessionTimeout}min`,
      content: (
        <div style={{ padding: '12px 0' }}>
          <SettingsToggle enabled={twoFA} onToggle={() => { setTwoFA(p => !p); triggerToast(twoFA ? '⚠️ 2FA Disabled' : '✅ 2FA Enabled'); }} label="🔐 Two-Factor Authentication (2FA)" />
          <SettingsToggle enabled={biometric} onToggle={() => setBiometric(p => !p)} label="🖐️ Biometric Login" />
          <SettingsToggle enabled={loginAlerts} onToggle={() => setLoginAlerts(p => !p)} label="📱 Login Alerts" />
          <div style={{ borderTop: '1px solid var(--ow-border)', paddingTop: 16, marginTop: 8 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ow-text-muted)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session Timeout</label>
            <select
              value={sessionTimeout}
              onChange={e => { setSessionTimeout(e.target.value); triggerToast(`✅ Session timeout set to ${e.target.value} minutes`); }}
              style={{
                padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--ow-border)',
                background: 'var(--ow-bg)', fontFamily: 'var(--font)', fontSize: '0.9rem',
                color: 'var(--ow-text-dark)', cursor: 'pointer', minWidth: 180,
              }}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy', icon: Lock, title: 'Privacy', subtitle: 'Data sharing & tracking preferences',
      content: (
        <div style={{ padding: '12px 0' }}>
          <SettingsToggle enabled={dataSharing} onToggle={() => setDataSharing(p => !p)} label="📊 Share anonymous usage data" />
          <SettingsToggle enabled={activityTracking} onToggle={() => setActivityTracking(p => !p)} label="📍 Activity tracking" />
          <SettingsToggle enabled={locationHistory} onToggle={() => setLocationHistory(p => !p)} label="🗺️ Save location history" />
          <SettingsToggle enabled={analyticsOptIn} onToggle={() => setAnalyticsOptIn(p => !p)} label="📈 Analytics opt-in" />
          <button className="od-btn ghost" style={{ marginTop: 16, color: 'var(--ow-danger)', borderColor: 'var(--ow-danger)' }} onClick={() => triggerToast('✅ All personal data export has been queued')}>
            📦 Export My Data
          </button>
        </div>
      ),
    },
    {
      id: 'theme', icon: darkMode ? Moon : Sun, title: 'Theme', subtitle: darkMode ? 'Dark Mode (Active)' : 'Light Mode (Default)',
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            {/* Light Mode Card */}
            <button
              onClick={() => { setDarkMode(false); triggerToast('☀️ Light mode activated'); }}
              className={!darkMode ? 'settings-theme-card active' : 'settings-theme-card'}
              style={{
                flex: 1, padding: 20, borderRadius: 16, cursor: 'pointer', textAlign: 'center',
                background: !darkMode ? 'linear-gradient(135deg, #FFF8F0, #FAF0E4)' : 'var(--ow-bg)',
                border: !darkMode ? '2.5px solid var(--ow-brown)' : '1.5px solid var(--ow-border)',
                transition: 'all 0.3s', fontFamily: 'var(--font)',
              }}
            >
              <Sun size={32} color={!darkMode ? 'var(--ow-brown)' : 'var(--ow-text-muted)'} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ow-text-dark)' }}>Light Mode</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ow-text-muted)', marginTop: 4 }}>Clean & bright interface</div>
              {!darkMode && <CheckCircle2 size={18} color="var(--ow-brown)" style={{ marginTop: 8 }} />}
            </button>

            {/* Dark Mode Card */}
            <button
              onClick={() => { setDarkMode(true); triggerToast('🌙 Dark mode activated — Glassmorphism enabled'); }}
              className={darkMode ? 'settings-theme-card active' : 'settings-theme-card'}
              style={{
                flex: 1, padding: 20, borderRadius: 16, cursor: 'pointer', textAlign: 'center',
                background: darkMode ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : 'var(--ow-bg)',
                border: darkMode ? '2.5px solid #8B5CF6' : '1.5px solid var(--ow-border)',
                transition: 'all 0.3s', fontFamily: 'var(--font)',
              }}
            >
              <Moon size={32} color={darkMode ? '#8B5CF6' : 'var(--ow-text-muted)'} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: darkMode ? '#E8E6FF' : 'var(--ow-text-dark)' }}>Dark Mode</div>
              <div style={{ fontSize: '0.78rem', color: darkMode ? '#a0a0cc' : 'var(--ow-text-muted)', marginTop: 4 }}>Glassmorphism · Glow borders</div>
              {darkMode && <CheckCircle2 size={18} color="#8B5CF6" style={{ marginTop: 8 }} />}
            </button>
          </div>
          {darkMode && (
            <div style={{
              padding: 16, borderRadius: 14,
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <Sparkles size={18} color="#8B5CF6" />
              <span style={{ fontSize: '0.85rem', color: 'var(--ow-text-body)' }}>
                Glassmorphism effects and glowing borders are now active across all panels.
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'about', icon: Info, title: 'About', subtitle: 'CargoLINK AI v2.4.1',
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Application', val: 'CargoLINK AI' },
              { label: 'Version', val: 'v2.4.1 (Build 1247)' },
              { label: 'Platform', val: 'Web Dashboard' },
              { label: 'License', val: 'Enterprise' },
              { label: 'Support', val: 'support@cargolink.ai' },
              { label: 'Last Updated', val: 'July 25, 2026' },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: 'var(--ow-bg)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--ow-border)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ow-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ow-text-dark)', marginTop: 4 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="od-create-load-page" style={{ maxWidth: 860 }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          padding: '14px 24px', borderRadius: 14,
          background: darkMode ? 'rgba(30,30,50,0.95)' : 'var(--ow-white)',
          border: darkMode ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--ow-border)',
          boxShadow: darkMode ? '0 8px 32px rgba(139,92,246,0.2)' : 'var(--ow-shadow-md)',
          fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 600,
          color: 'var(--ow-text-dark)',
          backdropFilter: 'blur(12px)',
          animation: 'settingsToastIn 0.4s ease',
        }}>
          {toastMsg}
        </div>
      )}

      <div className="od-cl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="od-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Settings size={22} color="var(--ow-brown)" className={darkMode ? 'settings-icon-glow' : ''} /> Settings
          </h2>
          <p className="od-page-sub">Configure your dashboard, profile, and preferences.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('profile')}>← Profile</button>
          <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('dashboard')}>🏠 Dashboard</button>
        </div>
      </div>

      {/* Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SECTIONS.map(section => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          return (
            <div
              key={section.id}
              className={`settings-section-card ${darkMode ? 'dark-glass' : ''} ${isExpanded ? 'expanded' : ''}`}
              style={{
                borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s ease',
                background: darkMode
                  ? 'rgba(255,255,255,0.04)'
                  : 'var(--ow-white)',
                border: darkMode
                  ? (isExpanded ? '1.5px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)')
                  : (isExpanded ? '1.5px solid var(--ow-brown)' : '1px solid var(--ow-border)'),
                backdropFilter: darkMode ? 'blur(20px)' : 'none',
                boxShadow: darkMode
                  ? (isExpanded ? '0 0 24px rgba(139,92,246,0.15), inset 0 0 60px rgba(139,92,246,0.03)' : '0 2px 12px rgba(0,0,0,0.15)')
                  : 'var(--ow-shadow-xs)',
              }}
            >
              {/* Header */}
              <div
                onClick={() => toggleSection(section.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  padding: 12, borderRadius: 12,
                  background: darkMode ? 'rgba(139,92,246,0.12)' : 'var(--ow-bg)',
                  color: darkMode ? '#8B5CF6' : 'var(--ow-brown)',
                  transition: 'all 0.3s',
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--ow-text-dark)' }}>{section.title}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ow-text-muted)' }}>{section.subtitle}</div>
                </div>
                <ChevronRight
                  size={20}
                  color="var(--ow-text-light)"
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>

              {/* Expandable Content */}
              <div style={{
                maxHeight: isExpanded ? 1200 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                padding: isExpanded ? '0 24px 20px' : '0 24px',
              }}>
                {section.content}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ow-border)' }}>
        <button className="od-btn ghost" onClick={() => setActiveNav && setActiveNav('profile')}>← Back to Profile</button>
        <button className="od-btn primary" onClick={() => setActiveNav && setActiveNav('dashboard')}>Return to Dashboard 🏠</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const OwnerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav]               = useState('dashboard');
  const [searchQuery, setSearchQuery]           = useState('');
  const [isRefreshing, setIsRefreshing]         = useState(false);
  const [darkMode, setDarkMode]                 = useState(false);
  const [language, setLanguage]                 = useState('en-US');

  /* API Data State */
  const [dashboardData, setDashboardData]       = useState(null);
  const [trips, setTrips]                       = useState([]);
  const [drivers, setDrivers]                   = useState([]);
  const [isLoading, setIsLoading]               = useState(false);

  /* Shared Profile State */
  const [profileData, setProfileData] = useState({
    companyName: 'ABC Logistics & Freight',
    ownerName: 'Ramesh Sharma',
    email: 'contact@abclogistics.com',
    phone: '+91 98765 43210',
    gst: '29ABCDE1234F1Z5',
    address: '142, Industrial Estate Phase II, Bangalore, Karnataka 560058',
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cargolink_owner_user') || localStorage.getItem('cargolink_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === 'owner' || parsed?.role === 'OWNER') {
          setProfileData((prev) => ({
            ...prev,
            companyName: parsed.companyName || parsed.user?.companyName || prev.companyName,
            ownerName: parsed.ownerName || parsed.fullName || parsed.name || parsed.user?.fullName || prev.ownerName,
            email: parsed.email || parsed.user?.email || prev.email,
            phone: parsed.mobile || parsed.user?.mobile || prev.phone,
            gst: parsed.gstNumber || parsed.user?.gstNumber || prev.gst,
            address: parsed.companyAddress || parsed.user?.companyAddress || prev.address,
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load owner profile from localStorage', e);
    }
  }, []);

  /* Fetch Dashboard Data */
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getOwnerDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips();
        setTrips(data);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const data = await driverService.getAllDrivers();
        setDrivers(data);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    fetchDashboardData();
    fetchTrips();
    fetchDrivers();
  }, []);

  const t = (key) => (TRANSLATIONS[language] && TRANSLATIONS[language][key]) || TRANSLATIONS['en-US'][key] || key;

  /* Apply dark mode class to root */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  /* Refresh Handler */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await dashboardService.getOwnerDashboard();
      setDashboardData(data);
      const tripsData = await tripService.getAllTrips();
      setTrips(tripsData);
      const driversData = await driverService.getAllDrivers();
      setDrivers(driversData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  /* Sidebar nav click */
  const handleNavClick = (id) => {
    setActiveNav(id);
  };

  /* ──────────────────────────────────────────────────────────── */
  return (
    <div className="od-root">

      {/* ══════════════════════════════════════════════════════
          LEFT SIDEBAR
          ══════════════════════════════════════════════════════ */}
      <aside className={`od-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>

        {/* Brand */}
        <div className="od-sidebar-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('dashboard')}>
          <div className="od-brand-icon">
            <Truck size={20} />
          </div>
          <div className="od-brand-text">
            <span className="od-brand-name">CARGO<span>LINK</span> AI</span>
            <span className="od-brand-sub">{t('ownerEnterprise')}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="od-sidebar-nav">
          <span className="od-nav-section-label">{t('mainMenu')}</span>
          {SIDEBAR_ITEMS.slice(0, 5).map(({ id, icon: Icon, badge }) => (
            <button
              key={id}
              className={`od-nav-item ${activeNav === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
            >
              <span className="od-nav-icon"><Icon size={20} /></span>
              <span className="od-nav-text">{t(id)}</span>
              {badge && <span className="od-nav-badge">{badge}</span>}
            </button>
          ))}

          <span className="od-nav-section-label">{t('management')}</span>
          {SIDEBAR_ITEMS.slice(5, 9).map(({ id, icon: Icon, badge }) => (
            <button
              key={id}
              className={`od-nav-item ${activeNav === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
            >
              <span className="od-nav-icon"><Icon size={20} /></span>
              <span className="od-nav-text">{t(id)}</span>
              {badge && <span className="od-nav-badge">{badge}</span>}
            </button>
          ))}

          <span className="od-nav-section-label">{t('account')}</span>
          {SIDEBAR_ITEMS.slice(9).map(({ id, icon: Icon, badge }) => (
            <button
              key={id}
              className={`od-nav-item ${activeNav === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
            >
              <span className="od-nav-icon"><Icon size={20} /></span>
              <span className="od-nav-text">{t(id)}</span>
              {badge && <span className="od-nav-badge">{badge}</span>}
            </button>
          ))}
          <button className="od-nav-item" onClick={() => window.location.href = '/login'}>
            <span className="od-nav-icon"><LogOut size={20} /></span>
            <span className="od-nav-text">{t('logout')}</span>
          </button>
        </nav>

        {/* Footer profile */}
        <div className="od-sidebar-footer">
          <div className="od-sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('profile')}>
            <div className="od-profile-avatar-sm">
              {profileData.companyName.substring(0, 3).toUpperCase()}
              <span className="od-profile-online-dot" />
            </div>
            <div className="od-profile-sm-info">
              <span className="od-profile-sm-name">{profileData.companyName}</span>
              <span className="od-profile-sm-role">Cargo Owner · Verified</span>
            </div>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          className="od-sidebar-toggle"
          onClick={() => setSidebarCollapsed(p => !p)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MAIN AREA
          ══════════════════════════════════════════════════════ */}
      <div className={`od-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

        {/* ── Top Navbar ─────────────────────────────────── */}
        <header className="od-topbar">
          <div className="od-topbar-left">
            <div className="od-page-breadcrumb">
              <span className="od-page-title" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('dashboard')}>{t(activeNav)}</span>
              <span className="od-page-sub">Friday, 25 July 2026 &nbsp;·&nbsp; Fleet Control</span>
            </div>
          </div>

          <div className="od-topbar-spacer" />

          {/* Search */}
          <div className="od-search-bar">
            <Search size={16} className="od-search-icon" />
            <input
              className="od-search-input"
              type="text"
              placeholder="Search trips, drivers, loads…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="od-topbar-actions">
            {/* Notification */}
            <button className="od-icon-btn" title="Notifications" onClick={() => setActiveNav('notifications')}>
              <Bell size={18} />
              <span className="od-notif-dot" />
            </button>

            {/* Refresh */}
            <button className="od-icon-btn" title="Refresh data" onClick={handleRefresh}>
              <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} style={{ transition: 'transform 0.5s ease' }} />
            </button>

            <span className="od-topbar-divider" />

            {/* Profile chip */}
            <div className="od-profile-chip" onClick={() => setActiveNav('profile')}>
              <div className="od-profile-avatar">
                {profileData.companyName.substring(0, 3).toUpperCase()}
              </div>
              <div className="od-profile-info">
                <span className="od-profile-name">{profileData.companyName}</span>
                <span className="od-profile-role">Cargo Owner</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page content ───────────────────────────────── */}
        <div className="od-content">

          {activeNav === 'loads' ? (
            <CreateLoadView setActiveNav={setActiveNav} onLoadCreated={handleRefresh} />
          ) : activeNav === 'ai' ? (
            <AIDriverRecommendationView setActiveNav={setActiveNav} drivers={drivers} />
          ) : activeNav === 'assign' ? (
            <AssignDriverView setActiveNav={setActiveNav} drivers={drivers} trips={trips} onRefresh={handleRefresh} />
          ) : activeNav === 'trips' ? (
            <TripsPageView setActiveNav={setActiveNav} trips={trips} />
          ) : activeNav === 'tracking' ? (
            <LiveTrackingView setActiveNav={setActiveNav} trips={trips} />
          ) : activeNav === 'drivers' ? (
            <DriversPageView setActiveNav={setActiveNav} drivers={drivers} />
          ) : activeNav === 'notifications' ? (
            <NotificationsPageView setActiveNav={setActiveNav} />
          ) : activeNav === 'analytics' ? (
            <AnalyticsPageView setActiveNav={setActiveNav} trips={trips} drivers={drivers} />
          ) : activeNav === 'profile' ? (
            <ProfilePageView setActiveNav={setActiveNav} profileData={profileData} setProfileData={setProfileData} t={t} />
          ) : activeNav === 'settings' ? (
            <SettingsPageView setActiveNav={setActiveNav} darkMode={darkMode} setDarkMode={setDarkMode} profileData={profileData} setProfileData={setProfileData} language={language} setLanguage={setLanguage} t={t} />
          ) : (
            <>
              {/* Welcome Banner */}
              <div className="od-welcome-banner">
                <div className="od-banner-left">
                  <div className="od-banner-greeting">{t('goodEvening')}</div>
                  <h1 className="od-banner-title">{t('welcomeBack')} {profileData.companyName}</h1>
                  <p className="od-banner-subtitle">
                    Your fleet at a glance. Create loads, assign drivers, and track shipments.
                  </p>
                </div>

                <div className="od-banner-right">
                  <div className="od-banner-stat" onClick={() => setActiveNav('trips')}>
                    <span className="od-banner-stat-val">{dashboardData?.activeTrips ?? trips.filter(t => ['IN_TRANSIT','ASSIGNED'].includes(t.status)).length}</span>
                    <span className="od-banner-stat-label">{t('activeTrips')}</span>
                  </div>
                  <div className="od-banner-stat" onClick={() => setActiveNav('analytics')}>
                    <span className="od-banner-stat-val">{dashboardData?.completedTrips ?? trips.filter(t => t.status === 'DELIVERED').length}</span>
                    <span className="od-banner-stat-label">{t('thisMonth')}</span>
                  </div>
                  <div className="od-banner-stat" onClick={() => setActiveNav('analytics')}>
                    <span className="od-banner-stat-val">{trips.length > 0 ? Math.round((trips.filter(t => t.status === 'DELIVERED').length / trips.length) * 100) : 0}%</span>
                    <span className="od-banner-stat-label">{t('onTimeSla')}</span>
                  </div>
                </div>
              </div>

              {/* ── Analytics Stat Cards (4 columns) ─────────── */}
              <div>
                <div className="od-section-header">
                  <h2 className="od-section-title">
                    <span className="od-section-title-dot" />
                    {t('fleetAnalytics')}
                  </h2>
                  <button className="od-section-link" onClick={() => setActiveNav('analytics')}>
                    {t('fullReport')} <ChevronRight size={14} />
                  </button>
                </div>

                <div className="od-stats-grid">
                  {/* 1. Active Trips */}
                  <div className="od-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('trips')}>
                    <div className="od-stat-card-top">
                      <div className="od-stat-icon-box brown"><Truck size={22} /></div>
                      <span className="od-stat-pill live">● Live</span>
                    </div>
                    <div className="od-stat-card-body">
                      <div className="od-stat-value">{dashboardData?.activeTrips ?? trips.filter(t => ['IN_TRANSIT','ASSIGNED'].includes(t.status)).length}</div>
                      <div className="od-stat-label">Active Trips</div>
                    </div>
                    <div className="od-stat-card-footer">
                      <span className="od-stat-trend-up"><TrendingUp size={13} /> {trips.filter(t => t.status === 'IN_TRANSIT').length}</span>
                      <span>in transit now</span>
                    </div>
                  </div>

                  {/* 2. Pending Loads */}
                  <div className="od-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('loads')}>
                    <div className="od-stat-card-top">
                      <div className="od-stat-icon-box warning"><Package size={22} /></div>
                      <span className="od-stat-pill pending">Action Req.</span>
                    </div>
                    <div className="od-stat-card-body">
                      <div className="od-stat-value">{dashboardData?.pendingTrips ?? trips.filter(t => t.status === 'PENDING').length}</div>
                      <div className="od-stat-label">Pending Loads</div>
                    </div>
                    <div className="od-stat-card-footer">
                      <span className="od-stat-trend-down"><TrendingDown size={13} /> {trips.filter(t => t.status === 'PENDING').length}</span>
                      <span>awaiting driver assignment</span>
                    </div>
                  </div>

                  {/* 3. Available Drivers */}
                  <div className="od-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('assign')}>
                    <div className="od-stat-card-top">
                      <div className="od-stat-icon-box success"><Users size={22} /></div>
                      <span className="od-stat-pill ready">Ready</span>
                    </div>
                    <div className="od-stat-card-body">
                      <div className="od-stat-value">{dashboardData?.availableDrivers ?? drivers.filter(d => d.status === 'AVAILABLE').length}</div>
                      <div className="od-stat-label">Available Drivers</div>
                    </div>
                    <div className="od-stat-card-footer">
                      <span className="od-stat-trend-up"><TrendingUp size={13} /> {drivers.filter(d => d.status === 'AVAILABLE').length}</span>
                      <span>ready for dispatch</span>
                    </div>
                  </div>

                  {/* 4. Completed Deliveries */}
                  <div className="od-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('analytics')}>
                    <div className="od-stat-card-top">
                      <div className="od-stat-icon-box purple"><CheckCircle2 size={22} /></div>
                      <span className="od-stat-pill done">This Month</span>
                    </div>
                    <div className="od-stat-card-body">
                      <div className="od-stat-value">{dashboardData?.completedTrips ?? trips.filter(t => t.status === 'DELIVERED').length}</div>
                      <div className="od-stat-label">Completed Deliveries</div>
                    </div>
                    <div className="od-stat-card-footer">
                      <span className="od-stat-trend-up"><TrendingUp size={13} /> {trips.length > 0 ? Math.round((trips.filter(t => t.status === 'DELIVERED').length / trips.length) * 100) : 0}%</span>
                      <span>on-time delivery rate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Dashboard Main Grid ─────────────────────── */}
              <div className="od-dashboard-grid">

                {/* LEFT: Active Trips Table */}
                <div className="od-card">
                  <div className="od-card-header">
                    <h3 className="od-card-title">
                      <Activity size={17} color="var(--ow-brown)" /> Active Trips
                    </h3>
                    <button className="od-section-link" onClick={() => setActiveNav('trips')}>
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <table className="od-trips-table">
                    <thead>
                      <tr>
                        <th>Trip ID</th>
                        <th>Route</th>
                        <th>Driver</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(trips.length > 0 ? trips.slice(0, 5) : ACTIVE_TRIPS).map(trip => {
                        const tripId = trip.id || trip._id || 'N/A';
                        const tripFrom = trip.origin || trip.from || 'N/A';
                        const tripTo = trip.destination || trip.to || 'N/A';
              const tripDriver = trip.driver || trip.driverId?.userId?.fullName || trip.driverId?.fullName || 'Unassigned';
                        const tripStatus = trip.status === 'IN_TRANSIT' ? 'in-transit' : trip.status === 'PENDING' ? 'pending' : trip.status === 'DELIVERED' ? 'completed' : trip.status === 'DELAYED' ? 'delayed' : (trip.status || 'pending');
                        const tripProgress = trip.progress || (tripStatus === 'completed' ? 100 : tripStatus === 'in-transit' ? 50 : 0);
                        const tripEta = trip.eta || 'N/A';
                        return (
                        <tr key={tripId} style={{ cursor: 'pointer' }} onClick={() => setActiveNav('tracking')}>
                          <td><span className="od-trip-id">{tripId}</span></td>
                          <td>
                            <div className="od-trip-route">
                              {tripFrom}
                              <span className="od-route-arrow">→</span>
                              {tripTo}
                            </div>
                          </td>
                          <td>
                            <div className="od-driver-cell">
                              <div className="od-driver-mini-avatar">
                                {tripDriver === 'Unassigned' ? '?' : tripDriver.split(' ').map(w=>w[0]).join('')}
                              </div>
                              <span className="od-truncate" style={{ maxWidth: 110 }}>{tripDriver}</span>
                            </div>
                          </td>
                          <td>
                            <div className="od-progress-wrap">
                              <div className="od-progress-bar">
                                <div
                                  className={`od-progress-fill ${tripStatus === 'delayed' ? 'warn' : ''}`}
                                  style={{ width: `${tripProgress}%` }}
                                />
                              </div>
                              <span className="od-progress-pct">{tripProgress}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`od-status-chip ${STATUS_CLASS[tripStatus]}`}>
                              <span className="od-status-dot" />
                              {STATUS_LABEL[tripStatus]}
                            </span>
                          </td>
                          <td style={{ color: 'var(--ow-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                            {tripEta}
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>

                {/* RIGHT column: Quick Actions + AI Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Quick Actions */}
                  <div className="od-card">
                    <div className="od-card-header">
                      <h3 className="od-card-title">
                        <Zap size={17} color="var(--ow-brown)" /> Quick Actions
                      </h3>
                    </div>
                    <div className="od-quick-actions-grid">
                      <button className="od-qa-btn primary" onClick={() => setActiveNav('loads')}>
                        <div className="od-qa-icon"><Plus size={20} /></div>
                        <span className="od-qa-label">Create Load</span>
                        <span className="od-qa-sub">Publish a new cargo load</span>
                        <ArrowRight size={14} className="od-qa-arrow" />
                      </button>

                      <button className="od-qa-btn" onClick={() => setActiveNav('assign')}>
                        <div className="od-qa-icon"><UserPlus size={20} /></div>
                        <span className="od-qa-label">Assign Driver</span>
                        <span className="od-qa-sub">Match driver to load</span>
                        <ArrowRight size={14} className="od-qa-arrow" />
                      </button>

                      <button className="od-qa-btn" onClick={() => setActiveNav('tracking')}>
                        <div className="od-qa-icon"><Navigation2 size={20} /></div>
                        <span className="od-qa-label">Track Trips</span>
                        <span className="od-qa-sub">Live GPS fleet view</span>
                        <ArrowRight size={14} className="od-qa-arrow" />
                      </button>

                      <button className="od-qa-btn" onClick={() => setActiveNav('drivers')}>
                        <div className="od-qa-icon"><Users size={20} /></div>
                        <span className="od-qa-label">View Drivers</span>
                        <span className="od-qa-sub">Manage fleet drivers</span>
                        <ArrowRight size={14} className="od-qa-arrow" />
                      </button>
                    </div>
                  </div>

                  {/* AI Fleet Status */}
                  <div className="od-ai-card">
                    <div className="od-ai-card-gradient" />

                    <div className="od-ai-header">
                      <div className="od-ai-title-row">
                        <div className="od-ai-emoji-box">🤖</div>
                        <div>
                          <div className="od-ai-title">AI Fleet Status</div>
                          <div className="od-ai-subtitle">Autonomous Co-Pilot Active</div>
                        </div>
                      </div>
                      <div className="od-ai-live-pill">
                        <span className="od-ai-live-dot" />
                        Monitoring
                      </div>
                    </div>

                    <div className="od-ai-metrics">
                      {/* Active Trips */}
                      <div className="od-ai-metric" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('trips')}>
                        <div className="od-ai-metric-top">
                          <div className="od-ai-metric-icon" style={{ background: 'rgba(139,94,60,0.1)', color: 'var(--ow-brown)' }}>
                            <Truck size={13} />
                          </div>
                          Active Trips
                        </div>
                        <div className="od-ai-metric-val">{dashboardData?.activeTrips ?? trips.filter(t => ['IN_TRANSIT','ASSIGNED'].includes(t.status)).length}</div>
                        <div className="od-ai-metric-sub">On the road</div>
                      </div>

                      {/* Available Drivers */}
                      <div className="od-ai-metric" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('assign')}>
                        <div className="od-ai-metric-top">
                          <div className="od-ai-metric-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--ow-success)' }}>
                            <Users size={13} />
                          </div>
                          Avail. Drivers
                        </div>
                        <div className="od-ai-metric-val success">{dashboardData?.availableDrivers ?? drivers.filter(d => d.status === 'AVAILABLE').length}</div>
                        <div className="od-ai-metric-sub">Ready to dispatch</div>
                      </div>

                      {/* Delayed Trips */}
                      <div className="od-ai-metric" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('trips')}>
                        <div className="od-ai-metric-top">
                          <div className="od-ai-metric-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--ow-warning)' }}>
                            <AlertTriangle size={13} />
                          </div>
                          Delayed Trips
                        </div>
                        <div className="od-ai-metric-val warn">{dashboardData?.delayedTrips ?? trips.filter(t => t.status === 'DELAYED').length}</div>
                        <div className="od-ai-metric-sub">Flagged by AI</div>
                      </div>

                      {/* Pending Trips */}
                      <div className="od-ai-metric" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('loads')}>
                        <div className="od-ai-metric-top">
                          <div className="od-ai-metric-icon" style={{ background: 'rgba(139,94,60,0.1)', color: 'var(--ow-brown)' }}>
                            <Package size={13} />
                          </div>
                          Pending
                        </div>
                        <div className="od-ai-metric-val">{dashboardData?.pendingTrips ?? trips.filter(t => t.status === 'PENDING').length}</div>
                        <div className="od-ai-metric-sub">Need driver match</div>
                      </div>
                    </div>

                    {/* AI recommendation */}
                    <div className="od-ai-recommendation" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('ai')}>
                      <Sparkles size={16} color="var(--ow-brown)" style={{ flexShrink: 0 }} />
                      <span className="od-ai-rec-text">
                        <strong>AI Insight:</strong> {trips.length} trips registered · {drivers.length} drivers in fleet
                      </span>
                      <ChevronRight size={16} color="var(--ow-brown)" style={{ flexShrink: 0 }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Bottom Grid: Notifications + Drivers ─────── */}
              <div className="od-bottom-grid">

                {/* Recent Notifications */}
                <div className="od-card">
                  <div className="od-card-header">
                    <h3 className="od-card-title">
                      <Bell size={17} color="var(--ow-brown)" /> Fleet Notifications
                    </h3>
                    <button className="od-section-link" onClick={() => setActiveNav('notifications')}>
                      All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="od-notif-list">
                    {NOTIFICATIONS.map((n, i) => (
                      <div className="od-notif-item" key={i} style={{ cursor: 'pointer' }} onClick={() => setActiveNav('notifications')}>
                        <NotifIcon type={n.type} />
                        <div className="od-notif-body">
                          <div className="od-notif-title">{n.title}</div>
                          <div className="od-notif-desc">{n.desc}</div>
                        </div>
                        <span className="od-notif-time">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Drivers */}
                <div className="od-card">
                  <div className="od-card-header">
                    <h3 className="od-card-title">
                      <Users size={17} color="var(--ow-brown)" /> Fleet Drivers
                    </h3>
                    <button className="od-section-link" onClick={() => setActiveNav('drivers')}>
                      Manage <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="od-driver-list">
                    {DRIVERS.map((d, i) => (
                      <div className="od-driver-item" key={i} style={{ cursor: 'pointer' }} onClick={() => setActiveNav('drivers')}>
                        <div className="od-driver-avatar">{d.initials}</div>
                        <div className="od-driver-info">
                          <div className="od-driver-name">{d.name}</div>
                          <div className="od-driver-status">{d.status}</div>
                        </div>
                        <div className="od-driver-rating">
                          <Star size={12} fill="var(--ow-brown)" color="var(--ow-brown)" />
                          {d.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Load Spotlight */}
                <div className="od-card" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('tracking')}>
                  <div className="od-card-header">
                    <h3 className="od-card-title">
                      <Navigation2 size={17} color="var(--ow-brown)" /> Priority Load
                    </h3>
                    {trips.length > 0 ? <span className="od-status-chip in-transit"><span className="od-status-dot" /> Active</span> : <span className="od-status-chip pending"><span className="od-status-dot" /> No Data</span>}
                  </div>
                  <div className="od-card-body">
                    {trips.length > 0 ? (
                      <>
                    {/* Route visualization */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ow-brown)', margin: '0 auto 4px' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ow-text-muted)' }}>{trips[0].origin || trips[0].from || 'N/A'}</span>
                      </div>
                      <div style={{ flex: 1, borderTop: '2px dashed var(--ow-beige)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -10, left: '50%', fontSize: '1rem' }}>🚛</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ow-success)', margin: '0 auto 4px' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ow-text-muted)' }}>{trips[0].destination || trips[0].to || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Trip meta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { label: 'Trip ID', val: trips[0]._id || trips[0].id || 'N/A' },
                        { label: 'Driver', val: trips[0].driver?.fullName || trips[0].driverId?.userId?.fullName || trips[0].driverId?.fullName || trips[0].driver || 'Unassigned' },
                        { label: 'Cargo', val: trips[0].cargoType || 'N/A' },
                        { label: 'Weight', val: trips[0].weight ? `${trips[0].weight}T` : 'N/A' },
                        { label: 'Status', val: trips[0].status || 'N/A' },
                        { label: 'On-Time', val: '—' },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ background: 'var(--ow-bg)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--ow-border)' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--ow-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ow-text-dark)', marginTop: 2 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ow-text-muted)' }}>
                        No active trips yet. Create a load to get started.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default OwnerDashboard;
