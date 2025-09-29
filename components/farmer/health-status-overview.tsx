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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Livestock */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Total Livestock</p>
              <p className="text-4xl font-bold text-emerald-800">{stats.total}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-emerald-600 font-medium">All Animals</span>
              </div>
            </div>
            <div className="bg-emerald-500 p-3 rounded-xl shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Healthy */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Healthy</p>
              <p className="text-4xl font-bold text-green-800">{stats.healthy}</p>
              <Badge className="bg-green-500 text-white font-semibold px-3 py-1 rounded-full">
                {getHealthPercentage(stats.healthy)}%
              </Badge>
            </div>
            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sick */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Sick</p>
              <p className="text-4xl font-bold text-amber-800">{stats.sick}</p>
              <Badge className="bg-amber-500 text-white font-semibold px-3 py-1 rounded-full">
                {getHealthPercentage(stats.sick)}%
              </Badge>
            </div>
            <div className="bg-amber-500 p-3 rounded-xl shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical (Quarantine + Deceased) */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Critical</p>
              <p className="text-4xl font-bold text-red-800">{stats.quarantine + stats.deceased}</p>
              <Badge className="bg-red-500 text-white font-semibold px-3 py-1 rounded-full">
                {getHealthPercentage(stats.quarantine + stats.deceased)}%
              </Badge>
            </div>
            <div className="bg-red-500 p-3 rounded-xl shadow-lg">
              <XCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
