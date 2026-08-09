// Multilingual Translation Dictionary for CargoLINK Driver Dashboard (English & Tamil)

const translations = {
  en: {
    // Header & Greeting
    appName: "CargoLink AI",
    goodMorning: "Good Morning,",
    goodAfternoon: "Good Afternoon,",
    goodEvening: "Good Evening,",
    welcomeBack: "Welcome back,",
    driverOverview: "Here's your trip overview for today",
    onDuty: "On Duty",
    offDuty: "Off Duty",
    available: "Available",
    onTrip: "On Trip",
    activeTrips: "Active Trips",
    completed: "Completed",
    earningsToday: "Earnings Today",
    driverId: "Driver ID",

    // Profile Card & Edit Profile
    driverProfile: "Driver Profile",
    editProfile: "Edit Profile",
    mobile: "Mobile",
    email: "Email",
    truckNo: "Truck No.",
    licence: "Licence",
    address: "Address",
    preferredLanguage: "Preferred Language",
    selectLanguage: "Select Preferred Language",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    logout: "Logout from Account",
    safetyRating: "Safety Rating",
    completedTrips: "Completed Trips",
    totalEarnings: "Total Earnings",
    appSettings: "App Settings & Preferences",
    profileUpdated: "Profile updated successfully!",
    nameRequired: "Driver Name cannot be empty.",
    phoneRequired: "Please enter a valid 10-digit mobile number.",
    emailRequired: "Please enter a valid email address.",
    addressRequired: "Address cannot be empty.",

    // Dashboard Cards & Titles
    quickActions: "Quick Actions",
    voiceAssistant: "Voice Assistant",
    callAdmin: "Call Admin",
    callOwner: "Call Owner",
    emergencySos: "Emergency SOS",
    currentTrip: "Current Active Trip",
    noActiveTrip: "No Active Trip",
    pickup: "Pickup",
    delivery: "Delivery",
    eta: "ETA",
    openNav: "Open Navigation",
    availableLoads: "Available Loads",
    acceptLoad: "Accept Load",
    decline: "Decline",
    viewDetails: "View Details",
    noPendingLoads: "No pending loads available",
    todaysEarnings: "Today's Earnings",
    notifications: "Notifications",
    viewAll: "View All",
    quickServices: "Quick Services",
    fuelStation: "Fuel Station",
    parking: "Parking",
    foodCourt: "Food Court",
    mechanic: "Mechanic",
    hospital: "Hospital",

    // Navigation & Tabs
    home: "Home",
    trips: "Trips",
    profile: "Profile",

    // Voice Assistant UI
    aiVoiceCopilot: "CargoLink AI Voice Co-Pilot",
    askOrSpeak: "Ask CargoLink AI or Speak Command...",
    tapToSpeak: "Tap to speak",
    listening: "Listening to voice...",
    thinking: "Thinking...",
    speaking: "Speaking...",
    executing: "Executing Command...",
    stop: "Stop",
    micPermissionError: "Microphone access denied or not supported in browser.",
    transcript: "Your Question",
    aiResponse: "AI Response",
    noSpeechDetected: "I couldn't hear anything. Please speak closer to the mic or type your question.",
    micCaptureError: "Couldn't access the microphone. Make sure it isn't being used by another app.",
    networkError: "Voice recognition needs internet access. Check your connection or type your question.",
    bilingualHint: "Speak in English or Tamil — the AI answers in your chosen language.",

    // Voice Quick Prompts
    promptNextTrip: "What is my next trip?",
    promptPickup: "Where is my next pickup?",
    promptDelivery: "Where should I deliver the load?",
    promptPickupTime: "What time is my pickup?",
    promptStatus: "What is the status of my current trip?",
    promptAssignedTrips: "Show my assigned trips.",
    promptFastestRoute: "Show Fastest Route",
    promptNearestFuel: "Nearest Fuel Station"
  },
  ta: {
    // Header & Greeting
    appName: "கார்கோலிங்க் AI",
    goodMorning: "காலை வணக்கம்,",
    goodAfternoon: "மதிய வணக்கம்,",
    goodEvening: "மாலை வணக்கம்,",
    welcomeBack: "மீண்டும் வருக,",
    driverOverview: "இன்றைய பயண மேலோட்டம் இதோ",
    onDuty: "பணியில் உள்ளார்",
    offDuty: "பணியில் இல்லை",
    available: "கிடைக்கக்கூடியவர்",
    onTrip: "பயணத்தில் உள்ளார்",
    activeTrips: "செயலில் உள்ள பயணங்கள்",
    completed: "முடிவடைந்தவை",
    earningsToday: "இன்றைய வருமானம்",
    driverId: "ஓட்டுநர் ஐடி",

    // Profile Card & Edit Profile
    driverProfile: "ஓட்டுநர் சுயவிவரம்",
    editProfile: "சுயவிவரத்தை திருத்து",
    mobile: "கைபேசி",
    email: "மின்னஞ்சல்",
    truckNo: "லாரி எண்",
    licence: "ஓட்டுநர் உரிமம்",
    address: "முகவரி",
    preferredLanguage: "விருப்பமான மொழி",
    selectLanguage: "விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    saveChanges: "மாற்றங்களைச் சேமி",
    cancel: "ரத்து செய்",
    logout: "கணக்கிலிருந்து வெளியேறு",
    safetyRating: "பாதுகாப்பு மதிப்பீடு",
    completedTrips: "முடித்த பயணங்கள்",
    totalEarnings: "மொத்த வருமானம்",
    appSettings: "செயலி அமைப்புகள் & விருப்பங்கள்",
    profileUpdated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    nameRequired: "ஓட்டுநர் பெயரை காலியாக விடக்கூடாது.",
    phoneRequired: "செல்லுபடியாகும் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.",
    emailRequired: "செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    addressRequired: "முகவரியை காலியாக விடக்கூடாது.",

    // Dashboard Cards & Titles
    quickActions: "விரைவு நடவடிக்கைகள்",
    voiceAssistant: "குரல் உதவி (AI)",
    callAdmin: "நிர்வாகியை அழை",
    callOwner: "உரிமையாளரை அழை",
    emergencySos: "அவசர SOS",
    currentTrip: "தற்போதைய பயணம்",
    noActiveTrip: "செயலில் உள்ள பயணம் எதுவுமில்லை",
    pickup: "பிக்கப் இடம்",
    delivery: "டெலிவரி இடம்",
    eta: "வரும் நேரம் (ETA)",
    openNav: "வழிசெலுத்தலைத் திற",
    availableLoads: "கிடைக்கும் லோடுகள்",
    acceptLoad: "ஏற்றுக்கொள்",
    decline: "நிராகரி",
    viewDetails: "விவரங்களை பார்",
    noPendingLoads: "லோடுகள் எதுவும் இல்லை",
    todaysEarnings: "இன்றைய வருமானம்",
    notifications: "அறிவிப்புகள்",
    viewAll: "அனைத்தையும் பார்",
    quickServices: "விரைவு சேவைகள்",
    fuelStation: "எரிபொருள் நிலையம்",
    parking: "பார்க்கிங்",
    foodCourt: "உணவகம்",
    mechanic: "மெக்கானிக்",
    hospital: "மருத்துவமனை",

    // Navigation & Tabs
    home: "முகப்பு",
    trips: "பயணங்கள்",
    profile: "சுயவிவரம்",

    // Voice Assistant UI
    aiVoiceCopilot: "கார்கோலிங்க் AI குரல் உதவி",
    askOrSpeak: "AI உதவி கேட்கவும் அல்லது பேசவும்...",
    tapToSpeak: "பேச தட்டவும்",
    listening: "குரலை கேட்கிறது...",
    thinking: "யோசிக்கிறது...",
    speaking: "பேசுகிறது...",
    executing: "செயல்படுத்துகிறது...",
    stop: "நிறுத்து",
    micPermissionError: "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது அல்லது ஆதரிக்கப்படவில்லை.",
    transcript: "உங்கள் கேள்வி",
    aiResponse: "AI பதில்",
    noSpeechDetected: "நான் எதுவும் கேட்கவில்லை. மைக்ரோஃபோனுக்கு அருகில் பேசுங்கள் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யவும்.",
    micCaptureError: "மைக்ரோஃபோனை அணுக முடியவில்லை. அது வேறு பயன்பாட்டால் பயன்படுத்தப்படவில்லை என்பதை உறுதிசெய்யவும்.",
    networkError: "குரல் அங்கீகாரத்திற்கு இணைய இணைப்பு தேவை. உங்கள் இணைப்பைச் சரிபார்க்கவும் அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யவும்.",
    bilingualHint: "ஆங்கிலத்திலோ அல்லது தமிழிலோ பேசுங்கள் — AI உங்கள் தேர்ந்தெடுத்த மொழியில் பதிலளிக்கும்.",

    // Voice Quick Prompts
    promptNextTrip: "எனது அடுத்த பயணம் என்ன?",
    promptPickup: "எனது அடுத்த பிக்கப் எங்கே?",
    promptDelivery: "லோடை எங்கு டெலிவரி செய்ய வேண்டும்?",
    promptPickupTime: "பிக்கப் நேரம் என்ன?",
    promptStatus: "தற்போதைய பயணத்தின் நிலை என்ன?",
    promptAssignedTrips: "எனக்கு ஒதுக்கப்பட்ட பயணங்களைக் காட்டு.",
    promptFastestRoute: "வேகமான பாதையைக் காட்டு",
    promptNearestFuel: "அருகிலுள்ள எரிபொருள் நிலையம்"
  }
};

export const getLanguage = () => {
  try {
    const savedProfile = localStorage.getItem('cargolink_driver_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      if (parsed.language) {
        if (parsed.language.toLowerCase().includes('tamil') || parsed.language === 'ta') return 'ta';
        if (parsed.language.toLowerCase().includes('english') || parsed.language === 'en') return 'en';
      }
    }
    const savedLang = localStorage.getItem('cargolink_language');
    if (savedLang === 'ta' || savedLang === 'en') return savedLang;
  } catch (e) {}
  return 'en';
};

export const setLanguage = (lang) => {
  try {
    localStorage.setItem('cargolink_language', lang);
    const savedProfile = localStorage.getItem('cargolink_driver_profile');
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    profile.language = lang === 'ta' ? 'தமிழ் (Tamil)' : 'English';
    localStorage.setItem('cargolink_driver_profile', JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('cargolink_lang_updated', { detail: { language: lang } }));
  } catch (e) {}
};

export const t = (key, langOverride) => {
  const lang = langOverride || getLanguage();
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
};

export default translations;
