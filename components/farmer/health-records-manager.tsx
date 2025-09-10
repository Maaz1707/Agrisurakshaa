"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Stethoscope, Calendar, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface Livestock {
  id: string
  tag_number: string
  livestock_types: {
    name: string
  }
}

interface HealthRecord {
  id: string
  livestock_id: string
  record_date: string
  record_type: string
  title: string
  description: string
  symptoms: string[]
  treatment_given: string
  veterinarian_name: string
  livestock: {
    tag_number: string
    livestock_types: {
      name: string
    }
  }
}

interface HealthRecordsManagerProps {
  farmerId: string
}

export function HealthRecordsManager({ farmerId }: HealthRecordsManagerProps) {
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    livestockId: "",
    recordDate: new Date().toISOString().split('T')[0],
    recordType: "",
    title: "",
    description: "",
    symptoms: "",
    treatmentGiven: "",
    veterinarianName: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      // Mock livestock data
      const mockLivestock: Livestock[] = [
        { id: "1", tag_number: "PIG001", livestock_types: { name: "Pig" } },
        { id: "2", tag_number: "PIG002", livestock_types: { name: "Pig" } },
        { id: "3", tag_number: "CHK001", livestock_types: { name: "Chicken" } },
        { id: "4", tag_number: "CHK002", livestock_types: { name: "Chicken" } },
        { id: "5", tag_number: "DUK001", livestock_types: { name: "Duck" } },
        { id: "6", tag_number: "SOW001", livestock_types: { name: "Sow" } }
      ]

      // Mock health records
      const mockRecords: HealthRecord[] = [
        {
          id: "1",
          livestock_id: "1",
          record_date: "2025-01-08",
          record_type: "checkup",
          title: "Routine Health Check",
          description: "Monthly routine examination",
          symptoms: ["No symptoms observed"],
          treatment_given: "Vitamin supplement",
          veterinarian_name: "Dr. Smith",
          livestock: { tag_number: "PIG001", livestock_types: { name: "Pig" } }
        },
        {
          id: "2",
          livestock_id: "3",
          record_date: "2025-01-07",
          record_type: "vaccination",
          title: "Annual Vaccination",
          description: "Annual vaccination program",
          symptoms: [],
          treatment_given: "NDV Vaccine",
          veterinarian_name: "Dr. Johnson",
          livestock: { tag_number: "CHK001", livestock_types: { name: "Chicken" } }
        },
        {
          id: "3",
          livestock_id: "2",
          record_date: "2025-01-06",
          record_type: "treatment",
          title: "Antibiotic Treatment",
          description: "Treatment for minor infection",
          symptoms: ["Mild fever", "Loss of appetite"],
          treatment_given: "Amoxicillin 500mg",
          veterinarian_name: "Dr. Smith",
          livestock: { tag_number: "PIG002", livestock_types: { name: "Pig" } }
        }
      ]

      // Simulate API call
      setTimeout(() => {
        setLivestock(mockLivestock)
        setHealthRecords(mockRecords)
        setIsLoading(false)
      }, 1000)
    }

    fetchData()
  }, [farmerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call with voice feedback
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Voice feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Health record added successfully for ${formData.title}`)
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }

      // Add new record to mock data
      const selectedLivestock = livestock.find(l => l.id === formData.livestockId)
      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        livestock_id: formData.livestockId,
        record_date: formData.recordDate,
        record_type: formData.recordType,
        title: formData.title,
        description: formData.description || "",
        symptoms: formData.symptoms ? [formData.symptoms] : [],
        treatment_given: formData.treatmentGiven || "",
        veterinarian_name: formData.veterinarianName || "",
        livestock: selectedLivestock || { tag_number: "Unknown", livestock_types: { name: "Unknown" } }
      }

      setHealthRecords(prev => [newRecord, ...prev])

      // Reset form
      setFormData({
        livestockId: "",
        recordDate: new Date().toISOString().split('T')[0],
        recordType: "",
        title: "",
        description: "",
        symptoms: "",
        treatmentGiven: "",
        veterinarianName: ""
      })
      
      setIsDialogOpen(false)
    } catch (error: any) {
      setError("Failed to add health record")
    } finally {
      setIsSubmitting(false)
    }
  }


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Health Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Health Records
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2" data-voice-trigger="add-health-record">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Health Record</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="livestock">Animal *</Label>
                <Select value={formData.livestockId} onValueChange={(value) => setFormData({...formData, livestockId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {livestock.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.tag_number} - {animal.livestock_types.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordDate">Record Date *</Label>
                <Input
                  id="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => setFormData({...formData, recordDate: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordType">Record Type *</Label>
                <Select value={formData.recordType} onValueChange={(value) => setFormData({...formData, recordType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="symptom">Symptom</SelectItem>
                    <SelectItem value="death">Death</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Record Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Routine Health Check"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the health record..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  placeholder="Describe any symptoms observed..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentGiven">Treatment Given</Label>
                <Textarea
                  id="treatmentGiven"
                  value={formData.treatmentGiven}
                  onChange={(e) => setFormData({...formData, treatmentGiven: e.target.value})}
                  placeholder="Describe treatment given..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="veterinarianName">Veterinarian Name</Label>
                <Input
                  id="veterinarianName"
                  value={formData.veterinarianName}
                  onChange={(e) => setFormData({...formData, veterinarianName: e.target.value})}
                  placeholder="Dr. John Smith"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Record"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {healthRecords.length === 0 ? (
          <div className="text-center py-6">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No health records found</p>
            <p className="text-sm text-muted-foreground mt-2">Add animals first to start tracking their health</p>
          </div>
        ) : (
          <div className="space-y-3">
            {healthRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{record.livestock.tag_number}</h4>
                    <p className="text-xs text-muted-foreground">
                      {record.livestock.livestock_types.name} • {formatDate(record.record_date)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {record.title} • {record.record_type}
                    </p>
                    {record.description && (
                      <p className="text-xs text-muted-foreground mt-1">{record.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-blue-100 text-blue-700">{record.record_type}</Badge>
                  {record.treatment_given && (
                    <p className="text-xs text-muted-foreground text-right max-w-32 truncate">
                      {record.treatment_given}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
