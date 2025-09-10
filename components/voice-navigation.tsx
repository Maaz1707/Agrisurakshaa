"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface VoiceNavigationProps {
  onVoiceCommand?: (command: string) => void
}

export function VoiceNavigation({ onVoiceCommand }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
    }
  }, [])

  const startListening = () => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Listening for your command")
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    }

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase()
      setLastCommand(command)
      
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Command received: ${command}`)
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }

      // Process voice commands
      handleVoiceCommand(command)
      onVoiceCommand?.(command)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleVoiceCommand = (command: string) => {
    // Voice command processing
    if (command.includes('add animal') || command.includes('add livestock')) {
      // Trigger add livestock dialog
      const addButton = document.querySelector('[data-voice-trigger="add-livestock"]') as HTMLElement
      if (addButton) addButton.click()
    } else if (command.includes('health record') || command.includes('add record')) {
      // Trigger add health record dialog
      const addButton = document.querySelector('[data-voice-trigger="add-health-record"]') as HTMLElement
      if (addButton) addButton.click()
    } else if (command.includes('create alert') || command.includes('add alert')) {
      // Trigger create alert dialog
      const addButton = document.querySelector('[data-voice-trigger="add-alert"]') as HTMLElement
      if (addButton) addButton.click()
    } else if (command.includes('generate report') || command.includes('create report')) {
      // Trigger generate report dialog
      const addButton = document.querySelector('[data-voice-trigger="generate-report"]') as HTMLElement
      if (addButton) addButton.click()
    } else if (command.includes('dashboard') || command.includes('home')) {
      // Navigate to dashboard
      window.location.href = '/farmer/dashboard'
    } else if (command.includes('education') || command.includes('learn')) {
      // Navigate to education
      window.location.href = '/farmer/education'
    } else if (command.includes('risk assessment') || command.includes('assessment')) {
      // Navigate to risk assessment
      window.location.href = '/farmer/risk-assessment'
    } else if (command.includes('alerts') || command.includes('notifications')) {
      // Navigate to alerts
      window.location.href = '/farmer/alerts'
    } else if (command.includes('reports') || command.includes('analytics')) {
      // Navigate to reports
      window.location.href = '/farmer/reports'
    } else if (command.includes('sidebar') || command.includes('menu')) {
      // Toggle sidebar (mobile)
      const menuButton = document.querySelector('[data-menu-button]') as HTMLElement
      if (menuButton) menuButton.click()
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

  if (!isSupported) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Mic className="h-4 w-4" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={startListening}
            disabled={isListening}
            className="flex-1 gap-2"
            variant={isListening ? "destructive" : "default"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Listening..." : "Start Voice"}
          </Button>
          <Button
            onClick={toggleVoice}
            variant="outline"
            size="sm"
          >
            {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
        
        {lastCommand && (
          <div className="text-xs text-muted-foreground">
            Last command: "{lastCommand}"
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Voice Commands:</p>
          <ul className="space-y-1 text-xs">
            <li>• "Add animal" - Open livestock form</li>
            <li>• "Health record" - Add health record</li>
            <li>• "Create alert" - Add new alert</li>
            <li>• "Generate report" - Create report</li>
            <li>• "Dashboard" - Go to dashboard</li>
            <li>• "Education" - Go to learning</li>
            <li>• "Alerts" - Go to notifications</li>
            <li>• "Reports" - Go to analytics</li>
            <li>• "Risk assessment" - Go to assessment</li>
            <li>• "Sidebar" - Toggle menu</li>
          </ul>
        </div>

        <Button
          onClick={speakWelcome}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Volume2 className="h-3 w-3 mr-1" />
          Welcome Message
        </Button>
      </CardContent>
    </Card>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
