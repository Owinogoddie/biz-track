'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useProductionStore } from '@/store/useProductionStore'
import { getProductions } from '@/app/actions/production'
import { CreateProductionModal } from './_components/create-production-modal'
import { columns } from './_components/columns'

const Productions = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { productions, setProductions } = useProductionStore()

  useEffect(() => {
    const fetchProductions = async () => {
      if (currentBusiness) {
        const result = await getProductions(currentBusiness.id)
        if (result.success) {
          setProductions(result.productions)
        }
      }
    }
    
    fetchProductions()
  }, [currentBusiness, setProductions])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Start New Production
    </Button>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Production Management</h2>
        <p className="text-muted-foreground">
          Track and manage your production processes
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={productions} 
        searchKey="batchNumber"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateProductionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Productions