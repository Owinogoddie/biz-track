import { create } from 'zustand'
import { Production } from '@/types/production'

interface ProductionStore {
  productions: Production[]
  currentProduction: Production | null
  setProductions: (productions: Production[]) => void
  setCurrentProduction: (production: Production | null) => void
}

export const useProductionStore = create<ProductionStore>((set) => ({
  productions: [],
  currentProduction: null,
  setProductions: (productions: Production[]) => set({ productions }),
  setCurrentProduction: (production) => set({ currentProduction: production }),
}))