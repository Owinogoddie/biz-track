'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { QualityCheckType, QualityStatus } from '@/types/production'
import { recordQualityCheck } from '@/app/actions/production'

interface AddQualityCheckModalProps {
  productionId: string
  onClose: () => void
}

export function AddQualityCheckModal({ productionId, onClose }: AddQualityCheckModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    checkType: 'VISUAL_INSPECTION' as QualityCheckType,
    checkedBy: '',
    status: 'PENDING' as QualityStatus,
    parameters: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await recordQualityCheck({
      productionId,
      checkType: formData.checkType,
      checkedBy: formData.checkedBy,
      status: formData.status,
      parameters: formData.parameters ? JSON.parse(formData.parameters) : undefined,
      notes: formData.notes
    })

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Quality check recorded successfully'
      })
      onClose()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to record quality check'
      })
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Quality Check</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select
              value={formData.checkType}
              onValueChange={(value: QualityCheckType) => 
                setFormData({ ...formData, checkType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Check Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VISUAL_INSPECTION">Visual Inspection</SelectItem>
                <SelectItem value="MEASUREMENT">Measurement</SelectItem>
                <SelectItem value="CHEMICAL_TEST">Chemical Test</SelectItem>
                <SelectItem value="TASTE_TEST">Taste Test</SelectItem>
                <SelectItem value="EQUIPMENT_CHECK">Equipment Check</SelectItem>
                <SelectItem value="SAFETY_CHECK">Safety Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Checked By"
              value={formData.checkedBy}
              onChange={(e) => setFormData({ ...formData, checkedBy: e.target.value })}
            />
          </div>

          <div>
            <Select
              value={formData.status}
              onValueChange={(value: QualityStatus) => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PASSED">Passed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Parameters (JSON format)"
              value={formData.parameters}
              onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
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
            <Button type="submit">Add Quality Check</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}