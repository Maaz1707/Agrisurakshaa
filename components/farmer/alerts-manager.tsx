"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Bell, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface Alert {
  id: string
  title: string
  message: string
  alert_type: string
  severity: string
  is_read: boolean
  action_required: boolean
  created_at: string
  farmer_id: string
}

interface AlertsManagerProps {
  farmerId: string
}

export function AlertsManager({ farmerId }: AlertsManagerProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    alertType: "",
    severity: ""
  })

  useEffect(() => {
    const fetchAlerts = async () => {
      // Mock alerts data
      const mockAlerts: Alert[] = [
        {
          id: "1",
          title: "Vaccination Due",
          message: "Annual vaccination is due for 15 chickens in batch CHK-001",
          alert_type: "vaccination_due",
          severity: "warning",
          is_read: false,
          action_required: true,
          created_at: "2025-01-08T09:00:00Z",
          farmer_id: farmerId
        },
        {
          id: "2",
          title: "Health Checkup Reminder",
          message: "Scheduled health checkup for pigs PIG001-PIG005 is due tomorrow",
          alert_type: "health_checkup",
          severity: "info",
          is_read: false,
          action_required: false,
          created_at: "2025-01-07T14:30:00Z",
          farmer_id: farmerId
        },
        {
          id: "3",
          title: "Weather Alert",
          message: "Heavy rain expected in your area. Ensure proper shelter for livestock.",
          alert_type: "weather",
          severity: "critical",
          is_read: true,
          action_required: true,
          created_at: "2025-01-06T16:45:00Z",
          farmer_id: farmerId
        },
        {
          id: "4",
          title: "Market Price Update",
          message: "Current market price for pigs: ₹180/kg (up 5% from last week)",
          alert_type: "market_price",
          severity: "info",
          is_read: true,
          action_required: false,
          created_at: "2025-01-05T11:20:00Z",
          farmer_id: farmerId
        }
      ]

      // Simulate API call
      setTimeout(() => {
        setAlerts(mockAlerts)
        setIsLoading(false)
      }, 1000)
    }

    fetchAlerts()
  }, [farmerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call with voice feedback
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Voice feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Alert created successfully: ${formData.title}`)
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }

      // Add new alert to mock data
      const newAlert: Alert = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        alert_type: formData.alertType,
        severity: formData.severity,
        is_read: false,
        action_required: formData.severity === "critical" || formData.severity === "emergency",
        created_at: new Date().toISOString(),
        farmer_id: farmerId
      }

      setAlerts(prev => [newAlert, ...prev])

      // Reset form
      setFormData({
        title: "",
        message: "",
        alertType: "",
        severity: ""
      })
      
      setIsDialogOpen(false)
    } catch (error: any) {
      setError("Failed to create alert")
    } finally {
      setIsSubmitting(false)
    }
  }

  const markAlertAsRead = async (alertId: string) => {
    // Voice feedback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Alert marked as read")
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }

    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, is_read: true } : alert
    ))
  }

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      info: { color: "bg-blue-100 text-blue-700", label: "Info" },
      warning: { color: "bg-yellow-100 text-yellow-700", label: "Warning" },
      critical: { color: "bg-orange-100 text-orange-700", label: "Critical" },
      emergency: { color: "bg-red-100 text-red-700", label: "Emergency" }
    }
    
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "emergency":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Bell className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Alerts
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-voice-trigger="add-alert">
              <Plus className="h-4 w-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Sick Animal Detected"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertType">Alert Type *</Label>
                <Select value={formData.alertType} onValueChange={(value) => setFormData({...formData, alertType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disease_outbreak">Disease Outbreak</SelectItem>
                    <SelectItem value="vaccination_due">Vaccination Due</SelectItem>
                    <SelectItem value="health_checkup">Health Checkup</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="market_price">Market Price</SelectItem>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe the alert in detail..."
                  rows={4}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Alert"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts found</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first alert to start monitoring</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 rounded-lg border border-border">
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-primary/10 p-2 rounded-lg mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      {getSeverityBadge(alert.severity)}
                      {alert.action_required && (
                        <Badge className="bg-red-100 text-red-700">Action Required</Badge>
                      )}
                      {alert.is_read && (
                        <Badge className="bg-gray-100 text-gray-700">Read</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(alert.created_at)} • {alert.alert_type}
                    </p>
                  </div>
                </div>
                {!alert.is_read && (
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAlertAsRead(alert.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Read
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
