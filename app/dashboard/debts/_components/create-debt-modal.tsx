import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDebtStore } from '@/store/useDebtStore'
import { createDebt } from '@/app/actions/debt'
import { Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { createTransaction } from '@/app/actions/transaction'
import { TransactionStatus, TransactionType } from '@prisma/client'

const debtSchema = z.object({
    customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
    customerPhoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
    amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
    dueDate: z.date(),
    notes: z.string().optional(),
  })

type DebtFormValues = z.infer<typeof debtSchema>

interface CreateDebtModalProps {
  onClose?: () => void
}

export function CreateDebtModal({ onClose }: CreateDebtModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addDebt } = useDebtStore()

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      customerName: '',
      customerPhoneNumber: '',
      amount: 0,
      notes: '',
      dueDate: new Date(),
    },
  })
  

  async function onSubmit(data: DebtFormValues) {
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected',
      })
      return
    }

    setIsLoading(true)
    
    // First create a transaction
    const transaction = await createTransaction({
        businessId: currentBusiness.id,
        total: data.amount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.PENDING,
      })
    
    if (!transaction.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: transaction.error,
      })
      setIsLoading(false)
      return
    }

    const result = await createDebt({
      amount: data.amount,
      dueDate: data.dueDate,
      notes: data.notes,
      customerName: data.customerName,
      customerPhoneNumber: data.customerPhoneNumber,
      transactionId: transaction.transaction.id,
      businessId: currentBusiness.id,
    })
    
    if (result.success) {
      addDebt(result.debt)
      toast({
        title: 'Debt created!',
        description: 'The debt has been recorded successfully.',
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
          <DialogTitle>Record new debt</DialogTitle>
          <DialogDescription>
            Add a new customer debt record here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter debt amount" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Textarea 
                      placeholder="Add any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Debt Record
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}