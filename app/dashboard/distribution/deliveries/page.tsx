'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDeliveryStore } from '@/store/useDeliveryStore'
import { getDeliveryTransactions } from '@/app/actions/delivery'
import { CreateDeliveryModal } from './_components/create-delivery-modal'
import { columns } from './_components/delivery-columns'

const Deliveries = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { deliveries, setDeliveries } = useDeliveryStore()

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (currentBusiness) {
        const result = await getDeliveryTransactions(currentBusiness.id)
        if (result.success) {
          setDeliveries(result.deliveries)
        }
      }
    }
    
    fetchDeliveries()
  }, [currentBusiness, setDeliveries])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Record Delivery
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Deliveries</h2>
        <p className="text-muted-foreground">
          Track and manage your deliveries here
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={deliveries} 
        searchKey="order.client.name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateDeliveryModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Deliveries