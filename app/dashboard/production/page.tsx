'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { columns } from './_components/columns'
import { CreateProductionModal } from './_components/create-production-modal'
import { Production } from '@/types/production'
import { useToast } from '@/hooks/use-toast'
import { getProductions } from '@/app/actions/production'

const ProductionPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [productions, setProductions] = useState<Production[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { toast } = useToast()

  const fetchProductions = async () => {
    if (currentBusiness) {
      setIsLoading(true)
      try {
        const result = await getProductions(currentBusiness.id)
        if (result.success && result.productions) {
          setProductions(result.productions)
        } else {
          throw new Error(result.error || 'Failed to fetch productions')
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch productions'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchProductions()
  }, [currentBusiness])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Start Production
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
        searchKey="name"
        toolbar={toolbar}
        // isLoading={isLoading}
      />
      
      {showCreateModal && (
        <CreateProductionModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={fetchProductions}
        />
      )}
    </div>
  )
}

export default ProductionPage