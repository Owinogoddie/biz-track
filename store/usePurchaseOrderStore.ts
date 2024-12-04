import { create } from 'zustand'
import { PurchaseOrder } from '@prisma/client'

interface PurchaseOrderWithRelations extends PurchaseOrder {
  items: {
    id: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  supplier: {
    id: string
    name: string
  }
}

interface PurchaseOrderStore {
  purchaseOrders: PurchaseOrderWithRelations[]
  setPurchaseOrders: (purchaseOrders: PurchaseOrderWithRelations[]) => void
  addPurchaseOrder: (purchaseOrder: PurchaseOrderWithRelations) => void
  updatePurchaseOrder: (purchaseOrder: PurchaseOrderWithRelations) => void
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