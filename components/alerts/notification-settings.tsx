"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Settings, Bell, MessageSquare, Phone, Mail, Save } from "lucide-react"

interface NotificationSettingsProps {
  farmerId: string
}

interface NotificationPreferences {
  app_notifications: boolean
  sms_notifications: boolean
  whatsapp_notifications: boolean
  email_notifications: boolean
  critical_alerts: boolean
  warning_alerts: boolean
  info_alerts: boolean
  disease_outbreak: boolean
  vaccination_due: boolean
  health_checkup: boolean
  weather_alerts: boolean
  market_price: boolean
  regulatory_updates: boolean
}

export function NotificationSettings({ farmerId }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app_notifications: true,
    sms_notifications: false,
    whatsapp_notifications: false,
    email_notifications: false,
    critical_alerts: true,
    warning_alerts: true,
    info_alerts: true,
    disease_outbreak: true,
    vaccination_due: true,
    health_checkup: true,
    weather_alerts: true,
    market_price: false,
    regulatory_updates: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch user preferences from the database
    setIsLoading(false)
  }, [farmerId])

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const savePreferences = async () => {
    setIsSaving(true)
    // In a real app, you would save preferences to the database
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Notification Settings
        </CardTitle>
        <Button onClick={savePreferences} disabled={isSaving} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Delivery Methods
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="app-notifications">App Notifications</Label>
                <Badge className="bg-green-100 text-green-700 text-xs">Free</Badge>
              </div>
              <Switch
                id="app-notifications"
                checked={preferences.app_notifications}
                onCheckedChange={(value) => handlePreferenceChange("app_notifications", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Badge className="bg-blue-100 text-blue-700 text-xs">Premium</Badge>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.sms_notifications}
                onCheckedChange={(value) => handlePreferenceChange("sms_notifications", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="whatsapp-notifications">WhatsApp</Label>
                <Badge className="bg-green-100 text-green-700 text-xs">Premium</Badge>
              </div>
              <Switch
                id="whatsapp-notifications"
                checked={preferences.whatsapp_notifications}
                onCheckedChange={(value) => handlePreferenceChange("whatsapp_notifications", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications">Email</Label>
                <Badge className="bg-gray-100 text-gray-700 text-xs">Free</Badge>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.email_notifications}
                onCheckedChange={(value) => handlePreferenceChange("email_notifications", value)}
              />
            </div>
          </div>
        </div>

        {/* Alert Severity */}
        <div>
          <h4 className="font-medium mb-3">Alert Severity</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="critical-alerts" className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Critical Alerts
              </Label>
              <Switch
                id="critical-alerts"
                checked={preferences.critical_alerts}
                onCheckedChange={(value) => handlePreferenceChange("critical_alerts", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="warning-alerts" className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Warning Alerts
              </Label>
              <Switch
                id="warning-alerts"
                checked={preferences.warning_alerts}
                onCheckedChange={(value) => handlePreferenceChange("warning_alerts", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="info-alerts" className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Info Alerts
              </Label>
              <Switch
                id="info-alerts"
                checked={preferences.info_alerts}
                onCheckedChange={(value) => handlePreferenceChange("info_alerts", value)}
              />
            </div>
          </div>
        </div>

        {/* Alert Types */}
        <div>
          <h4 className="font-medium mb-3">Alert Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="disease-outbreak">Disease Outbreak</Label>
              <Switch
                id="disease-outbreak"
                checked={preferences.disease_outbreak}
                onCheckedChange={(value) => handlePreferenceChange("disease_outbreak", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="vaccination-due">Vaccination Due</Label>
              <Switch
                id="vaccination-due"
                checked={preferences.vaccination_due}
                onCheckedChange={(value) => handlePreferenceChange("vaccination_due", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="health-checkup">Health Checkup</Label>
              <Switch
                id="health-checkup"
                checked={preferences.health_checkup}
                onCheckedChange={(value) => handlePreferenceChange("health_checkup", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weather-alerts">Weather Alerts</Label>
              <Switch
                id="weather-alerts"
                checked={preferences.weather_alerts}
                onCheckedChange={(value) => handlePreferenceChange("weather_alerts", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="market-price">Market Price Updates</Label>
              <Switch
                id="market-price"
                checked={preferences.market_price}
                onCheckedChange={(value) => handlePreferenceChange("market_price", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="regulatory-updates">Regulatory Updates</Label>
              <Switch
                id="regulatory-updates"
                checked={preferences.regulatory_updates}
                onCheckedChange={(value) => handlePreferenceChange("regulatory_updates", value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
