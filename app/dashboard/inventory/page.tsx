'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useInventoryStore } from '@/store/useInventoryStore'
import { getAssets } from '@/app/actions/inventory'
import { getProducts } from '@/app/actions/product'
import { CreateAssetModal } from './_components/create-asset-modal'
import { InventoryOverview } from './_components/inventory-overview'
import { AssetsList } from './_components/assets-list'
import { MaintenanceView } from './_components/maintenance-view'
import { LoadingScreen } from '@/components/loading-screen'

const InventoryPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { currentBusiness } = useBusinessStore()
  const { assets, setAssets } = useInventoryStore()

  useEffect(() => {
    const fetchData = async () => {
      if (currentBusiness) {
        setIsLoading(true)
        const [assetsResult, productsResult] = await Promise.all([
          getAssets(currentBusiness.id),
          getProducts(currentBusiness.id)
        ])
        
        if (assetsResult.success) {
          setAssets(assetsResult.assets)
        }
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [currentBusiness, setAssets])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Manage your inventory, assets, and maintenance schedules
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Asset
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InventoryOverview />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsList />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceView />
        </TabsContent>
      </Tabs>

      {showCreateModal && (
        <CreateAssetModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default InventoryPage