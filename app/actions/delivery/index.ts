'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { TransactionStatus } from '@prisma/client'

export interface CreateDeliveryInput {
  orderId: string
  status: TransactionStatus
  deliveryDate: Date
  notes?: string
  deliveredItems: {
    orderItemId: string
    quantityDelivered: number
  }[]
}

export async function createDeliveryTransaction(data: CreateDeliveryInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const delivery = await prisma.deliveryTransaction.create({
      data: {
        orderId: data.orderId,
        status: data.status,
        deliveryDate: data.deliveryDate,
        notes: data.notes,
        deliveredItems: {
          create: data.deliveredItems.map(item => ({
            orderItemId: item.orderItemId,
            quantityDelivered: item.quantityDelivered
          }))
        }
      },
      include: {
        order: {
          include: {
            client: true,
            items: true
          }
        },
        deliveredItems: {
          include: {
            orderItem: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    return { success: true, delivery }
  } catch (error) {
    console.error('Create delivery error:', error)
    return { success: false, error: 'Failed to create delivery record' }
  }
}

export async function getDeliveryTransactions(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const deliveries = await prisma.deliveryTransaction.findMany({
      where: {
        order: {
          businessId
        }
      },
      include: {
        order: {
          include: {
            client: true,
            items: true
          }
        },
        deliveredItems: {
          include: {
            orderItem: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: {
        deliveryDate: 'desc'
      }
    })

    return { success: true, deliveries }
  } catch (error) {
    console.error('Get deliveries error:', error)
    return { success: false, error: 'Failed to fetch deliveries' }
  }
}

export async function updateDeliveryTransaction(id: string, data: Partial<CreateDeliveryInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const delivery = await prisma.deliveryTransaction.update({
      where: { id },
      data: {
        status: data.status,
        deliveryDate: data.deliveryDate,
        notes: data.notes,
      },
      include: {
        order: {
          include: {
            client: true,
            items: true
          }
        },
        deliveredItems: {
          include: {
            orderItem: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    return { success: true, delivery }
  } catch (error) {
    console.error('Update delivery error:', error)
    return { success: false, error: 'Failed to update delivery' }
  }
}

export async function deleteDeliveryTransaction(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // First delete related delivered items
    await prisma.deliveredItem.deleteMany({
      where: { transactionId: id }
    })

    await prisma.deliveryTransaction.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Delete delivery error:', error)
    return { success: false, error: 'Failed to delete delivery' }
  }
}