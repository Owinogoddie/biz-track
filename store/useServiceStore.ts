
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
  