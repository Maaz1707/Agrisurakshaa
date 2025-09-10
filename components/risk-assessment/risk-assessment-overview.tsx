"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface RiskAssessmentOverviewProps {
  farmerId: string
}

interface RiskOverview {
  totalAssessments: number
  averageRiskScore: number
  highRiskAreas: number
  lastAssessmentDate: string | null
}

export function RiskAssessmentOverview({ farmerId }: RiskAssessmentOverviewProps) {
  const [overview, setOverview] = useState<RiskOverview>({
    totalAssessments: 0,
    averageRiskScore: 0,
    highRiskAreas: 0,
    lastAssessmentDate: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      const supabase = createClient()

      const { data: assessments } = await supabase
        .from("risk_assessments")
        .select("risk_score, risk_level, created_at")
        .eq("farmer_id", farmerId)
        .order("created_at", { ascending: false })

      if (assessments) {
        const totalAssessments = assessments.length
        const averageRiskScore =
          totalAssessments > 0
            ? Math.round(assessments.reduce((sum, a) => sum + a.risk_score, 0) / totalAssessments)
            : 0
        const highRiskAreas = assessments.filter((a) => a.risk_level === "high" || a.risk_level === "critical").length
        const lastAssessmentDate = totalAssessments > 0 ? assessments[0].created_at : null

        setOverview({
          totalAssessments,
          averageRiskScore,
          highRiskAreas,
          lastAssessmentDate,
        })
      }
      setIsLoading(false)
    }

    fetchOverview()
  }, [farmerId])

  const getRiskLevelColor = (score: number) => {
    if (score >= 75) return "text-red-600"
    if (score >= 50) return "text-yellow-600"
    if (score >= 25) return "text-blue-600"
    return "text-green-600"
  }

  const getRiskLevelBadge = (score: number) => {
    if (score >= 75) return <Badge className="bg-red-100 text-red-700">High Risk</Badge>
    if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>
    if (score >= 25) return <Badge className="bg-blue-100 text-blue-700">Low Risk</Badge>
    return <Badge className="bg-green-100 text-green-700">Very Low Risk</Badge>
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
      {/* Total Assessments */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
              <p className="text-3xl font-bold text-primary">{overview.totalAssessments}</p>
            </div>
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Average Risk Score */}
      <Card className="bg-gradient-to-br from-card to-card/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Risk Score</p>
              <p className={`text-3xl font-bold ${getRiskLevelColor(overview.averageRiskScore)}`}>
                {overview.averageRiskScore}
              </p>
              {getRiskLevelBadge(overview.averageRiskScore)}
            </div>
            <TrendingUp className={`h-8 w-8 ${getRiskLevelColor(overview.averageRiskScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* High Risk Areas */}
      <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Risk Areas</p>
              <p className="text-3xl font-bold text-destructive">{overview.highRiskAreas}</p>
              <Badge variant="secondary" className="mt-1 bg-destructive/10 text-destructive">
                Needs Attention
              </Badge>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      {/* Last Assessment */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Assessment</p>
              <p className="text-lg font-bold text-green-600">
                {overview.lastAssessmentDate ? formatDate(overview.lastAssessmentDate) : "Never"}
              </p>
              <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                {overview.lastAssessmentDate ? "Up to date" : "Start now"}
              </Badge>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
