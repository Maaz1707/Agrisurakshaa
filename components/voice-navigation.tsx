"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2, VolumeX, X, HelpCircle, Settings, Zap, Clock, CheckCircle } from "lucide-react"

interface VoiceNavigationProps {
  onVoiceCommand?: (command: string) => void
}

export function VoiceNavigation({ onVoiceCommand }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognitionTimeout, setRecognitionTimeout] = useState<NodeJS.Timeout | null>(null)
  const [speechLevel, setSpeechLevel] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
    }
    
    // Load command history from localStorage
    const savedHistory = localStorage.getItem('voice-command-history')
    if (savedHistory) {
      setCommandHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    // Save command history to localStorage
    if (commandHistory.length > 0) {
      localStorage.setItem('voice-command-history', JSON.stringify(commandHistory))
    }
  }, [commandHistory])

  useEffect(() => {
    // Auto-expand when listening
    if (isListening) {
      setIsExpanded(true)
    }
  }, [isListening])

  const startListening = () => {
    if (!isSupported) {
      console.warn('Speech recognition not supported in this browser')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 3

      recognition.onstart = () => {
        setIsListening(true)
        setIsProcessing(false)
        setSpeechLevel(0)
        
        // Set timeout for recognition
        const timeout = setTimeout(() => {
          if (isListening) {
            recognition.stop()
          }
        }, 10000) // 10 second timeout
        setRecognitionTimeout(timeout)
        
        if (isVoiceEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Listening for your command")
          utterance.rate = 0.8
          speechSynthesis.speak(utterance)
        }
      }

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase().trim()
        const confidence = event.results[0][0].confidence
        
        // Update speech level based on confidence
        setSpeechLevel(confidence * 100)
        
        if (event.results[0].isFinal) {
          setLastCommand(command)
          setIsProcessing(true)
          
          // Add to command history
          setCommandHistory(prev => [command, ...prev.slice(0, 9)]) // Keep last 10 commands
          
          if (isVoiceEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Command received: ${command}`)
            utterance.rate = 0.8
            speechSynthesis.speak(utterance)
          }

          // Process voice commands
          handleVoiceCommand(command)
          onVoiceCommand?.(command)
          
          // Clear processing state after a delay
          setTimeout(() => {
            setIsProcessing(false)
          }, 1000)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsProcessing(false)
        setSpeechLevel(0)
        
        // Clear timeout
        if (recognitionTimeout) {
          clearTimeout(recognitionTimeout)
          setRecognitionTimeout(null)
        }
        
        // Provide user feedback for common errors
        if (isVoiceEnabled && 'speechSynthesis' in window) {
          let errorMessage = "Speech recognition error occurred"
          if (event.error === 'no-speech') {
            errorMessage = "No speech detected. Please try again."
          } else if (event.error === 'audio-capture') {
            errorMessage = "Microphone not available. Please check your microphone."
          } else if (event.error === 'not-allowed') {
            errorMessage = "Microphone access denied. Please allow microphone access."
          }
          
          const utterance = new SpeechSynthesisUtterance(errorMessage)
          utterance.rate = 0.8
          speechSynthesis.speak(utterance)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        setIsProcessing(false)
        setSpeechLevel(0)
        
        // Clear timeout
        if (recognitionTimeout) {
          clearTimeout(recognitionTimeout)
          setRecognitionTimeout(null)
        }
      }

      recognition.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setIsListening(false)
      setIsProcessing(false)
    }
  }

  const handleVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command)
    
    // Voice command processing with better matching
    if (command.includes('add animal') || command.includes('add livestock') || command.includes('new animal')) {
      // Trigger add livestock dialog
      const addButton = document.querySelector('[data-voice-trigger="add-livestock"]') as HTMLElement
      if (addButton) {
        addButton.click()
        console.log('Triggered add livestock dialog')
      } else {
        console.warn('Add livestock button not found')
      }
    } else if (command.includes('health record') || command.includes('add record') || command.includes('health check')) {
      // Trigger add health record dialog
      const addButton = document.querySelector('[data-voice-trigger="add-health-record"]') as HTMLElement
      if (addButton) {
        addButton.click()
        console.log('Triggered add health record dialog')
      } else {
        console.warn('Add health record button not found')
      }
    } else if (command.includes('create alert') || command.includes('add alert') || command.includes('new alert')) {
      // Trigger create alert dialog
      const addButton = document.querySelector('[data-voice-trigger="add-alert"]') as HTMLElement
      if (addButton) {
        addButton.click()
        console.log('Triggered add alert dialog')
      } else {
        console.warn('Add alert button not found')
      }
    } else if (command.includes('generate report') || command.includes('create report') || command.includes('new report')) {
      // Trigger generate report dialog
      const addButton = document.querySelector('[data-voice-trigger="generate-report"]') as HTMLElement
      if (addButton) {
        addButton.click()
        console.log('Triggered generate report dialog')
      } else {
        console.warn('Generate report button not found')
      }
    } else if (command.includes('dashboard') || command.includes('home') || command.includes('main page')) {
      // Navigate to dashboard
      console.log('Navigating to dashboard')
      window.location.href = '/farmer/dashboard'
    } else if (command.includes('education') || command.includes('learn') || command.includes('courses')) {
      // Navigate to education
      console.log('Navigating to education')
      window.location.href = '/farmer/education'
    } else if (command.includes('risk assessment') || command.includes('assessment') || command.includes('risk')) {
      // Navigate to risk assessment
      console.log('Navigating to risk assessment')
      window.location.href = '/farmer/risk-assessment'
    } else if (command.includes('alerts') || command.includes('notifications') || command.includes('alert')) {
      // Navigate to alerts
      console.log('Navigating to alerts')
      window.location.href = '/farmer/alerts'
    } else if (command.includes('reports') || command.includes('analytics') || command.includes('report')) {
      // Navigate to reports
      console.log('Navigating to reports')
      window.location.href = '/farmer/reports'
    } else if (command.includes('sidebar') || command.includes('menu') || command.includes('navigation')) {
      // Toggle sidebar (mobile)
      const menuButton = document.querySelector('[data-menu-button]') as HTMLElement
      if (menuButton) {
        menuButton.click()
        console.log('Toggled sidebar menu')
      } else {
        console.warn('Menu button not found')
      }
    } else {
      // Command not recognized
      console.log('Command not recognized:', command)
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Command not recognized. Please try again.")
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    }
  }

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (!isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Voice feedback enabled")
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const speakWelcome = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Welcome to the Digital Biosecurity Portal. You can use voice commands to navigate and perform actions.")
      utterance.rate = 0.7
      speechSynthesis.speak(utterance)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (recognitionTimeout) {
      clearTimeout(recognitionTimeout)
      setRecognitionTimeout(null)
    }
    setIsListening(false)
    setIsProcessing(false)
  }

  const clearHistory = () => {
    setCommandHistory([])
    localStorage.removeItem('voice-command-history')
  }

  const getCommandSuggestions = () => {
    const suggestions = [
      { command: "add animal", description: "Open livestock form", icon: "🐄" },
      { command: "health record", description: "Add health record", icon: "🏥" },
      { command: "create alert", description: "Add new alert", icon: "⚠️" },
      { command: "generate report", description: "Create report", icon: "📊" },
      { command: "dashboard", description: "Go to dashboard", icon: "🏠" },
      { command: "education", description: "Go to learning", icon: "📚" },
      { command: "alerts", description: "Go to notifications", icon: "🔔" },
      { command: "reports", description: "Go to analytics", icon: "📈" },
      { command: "risk assessment", description: "Go to assessment", icon: "🛡️" },
      { command: "sidebar", description: "Toggle menu", icon: "📱" }
    ]
    return suggestions
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Voice Button */}
      <div className="relative">
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${
            isListening 
              ? "bg-red-500 hover:bg-red-600 animate-pulse" 
              : isProcessing
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-110"
          }`}
        >
          {isProcessing ? (
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full"></div>
          ) : isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        {/* Status Indicators */}
        {isListening && (
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full animate-ping"></div>
        )}
        {isProcessing && (
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-500 rounded-full animate-pulse"></div>
        )}
        
        {/* Speech Level Indicator */}
        {isListening && speechLevel > 0 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-100 rounded-full"
                style={{ width: `${speechLevel}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-20 right-0 flex flex-col gap-2">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setShowHelp(!showHelp)}
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-50"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Voice Assistant</h3>
                  <p className="text-emerald-100 text-sm">
                    {isListening ? "Listening..." : isProcessing ? "Processing..." : "Ready to help"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleVoice}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  {isVoiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {/* Status and Last Command */}
            {lastCommand && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">Last Command</span>
                </div>
                <p className="text-emerald-700 font-medium">"{lastCommand}"</p>
                {speechLevel > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-emerald-600 mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(speechLevel)}%</span>
                    </div>
                    <Progress value={speechLevel} className="h-2" />
                  </div>
                )}
              </div>
            )}

            {/* Command History */}
            {commandHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Commands
                  </h4>
                  <Button
                    onClick={clearHistory}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {commandHistory.slice(0, 5).map((cmd, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleVoiceCommand(cmd)}
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">"{cmd}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Commands */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Commands
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {getCommandSuggestions().slice(0, 6).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-10 hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-2"
                    onClick={() => handleVoiceCommand(suggestion.command)}
                  >
                    <span className="text-base">{suggestion.icon}</span>
                    <span className="truncate">{suggestion.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* All Commands */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">All Commands</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {getCommandSuggestions().map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{suggestion.icon}</span>
                      <span className="text-xs text-gray-600">"{suggestion.command}"</span>
                    </div>
                    <span className="text-xs text-emerald-600">→ {suggestion.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <Button
                onClick={speakWelcome}
                variant="outline"
                size="sm"
                className="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Welcome
              </Button>
              <Button
                onClick={() => setShowHelp(true)}
                variant="outline"
                size="sm"
                className="flex-1 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Voice Commands Help</h3>
                <Button
                  onClick={() => setShowHelp(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {getCommandSuggestions().map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">"{suggestion.command}"</div>
                      <div className="text-sm text-gray-600">{suggestion.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Tips:</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Speak clearly and at normal volume</li>
                  <li>• Wait for the "Listening..." indicator</li>
                  <li>• Commands are case-insensitive</li>
                  <li>• You can also click the quick command buttons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
