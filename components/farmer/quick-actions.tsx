"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Stethoscope, Syringe, FileText, AlertTriangle } from "lucide-react"

interface QuickActionsProps {
  farmerId: string
}

export function QuickActions({ farmerId }: QuickActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Add Health Record
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Syringe className="h-4 w-4" />
            Schedule Vaccination
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <FileText className="h-4 w-4" />
            Record Treatment
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Report Emergency
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
