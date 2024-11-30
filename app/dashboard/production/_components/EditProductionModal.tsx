'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Production, ProductionStatus } from '@/types/production'
import { updateProduction } from '@/app/actions/production'
import { getFormulas } from '@/app/actions/formula'
import { Loader2 } from 'lucide-react'

interface EditProductionModalProps {
  production: Production
  onClose: () => void
  onSuccess: () => void
}

export function EditProductionModal({ production, onClose, onSuccess }: EditProductionModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formulas, setFormulas] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: production.name,
    description: production.description || '',
    status: production.status,
    targetQuantity: production.targetQuantity?.toString() || '',
    estimatedCost: production.estimatedCost?.toString() || '',
    formulaId: production.formulaId
  })

  useEffect(() => {
    const fetchFormulas = async () => {
      const result = await getFormulas(production.businessId)
      if (result.success) {
        setFormulas(result.formulas)
      }
    }
    
    fetchFormulas()
  }, [production.businessId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      const result = await updateProduction(production.id, {
        name: formData.name,
        description: formData.description,
        businessId: production.businessId,
        formulaId: formData.formulaId,
        targetQuantity: formData.targetQuantity ? Number(formData.targetQuantity) : undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        status: formData.status
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Production updated successfully'
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
        description: error instanceof Error ? error.message : 'Failed to update production'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Production</DialogTitle>
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
            <Select
              value={formData.formulaId}
              onValueChange={(value: string) => 
                setFormData({ ...formData, formulaId: value })
              }
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
                  Updating...
                </>
              ) : (
                'Update Production'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}