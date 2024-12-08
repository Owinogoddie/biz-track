import { create } from 'zustand'
import { DeliverySchedule, Frequency } from '@prisma/client'

interface DeliveryScheduleStore {
  schedules: DeliverySchedule[]
  setSchedules: (schedules: DeliverySchedule[]) => void
  addSchedule: (schedule: DeliverySchedule) => void
  updateSchedule: (schedule: DeliverySchedule) => void
  removeSchedule: (id: string) => void
}

export const useDeliveryScheduleStore = create<DeliveryScheduleStore>((set) => ({
  schedules: [],
  setSchedules: (schedules) => set({ schedules }),
  addSchedule: (schedule) =>
    set((state) => ({ schedules: [...state.schedules, schedule] })),
  updateSchedule: (schedule) =>
    set((state) => ({
      schedules: state.schedules.map((s) => (s.id === schedule.id ? schedule : s)),
    })),
  removeSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
}))