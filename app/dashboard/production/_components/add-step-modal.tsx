'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ProductionStatus } from '@/types/production'
import { MaterialQualityStatus, type Material } from '@/types/material'
import { useMaterialStore } from '@/store/useMaterialStore'
import { getMaterials } from '@/app/actions/material'
import { useBusinessStore } from '@/store/useBusinessStore'

interface AddStepModalProps {
  productionId: string
  onClose: () => void
}

interface MaterialUsageForm {
  materialId: string
  targetQuantity?: number
  actualQuantity: number
  unit: string
  notes?: string
  qualityStatus: MaterialQualityStatus
  wasteQuantity?: number
  wasteReason?: string
}

export function AddStepModal({ productionId, onClose }: AddStepModalProps) {
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { materials, setMaterials } = useMaterialStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNED' as ProductionStatus,
    orderIndex: 0,
    startDate: '',
    endDate: '',
    notes: '',
    result: ''
  })

  const [materialUsage, setMaterialUsage] = useState<MaterialUsageForm>({
    materialId: '',
    targetQuantity: 0,
    actualQuantity: 0,
    unit: '',
    notes: '',
    qualityStatus: 'GOOD',
    wasteQuantity: 0,
    wasteReason: ''
  })

  useEffect(() => {
    const fetchMaterials = async () => {
      if (currentBusiness) {
        setIsLoading(true)
        const result = await getMaterials(currentBusiness.id)
        if (result.success && result.materials) {
          setMaterials(result.materials)
        }
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [currentBusiness, setMaterials])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!materialUsage.materialId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a material'
      })
      return
    }

    // TODO: Implement step creation with material usage
    toast({
      title: 'Success',
      description: 'Production step added successfully'
    })
    onClose()
  }

  const selectedMaterial = materials.find(m => m.id === materialUsage.materialId)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Production Step</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Step Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Select
              value={formData.status}
              onValueChange={(value: ProductionStatus) => 
                setFormData({ ...formData, status: value })
              }
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

            <Input
              type="number"
              placeholder="Order Index"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                type="datetime-local"
                placeholder="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Material Usage</h3>
            
            <Select
              value={materialUsage.materialId}
              onValueChange={(value: string) => {
                const material = materials.find(m => m.id === value)
                setMaterialUsage(prev => ({
                  ...prev,
                  materialId: value,
                  unit: material?.unit || ''
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedMaterial && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Target Quantity"
                    value={materialUsage.targetQuantity}
                    onChange={(e) => setMaterialUsage({ ...materialUsage, targetQuantity: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Actual Quantity"
                    value={materialUsage.actualQuantity}
                    onChange={(e) => setMaterialUsage({ ...materialUsage, actualQuantity: Number(e.target.value) })}
                  />
                </div>

                <Select
                  value={materialUsage.qualityStatus}
                  onValueChange={(value: MaterialQualityStatus) => 
                    setMaterialUsage({ ...materialUsage, qualityStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quality Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="DEFECTIVE">Defective</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="CONTAMINATED">Contaminated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Waste Quantity"
                    value={materialUsage.wasteQuantity}
                    onChange={(e) => setMaterialUsage({ ...materialUsage, wasteQuantity: Number(e.target.value) })}
                  />
                  <Input
                    placeholder="Waste Reason"
                    value={materialUsage.wasteReason}
                    onChange={(e) => setMaterialUsage({ ...materialUsage, wasteReason: e.target.value })}
                  />
                </div>

                <Textarea
                  placeholder="Material Usage Notes"
                  value={materialUsage.notes}
                  onChange={(e) => setMaterialUsage({ ...materialUsage, notes: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Step'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}