import { create } from 'zustand'
import { FundingSource } from '@prisma/client'

interface FundingSourceStore {
  fundingSources: FundingSource[]
  setFundingSources: (fundingSources: FundingSource[]) => void
  addFundingSource: (fundingSource: FundingSource) => void
  updateFundingSource: (fundingSource: FundingSource) => void
  removeFundingSource: (id: string) => void
}

export const useFundingSourceStore = create<FundingSourceStore>((set) => ({
  fundingSources: [],
  setFundingSources: (fundingSources) => set({ fundingSources }),
  addFundingSource: (fundingSource) =>
    set((state) => ({ fundingSources: [...state.fundingSources, fundingSource] })),
  updateFundingSource: (fundingSource) =>
    set((state) => ({
      fundingSources: state.fundingSources.map((fs) => 
        fs.id === fundingSource.id ? fundingSource : fs
      ),
    })),
  removeFundingSource: (id) =>
    set((state) => ({
      fundingSources: state.fundingSources.filter((fs) => fs.id !== id),
    })),
}))

