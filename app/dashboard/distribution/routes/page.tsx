'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDeliveryRouteStore } from '@/store/useDeliveryRouteStore'
import { getRoutes } from '@/app/actions/deliveryRoute'
import { CreateRouteModal } from './_components/create-route-modal'
import { columns } from './_components/route-columns'

const Routes = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { routes, setRoutes } = useDeliveryRouteStore()

  useEffect(() => {
    const fetchRoutes = async () => {
      if (currentBusiness) {
        const result = await getRoutes(currentBusiness.id)
        if (result.success) {
          setRoutes(result.routes)
        }
      }
    }
    
    fetchRoutes()
  }, [currentBusiness, setRoutes])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Route
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="section-heading">
        <h2>Routes</h2>
        <p>Manage your delivery routes and assign clients</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={routes} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateRouteModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Routes