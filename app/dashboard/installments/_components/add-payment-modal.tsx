"use client"

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
import { addInstallmentPayment, updateInstallmentPayment } from '@/app/actions/installment'

const paymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  notes: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface AddPaymentModalProps {
  installmentPlanId: string
  onClose: () => void
  onSuccess: () => void
  existingPayment?: any
  planStatus?: string
}

export function AddPaymentModal({ 
  installmentPlanId, 
  onClose, 
  onSuccess,
  existingPayment,
  planStatus
}: AddPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // If plan is completed and we're not editing an existing payment, show error and close
  if (planStatus === 'COMPLETED' && !existingPayment) {
    toast({
      variant: 'destructive',
      title: 'Cannot add payment',
      description: 'This installment plan is already completed.',
    })
    onClose()
    return null
  }

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: existingPayment ? existingPayment.amount : 0,
      notes: existingPayment?.notes || '',
    },
  })

  async function onSubmit(data: PaymentFormValues) {
    setIsLoading(true)
    let result

    if (existingPayment) {
      result = await updateInstallmentPayment(existingPayment.id, data.amount, data.notes)
    } else {
      result = await addInstallmentPayment(
        installmentPlanId,
        data.amount,
        data.notes
      )
    }
    
    if (result.success) {
      toast({
        title: existingPayment ? 'Payment updated!' : 'Payment added!',
        description: existingPayment 
          ? 'The payment has been updated successfully.'
          : 'The payment has been recorded successfully.',
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
          <DialogTitle>{existingPayment ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
          <DialogDescription>
            {existingPayment 
              ? 'Modify the existing payment record.'
              : 'Record a new payment for this installment plan.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (KES)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter payment amount" 
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
                    <Input placeholder="Add any notes about this payment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingPayment ? 'Update Payment' : 'Add Payment'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}