'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { MaterialQualityStatus } from '@/types/production'
import { recordMaterialUsage } from '@/app/actions/production'

interface AddMaterialModalProps {
  productionId: string
  onClose: () => void
}

export function AddMaterialModal({ productionId, onClose }: AddMaterialModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    materialId: '',
    actualQuantity: '',
    unit: '',
    costPerUnit: '',
    notes: '',
    qualityStatus: 'GOOD' as MaterialQualityStatus,
    wasteQuantity: '',
    wasteReason: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await recordMaterialUsage({
      productionId,
      materialId: formData.materialId,
      actualQuantity: Number(formData.actualQuantity),
      unit: formData.unit,
      costPerUnit: Number(formData.costPerUnit),
      notes: formData.notes,
      qualityStatus: formData.qualityStatus,
      wasteQuantity: formData.wasteQuantity ? Number(formData.wasteQuantity) : undefined,
      wasteReason: formData.wasteReason
    })

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Material usage recorded successfully'
      })
      onClose()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to record material usage'
      })
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Material Usage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Material ID"
              value={formData.materialId}
              onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Quantity"
              value={formData.actualQuantity}
              onChange={(e) => setFormData({ ...formData, actualQuantity: e.target.value })}
            />
            <Input
              placeholder="Unit (kg, liters, etc)"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Cost per Unit"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
            />
          </div>

          <div>
            <Select
              value={formData.qualityStatus}
              onValueChange={(value: MaterialQualityStatus) => 
                setFormData({ ...formData, qualityStatus: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Quality Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="DAMAGED">Damaged</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="CONTAMINATED">Contaminated</SelectItem>
                <SelectItem value="BELOW_STANDARD">Below Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Waste Quantity"
              value={formData.wasteQuantity}
              onChange={(e) => setFormData({ ...formData, wasteQuantity: e.target.value })}
            />
            <Input
              placeholder="Waste Reason"
              value={formData.wasteReason}
              onChange={(e) => setFormData({ ...formData, wasteReason: e.target.value })}
            />
          </div>

          <div>
            <Textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Material</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
