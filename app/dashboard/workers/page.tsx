'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useWorkerStore } from '@/store/useWorkerStore'
import { getWorkers } from '@/app/actions/worker'
import { CreateWorkerModal } from './_components/create-worker-modal'
import { columns } from './_components/columns'

const Workers = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { workers, setWorkers } = useWorkerStore()

  useEffect(() => {
    const fetchWorkers = async () => {
      const result = await getWorkers()
      if (result.success) {
        setWorkers(result.workers)
      }
    }
    
    fetchWorkers()
  }, [setWorkers])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Worker
    </Button>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Workers</h2>
        <p className="text-muted-foreground">
          Manage your workforce and their payment details
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={workers} 
        searchKey="firstName"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateWorkerModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Workers