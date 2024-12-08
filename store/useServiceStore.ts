
import { create } from 'zustand'
import { Service } from '@prisma/client'

interface ServiceWithCategory {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  businessId: string
  categoryId: string | null
  category: {
    id: string
    name: string
  } | null
  createdAt: Date
  updatedAt: Date
}

interface ServiceStore {
  services: ServiceWithCategory[]
  setServices: (services: ServiceWithCategory[]) => void
  addService: (service: ServiceWithCategory) => void
  updateService: (service: ServiceWithCategory) => void
  removeService: (id: string) => void
}

export const useServiceStore = create<ServiceStore>((set) => ({
    services: [],
    setServices: (services) => set({ services }),
    addService: (service) =>
      set((state) => ({ services: [...state.services, service] })),
    updateService: (service) =>
      set((state) => ({
        services: state.services.map((s) => (s.id === service.id ? service : s)),
      })),
    removeService: (id) =>
      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
      })),
  }))
   types/appointment.ts
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
