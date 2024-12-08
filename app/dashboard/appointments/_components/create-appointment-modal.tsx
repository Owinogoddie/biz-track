'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { createAppointment, CreateAppointmentInput } from '@/app/actions/appointment'
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addMinutes } from 'date-fns'
import { generateTimeSlots } from '@/lib/appointment-utils'
import { appointmentSchema, TimeSlot, RecurringPattern } from '@/types/appointment'
import { Switch } from '@/components/ui/switch'

type AppointmentFormValues = z.infer<typeof appointmentSchema>

interface CreateAppointmentModalProps {
  onClose?: () => void
}

export function CreateAppointmentModal({ onClose }: CreateAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isRecurring, setIsRecurring] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addAppointment } = useAppointmentStore()

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      serviceId: '',
      customerId: '',
      notes: '',
      recurringPattern: {
        frequency: 'WEEKLY',
        interval: 1,
        endDate: new Date()
      }
    },
  })

  const onDateSelect = async (date: Date) => {
    setSelectedDate(date)
    if (currentBusiness) {
      const slots = await generateTimeSlots(date, currentBusiness.id)
      setTimeSlots(slots)
    }
  }

  async function onSubmit(data: AppointmentFormValues) {
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected',
      })
      return
    }

    if (!data.startTime || !data.endTime || !data.serviceId || !data.customerId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      })
      return
    }

    let recurringPattern: RecurringPattern | undefined

    if (isRecurring) {
      if (!data.recurringPattern?.frequency || !data.recurringPattern?.interval || !data.recurringPattern?.endDate) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please fill in all recurring appointment fields',
        })
        return
      }
      recurringPattern = {
        frequency: data.recurringPattern.frequency,
        interval: data.recurringPattern.interval,
        endDate: data.recurringPattern.endDate
      }
    }

    const appointmentData: CreateAppointmentInput = {
      serviceId: data.serviceId,
      customerId: data.customerId,
      businessId: currentBusiness.id,
      startTime: data.startTime,
      endTime: data.endTime,
      notes: data.notes,
      recurringPattern
    }

    setIsLoading(true)
    const result = await createAppointment(appointmentData)
    
    if (result.success) {
      if (Array.isArray(result.appointments)) {
        result.appointments.forEach(addAppointment)
        toast({
          title: 'Recurring appointments created!',
          description: `${result.appointments.length} appointments have been created successfully.`,
        })
      } else {
        addAppointment(result.appointment)
        toast({
          title: 'Appointment created!',
          description: 'Your appointment has been created successfully.',
        })
      }
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
          <DialogTitle>Create appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Add service options here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Add customer options here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    className="rounded-md border"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedDate && timeSlots.length > 0 && (
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const startTime = new Date(value)
                        field.onChange(startTime)
                        form.setValue('endTime', addMinutes(startTime, 30))
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((slot, index) => (
                          <SelectItem
                            key={index}
                            value={slot.startTime.toISOString()}
                            disabled={!slot.available}
                          >
                            {format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}
                            {!slot.available && ' (Unavailable)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex items-center space-x-2">
              <Switch
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
              <span>Make this a recurring appointment</span>
            </div>

            {isRecurring && (
              <>
                <FormField
                  control={form.control}
                  name="recurringPattern.frequency"
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
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurringPattern.interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurringPattern.endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < selectedDate!}
                        className="rounded-md border"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Add any notes here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Appointment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}