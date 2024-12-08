'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useServiceStore } from '@/store/useServiceStore'
import { getServices } from '@/app/actions/service'
import { CreateServiceModal } from './_components/create-service-modal'
import { columns } from './_components/columns'

const Services = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { services, setServices } = useServiceStore()

  useEffect(() => {
    const fetchServices = async () => {
      if (currentBusiness) {
        const result = await getServices(currentBusiness.id)
        if (result.success) {
          setServices(result.services)
        }
      }
    }
    
    fetchServices()
  }, [currentBusiness, setServices])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Service
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="section-heading">
        <h2>Services</h2>
        <p>Manage your services here</p>
      </div>
      
      <DataTable
        columns={columns}
        data={services}
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateServiceModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Services