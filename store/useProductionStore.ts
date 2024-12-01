import { create } from 'zustand'
import { Production } from '@prisma/client'

interface ProductionWithRelations extends Production {
  stages: any[]
  product: any | null
}

interface ProductionStore {
  productions: ProductionWithRelations[]
  setProductions: (productions: ProductionWithRelations[]) => void
  addProduction: (production: ProductionWithRelations) => void
  updateProduction: (production: ProductionWithRelations) => void
  removeProduction: (id: string) => void
}

export const useProductionStore = create<ProductionStore>((set) => ({
  productions: [],
  setProductions: (productions) => set({ productions }),
  addProduction: (production) =>
    set((state) => ({ productions: [...state.productions, production] })),
  updateProduction: (production) =>
    set((state) => ({
      productions: state.productions.map((p) => (p.id === production.id ? production : p)),
    })),
  removeProduction: (id) =>
    set((state) => ({
      productions: state.productions.filter((p) => p.id !== id),
    })),
}))