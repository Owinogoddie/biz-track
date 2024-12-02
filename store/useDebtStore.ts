import { create } from 'zustand'
import { Debt, Transaction, Payment } from '@prisma/client'

interface DebtWithTransaction extends Debt {
  transaction: Transaction & {
    payments: Payment[]
  }
}

interface DebtStore {
  debts: DebtWithTransaction[]
  setDebts: (debts: DebtWithTransaction[]) => void
  addDebt: (debt: DebtWithTransaction) => void
  updateDebt: (debt: DebtWithTransaction) => void
  removeDebt: (id: string) => void
}

export const useDebtStore = create<DebtStore>((set) => ({
  debts: [],
  setDebts: (debts) => set({ debts }),
  addDebt: (debt) =>
    set((state) => ({ debts: [...state.debts, debt] })),
  updateDebt: (debt) =>
    set((state) => ({
      debts: state.debts.map((d) => (d.id === debt.id ? debt : d)),
    })),
  removeDebt: (id) =>
    set((state) => ({
      debts: state.debts.filter((d) => d.id !== id),
    })),
}))