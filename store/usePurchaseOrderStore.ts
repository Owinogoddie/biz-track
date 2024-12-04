import { create } from 'zustand'
import { PurchaseOrder } from '@prisma/client'

interface PurchaseOrderStore {
  purchaseOrders: PurchaseOrder[]
  setPurchaseOrders: (purchaseOrders: PurchaseOrder[]) => void
  addPurchaseOrder: (purchaseOrder: PurchaseOrder) => void
  updatePurchaseOrder: (purchaseOrder: PurchaseOrder) => void
  removePurchaseOrder: (id: string) => void
}

export const usePurchaseOrderStore = create<PurchaseOrderStore>((set) => ({
  purchaseOrders: [],
  setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),
  addPurchaseOrder: (purchaseOrder) =>
    set((state) => ({ purchaseOrders: [...state.purchaseOrders, purchaseOrder] })),
  updatePurchaseOrder: (purchaseOrder) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) => 
        po.id === purchaseOrder.id ? purchaseOrder : po
      ),
    })),
  removePurchaseOrder: (id) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id),
    })),
}))