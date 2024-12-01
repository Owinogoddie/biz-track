"use client"

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentPeriod } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useWorkerStore } from '@/store/useWorkerStore'
import { createWorker } from '@/app/actions/worker'
import { Loader2 } from "lucide-react"

const workerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.string().optional(),
  paymentPeriod: z.nativeEnum(PaymentPeriod),
  hourlyRate: z.number().optional(),
  dailyRate: z.number().optional(),
  monthlyRate: z.number().optional(),
})

type WorkerFormValues = z.infer<typeof workerSchema>

interface CreateWorkerModalProps {
  onClose?: () => void
}

export function CreateWorkerModal({ onClose }: CreateWorkerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addWorker } = useWorkerStore()

  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      paymentPeriod: PaymentPeriod.HOURLY,
    },
  })

  const paymentPeriod = form.watch('paymentPeriod')

 
  async function onSubmit(data: WorkerFormValues) {
    setIsLoading(true)
    try {
      const workerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        paymentPeriod: data.paymentPeriod,
        hourlyRate: data.hourlyRate,
        dailyRate: data.dailyRate,
        monthlyRate: data.monthlyRate,
      }

      const result = await createWorker(workerData)
      
      if (result.success) {
        addWorker(result.worker)
        toast({
          title: 'Worker created!',
          description: 'Worker has been created successfully.',
        })
        onClose?.()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create worker</DialogTitle>
          <DialogDescription>
            Add a new worker to your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PaymentPeriod.HOURLY}>Hourly</SelectItem>
                      <SelectItem value={PaymentPeriod.DAILY}>Daily</SelectItem>
                      <SelectItem value={PaymentPeriod.MONTHLY}>Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {paymentPeriod === PaymentPeriod.HOURLY && (
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter hourly rate" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {paymentPeriod === PaymentPeriod.DAILY && (
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter daily rate" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {paymentPeriod === PaymentPeriod.MONTHLY && (
              <FormField
                control={form.control}
                name="monthlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter monthly rate" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Worker
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}