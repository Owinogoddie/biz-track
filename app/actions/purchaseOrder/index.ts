'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { PurchaseOrder, POStatus } from '@/types/purchase-order'

export interface CreatePurchaseOrderInput {
  poNumber: string
  supplierId: string
  businessId: string
  issueDate: Date
  deliveryDate?: Date
  notes?: string
  items: {
    description: string
    quantity: number
    unitPrice: number
  }[]
}

export async function createPurchaseOrder(data: CreatePurchaseOrderInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const totalAmount = data.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    )

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber: data.poNumber,
        supplierId: data.supplierId,
        businessId: data.businessId,
        issueDate: data.issueDate,
        deliveryDate: data.deliveryDate,
        notes: data.notes,
        totalAmount,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        items: true,
        supplier: true
      }
    })

    return { success: true, purchaseOrder }
  } catch (error: any) {
    console.log(error)

    if (error.code === 'P2002') {
      return { success: false, error: 'A purchase order with this number already exists' }
    }
    return { success: false, error: 'Failed to create purchase order' }
  }
}

export async function getPurchaseOrders(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: { businessId },
      include: {
        items: true,
        supplier: true
      }
    })

    return { success: true, purchaseOrders }
  } catch (error) {
    return { success: false, error: 'Failed to fetch purchase orders' }
  }
}

export async function updatePurchaseOrderStatus(
  id: string, 
  status: POStatus
) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        supplier: true
      }
    })

    return { success: true, purchaseOrder }
  } catch (error) {
    return { success: false, error: 'Failed to update purchase order status' }
  }
}

export async function updatePurchaseOrder(id: string, data: Partial<CreatePurchaseOrderInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    let totalAmount = undefined
    if (data.items) {
      totalAmount = data.items.reduce((sum, item) => 
        sum + (item.quantity * item.unitPrice), 0
      )
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        ...data,
        totalAmount,
        items: data.items ? {
          deleteMany: {},
          create: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        } : undefined
      },
      include: {
        items: true,
        supplier: true
      }
    })

    return { success: true, purchaseOrder }
  } catch (error) {
    return { success: false, error: 'Failed to update purchase order' }
  }
}

export async function deletePurchaseOrder(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.purchaseOrder.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete purchase order' }
  }
}