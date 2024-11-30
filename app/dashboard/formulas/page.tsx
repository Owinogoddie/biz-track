'use client'

import { useEffect } from 'react'
import { Plus, TestTube, Scale, Calculator, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useFormulaStore } from '@/store/useFormulaStore'
import { getFormulas } from '@/app/actions/formula'
import { CreateFormulaModal } from './_components/create-formula-modal'
import { columns } from './_components/columns'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'

export default function FormulasPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { formulas, setFormulas } = useFormulaStore()
  const { toast } = useToast()

  useEffect(() => {
    const fetchFormulas = async () => {
      if (currentBusiness) {
        const result = await getFormulas(currentBusiness.id)
        if (result.success) {
          setFormulas(result.formulas)
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error
          })
        }
      }
    }
    
    fetchFormulas()
  }, [currentBusiness, setFormulas, toast])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Formula
    </Button>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Production Formulas</h2>
        <p className="text-muted-foreground">
          Your master recipes that standardize production and ensure consistent quality across all batches
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TestTube className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Master Recipes</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Convert your expertise into precise recipes that anyone can follow to create perfect products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Scale className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Batch Scaling</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Automatically calculate exact quantities needed for any batch size, from samples to full production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Production Costs</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Know exactly how much each batch costs to make and set profitable pricing for your products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Material Planning</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Never run out of materials - calculate exactly what you need for upcoming production runs
            </p>
          </CardContent>
        </Card>
      </div>
      
      <DataTable 
        columns={columns} 
        data={formulas} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateFormulaModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={() => {
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}