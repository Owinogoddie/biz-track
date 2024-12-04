import { create } from 'zustand'
import { Expenditure } from '@prisma/client'

interface ExpenditureStore {
  expenditures: Expenditure[]
  setExpenditures: (expenditures: Expenditure[]) => void
  addExpenditure: (expenditure: Expenditure) => void
  updateExpenditure: (expenditure: Expenditure) => void
  removeExpenditure: (id: string) => void
}

export const useExpenditureStore = create<ExpenditureStore>((set) => ({
  expenditures: [],
  setExpenditures: (expenditures) => set({ expenditures }),
  addExpenditure: (expenditure) =>
    set((state) => ({
      expenditures: [expenditure, ...state.expenditures],
    })),
  updateExpenditure: (expenditure) =>
    set((state) => ({
      expenditures: state.expenditures.map((e) =>
        e.id === expenditure.id ? expenditure : e
      ),
    })),
  removeExpenditure: (id) =>
    set((state) => ({
      expenditures: state.expenditures.filter((e) => e.id !== id),
    })),
}))