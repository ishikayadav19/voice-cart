"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, X, Volume2 } from "lucide-react"
import useVoiceContext from "@/context/voiceContext";

const VoiceAssistant = ({ isActive: isActiveProp, setIsActive: setIsActiveProp, onCommand }) => {
  const [internalActive, setInternalActive] = useState(false);
  const isActive = isActiveProp !== undefined ? isActiveProp : internalActive;
  const setIsActive = setIsActiveProp !== undefined ? setIsActiveProp : setInternalActive;
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const { interpretVoiceCommand, resetTranscript } = useVoiceContext();
  const lastDispatchedRef = useRef("");
  const isActiveRef = useRef(isActive);
  const recognitionRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);

  // Initialize speech recognition.
  // We keep the recognition instance as a window-level singleton so React
  // StrictMode (which double-mounts effects in dev) doesn't create two
  // competing recognitions fighting for the same mic stream.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (!window.__VC_RECOGNITION__) {
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-US";
      window.__VC_RECOGNITION__ = r;
    }
    const recognitionInstance = window.__VC_RECOGNITION__;

    {
      // Block scope so the old per-mount const-style code below works unchanged.

        recognitionInstance.onstart = () => {
          setIsListening(true)
        }

        recognitionInstance.onresult = (event) => {
          let finalText = "";
          let interimText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const r = event.results[i];
            if (r.isFinal) finalText += r[0].transcript;
            else interimText += r[0].transcript;
          }
          setTranscript(finalText || interimText);
          if (!finalText) return;
          // Ignore mic input while TTS is speaking, to avoid echo loops where
          // the assistant hears its own response. Use our own time-bounded flag
          // (set by voiceResponse) — speechSynthesis.speaking can get stuck true
          // in Chrome and would otherwise silently kill the mic.
          if (typeof window !== "undefined" && window.__VC_SPEAKING_UNTIL__ &&
              Date.now() < window.__VC_SPEAKING_UNTIL__) return;
          const normalized = finalText.trim().toLowerCase();
          if (!normalized || normalized === lastDispatchedRef.current) return;
          lastDispatchedRef.current = normalized;
          console.log('Recognized Voice Command (final):', finalText);
          interpretVoiceCommand(finalText);
          // Allow the same phrase to be spoken again after a short gap.
          setTimeout(() => {
            if (lastDispatchedRef.current === normalized) lastDispatchedRef.current = "";
          }, 1500);
        }

        let backoffTimer = null;
        let lastErrorRef = null;

        const tryRestart = () => {
          if (!isActiveRef.current || !recognitionRef.current) return;
          try {
            recognitionRef.current.start();
            console.log('[voice] restart ok');
          } catch (e) {
            if (e?.name !== 'InvalidStateError') {
              console.warn('[voice] restart threw:', e?.name, e?.message);
            }
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          lastDispatchedRef.current = "";

          if (!isActiveRef.current) {
            setTranscript("");
            return;
          }

          // Chrome's continuous mode periodically ends on its own (silence /
          // network blips). We just restart fast — minimal gap so speech is
          // not lost between cycles.
          if (backoffTimer) clearTimeout(backoffTimer);
          backoffTimer = setTimeout(tryRestart, 80);
        }

        recognitionInstance.onerror = (event) => {
          lastErrorRef = event.error;
          // Terminal errors → permission denied or no mic, give up
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            console.error("[voice] mic permission denied:", event.error);
            isActiveRef.current = false;
            setIsActive(false);
            return;
          }
          // "no-speech", "aborted", "audio-capture", "network" → recoverable.
          // Don't log the noisy "aborted" — it's the normal end-of-phrase signal in continuous mode.
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            console.warn("[voice] recoverable error:", event.error);
          }
          setIsListening(false);
        }

      recognitionRef.current = recognitionInstance;
      setRecognition(recognitionInstance);
    }

    return () => {
      // Don't abort on cleanup. StrictMode would unmount-then-remount in dev
      // and aborting here would just create a restart loop with the new mount.
      // We DO detach handlers so stale closures from this mount stop firing.
      if (recognitionInstance) {
        recognitionInstance.onstart = null;
        recognitionInstance.onresult = null;
        recognitionInstance.onend = null;
        recognitionInstance.onerror = null;
      }
    }
  }, [])

  // Listen for explicit voice deactivation from dispatcher (FAREWELL / STOP_LISTENING)
  // and toggle from the global Ctrl+Space shortcut.
  useEffect(() => {
    const handleDeactivate = () => {
      isActiveRef.current = false;
      setIsActive(false);
    };
    const handleToggle = () => {
      const next = !isActiveRef.current;
      isActiveRef.current = next;
      setIsActive(next);
    };
    window.addEventListener('voice:deactivate', handleDeactivate);
    window.addEventListener('voice:toggle', handleToggle);
    return () => {
      window.removeEventListener('voice:deactivate', handleDeactivate);
      window.removeEventListener('voice:toggle', handleToggle);
    };
  }, [setIsActive]);

  // Start/stop listening when isActive flips. Do NOT depend on isListening —
  // the recognition lifecycle (start/onend/restart) is owned by onend+tryRestart.
  // Including isListening here creates a race: every onend → setIsListening(false)
  // would re-run this effect and call start() while tryRestart's setTimeout is
  // also pending, producing InvalidStateError + aborted loops.
  useEffect(() => {
    if (!recognition) return;
    if (isActive) {
      lastDispatchedRef.current = "";
      try {
        recognition.start();
        hasStartedRef.current = true;
        setShowTooltip(true);
        console.log('[voice] mic activated');
      } catch (e) {
        // InvalidStateError = already running; ignore. Anything else: log once.
        if (e?.name !== 'InvalidStateError') console.error("[voice] start() failed:", e);
      }
    } else {
      // Only stop if we've ever started — calling stop() on a never-started
      // recognition can leave it in a stuck state on some Chrome versions.
      if (hasStartedRef.current) {
        try { recognition.stop(); } catch (e) {}
        console.log('[voice] mic deactivated');
      }
      setShowTooltip(false);
    }
  }, [isActive, recognition]);

  // Speak response using speech synthesis
  const speakResponse = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  // Example commands to show in the tooltip
  const exampleCommands = ["Search for headphones", "Go to electronics", "Add to cart", "Show my wishlist"]

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsActive(!isActive)}
        className={`rounded-full p-4 shadow-lg transition-all duration-300 ${
          isActive ? "bg-rose-600 text-white animate-pulse" : "bg-white text-rose-600 hover:bg-rose-50"
        }`}
      >
        {isActive ? <X size={24} /> : <Mic size={24} />}
      </button>

      {/* Tooltip/Modal */}
      {showTooltip && (
        <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Voice Assistant</h3>
            <button
              onClick={() => {
                setIsActive(false)
                setShowTooltip(false)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>

          {/* Listening Animation */}
          <div className="flex justify-center mb-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-rose-100 ${isListening ? "animate-ping-slow" : ""}`}
              ></div>
              <Mic size={24} className="text-rose-600 z-10" />
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-gray-100 rounded-md p-2 mb-3 min-h-[40px] text-center">
            {transcript ? (
              <p className="text-gray-800">{transcript}</p>
            ) : (
              <p className="text-gray-500 italic">Listening...</p>
            )}
          </div>

          {/* Example Commands */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">Try saying:</p>
            <ul className="text-xs text-gray-700 space-y-1">
              {exampleCommands.map((command, index) => (
                <li key={index} className="flex items-center">
                  <Volume2 size={10} className="text-rose-500 mr-1" />"{command}"
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoiceAssistant
