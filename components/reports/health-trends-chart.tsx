"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", healthy: 95, sick: 5, vaccinated: 98 },
  { month: "Feb", healthy: 93, sick: 7, vaccinated: 97 },
  { month: "Mar", healthy: 96, sick: 4, vaccinated: 99 },
  { month: "Apr", healthy: 94, sick: 6, vaccinated: 98 },
  { month: "May", healthy: 97, sick: 3, vaccinated: 99 },
  { month: "Jun", healthy: 95, sick: 5, vaccinated: 98 },
]

export function HealthTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Trends</CardTitle>
        <CardDescription>Livestock health metrics over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="healthy" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            <Line type="monotone" dataKey="sick" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            <Line type="monotone" dataKey="vaccinated" stroke="hsl(var(--chart-3))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
