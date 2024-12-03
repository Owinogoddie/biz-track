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
import { Loader2, Trash2 } from "lucide-react"
import { addInstallmentPayment, deleteInstallmentPayment } from '@/app/actions/installment'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const paymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  notes: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface AddPaymentModalProps {
  installmentPlanId: string
  onClose: () => void
  onSuccess: () => void
}

export function AddPaymentModal({ installmentPlanId, onClose, onSuccess }: AddPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeletingPayment, setIsDeletingPayment] = useState(false)
  const { toast } = useToast()

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      notes: '',
    },
  })

  async function onSubmit(data: PaymentFormValues) {
    setIsLoading(true)
    const result = await addInstallmentPayment(
      installmentPlanId,
      data.amount,
      data.notes
    )
    
    if (result.success) {
      toast({
        title: 'Payment added!',
        description: 'The payment has been recorded successfully.',
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

  const handleDeletePayment = async (paymentId: string) => {
    setIsDeletingPayment(true)
    const result = await deleteInstallmentPayment(paymentId)
    
    if (result.success) {
      toast({
        title: 'Payment deleted',
        description: 'The payment has been deleted successfully.',
      })
      onSuccess()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsDeletingPayment(false)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for this installment plan.
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
              Add Payment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}