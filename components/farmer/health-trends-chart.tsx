"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface HealthTrendsChartProps {
  farmerId: string
}

interface ChartData {
  date: string
  healthy: number
  sick: number
  total: number
}

export function HealthTrendsChart({ farmerId }: HealthTrendsChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHealthTrends = async () => {
      const supabase = createClient()

      // Get health records from the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: records } = await supabase
        .from("health_records")
        .select("record_date, livestock:livestock_id(health_status)")
        .eq("farmer_id", farmerId)
        .gte("record_date", thirtyDaysAgo.toISOString().split("T")[0])
        .order("record_date", { ascending: true })

      if (records) {
        // Group by date and calculate health status counts
        const groupedData = records.reduce((acc: Record<string, any>, record) => {
          const date = record.record_date
          if (!acc[date]) {
            acc[date] = { date, healthy: 0, sick: 0, total: 0 }
          }

          acc[date].total++
          if (record.livestock?.health_status === "healthy") {
            acc[date].healthy++
          } else if (record.livestock?.health_status === "sick") {
            acc[date].sick++
          }

          return acc
        }, {})

        setChartData(Object.values(groupedData))
      }
      setIsLoading(false)
    }

    fetchHealthTrends()
  }, [farmerId])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Health Trends (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No health data available</p>
              <p className="text-sm">Add health records to see trends</p>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value, name) => [value, name === "healthy" ? "Healthy" : "Sick"]}
                />
                <Line
                  type="monotone"
                  dataKey="healthy"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="sick"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
