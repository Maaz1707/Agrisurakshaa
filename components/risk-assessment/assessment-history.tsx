"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { History, Eye, Download } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface Assessment {
  id: string
  assessment_type: string
  title: string
  risk_score: number
  risk_level: string
  created_at: string
  completed_at: string | null
}

interface AssessmentHistoryProps {
  farmerId: string
}

export function AssessmentHistory({ farmerId }: AssessmentHistoryProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("risk_assessments")
        .select("*")
        .eq("farmer_id", farmerId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (data) {
        setAssessments(data)
      }
      setIsLoading(false)
    }

    fetchAssessments()
  }, [farmerId])

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case "biosecurity":
        return "Biosecurity"
      case "disease_outbreak":
        return "Disease Outbreak"
      case "environmental":
        return "Environmental"
      case "management":
        return "Management"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Assessment History
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-6">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assessments completed yet</p>
            <p className="text-sm text-muted-foreground">Start your first risk assessment above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{getAssessmentTypeLabel(assessment.assessment_type)}</h4>
                    <Badge className={getRiskLevelColor(assessment.risk_level)}>{assessment.risk_level}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Score: {assessment.risk_score}/100</span>
                    <span>{formatDate(assessment.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
