"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Heart, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface HealthStatusOverviewProps {
  farmerId: string
}

interface HealthStats {
  total: number
  healthy: number
  sick: number
  quarantine: number
  deceased: number
}

export function HealthStatusOverview({ farmerId }: HealthStatusOverviewProps) {
  const [stats, setStats] = useState<HealthStats>({
    total: 0,
    healthy: 0,
    sick: 0,
    quarantine: 0,
    deceased: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHealthStats = async () => {
      // Mock health statistics
      const mockStats: HealthStats = {
        total: 213,
        healthy: 202,
        sick: 8,
        quarantine: 2,
        deceased: 1
      }

      // Simulate API call
      setTimeout(() => {
        setStats(mockStats)
        setIsLoading(false)
      }, 1000)
    }

    fetchHealthStats()
  }, [farmerId])

  const getHealthPercentage = (count: number) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Livestock */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Livestock</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <Heart className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Healthy */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Healthy</p>
              <p className="text-3xl font-bold text-green-600">{stats.healthy}</p>
              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                {getHealthPercentage(stats.healthy)}%
              </Badge>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Sick */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sick</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.sick}</p>
              <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-700">
                {getHealthPercentage(stats.sick)}%
              </Badge>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {/* Critical (Quarantine + Deceased) */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-3xl font-bold text-red-600">{stats.quarantine + stats.deceased}</p>
              <Badge variant="secondary" className="mt-1 bg-red-100 text-red-700">
                {getHealthPercentage(stats.quarantine + stats.deceased)}%
              </Badge>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
