'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateSaleInput {
  businessId: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
}

export async function createSale(data: CreateSaleInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const total = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const sale = await prisma.sale.create({
      data: {
        businessId: data.businessId,
        sellerId: userResult.user.id,
        total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product quantities
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity
          }
        }
      })
    }

    return { success: true, sale }
  } catch (error) {
    console.error('Sale creation error:', error)
    return { success: false, error: 'Failed to create sale' }
  }
}

export async function getSales(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const sales = await prisma.sale.findMany({
      where: { businessId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        seller: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, sales }
  } catch (error) {
    return { success: false, error: 'Failed to fetch sales' }
  }
}