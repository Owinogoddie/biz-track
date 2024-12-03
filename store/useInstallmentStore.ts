import { create } from 'zustand'

interface InstallmentPlan {
  id: string
  totalAmount: number
  paidAmount: number
  startDate: Date
  endDate: Date | null
  status: string
  notes: string | null
  productId: string
  customerId: string
  businessId: string
  product: { name: string }
  customer: { name: string }
}

interface InstallmentStore {
  installmentPlans: InstallmentPlan[]
  setInstallmentPlans: (plans: InstallmentPlan[]) => void
  addInstallmentPlan: (plan: InstallmentPlan) => void
  updateInstallmentPlan: (plan: InstallmentPlan) => void
  removeInstallmentPlan: (id: string) => void
}

export const useInstallmentStore = create<InstallmentStore>((set) => ({
  installmentPlans: [],
  setInstallmentPlans: (plans) => set({ installmentPlans: plans }),
  addInstallmentPlan: (plan) =>
    set((state) => ({ installmentPlans: [...state.installmentPlans, plan] })),
  updateInstallmentPlan: (plan) =>
    set((state) => ({
      installmentPlans: state.installmentPlans.map((p) => 
        p.id === plan.id ? plan : p
      ),
    })),
  removeInstallmentPlan: (id) =>
    set((state) => ({
      installmentPlans: state.installmentPlans.filter((p) => p.id !== id),
    })),
}))