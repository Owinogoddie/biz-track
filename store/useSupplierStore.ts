import { create } from 'zustand'
import { Supplier } from '@prisma/client'

interface SupplierStore {
  suppliers: Supplier[]
  setSuppliers: (suppliers: Supplier[]) => void
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (supplier: Supplier) => void
  removeSupplier: (id: string) => void
}

export const useSupplierStore = create<SupplierStore>((set) => ({
  suppliers: [],
  setSuppliers: (suppliers) => set({ suppliers }),
  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [...state.suppliers, supplier] })),
  updateSupplier: (supplier) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === supplier.id ? supplier : s)),
    })),
  removeSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),
}))