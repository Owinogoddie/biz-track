'use client'
import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useDeliveryStore } from '@/store/useDeliveryStore'
import { updateDeliveryTransaction } from '@/app/actions/delivery'
import { DeliveryTransaction, TransactionStatus } from '@prisma/client'
import { Loader2 } from "lucide-react"

const deliverySchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'PARTIAL', 'CANCELLED']),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  notes: z.string().optional(),
})

type DeliveryFormValues = z.infer<typeof deliverySchema>

interface EditDeliveryModalProps {
  delivery: DeliveryTransaction
  onClose?: () => void
}

export function EditDeliveryModal({ delivery, onClose }: EditDeliveryModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateDelivery } = useDeliveryStore()

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      status: delivery.status,
      deliveryDate: new Date(delivery.deliveryDate).toISOString().slice(0, 16),
      notes: delivery.notes || '',
    },
  })

  async function onSubmit(data: DeliveryFormValues) {
    setIsLoading(true)
    const result = await updateDeliveryTransaction(delivery.id, {
      ...data,
      deliveryDate: new Date(data.deliveryDate),
    })
    
    if (result.success) {
      updateDelivery(result.delivery)
      toast({
        title: 'Delivery updated!',
        description: 'Your delivery has been updated successfully.',
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
          <DialogTitle>Edit Delivery</DialogTitle>
          <DialogDescription>
            Make changes to your delivery record here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TransactionStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any notes about this delivery" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Delivery
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}