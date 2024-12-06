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
import { useBusinessStore } from '@/store/useBusinessStore'
import { useFundingSourceStore } from '@/store/useFundingSourceStore'
import { createFundingSource, CreateFundingSourceInput } from '@/app/actions/funding-source'
import { Loader2 } from "lucide-react"
import { FundingType } from '@prisma/client'

const fundingSourceSchema = z.object({
  type: z.nativeEnum(FundingType),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  provider: z.string().min(2, 'Provider must be at least 2 characters'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  status: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

type FundingSourceFormValues = z.infer<typeof fundingSourceSchema>

interface AddFundingSourceModalProps {
  onClose?: () => void
}

export function AddFundingSourceModal({ onClose }: AddFundingSourceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addFundingSource } = useFundingSourceStore()

  const form = useForm<FundingSourceFormValues>({
    resolver: zodResolver(fundingSourceSchema),
    defaultValues: {
      amount: 0,
    },
  })

  async function onSubmit(data: FundingSourceFormValues) {
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected',
      })
      return
    }

    setIsLoading(true)
    
    // Create the input object with all required fields
    const fundingSourceInput: CreateFundingSourceInput = {
      type: data.type,
      name: data.name,
      provider: data.provider,
      amount: data.amount,
      businessId: currentBusiness.id,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    }

    const result = await createFundingSource(fundingSourceInput)
    
    if (result.success) {
      addFundingSource(result.fundingSource)
      toast({
        title: 'Funding source added!',
        description: 'Your funding source has been added successfully.',
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
          <DialogTitle>Add Funding Source</DialogTitle>
          <DialogDescription>
            Add a new source of funding for your business.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOAN">Loan</SelectItem>
                      <SelectItem value="INVESTMENT">Investment</SelectItem>
                      <SelectItem value="GIFT_CARD">Gift Card</SelectItem>
                      <SelectItem value="GRANT">Grant</SelectItem>
                      <SelectItem value="SAVINGS">Savings</SelectItem>
                      <SelectItem value="SALE">Sale</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business Expansion Loan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., KCB Bank" {...field} />
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
                      step="0.01"
                      placeholder="Enter amount" 
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add details about this funding source" {...field} />
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
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REPAID">Repaid</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Funding Source
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}