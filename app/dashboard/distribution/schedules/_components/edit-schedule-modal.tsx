'use client'
'use client'
import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeliverySchedule, DistributionClient, DeliveryRoute, Frequency } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { useDeliveryScheduleStore } from '@/store/useDeliveryScheduleStore'
import { updateDeliverySchedule } from '@/app/actions/deliverySchedule'
import { Loader2 } from "lucide-react"

const scheduleSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  routeId: z.string().min(1, 'Route is required'),
  frequency: z.nativeEnum(Frequency),
  dayOfWeek: z.string().optional(),
  dayOfMonth: z.string().optional(),
  timeWindow: z.string().optional(),
})

type ScheduleFormValues = z.infer<typeof scheduleSchema>

interface EditScheduleModalProps {
  schedule: DeliverySchedule
  clients: DistributionClient[]
  routes: DeliveryRoute[]
  onClose?: () => void
}

export function EditScheduleModal({ schedule, clients, routes, onClose }: EditScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateSchedule } = useDeliveryScheduleStore()

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      clientId: schedule.clientId,
      routeId: schedule.routeId,
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek?.toString() || '',
      dayOfMonth: schedule.dayOfMonth?.toString() || '',
      timeWindow: schedule.timeWindow || '',
    },
  })

  async function onSubmit(data: ScheduleFormValues) {
    setIsLoading(true)
    const result = await updateDeliverySchedule(schedule.id, {
      ...data,
      businessId: schedule.businessId,
      dayOfWeek: data.dayOfWeek ? parseInt(data.dayOfWeek) : undefined,
      dayOfMonth: data.dayOfMonth ? parseInt(data.dayOfMonth) : undefined,
    })
    
    if (result.success) {
      updateSchedule(result.schedule)
      toast({
        title: 'Schedule updated!',
        description: 'Your schedule has been updated successfully.',
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
          <DialogTitle>Edit schedule</DialogTitle>
          <DialogDescription>
            Make changes to your schedule here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
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
              name="routeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name}
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
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Frequency).map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq.replace('_', ' ')}
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
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day of week" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                        .map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}
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
              name="dayOfMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Month</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="31" 
                      placeholder="Enter day of month" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Window</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 9:00 AM - 11:00 AM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Schedule
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}