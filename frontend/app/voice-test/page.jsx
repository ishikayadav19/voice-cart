"use client";

import { useState, useEffect } from 'react'
import { Mic, X, Volume2, CheckCircle, AlertCircle } from 'lucide-react'

export default function VoiceTestPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [recognition, setRecognition] = useState(null)
  const [browserSupport, setBrowserSupport] = useState(null)
  const [microphoneAccess, setMicrophoneAccess] = useState(null)
  const [testResults, setTestResults] = useState([])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      const support = {
        SpeechRecognition: !!window.SpeechRecognition,
        webkitSpeechRecognition: !!window.webkitSpeechRecognition,
        supported: !!SpeechRecognition
      }
      
      setBrowserSupport(support)
      addTestResult("Browser Support", support.supported ? "✅ Supported" : "❌ Not Supported", support)

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        recognitionInstance.onstart = () => {
          console.log("Speech recognition started")
          setIsListening(true)
          setTranscript("")
          setFinalTranscript("")
          addTestResult("Recognition Start", "✅ Started successfully", null)
        }

        recognitionInstance.onresult = (event) => {
          console.log("Speech recognition result event:", event)
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            const isFinal = event.results[i].isFinal
            console.log(`Result ${i}:`, { transcript, isFinal })
            
            if (isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(interimTranscript)
          setFinalTranscript(finalTranscript)
          
          if (finalTranscript) {
            addTestResult("Voice Recognition", `✅ Heard: "${finalTranscript}"`, finalTranscript)
          }
        }

        recognitionInstance.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
          addTestResult("Recognition End", "✅ Ended normally", null)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error, event)
          setIsListening(false)
          addTestResult("Recognition Error", `❌ ${event.error}`, event.error)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  // Test microphone access
  const testMicrophone = async () => {
    try {
      console.log("Testing microphone access...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("Microphone access granted:", stream)
      setMicrophoneAccess(true)
      addTestResult("Microphone Access", "✅ Granted", stream)
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error("Microphone access denied:", error)
      setMicrophoneAccess(false)
      addTestResult("Microphone Access", `❌ Denied: ${error.message}`, error)
    }
  }

  // Start listening
  const startListening = () => {
    if (recognition) {
      try {
        recognition.start()
        addTestResult("Manual Start", "✅ Attempted to start", null)
      } catch (error) {
        console.error("Failed to start recognition:", error)
        addTestResult("Manual Start", `❌ Failed: ${error.message}`, error)
      }
    }
  }

  // Stop listening
  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop()
        addTestResult("Manual Stop", "✅ Attempted to stop", null)
      } catch (error) {
        console.error("Failed to stop recognition:", error)
        addTestResult("Manual Stop", `❌ Failed: ${error.message}`, error)
      }
    }
  }

  // Add test result
  const addTestResult = (test, result, details) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      result,
      details,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  // Clear test results
  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Voice Recognition Test</h1>
          
          {/* Browser Support */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Browser Support</h2>
            {browserSupport && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-3 rounded">
                  <div className="font-medium">SpeechRecognition</div>
                  <div className={browserSupport.SpeechRecognition ? "text-green-600" : "text-red-600"}>
                    {browserSupport.SpeechRecognition ? "✅ Available" : "❌ Not Available"}
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <div className="font-medium">webkitSpeechRecognition</div>
                  <div className={browserSupport.webkitSpeechRecognition ? "text-green-600" : "text-red-600"}>
                    {browserSupport.webkitSpeechRecognition ? "✅ Available" : "❌ Not Available"}
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <div className="font-medium">Overall Support</div>
                  <div className={browserSupport.supported ? "text-green-600" : "text-red-600"}>
                    {browserSupport.supported ? "✅ Supported" : "❌ Not Supported"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Test Controls</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={testMicrophone}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Test Microphone Access
              </button>
              <button
                onClick={startListening}
                disabled={isListening}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Start Listening
              </button>
              <button
                onClick={stopListening}
                disabled={!isListening}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Stop Listening
              </button>
              <button
                onClick={clearResults}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Current Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <div className="font-medium">Listening Status</div>
                <div className={`flex items-center gap-2 ${isListening ? "text-green-600" : "text-gray-600"}`}>
                  {isListening ? <CheckCircle size={16} /> : <X size={16} />}
                  {isListening ? "Listening" : "Not Listening"}
                </div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="font-medium">Microphone Access</div>
                <div className={`flex items-center gap-2 ${microphoneAccess === true ? "text-green-600" : microphoneAccess === false ? "text-red-600" : "text-gray-600"}`}>
                  {microphoneAccess === true ? <CheckCircle size={16} /> : microphoneAccess === false ? <AlertCircle size={16} /> : <X size={16} />}
                  {microphoneAccess === true ? "Granted" : microphoneAccess === false ? "Denied" : "Not Tested"}
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Voice Input</h2>
            <div className="bg-gray-100 p-4 rounded min-h-[100px]">
              {transcript ? (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Interim:</div>
                  <div className="text-gray-800">{transcript}</div>
                </div>
              ) : (
                <div className="text-gray-500 italic">No voice input detected...</div>
              )}
              {finalTranscript && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="text-sm text-gray-500 mb-2">Final:</div>
                  <div className="text-gray-800 font-medium">{finalTranscript}</div>
                </div>
              )}
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Test Results</h2>
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500 italic">No test results yet...</div>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result) => (
                    <div key={result.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{result.test}</div>
                          <div className="text-sm">{result.result}</div>
                        </div>
                        <div className="text-xs text-gray-500">{result.timestamp}</div>
                      </div>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer">View Details</summary>
                          <pre className="text-xs bg-gray-50 p-2 mt-1 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 