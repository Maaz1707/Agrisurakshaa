"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Bell, AlertTriangle, Info, Zap, CheckCircle } from "lucide-react"

interface AlertsOverviewProps {
  farmerId: string
}

interface AlertStats {
  total: number
  critical: number
  warning: number
  info: number
  unread: number
}

export function AlertsOverview({ farmerId }: AlertsOverviewProps) {
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    critical: 0,
    warning: 0,
    info: 0,
    unread: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlertStats = async () => {
      const supabase = createClient()

      const { data: alerts } = await supabase
        .from("alerts")
        .select("severity, is_read")
        .or(`farmer_id.eq.${farmerId},farmer_id.is.null`)

      if (alerts) {
        const stats = alerts.reduce(
          (acc, alert) => {
            acc.total++
            acc[alert.severity as keyof AlertStats]++
            if (!alert.is_read) acc.unread++
            return acc
          },
          { total: 0, critical: 0, warning: 0, info: 0, unread: 0 },
        )
        setStats(stats)
      }
      setIsLoading(false)
    }

    fetchAlertStats()
  }, [farmerId])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Total Alerts */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
              <Badge variant="secondary" className="mt-1 bg-red-100 text-red-700">
                Urgent
              </Badge>
            </div>
            <Zap className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      {/* Warning Alerts */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Warning</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.warning}</p>
              <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-700">
                Attention
              </Badge>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {/* Info Alerts */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Info</p>
              <p className="text-3xl font-bold text-blue-600">{stats.info}</p>
              <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700">
                Updates
              </Badge>
            </div>
            <Info className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Unread Alerts */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unread</p>
              <p className="text-3xl font-bold text-accent">{stats.unread}</p>
              <Badge variant="secondary" className="mt-1 bg-accent/10 text-accent">
                New
              </Badge>
            </div>
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
