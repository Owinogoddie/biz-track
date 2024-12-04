export type POStatus = "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED"

export interface PurchaseOrderItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  status: POStatus
  issueDate: Date
  deliveryDate: Date | null
  totalAmount: number
  notes: string | null
  supplierId: string
  supplier: {
    name: string
  }
  businessId: string
  createdAt: Date
  updatedAt: Date
  items: PurchaseOrderItem[]
}