import { create } from 'zustand'
import { Business } from '@prisma/client'

interface BusinessStore {
  currentBusiness: Business | null
  businesses: Business[]
  hasBusiness: boolean
  setCurrentBusiness: (business: Business | null) => void
  setBusinesses: (businesses: Business[]) => void
  setHasBusiness: (value: boolean) => void
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  currentBusiness: null,
  businesses: [],
  hasBusiness: false,
  setCurrentBusiness: (business) => set({ currentBusiness: business }),
  setBusinesses: (businesses) => set({ businesses }),
  setHasBusiness: (value) => set({ hasBusiness: value }),
}))