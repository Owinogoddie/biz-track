'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InventoryAsset } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useInventoryStore } from '@/store/useInventoryStore'
import { createMaintenanceLog } from '@/app/actions/inventory'
import { Loader2 } from "lucide-react"

const maintenanceSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  date: z.string(),
  cost: z.string().optional(),
  performedBy: z.string().optional(),
})

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>

interface MaintenanceLogModalProps {
  asset: InventoryAsset
  onClose?: () => void
}

export function MaintenanceLogModal({ asset, onClose }: MaintenanceLogModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addMaintenanceLog } = useInventoryStore()

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      description: '',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      performedBy: '',
    },
  })

  async function onSubmit(data: MaintenanceFormValues) {
    setIsLoading(true)
    const result = await createMaintenanceLog({
      description: data.description,
      date: new Date(data.date),
      cost: data.cost ? parseFloat(data.cost) : undefined,
      performedBy: data.performedBy,
      assetId: asset.id,
    })
    
    if (result.success) {
      addMaintenanceLog(result.log)
      toast({
        title: 'Maintenance logged!',
        description: 'Maintenance log has been created successfully.',
      })
      onClose?.()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsLoading(false)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Maintenance</DialogTitle>
          <DialogDescription>
            Record maintenance activity for {asset.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the maintenance performed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter cost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="performedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performed By</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Maintenance
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}