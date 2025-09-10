import { FileText, Download, Edit, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ReportTemplates() {
  const templates = [
    {
      id: 1,
      name: "Monthly Health Summary",
      description: "Comprehensive health overview with trends and recommendations",
      category: "Health",
      lastUsed: "2024-11-30",
      usage: 24,
    },
    {
      id: 2,
      name: "Quarterly Risk Assessment",
      description: "Detailed risk analysis across all farm operations",
      category: "Risk",
      lastUsed: "2024-11-28",
      usage: 12,
    },
    {
      id: 3,
      name: "Compliance Audit Report",
      description: "Regulatory compliance status and action items",
      category: "Compliance",
      lastUsed: "2024-11-25",
      usage: 8,
    },
    {
      id: 4,
      name: "Performance Dashboard",
      description: "Key performance indicators and productivity metrics",
      category: "Performance",
      lastUsed: "2024-11-20",
      usage: 16,
    },
    {
      id: 5,
      name: "Incident Report",
      description: "Detailed incident analysis and corrective actions",
      category: "Incident",
      lastUsed: "2024-11-15",
      usage: 6,
    },
    {
      id: 6,
      name: "Training Progress Report",
      description: "Educational module completion and certification status",
      category: "Training",
      lastUsed: "2024-11-10",
      usage: 18,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Report Templates</h2>
          <p className="text-muted-foreground">Pre-configured report templates for quick generation</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{template.category}</Badge>
                <span className="text-sm text-muted-foreground">Used {template.usage} times</span>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">Last used: {template.lastUsed}</div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
