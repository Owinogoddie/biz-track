import { create } from 'zustand'
import { Customer, Debt, InstallmentPlan } from '@prisma/client'

type CustomerWithRelations = Customer & {
  debts: Debt[]
  installmentPlans: InstallmentPlan[]
}

interface CustomerStore {
  customers: CustomerWithRelations[]
  setCustomers: (customers: CustomerWithRelations[]) => void
  addCustomer: (customer: CustomerWithRelations) => void
  updateCustomer: (customer: CustomerWithRelations) => void
  removeCustomer: (id: string) => void
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (customer) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === customer.id ? customer : c)),
    })),
  removeCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
}))