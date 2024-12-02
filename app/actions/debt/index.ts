'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateDebtInput {
  amount: number
  dueDate: Date
  notes?: string
  customerName: string
  customerPhoneNumber: string
  transactionId: string
  businessId: string
}

export async function createDebt(data: CreateDebtInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const debt = await prisma.debt.create({
      data,
      include: {
        transaction: {
          include: {
            payments: true
          }
        }
      }
    })

    return { success: true, debt }
  } catch (error) {
    console.error('Debt creation error:', error)
    return { success: false, error: 'Failed to create debt' }
  }
}

export async function getDebts(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const debts = await prisma.debt.findMany({
      where: {
        businessId
      },
      include: {
        transaction: {
          include: {
            payments: true
          }
        }
      }
    })

    return { success: true, debts }
  } catch (error) {
    return { success: false, error: 'Failed to fetch debts' }
  }
}