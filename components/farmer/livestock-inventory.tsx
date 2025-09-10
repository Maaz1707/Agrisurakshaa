"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Plus, Pi as Pig, Bird } from "lucide-react"
import { AddLivestockDialog } from "./add-livestock-dialog"

interface LivestockSummary {
  type: string
  category: string
  count: number
  healthy: number
  sick: number
}

interface LivestockInventoryProps {
  farmerId: string
}

export function LivestockInventory({ farmerId }: LivestockInventoryProps) {
  const [inventory, setInventory] = useState<LivestockSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  const mockInventory: LivestockSummary[] = [
    { type: "Pig", category: "pig", count: 25, healthy: 22, sick: 3 },
    { type: "Chicken", category: "poultry", count: 150, healthy: 145, sick: 5 },
    { type: "Duck", category: "poultry", count: 30, healthy: 28, sick: 2 },
    { type: "Sow", category: "pig", count: 8, healthy: 7, sick: 1 }
  ]

  const fetchInventory = async () => {
    // Simulate API call
    setTimeout(() => {
      setInventory(mockInventory)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    fetchInventory()
  }, [farmerId])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pig":
        return <Pig className="h-4 w-4" />
      case "poultry":
        return <Bird className="h-4 w-4" />
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Pig className="h-5 w-5 text-primary" />
          Livestock Inventory
        </CardTitle>
        <AddLivestockDialog farmerId={farmerId} onSuccess={fetchInventory} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-6">
            <Pig className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No livestock registered</p>
            <AddLivestockDialog farmerId={farmerId} onSuccess={fetchInventory} />
          </div>
        ) : (
          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.type} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">{getCategoryIcon(item.category)}</div>
                  <div>
                    <h4 className="font-medium text-sm">{item.type}</h4>
                    <p className="text-xs text-muted-foreground">Total: {item.count}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">{item.healthy} healthy</Badge>
                  {item.sick > 0 && <Badge className="bg-red-100 text-red-700 text-xs">{item.sick} sick</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
