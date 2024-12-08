import { create } from 'zustand'
import { Appointment, AppointmentStatus } from '@prisma/client'

interface AppointmentWithDetails {
  id: string
  serviceId: string
  customerId: string
  businessId: string
  startTime: Date
  endTime: Date
  status: AppointmentStatus
  notes: string | null
  service: {
    id: string
    name: string
    duration: number
    price: number
  }
  customer: {
    id: string
    name: string
    email: string | null
    phone: string | null
  }
  createdAt: Date
  updatedAt: Date
}

interface AppointmentStore {
  appointments: AppointmentWithDetails[]
  setAppointments: (appointments: AppointmentWithDetails[]) => void
  addAppointment: (appointment: AppointmentWithDetails) => void
  updateAppointment: (appointment: AppointmentWithDetails) => void
  removeAppointment: (id: string) => void
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
  updateAppointment: (appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) => 
        a.id === appointment.id ? appointment : a
      ),
    })),
  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
}))