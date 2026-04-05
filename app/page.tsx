import { AlertsPanel } from "@/components/farmer/alerts-panel"
import { DashboardHeader } from "@/components/farmer/dashboard-header"
import { HealthStatusOverview } from "@/components/farmer/health-status-overview"
import { LivestockInventory } from "@/components/farmer/livestock-inventory"
import { QuickActions } from "@/components/farmer/quick-actions"
import { RecentHealthRecords } from "@/components/farmer/recent-health-records"

const demoProfile = {
    full_name: "Farmer",
    farm_name: "AgriSuraksha Farm",
    email: "farmer@agrisuraksha.local",
}

const demoFarmerId = "demo-farmer-id"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-background">
            <DashboardHeader profile={demoProfile} />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-6 space-y-6">
                    <HealthStatusOverview farmerId={demoFarmerId} />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <LivestockInventory farmerId={demoFarmerId} />
                        <AlertsPanel farmerId={demoFarmerId} />
                    </div>

                    <RecentHealthRecords farmerId={demoFarmerId} />
                </div>
            </div>

            <QuickActions farmerId={demoFarmerId} />
        </main>
    )
}
