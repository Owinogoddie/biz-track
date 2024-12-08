'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDistributionClientStore } from '@/store/useDistributionClientStore'
import { getDistributionClients } from '@/app/actions/distributionClient'
import { CreateClientModal } from './_components/create-client-modal'
import { columns } from './_components/columns'

const DistributionClients = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { clients, setClients } = useDistributionClientStore()

  useEffect(() => {
    const fetchClients = async () => {
      if (currentBusiness) {
        const result = await getDistributionClients(currentBusiness.id)
        if (result.success) {
          setClients(result.clients)
        }
      }
    }
    
    fetchClients()
  }, [currentBusiness, setClients])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Client
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Distribution Clients</h2>
        <p className="text-muted-foreground">
          Manage your distribution clients and their information here.
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={clients} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateClientModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default DistributionClients