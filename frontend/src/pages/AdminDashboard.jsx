import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building, Truck, CheckCircle2, Clock, Calendar,
  ArrowRight, Bell, Search, RefreshCw, ChevronRight, ChevronLeft, Star, Phone,
  FileText, Settings, User, LogOut, Sparkles, Activity, ShieldCheck, MapPin,
  AlertTriangle, Database, Server, Radio, Check, X, ExternalLink, Navigation2, Info,
  Filter, Eye, ShieldAlert, BadgeCheck, Mail, Map, DollarSign, Package, Lock, Globe, Key, Sliders, Shield, Edit3
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AdminDashboard.css';
import { dashboardService } from '../services/dashboardService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─── Sidebar Nav Config ────────────────────────────────────────────────── */
const SIDEBAR_ITEMS = [
  { id: 'dashboard',     icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'drivers',       icon: Users,           labelKey: 'drivers',              badge: '1,248' },
  { id: 'owners',        icon: Building,        labelKey: 'owners',               badge: '532' },
  { id: 'trips',         icon: Truck,           labelKey: 'trips' },
  { id: 'tracking',      icon: MapPin,          labelKey: 'tracking' },
  { id: 'reports',       icon: FileText,        labelKey: 'reports' },
  { id: 'notifications', icon: Bell,            labelKey: 'notifications',        badge: '5' },
  { id: 'profile',       icon: User,            labelKey: 'profile' },
  { id: 'settings',      icon: Settings,        labelKey: 'settings' },
];

/* ─── Initial Drivers Data (empty — populated from API) ────────────────── */
const INITIAL_DRIVERS = [];

/* ─── Initial Cargo Owners Data (empty — populated from API) ──────────── */
const INITIAL_CARGO_OWNERS = [];

/* ─── Top 6 Summary Cards ───────────────────────────────────────────────── */
const SUMMARY_CARDS = [
  { title: 'Total Drivers',            value: '0',  sub: 'Loading...',    icon: Users,        color: 'brown',   badge: '0' },
  { title: 'Total Cargo Owners',        value: '0',    sub: 'Loading...', icon: Building,     color: 'purple',  badge: '0' },
  { title: 'Active Trips',              value: '0',    sub: '● No active trips',             icon: Truck,        color: 'info',    badge: '0' },
  { title: 'Completed Trips',     value: '0', sub: 'No data',           icon: CheckCircle2, color: 'success', badge: '0' },
  { title: 'Pending Trips',             value: '0',     sub: 'No pending trips',      icon: Clock,        color: 'warning', badge: '0' },
  { title: 'Pending Driver Approvals',  value: '0',     sub: 'No pending approvals', icon: AlertTriangle, color: 'danger',  badge: '0' },
];

/* ─── Active Trips Data (empty — populated from API) ───────────────────── */
const ACTIVE_TRIPS = [];

/* ─── Pending Approvals Data (empty — populated from API) ──────────────── */
const INITIAL_DRIVER_APPROVALS = [];

const INITIAL_OWNER_APPROVALS = [];

/* ─── System Status Services ────────────────────────────────────────────── */
const SYSTEM_SERVICES = [
  { name: 'Server Status', status: 'Running', detail: 'System Online', icon: Server },
  { name: 'Database Status', status: 'Running', detail: 'Connected', icon: Database },
  { name: 'GPS Tracking Status', status: 'Running', detail: 'Service Active', icon: Radio },
  { name: 'Notification Service', status: 'Running', detail: 'Service Active', icon: Bell },
];

/* ─── Recent Activities List (empty — populated from API) ──────────────── */
const RECENT_ACTIVITIES = [];

/* ─── AI Insights (empty) ──────────────────────────────────────────────── */
const AI_INSIGHTS = [];

/* ─── Recent Notifications (empty — populated from API) ────────────────── */
const NOTIFICATIONS_LIST = [];

/* ─── All Trips Data (empty — populated from API) ──────────────────────── */
const ALL_TRIPS_DATA = [];

/* ─── Live Tracking Trucks Data (empty — populated from API) ──────────── */
const TRACKING_TRUCKS = [];

/* ─── City Coordinates for Live Map ──────────────────────────────────────── */
const CITY_COORDS = {
  'Coimbatore': [11.0168, 76.9558],
  'Chennai': [13.0827, 80.2707],
  'Bengaluru': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Mumbai': [19.0760, 72.8777],
  'Pune': [18.5204, 73.8567],
  'Delhi': [28.7041, 77.1025],
  'Jaipur': [26.9124, 75.7873],
  'Salem': [11.6643, 78.1460],
  'Kochi': [9.9312, 76.2673],
  'Kolkata': [22.5726, 88.3639],
  'Ahmedabad': [23.0225, 72.5714],
  'Vijayawada': [16.5062, 80.6480],
};

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  'en-US': {
    dashboard:'Dashboard',drivers:'Driver Management',owners:'Cargo Owner Management',
    trips:'Trip Management',tracking:'Live Tracking',reports:'Reports & Analytics',
    notifications:'Notifications',profile:'Profile',settings:'Settings',
    logout:'Logout',analyticsSystem:'Analytics & System',
    fleetOverview:'Fleet & Logistics Overview',liveMasterFeed:'Live Master Feed',
    quickActions:'Quick Actions',viewDrivers:'View Drivers',viewOwners:'View Cargo Owners',
    viewTrips:'View Trips',generateReports:'Generate Reports',
    systemStatus:'System Status',allOperational:'All Operational',
    pendingApprovals:'Pending Approvals',driversLabel:'Drivers',ownersLabel:'Owners',
    approve:'Approve',reject:'Reject',app:'App',rej:'Rej',
    aiCopilot:'AI Co-Pilot',active:'Active',
    recentNotifications:'Recent Notifications',viewAll:'View All',
    search:'Search drivers, cargo owners, trips, reports\u2026',
    driverManagement:'Driver Management',
    driverDesc:'View, approve, manage, and monitor all registered fleet drivers across the platform.',
    back:'Back',nextCargoOwners:'Next: Cargo Owners \u2192',addDriver:'+ Add Driver',
    totalRegistered:'Total Registered',activeDrivers:'Active Drivers',
    pending:'Pending Approvals',suspended:'Suspended',
    all:'All',filter:'Filter',apply:'Apply',
    id:'ID',name:'Name',truckNo:'Truck No',vehicleType:'Vehicle Type',
    phone:'Phone',status:'Status',rating:'Rating',actions:'Actions',
    view:'View',suspend:'Suspend',activate:'Activate',
    driverDetails:'Driver Details',kycInfo:'KYC & Profile Information',
    close:'Close',email:'Email',location:'Location',joined:'Joined Date',
    license:'License No',tripsCompleted:'Trips Completed',
    cargoOwnerManagement:'Cargo Owner Management',
    ownerDesc:'View, verify, and manage all registered cargo owner enterprises on the platform.',
    nextDrivers:'Next: Drivers \u2192',addOwner:'+ Add Owner',
    companyName:'Company',ownerName:'Owner Name',gst:'GST',
    ownerDetails:'Cargo Owner Details',companyInfo:'Enterprise & Contact Information',
    address:'Address',loadsCreated:'Loads Created',totalSpent:'Total Spent',
    tripManagement:'Trip Management',
    tripDesc:'Monitor, track, and manage all registered trips across the platform in real-time.',
    allTrips:'All Trips',inTransit:'In Transit',scheduled:'Scheduled',
    delayed:'Delayed',completedStatus:'Completed',
    tripId:'Trip ID',driverName:'Driver',cargoOwner:'Cargo Owner',
    pickup:'Pickup',destination:'Destination',tripStatus:'Trip Status',
    eta:'ETA',tripDetails:'Trip Details',
    goods:'Goods',distance:'Distance',startTime:'Start Time',routeInfo:'Route',
    liveTracking:'Live Fleet GPS Tracking',
    trackingDesc:'{t("trackingPageDesc")}',
    refresh:'Refresh',lastRefresh:'Last refresh',
    journeyProgress:'Journey Progress',currentLocation:'Current Location',
    speed:'Speed',selectedTruck:'Selected Truck',
    liveTrips:'Live Trips',truck:'Truck',
    from:'From',to:'To',
    reportsAnalytics:'Reports & Analytics',
    reportsDesc:'{t("reportsDesc")}',
    exportPDF:'{t("exportPDF")}',
    totalTrips:'Total Trips',completedTrips:'Completed Trips',
    pendingScheduled:'Pending / Scheduled',totalDrivers:'Total Drivers',
    totalOwners:'Total Cargo Owners',avgSuccess:'Avg Trip Success Rate',
    monthlyTrips:'Monthly Trips \u2014 2025-2026',
    tripVolume:'Trip Volume by Month',tripSuccess:'Trip Success Rate',
    successRate:'Success Rate',driverPerformance:'Driver Performance Report',
    topDrivers:'Top 6 Drivers \u00b7 Ranked by Trips Completed',
    rank:'Rank',tripsCount:'Trips Completed',ontime:'On-Time %',
    avgRating:'Avg Rating',performance:'Performance',
    platformStats:'Platform Stats',
    avgDistance:'Avg Distance per Trip',peakMonth:'Peak Booking Month',
    platformUptime:'Platform Uptime',
    notifPage:'Notifications',
    notifDesc:'{t("notifDesc")}',
    markAllRead:'{t("markAllRead")}',allNotifs:'All',
    highPriority:'High Priority',medium:'Medium',info:'Info',
    priority:'Priority',reviewDriver:'Review Driver',
    reviewOwner:'Review Owner',trackTrip:'Track Trip',
    viewTrip:'View Trip',viewReport:'View Report',
    trackingPage:'Live Fleet GPS Tracking',
    trackingPageDesc:'{t("trackingPageDesc")}',
    openLiveTracking:'Open Live Tracking \u2192',
    adminProfile:'Admin Profile',systemSettings:'System Settings',
    profileDesc:'Manage administrative credentials, employee role details, and security controls.',
    settingsDesc:'Configure system notifications, language localization, privacy controls, and security policies.',
    profileTab:'Admin Profile',settingsTab:'System Settings',
    masterAdminDetails:'Master Administrator Details',
    verifiedCredentials:'Verified Credentials',
    adminName:'Admin Name',employeeId:'Employee ID',
    emailAddress:'Email Address',phoneNumber:'Phone Number',
    rolePrivileges:'System Role & Privileges',
    quickActionsTitle:'Quick Actions',
    editProfile:'Edit Profile',changePassword:'Change Password',
    logoutBtn:'Logout',accountSecurity:'Account Security Status',
    securityDesc:'Two-Factor Authentication (2FA) is Enabled. Last password update was 14 days ago.',
    securityOk:'\u2713 Zero security policy violations',
    notifSettings:'Notifications',
    notifSettingsDesc:'Manage alert preferences',
    emailAlerts:'Email Alerts',emailAlertsDesc:'Receive real-time email updates for trip completion and pending driver KYC approvals.',
    smsNotifs:'SMS Notifications',smsNotifsDesc:'Send urgent SMS notifications for vehicle route delays and emergency alerts.',
    pushNotifs:'Mobile Push Notifications',pushNotifsDesc:'Push real-time alerts to linked mobile devices.',
    criticalOnly:'Critical Escalations Only',criticalOnlyDesc:'Filter out low priority items and only escalate high-severity incidents.',
    weeklyDigest:'Weekly Analytics Digest',weeklyDigestDesc:'Automated Monday morning PDF email digest summarizing fleet performance.',
    langLocal:'Language & Localization',
    langLocalDesc:'Platform language & timezone',
    language:'Language',timezone:'System Timezone',
    currency:'Currency Format',dateFormat:'Date Format',
    privacy:'Privacy',privacyDesc:'Data sharing & audit tracking',
    locationTelemetry:'Location Telemetry Access Control',
    locationTelemetryDesc:'Enable encrypted live GPS streaming logs for active truck tracking.',
    aiCoPilotOptIn:'AI Operations Co-Pilot Optimization',
    aiCoPilotOptInDesc:'Allow anonymized trip telemetry data to improve AI route prediction models.',
    auditLogging:'System Audit Trail Logging',
    auditLoggingDesc:'Record complete trace logs of all master admin actions for compliance.',
    thirdPartySharing:'Third-Party Integration API Data Sharing',
    thirdPartySharingDesc:'Allow restricted telemetry access to verified logistics partner APIs.',
    security:'Security',securityTitle:'Enterprise security policies',
    twoFactor:'Two-Factor Authentication (2FA)',
    twoFactorDesc:'Require time-based OTP code via authenticator app on login.',
    sessionTimeout:'Admin Session Timeout',
    sessionTimeoutDesc:'Automatically lock session after period of inactivity.',
    apiKeyAccess:'REST API Key Access',
    apiKeyAccessDesc:'Master REST API keys enabled for automated dispatch systems.',
    systemInfra:'System Infrastructure Status',
    allServicesOp:'\ud83d\udfe2 All Services Operational',
    activeTrips:'Active Trips Monitoring',
    activeTripsShort:'Active Trips',
    liveGpsPreview:'Live Fleet GPS Tracking Preview',
    addDriver:'+ Add Driver',cancel:'Cancel',
    currentPassword:'Current Password',newPassword:'New Password',
    confirmPassword:'Confirm Password',
    saveChanges:'Save Changes',updatePassword:'Update Password',
    confirmLogout:'Confirm Logout',
    logoutConfirmMsg:'Are you sure you want to logout of the Admin Console?',
    yesLogout:'Yes, Logout',
    activeSession:'\ud83d\udfe2 Active Session',
    employeeLabel:'Employee ID:',roleLabel:'Role:',deptLabel:'Department:',
    mapActiveTrucks:'Active Trucks Live on Route',
    legend:'Legend',route:'Route',
    signalStrong:'GPS Signal: Strong \u00b7 100%',
    previous:'Previous',next:'Next',
    total:'Total',verified:'Verified',
    pendingMatch:'Pending Match',pendingApproval:'Pending Approval',
    kycVerification:'KYC Verification Required',
    onTimeSla:'On-Time SLA',
    allTime:'All time',avg:'Average',
  },
  ta: {
    dashboard:'முகப்பு',drivers:'ஓட்டுநர் மேலாண்மை',owners:'சரக்கு உரிமையாளர் மேலாண்மை',
    trips:'பயண மேலாண்மை',tracking:'நேரடி கண்காணிப்பு',reports:'அறிக்கைகள் & பகுப்பாய்வு',
    notifications:'அறிவிப்புகள்',profile:'சுயவிவரம்',settings:'அமைப்புகள்',
    logout:'வெளியேறு',analyticsSystem:'பகுப்பாய்வு & அமைப்பு',
    fleetOverview:'கப்பல் & தளவாடங்கள் கண்ணோட்டம்',liveMasterFeed:'நேரடி மாஸ்டர் ஊட்டம்',
    quickActions:'விரைவு செயல்கள்',viewDrivers:'ஓட்டுநர்களைப் பார்க்க',viewOwners:'சரக்கு உரிமையாளர்களைப் பார்க்க',
    viewTrips:'பயணங்களைப் பார்க்க',generateReports:'அறிக்கைகளை உருவாக்கு',
    systemStatus:'அமைப்பு நிலை',allOperational:'அனைத்தும் செயலில்',
    pendingApprovals:'நிலுவை ஒப்புதல்கள்',driversLabel:'ஓட்டுநர்கள்',ownersLabel:'உரிமையாளர்கள்',
    approve:'ஒப்புதல்',reject:'நிராகரி',app:'ஒப்',rej:'நிரா',
    aiCopilot:'AI இணை விமானி',active:'செயலில்',
    recentNotifications:'சமீபத்திய அறிவிப்புகள்',viewAll:'அனைத்தையும் காண',
    search:'ஓட்டுநர்கள், சரக்கு உரிமையாளர்கள், பயணங்கள், அறிக்கைகளை தேடு...',
    driverManagement:'ஓட்டுநர் மேலாண்மை',
    driverDesc:'அனைத்து பதிவு செய்யப்பட்ட கப்பல் ஓட்டுநர்களையும் காண, ஒப்புதல் அளிக்க, நிர்வகிக்க மற்றும் கண்காணிக்கவும்.',
    back:'பின்',nextCargoOwners:'அடுத்து: சரக்கு உரிமையாளர்கள் →',
    totalRegistered:'மொத்தம் பதிவு',activeDrivers:'செயலில் உள்ள ஓட்டுநர்கள்',
    pending:'நிலுவை ஒப்புதல்கள்',suspended:'இடைநிறுத்தப்பட்டது',
    all:'அனைத்தும்',filter:'வடிகட்டி',
    id:'ID',name:'பெயர்',truckNo:'வாகன எண்',vehicleType:'வாகன வகை',
    phone:'தொலைபேசி',status:'நிலை',rating:'மதிப்பீடு',actions:'செயல்கள்',
    view:'பார்',suspend:'இடைநிறுத்து',activate:'செயல்படுத்து',
    driverDetails:'ஓட்டுநர் விவரங்கள்',kycInfo:'KYC & சுயவிவர தகவல்',
    close:'மூடு',email:'மின்னஞ்சல்',location:'இருப்பிடம்',joined:'சேர்ந்த தேதி',
    license:'உரிம எண்',tripsCompleted:'பயணங்கள் முடிந்தன',
    cargoOwnerManagement:'சரக்கு உரிமையாளர் மேலாண்மை',
    ownerDesc:'அனைத்து பதிவு செய்யப்பட்ட சரக்கு உரிமையாளர் நிறுவனங்களையும் காண, சரிபார்த்து நிர்வகிக்கவும்.',
    nextDrivers:'அடுத்து: ஓட்டுநர்கள் →',addOwner:'+ உரிமையாளரைச் சேர்',
    companyName:'நிறுவனம்',ownerName:'உரிமையாளர் பெயர்',gst:'GST',
    ownerDetails:'சரக்கு உரிமையாளர் விவரங்கள்',companyInfo:'நிறுவன & தொடர்பு தகவல்',
    address:'முகவரி',loadsCreated:'சுமைகள் உருவாக்கப்பட்டன',totalSpent:'மொத்த செலவு',
    tripManagement:'பயண மேலாண்மை',
    tripDesc:'அனைத்து பதிவு செய்யப்பட்ட பயணங்களையும் நிகழ்நேரத்தில் கண்காணிக்க, கண்காணிக்க மற்றும் நிர்வகிக்கவும்.',
    allTrips:'அனைத்து பயணங்கள்',inTransit:'பயணத்தில்',scheduledS:'திட்டமிடப்பட்டது',
    delayed:'தாமதமானது',completedStatus:'முடிந்தது',
    tripId:'பயண ID',driverName:'ஓட்டுநர்',cargoOwner:'சரக்கு உரிமையாளர்',
    pickup:'பிகப்',destination:'சேரிடம்',tripStatus:'பயண நிலை',
    eta:'ETA',tripDetails:'பயண விவரங்கள்',
    goods:'சரக்கு',distance:'தூரம்',startTime:'தொடக்க நேரம்',routeInfo:'வழி',
    liveTracking:'நேரடி GPS கண்காணிப்பு',
    trackingDesc:'அனைத்து செயலில் உள்ள கப்பல் வாகனங்களின் நிகழ்நேர GPS கண்காணிப்பு.',
    refresh:'புதுப்பி',lastRefresh:'கடைசி புதுப்பிப்பு',
    journeyProgress:'பயண முன்னேற்றம்',currentLocation:'தற்போதைய இருப்பிடம்',
    speed:'வேகம்',selectedTruck:'தேர்ந்தெடுக்கப்பட்ட வாகனம்',
    liveTrips:'நேரடி பயணங்கள்',truck:'வாகனம்',
    from:'முதல்',to:'வரை',
    reportsAnalytics:'அறிக்கைகள் & பகுப்பாய்வு',
    reportsDesc:'தளம் முழுவதும் செயல்திறன் அளவீடுகள், பயண பகுப்பாய்வு மற்றும் ஓட்டுநர் திறன் அறிக்கைகள்.',
    exportPDF:'PDF அறிக்கையை ஏற்றுமதி செய்',
    totalTrips:'மொத்த பயணங்கள்',completedTrips:'முடிந்த பயணங்கள்',
    pendingScheduled:'நிலுவை / திட்டமிடப்பட்டது',totalDrivers:'மொத்த ஓட்டுநர்கள்',
    totalOwners:'மொத்த சரக்கு உரிமையாளர்கள்',avgSuccess:'சராசரி வெற்றி விகிதம்',
    monthlyTrips:'மாதாந்திர பயணங்கள் — 2025-2026',
    tripVolume:'மாத வாரியாக பயண அளவு',tripSuccess:'பயண வெற்றி விகிதம்',
    successRate:'வெற்றி விகிதம்',driverPerformance:'ஓட்டுநர் செயல்திறன் அறிக்கை',
    topDrivers:'முதல் 6 ஓட்டுநர்கள் · முடித்த பயணங்களின் அடிப்படையில் தரவரிசை',
    rank:'தரவரிசை',tripsCount:'பயணங்கள் முடிந்தன',ontime:'சரியான நேரம் %',
    avgRating:'சராசரி மதிப்பீடு',performance:'செயல்திறன்',
    platformStats:'தள புள்ளிவிவரங்கள்',
    avgDistance:'ஒரு பயணத்திற்கான சராசரி தூரம்',peakMonth:'அதிக முன்பதிவு மாதம்',
    platformUptime:'தள இயக்க நேரம்',
    notifPage:'அறிவிப்புகள்',
    notifDesc:'அனைத்து நிகழ்நேர தள எச்சரிக்கைகள், பதிவுகள், பயணங்கள் மற்றும் அமைப்பு நிகழ்வுகள்.',
    markAllRead:'அனைத்தையும் வாசித்ததாகக் குறி',allNotifs:'அனைத்தும்',
    highPriority:'உயர் முன்னுரிமை',medium:'நடுத்தர',info:'தகவல்',
    priority:'முன்னுரிமை',reviewDriver:'ஓட்டுநரை மதிப்பாய்வு செய்',
    reviewOwner:'உரிமையாளரை மதிப்பாய்வு செய்',trackTrip:'பயணத்தை கண்காணி',
    viewTrip:'பயணத்தைப் பார்',viewReport:'அறிக்கையைப் பார்',
    trackingPage:'நேரடி GPS கண்காணிப்பு',
    trackingPageDesc:'அனைத்து செயலில் உள்ள கப்பல் வாகனங்களின் நிகழ்நேர GPS கண்காணிப்பு.',
    openLiveTracking:'நேரடி கண்காணிப்பைத் திற →',
    adminProfile:'நிர்வாகி சுயவிவரம்',systemSettings:'அமைப்பு அமைப்புகள்',
    profileDesc:'நிர்வாகி அடையாளச் சான்றுகள், பணியாளர் பங்கு விவரங்கள் மற்றும் பாதுகாப்பு கட்டுப்பாடுகளை நிர்வகிக்கவும்.',
    settingsDesc:'அமைப்பு அறிவிப்புகள், மொழி உள்ளூர்மயமாக்கல், தனியுரிமை கட்டுப்பாடுகள் மற்றும் பாதுகாப்பு கொள்கைகளை உள்ளமைக்கவும்.',
    profileTab:'நிர்வாகி சுயவிவரம்',settingsTab:'அமைப்பு அமைப்புகள்',
    masterAdminDetails:'முதன்மை நிர்வாகி விவரங்கள்',
    verifiedCredentials:'சரிபார்க்கப்பட்ட சான்றுகள்',
    adminName:'நிர்வாகி பெயர்',employeeId:'பணியாளர் ID',
    emailAddress:'மின்னஞ்சல்',phoneNumber:'தொலைபேசி எண்',
    rolePrivileges:'அமைப்புப் பங்கு & சிறப்புரிமைகள்',
    quickActionsTitle:'விரைவு செயல்கள்',
    editProfile:'சுயவிவரத்தைத் திருத்து',changePassword:'கடவுச்சொல்லை மாற்று',
    logoutBtn:'வெளியேறு',accountSecurity:'கணக்கு பாதுகாப்பு நிலை',
    securityDesc:'இரு-காரணி அங்கீகாரம் (2FA) இயக்கப்பட்டது. கடைசி கடவுச்சொல் புதுப்பிப்பு 14 நாட்களுக்கு முன்பு.',
    securityOk:'✓ பூஜ்ஜிய பாதுகாப்பு கொள்கை மீறல்கள்',
    notifSettings:'அறிவிப்புகள்',
    notifSettingsDesc:'எச்சரிக்கை விருப்பங்களை நிர்வகிக்கவும்',
    emailAlerts:'மின்னஞ்சல் எச்சரிக்கைகள்',emailAlertsDesc:'பயண நிறைவு மற்றும் நிலுவை ஓட்டுநர் KYC ஒப்புதல்களுக்கான நிகழ்நேர மின்னஞ்சல் புதுப்பிப்புகளைப் பெறவும்.',
    smsNotifs:'SMS அறிவிப்புகள்',smsNotifsDesc:'வாகன வழி தாமதங்கள் மற்றும் அவசர எச்சரிக்கைகளுக்கு அவசர SMS அறிவிப்புகளை அனுப்பவும்.',
    pushNotifs:'மொபைல் புஷ் அறிவிப்புகள்',pushNotifsDesc:'இணைக்கப்பட்ட மொபைல் சாதனங்களுக்கு நிகழ்நேர எச்சரிக்கைகளை அனுப்பவும்.',
    criticalOnly:'முக்கியமான அதிகரிப்புகள் மட்டும்',criticalOnlyDesc:'குறைந்த முன்னுரிமை பொருட்களை வடிகட்டி, உயர்-தீவிர சம்பவங்களை மட்டும் அதிகரிக்கவும்.',
    weeklyDigest:'வாராந்திர பகுப்பாய்வு சுருக்கம்',weeklyDigestDesc:'கப்பல் செயல்திறனை சுருக்கமாகக் கூறும் தானியங்கி திங்கள் காலை PDF மின்னஞ்சல் சுருக்கம்.',
    langLocal:'மொழி & உள்ளூர்மயமாக்கல்',
    langLocalDesc:'தள மொழி & நேர மண்டலம்',
    language:'மொழி',timezone:'அமைப்பு நேர மண்டலம்',
    currency:'நாணய வடிவம்',dateFormat:'தேதி வடிவம்',
    privacy:'தனியுரிமை',privacyDesc:'தரவு பகிர்வு & தணிக்கை கண்காணிப்பு',
    locationTelemetry:'இருப்பிட டெலிமெட்ரி அணுகல் கட்டுப்பாடு',
    locationTelemetryDesc:'செயலில் உள்ள வாகன கண்காணிப்புக்கான குறியாக்கப்பட்ட நேரடி GPS ஸ்ட்ரீமிங் பதிவுகளை இயக்கவும்.',
    aiCoPilotOptIn:'AI செயல்பாடுகள் இணை விமானி உகப்பாக்கம்',
    aiCoPilotOptInDesc:'AI வழி முன்கணிப்பு மாதிரிகளை மேம்படுத்த அனானிமைஸ் செய்யப்பட்ட பயண டெலிமெட்ரி தரவை அனுமதிக்கவும்.',
    auditLogging:'அமைப்பு தணிக்கை தடம் பதிவு',
    auditLoggingDesc:'இணக்கத்திற்கான அனைத்து முதன்மை நிர்வாகி செயல்களின் முழுமையான கண்காணிப்பு பதிவுகளைப் பதிவு செய்யவும்.',
    thirdPartySharing:'மூன்றாம் தரப்பு ஒருங்கிணைப்பு API தரவு பகிர்வு',
    thirdPartySharingDesc:'சரிபார்க்கப்பட்ட தளவாட கூட்டாளர் APIகளுக்கு கட்டுப்படுத்தப்பட்ட டெலிமெட்ரி அணுகலை அனுமதிக்கவும்.',
    security:'பாதுகாப்பு',securityTitle:'நிறுவன பாதுகாப்பு கொள்கைகள்',
    twoFactor:'இரு-காரணி அங்கீகாரம் (2FA)',
    twoFactorDesc:'உள்நுழைவில் அங்கீகார பயன்பாடு வழியாக கால-அடிப்படையிலான OTP குறியீடு தேவை.',
    sessionTimeout:'நிர்வாகி அமர்வு நேர முடிவு',
    sessionTimeoutDesc:'செயலற்ற காலத்திற்குப் பிறகு அமர்வை தானாக பூட்டவும்.',
    apiKeyAccess:'REST API விசை அணுகல்',
    apiKeyAccessDesc:'தானியங்கி அனுப்புதல் அமைப்புகளுக்கு முதன்மை REST API விசைகள் இயக்கப்பட்டன.',
    systemInfra:'அமைப்பு உள்கட்டமைப்பு நிலை',
    allServicesOp:'🟢 அனைத்து சேவைகளும் செயலில்',
    activeTrips:'செயலில் உள்ள பயண கண்காணிப்பு',
    activeTripsShort:'செயலில் உள்ள பயணங்கள்',
    liveGpsPreview:'நேரடி கப்பல் GPS கண்காணிப்பு முன்னோட்டம்',
    addDriver:'+ ஓட்டுநரைச் சேர்',cancel:'ரத்துசெய்',
    currentPassword:'தற்போதைய கடவுச்சொல்',newPassword:'புதிய கடவுச்சொல்',
    confirmPassword:'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    saveChanges:'மாற்றங்களை சேமி',updatePassword:'கடவுச்சொல்லை புதுப்பி',
    confirmLogout:'வெளியேறுவதை உறுதிப்படுத்தவும்',
    logoutConfirmMsg:'நீங்கள் நிர்வாகி கன்சோலில் இருந்து வெளியேற விரும்புகிறீர்களா?',
    yesLogout:'ஆம், வெளியேறு',
    activeSession:'🟢 செயலில் உள்ள அமர்வு',
    employeeLabel:'பணியாளர் ID:',roleLabel:'பங்கு:',deptLabel:'துறை:',
    mapActiveTrucks:'வழியில் செயலில் உள்ள வாகனங்கள்',
    legend:'குறிப்பு',route:'வழி',
    signalStrong:'GPS சமிக்ஞை: வலுவானது · 100%',
    previous:'முந்தைய',nextS:'அடுத்து',
    total:'மொத்தம்',verified:'சரிபார்க்கப்பட்டது',
    pendingMatch:'நிலுவை பொருத்தம்',pendingApproval:'நிலுவை ஒப்புதல்',
    kycVerification:'KYC சரிபார்ப்பு தேவை',
    onTimeSla:'சரியான நேர SLA',
    allTime:'அனைத்து நேரம்',avg:'சராசரி',
  },
  te: {
    dashboard:'డాష్‌బోర్డ్',drivers:'డ్రైవర్ నిర్వహణ',owners:'కార్గో యజమాని నిర్వహణ',
    trips:'ట్రిప్ నిర్వహణ',tracking:'ప్రత్యక్ష ట్రాకింగ్',reports:'నివేదికలు & విశ్లేషణ',
    notifications:'నోటిఫికేషన్లు',profile:'ప్రొఫైల్',settings:'సెట్టింగ్‌లు',
    logout:'లాగ్అవుట్',analyticsSystem:'విశ్లేషణ & సిస్టమ్',
    fleetOverview:'ఫ్లీట్ & లాజిస్టిక్స్ అవలోకనం',liveMasterFeed:'ప్రత్యక్ష మాస్టర్ ఫీడ్',
    quickActions:'త్వరిత చర్యలు',viewDrivers:'డ్రైవర్లను చూడండి',viewOwners:'కార్గో యజమానులను చూడండి',
    viewTrips:'ట్రిప్‌లను చూడండి',generateReports:'నివేదికలను రూపొందించండి',
    systemStatus:'సిస్టమ్ స్థితి',allOperational:'అన్నీ పనిచేస్తున్నాయి',
    pendingApprovals:'పెండింగ్ ఆమోదాలు',driversLabel:'డ్రైవర్లు',ownersLabel:'యజమానులు',
    approve:'ఆమోదించు',reject:'తిరస్కరించు',app:'ఆమో',rej:'తిర',
    aiCopilot:'AI కో-పైలట్',active:'క్రియాశీల',
    recentNotifications:'ఇటీవలి నోటిఫికేషన్లు',viewAll:'అన్నీ చూడండి',
    driverManagement:'డ్రైవర్ నిర్వహణ',
    back:'వెనుక',nextCargoOwners:'తదుపరి: కార్గో యజమానులు →',
    totalRegistered:'మొత్తం నమోదు',activeDrivers:'చురుకైన డ్రైవర్లు',
    pending:'పెండింగ్ ఆమోదాలు',suspended:'సస్పెండ్ చేయబడింది',
    all:'అన్నీ',addDriver:'+ డ్రైవర్ను జోడించు',
    id:'ID',name:'పేరు',truckNo:'ట్రక్ నెం',vehicleType:'వాహన రకం',
    phone:'ఫోన్',status:'స్థితి',rating:'రేటింగ్',actions:'చర్యలు',
    view:'చూడు',suspend:'సస్పెండ్',activate:'యాక్టివేట్',
    email:'ఇమెయిల్',location:'స్థానం',
    tripManagement:'ట్రిప్ నిర్వహణ',
    inTransit:'రవాణాలో',scheduledS:'షెడ్యూల్ చేయబడింది',
    delayed:'ఆలస్యం',completedStatus:'పూర్తయింది',
    reportsAnalytics:'నివేదికలు & విశ్లేషణ',
    totalTrips:'మొత్తం ట్రిప్‌లు',completedTrips:'పూర్తయిన ట్రిప్‌లు',
    adminProfile:'అడ్మిన్ ప్రొఫైల్',systemSettings:'సిస్టమ్ సెట్టింగ్‌లు',
    editProfile:'ప్రొఫైల్‌ను సవరించు',changePassword:'పాస్‌వర్డ్ మార్చు',
    logoutBtn:'లాగ్అవుట్',cancel:'రద్దు',
    language:'భాష',timezone:'సమయ మండలి',
    security:'భద్రత',privacy:'గోప్యత',
    settingsTab:'సిస్టమ్ సెట్టింగ్‌లు',profileTab:'అడ్మిన్ ప్రొఫైల్',
  },
  hi: {
    dashboard:'डैशबोर्ड',drivers:'ड्राइवर प्रबंधन',owners:'कार्गो मालिक प्रबंधन',
    trips:'ट्रिप प्रबंधन',tracking:'लाइव ट्रैकिंग',reports:'रिपोर्ट और एनालिटिक्स',
    notifications:'सूचनाएं',profile:'प्रोफ़ाइल',settings:'सेटिंग्स',
    logout:'लॉगआउट',analyticsSystem:'एनालिटिक्स और सिस्टम',
    fleetOverview:'फ्लीट और लॉजिस्टिक्स अवलोकन',liveMasterFeed:'लाइव मास्टर फ़ीड',
    quickActions:'त्वरित कार्रवाइयां',viewDrivers:'ड्राइवर देखें',viewOwners:'कार्गो मालिक देखें',
    viewTrips:'ट्रिप देखें',generateReports:'रिपोर्ट जनरेट करें',
    systemStatus:'सिस्टम स्थिति',allOperational:'सभी सेवाएं चालू',
    pendingApprovals:'लंबित अनुमोदन',driversLabel:'ड्राइवर',ownersLabel:'मालिक',
    approve:'अनुमोदन',reject:'अस्वीकार',app:'अनु',rej:'अस्वी',
    aiCopilot:'AI सह-पायलट',active:'सक्रिय',
    recentNotifications:'हाल की सूचनाएं',viewAll:'सभी देखें',
    driverManagement:'ड्राइवर प्रबंधन',
    back:'पीछे',nextCargoOwners:'अगला: कार्गो मालिक →',
    totalRegistered:'कुल पंजीकृत',activeDrivers:'सक्रिय ड्राइवर',
    pending:'लंबित अनुमोदन',suspended:'निलंबित',
    all:'सभी',addDriver:'+ ड्राइवर जोड़ें',
    id:'आईडी',name:'नाम',truckNo:'ट्रक नं',vehicleType:'वाहन प्रकार',
    phone:'फ़ोन',status:'स्थिति',rating:'रेटिंग',actions:'कार्रवाइयां',
    view:'देखें',suspend:'निलंबित',activate:'सक्रिय',
    email:'ईमेल',location:'स्थान',
    tripManagement:'ट्रिप प्रबंधन',
    inTransit:'यात्रा में',scheduledS:'निर्धारित',
    delayed:'विलंबित',completedStatus:'पूर्ण',
    reportsAnalytics:'रिपोर्ट और एनालिटिक्स',
    totalTrips:'कुल ट्रिप',completedTrips:'पूर्ण ट्रिप',
    adminProfile:'व्यवस्थापक प्रोफ़ाइल',systemSettings:'सिस्टम सेटिंग्स',
    editProfile:'प्रोफ़ाइल संपादित करें',changePassword:'पासवर्ड बदलें',
    logoutBtn:'लॉगआउट',cancel:'रद्द करें',
    language:'भाषा',timezone:'समय क्षेत्र',
    security:'सुरक्षा',privacy:'गोपनीयता',
    settingsTab:'सिस्टम सेटिंग्स',profileTab:'व्यवस्थापक प्रोफ़ाइल',
  },
  kn: {
    dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',drivers:'ಚಾಲಕ ನಿರ್ವಹಣೆ',owners:'ಕಾರ್ಗೋ ಮಾಲೀಕ ನಿರ್ವಹಣೆ',
    trips:'ಟ್ರಿಪ್ ನಿರ್ವಹಣೆ',tracking:'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',reports:'ವರದಿಗಳು & ವಿಶ್ಲೇಷಣೆ',
    notifications:'ಅಧಿಸೂಚನೆಗಳು',profile:'ಪ್ರೊಫೈಲ್',settings:'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout:'ಲಾಗ್ಔಟ್',analyticsSystem:'ವಿಶ್ಲೇಷಣೆ & ವ್ಯವಸ್ಥೆ',
    fleetOverview:'ಫ್ಲೀಟ್ & ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಅವಲೋಕನ',liveMasterFeed:'ಲೈವ್ ಮಾಸ್ಟರ್ ಫೀಡ್',
    quickActions:'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',viewDrivers:'ಚಾಲಕರನ್ನು ನೋಡಿ',viewOwners:'ಕಾರ್ಗೋ ಮಾಲೀಕರನ್ನು ನೋಡಿ',
    viewTrips:'ಟ್ರಿಪ್‌ಗಳನ್ನು ನೋಡಿ',generateReports:'ವರದಿಗಳನ್ನು ರಚಿಸಿ',
    systemStatus:'ವ್ಯವಸ್ಥೆ ಸ್ಥಿತಿ',allOperational:'ಎಲ್ಲವೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ',
    pendingApprovals:'ಬಾಕಿ ಅನುಮೋದನೆಗಳು',driversLabel:'ಚಾಲಕರು',ownersLabel:'ಮಾಲೀಕರು',
    approve:'ಅನುಮೋದಿಸು',reject:'ತಿರಸ್ಕರಿಸು',app:'ಅನು',rej:'ತಿರ',
    aiCopilot:'AI ಸಹ-ಪೈಲಟ್',active:'ಸಕ್ರಿಯ',
    recentNotifications:'ಇತ್ತೀಚಿನ ಅಧಿಸೂಚನೆಗಳು',viewAll:'ಎಲ್ಲವನ್ನು ನೋಡಿ',
    driverManagement:'ಚಾಲಕ ನಿರ್ವಹಣೆ',
    back:'ಹಿಂದೆ',nextCargoOwners:'ಮುಂದೆ: ಕಾರ್ಗೋ ಮಾಲೀಕರು →',
    totalRegistered:'ಒಟ್ಟು ನೋಂದಾಯಿತ',activeDrivers:'ಸಕ್ರಿಯ ಚಾಲಕರು',
    pending:'ಬಾಕಿ ಅನುಮೋದನೆಗಳು',suspended:'ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ',
    all:'ಎಲ್ಲಾ',addDriver:'+ ಚಾಲಕ ಸೇರಿಸಿ',
    id:'ಐಡಿ',name:'ಹೆಸರು',truckNo:'ಟ್ರಕ್ ನಂ',vehicleType:'ವಾಹನ ಪ್ರಕಾರ',
    phone:'ಫೋನ್',status:'ಸ್ಥಿತಿ',rating:'ರೇಟಿಂಗ್',actions:'ಕ್ರಿಯೆಗಳು',
    view:'ನೋಡಿ',suspend:'ಅಮಾನತು',activate:'ಸಕ್ರಿಯಗೊಳಿಸು',
    email:'ಇಮೇಲ್',location:'ಸ್ಥಳ',
    tripManagement:'ಟ್ರಿಪ್ ನಿರ್ವಹಣೆ',
    inTransit:'ಸಾಗಣೆಯಲ್ಲಿ',scheduledS:'ನಿಗದಿತ',
    delayed:'ವಿಳಂಬ',completedStatus:'ಪೂರ್ಣಗೊಂಡಿದೆ',
    reportsAnalytics:'ವರದಿಗಳು & ವಿಶ್ಲೇಷಣೆ',
    totalTrips:'ಒಟ್ಟು ಟ್ರಿಪ್‌ಗಳು',completedTrips:'ಪೂರ್ಣಗೊಂಡ ಟ್ರಿಪ್‌ಗಳು',
    adminProfile:'ಆಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್',systemSettings:'ಸಿಸ್ಟಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    editProfile:'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',changePassword:'ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ',
    logoutBtn:'ಲಾಗ್ಔಟ್',cancel:'ರದ್ದುಮಾಡಿ',
    language:'ಭಾಷೆ',timezone:'ಸಮಯ ವಲಯ',
    security:'ಭದ್ರತೆ',privacy:'ಗೌಪ್ಯತೆ',
    settingsTab:'ಸಿಸ್ಟಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',profileTab:'ಆಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್',
  },
  ml: {
    dashboard:'ഡാഷ്‌ബോർഡ്',drivers:'ഡ്രൈവർ മാനേജ്മെന്റ്',owners:'കാർഗോ ഉടമ മാനേജ്മെന്റ്',
    trips:'ട്രിപ്പ് മാനേജ്മെന്റ്',tracking:'തത്സമയ ട്രാക്കിംഗ്',reports:'റിപ്പോർട്ടുകളും വിശകലനങ്ങളും',
    notifications:'അറിയിപ്പുകൾ',profile:'പ്രൊഫൈൽ',settings:'ക്രമീകരണങ്ങൾ',
    logout:'ലോഗൗട്ട്',analyticsSystem:'വിശകലനവും സിസ്റ്റവും',
    fleetOverview:'ഫ്ലീറ്റ് & ലോജിസ്റ്റിക്സ് അവലോകനം',liveMasterFeed:'തത്സമയ മാസ്റ്റർ ഫീഡ്',
    quickActions:'ദ്രുത പ്രവർത്തനങ്ങൾ',viewDrivers:'ഡ്രൈവർമാരെ കാണുക',viewOwners:'കാർഗോ ഉടമകളെ കാണുക',
    viewTrips:'ട്രിപ്പുകൾ കാണുക',generateReports:'റിപ്പോർട്ടുകൾ സൃഷ്ടിക്കുക',
    systemStatus:'സിസ്റ്റം നില',allOperational:'എല്ലാം പ്രവർത്തനക്ഷമം',
    pendingApprovals:'തീർപ്പുകൽപ്പിക്കാത്ത അനുമതികൾ',driversLabel:'ഡ്രൈവർമാർ',ownersLabel:'ഉടമകൾ',
    approve:'അംഗീകരിക്കുക',reject:'നിരസിക്കുക',app:'അംഗീ',rej:'നിര',
    aiCopilot:'AI കോ-പൈലറ്റ്',active:'സജീവം',
    recentNotifications:'സമീപകാല അറിയിപ്പുകൾ',viewAll:'എല്ലാം കാണുക',
    driverManagement:'ഡ്രൈവർ മാനേജ്മെന്റ്',
    back:'പിന്നിലേക്ക്',nextCargoOwners:'അടുത്തത്: കാർഗോ ഉടമകൾ →',
    totalRegistered:'ആകെ രജിസ്റ്റർ ചെയ്തത്',activeDrivers:'സജീവ ഡ്രൈവർമാർ',
    pending:'തീർപ്പുകൽപ്പിക്കാത്ത അനുമതികൾ',suspended:'സസ്പെൻഡ് ചെയ്തു',
    all:'എല്ലാം',addDriver:'+ ഡ്രൈവറെ ചേർക്കുക',
    id:'ഐഡി',name:'പേര്',truckNo:'ട്രക്ക് നമ്പർ',vehicleType:'വാഹന തരം',
    phone:'ഫോൺ',status:'നില',rating:'റേറ്റിംഗ്',actions:'പ്രവർത്തനങ്ങൾ',
    view:'കാണുക',suspend:'സസ്പെൻഡ്',activate:'സജീവമാക്കുക',
    email:'ഇമെയിൽ',location:'സ്ഥലം',
    tripManagement:'ട്രിപ്പ് മാനേജ്മെന്റ്',
    inTransit:'യാത്രയിൽ',scheduledS:'ഷെഡ്യൂൾ ചെയ്തത്',
    delayed:'വൈകി',completedStatus:'പൂർത്തിയായി',
    reportsAnalytics:'റിപ്പോർട്ടുകളും വിശകലനങ്ങളും',
    totalTrips:'ആകെ ട്രിപ്പുകൾ',completedTrips:'പൂർത്തിയായ ട്രിപ്പുകൾ',
    adminProfile:'അഡ്മിൻ പ്രൊഫൈൽ',systemSettings:'സിസ്റ്റം ക്രമീകരണങ്ങൾ',
    editProfile:'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക',changePassword:'പാസ്‌വേഡ് മാറ്റുക',
    logoutBtn:'ലോഗൗട്ട്',cancel:'റദ്ദാക്കുക',
    language:'ഭാഷ',timezone:'സമയ മേഖല',
    security:'സുരക്ഷ',privacy:'സ്വകാര്യത',
    settingsTab:'സിസ്റ്റം ക്രമീകരണങ്ങൾ',profileTab:'അഡ്മിൻ പ്രൊഫൈൽ',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState('en-US');
  const t = (key) => (TRANSLATIONS[language] && TRANSLATIONS[language][key]) || TRANSLATIONS['en-US'][key] || key;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav]               = useState('dashboard');
  const [searchQuery, setSearchQuery]           = useState('');
  const [isRefreshing, setIsRefreshing]         = useState(false);
  const [toastMsg, setToastMsg]                 = useState('');

  /* Registered Drivers State */
  const [driversList, setDriversList]           = useState(INITIAL_DRIVERS);
  const [driverFilter, setDriverFilter]         = useState('All');
  const [selectedDriverModal, setSelectedDriverModal] = useState(null);

  /* Registered Cargo Owners State */
  const [ownersList, setOwnersList]             = useState(INITIAL_CARGO_OWNERS);
  const [ownerFilter, setOwnerFilter]           = useState('All');
  const [selectedOwnerModal, setSelectedOwnerModal]   = useState(null);

  /* Trip Management State */
  const [tripFilter, setTripFilter]             = useState('All');
  const [selectedTripModal, setSelectedTripModal] = useState(null);
  const [allTripsList, setAllTripsList]         = useState([]);
  const [dashboardStats, setDashboardStats]     = useState(null);

  /* Live Tracking State */
  const [selectedTrackTruck, setSelectedTrackTruck] = useState(TRACKING_TRUCKS[0]);
  const [trackLastRefresh, setTrackLastRefresh] = useState(new Date());
  const [trackingTrucks, setTrackingTrucks] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  /* Approval States */
  const [driverApprovals, setDriverApprovals] = useState(INITIAL_DRIVER_APPROVALS);
  const [ownerApprovals, setOwnerApprovals]   = useState(INITIAL_OWNER_APPROVALS);

  /* Notifications State */
  const [notiFilter, setNotiFilter]           = useState('All');

  /* Profile & Settings State */
  const [profileSubTab, setProfileSubTab]       = useState('profile'); // 'profile' | 'settings'
  const [isEditProfileOpen, setIsEditProfileOpen]   = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen]   = useState(false);

  const [adminProfile, setAdminProfile] = useState({
    name: 'Rajesh V. Nair',
    employeeId: 'ADM-2026-9041',
    email: 'admin.rajesh@cargolink.ai',
    phone: '+91 98765 00100',
    role: 'Master Fleet Administrator',
    department: 'Global Logistics & Fleet Operations',
    initials: 'RN',
    photoBg: 'linear-gradient(135deg, #8B5E3C 0%, #4A3728 100%)',
    joinedDate: '15 Jan 2024',
    accessLevel: 'Level 5 — Super Admin Access',
  });

  const [editProfileForm, setEditProfileForm] = useState({
    name: 'Rajesh V. Nair',
    email: 'admin.rajesh@cargolink.ai',
    phone: '+91 98765 00100',
    department: 'Global Logistics & Fleet Operations',
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settingsState, setSettingsState] = useState({
    // Notifications
    emailAlerts: true,
    smsNotifs: true,
    pushNotifs: true,
    criticalOnly: false,
    weeklyDigest: true,
    // Language & Localization
    language: 'English (US)',
    timezone: 'IST (UTC +05:30) - Asia/Kolkata',
    currency: 'INR (₹)',
    dateFormat: 'DD/MM/YYYY',
    // Privacy
    locationTelemetry: true,
    aiCoPilotOptIn: true,
    auditLogging: true,
    thirdPartySharing: false,
    // Security
    twoFactor: true,
    sessionTimeout: '30 Minutes',
    apiKeyAccess: true,
    ipWhitelisting: true,
    passwordRotation: true,
  });

  useEffect(() => {
    if (activeNav === 'settings') setProfileSubTab('settings');
    if (activeNav === 'profile') setProfileSubTab('profile');
  }, [activeNav]);

  // Load admin profile from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cargolink_admin_user') || localStorage.getItem('cargolink_user');
      if (saved) {
        const p = JSON.parse(saved);
        const name = p.name || p.fullName || p.user?.fullName || p.user?.name || adminProfile.name;
        const email = p.email || p.user?.email || adminProfile.email;
        const phone = p.phone || p.user?.mobile || adminProfile.phone;
        const employeeId = p.employeeId || p.user?.employeeId || adminProfile.employeeId;
        const initials = (name && name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()) || adminProfile.initials;

        setAdminProfile(prev => ({
          ...prev,
          name,
          email,
          phone,
          employeeId,
          initials
        }));

        setEditProfileForm(prev => ({
          ...prev,
          name,
          email,
          phone,
        }));
      }
    } catch (e) {
      console.warn('Failed to load admin profile from localStorage', e);
    }
  }, []);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedDrivers, fetchedTrips, dashData] = await Promise.all([
          driverService.getAllDrivers(),
          tripService.getAllTrips(),
          dashboardService.getAdminDashboard()
        ]);

        if (fetchedDrivers.length > 0) {
          const mapped = fetchedDrivers.map(d => ({
            id: d._id || d.id,
            name: d.userId?.fullName || d.fullName || d.name || 'Unknown',
            initials: (d.userId?.fullName || d.fullName || d.name || '?').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase(),
            photoBg: 'linear-gradient(135deg, #8B5E3C, #6F472D)',
            truckNo: d.truckNumber || 'N/A',
            vehicleType: d.vehicleType || 'N/A',
            phone: d.userId?.mobile || d.mobile || 'N/A',
            status: d.status === 'AVAILABLE' ? 'Active' : d.status === 'ON_TRIP' ? 'Active' : d.status === 'UNAVAILABLE' ? 'Suspended' : 'Pending Approval',
            rating: d.rating || 0,
            trips: d.trips || 0,
            location: d.location || 'N/A',
            joinedDate: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A',
            licenseNo: d.drivingLicence || 'N/A',
            email: d.userId?.email || d.email || 'N/A',
          }));
          setDriversList(mapped);
        }

        if (fetchedTrips.length > 0) {
          setAllTripsList(fetchedTrips);
        }

        setDashboardStats(dashData);
      } catch (err) {
        console.warn('Failed to fetch admin data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const initials = editProfileForm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';
    setAdminProfile(prev => ({
      ...prev,
      name: editProfileForm.name,
      email: editProfileForm.email,
      phone: editProfileForm.phone,
      department: editProfileForm.department,
      initials,
    }));
    setIsEditProfileOpen(false);
    triggerToast('✅ Admin profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!changePasswordForm.currentPassword) {
      triggerToast('⚠️ Please enter your current password.');
      return;
    }
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      triggerToast('❌ New passwords do not match!');
      return;
    }
    if (changePasswordForm.newPassword.length < 6) {
      triggerToast('⚠️ Password must be at least 6 characters.');
      return;
    }
    setIsChangePasswordOpen(false);
    setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    triggerToast('🔒 Password changed successfully!');
  };

  const handleConfirmLogout = () => {
    triggerToast('👋 Logging out of Admin Console...');
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  /* Current Date & Time State */
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* Fetch GPS tracking data + auto-refresh every 15s */
  const fetchTrackingData = useCallback(async () => {
    try {
      setTrackingLoading(true);
      const res = await fetch('/api/tracking/live');
      if (!res.ok) throw new Error('GPS API unreachable');
      const json = await res.json();
      if (json.success && json.trucks) {
        setTrackingTrucks(json.trucks);
        setGpsError('');
      } else {
        throw new Error('Invalid GPS data');
      }
    } catch (err) {
      setGpsError(err.message);
    } finally {
      setTrackingLoading(false);
      setTrackLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    if (activeNav !== 'tracking') return;
    fetchTrackingData();
    const refreshTimer = setInterval(fetchTrackingData, 15000);
    return () => clearInterval(refreshTimer);
  }, [activeNav, fetchTrackingData]);

  /* Sync selected truck with latest API data */
  useEffect(() => {
    if (!selectedTrackTruck || trackingTrucks.length === 0) return;
    const updated = trackingTrucks.find(t => t.id === selectedTrackTruck.id);
    if (updated) setSelectedTrackTruck(updated);
  }, [trackingTrucks]);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('🔄 Admin Dashboard refreshed with latest live data.');
    }, 600);
  };

  /* Driver Actions */
  const handleApproveDriver = (driverId, driverName) => {
    setDriversList(prev => prev.map(d => d.id === driverId ? { ...d, status: 'Active' } : d));
    if (selectedDriverModal?.id === driverId) {
      setSelectedDriverModal(prev => ({ ...prev, status: 'Active' }));
    }
    triggerToast(`✅ Driver ${driverName} (${driverId}) has been approved & activated!`);
  };

  const handleSuspendDriver = (driverId, driverName) => {
    setDriversList(prev => prev.map(d => d.id === driverId ? { ...d, status: 'Suspended' } : d));
    if (selectedDriverModal?.id === driverId) {
      setSelectedDriverModal(prev => ({ ...prev, status: 'Suspended' }));
    }
    triggerToast(`⚠️ Driver ${driverName} (${driverId}) account suspended.`);
  };

  const handleActivateDriver = (driverId, driverName) => {
    setDriversList(prev => prev.map(d => d.id === driverId ? { ...d, status: 'Active' } : d));
    if (selectedDriverModal?.id === driverId) {
      setSelectedDriverModal(prev => ({ ...prev, status: 'Active' }));
    }
    triggerToast(`🟢 Driver ${driverName} (${driverId}) account reactivated.`);
  };

  /* Cargo Owner Actions */
  const handleApproveOwnerRecord = (ownerId, companyName) => {
    setOwnersList(prev => prev.map(o => o.id === ownerId ? { ...o, status: 'Active' } : o));
    if (selectedOwnerModal?.id === ownerId) {
      setSelectedOwnerModal(prev => ({ ...prev, status: 'Active' }));
    }
    triggerToast(`✅ Cargo Owner ${companyName} (${ownerId}) approved & activated!`);
  };

  const handleSuspendOwnerRecord = (ownerId, companyName) => {
    setOwnersList(prev => prev.map(o => o.id === ownerId ? { ...o, status: 'Suspended' } : o));
    if (selectedOwnerModal?.id === ownerId) {
      setSelectedOwnerModal(prev => ({ ...prev, status: 'Suspended' }));
    }
    triggerToast(`⚠️ Cargo Owner ${companyName} (${ownerId}) account suspended.`);
  };

  const handleActivateOwnerRecord = (ownerId, companyName) => {
    setOwnersList(prev => prev.map(o => o.id === ownerId ? { ...o, status: 'Active' } : o));
    if (selectedOwnerModal?.id === ownerId) {
      setSelectedOwnerModal(prev => ({ ...prev, status: 'Active' }));
    }
    triggerToast(`🟢 Cargo Owner ${companyName} (${ownerId}) account reactivated.`);
  };

  /* Pending Panel Approvals */
  const handleApproveDriverPending = (id, name) => {
    setDriverApprovals(prev => prev.filter(item => item.id !== id));
    triggerToast(`✅ Driver ${name} approved successfully!`);
  };

  const handleRejectDriverPending = (id, name) => {
    setDriverApprovals(prev => prev.filter(item => item.id !== id));
    triggerToast(`❌ Driver ${name} application rejected.`);
  };

  const handleApproveOwnerPending = (id, company) => {
    setOwnerApprovals(prev => prev.filter(item => item.id !== id));
    triggerToast(`✅ Cargo Owner ${company} approved.`);
  };

  const handleRejectOwnerPending = (id, company) => {
    setOwnerApprovals(prev => prev.filter(item => item.id !== id));
    triggerToast(`❌ Cargo Owner ${company} rejected.`);
  };

  /* Filtered Drivers list */
  const filteredDrivers = driversList.filter(d => {
    const matchesFilter = driverFilter === 'All' || d.status === driverFilter;
    const matchesSearch = searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.truckNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  /* Filtered Cargo Owners list */
  const filteredOwners = ownersList.filter(o => {
    const matchesFilter = ownerFilter === 'All' || o.status === ownerFilter;
    const matchesSearch = searchQuery === '' ||
      o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.gst.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="ad-root">

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="ad-toast-banner">
          <CheckCircle2 size={18} color="var(--ad-success)" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Driver Details Modal Overlay */}
      {selectedDriverModal && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedDriverModal(null)}>
          <div className="ad-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #4A3728 100%)', padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="ad-driver-photo-lg" style={{ background: selectedDriverModal.photoBg }}>
                  {selectedDriverModal.initials}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{selectedDriverModal.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ad-beige)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>ID: {selectedDriverModal.id}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ad-warning)', fontWeight: 700 }}>
                      <Star size={13} fill="var(--ad-warning)" /> {selectedDriverModal.rating}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDriverModal(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ad-bg)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--ad-border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>{t("status")}</span>
                <span className={`ad-driver-status-chip ${selectedDriverModal.status === 'Active' ? 'active' : selectedDriverModal.status === 'Pending Approval' ? 'pending' : 'suspended'}`}>
                  <span className="ad-status-dot" /> {selectedDriverModal.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("truckNo")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedDriverModal.truckNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("vehicleType")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedDriverModal.vehicleType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("phone")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedDriverModal.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("license")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedDriverModal.licenseNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("location")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedDriverModal.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("tripsCompleted")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-success)', marginTop: 2 }}>{selectedDriverModal.trips} Trips</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--ad-border)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Verification Status</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--ad-success)', fontWeight: 600 }}>
                    <BadgeCheck size={16} /> Commercial Driving License
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--ad-success)', fontWeight: 600 }}>
                    <BadgeCheck size={16} /> Truck Registration (RC)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--ad-border)' }}>
                {selectedDriverModal.status === 'Pending Approval' && (
                  <button className="ad-btn primary" onClick={() => handleApproveDriver(selectedDriverModal.id, selectedDriverModal.name)}>
                    <Check size={16} /> Approve Driver
                  </button>
                )}
                {selectedDriverModal.status === 'Active' && (
                  <button className="ad-btn-action suspend" style={{ padding: '10px 18px', fontSize: '0.85rem' }} onClick={() => handleSuspendDriver(selectedDriverModal.id, selectedDriverModal.name)}>
                    <ShieldAlert size={16} style={{ marginRight: 6 }} /> Suspend Driver
                  </button>
                )}
                {selectedDriverModal.status === 'Suspended' && (
                  <button className="ad-btn primary" onClick={() => handleActivateDriver(selectedDriverModal.id, selectedDriverModal.name)}>
                    <Check size={16} /> Reactivate Driver
                  </button>
                )}
                <button className="ad-btn ghost" style={{ marginLeft: 'auto' }} onClick={() => setSelectedDriverModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cargo Owner Details Modal Overlay */}
      {selectedOwnerModal && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedOwnerModal(null)}>
          <div className="ad-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #4A3728 100%)', padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="ad-driver-photo-lg" style={{ background: selectedOwnerModal.photoBg }}>
                  {selectedOwnerModal.initials}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{selectedOwnerModal.companyName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ad-beige)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>ID: {selectedOwnerModal.id}</span>
                    <span>•</span>
                    <span>Owner: {selectedOwnerModal.ownerName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOwnerModal(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ad-bg)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--ad-border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>{t("status")}</span>
                <span className={`ad-driver-status-chip ${selectedOwnerModal.status === 'Active' ? 'active' : selectedOwnerModal.status === 'Pending Approval' ? 'pending' : 'suspended'}`}>
                  <span className="ad-status-dot" /> {selectedOwnerModal.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("gst")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedOwnerModal.gst}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("ownerName")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedOwnerModal.ownerName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("emailAddress")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedOwnerModal.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("phoneNumber")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{selectedOwnerModal.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("loadsCreated")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-brown)', marginTop: 2 }}>{selectedOwnerModal.loadsCreated} Loads</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("totalSpent")}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-success)', marginTop: 2 }}>{selectedOwnerModal.totalSpent}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{t("address")}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ad-text-dark)', marginTop: 4, lineHeight: 1.4 }}>{selectedOwnerModal.address}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--ad-border)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>Enterprise Compliance</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--ad-success)', fontWeight: 600 }}>
                    <BadgeCheck size={16} /> GST Certificate Verified
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--ad-success)', fontWeight: 600 }}>
                    <BadgeCheck size={16} /> Corporate Bank Account Verified
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--ad-border)' }}>
                {selectedOwnerModal.status === 'Pending Approval' && (
                  <button className="ad-btn primary" onClick={() => handleApproveOwnerRecord(selectedOwnerModal.id, selectedOwnerModal.companyName)}>
                    <Check size={16} /> Approve Cargo Owner
                  </button>
                )}
                {selectedOwnerModal.status === 'Active' && (
                  <button className="ad-btn-action suspend" style={{ padding: '10px 18px', fontSize: '0.85rem' }} onClick={() => handleSuspendOwnerRecord(selectedOwnerModal.id, selectedOwnerModal.companyName)}>
                    <ShieldAlert size={16} style={{ marginRight: 6 }} /> Suspend Cargo Owner
                  </button>
                )}
                {selectedOwnerModal.status === 'Suspended' && (
                  <button className="ad-btn primary" onClick={() => handleActivateOwnerRecord(selectedOwnerModal.id, selectedOwnerModal.companyName)}>
                    <Check size={16} /> Reactivate Cargo Owner
                  </button>
                )}
                <button className="ad-btn ghost" style={{ marginLeft: 'auto' }} onClick={() => setSelectedOwnerModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="ad-modal-backdrop" onClick={() => setIsEditProfileOpen(false)}>
          <div className="ad-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #4A3728 100%)', padding: '20px 24px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Edit3 size={20} color="var(--ad-beige)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Edit Admin Profile</h3>
              </div>
              <button onClick={() => setIsEditProfileOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Admin Name</label>
                <input type="text" required value={editProfileForm.name} onChange={e => setEditProfileForm({ ...editProfileForm, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t("emailAddress")}</label>
                  <input type="email" required value={editProfileForm.email} onChange={e => setEditProfileForm({ ...editProfileForm, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t("phoneNumber")}</label>
                  <input type="text" required value={editProfileForm.phone} onChange={e => setEditProfileForm({ ...editProfileForm, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Department</label>
                <input type="text" value={editProfileForm.department} onChange={e => setEditProfileForm({ ...editProfileForm, department: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="ad-btn ghost" onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
                <button type="submit" className="ad-btn primary"><Check size={16} /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="ad-modal-backdrop" onClick={() => setIsChangePasswordOpen(false)}>
          <div className="ad-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #4A3728 100%)', padding: '20px 24px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Lock size={20} color="var(--ad-beige)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Change Password</h3>
              </div>
              <button onClick={() => setIsChangePasswordOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Current Password</label>
                <input type="password" required value={changePasswordForm.currentPassword} onChange={e => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })} placeholder="Enter current password" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>New Password</label>
                <input type="password" required value={changePasswordForm.newPassword} onChange={e => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })} placeholder="Min 6 characters" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
                <input type="password" required value={changePasswordForm.confirmPassword} onChange={e => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })} placeholder="Re-enter new password" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--ad-border)', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="ad-btn ghost" onClick={() => setIsChangePasswordOpen(false)}>Cancel</button>
                <button type="submit" className="ad-btn primary"><Lock size={14} /> Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="ad-modal-backdrop" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="ad-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 440, padding: 28, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: 'var(--ad-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <LogOut size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ad-text-dark)', marginBottom: 8 }}>Log Out of Admin Console?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ad-text-muted)', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to log out of CargoLINK AI Master Admin Console? You will need to authenticate again to access master controls.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="ad-btn ghost" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
              <button className="ad-btn-action suspend" style={{ padding: '10px 24px', fontSize: '0.88rem' }} onClick={handleConfirmLogout}>
                <LogOut size={16} style={{ marginRight: 6 }} /> Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          LEFT SIDEBAR
          ══════════════════════════════════════════════════════ */}
      <aside className={`ad-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>

        {/* Brand */}
        <div className="ad-sidebar-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('dashboard')}>
          <div className="ad-brand-icon">
            <Truck size={22} />
          </div>
          <div className="ad-brand-text">
            <span className="ad-brand-name">CARGO<span>LINK</span> AI</span>
            <span className="ad-brand-sub">Master Admin Console</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ad-sidebar-nav">
          <span className="ad-nav-section-label">Core Management</span>
          {SIDEBAR_ITEMS.slice(0, 5).map(({ id, icon: Icon, labelKey, badge }) => (
            <button
              key={id}
              className={`ad-nav-item ${activeNav === id ? 'active' : ''}`}
              onClick={() => { setActiveNav(id); triggerToast(`Navigated to ${t(labelKey)}`); }}
            >
              <span className="ad-nav-icon"><Icon size={20} /></span>
              <span className="ad-nav-text">{t(labelKey)}</span>
              {badge && <span className="ad-nav-badge">{badge}</span>}
            </button>
          ))}

          <span className="ad-nav-section-label">{t('analyticsSystem')}</span>
          {SIDEBAR_ITEMS.slice(5).map(({ id, icon: Icon, labelKey, badge }) => (
            <button
              key={id}
              className={`ad-nav-item ${(activeNav === id || (id === 'profile' && activeNav === 'profile' && profileSubTab === 'profile') || (id === 'settings' && activeNav === 'settings' && profileSubTab === 'settings')) ? 'active' : ''}`}
              onClick={() => { setActiveNav(id); triggerToast(`Navigated to ${t(labelKey)}`); }}
            >
              <span className="ad-nav-icon"><Icon size={20} /></span>
              <span className="ad-nav-text">{t(labelKey)}</span>
              {badge && <span className="ad-nav-badge">{badge}</span>}
            </button>
          ))}

          <button className="ad-nav-item" onClick={() => setIsLogoutModalOpen(true)}>
            <span className="ad-nav-icon"><LogOut size={20} /></span>
            <span className="ad-nav-text">{t('logout')}</span>
          </button>
        </nav>

        {/* Footer profile */}
        <div className="ad-sidebar-footer">
          <div className="ad-sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => setActiveNav('profile')}>
            <div className="ad-profile-avatar-sm">
              AD
              <span className="ad-profile-online-dot" />
            </div>
            <div className="ad-profile-sm-info">
              <span className="ad-profile-sm-name">System Admin</span>
              <span className="ad-profile-sm-role">Master Administrator</span>
            </div>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          className="ad-sidebar-toggle"
          onClick={() => setSidebarCollapsed(p => !p)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MAIN AREA
          ══════════════════════════════════════════════════════ */}
      <div className={`ad-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <header className="ad-topbar">
          <div className="ad-page-breadcrumb">
            <div className="ad-page-title">
              🚛 CARGOLINK AI
            </div>
            <div className="ad-page-sub">AI Powered Smart Return Load Matching Platform</div>
          </div>

          <div className="ad-topbar-spacer" />

          {/* Search Bar */}
          <div className="ad-search-bar">
            <Search size={16} className="ad-search-icon" />
            <input
              className="ad-search-input"
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="ad-topbar-actions">
            {/* Current Date & Time Badge */}
            <div className="ad-time-badge">
              <Calendar size={14} color="var(--ad-brown)" />
              <span>{formattedDate} &nbsp;|&nbsp; {formattedTime}</span>
            </div>

            {/* Notification Bell */}
            <button className="ad-icon-btn" title="Notifications" onClick={() => setActiveNav('notifications')}>
              <Bell size={18} />
              <span className="ad-notif-dot" />
            </button>

            {/* Language Selector */}
            <button className="ad-icon-btn" title={language} onClick={() => setProfileSubTab('settings')}>
              <Globe size={18} />
            </button>

            {/* Refresh */}
            <button className="ad-icon-btn" title="Refresh data" onClick={handleRefresh}>
              <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} style={{ transition: 'transform 0.5s ease' }} />
            </button>

            <span className="ad-topbar-divider" />

            {/* Admin Profile Chip */}
            <div className="ad-profile-chip" onClick={() => setActiveNav('profile')}>
              <div className="ad-profile-avatar">
                AD
              </div>
              <div className="ad-profile-info">
                <span className="ad-profile-name">System Admin</span>
                <span className="ad-profile-role">Master Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── DASHBOARD CONTENT / VIEW SWITCHER ───────────── */}
        <div className="ad-content">

          {activeNav === 'drivers' ? (
            /* ══════════════════════════════════════════════════════
               DRIVER MANAGEMENT PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={24} color="var(--ad-brown)" /> {t('driverManagement')}
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    {t('driverDesc')}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('dashboard')}>
                    ← {t('dashboard')}
                  </button>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('owners')}>
                    {t('nextCargoOwners')}
                  </button>
                  <button className="ad-btn primary" onClick={() => triggerToast('➕ New Driver Onboarding form opened')}>
                    {t('addDriver')}
                  </button>
                </div>
              </div>

              {/* Drivers Summary Bar */}
              <div className="ad-status-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setDriverFilter('All')}>
                  <div style={{ background: 'var(--ad-brown-light)', color: 'var(--ad-brown)', padding: 10, borderRadius: 10 }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>{driversList.length}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{t("totalRegistered")}</div>
                  </div>
                </div>

                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setDriverFilter('Active')}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--ad-success)', padding: 10, borderRadius: 10 }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>
                      {driversList.filter(d => d.status === 'Active').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{t("activeDrivers")}</div>
                  </div>
                </div>

                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setDriverFilter('Pending Approval')}>
                  <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--ad-warning)', padding: 10, borderRadius: 10 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>
                      {driversList.filter(d => d.status === 'Pending Approval').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{t("pendingApprovals")}</div>
                  </div>
                </div>

                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setDriverFilter('Suspended')}>
                  <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--ad-danger)', padding: 10, borderRadius: 10 }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>
                      {driversList.filter(d => d.status === 'Suspended').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{t("suspended")}</div>
                  </div>
                </div>
              </div>

              {/* Main Driver Table Card */}
              <div className="ad-card">
                {/* Filter Tabs & Search Controls */}
                <div className="ad-card-header" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {['All', 'Active', 'Pending Approval', 'Suspended'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setDriverFilter(filter)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 20,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: driverFilter === filter ? '1.5px solid var(--ad-brown)' : '1px solid var(--ad-border)',
                          background: driverFilter === filter ? 'var(--ad-brown-light)' : 'var(--ad-bg)',
                          color: driverFilter === filter ? 'var(--ad-brown)' : 'var(--ad-text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: 'var(--font)',
                        }}
                      >
                        {filter} {filter === 'All' ? `(${driversList.length})` : `(${driversList.filter(d => d.status === filter).length})`}
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>
                    Showing <strong>{filteredDrivers.length}</strong> drivers
                  </div>
                </div>

                {/* REGISTERED DRIVERS TABLE */}
                <div className="ad-table-wrapper">
                  <table className="ad-trips-table">
                    <thead>
                      <tr>
                        <th>Driver Photo</th>
                        <th>{t("driverName")}</th>
                        <th>Driver ID</th>
                        <th>{t("truckNo")}</th>
                        <th>{t("vehicleType")}</th>
                        <th>Mobile Number</th>
                        <th>Status</th>
                        <th>{t("rating")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrivers.map(driver => (
                        <tr key={driver.id}>
                          <td>
                            <div className="ad-driver-photo-circle" style={{ background: driver.photoBg }}>
                              {driver.initials}
                            </div>
                          </td>

                          <td style={{ fontWeight: 700, color: 'var(--ad-text-dark)' }}>
                            {driver.name}
                          </td>

                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ad-brown)', fontSize: '0.85rem' }}>
                              {driver.id}
                            </span>
                          </td>

                          <td style={{ fontWeight: 600 }}>
                            {driver.truckNo}
                          </td>

                          <td style={{ color: 'var(--ad-text-body)', fontSize: '0.82rem' }}>
                            {driver.vehicleType}
                          </td>

                          <td style={{ color: 'var(--ad-text-muted)', fontWeight: 500, fontSize: '0.82rem' }}>
                            {driver.phone}
                          </td>

                          <td>
                            <span className={`ad-driver-status-chip ${driver.status === 'Active' ? 'active' : driver.status === 'Pending Approval' ? 'pending' : 'suspended'}`}>
                              <span className="ad-status-dot" />
                              {driver.status}
                            </span>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--ad-brown)', fontSize: '0.85rem' }}>
                              <Star size={13} fill="var(--ad-brown)" color="var(--ad-brown)" />
                              {driver.rating}
                            </div>
                          </td>

                          <td>
                            <div className="ad-action-group">
                              <button
                                className="ad-btn-action view"
                                title="View Driver Details"
                                onClick={() => setSelectedDriverModal(driver)}
                              >
                                View
                              </button>

                              {driver.status === 'Pending Approval' && (
                                <button
                                  className="ad-btn-action approve"
                                  onClick={() => handleApproveDriver(driver.id, driver.name)}
                                >
                                  Approve
                                </button>
                              )}

                              {driver.status === 'Active' && (
                                <button
                                  className="ad-btn-action suspend"
                                  onClick={() => handleSuspendDriver(driver.id, driver.name)}
                                >
                                  Suspend
                                </button>
                              )}

                              {driver.status === 'Suspended' && (
                                <button
                                  className="ad-btn-action activate"
                                  onClick={() => handleActivateDriver(driver.id, driver.name)}
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredDrivers.length === 0 && (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ad-text-muted)' }}>
                            No drivers found matching current filter or search query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : activeNav === 'owners' ? (
            /* ══════════════════════════════════════════════════════
               CARGO OWNER MANAGEMENT PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Building size={24} color="var(--ad-brown)" /> Cargo Owner Management
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    View, approve, verify, and manage all registered enterprise cargo owners &amp; shippers.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('dashboard')}>
                    {t("back")}
                  </button>
                  <button className="ad-btn primary" onClick={() => triggerToast('➕ New Cargo Owner Onboarding form opened')}>
                    + Add New Cargo Owner
                  </button>
                </div>
              </div>

              {/* Owners Summary Bar */}
              <div className="ad-status-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setOwnerFilter('All')}>
                  <div style={{ background: 'var(--ad-brown-light)', color: 'var(--ad-brown)', padding: 10, borderRadius: 10 }}>
                    <Building size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>{ownersList.length}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>Total Cargo Owners</div>
                  </div>
                </div>

                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setOwnerFilter('Active')}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--ad-success)', padding: 10, borderRadius: 10 }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>
                      {ownersList.filter(o => o.status === 'Active').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>Active Owners</div>
                  </div>
                </div>

                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setOwnerFilter('Pending Approval')}>
                  <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--ad-warning)', padding: 10, borderRadius: 10 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>
                      {ownersList.filter(o => o.status === 'Pending Approval').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{t("pendingApprovals")}</div>
                  </div>
                </div>

                <div className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setOwnerFilter('Suspended')}>
                  <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--ad-danger)', padding: 10, borderRadius: 10 }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>
                      {ownersList.filter(o => o.status === 'Suspended').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{t("suspended")}</div>
                  </div>
                </div>
              </div>

              {/* Main Cargo Owner Table Card */}
              <div className="ad-card">
                {/* Filter Tabs & Search Controls */}
                <div className="ad-card-header" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {['All', 'Active', 'Pending Approval', 'Suspended'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setOwnerFilter(filter)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 20,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: ownerFilter === filter ? '1.5px solid var(--ad-brown)' : '1px solid var(--ad-border)',
                          background: ownerFilter === filter ? 'var(--ad-brown-light)' : 'var(--ad-bg)',
                          color: ownerFilter === filter ? 'var(--ad-brown)' : 'var(--ad-text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: 'var(--font)',
                        }}
                      >
                        {filter} {filter === 'All' ? `(${ownersList.length})` : `(${ownersList.filter(o => o.status === filter).length})`}
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>
                    Showing <strong>{filteredOwners.length}</strong> cargo owners
                  </div>
                </div>

                {/* REGISTERED CARGO OWNERS TABLE */}
                <div className="ad-table-wrapper">
                  <table className="ad-trips-table">
                    <thead>
                      <tr>
                        <th>{t("companyName")}</th>
                        <th>{t("ownerName")}</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>{t("gst")}</th>
                        <th>Status</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOwners.map(owner => (
                        <tr key={owner.id}>
                          {/* 1. Company Name (with logo avatar) */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div className="ad-driver-photo-circle" style={{ background: owner.photoBg, width: 36, height: 36, fontSize: '0.75rem' }}>
                                {owner.initials}
                              </div>
                              <span style={{ fontWeight: 700, color: 'var(--ad-text-dark)' }}>
                                {owner.companyName}
                              </span>
                            </div>
                          </td>

                          {/* 2. Owner Name */}
                          <td style={{ fontWeight: 600, color: 'var(--ad-text-body)' }}>
                            {owner.ownerName}
                          </td>

                          {/* 3. Email */}
                          <td style={{ color: 'var(--ad-text-muted)', fontSize: '0.82rem' }}>
                            {owner.email}
                          </td>

                          {/* 4. Phone */}
                          <td style={{ color: 'var(--ad-text-muted)', fontWeight: 500, fontSize: '0.82rem' }}>
                            {owner.phone}
                          </td>

                          {/* 5. GST Number */}
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ad-brown)', fontSize: '0.83rem' }}>
                              {owner.gst}
                            </span>
                          </td>

                          {/* 6. Status */}
                          <td>
                            <span className={`ad-driver-status-chip ${owner.status === 'Active' ? 'active' : owner.status === 'Pending Approval' ? 'pending' : 'suspended'}`}>
                              <span className="ad-status-dot" />
                              {owner.status}
                            </span>
                          </td>

                          {/* 7. Actions (View, Approve, Suspend, Activate) */}
                          <td>
                            <div className="ad-action-group">
                              {/* View */}
                              <button
                                className="ad-btn-action view"
                                title="View Company Details"
                                onClick={() => setSelectedOwnerModal(owner)}
                              >
                                View
                              </button>

                              {/* Approve (for Pending Approval) */}
                              {owner.status === 'Pending Approval' && (
                                <button
                                  className="ad-btn-action approve"
                                  onClick={() => handleApproveOwnerRecord(owner.id, owner.companyName)}
                                >
                                  Approve
                                </button>
                              )}

                              {/* Suspend (for Active) */}
                              {owner.status === 'Active' && (
                                <button
                                  className="ad-btn-action suspend"
                                  onClick={() => handleSuspendOwnerRecord(owner.id, owner.companyName)}
                                >
                                  Suspend
                                </button>
                              )}

                              {/* Activate (for Suspended) */}
                              {owner.status === 'Suspended' && (
                                <button
                                  className="ad-btn-action activate"
                                  onClick={() => handleActivateOwnerRecord(owner.id, owner.companyName)}
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredOwners.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ad-text-muted)' }}>
                            No cargo owners found matching current filter or search query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          ) : activeNav === 'trips' ? (
            /* ══════════════════════════════════════════════════════
               TRIP MANAGEMENT PAGE VIEW (Read-Only Monitoring)
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Truck size={24} color="var(--ad-brown)" /> Trip Monitoring
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    Read-only trip monitoring panel. View real-time trip status, ETA, and route information.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('dashboard')}>{t("back")}</button>
                  <button className="ad-btn primary" onClick={() => { setTrackLastRefresh(new Date()); setActiveNav('tracking'); }}>
                    <MapPin size={14} /> Open Live Tracking
                  </button>
                </div>
              </div>

              {/* Trip Summary Bar */}
              <div className="ad-status-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[
                  { label: 'Total Trips', val: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).length, color: 'var(--ad-brown)', bg: 'var(--ad-brown-light)', icon: Truck, filter: 'All' },
                  { label: 'In Transit', val: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['in-transit','IN_TRANSIT','ASSIGNED'].includes(t.status)).length, color: 'var(--ad-info)', bg: 'rgba(59,130,246,0.1)', icon: Navigation2, filter: 'in-transit' },
                  { label: 'Scheduled', val: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['scheduled','PENDING'].includes(t.status)).length, color: 'var(--ad-warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock, filter: 'scheduled' },
                  { label: 'Completed', val: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['completed','DELIVERED'].includes(t.status)).length, color: 'var(--ad-success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle2, filter: 'completed' },
                ].map(({ label, val, color, bg, icon: Icon, filter }) => (
                  <div key={label} className="ad-status-card" style={{ cursor: 'pointer' }} onClick={() => setTripFilter(filter)}>
                    <div style={{ background: bg, color, padding: 10, borderRadius: 10 }}><Icon size={20} /></div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>{val}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trips Table Card */}
              <div className="ad-card">
                <div className="ad-card-header" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {['All', 'in-transit', 'scheduled', 'delayed', 'completed'].map(f => (
                      <button key={f} onClick={() => setTripFilter(f)} style={{
                        padding: '7px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s',
                        border: tripFilter === f ? '1.5px solid var(--ad-brown)' : '1px solid var(--ad-border)',
                        background: tripFilter === f ? 'var(--ad-brown-light)' : 'var(--ad-bg)',
                        color: tripFilter === f ? 'var(--ad-brown)' : 'var(--ad-text-muted)',
                      }}>
                        {f === 'in-transit' ? 'In Transit' : f === 'scheduled' ? 'Scheduled' : f === 'delayed' ? 'Delayed' : f.charAt(0).toUpperCase() + f.slice(1)}
                        {' '}({f === 'All' ? (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).length : (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => t.status === f).length})
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>
                    Showing <strong>{(tripFilter === 'All' ? (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA) : (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => t.status === tripFilter)).length}</strong> trips
                  </div>
                </div>

                <div className="ad-table-wrapper">
                  <table className="ad-trips-table">
                    <thead>
                      <tr>
                        <th>{t("tripId")}</th>
                        <th>{t("cargoOwner")}</th>
                        <th>Driver</th>
                        <th>{t("pickup")}</th>
                        <th>{t("destination")}</th>
                        <th>{t("tripStatus")}</th>
                        <th>{t("eta")}</th>
                        <th>{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(tripFilter === 'All' ? (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA) : (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => t.status === tripFilter)).map(trip => {
                        const tripId = trip._id || trip.id || 'N/A';
                        const tripFrom = trip.origin || trip.from || 'N/A';
                        const tripTo = trip.destination || trip.to || 'N/A';
                        const tripStatus = trip.status === 'IN_TRANSIT' ? 'in-transit' : trip.status === 'PENDING' ? 'scheduled' : trip.status === 'DELIVERED' ? 'completed' : trip.status === 'DELAYED' ? 'delayed' : (trip.status || 'scheduled');
                        const tripDriver = trip.driver?.fullName || trip.driverId?.userId?.fullName || trip.driverId?.fullName || trip.driver || 'Unassigned';
                        const tripOwner = trip.cargoOwnerId?.companyName || trip.cargo || trip.cargoOwnerId?.fullName || 'N/A';
                        return (
                        <tr key={tripId}>
                          <td><span className="ad-trip-id">{tripId}</span></td>
                          <td style={{ fontWeight: 600, color: 'var(--ad-text-dark)' }}>{tripOwner}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#8B5E3C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, flexShrink: 0 }}>
                                {tripDriver === 'Unassigned' ? '?' : tripDriver.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ad-text-body)' }}>{tripDriver}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--ad-text-muted)', fontSize: '0.83rem' }}>{tripFrom}</td>
                          <td style={{ color: 'var(--ad-text-muted)', fontSize: '0.83rem' }}>{tripTo}</td>
                          <td>
                            <span className={`ad-status-chip ${tripStatus}`}>
                              <span className="ad-status-dot" />
                              {tripStatus === 'in-transit' ? 'In Transit' : tripStatus === 'scheduled' ? 'Scheduled' : tripStatus === 'delayed' ? 'Delayed' : 'Completed'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, fontSize: '0.82rem', color: tripStatus === 'delayed' ? 'var(--ad-danger)' : tripStatus === 'completed' ? 'var(--ad-success)' : 'var(--ad-text-dark)' }}>{trip.eta || 'N/A'}</td>
                          <td>
                            <div className="ad-action-group">
                              <button className="ad-btn-action view" onClick={() => setSelectedTripModal(trip)}>View Details</button>
                              {(tripStatus === 'in-transit' || tripStatus === 'delayed') && (
                                <button className="ad-btn-action approve" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                                  onClick={() => { setActiveNav('tracking'); }}>
                                  Track Trip
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trip Detail Modal */}
              {selectedTripModal && (
                <div className="ad-modal-backdrop" onClick={() => setSelectedTripModal(null)}>
                  <div className="ad-modal-card" onClick={e => e.stopPropagation()}>
                    <div style={{ background: 'linear-gradient(135deg,#2C1A0E 0%,#4A3728 100%)', padding: '22px 28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Truck size={22} />
                          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Trip {selectedTripModal.id}</h3>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ad-beige)', marginTop: 4 }}>{selectedTripModal.cargo} · {selectedTripModal.goods}</div>
                      </div>
                      <button onClick={() => setSelectedTripModal(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={18} />
                      </button>
                    </div>
                    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ad-bg)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--ad-border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>{t("tripStatus")}</span>
                        <span className={`ad-status-chip ${selectedTripModal.status}`}>
                          <span className="ad-status-dot" />
                          {selectedTripModal.status === 'in-transit' ? 'In Transit' : selectedTripModal.status === 'scheduled' ? 'Scheduled' : selectedTripModal.status === 'delayed' ? 'Delayed' : 'Completed'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[
                          { label: 'Driver', val: selectedTripModal.driver },
                          { label: 'Truck Number', val: selectedTripModal.truckNo },
                          { label: 'Pickup Location', val: selectedTripModal.from },
                          { label: 'Destination', val: selectedTripModal.to },
                          { label: 'Total Distance', val: selectedTripModal.distance },
                          { label: 'Start Time', val: selectedTripModal.startTime },
                          { label: 'ETA / Arrival', val: selectedTripModal.eta },
                          { label: 'Route', val: selectedTripModal.route },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{label}</div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem', color: 'var(--ad-text-muted)' }}>
                        ℹ️ <strong>Admin View Only</strong> — Trip details are read-only. Editing is restricted to Cargo Owners and assigned Drivers.
                      </div>
                      <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid var(--ad-border)' }}>
                        {(selectedTripModal.status === 'in-transit' || selectedTripModal.status === 'delayed') && (
                          <button className="ad-btn primary" onClick={() => { setSelectedTripModal(null); setSelectedTrackTruck(TRACKING_TRUCKS.find(t => t.id === selectedTripModal.id) || TRACKING_TRUCKS[0]); setActiveNav('tracking'); }}>
                            <MapPin size={14} /> Track Live
                          </button>
                        )}
                        <button className="ad-btn ghost" style={{ marginLeft: 'auto' }} onClick={() => setSelectedTripModal(null)}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          ) : activeNav === 'tracking' ? (
            /* ══════════════════════════════════════════════════════
               LIVE TRACKING PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Navigation2 size={24} color="var(--ad-brown)" /> Live GPS Fleet Tracking
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    {gpsError ? `⚠️ ${gpsError} — using demo data` : 'Real-time GPS tracking via live satellite feed. Auto-refreshes every 15 seconds.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ad-success)' }} />
                    Last refreshed: {trackLastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('dashboard')}>{t("back")}</button>
                  <button className="ad-btn primary" onClick={() => { fetchTrackingData(); triggerToast('🔄 Fleet data refreshed successfully!'); }}>
                    <RefreshCw size={14} /> Refresh Now
                  </button>
                </div>
              </div>

              {/* MAIN: Map + Right Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

                {/* LEFT: Large Map */}
                <div className="ad-card" style={{ padding: 0, overflow: 'hidden', minHeight: 560 }}>
                  {/* Map Header bar */}
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ad-border)', background: 'var(--ad-white)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ad-success)', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ad-text-dark)' }}>Live Fleet Map — India Logistics Network</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>
                      <span>🚛 {(trackingTrucks.length > 0 ? trackingTrucks : TRACKING_TRUCKS).filter(t => t.status === 'in-transit').length} In Transit</span>
                      <span>⚠️ {(trackingTrucks.length > 0 ? trackingTrucks : TRACKING_TRUCKS).filter(t => t.status === 'delayed').length} Delayed</span>
                      <span>📍 {(trackingTrucks.length > 0 ? trackingTrucks : TRACKING_TRUCKS).length} Active Transponders</span>
                    </div>
                  </div>

                  {/* Map Area — Leaflet */}
                  <div className="ad-map-container" style={{ height: 500, position: 'relative' }}>
                    <MapContainer
                      center={[14.5, 78.5]}
                      zoom={6}
                      style={{ height: '100%', width: '100%', borderRadius: 0 }}
                      zoomControl={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Route Lines between cities */}
                      {(() => {
                        const routes = [
                          ['Coimbatore', 'Chennai'],
                          ['Bengaluru', 'Hyderabad'],
                          ['Mumbai', 'Pune'],
                          ['Hyderabad', 'Mumbai'],
                        ];
                        const routeColors = ['#8B5E3C', '#3B82F6', '#10B981', '#F59E0B'];
                        return routes.map(([from, to], ri) => {
                          const f = CITY_COORDS[from], t = CITY_COORDS[to];
                          if (!f || !t) return null;
                          return (
                            <Polyline
                              key={ri}
                              positions={[f, t]}
                              pathOptions={{ color: routeColors[ri % routeColors.length], weight: 3, dashArray: '10 6', opacity: 0.6 }}
                            />
                          );
                        });
                      })()}

                      {/* City Markers */}
                      {Object.entries(CITY_COORDS).map(([name, coords]) => (
                        <Marker key={name} position={coords}>
                          <Popup>
                            <strong>{name}</strong>
                          </Popup>
                        </Marker>
                      ))}

                      {/* Truck Markers with custom icons — use API lat/lng when available */}
                      {(trackingTrucks.length > 0 ? trackingTrucks : TRACKING_TRUCKS.filter(t => CITY_COORDS[t.from] && CITY_COORDS[t.to])).map(truck => {
                        let pos;
                        if (truck.lat != null && truck.lng != null) {
                          pos = [truck.lat, truck.lng];
                        } else {
                          const from = CITY_COORDS[truck.from];
                          const to = CITY_COORDS[truck.to];
                          const progress = truck.progress || 50;
                          pos = [
                            from[0] + (to[0] - from[0]) * (progress / 100),
                            from[1] + (to[1] - from[1]) * (progress / 100),
                          ];
                        }
                        const isSelected = selectedTrackTruck?.id === truck.id;
                        const icon = L.divIcon({
                          className: '',
                          html: `<div style="
                            background: ${truck.status === 'delayed' ? '#EF4444' : '#8B5E3C'};
                            color: #fff; border-radius: 8px; padding: 4px 10px;
                            font-size: 0.75rem; font-weight: 800; font-family: system-ui;
                            box-shadow: ${isSelected ? '0 0 0 3px rgba(139,94,60,0.4), 0 4px 12px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.2)'};
                            border: ${isSelected ? '2px solid #fff' : 'none'};
                            transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
                            transition: all 0.2s;
                            white-space: nowrap;
                            cursor: pointer;
                            display: flex; align-items: center; gap: 4px;
                          ">🚛 ${truck.id}</div>`,
                          iconSize: [80, 32],
                          iconAnchor: [40, 16],
                        });
                        return (
                          <Marker
                            key={truck.id}
                            position={pos}
                            icon={icon}
                            eventHandlers={{ click: () => setSelectedTrackTruck(truck) }}
                          />
                        );
                      })}

                      {/* Legend Overlay inside Map (custom control) */}
                      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, background: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--ad-border)', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ad-text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Legend</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--ad-text-dark)' }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: 'var(--ad-brown)' }} /> In Transit</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--ad-text-dark)' }}><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#EF4444' }} /> Delayed</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--ad-text-dark)' }}><span style={{ display: 'inline-block', width: 40, height: 3, borderTop: '2px dashed var(--ad-border)', marginTop: 4 }} /> Route</div>
                        </div>
                      </div>

                      {/* GPS Signal badge inside map */}
                      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 1000, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-success)', display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ad-success)' }} />
                        GPS Signal: Strong · 100%
                      </div>
                    </MapContainer>
                  </div>
                </div>

                {/* RIGHT: Active Trips Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Selected Truck Detail Card */}
                  {selectedTrackTruck && (
                    <div className="ad-card" style={{ borderLeft: '3px solid var(--ad-brown)', background: 'linear-gradient(135deg, var(--ad-white) 0%, var(--ad-bg) 100%)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedTrackTruck.driverBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                          {selectedTrackTruck.driverInitials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--ad-text-dark)' }}>{selectedTrackTruck.driver}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--ad-text-muted)', fontWeight: 600, fontFamily: 'monospace' }}>{selectedTrackTruck.truckNo}</div>
                        </div>
                        <span className={`ad-status-chip ${selectedTrackTruck.status}`} style={{ marginLeft: 'auto' }}>
                          <span className="ad-status-dot" />
                          {selectedTrackTruck.status === 'in-transit' ? 'In Transit' : 'Delayed'}
                        </span>
                      </div>

                      {/* Route Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: '0.82rem', fontWeight: 700 }}>
                        <span style={{ color: 'var(--ad-success)' }}>📍 {selectedTrackTruck.from}</span>
                        <span style={{ flex: 1, borderTop: '2px dashed var(--ad-border)', margin: '0 4px' }} />
                        <span style={{ color: 'var(--ad-brown)' }}>🏁 {selectedTrackTruck.to}</span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, color: 'var(--ad-text-muted)', marginBottom: 4 }}>
                          <span>Journey Progress</span>
                          <span style={{ color: 'var(--ad-brown)' }}>{selectedTrackTruck.progress}%</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--ad-bg)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--ad-border)' }}>
                          <div style={{ height: '100%', width: `${selectedTrackTruck.progress}%`, background: selectedTrackTruck.status === 'delayed' ? 'var(--ad-danger)' : 'linear-gradient(90deg, var(--ad-brown), #D6A87A)', borderRadius: 8, transition: 'width 0.5s' }} />
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { label: 'Current Location', val: selectedTrackTruck.location, full: true },
                          { label: 'Speed', val: selectedTrackTruck.speed },
                          { label: 'ETA', val: selectedTrackTruck.eta },
                        ].map(({ label, val, full }) => (
                          <div key={label} style={full ? { gridColumn: '1 / -1' } : {}}>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase' }}>{label}</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ad-text-dark)', marginTop: 2 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Trips List */}
                  <div className="ad-card">
                    <div className="ad-card-header" style={{ marginBottom: 14 }}>
                      <h3 className="ad-card-title"><Truck size={16} color="var(--ad-brown)" /> Active Trips</h3>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-brown)' }}>{(trackingTrucks.length > 0 ? trackingTrucks : TRACKING_TRUCKS).length} Live</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(trackingTrucks.length > 0 ? trackingTrucks : TRACKING_TRUCKS).map(truck => (
                        <div key={truck.id}
                          onClick={() => setSelectedTrackTruck(truck)}
                          style={{
                            padding: '12px 14px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.18s',
                            border: selectedTrackTruck?.id === truck.id ? '1.5px solid var(--ad-brown)' : '1px solid var(--ad-border)',
                            background: selectedTrackTruck?.id === truck.id ? 'var(--ad-brown-light)' : 'var(--ad-bg)',
                          }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--ad-brown)', fontFamily: 'monospace' }}>{truck.id}</span>
                            <span className={`ad-status-chip ${truck.status}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                              <span className="ad-status-dot" />
                              {truck.status === 'in-transit' ? 'In Transit' : 'Delayed'}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ad-text-dark)', marginBottom: 3 }}>{truck.driver}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--ad-text-muted)', marginBottom: 6 }}>📍 {truck.location}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600 }}>
                            <span style={{ color: 'var(--ad-text-muted)' }}>{truck.from} → {truck.to}</span>
                            <span style={{ color: truck.status === 'delayed' ? 'var(--ad-danger)' : 'var(--ad-success)' }}>ETA: {truck.eta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>


          ) : activeNav === 'reports' ? (
            /* ══════════════════════════════════════════════════════
               REPORTS & ANALYTICS PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileText size={24} color="var(--ad-brown)" /> Reports &amp; Analytics
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    {t("reportsDesc")}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('dashboard')}>{t("back")}</button>
                  <button className="ad-btn primary" onClick={() => triggerToast('📊 Exporting full analytics report as PDF...')}>
                    <FileText size={14} /> {t("exportPDF")}
                  </button>
                </div>
              </div>

              {/* ── SUMMARY CARDS ─────────────────────────────── */}
              <div className="ad-summary-grid">
                {[
                  { title: 'Total Trips', value: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).length, sub: 'All time · Platform-wide', icon: Truck, color: 'brown', trend: '+18%' },
                  { title: 'Completed Trips', value: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['completed','DELIVERED'].includes(t.status)).length, sub: '↑ 99.2% On-Time SLA', icon: CheckCircle2, color: 'success', trend: '+12%' },
                  { title: 'Pending / Scheduled', value: (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['scheduled','PENDING'].includes(t.status)).length, sub: '📦 Awaiting Assignment', icon: Clock, color: 'warning', trend: '-5%' },
                  { title: 'Total Drivers', value: '1,248', sub: 'Active: 1,180 on Platform', icon: Users, color: 'info', trend: '+8%' },
                  { title: 'Total Cargo Owners', value: '532', sub: 'Verified: 510 Enterprises', icon: Building, color: 'purple', trend: '+4%' },
                  { title: 'Avg Trip Success Rate', value: '97.4%', sub: '↑ Above industry 92%', icon: Activity, color: 'success', trend: '+2.1%' },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="ad-summary-card">
                      <div className="ad-summary-top">
                        <div className={`ad-summary-icon ${card.color}`}><Icon size={20} /></div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: card.trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: card.trend.startsWith('+') ? 'var(--ad-success)' : 'var(--ad-danger)' }}>
                          {card.trend}
                        </span>
                      </div>
                      <div>
                        <div className="ad-summary-val">{card.value}</div>
                        <div className="ad-summary-title">{card.title}</div>
                      </div>
                      <div className="ad-summary-sub">{card.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* ── CHARTS ROW ────────────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

                {/* Monthly Trips Chart (Bar) */}
                <div className="ad-card">
                  <div className="ad-card-header" style={{ marginBottom: 20 }}>
                    <h3 className="ad-card-title"><Activity size={18} color="var(--ad-brown)" /> Monthly Trips — 2025-2026</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Trip Volume by Month</span>
                  </div>

                  {/* SVG Bar Chart */}
                  {(() => {
                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    const vals =   [820, 940, 1100, 980, 1240, 1380, 1290, 1450, 1320, 1560, 1480, 1640];
                    const maxVal = 1800;
                    const chartH = 180;
                    const barW = 36;
                    const gap = 14;
                    const paddingL = 50;
                    const totalW = paddingL + months.length * (barW + gap);
                    return (
                      <div style={{ overflowX: 'auto' }}>
                        <svg viewBox={`0 0 ${totalW} ${chartH + 40}`} style={{ width: '100%', minWidth: 520, height: 'auto' }}>
                          {/* Y-axis gridlines */}
                          {[0,0.25,0.5,0.75,1].map(p => (
                            <g key={p}>
                              <line x1={paddingL} y1={chartH - p * chartH} x2={totalW} y2={chartH - p * chartH} stroke="var(--ad-border)" strokeWidth="1" strokeDasharray="4 3" />
                              <text x={paddingL - 8} y={chartH - p * chartH + 4} fontSize="9" fill="var(--ad-text-muted)" textAnchor="end">{Math.round(p * maxVal)}</text>
                            </g>
                          ))}
                          {/* Bars */}
                          {vals.map((v, i) => {
                            const x = paddingL + i * (barW + gap);
                            const barH = (v / maxVal) * chartH;
                            const y = chartH - barH;
                            const isMax = v === Math.max(...vals);
                            return (
                              <g key={i}>
                                <rect x={x} y={y} width={barW} height={barH} rx="5" fill={isMax ? 'var(--ad-brown)' : 'var(--ad-brown-light)'} stroke={isMax ? 'var(--ad-brown)' : 'var(--ad-beige)'} strokeWidth="1" />
                                <text x={x + barW / 2} y={y - 5} fontSize="8.5" fill="var(--ad-text-muted)" textAnchor="middle">{v}</text>
                                <text x={x + barW / 2} y={chartH + 16} fontSize="9" fill="var(--ad-text-muted)" textAnchor="middle">{months[i]}</text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    );
                  })()}
                </div>

                {/* Trip Success Rate Donut */}
                <div className="ad-card">
                  <div className="ad-card-header" style={{ marginBottom: 20 }}>
                    <h3 className="ad-card-title"><CheckCircle2 size={18} color="var(--ad-success)" /> Trip Success Rate</h3>
                  </div>

                  {(() => {
                    const successPct = 97.4;
                    const delayedPct = 1.8;
                    const failedPct  = 0.8;
                    const cx = 100, cy = 100, r = 72;
                    const circ = 2 * Math.PI * r;

                    const segments = [
                      { pct: successPct, color: 'var(--ad-success)', label: 'Completed', offset: 0 },
                      { pct: delayedPct, color: 'var(--ad-warning)', label: 'Delayed', offset: successPct },
                      { pct: failedPct,  color: 'var(--ad-danger)',  label: 'Cancelled', offset: successPct + delayedPct },
                    ];

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <svg viewBox="0 0 200 200" style={{ width: 200, height: 200 }}>
                          {/* Background ring */}
                          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ad-border)" strokeWidth="18" />
                          {segments.map((seg, i) => (
                            <circle key={i} cx={cx} cy={cy} r={r}
                              fill="none"
                              stroke={seg.color}
                              strokeWidth="18"
                              strokeDasharray={`${(seg.pct / 100) * circ} ${circ}`}
                              strokeDashoffset={-((seg.offset / 100) * circ)}
                              transform={`rotate(-90 ${cx} ${cy})`}
                              strokeLinecap="round"
                            />
                          ))}
                          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--ad-text-dark)">{successPct}%</text>
                          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--ad-text-muted)">Success Rate</text>
                        </svg>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {segments.map((seg, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, display: 'inline-block' }} />
                                <span style={{ color: 'var(--ad-text-body)' }}>{seg.label}</span>
                              </div>
                              <span style={{ color: seg.color, fontWeight: 800 }}>{seg.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* ── DRIVER PERFORMANCE TABLE ───────────────────── */}
              <div className="ad-card">
                <div className="ad-card-header" style={{ marginBottom: 20 }}>
                  <h3 className="ad-card-title"><Users size={18} color="var(--ad-brown)" /> Driver Performance Report</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Top 6 Drivers · Ranked by Trips Completed</span>
                </div>

                <div className="ad-table-wrapper">
                  <table className="ad-trips-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Driver</th>
                        <th>{t("truckNo")}</th>
                        <th>Trips Completed</th>
                        <th>On-Time %</th>
                        <th>Avg Rating</th>
                        <th>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: 1,  name: 'Anand Sharma',  bg: 'linear-gradient(135deg,#F59E0B,#B45309)', initials: 'AS', truck: 'DL 01 ZC 1120', trips: 210, ontime: 99.1, rating: 4.95, bar: 99 },
                        { rank: 2,  name: 'Karthik N',     bg: 'linear-gradient(135deg,#10B981,#047857)', initials: 'KN', truck: 'MH 12 AB 5544', trips: 142, ontime: 97.8, rating: 4.7,  bar: 88 },
                        { rank: 3,  name: 'Ramesh Kumar',  bg: 'linear-gradient(135deg,#8B5E3C,#6F472D)', initials: 'RK', truck: 'TN 37 CZ 4920', trips: 124, ontime: 96.5, rating: 4.9,  bar: 84 },
                        { rank: 4,  name: 'Suresh Varma',  bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', initials: 'SV', truck: 'KA 01 MJ 8812', trips: 98,  ontime: 95.2, rating: 4.8,  bar: 72 },
                        { rank: 5,  name: 'Priya Rajan',   bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', initials: 'PR', truck: 'TN 38 XX 0099', trips: 0,   ontime: 0,    rating: 4.95, bar: 0 },
                        { rank: 6,  name: 'Vijay Prakash', bg: 'linear-gradient(135deg,#EF4444,#B91C1C)', initials: 'VP', truck: 'AP 09 CB 3311', trips: 45,  ontime: 82.0, rating: 4.2,  bar: 42 },
                      ].map(driver => (
                        <tr key={driver.rank}>
                          <td>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: driver.rank <= 3 ? 'var(--ad-brown)' : 'var(--ad-bg)', color: driver.rank <= 3 ? '#fff' : 'var(--ad-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', border: '1.5px solid var(--ad-border)' }}>
                              {driver.rank}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: driver.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
                                {driver.initials}
                              </div>
                              <span style={{ fontWeight: 700, color: 'var(--ad-text-dark)' }}>{driver.name}</span>
                            </div>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--ad-brown)', fontSize: '0.83rem' }}>{driver.truck}</td>
                          <td style={{ fontWeight: 800, color: 'var(--ad-text-dark)' }}>{driver.trips}</td>
                          <td style={{ fontWeight: 700, color: driver.ontime >= 95 ? 'var(--ad-success)' : driver.ontime >= 85 ? 'var(--ad-warning)' : 'var(--ad-danger)' }}>
                            {driver.ontime ? `${driver.ontime}%` : '—'}
                          </td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--ad-brown)' }}>
                              <Star size={13} fill="var(--ad-brown)" color="var(--ad-brown)" /> {driver.rating}
                            </span>
                          </td>
                          <td style={{ minWidth: 140 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 8, background: 'var(--ad-bg)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--ad-border)' }}>
                                <div style={{ height: '100%', width: `${driver.bar}%`, background: driver.bar >= 80 ? 'var(--ad-success)' : driver.bar >= 50 ? 'var(--ad-warning)' : 'var(--ad-danger)', borderRadius: 8, transition: 'width 0.5s' }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ad-text-muted)', minWidth: 28 }}>{driver.bar}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── PLATFORM STATS ────────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                  { title: 'Avg Distance per Trip', value: '382 km', sub: 'Cross-state average distance', icon: MapPin, color: 'var(--ad-brown)' },
                  { title: 'Peak Booking Month', value: 'December', sub: '1,640 trips · ↑ 18% MoM', icon: Calendar, color: 'var(--ad-success)' },
                  { title: 'Platform Uptime', value: '99.98%', sub: 'Server + GPS · Zero Downtime', icon: Server, color: 'var(--ad-info)' },
                ].map(({ title, value, sub, icon: Icon, color }) => (
                  <div key={title} className="ad-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: 'var(--ad-bg)', padding: 14, borderRadius: 12, border: '1px solid var(--ad-border)', color }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>{value}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ad-text-dark)', marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ad-text-muted)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          ) : activeNav === 'notifications' ? (
            /* ══════════════════════════════════════════════════════
               NOTIFICATIONS PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Bell size={24} color="var(--ad-brown)" /> Notifications
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    {t("notifDesc")}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="ad-btn ghost" onClick={() => setActiveNav('dashboard')}>{t("back")}</button>
                  <button className="ad-btn primary" onClick={() => triggerToast('✅ All notifications marked as read.')}>
                    <Check size={14} /> {t("markAllRead")}
                  </button>
                </div>
              </div>

              {/* Summary Strip & Priority Filters */}
              {(() => {
                const notiItems = [
                  {
                    id: 'N001',
                    type: 'driver',
                    priority: 'High',
                    title: 'New Driver Registered',
                    desc: 'Priya Rajan (TN 38 XX 0099) submitted driver application with commercial license DL-3820245510. KYC document verification is pending.',
                    time: '10 min ago',
                    action: 'Review Driver',
                    nav: 'drivers',
                  },
                  {
                    id: 'N002',
                    type: 'owner',
                    priority: 'High',
                    title: 'New Cargo Owner Registered',
                    desc: 'Southern Express Freight registered enterprise cargo owner account with GST 33AAAAA0000A1Z5. Documentation verification pending.',
                    time: '25 min ago',
                    action: 'Review Owner',
                    nav: 'owners',
                  },
                  {
                    id: 'N003',
                    type: 'trip',
                    priority: 'High',
                    title: 'Trip Delayed — Immediate Attention',
                    desc: 'Trip TR-8065 (Mumbai → Pune) driven by Karthik N is delayed by +28 minutes due to heavy traffic on Mumbai-Pune Expressway.',
                    time: '35 min ago',
                    action: 'Track Trip',
                    nav: 'tracking',
                  },
                  {
                    id: 'N004',
                    type: 'trip',
                    priority: 'Medium',
                    title: 'Trip Created',
                    desc: 'Load TR-8102 (Salem → Kochi, 12T Textiles) created by TCI Freight Solutions. Awaiting driver assignment.',
                    time: '40 min ago',
                    action: 'View Trip',
                    nav: 'trips',
                  },
                  {
                    id: 'N005',
                    type: 'driver',
                    priority: 'Medium',
                    title: 'Driver Started Trip',
                    desc: 'Suresh Varma started trip TR-7910 from Bengaluru to Hyderabad with 18T Electronics cargo.',
                    time: '1 hr ago',
                    action: 'Track Live',
                    nav: 'tracking',
                  },
                  {
                    id: 'N006',
                    type: 'driver',
                    priority: 'Medium',
                    title: 'Driver Completed Trip',
                    desc: 'Karthik N completed trip TR-8065 (Mumbai → Pune). Unloaded 8T Pharmaceuticals at Pune dock.',
                    time: '1.5 hrs ago',
                    action: 'View Trip',
                    nav: 'trips',
                  },
                  {
                    id: 'N007',
                    type: 'delivery',
                    priority: 'Info',
                    title: 'Delivery Confirmed',
                    desc: 'Recipient confirmed delivery for TR-7888 (Delhi → Jaipur). Proof of Delivery signed digitally by Mahindra Logistics.',
                    time: '2 hrs ago',
                    action: 'View Report',
                    nav: 'reports',
                  },
                  {
                    id: 'N008',
                    type: 'delivery',
                    priority: 'Info',
                    title: 'Delivery Confirmed',
                    desc: 'Trip TR-7654 (Vijayawada → Chennai) completed by Vijay Prakash. 25T rice bags delivered on schedule with digital signature.',
                    time: '2.5 hrs ago',
                    action: 'View Report',
                    nav: 'reports',
                  },
                  {
                    id: 'N009',
                    type: 'system',
                    priority: 'Info',
                    title: 'System Health Check — Operational',
                    desc: 'Automated system diagnosis complete. Server Uptime 99.98%, Database Latency 4ms, GPS Transponders 100% Signal.',
                    time: '3 hrs ago',
                    action: null,
                    nav: null,
                  },
                  {
                    id: 'N010',
                    type: 'driver',
                    priority: 'Info',
                    title: 'Driver Account Flagged',
                    desc: 'Driver Vijay Prakash (AP 09 CB 3311) flagged for minor telemetry speed anomaly on NH-44 route.',
                    time: '3.5 hrs ago',
                    action: 'Review Driver',
                    nav: 'drivers',
                  },
                  {
                    id: 'N011',
                    type: 'owner',
                    priority: 'Info',
                    title: 'Cargo Owner GST Verified',
                    desc: 'ABC Logistics & Freight GST documentation and corporate bank details successfully verified.',
                    time: '4 hrs ago',
                    action: 'View Owner',
                    nav: 'owners',
                  },
                  {
                    id: 'N012',
                    type: 'trip',
                    priority: 'Medium',
                    title: 'New Scheduled Trip',
                    desc: 'Trip TR-8211 (Chennai → Bengaluru) scheduled by ABC Logistics & Freight. Scheduled departure tomorrow 08:00 AM.',
                    time: '5 hrs ago',
                    action: 'View Trip',
                    nav: 'trips',
                  },
                ];

                const filteredNotis = notiItems.filter(n => {
                  if (notiFilter === 'All') return true;
                  return n.priority === notiFilter;
                });

                return (
                  <>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[
                        { label: 'All', key: 'All', count: notiItems.length, color: 'var(--ad-brown)' },
                        { label: 'High Priority', key: 'High', count: notiItems.filter(n => n.priority === 'High').length, color: 'var(--ad-danger)' },
                        { label: 'Medium', key: 'Medium', count: notiItems.filter(n => n.priority === 'Medium').length, color: 'var(--ad-warning)' },
                        { label: 'Info', key: 'Info', count: notiItems.filter(n => n.priority === 'Info').length, color: 'var(--ad-info)' },
                      ].map(({ label, key, count, color }) => (
                        <div
                          key={key}
                          onClick={() => setNotiFilter(key)}
                          className={`ad-filter-chip ${notiFilter === key ? 'active' : ''}`}
                        >
                          <span className="ad-filter-chip-count" style={{ color }}>{count}</span>
                          <span className="ad-filter-chip-label">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Notification Cards List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {filteredNotis.map(n => {
                        const priorityColor = n.priority === 'High' ? 'var(--ad-danger)' : n.priority === 'Medium' ? 'var(--ad-warning)' : 'var(--ad-info)';
                        const typeIcon = n.type === 'driver' ? '🧑‍✈️' : n.type === 'owner' ? '🏢' : n.type === 'trip' ? '🚛' : n.type === 'delivery' ? '✅' : '⚙️';
                        const typeBg   = n.type === 'driver' ? 'rgba(139,94,60,0.08)' : n.type === 'owner' ? 'rgba(139,92,246,0.08)' : n.type === 'trip' ? 'rgba(59,130,246,0.08)' : n.type === 'delivery' ? 'rgba(16,185,129,0.08)' : 'rgba(100,116,139,0.08)';

                        return (
                          <div key={n.id} className="ad-notification-card" style={{ borderLeft: `4px solid ${priorityColor}` }}>

                            {/* Type Icon Badge */}
                            <div className="ad-notif-icon-wrap" style={{ background: typeBg }}>
                              {typeIcon}
                            </div>

                            {/* Card Body */}
                            <div className="ad-notif-body">
                              <div className="ad-notif-header">
                                <div className="ad-notif-title">{n.title}</div>
                                <div className="ad-notif-meta">
                                  <span className="ad-notif-priority" style={{ background: `${priorityColor}18`, color: priorityColor }}>
                                    {n.priority} Priority
                                  </span>
                                  <span className="ad-notif-time">{n.time}</span>
                                </div>
                              </div>
                              <div className="ad-notif-desc">
                                {n.desc}
                              </div>
                              {n.action && (
                                <button className="ad-notif-action-btn" onClick={() => { setActiveNav(n.nav); triggerToast(`Navigated to: ${n.action}`); }}>
                                  {n.action} →
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}

            </div>

          ) : activeNav === 'profile' || activeNav === 'settings' ? (
            /* ══════════════════════════════════════════════════════
               PROFILE & SETTINGS PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ad-text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {profileSubTab === 'profile' ? <User size={24} color="var(--ad-brown)" /> : <Settings size={24} color="var(--ad-brown)" />}
                    {profileSubTab === 'profile' ? 'Admin Profile' : 'System Settings'}
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ad-text-muted)', margin: '4px 0 0 0' }}>
                    {profileSubTab === 'profile'
                      ? 'Manage administrative credentials, employee role details, and security controls.'
                      : 'Configure system notifications, language localization, privacy controls, and security policies.'}
                  </p>
                </div>

                {/* Sub-Tab Navigation Switcher */}
                <div style={{ display: 'flex', background: 'var(--ad-bg)', border: '1px solid var(--ad-border)', borderRadius: 12, padding: 4, gap: 4 }}>
                  <button
                    onClick={() => setProfileSubTab('profile')}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                      background: profileSubTab === 'profile' ? 'var(--ad-brown)' : 'transparent',
                      color: profileSubTab === 'profile' ? '#fff' : 'var(--ad-text-muted)'
                    }}
                  >
                    <User size={16} /> Admin Profile
                  </button>
                  <button
                    onClick={() => setProfileSubTab('settings')}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                      background: profileSubTab === 'settings' ? 'var(--ad-brown)' : 'transparent',
                      color: profileSubTab === 'settings' ? '#fff' : 'var(--ad-text-muted)'
                    }}
                  >
                    <Settings size={16} /> System Settings
                  </button>
                </div>
              </div>

              {profileSubTab === 'profile' ? (
                /* ────────────────────────────────────────────────────────
                   PROFILE VIEW
                   ──────────────────────────────────────────────────────── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* Top Profile Summary Banner */}
                  <div className="ad-card" style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #4A3728 100%)', color: '#fff', padding: 28, borderRadius: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: adminProfile.photoBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                          {adminProfile.initials}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{adminProfile.name}</h2>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.2)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
                              🟢 Active Session
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ad-beige)', marginTop: 4, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span>Employee ID: <strong>{adminProfile.employeeId}</strong></span>
                            <span>•</span>
                            <span>Role: <strong>{adminProfile.role}</strong></span>
                            <span>•</span>
                            <span>{adminProfile.department}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="ad-btn ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }} onClick={() => setIsEditProfileOpen(true)}>
                          <Edit3 size={15} /> Edit Profile
                        </button>
                        <button className="ad-btn primary" style={{ background: 'var(--ad-warning)', color: '#2C1A0E', border: 'none', fontWeight: 700 }} onClick={() => setIsChangePasswordOpen(true)}>
                          <Lock size={15} /> Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

                    {/* Left Column: Required Profile Details */}
                    <div className="ad-card">
                      <div className="ad-card-header" style={{ marginBottom: 20 }}>
                        <h3 className="ad-card-title"><User size={18} color="var(--ad-brown)" /> Master Administrator Details</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Verified Credentials</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="ad-profile-field">
                          <div className="ad-profile-label">Admin Name</div>
                          <div className="ad-profile-value">{adminProfile.name}</div>
                        </div>

                        <div className="ad-profile-field">
                          <div className="ad-profile-label">Employee ID</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ad-brown)', fontFamily: 'monospace' }}>{adminProfile.employeeId}</div>
                        </div>

                        <div className="ad-profile-field">
                          <div className="ad-profile-label">{t("emailAddress")}</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)', wordBreak: 'break-all' }}>{adminProfile.email}</div>
                        </div>

                        <div className="ad-profile-field">
                          <div className="ad-profile-label">{t("phoneNumber")}</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ad-text-dark)' }}>{adminProfile.phone}</div>
                        </div>

                        <div className="ad-profile-field" style={{ gridColumn: '1 / -1' }}>
                          <div className="ad-profile-label">System Role &amp; Privileges</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ad-text-dark)' }}>{adminProfile.role}</div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 12, background: 'var(--ad-brown-light)', color: 'var(--ad-brown)', border: '1px solid var(--ad-beige)' }}>
                              {adminProfile.accessLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Required Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div className="ad-card">
                        <div className="ad-card-header" style={{ marginBottom: 16 }}>
                          <h3 className="ad-card-title"><Sliders size={18} color="var(--ad-brown)" /> Quick Actions</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <button
                            className="ad-btn primary"
                            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 18px', fontSize: '0.88rem' }}
                            onClick={() => setIsEditProfileOpen(true)}
                          >
                            <Edit3 size={16} /> Edit Profile
                          </button>

                          <button
                            className="ad-btn ghost"
                            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 18px', fontSize: '0.88rem', border: '1px solid var(--ad-border)' }}
                            onClick={() => setIsChangePasswordOpen(true)}
                          >
                            <Lock size={16} color="var(--ad-brown)" /> Change Password
                          </button>

                          <button
                            className="ad-btn ghost"
                            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 18px', fontSize: '0.88rem', border: '1px solid var(--ad-border)' }}
                            onClick={() => setProfileSubTab('settings')}
                          >
                            <Settings size={16} color="var(--ad-brown)" /> Settings
                          </button>

                          <button
                            className="ad-btn-action logout"
                            onClick={() => setIsLogoutModalOpen(true)}
                          >
                            <LogOut size={16} style={{ marginRight: 6 }} /> Logout
                          </button>
                        </div>
                      </div>

                      {/* Security Audit Widget */}
                      <div className="ad-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <ShieldCheck size={20} color="var(--ad-success)" />
                          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Account Security Status</h4>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)', lineHeight: 1.5, marginBottom: 10 }}>
                          Two-Factor Authentication (2FA) is <strong>Enabled</strong>. Last password update was 14 days ago.
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ad-success)', fontWeight: 700 }}>
                          ✓ Zero security policy violations
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              ) : (
                /* ────────────────────────────────────────────────────────
                   SETTINGS VIEW (Notifications, Language, Privacy, Security)
                   ──────────────────────────────────────────────────────── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* 1. NOTIFICATIONS SETTINGS */}
                  <div className="ad-card">
                    <div className="ad-card-header" style={{ marginBottom: 18 }}>
                      <h3 className="ad-card-title"><Bell size={18} color="var(--ad-brown)" /> Notifications</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Manage alert preferences</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive real-time email updates for trip completion and pending driver KYC approvals.' },
                        { key: 'smsNotifs', title: 'SMS Notifications', desc: 'Send urgent SMS notifications for vehicle route delays and emergency alerts.' },
                        { key: 'pushNotifs', title: 'Mobile Push Notifications', desc: 'Push real-time alerts to linked mobile devices.' },
                        { key: 'criticalOnly', title: 'Critical Escalations Only', desc: 'Filter out low priority items and only escalate high-severity incidents.' },
                        { key: 'weeklyDigest', title: 'Weekly Analytics Digest', desc: 'Automated Monday morning PDF email digest summarizing fleet performance.' },
                      ].map(({ key, title, desc }) => (
                        <div key={key} className="ad-settings-item">
                          <div>
                            <div className="ad-settings-item-title">{title}</div>
                            <div className="ad-settings-item-desc">{desc}</div>
                          </div>
                          <label className="ad-toggle">
                            <input
                              type="checkbox"
                              checked={settingsState[key]}
                              onChange={e => {
                                setSettingsState({ ...settingsState, [key]: e.target.checked });
                                triggerToast(`Notification setting updated: ${title}`);
                              }}
                            />
                            <span className="ad-toggle-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. LANGUAGE & LOCALIZATION SETTINGS */}
                  <div className="ad-card">
                    <div className="ad-card-header" style={{ marginBottom: 18 }}>
                      <h3 className="ad-card-title"><Globe size={18} color="var(--ad-brown)" /> Language &amp; Localization</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Platform language &amp; timezone</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{t('language')}</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[
                            { code: 'en-US', label: 'English (US)' },
                            { code: 'ta',    label: 'தமிழ் (Tamil)' },
                            { code: 'te',    label: 'తెలుగు (Telugu)' },
                            { code: 'hi',    label: 'हिंदी (Hindi)' },
                            { code: 'kn',    label: 'ಕನ್ನಡ (Kannada)' },
                            { code: 'ml',    label: 'മലയാളം (Malayalam)' },
                          ].map(lang => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                triggerToast(`✅ Language changed to ${lang.label}`);
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                                borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                                fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: language === lang.code ? 700 : 500,
                                border: language === lang.code ? '2px solid var(--ad-brown)' : '1.5px solid var(--ad-border)',
                                background: language === lang.code ? 'var(--ad-brown-light)' : 'transparent',
                                color: 'var(--ad-text-dark)',
                              }}
                            >
                              {lang.label}
                              {language === lang.code && <Check size={16} color="var(--ad-brown)" style={{ marginLeft: 'auto' }} />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>System Timezone</label>
                        <select
                          className="ad-select"
                          value={settingsState.timezone}
                          onChange={e => {
                            setSettingsState({ ...settingsState, timezone: e.target.value });
                            triggerToast(`Timezone updated to ${e.target.value}`);
                          }}
                        >
                          <option>IST (UTC +05:30) - Asia/Kolkata</option>
                          <option>UTC (Coordinated Universal Time)</option>
                          <option>EST (UTC -05:00) - New York</option>
                          <option>SGT (UTC +08:00) - Singapore</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Currency Format</label>
                        <select
                          className="ad-select"
                          value={settingsState.currency}
                          onChange={e => setSettingsState({ ...settingsState, currency: e.target.value })}
                        >
                          <option>INR (₹) - Indian Rupee</option>
                          <option>USD ($) - US Dollar</option>
                          <option>EUR (€) - Euro</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Date Format</label>
                        <select
                          className="ad-select"
                          value={settingsState.dateFormat}
                          onChange={e => setSettingsState({ ...settingsState, dateFormat: e.target.value })}
                        >
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. PRIVACY SETTINGS */}
                  <div className="ad-card">
                    <div className="ad-card-header" style={{ marginBottom: 18 }}>
                      <h3 className="ad-card-title"><Shield size={18} color="var(--ad-brown)" /> Privacy</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Data sharing &amp; audit tracking</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { key: 'locationTelemetry', title: 'Location Telemetry Access Control', desc: 'Enable encrypted live GPS streaming logs for active truck tracking.' },
                        { key: 'aiCoPilotOptIn', title: 'AI Operations Co-Pilot Optimization', desc: 'Allow anonymized trip telemetry data to improve AI route prediction models.' },
                        { key: 'auditLogging', title: 'System Audit Trail Logging', desc: 'Record complete trace logs of all master admin actions for compliance.' },
                        { key: 'thirdPartySharing', title: 'Third-Party Integration API Data Sharing', desc: 'Allow restricted telemetry access to verified logistics partner APIs.' },
                      ].map(({ key, title, desc }) => (
                        <div key={key} className="ad-settings-item">
                          <div>
                            <div className="ad-settings-item-title">{title}</div>
                            <div className="ad-settings-item-desc">{desc}</div>
                          </div>
                          <label className="ad-toggle">
                            <input
                              type="checkbox"
                              checked={settingsState[key]}
                              onChange={e => {
                                setSettingsState({ ...settingsState, [key]: e.target.checked });
                                triggerToast(`Privacy setting updated: ${title}`);
                              }}
                            />
                            <span className="ad-toggle-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. SECURITY SETTINGS */}
                  <div className="ad-card">
                    <div className="ad-card-header" style={{ marginBottom: 18 }}>
                      <h3 className="ad-card-title"><Lock size={18} color="var(--ad-brown)" /> Security</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Enterprise security policies</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="ad-settings-item">
                        <div>
                          <div className="ad-settings-item-title">Two-Factor Authentication (2FA)</div>
                          <div className="ad-settings-item-desc">Require time-based OTP code via authenticator app on login.</div>
                        </div>
                        <label className="ad-toggle">
                          <input
                            type="checkbox"
                            checked={settingsState.twoFactor}
                            onChange={e => {
                              setSettingsState({ ...settingsState, twoFactor: e.target.checked });
                              triggerToast(`2FA Security ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                            }}
                          />
                          <span className="ad-toggle-slider" />
                        </label>
                      </div>

                      <div className="ad-settings-item">
                        <div>
                          <div className="ad-settings-item-title">Admin Session Timeout</div>
                          <div className="ad-settings-item-desc">Automatically lock session after period of inactivity.</div>
                        </div>
                        <select
                          className="ad-select"
                          value={settingsState.sessionTimeout}
                          onChange={e => {
                            setSettingsState({ ...settingsState, sessionTimeout: e.target.value });
                            triggerToast(`Session timeout set to ${e.target.value}`);
                          }}
                          style={{ width: 'auto', minWidth: 140 }}
                        >
                          <option>15 Minutes</option>
                          <option>30 Minutes</option>
                          <option>1 Hour</option>
                          <option>2 Hours</option>
                        </select>
                      </div>

                      <div className="ad-settings-item">
                        <div>
                          <div className="ad-settings-item-title">REST API Key Access</div>
                          <div className="ad-settings-item-desc">Master REST API keys enabled for automated dispatch systems.</div>
                        </div>
                        <label className="ad-toggle">
                          <input
                            type="checkbox"
                            checked={settingsState.apiKeyAccess}
                            onChange={e => {
                              setSettingsState({ ...settingsState, apiKeyAccess: e.target.checked });
                              triggerToast(`API Key Access ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                            }}
                          />
                          <span className="ad-toggle-slider" />
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

          ) : (

            /* ══════════════════════════════════════════════════════
               ADMIN DASHBOARD HOME PAGE VIEW
               ══════════════════════════════════════════════════════ */
            <>
              {/* 1. TOP SUMMARY CARDS (6 Summary Cards Grid) */}
              <div>
                <div className="ad-card-header" style={{ marginBottom: 14 }}>
                  <h2 className="ad-card-title">
                    <Activity size={18} color="var(--ad-brown)" /> Fleet &amp; Logistics Overview
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ad-text-muted)', fontWeight: 600 }}>Live Master Feed</span>
                </div>

                <div className="ad-summary-grid">
                  {(() => {
                    const activeTripsCount = (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['in-transit','IN_TRANSIT','ASSIGNED'].includes(t.status)).length;
                    const completedTripsCount = (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['completed','DELIVERED'].includes(t.status)).length;
                    const pendingTripsCount = (allTripsList.length > 0 ? allTripsList : ALL_TRIPS_DATA).filter(t => ['scheduled','PENDING'].includes(t.status)).length;
                    const totalDrivers = driversList.length;
                    const totalOwners = ownersList.length;
                    return SUMMARY_CARDS.map((card, i) => {
                      const Icon = card.icon;
                      let val = card.value;
                      let sub = card.sub;
                      let badge = card.badge;
                      if (card.title.includes('Total Drivers')) { val = totalDrivers; sub = totalDrivers > 0 ? 'Active drivers' : 'No drivers yet'; badge = totalDrivers; }
                      else if (card.title.includes('Total Cargo Owners')) { val = totalOwners; sub = totalOwners > 0 ? 'Registered owners' : 'No owners yet'; badge = totalOwners; }
                      else if (card.title.includes('Active Trips')) { val = activeTripsCount; sub = activeTripsCount > 0 ? `● ${activeTripsCount} active` : '● No active trips'; badge = activeTripsCount; }
                      else if (card.title.includes('Completed')) { val = completedTripsCount; sub = completedTripsCount > 0 ? `${completedTripsCount} completed` : 'No data'; badge = completedTripsCount; }
                      else if (card.title.includes('Pending') && card.title.includes('Trip')) { val = pendingTripsCount; sub = pendingTripsCount > 0 ? `${pendingTripsCount} pending` : 'No pending trips'; badge = pendingTripsCount; }
                      else if (card.title.includes('Driver Approval')) { val = driverApprovals.length; sub = driverApprovals.length > 0 ? `${driverApprovals.length} pending` : 'No pending approvals'; badge = driverApprovals.length; }
                      return (
                      <div
                        key={i}
                        className="ad-summary-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (card.title.includes('Driver')) setActiveNav('drivers');
                          else if (card.title.includes('Owner')) setActiveNav('owners');
                          else if (card.title.includes('Trip') || card.title.includes('Active')) setActiveNav('trips');
                          else if (card.title.includes('Approval')) setActiveNav('drivers');
                          else setActiveNav('trips');
                        }}
                      >
                        <div className="ad-summary-top">
                          <div className={`ad-summary-icon ${card.color}`}>
                            <Icon size={20} />
                          </div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'var(--ad-bg)', color: 'var(--ad-text-dark)' }}>
                            {badge}
                          </span>
                        </div>
                        <div>
                          <div className="ad-summary-val">{val}</div>
                          <div className="ad-summary-title">{card.title}</div>
                        </div>
                        <div className={`ad-summary-sub ${card.color === 'warning' ? 'warn' : card.color === 'danger' ? 'danger' : ''}`}>
                          {sub}
                        </div>
                      </div>
                    );
                  });
                })()}
                </div>
              </div>

              {/* 2. QUICK ACTIONS + SYSTEM STATUS + PENDING APPROVALS ROW */}
              <div className="ad-section-grid">

                {/* LEFT COLUMN: Quick Actions + System Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* QUICK ACTIONS */}
                  <div className="ad-card">
                    <div className="ad-card-header">
                      <h3 className="ad-card-title">
                        <Sparkles size={18} color="var(--ad-brown)" /> Quick Actions
                      </h3>
                    </div>

                    <div className="ad-quick-grid">
                      <button className="ad-quick-btn" onClick={() => setActiveNav('drivers')}>
                        <div className="ad-quick-icon-box"><Users size={18} /></div>
                        <span className="ad-quick-title">View Drivers</span>
                      </button>
                      <button className="ad-quick-btn" onClick={() => setActiveNav('owners')}>
                        <div className="ad-quick-icon-box"><Building size={18} /></div>
                        <span className="ad-quick-title">View Cargo Owners</span>
                      </button>
                      <button className="ad-quick-btn" onClick={() => setActiveNav('trips')}>
                        <div className="ad-quick-icon-box"><Truck size={18} /></div>
                        <span className="ad-quick-title">View Trips</span>
                      </button>
                      <button className="ad-quick-btn" onClick={() => setActiveNav('reports')}>
                        <div className="ad-quick-icon-box"><FileText size={18} /></div>
                        <span className="ad-quick-title">Generate Reports</span>
                      </button>
                    </div>
                  </div>

                  {/* SYSTEM STATUS (Compact Row) */}
                  <div className="ad-card">
                    <div className="ad-card-header" style={{ marginBottom: 12 }}>
                      <h3 className="ad-card-title">
                        <ShieldCheck size={18} color="var(--ad-success)" /> System Status
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: 'var(--ad-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ad-success)', display: 'inline-block' }} />
                        All Operational
                      </span>
                    </div>
                    <div className="ad-status-grid">
                      {SYSTEM_SERVICES.map((srv, i) => {
                        const Icon = srv.icon;
                        return (
                          <div key={i} className="ad-status-card" style={{ padding: '12px 16px' }}>
                            <div className="ad-status-indicator" style={{ width: 8, height: 8, minWidth: 8 }} />
                            <div style={{ background: 'var(--ad-bg)', padding: 6, borderRadius: 8, color: 'var(--ad-brown)' }}>
                              <Icon size={16} />
                            </div>
                            <div className="ad-status-info">
                              <span className="ad-status-name" style={{ fontSize: '0.78rem' }}>{srv.name}</span>
                              <span className="ad-status-state" style={{ fontSize: '0.68rem' }}>Online</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Pending Approvals + AI Insights + Recent Notifications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* PENDING APPROVALS */}
                  <div className="ad-card">
                    <div className="ad-card-header">
                      <h3 className="ad-card-title">
                        <Clock size={18} color="var(--ad-warning)" /> Pending Approvals
                      </h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ad-warning)' }}>
                        {driverApprovals.length + ownerApprovals.length} Pending
                      </span>
                    </div>

                    <div className="ad-approvals-list">
                      {driverApprovals.length > 0 && (
                        <>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Drivers ({driverApprovals.length})
                          </div>
                          {driverApprovals.map(driver => (
                            <div key={driver.id} className="ad-approval-item" style={{ padding: '10px 14px' }}>
                              <div className="ad-approval-info">
                                <span className="ad-approval-name" style={{ fontSize: '0.82rem' }}>{driver.name}</span>
                                <span className="ad-approval-sub" style={{ fontSize: '0.7rem' }}>{driver.vehicle}</span>
                              </div>
                              <div className="ad-approval-actions">
                                <button className="ad-btn-sm approve" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => handleApproveDriverPending(driver.id, driver.name)}>
                                  <Check size={11} style={{ display: 'inline', marginRight: 2 }}/> App
                                </button>
                                <button className="ad-btn-sm reject" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => handleRejectDriverPending(driver.id, driver.name)}>
                                  <X size={11} style={{ display: 'inline', marginRight: 2 }}/> Rej
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {ownerApprovals.length > 0 && (
                        <>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ad-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 6 }}>
                            Owners ({ownerApprovals.length})
                          </div>
                          {ownerApprovals.map(owner => (
                            <div key={owner.id} className="ad-approval-item" style={{ padding: '10px 14px' }}>
                              <div className="ad-approval-info">
                                <span className="ad-approval-name" style={{ fontSize: '0.82rem' }}>{owner.company}</span>
                                <span className="ad-approval-sub" style={{ fontSize: '0.7rem' }}>GST: {owner.gst}</span>
                              </div>
                              <div className="ad-approval-actions">
                                <button className="ad-btn-sm approve" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => handleApproveOwnerPending(owner.id, owner.company)}>
                                  <Check size={11} style={{ display: 'inline', marginRight: 2 }}/> App
                                </button>
                                <button className="ad-btn-sm reject" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={() => handleRejectOwnerPending(owner.id, owner.company)}>
                                  <X size={11} style={{ display: 'inline', marginRight: 2 }}/> Rej
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {driverApprovals.length === 0 && ownerApprovals.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--ad-text-muted)', fontSize: '0.82rem', padding: '16px 0' }}>
                          ✨ All pending approvals cleared!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI INSIGHTS */}
                  <div className="ad-ai-insights-card" style={{ padding: 18 }}>
                    <div className="ad-ai-header" style={{ marginBottom: 10 }}>
                      <div className="ad-ai-title" style={{ fontSize: '0.9rem' }}>
                        <Sparkles size={16} color="var(--ad-brown)" /> AI Co-Pilot
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: 'var(--ad-brown)', color: '#fff' }}>
                        Active
                      </span>
                    </div>
                    <div>
                      {AI_INSIGHTS.slice(0, 2).map((insight, idx) => (
                        <div key={idx} className="ad-ai-item" style={{ padding: '8px 10px', fontSize: '0.78rem', marginBottom: 6 }}>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RECENT NOTIFICATIONS */}
                  <div className="ad-card">
                    <div className="ad-card-header">
                      <h3 className="ad-card-title" style={{ fontSize: '0.95rem' }}>
                        <Bell size={16} color="var(--ad-brown)" /> Recent Notifications
                      </h3>
                      <span className="ad-card-link" style={{ fontSize: '0.72rem' }} onClick={() => setActiveNav('notifications')}>
                        View All <ChevronRight size={12} />
                      </span>
                    </div>
                    <div className="ad-timeline-list">
                      {NOTIFICATIONS_LIST.slice(0, 3).map(noti => (
                        <div key={noti.id} className="ad-timeline-item" style={{ paddingBottom: 8 }}>
                          <div className={`ad-timeline-dot ${noti.tag === 'Warning' ? 'warning' : noti.tag === 'Action Required' ? 'danger' : 'success'}`} style={{ width: 8, height: 8, minWidth: 8, marginTop: 4 }} />
                          <div className="ad-timeline-body">
                            <div className="ad-timeline-title" style={{ fontSize: '0.8rem' }}>{noti.title}</div>
                            <div className="ad-timeline-desc" style={{ fontSize: '0.72rem' }}>{noti.desc}</div>
                          </div>
                          <div className="ad-timeline-time" style={{ fontSize: '0.65rem' }}>{noti.time}</div>
                        </div>
                      ))}
                    </div>
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

export default AdminDashboard;
