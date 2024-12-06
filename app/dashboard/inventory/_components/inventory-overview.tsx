'use client'

import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MaintenanceStatus, AssetType } from '@prisma/client'
import { StatsCard } from './stats-card'
import { Box, Wrench, Truck, AlertTriangle } from 'lucide-react'

export function InventoryOverview() {
  const { assets } = useInventoryStore()
  
  const totalAssets = assets.length
  const needsAttention = assets.filter(
    asset => asset.condition === MaintenanceStatus.NEEDS_ATTENTION || 
             asset.condition === MaintenanceStatus.CRITICAL
  ).length
  
  const assetsByType = assets.reduce((acc, asset) => {
    acc[asset.assetType] = (acc[asset.assetType] || 0) + 1
    return acc
  }, {} as Record<AssetType, number>)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={totalAssets}
          icon={Box}
          description="Total number of assets"
        />
        <StatsCard
          title="Equipment"
          value={assetsByType[AssetType.EQUIPMENT] || 0}
          icon={Wrench}
          description="Total equipment assets"
        />
        <StatsCard
          title="Vehicles"
          value={assetsByType[AssetType.VEHICLE] || 0}
          icon={Truck}
          description="Total vehicle assets"
        />
        <StatsCard
          title="Needs Attention"
          value={needsAttention}
          icon={AlertTriangle}
          description="Assets requiring maintenance"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asset Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(MaintenanceStatus).map(status => {
                const count = assets.filter(asset => asset.condition === status).length
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span>{status.replace('_', ' ')}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(AssetType).map(type => {
                const count = assets.filter(asset => asset.assetType === type).length
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}