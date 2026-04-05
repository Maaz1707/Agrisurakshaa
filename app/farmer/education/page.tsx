import { DashboardHeader } from "@/components/farmer/dashboard-header"
import { EducationalContentViewer } from "@/components/farmer/educational-content-viewer"

const demoProfile = {
    full_name: "Farmer",
    farm_name: "AgriSuraksha Farm",
    email: "farmer@agrisuraksha.local",
}

const demoFarmerId = "demo-farmer-id"

export default function EducationPage() {
    return (
        <main className="min-h-screen bg-background">
            <DashboardHeader profile={demoProfile} />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-6">
                    <EducationalContentViewer farmerId={demoFarmerId} />
                </div>
            </div>
        </main>
    )
}
