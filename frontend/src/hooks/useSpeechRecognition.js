import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for browser speech recognition using Web Speech API (window.SpeechRecognition / window.webkitSpeechRecognition).
 * Launches recognition synchronously in user click gesture for 100% reliable Chrome/Edge speech capture.
 */
export const useSpeechRecognition = ({ lang = 'en-IN', onFinalTranscript } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const isRecognitionRunningRef = useRef(false);
  const onFinalCallbackRef = useRef(onFinalTranscript);
  const langRef = useRef(lang);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    onFinalCallbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  // Check browser compatibility on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
    }
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current && isRecognitionRunningRef.current) {
      console.log("[Voice] Stopping recognition engine");
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("[Voice] Stop error:", e);
      }
    }
    isRecognitionRunningRef.current = false;
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    clearSilenceTimer();
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Synchronously start listening on click gesture for maximum Chrome compatibility
  const startListening = useCallback((overrideLang = null) => {
    console.log("[Voice] Mic button clicked - starting recognition synchronously");
    clearSilenceTimer();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Stop speech synthesis if playing so TTS audio output doesn't mute mic input
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    // Abort active session if running
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      isRecognitionRunningRef.current = false;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const targetLang = overrideLang || langRef.current || 'en-IN';
      recognition.lang = targetLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      console.log(`[Voice] Target recognition language: ${targetLang}`);

      setTranscript('');
      setInterimTranscript('');
      setError('');

      recognition.onstart = () => {
        console.log("[Voice] Recognition started successfully");
        isRecognitionRunningRef.current = true;
        setIsListening(true);
      };

      recognition.onaudiostart = () => {
        console.log("[Voice] Audio capture started - mic is listening");
      };

      recognition.onsoundstart = () => {
        console.log("[Voice] Sound detected in mic");
      };

      recognition.onspeechstart = () => {
        console.log("[Voice] Driver speech detected!");
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }

        const currentText = (final || interim).trim();
        console.log("[Voice] Interim transcript:", interim);
        console.log("[Voice] Final transcript:", final);

        if (interim) setInterimTranscript(interim);
        if (final.trim()) setTranscript(final.trim());

        if (currentText) {
          clearSilenceTimer();
          // Silence timeout buffer (2 seconds of silence after speaking triggers question submission)
          silenceTimerRef.current = setTimeout(() => {
            console.log("[Voice] Silence timeout reached, submitting final transcript");
            try { recognition.stop(); } catch (e) {}
            if (onFinalCallbackRef.current) {
              onFinalCallbackRef.current(currentText);
            }
          }, 2000);
        }
      };

      recognition.onerror = (event) => {
        console.warn("[Voice] Recognition error:", event.error);
        isRecognitionRunningRef.current = false;
        setIsListening(false);
        clearSilenceTimer();

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setError("Microphone permission denied. Please allow microphone access in your browser.");
        } else if (event.error === "audio-capture") {
          setError("No microphone was detected. Please check your device microphone.");
        }
      };

      recognition.onend = () => {
        console.log("[Voice] Recognition ended");
        isRecognitionRunningRef.current = false;
        setIsListening(false);
        clearSilenceTimer();
      };

      // Direct synchronous start call within click event handler
      recognition.start();
      isRecognitionRunningRef.current = true;
      setIsListening(true);

    } catch (err) {
      console.error("[Voice] Direct start exception:", err);
      isRecognitionRunningRef.current = false;
      setIsListening(false);

      // Request explicit getUserMedia permission fallback if direct start throws
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach(t => t.stop());
            try {
              recognitionRef.current.start();
              isRecognitionRunningRef.current = true;
              setIsListening(true);
            } catch (e) {
              console.error("[Voice] Retry start failed:", e);
            }
          })
          .catch((permErr) => {
            console.error("[Voice] Mic permission denied:", permErr);
            setError("Microphone permission denied. Please allow microphone access in your browser.");
          });
      }
    }
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
    setError
  };
};

export default useSpeechRecognition;
