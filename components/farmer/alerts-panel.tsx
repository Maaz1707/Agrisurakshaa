"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { AlertTriangle, Bell, CheckCircle, X } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface Alert {
  id: string
  alert_type: string
  severity: string
  title: string
  message: string
  created_at: string
  is_read: boolean
}

interface AlertsPanelProps {
  farmerId: string
}

export function AlertsPanel({ farmerId }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("alerts")
        .select("*")
        .or(`farmer_id.eq.${farmerId},farmer_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(5)

      if (data) {
        setAlerts(data)
      }
      setIsLoading(false)
    }

    fetchAlerts()
  }, [farmerId])

  const markAsRead = async (alertId: string) => {
    const supabase = createClient()
    await supabase.from("alerts").update({ is_read: true }).eq("id", alertId)

    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, is_read: true } : alert)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Active Alerts
        </CardTitle>
        <Badge variant="secondary">{alerts.filter((alert) => !alert.is_read).length} unread</Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground">Your livestock are healthy!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${
                  !alert.is_read ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(alert.created_at)}
                      </p>
                    </div>
                  </div>
                  {!alert.is_read && (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(alert.id)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
