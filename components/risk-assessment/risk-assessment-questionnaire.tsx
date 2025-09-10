"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Citrus as Virus, Cloud, Settings } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import Link from "next/link"

interface Question {
  id: string
  question: string
  type: "multiple_choice" | "yes_no" | "scale" | "text"
  options?: string[]
  riskWeight: number
}

interface RiskAssessmentQuestionnaireProps {
  assessmentType: string
  farmerId: string
}

const questionSets = {
  biosecurity: [
    {
      id: "bio_1",
      question: "Do you have a designated entry/exit point for your farm?",
      type: "yes_no" as const,
      riskWeight: 10,
    },
    {
      id: "bio_2",
      question: "How often do you disinfect vehicles entering your farm?",
      type: "multiple_choice" as const,
      options: ["Always", "Often", "Sometimes", "Never"],
      riskWeight: 15,
    },
    {
      id: "bio_3",
      question: "Do visitors follow biosecurity protocols?",
      type: "multiple_choice" as const,
      options: ["Always", "Usually", "Sometimes", "Never"],
      riskWeight: 12,
    },
    {
      id: "bio_4",
      question: "Rate your farm's isolation facilities (1-5 scale)",
      type: "scale" as const,
      riskWeight: 8,
    },
    {
      id: "bio_5",
      question: "Do you maintain visitor logs?",
      type: "yes_no" as const,
      riskWeight: 6,
    },
  ],
  disease_outbreak: [
    {
      id: "disease_1",
      question: "How often do you monitor animals for disease symptoms?",
      type: "multiple_choice" as const,
      options: ["Daily", "Weekly", "Monthly", "Rarely"],
      riskWeight: 20,
    },
    {
      id: "disease_2",
      question: "Do you have a veterinarian on call?",
      type: "yes_no" as const,
      riskWeight: 15,
    },
    {
      id: "disease_3",
      question: "How quickly can you isolate sick animals?",
      type: "multiple_choice" as const,
      options: ["Immediately", "Within hours", "Within days", "Cannot isolate"],
      riskWeight: 18,
    },
  ],
  environmental: [
    {
      id: "env_1",
      question: "How do you manage waste disposal?",
      type: "multiple_choice" as const,
      options: ["Professional service", "Composting", "Burning", "No formal system"],
      riskWeight: 12,
    },
    {
      id: "env_2",
      question: "Do you test water quality regularly?",
      type: "yes_no" as const,
      riskWeight: 10,
    },
  ],
  management: [
    {
      id: "mgmt_1",
      question: "How often do you update your management protocols?",
      type: "multiple_choice" as const,
      options: ["Quarterly", "Annually", "When needed", "Never"],
      riskWeight: 8,
    },
    {
      id: "mgmt_2",
      question: "Do you maintain detailed health records?",
      type: "yes_no" as const,
      riskWeight: 12,
    },
  ],
}

export function RiskAssessmentQuestionnaire({ assessmentType, farmerId }: RiskAssessmentQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const questions = questionSets[assessmentType as keyof typeof questionSets] || []
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const getAssessmentInfo = (type: string) => {
    switch (type) {
      case "biosecurity":
        return { title: "Biosecurity Assessment", icon: Shield, color: "text-blue-600" }
      case "disease_outbreak":
        return { title: "Disease Outbreak Risk", icon: Virus, color: "text-red-600" }
      case "environmental":
        return { title: "Environmental Risk", icon: Cloud, color: "text-green-600" }
      case "management":
        return { title: "Management Practices", icon: Settings, color: "text-purple-600" }
      default:
        return { title: "Risk Assessment", icon: Shield, color: "text-gray-600" }
    }
  }

  const assessmentInfo = getAssessmentInfo(assessmentType)
  const Icon = assessmentInfo.icon

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }))
  }

  const calculateRiskScore = () => {
    let totalScore = 0
    let maxScore = 0

    questions.forEach((question) => {
      const answer = answers[question.id]
      maxScore += question.riskWeight

      if (answer) {
        if (question.type === "yes_no") {
          totalScore += answer === "No" ? question.riskWeight : 0
        } else if (question.type === "multiple_choice") {
          const optionIndex = question.options?.indexOf(answer) || 0
          const riskMultiplier = optionIndex / (question.options?.length || 1)
          totalScore += question.riskWeight * riskMultiplier
        } else if (question.type === "scale") {
          const scaleValue = Number.parseInt(answer) || 1
          totalScore += question.riskWeight * ((5 - scaleValue) / 4)
        }
      }
    })

    return Math.round((totalScore / maxScore) * 100)
  }

  const getRiskLevel = (score: number) => {
    if (score >= 75) return "critical"
    if (score >= 50) return "high"
    if (score >= 25) return "medium"
    return "low"
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)
    const supabase = createClient()

    const riskScore = calculateRiskScore()
    const riskLevel = getRiskLevel(riskScore)

    const questionsWithAnswers = questions.map((q) => ({
      ...q,
      answer: answers[q.id] || "",
    }))

    const { error } = await supabase.from("risk_assessments").insert({
      farmer_id: farmerId,
      assessment_type: assessmentType,
      title: `${assessmentInfo.title} - ${formatDate(new Date())}`,
      questions: questionsWithAnswers,
      risk_score: riskScore,
      risk_level: riskLevel,
      recommendations: generateRecommendations(assessmentType, riskScore),
      action_items: generateActionItems(assessmentType, answers),
      completed_at: new Date().toISOString(),
    })

    if (!error) {
      router.push(`/farmer/risk-assessment/results?type=${assessmentType}&score=${riskScore}&level=${riskLevel}`)
    }
    setIsSubmitting(false)
  }

  const generateRecommendations = (type: string, score: number) => {
    const recommendations = []
    if (score >= 50) {
      recommendations.push("Immediate review of current biosecurity protocols required")
      recommendations.push("Consider consulting with a veterinary biosecurity specialist")
    }
    if (score >= 25) {
      recommendations.push("Regular monitoring and assessment recommended")
      recommendations.push("Update staff training on biosecurity measures")
    }
    return recommendations
  }

  const generateActionItems = (type: string, answers: Record<string, string>) => {
    const actions = []
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (answer === "Never" || answer === "No") {
        actions.push(`Address issue identified in question ${questionId}`)
      }
    })
    return actions
  }

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = answers[currentQ?.id]

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Assessment type not found</p>
            <Button asChild className="mt-4">
              <Link href="/farmer/risk-assessment">Back to Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Icon className={`h-8 w-8 ${assessmentInfo.color}`} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{assessmentInfo.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <Badge variant="secondary">{Math.round(progress)}% Complete</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === "yes_no" && (
              <RadioGroup value={answers[currentQ.id] || ""} onValueChange={handleAnswer}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            )}

            {currentQ.type === "multiple_choice" && (
              <RadioGroup value={answers[currentQ.id] || ""} onValueChange={handleAnswer}>
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === "scale" && (
              <RadioGroup value={answers[currentQ.id] || ""} onValueChange={handleAnswer}>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="flex flex-col items-center space-y-2">
                      <RadioGroupItem value={num.toString()} id={`scale-${num}`} />
                      <Label htmlFor={`scale-${num}`} className="text-sm">
                        {num}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </RadioGroup>
            )}

            {currentQ.type === "text" && (
              <Textarea
                placeholder="Please provide details..."
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={submitAssessment} disabled={!canProceed || isSubmitting} className="gap-2">
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={!canProceed} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6">
          <Button variant="ghost" asChild>
            <Link href="/farmer/risk-assessment" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Risk Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
