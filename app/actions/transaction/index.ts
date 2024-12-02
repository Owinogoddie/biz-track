'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { Prisma, TransactionStatus, TransactionType } from '@prisma/client'

export interface CreateTransactionInput {
  businessId: string
  total: number
  type: 'CREDIT' | 'DEBIT' // These should match your Prisma schema exactly
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' // These should match your Prisma schema exactly
}

export async function createTransaction(data: CreateTransactionInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const transaction = await prisma.transaction.create({
      data: {
        businessId: data.businessId,
        total: data.total,
        type: data.type as TransactionType,
        status: data.status as TransactionStatus,
        paid: 0,
      },
      include: {
        payments: true
      }
    })

    return { success: true, transaction }
  } catch (error) {
    console.error('Transaction creation error:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}