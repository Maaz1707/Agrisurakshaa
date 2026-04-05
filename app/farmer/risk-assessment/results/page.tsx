import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskAssessmentResultsPageProps {
    searchParams: {
        type?: string
        score?: string
        level?: string
    }
}

const levelColorMap: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
}

export default function RiskAssessmentResultsPage({ searchParams }: RiskAssessmentResultsPageProps) {
    const type = searchParams.type ?? "risk-assessment"
    const score = searchParams.score ?? "0"
    const level = searchParams.level ?? "low"
    const levelClass = levelColorMap[level] ?? "bg-gray-100 text-gray-700"

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle className="text-xl">Assessment Complete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Assessment Type</p>
                        <p className="font-medium capitalize">{type.replace(/_/g, " ")}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Risk Score</p>
                        <p className="text-2xl font-bold">{score}/100</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Risk Level</p>
                        <Badge className={levelClass}>{level}</Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button asChild>
                            <Link href="/farmer/risk-assessment">Back to Risk Assessment</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/farmer/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
