"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { History, Search, Download, Filter } from "lucide-react"

interface Alert {
  id: string
  alert_type: string
  severity: string
  title: string
  message: string
  created_at: string
  is_read: boolean
}

interface AlertHistoryProps {
  farmerId: string
}

export function AlertHistory({ farmerId }: AlertHistoryProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  useEffect(() => {
    const fetchAlertHistory = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("alerts")
        .select("*")
        .or(`farmer_id.eq.${farmerId},farmer_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) {
        setAlerts(data)
        setFilteredAlerts(data)
      }
      setIsLoading(false)
    }

    fetchAlertHistory()
  }, [farmerId])

  useEffect(() => {
    let filtered = alerts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((alert) => alert.alert_type === typeFilter)
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, typeFilter, severityFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "emergency":
        return "bg-red-100 text-red-700"
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "info":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "disease_outbreak":
        return "Disease Outbreak"
      case "vaccination_due":
        return "Vaccination Due"
      case "health_checkup":
        return "Health Checkup"
      case "weather":
        return "Weather Alert"
      case "market_price":
        return "Market Price"
      case "regulatory":
        return "Regulatory"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Alert History
        </CardTitle>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="disease_outbreak">Disease Outbreak</SelectItem>
              <SelectItem value="vaccination_due">Vaccination Due</SelectItem>
              <SelectItem value="health_checkup">Health Checkup</SelectItem>
              <SelectItem value="weather">Weather</SelectItem>
              <SelectItem value="market_price">Market Price</SelectItem>
              <SelectItem value="regulatory">Regulatory</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alert List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors ${
                  !alert.is_read ? "bg-accent/5" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {getAlertTypeLabel(alert.alert_type)}
                    </Badge>
                    {!alert.is_read && <Badge className="bg-accent/10 text-accent text-xs">Unread</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(alert.created_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
