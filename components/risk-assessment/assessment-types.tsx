"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Shield, Citrus as Virus, Cloud, Settings, ChevronRight } from "lucide-react"

interface AssessmentTypesProps {
  farmerId: string
}

const assessmentTypes = [
  {
    id: "biosecurity",
    title: "Biosecurity Assessment",
    description: "Evaluate your farm's biosecurity measures and protocols",
    icon: Shield,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-600",
    questions: 15,
    duration: "10-15 min",
    category: "Critical",
  },
  {
    id: "disease_outbreak",
    title: "Disease Outbreak Risk",
    description: "Assess vulnerability to disease outbreaks and transmission",
    icon: Virus,
    color: "bg-red-50 border-red-200 text-red-700",
    iconColor: "text-red-600",
    questions: 12,
    duration: "8-12 min",
    category: "High Priority",
  },
  {
    id: "environmental",
    title: "Environmental Risk",
    description: "Evaluate environmental factors affecting livestock health",
    icon: Cloud,
    color: "bg-green-50 border-green-200 text-green-700",
    iconColor: "text-green-600",
    questions: 10,
    duration: "6-10 min",
    category: "Important",
  },
  {
    id: "management",
    title: "Management Practices",
    description: "Review farm management and operational procedures",
    icon: Settings,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconColor: "text-purple-600",
    questions: 18,
    duration: "12-18 min",
    category: "Routine",
  },
]

export function AssessmentTypes({ farmerId }: AssessmentTypesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Types</CardTitle>
        <CardDescription>
          Choose an assessment type to evaluate different aspects of your farm's biosecurity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessmentTypes.map((assessment) => {
            const Icon = assessment.icon
            return (
              <Card key={assessment.id} className={`${assessment.color} hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/80 p-2 rounded-lg">
                      <Icon className={`h-6 w-6 ${assessment.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="bg-white/80">
                      {assessment.category}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
                  <p className="text-sm mb-4 opacity-80">{assessment.description}</p>

                  <div className="flex items-center justify-between text-xs mb-4 opacity-70">
                    <span>{assessment.questions} questions</span>
                    <span>{assessment.duration}</span>
                  </div>

                  <Button asChild className="w-full bg-white/90 hover:bg-white text-gray-800 border-0">
                    <Link
                      href={`/farmer/risk-assessment/${assessment.id}`}
                      className="flex items-center justify-center gap-2"
                    >
                      Start Assessment
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
