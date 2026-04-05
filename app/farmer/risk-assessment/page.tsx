import { DashboardHeader } from "@/components/farmer/dashboard-header"
import { AssessmentHistory } from "@/components/risk-assessment/assessment-history"
import { AssessmentTypes } from "@/components/risk-assessment/assessment-types"
import { RiskAssessmentOverview } from "@/components/risk-assessment/risk-assessment-overview"

const demoProfile = {
    full_name: "Farmer",
    farm_name: "AgriSuraksha Farm",
    email: "farmer@agrisuraksha.local",
}

const demoFarmerId = "demo-farmer-id"

export default function RiskAssessmentPage() {
    return (
        <main className="min-h-screen bg-background">
            <DashboardHeader profile={demoProfile} />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-6 space-y-6">
                    <RiskAssessmentOverview farmerId={demoFarmerId} />
                    <AssessmentTypes farmerId={demoFarmerId} />
                    <AssessmentHistory farmerId={demoFarmerId} />
                </div>
            </div>
        </main>
    )
}
