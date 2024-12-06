'use client'

import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MaintenanceStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'

export function MaintenanceView() {
  const { assets } = useInventoryStore()
  
  const needsMaintenance = assets.filter(
    asset => asset.condition === MaintenanceStatus.NEEDS_ATTENTION || 
             asset.condition === MaintenanceStatus.CRITICAL
  )

  const upcomingMaintenance = assets.filter(asset => {
    if (!asset.nextMaintenance) return false
    const nextDate = new Date(asset.nextMaintenance)
    const today = new Date()
    const diffTime = nextDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Needs Attention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {needsMaintenance.map(asset => (
              <div key={asset.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{asset.description}</p>
                </div>
                <Badge variant="destructive">{asset.condition}</Badge>
              </div>
            ))}
            {needsMaintenance.length === 0 && (
              <p className="text-sm text-muted-foreground">No assets need attention</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMaintenance.map(asset => (
              <div key={asset.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(asset.nextMaintenance!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {upcomingMaintenance.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming maintenance</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets
              .filter(asset => asset.lastMaintenance)
              .sort((a, b) => {
                return new Date(b.lastMaintenance!).getTime() - new Date(a.lastMaintenance!).getTime()
              })
              .slice(0, 5)
              .map(asset => (
                <div key={asset.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last: {new Date(asset.lastMaintenance!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}