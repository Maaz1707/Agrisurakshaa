import { ActiveAlerts } from "@/components/alerts/active-alerts"
import { AlertHistory } from "@/components/alerts/alert-history"
import { AlertsOverview } from "@/components/alerts/alerts-overview"
import { NotificationSettings } from "@/components/alerts/notification-settings"
import { DashboardHeader } from "@/components/farmer/dashboard-header"

const demoProfile = {
    full_name: "Farmer",
    farm_name: "AgriSuraksha Farm",
    email: "farmer@agrisuraksha.local",
}

const demoFarmerId = "demo-farmer-id"

export default function AlertsPage() {
    return (
        <main className="min-h-screen bg-background">
            <DashboardHeader profile={demoProfile} />

            <div className="lg:ml-80">
                <div className="container mx-auto px-6 py-6 space-y-6">
                    <AlertsOverview farmerId={demoFarmerId} />
                    <ActiveAlerts farmerId={demoFarmerId} />
                    <AlertHistory farmerId={demoFarmerId} />
                    <NotificationSettings farmerId={demoFarmerId} />
                </div>
            </div>
        </main>
    )
}
