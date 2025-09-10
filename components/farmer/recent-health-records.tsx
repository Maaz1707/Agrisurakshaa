"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Plus, Calendar, Stethoscope, Syringe, FileText } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface HealthRecord {
  id: string
  record_type: string
  title: string
  description: string
  record_date: string
  livestock: {
    tag_number: string
    livestock_types: {
      name: string
    }
  }
}

interface RecentHealthRecordsProps {
  farmerId: string
}

export function RecentHealthRecords({ farmerId }: RecentHealthRecordsProps) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentRecords = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("health_records")
        .select(`
          id,
          record_type,
          title,
          description,
          record_date,
          livestock:livestock_id (
            tag_number,
            livestock_types:livestock_type_id (
              name
            )
          )
        `)
        .eq("farmer_id", farmerId)
        .order("record_date", { ascending: false })
        .limit(5)

      if (data) {
        setRecords(data as HealthRecord[])
      }
      setIsLoading(false)
    }

    fetchRecentRecords()
  }, [farmerId])

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Syringe className="h-4 w-4" />
      case "treatment":
        return <Stethoscope className="h-4 w-4" />
      case "checkup":
        return <FileText className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getRecordBadgeColor = (type: string) => {
    switch (type) {
      case "vaccination":
        return "bg-blue-100 text-blue-700"
      case "treatment":
        return "bg-red-100 text-red-700"
      case "checkup":
        return "bg-green-100 text-green-700"
      case "symptom":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Recent Health Records
        </CardTitle>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No health records yet</p>
            <Button className="mt-4" size="sm">
              Add Your First Record
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded-lg">{getRecordIcon(record.record_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{record.title}</h4>
                    <Badge className={getRecordBadgeColor(record.record_type)}>{record.record_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Animal: {record.livestock?.tag_number}</span>
                    <span>Type: {record.livestock?.livestock_types?.name}</span>
                    <span>Date: {formatDate(record.record_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
