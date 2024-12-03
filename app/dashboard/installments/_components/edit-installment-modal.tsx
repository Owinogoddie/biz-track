'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from "lucide-react"
import { updateInstallmentPlan } from '@/app/actions/installment'
import { useInstallmentStore } from '@/store/useInstallmentStore'


const installmentSchema = z.object({
  totalAmount: z.number().min(1, 'Amount must be greater than 0'),
  notes: z.string().optional(),
})

type InstallmentFormValues = z.infer<typeof installmentSchema>

interface EditInstallmentModalProps {
  installmentPlan: any
  onClose: () => void
  onSuccess: () => void
}

export function EditInstallmentModal({ installmentPlan, onClose, onSuccess }: EditInstallmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateInstallmentPlan: updateStore } = useInstallmentStore()

  const form = useForm<InstallmentFormValues>({
    resolver: zodResolver(installmentSchema),
    defaultValues: {
      totalAmount: installmentPlan.totalAmount,
      notes: installmentPlan.notes || '',
    },
  })

  async function onSubmit(data: InstallmentFormValues) {
    setIsLoading(true)
    const result = await updateInstallmentPlan({
      id: installmentPlan.id,
      ...data,
    })
    
    if (result.success) {
      updateStore({
        ...installmentPlan,
        ...data,
      })
      toast({
        title: 'Plan updated!',
        description: 'The installment plan has been updated successfully.',
      })
      onSuccess()
      onClose()
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
          <DialogTitle>Edit Installment Plan</DialogTitle>
          <DialogDescription>
            Update the details of this installment plan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount (KES)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter total amount" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Add any notes about this plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Plan
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}