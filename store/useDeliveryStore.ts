import { create } from 'zustand'
import { DeliveryTransaction } from '@prisma/client'

interface DeliveryStore {
  deliveries: DeliveryTransaction[]
  setDeliveries: (deliveries: DeliveryTransaction[]) => void
  addDelivery: (delivery: DeliveryTransaction) => void
  updateDelivery: (delivery: DeliveryTransaction) => void
  removeDelivery: (id: string) => void
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveries: [],
  setDeliveries: (deliveries) => set({ deliveries }),
  addDelivery: (delivery) =>
    set((state) => ({ deliveries: [...state.deliveries, delivery] })),
  updateDelivery: (delivery) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) => (d.id === delivery.id ? delivery : d)),
    })),
  removeDelivery: (id) =>
    set((state) => ({
      deliveries: state.deliveries.filter((d) => d.id !== id),
    })),
}))