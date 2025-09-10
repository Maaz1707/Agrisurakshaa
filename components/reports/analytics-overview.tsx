import { TrendingUp, TrendingDown, Activity, Shield, Heart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsOverview() {
  const metrics = [
    {
      title: "Overall Health Score",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Heart,
      color: "text-chart-1",
    },
    {
      title: "Risk Level",
      value: "Low",
      change: "-15%",
      trend: "down",
      icon: Shield,
      color: "text-chart-2",
    },
    {
      title: "Active Alerts",
      value: "3",
      change: "-2",
      trend: "down",
      icon: AlertTriangle,
      color: "text-chart-3",
    },
    {
      title: "Compliance Rate",
      value: "98.7%",
      change: "+1.2%",
      trend: "up",
      icon: Activity,
      color: "text-chart-4",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                )}
                <span className="text-green-600">{metric.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
