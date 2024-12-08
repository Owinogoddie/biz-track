'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { Payment, TransactionStatus } from '@prisma/client'

export type CreatePaymentInput = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export async function createPayment(data: CreatePaymentInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Create payment and transaction in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data,
        include: {
          order: true
        }
      })

      // Create transaction record
      await tx.deliveryTransaction.create({
        data: {
          orderId: payment.orderId,
          deliveryDate: new Date(),
          status: TransactionStatus.COMPLETED,
          notes: `Payment of ${payment.amount} received via ${payment.method}`
        }
      })

      return payment
    })

    return { success: true, payment: result }
  } catch (error) {
    console.error('Failed to create payment:', error)
    return { success: false, error: 'Failed to create payment' }
  }
}
export async function getPayments(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const payments = await prisma.payment.findMany({
      where: {
        order: {
          businessId
        }
      },
      include: {
        order: {
          include: {
            client: true
          }
        }
      }
    })

    return { success: true, payments }
  } catch (error) {
    return { success: false, error: 'Failed to fetch payments' }
  }
}

export async function updatePayment(id: string, data: Partial<CreatePaymentInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const payment = await prisma.payment.update({
      where: { id },
      data,
      include: {
        order: {
          include: {
            client: true
          }
        }
      }
    })

    return { success: true, payment }
  } catch (error) {
    return { success: false, error: 'Failed to update payment' }
  }
}

export async function deletePayment(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.payment.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete payment' }
  }
}