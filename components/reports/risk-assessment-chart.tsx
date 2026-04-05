"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { category: "Biosecurity", low: 85, medium: 12, high: 3 },
  { category: "Disease", low: 78, medium: 18, high: 4 },
  { category: "Environmental", low: 92, medium: 6, high: 2 },
  { category: "Management", low: 88, medium: 10, high: 2 },
]

export function RiskAssessmentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Distribution</CardTitle>
        <CardDescription>Risk levels across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="low" stackId="a" fill="hsl(var(--chart-1))" />
            <Bar dataKey="medium" stackId="a" fill="hsl(var(--chart-3))" />
            <Bar dataKey="high" stackId="a" fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
