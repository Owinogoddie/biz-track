'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { ProductionStatus } from '@/types/production'
import { createProduction } from '@/app/actions/production'
import { getFormulas } from '@/app/actions/formula'
import { Loader2 } from 'lucide-react'
import { ProductionFormula } from '@prisma/client'

interface CreateProductionModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function CreateProductionModal({ onClose, onSuccess }: CreateProductionModalProps) {
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formulas, setFormulas] = useState<ProductionFormula[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNED' as ProductionStatus,
    targetQuantity: '',
    estimatedCost: '',
    formulaId: ''
  })

  useEffect(() => {
    const loadFormulas = async () => {
      if (currentBusiness) {
        try {
          const result = await getFormulas(currentBusiness.id)
          if (result.success) {
            setFormulas(result.formulas)
          }
        } catch (error) {
          console.error('Failed to load formulas:', error)
        }
      }
    }
    loadFormulas()
  }, [currentBusiness])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected'
      })
      return
    }

    if (!formData.formulaId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a formula'
      })
      return
    }

    try {
      setIsLoading(true)
      const result = await createProduction({
        name: formData.name,
        description: formData.description,
        businessId: currentBusiness.id,
        formulaId: formData.formulaId,
        targetQuantity: formData.targetQuantity ? Number(formData.targetQuantity) : undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Production created successfully'
        })
        onSuccess()
        onClose()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create production'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Production</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Production Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Select
              value={formData.formulaId}
              onValueChange={(value) => setFormData({ ...formData, formulaId: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Formula" />
              </SelectTrigger>
              <SelectContent>
                {formulas.map((formula) => (
                  <SelectItem key={formula.id} value={formula.id}>
                    {formula.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.status}
              onValueChange={(value: ProductionStatus) => 
                setFormData({ ...formData, status: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANNED">Planned</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              type="number"
              placeholder="Target Quantity"
              value={formData.targetQuantity}
              onChange={(e) => setFormData({ ...formData, targetQuantity: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Estimated Cost"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Production'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}