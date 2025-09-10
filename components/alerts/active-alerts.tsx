"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Bell, AlertTriangle, Info, Zap, X, Eye, MessageSquare, Phone } from "lucide-react"

interface Alert {
  id: string
  alert_type: string
  severity: string
  title: string
  message: string
  location?: string
  affected_species?: string[]
  action_required: boolean
  is_read: boolean
  created_at: string
  expires_at?: string
}

interface ActiveAlertsProps {
  farmerId: string
}

export function ActiveAlerts({ farmerId }: ActiveAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchActiveAlerts = async () => {
      const supabase = createClient()

      let query = supabase
        .from("alerts")
        .select("*")
        .or(`farmer_id.eq.${farmerId},farmer_id.is.null`)
        .order("created_at", { ascending: false })

      if (filter !== "all") {
        query = query.eq("severity", filter)
      }

      const { data } = await query

      if (data) {
        // Filter out expired alerts
        const activeAlerts = data.filter((alert) => {
          if (!alert.expires_at) return true
          return new Date(alert.expires_at) > new Date()
        })
        setAlerts(activeAlerts)
      }
      setIsLoading(false)
    }

    fetchActiveAlerts()
  }, [farmerId, filter])

  const markAsRead = async (alertId: string) => {
    const supabase = createClient()
    await supabase.from("alerts").update({ is_read: true }).eq("id", alertId)

    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, is_read: true } : alert)))
  }

  const dismissAlert = async (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "emergency":
        return <Zap className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "emergency":
        return "border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "info":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
      case "emergency":
        return <Badge className="bg-red-100 text-red-700">Critical</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-700">Info</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">{severity}</Badge>
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "disease_outbreak":
        return "🦠"
      case "vaccination_due":
        return "💉"
      case "health_checkup":
        return "🩺"
      case "weather":
        return "🌤️"
      case "market_price":
        return "💰"
      case "regulatory":
        return "📋"
      default:
        return "📢"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Active Alerts
        </CardTitle>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
          >
            Critical
          </Button>
          <Button variant={filter === "warning" ? "default" : "outline"} size="sm" onClick={() => setFilter("warning")}>
            Warning
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} ${
                  !alert.is_read ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      <span className="text-lg">{getAlertTypeIcon(alert.alert_type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        {getSeverityBadge(alert.severity)}
                        {!alert.is_read && <Badge className="bg-accent/10 text-accent">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>{format(new Date(alert.created_at), "MMM dd, HH:mm")}</span>
                        {alert.location && <span>Location: {alert.location}</span>}
                        {alert.affected_species && <span>Species: {alert.affected_species.join(", ")}</span>}
                      </div>
                      {alert.action_required && (
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-destructive/10 text-destructive">Action Required</Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 gap-1 bg-transparent">
                              <MessageSquare className="h-3 w-3" />
                              SMS
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 gap-1 bg-transparent">
                              <Phone className="h-3 w-3" />
                              Call
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!alert.is_read && (
                      <Button size="sm" variant="ghost" onClick={() => markAsRead(alert.id)} className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
