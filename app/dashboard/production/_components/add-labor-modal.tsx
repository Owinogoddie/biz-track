'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { LaborTaskType } from '@/types/production'
import { recordLabor } from '@/app/actions/production'

interface AddLaborModalProps {
  productionId: string
  onClose: () => void
}

export function AddLaborModal({ productionId, onClose }: AddLaborModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    workerId: '',
    workerName: '',
    taskType: 'PROCESSING' as LaborTaskType,
    startTime: '',
    endTime: '',
    hourlyRate: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.workerId || !formData.workerName || !formData.startTime || !formData.hourlyRate) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields'
      })
      return
    }

    try {
      const result = await recordLabor({
        productionId,
        workerId: formData.workerId,
        workerName: formData.workerName,
        taskType: formData.taskType,
        startTime: new Date(formData.startTime),
        endTime: formData.endTime ? new Date(formData.endTime) : undefined,
        hourlyRate: parseFloat(formData.hourlyRate),
        notes: formData.notes
      })

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Labor record added successfully'
        })
        onClose()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to add labor record'
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred'
      })
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Labor Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Worker ID"
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
              required
            />
            <Input
              placeholder="Worker Name"
              value={formData.workerName}
              onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
              required
            />
          </div>

          <div>
            <Select
              value={formData.taskType}
              onValueChange={(value: LaborTaskType) => 
                setFormData({ ...formData, taskType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Task Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PREPARATION">Preparation</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="QUALITY_CHECK">Quality Check</SelectItem>
                <SelectItem value="PACKAGING">Packaging</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="CLEANING">Cleaning</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              placeholder="Start Time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              type="datetime-local"
              placeholder="End Time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>

          <div>
            <Input
              type="number"
              placeholder="Hourly Rate"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              required
              min="0"
              step="0.01"
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
            <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit">Add Labor Record</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}