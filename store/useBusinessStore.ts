import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Business } from '@prisma/client'

interface BusinessStore {
  currentBusiness: Business | null
  businesses: Business[]
  hasBusiness: boolean
  setCurrentBusiness: (business: Business | null) => void
  setBusinesses: (businesses: Business[]) => void
  setHasBusiness: (value: boolean) => void
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set) => ({
      currentBusiness: null,
      businesses: [],
      hasBusiness: false,
      setCurrentBusiness: (business) => set({ currentBusiness: business }),
      setBusinesses: (businesses) => set({ businesses }),
      setHasBusiness: (value) => set({ hasBusiness: value }),
    }),
    {
      name: 'business-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        currentBusiness: state.currentBusiness,
        businesses: state.businesses,
        hasBusiness: state.hasBusiness 
      }),
    }
  )
)