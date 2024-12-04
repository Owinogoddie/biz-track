'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateExpenditureInput {
  businessId: string
  amount: number
  category: string
  description: string
  date?: Date
}

export async function createExpenditure(data: CreateExpenditureInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const expenditure = await prisma.expenditure.create({
      data
    })

    return { success: true, expenditure }
  } catch (error) {
    console.error('Expenditure creation error:', error)
    return { success: false, error: 'Failed to create expenditure' }
  }
}

export async function getExpenditures(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const expenditures = await prisma.expenditure.findMany({
      where: { businessId },
      orderBy: { date: 'desc' }
    })

    return { success: true, expenditures }
  } catch (error) {
    return { success: false, error: 'Failed to fetch expenditures' }
  }
}

export async function updateExpenditure(id: string, data: Partial<CreateExpenditureInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const expenditure = await prisma.expenditure.update({
      where: { id },
      data
    })

    return { success: true, expenditure }
  } catch (error) {
    return { success: false, error: 'Failed to update expenditure' }
  }
}

export async function deleteExpenditure(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.expenditure.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete expenditure' }
  }
}