"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2 } from "lucide-react"

interface LivestockType {
  id: string
  name: string
  category: string
}

interface AddLivestockDialogProps {
  farmerId: string
  onSuccess: () => void
}

export function AddLivestockDialog({ farmerId, onSuccess }: AddLivestockDialogProps) {
  const [open, setOpen] = useState(false)
  const [livestockTypes, setLivestockTypes] = useState<LivestockType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    livestockTypeId: "",
    tagNumber: "",
    batchNumber: "",
    ageMonths: "",
    weightKg: "",
    gender: "",
    acquisitionDate: "",
    notes: ""
  })

  useEffect(() => {
    // Mock livestock types
    const mockTypes: LivestockType[] = [
      { id: "1", name: "Pig", category: "pig" },
      { id: "2", name: "Boar", category: "pig" },
      { id: "3", name: "Sow", category: "pig" },
      { id: "4", name: "Piglet", category: "pig" },
      { id: "5", name: "Chicken", category: "poultry" },
      { id: "6", name: "Rooster", category: "poultry" },
      { id: "7", name: "Hen", category: "poultry" },
      { id: "8", name: "Chick", category: "poultry" },
      { id: "9", name: "Duck", category: "poultry" },
      { id: "10", name: "Goose", category: "poultry" }
    ]
    setLivestockTypes(mockTypes)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call with voice feedback
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Voice feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Successfully added ${formData.tagNumber} to your livestock inventory`)
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }

      // Reset form
      setFormData({
        livestockTypeId: "",
        tagNumber: "",
        batchNumber: "",
        ageMonths: "",
        weightKg: "",
        gender: "",
        acquisitionDate: "",
        notes: ""
      })
      
      setOpen(false)
      onSuccess()
    } catch (error: any) {
      setError("Failed to add livestock")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2" data-voice-trigger="add-livestock">
          <Plus className="h-4 w-4" />
          Add Animal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Livestock</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="livestockType">Animal Type *</Label>
            <Select value={formData.livestockTypeId} onValueChange={(value) => setFormData({...formData, livestockTypeId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select animal type" />
              </SelectTrigger>
              <SelectContent>
                {livestockTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagNumber">Tag Number *</Label>
            <Input
              id="tagNumber"
              value={formData.tagNumber}
              onChange={(e) => setFormData({...formData, tagNumber: e.target.value})}
              placeholder="e.g., PIG001"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageMonths">Age (months)</Label>
              <Input
                id="ageMonths"
                type="number"
                value={formData.ageMonths}
                onChange={(e) => setFormData({...formData, ageMonths: e.target.value})}
                placeholder="12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightKg">Weight (kg)</Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({...formData, weightKg: e.target.value})}
                placeholder="50.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="acquisitionDate">Acquisition Date</Label>
            <Input
              id="acquisitionDate"
              type="date"
              value={formData.acquisitionDate}
              onChange={(e) => setFormData({...formData, acquisitionDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input
              id="batchNumber"
              value={formData.batchNumber}
              onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
              placeholder="e.g., BATCH001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about this animal..."
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Animal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
