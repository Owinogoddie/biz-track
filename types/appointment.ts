import { z } from 'zod'

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
}

export interface RecurringPattern {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  interval: number
  endDate: Date
}

export const recurringPatternSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  interval: z.number().min(1),
  endDate: z.date()
})

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  customerId: z.string().min(1, 'Customer is required'),
  startTime: z.date({ required_error: 'Start time is required' }),
  endTime: z.date({ required_error: 'End time is required' }),
  notes: z.string().optional(),
  recurringPattern: recurringPatternSchema.optional()
})