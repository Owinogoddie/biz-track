import { create } from 'zustand'
import { DeliveryRoute } from '@prisma/client'

interface DeliveryRouteStore {
  routes: DeliveryRoute[]
  setRoutes: (routes: DeliveryRoute[]) => void
  addRoute: (route: DeliveryRoute) => void
  updateRoute: (route: DeliveryRoute) => void
  removeRoute: (id: string) => void
}

export const useDeliveryRouteStore = create<DeliveryRouteStore>((set) => ({
  routes: [],
  setRoutes: (routes) => set({ routes }),
  addRoute: (route) =>
    set((state) => ({ routes: [...state.routes, route] })),
  updateRoute: (route) =>
    set((state) => ({
      routes: state.routes.map((r) => (r.id === route.id ? route : r)),
    })),
  removeRoute: (id) =>
    set((state) => ({
      routes: state.routes.filter((r) => r.id !== id),
    })),
}))