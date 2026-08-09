import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, X, Sparkles, Send, RefreshCw, AlertCircle } from 'lucide-react';
import apiClient from '../services/api';
import { t, getLanguage } from '../utils/translations';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import './VoiceAssistantModal.css';

const VoiceAssistantModal = ({ isOpen, onClose, currentLang = 'en' }) => {
  const lang = currentLang || getLanguage();

  // Driver's chosen answer language (persisted). Defaults to the app language.
  const [assistantLang, setAssistantLang] = useState(() => {
    try {
      const saved = localStorage.getItem('cargolink_va_lang');
      if (saved === 'ta' || saved === 'en') return saved;
    } catch (e) {}
    return lang === 'ta' ? 'ta' : 'en';
  });

  // Voice States: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [assistantState, setAssistantState] = useState('idle');
  const [inputText, setInputText] = useState('');
  const [apiError, setApiError] = useState('');
  const [recognizedTranscript, setRecognizedTranscript] = useState('');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: lang === 'ta'
        ? 'வணக்கம்! நான் உங்கள் கார்கோலிங்க் AI குரல் உதவி. "எனது அடுத்த பயணம் என்ன?" அல்லது "எனது பிக்கப் எங்கே?" என்று கேளுங்கள்!'
        : 'Hello! I am your CargoLink AI Voice Assistant. Ask me questions like "What is my next trip?" or "Where is my next pickup?"'
    }
  ]);

  const recLang = assistantLang === 'ta' ? 'ta-IN' : 'en-IN';

  // Process question (handles both voice transcript and typed text input)
  const processQuestion = useCallback(async (userQuestion) => {
    if (!userQuestion || !userQuestion.trim()) return;
    const cleanQuestion = userQuestion.trim();

    stopSpeech();

    setMessages(prev => [...prev, { sender: 'user', text: cleanQuestion }]);
    setAssistantState('thinking');
    setInputText('');
    setApiError('');

    try {
      // Call authenticated driver voice assistant endpoint
      const response = await apiClient.post('/api/driver/voice-assistant', {
        question: cleanQuestion,
        language: assistantLang,
        spokenLanguage: assistantLang
      });

      const aiAnswer = response?.answer || (assistantLang === 'ta'
        ? 'மன்னிக்கவும், உங்கள் தகவலைப் பெற முடியவில்லை.'
        : "Sorry, I couldn't retrieve your trip details.");

      setMessages(prev => [...prev, { sender: 'ai', text: aiAnswer }]);
      speakResponse(aiAnswer, assistantLang);
    } catch (err) {
      console.error('Voice Assistant Error:', err);
      const fallbackMsg = assistantLang === 'ta'
        ? 'மன்னிக்கவும், தகவலைப் பெற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.'
        : "I couldn't fetch your trip data at the moment. Please try again.";

      setApiError(err.message || 'API Connection Error');
      setMessages(prev => [...prev, { sender: 'ai', text: fallbackMsg }]);
      speakResponse(fallbackMsg, assistantLang);
    }
  }, [assistantLang]);

  // Hook up custom speech recognition service
  const handleFinalTranscript = useCallback((finalText) => {
    if (finalText) {
      console.log('[Voice] Recognized final transcript:', finalText);
      setRecognizedTranscript(finalText);
      processQuestion(finalText);
    }
  }, [processQuestion]);

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    setError: setSpeechError
  } = useSpeechRecognition({
    lang: recLang,
    onFinalTranscript: handleFinalTranscript
  });

  // Sync assistant state when speech recognition state changes
  useEffect(() => {
    if (isListening) {
      setAssistantState('listening');
    } else if (assistantState === 'listening') {
      setAssistantState('idle');
    }
  }, [isListening]);

  const stopSpeech = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    if (assistantState === 'speaking') {
      setAssistantState('idle');
    }
  };

  const speakResponse = (text, targetLang = null) => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      const langToUse = targetLang || assistantLang;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = langToUse === 'ta' ? 'ta-IN' : 'en-IN';

      utterance.onstart = () => {
        setAssistantState('speaking');
      };
      utterance.onend = () => {
        setAssistantState('idle');
      };
      utterance.onerror = () => {
        setAssistantState('idle');
      };

      // Select matching voice (ta-IN or en-IN / en)
      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = langToUse === 'ta' ? 'ta' : 'en';
      const matchingVoice = voices.find(v => v.lang.startsWith(targetPrefix));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setAssistantState('idle');
    }
  };

  const selectAssistantLanguage = (code) => {
    stopSpeech();
    stopListening();
    resetTranscript();
    setRecognizedTranscript('');
    setAssistantLang(code);
    try {
      localStorage.setItem('cargolink_va_lang', code);
    } catch (e) {}
  };

  // Update initial greeting when language changes
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: assistantLang === 'ta'
          ? 'வணக்கம்! நான் உங்கள் கார்கோலிங்க் AI குரல் உதவி. "எனது அடுத்த பயணம் என்ன?" அல்லது "எனது பிக்கப் எங்கே?" என்று கேளுங்கள்!'
          : 'Hello! I am your CargoLink AI Voice Assistant. Ask me questions like "What is my next trip?" or "Where is my next pickup?"'
      }
    ]);
  }, [assistantLang]);

  // Welcome speech audio feedback when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const greeting = assistantLang === 'ta'
      ? 'வணக்கம்! நான் உங்கள் கார்கோலிங்க் AI குரல் உதவி. "எனது அடுத்த பயணம் என்ன?" அல்லது "எனது பிக்கப் எங்கே?" என்று கேளுங்கள்.'
      : 'Hello! I am your CargoLink AI Voice Assistant. Ask me questions like "What is my next trip?" or "Where is my next pickup?"';
    const timer = setTimeout(() => speakResponse(greeting, assistantLang), 400);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Clean up on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      stopListening();
      resetTranscript();
    }
  }, [isOpen]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeech();
      resetTranscript();
      setRecognizedTranscript('');
      startListening(recLang);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    t('promptNextTrip', assistantLang),
    t('promptPickup', assistantLang),
    t('promptDelivery', assistantLang),
    t('promptPickupTime', assistantLang),
    t('promptStatus', assistantLang),
    t('promptAssignedTrips', assistantLang)
  ];

  const getStatusLabel = () => {
    switch (assistantState) {
      case 'listening': return t('listening', assistantLang);
      case 'thinking': return t('thinking', assistantLang);
      case 'speaking': return t('speaking', assistantLang);
      default: return t('tapToSpeak', assistantLang);
    }
  };

  const displayError = speechError || apiError;

  // Determine current live display speech text
  const currentSpeechDisplay = interimTranscript || transcript || recognizedTranscript;

  return (
    <div className="va-modal-overlay">
      <div className="va-modal-glass animate-slide-up">

        {/* Modal Header */}
        <div className="va-modal-header">
          <div className="va-header-title">
            <div className="va-header-icon">
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <h3 className="va-title-text">{t('aiVoiceCopilot', assistantLang)}</h3>
              <p className="va-subtitle-text">● {getStatusLabel()}</p>
            </div>
          </div>

          <div className="va-header-right">
            {/* Language switcher */}
            <div className="va-lang-switcher" role="group" aria-label="Answer language">
              <button
                className={`va-lang-btn ${assistantLang === 'en' ? 'active' : ''}`}
                onClick={() => selectAssistantLanguage('en')}
                title="Answer in English"
              >
                EN
              </button>
              <button
                className={`va-lang-btn ${assistantLang === 'ta' ? 'active' : ''}`}
                onClick={() => selectAssistantLanguage('ta')}
                title="தமிழில் பதில்"
              >
                தமிழ்
              </button>
            </div>

            <button className="va-close-btn" onClick={() => { stopSpeech(); stopListening(); onClose(); }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Dynamic Voice Status Wave & Controls */}
        <div className={`va-status-banner state-${assistantState}`}>
          <div className="va-wave-box">
            {assistantState === 'listening' && (
              <div className="va-bars-container">
                <div className="va-bar bar-1"></div>
                <div className="va-bar bar-2"></div>
                <div className="va-bar bar-3"></div>
                <div className="va-bar bar-4"></div>
              </div>
            )}
            {assistantState === 'thinking' && (
              <RefreshCw size={20} className="animate-spin" color="var(--primary-brown)" />
            )}
            {assistantState === 'speaking' && (
              <Volume2 size={20} className="animate-pulse" color="#2E7D32" />
            )}
            {assistantState === 'idle' && (
              <Mic size={20} color="var(--primary-brown)" />
            )}
            <span className="va-status-label">{getStatusLabel()}</span>
          </div>

          {/* Stop Button when speaking or listening */}
          {(assistantState === 'speaking' || assistantState === 'listening') && (
            <button className="va-stop-btn" onClick={assistantState === 'speaking' ? stopSpeech : stopListening}>
              <Square size={14} fill="currentColor" />
              <span>{t('stop', assistantLang)}</span>
            </button>
          )}
        </div>

        {/* Clean Mobile Bilingual Hint */}
        <div className="va-bilingual-hint">
          <span>{t('bilingualHint', assistantLang)}</span>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="va-error-alert">
            <AlertCircle size={16} />
            <span>{displayError}</span>
          </div>
        )}

        {/* Live Transcript / Speech Input Box */}
        {(isListening || currentSpeechDisplay) && (
          <div className="va-transcript-box">
            <div className="va-transcript-header">
              <span className="va-transcript-tag">{t('transcript', assistantLang)}:</span>
              {isListening && (
                <span className="va-listening-pulse">● {assistantLang === 'ta' ? 'இப்போது பேசுங்கள்...' : 'Listening... Speak now'}</span>
              )}
            </div>
            <p className="va-transcript-content">
              {currentSpeechDisplay ? `"${currentSpeechDisplay}"` : (assistantLang === 'ta' ? 'உங்கள் குரலுக்காக காத்திருக்கிறது...' : 'Listening for your voice...')}
            </p>
          </div>
        )}

        {/* Messages List */}
        <div className="va-messages-list">
          {messages.map((msg, idx) => (
            <div key={idx} className={`va-message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick Question Prompts */}
        <div className="va-quick-prompts">
          {quickPrompts.map((promptText, idx) => (
            <button key={idx} className="va-prompt-chip" onClick={() => processQuestion(promptText)}>
              💬 {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="va-input-bar">
          <input
            className="va-text-input"
            placeholder={t('askOrSpeak', assistantLang)}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && processQuestion(inputText)}
          />

          <button
            className={`va-mic-btn ${isListening ? 'active' : ''}`}
            onClick={handleMicToggle}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? <MicOff size={20} color="white" /> : <Mic size={20} color="white" />}
          </button>

          <button
            className="va-send-btn"
            onClick={() => processQuestion(inputText)}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="white" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceAssistantModal;
