import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation2, Truck, IndianRupee, Map, CloudRain, ShieldAlert,
  Fuel, Home, Briefcase, Bell, User, Sparkles, Mic, Search, X, Send, Bot, CheckCircle2, Volume2
} from 'lucide-react';
import BottomNav from './BottomNav';

const HomeDashboard = ({
  onOpenTrip, onNearby, onNotifications, onProfile, onAIRoute,
  onAITraffic, onAIWeather, onAIFuel, onHome, onTrips, onOpenNav,
  onNearbyCategory, sharedTripState
}) => {
  const [onDuty, setOnDuty] = useState(true);

  // AI Voice & Assistant Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeCommandText, setActiveCommandText] = useState('');
  const [userName, setUserName] = useState('Driver');

  const [aiResponses, setAiResponses] = useState([
    { sender: 'ai', text: 'Hello John! I am your CargoLink AI Voice Co-Pilot. Press the microphone or speak a command like "Show Fastest Route" or "Nearest Fuel Station"!' }
  ]);

  const recognitionRef = useRef(null);

  const quickPrompts = [
    '🧭 Open Navigation',
    '⚡ Show Fastest Route',
    '🚨 Show Traffic',
    '🌧️ Show Weather',
    '⛽ Nearest Fuel Station',
    '🔧 Nearest Mechanic',
    '🏥 Nearest Hospital',
    '🅿️ Nearest Parking',
    '🍽️ Nearest Restaurant',
    '🏠 Go Home',
    '🏁 Complete Trip'
  ];

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cargolink_user') || localStorage.getItem('cargolink_driver_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      if (parsedUser?.fullName) {
        setUserName(parsedUser.fullName);
      } else if (parsedUser?.name) {
        setUserName(parsedUser.name);
      }
    } catch (e) {
      console.warn('Unable to load user name from storage', e);
    }
  }, []);

  // Helper for Text to Speech
  const speakText = (text) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Command Matcher & Action Executer
  const executeCommand = (rawText) => {
    const textLower = rawText.toLowerCase().trim();

    let aiSpeech = '';
    let navAction = null;

    if (textLower.includes('navigation') || textLower.includes('open nav')) {
      aiSpeech = 'Opening navigation to your destination.';
      navAction = () => onOpenNav && onOpenNav();
    } else if (textLower.includes('fastest route') || textLower.includes('best route') || textLower.includes('route')) {
      aiSpeech = 'Displaying the fastest route.';
      navAction = () => onAIRoute && onAIRoute();
    } else if (textLower.includes('traffic') || textLower.includes('congestion')) {
      aiSpeech = 'Opening live traffic monitoring.';
      navAction = () => onAITraffic && onAITraffic();
    } else if (textLower.includes('weather') || textLower.includes('rain') || textLower.includes('forecast')) {
      aiSpeech = 'Displaying route weather forecast.';
      navAction = () => onAIWeather && onAIWeather();
    } else if (textLower.includes('fuel') || textLower.includes('diesel') || textLower.includes('petrol')) {
      aiSpeech = 'Showing nearby fuel stations.';
      navAction = () => onNearbyCategory ? onNearbyCategory('fuel') : onNearby && onNearby();
    } else if (textLower.includes('mechanic') || textLower.includes('garage') || textLower.includes('repair')) {
      aiSpeech = 'Showing nearby mechanic shops.';
      navAction = () => onNearbyCategory ? onNearbyCategory('mechanic') : onNearby && onNearby();
    } else if (textLower.includes('hospital') || textLower.includes('doctor') || textLower.includes('medical')) {
      aiSpeech = 'Showing nearby medical emergency centers.';
      navAction = () => onNearbyCategory ? onNearbyCategory('hospital') : onNearby && onNearby();
    } else if (textLower.includes('parking') || textLower.includes('rest bay')) {
      aiSpeech = 'Showing nearby secure truck parking.';
      navAction = () => onNearbyCategory ? onNearbyCategory('parking') : onNearby && onNearby();
    } else if (textLower.includes('restaurant') || textLower.includes('food') || textLower.includes('dhaba')) {
      aiSpeech = 'Showing nearby dhaba and restaurants.';
      navAction = () => onNearbyCategory ? onNearbyCategory('restaurant') : onNearby && onNearby();
    } else if (textLower.includes('home') || textLower.includes('dashboard')) {
      aiSpeech = 'Returning to Driver Dashboard.';
      navAction = () => onHome && onHome();
    } else if (textLower.includes('complete trip') || textLower.includes('arrived') || textLower.includes('finish trip')) {
      aiSpeech = 'Opening trip completion screen.';
      navAction = () => onOpenTrip && onOpenTrip();
    } else {
      aiSpeech = "Sorry, I didn't understand your request. Please try again.";
      navAction = null;
    }

    setAiResponses(prev => [
      ...prev,
      { sender: 'user', text: rawText },
      { sender: 'ai', text: aiSpeech }
    ]);

    speakText(aiSpeech);

    if (navAction) {
      setIsExecuting(true);
      setTimeout(() => {
        setIsExecuting(false);
        setShowAiModal(false);
        navAction();
      }, 1200);
    }
  };

  const handleSendQuery = (textToSend) => {
    const query = textToSend || aiQuery;
    if (!query.trim()) return;

    setAiQuery('');
    executeCommand(query);
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    setIsRecognizing(false);
    setActiveCommandText('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          setIsRecognizing(true);
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setActiveCommandText(transcript);
        };

        recognition.onerror = () => {
          fallbackSimulatedVoice();
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsRecognizing(false);
          if (activeCommandText.trim()) {
            executeCommand(activeCommandText);
          } else {
            fallbackSimulatedVoice();
          }
        };

        recognition.start();
        return;
      } catch (e) {
        fallbackSimulatedVoice();
      }
    } else {
      fallbackSimulatedVoice();
    }
  };

  const fallbackSimulatedVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setIsRecognizing(true);
      setActiveCommandText('Show Fastest Route');

      setTimeout(() => {
        setIsRecognizing(false);
        executeCommand('Show Fastest Route');
      }, 800);
    }, 1800);
  };

  const aiCards = [
    { icon: <Map size={18} color="#0288D1" />, bg: '#E1F5FE', title: 'Fastest Route', desc: 'NH 44 Highway', action: onAIRoute },
    { icon: <ShieldAlert size={18} color="#D32F2F" />, bg: '#FFEBEE', title: 'Traffic', desc: 'Live Monitoring', action: onAITraffic },
    { icon: <CloudRain size={18} color="#0097A7" />, bg: '#E0F7FA', title: 'Weather', desc: 'Rain Forecast', action: onAIWeather },
    { icon: <Fuel size={18} color="#388E3C" />, bg: '#E8F5E9', title: 'Fuel Saving', desc: 'Eco Guidance', action: onAIFuel },
  ];

  return (
    <div className="app-screen animate-fade-in">

      {/* ── Interactive AI Voice Assistant Modal ── */}
      {showAiModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end'
        }}>
          <div className="animate-slide-up" style={{
            backgroundColor: 'var(--white)', width: '100%', height: '88%',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1rem 1.25rem', backgroundColor: '#FDF6F0',
              borderBottom: '1px solid #F0EAE3', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ backgroundColor: 'var(--primary-brown)', padding: '6px', borderRadius: '10px', color: 'white' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.95rem' }}>CargoLink AI Voice Co-Pilot</h3>
                  <p className="text-poppins text-primary" style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600 }}>● Active Real-time Speech AI</p>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="var(--text-dark-brown)" />
              </button>
            </div>

            {/* Voice Wave Animation Banner */}
            {(isListening || isRecognizing || isExecuting) && (
              <div style={{
                backgroundColor: isExecuting ? '#E8F5E9' : isRecognizing ? '#E3F2FD' : '#FFF3E0',
                padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '4px', height: '16px', backgroundColor: '#8B5E3C', borderRadius: '2px', animation: 'voiceBar 0.8s infinite ease-in-out' }}></div>
                    <div style={{ width: '4px', height: '24px', backgroundColor: '#8B5E3C', borderRadius: '2px', animation: 'voiceBar 0.6s infinite ease-in-out' }}></div>
                    <div style={{ width: '4px', height: '12px', backgroundColor: '#8B5E3C', borderRadius: '2px', animation: 'voiceBar 1s infinite ease-in-out' }}></div>
                  </div>
                  <style>{`
                    @keyframes voiceBar {
                      0%, 100% { transform: scaleY(0.4); }
                      50% { transform: scaleY(1.2); }
                    }
                  `}</style>
                  <div>
                    <p className="text-poppins font-bold" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dark-brown)' }}>
                      {isExecuting ? '⚡ Executing Command...' : isRecognizing ? '🧠 Recognizing Speech...' : '🎙 Listening to driver voice...'}
                    </p>
                    <p className="text-poppins" style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7 }}>
                      {activeCommandText || 'Say "Open Navigation" or "Show Traffic"'}
                    </p>
                  </div>
                </div>
                <Mic size={20} color="var(--primary-brown)" className="animate-pulse" />
              </div>
            )}

            {/* Chat Messages List */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiResponses.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary-brown)' : '#F5EFE8',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-dark-brown)',
                  padding: '10px 14px', borderRadius: '16px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
                  fontSize: '0.82rem', fontFamily: 'var(--font-poppins)', lineHeight: 1.4,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {quickPrompts.map((prompt, pIdx) => (
                <button key={pIdx} onClick={() => handleSendQuery(prompt.replace(/^[^\w]+/, ''))} style={{
                  backgroundColor: '#F4F1ED', border: '1px solid rgba(139,94,60,0.15)',
                  borderRadius: '16px', padding: '5px 12px', fontSize: '0.74rem',
                  fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'var(--text-dark-brown)',
                  whiteSpace: 'nowrap', cursor: 'pointer'
                }}>
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div style={{ padding: '0.75rem 1rem 1rem', borderTop: '1px solid #F0EAE3', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                className="input-premium"
                placeholder="Ask AI or speak a voice command..."
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
                style={{ flex: 1, padding: '0.75rem 1rem', fontSize: '0.85rem' }}
              />
              <button onClick={startVoiceRecognition} style={{
                backgroundColor: isListening ? '#E65100' : 'var(--primary-brown)',
                border: 'none', padding: '10px',
                borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                boxShadow: '0 2px 8px rgba(139,94,60,0.2)'
              }}>
                <Mic size={18} color="white" />
              </button>
              <button onClick={() => handleSendQuery()} style={{
                backgroundColor: 'var(--primary-brown)', color: 'white',
                border: 'none', padding: '10px 14px', borderRadius: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}>
                <Send size={18} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Sticky Header ── */}
      <div style={{
        flexShrink: 0,
        padding: '1.6rem 1.5rem 1rem',
        backgroundColor: 'var(--white)',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 15px rgba(139,94,60,0.05)',
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={onProfile}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--secondary-beige)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <img src="https://i.pravatar.cc/150?img=11" alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ cursor: 'pointer' }}>
              <p className="text-poppins text-brown" style={{ fontSize: '0.83rem', margin: 0, opacity: 0.75 }}>Good Morning,</p>
              <h3 className="text-poppins font-bold text-brown" style={{ fontSize: '1.05rem', margin: 0 }}>{userName}</h3>
              <p className="text-poppins text-primary font-medium" style={{ fontSize: '0.72rem', margin: 0 }}>ID: CL-8492</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-poppins font-medium" style={{ fontSize: '0.82rem', color: onDuty ? '#2E7D32' : 'var(--text-muted)' }}>
              {onDuty ? 'On Duty' : 'Off Duty'}
            </span>
            <div onClick={() => setOnDuty(!onDuty)} style={{
              width: 44, height: 24, backgroundColor: onDuty ? '#E8F5E9' : '#E0E0E0',
              borderRadius: 12, position: 'relative', cursor: 'pointer',
              transition: 'all 0.3s ease', border: onDuty ? '1px solid #A5D6A7' : '1px solid #BDBDBD'
            }}>
              <div style={{
                width: 18, height: 18,
                backgroundColor: onDuty ? '#4CAF50' : '#9E9E9E',
                borderRadius: '50%', position: 'absolute', top: 2,
                left: onDuty ? 22 : 3, transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        </div>

        {/* ── AI VOICE & ASSISTANT BAR ── */}
        <div
          onClick={() => { setShowAiModal(true); startVoiceRecognition(); }}
          style={{
            backgroundColor: '#FDF6F0',
            border: '1.5px solid rgba(139,94,60,0.25)',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(139,94,60,0.06)'
          }}
        >
          <div style={{ backgroundColor: 'var(--primary-brown)', padding: '6px', borderRadius: '10px', color: 'white', display: 'flex' }}>
            <Sparkles size={16} />
          </div>
          <span className="text-poppins font-medium text-brown" style={{ flex: 1, fontSize: '0.82rem', opacity: 0.8 }}>
            Ask CargoLink AI or Speak Command...
          </span>
          <div style={{ backgroundColor: 'rgba(139,94,60,0.1)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Mic size={16} color="var(--primary-brown)" />
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="screen-scroll-area">
        <div className="screen-scroll-content">

          {/* Current Trip */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Current Active Trip</h4>
          <div className="premium-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--primary-brown)' }} />
                  <div style={{ width: 2, height: 25, backgroundColor: 'var(--secondary-beige)', margin: '2px 0' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-brown)' }} />
                </div>
                <div>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>Coimbatore</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: '0 0 10px 0', opacity: 0.6 }}>Pickup</p>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.9rem', margin: '0 0 2px 0' }}>Chennai</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.75rem', margin: 0, opacity: 0.6 }}>Delivery</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  backgroundColor: sharedTripState?.status === 'Completed' ? '#E8F5E9' : '#FFF3E0',
                  padding: '4px 8px', borderRadius: 8, display: 'inline-block', marginBottom: 8
                }}>
                  <span className="text-poppins font-bold" style={{ color: sharedTripState?.status === 'Completed' ? '#2E7D32' : '#E65100', fontSize: '0.78rem' }}>
                    {sharedTripState?.status || 'In Progress'}
                  </span>
                </div>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.8rem', margin: 0 }}>
                  {sharedTripState?.status === 'Completed' ? 'Completed' : '120 KM Left'}
                </p>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ height: 6, backgroundColor: '#EDE8DC', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${sharedTripState?.progress || 76}%`, height: '100%',
                  background: 'linear-gradient(90deg,#8B5E3C,#2E7D32)', borderRadius: 3,
                  transition: 'width 0.6s ease'
                }} />
              </div>
            </div>
            <button className="btn-brown" onClick={onOpenTrip} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.75rem' }}>
              <Navigation2 size={18} /> View Trip & Complete Status
            </button>
          </div>

          {/* New Return Load */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ backgroundColor: '#E8EAF6', color: '#3F51B5', padding: '2px 6px', borderRadius: 6, fontSize: '0.7rem' }}>AI MATCH</span>
            New Return Load
          </h4>
          <div className="premium-card" style={{ border: '1px solid rgba(63,81,181,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-warm)', padding: 8, borderRadius: 10 }}>
                <Truck size={20} color="var(--primary-brown)" />
              </div>
              <div>
                <h5 className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.95rem' }}>ABC Logistics Pvt Ltd</h5>
                <p className="text-poppins text-brown" style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Industrial Goods</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem', backgroundColor: 'var(--bg-warm)', padding: 10, borderRadius: 12 }}>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Route</p>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>Chennai ➔ Madurai</p>
              </div>
              <div>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Weight</p>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>18 Tons</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Pickup Time</p>
                <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.85rem', margin: 0 }}>Today, 06:00 PM</p>
              </div>
            </div>
            <button className="btn-beige" onClick={onOpenTrip} style={{ padding: '0.75rem', color: 'var(--primary-brown)' }}>
              View Load Details
            </button>
          </div>

          {/* Commission */}
          <div className="premium-card" style={{ marginTop: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ backgroundColor: '#E8F5E9', padding: 6, borderRadius: 8 }}>
                <IndianRupee size={16} color="#4CAF50" />
              </div>
              <p className="text-poppins font-medium text-brown" style={{ fontSize: '0.82rem', margin: 0 }}>This Trip Commission</p>
            </div>
            <h3 className="text-poppins font-bold text-brown" style={{ fontSize: '1.5rem', margin: '0 0 4px 0' }}>₹1,250</h3>
            <span style={{ fontSize: '0.7rem', backgroundColor: sharedTripState?.status === 'Completed' ? '#E8F5E9' : '#FFF3E0', color: sharedTripState?.status === 'Completed' ? '#2E7D32' : '#E65100', padding: '2px 10px', borderRadius: 10, fontWeight: 600 }}>
              {sharedTripState?.status === 'Completed' ? 'Settled' : 'Pending Settlement'}
            </span>
          </div>

          {/* AI Trip Assistant Cards */}
          <h4 className="text-poppins font-bold text-brown" style={{ marginBottom: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }}>AI Trip Assistant</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '0.5rem' }}>
            {aiCards.map((item, i) => (
              <div key={i} className="ai-card" onClick={item.action}>
                <div style={{ backgroundColor: item.bg, padding: 8, borderRadius: 10, display: 'flex', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="text-poppins font-bold text-brown" style={{ fontSize: '0.8rem', margin: '0 0 2px 0' }}>{item.title}</p>
                  <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: 0, opacity: 0.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Fixed Bottom Navigation ── */}
      <BottomNav
        active="home"
        onHome={onHome || null}
        onTrips={onTrips || onOpenTrip}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </div>
  );
};

export default HomeDashboard;
