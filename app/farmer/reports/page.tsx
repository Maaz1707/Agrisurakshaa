import { DashboardHeader } from "@/components/farmer/dashboard-header"
import { AnalyticsOverview } from "@/components/reports/analytics-overview"
import { ComplianceReport } from "@/components/reports/compliance-report"
import { HealthTrendsChart } from "@/components/reports/health-trends-chart"
import { ReportTemplates } from "@/components/reports/report-templates"
import { RiskAssessmentChart } from "@/components/reports/risk-assessment-chart"

const demoProfile = {
    full_name: "Farmer",
    farm_name: "AgriSuraksha Farm",
    email: "farmer@agrisuraksha.local",
}

export default function ReportsPage() {
    return (
        <main className="min-h-screen bg-background">
            <DashboardHeader profile={demoProfile} />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-6 space-y-6">
                    <AnalyticsOverview />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <HealthTrendsChart />
                        <RiskAssessmentChart />
                    </div>
                    <ComplianceReport />
                    <ReportTemplates />
                </div>
            </div>
        </main>
    )
}
