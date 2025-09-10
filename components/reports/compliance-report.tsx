import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ComplianceReport() {
  const complianceItems = [
    { item: "Vaccination Records", status: "compliant", progress: 100, dueDate: null },
    { item: "Health Inspections", status: "compliant", progress: 95, dueDate: null },
    { item: "Biosecurity Protocols", status: "pending", progress: 75, dueDate: "2024-12-15" },
    { item: "Feed Quality Tests", status: "overdue", progress: 60, dueDate: "2024-11-30" },
    { item: "Waste Management", status: "compliant", progress: 100, dueDate: null },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "overdue":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Compliant</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
        <CardDescription>Current compliance status across all regulatory requirements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.item}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.progress}%</span>
                  </div>
                  {item.dueDate && <p className="text-sm text-muted-foreground mt-1">Due: {item.dueDate}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
