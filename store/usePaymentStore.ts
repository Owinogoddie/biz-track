import { create } from 'zustand'
import { Payment } from '@prisma/client'

interface PaymentStore {
  payments: Payment[]
  setPayments: (payments: Payment[]) => void
  addPayment: (payment: Payment) => void
  updatePayment: (payment: Payment) => void
  removePayment: (id: string) => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({ payments: [...state.payments, payment] })),
  updatePayment: (payment) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    })),
  removePayment: (id) =>
    set((state) => ({
      payments: state.payments.filter((p) => p.id !== id),
    })),
}))