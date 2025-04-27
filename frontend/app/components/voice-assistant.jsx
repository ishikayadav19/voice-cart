"use client"

import { useState, useEffect } from "react"
import { Mic, X, Volume2 } from "lucide-react"

const VoiceAssistant = ({ isActive, setIsActive, onCommand }) => {
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [recognition, setRecognition] = useState(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onstart = () => {
          setIsListening(true)
        }

        recognitionInstance.onresult = (event) => {
          const current = event.resultIndex
          const currentTranscript = event.results[current][0].transcript
          setTranscript(currentTranscript)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
          if (transcript) {
            // Process the command
            onCommand(transcript)

            // Provide feedback
            speakResponse(`I heard: ${transcript}`)

            // Reset transcript after processing
            setTimeout(() => {
              setTranscript("")
              setIsActive(false)
            }, 3000)
          }
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [])

  // Start listening when active
  useEffect(() => {
    if (isActive && recognition && !isListening) {
      try {
        recognition.start()
        setShowTooltip(true)
      } catch (error) {
        console.error("Failed to start recognition:", error)
      }
    } else if (!isActive && recognition && isListening) {
      recognition.stop()
      setShowTooltip(false)
    }
  }, [isActive, recognition, isListening])

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
