'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import type { CreateExpenditureInput } from './types'
import { validateAndUpdateFundingSource } from './funding-source'
import { createExpenditureTransaction, deleteExpenditureTransaction } from './transactions'
import { TransactionType } from '@prisma/client'

export async function createExpenditure(data: CreateExpenditureInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const result = await prisma.$transaction(async (tx) => {
      if (data.fundingSourceId) {
        await validateAndUpdateFundingSource(tx, data.fundingSourceId, data.amount, 'subtract')
      }

      await createExpenditureTransaction(tx, {
        type: TransactionType.EXPENSE,
        total: data.amount,
        paid: data.amount,
        businessId: data.businessId,
        fundingSourceId: data.fundingSourceId,
        notes: `Expenditure: ${data.description}`,
      })

      const expenditure = await tx.expenditure.create({
        data,
        include: {
          fundingSource: true,
        }
      })

      return expenditure
    })

    return { success: true, expenditure: result }
  } catch (error) {
    console.error('Expenditure creation error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create expenditure' 
    }
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
      include: {
        fundingSource: true,
      },
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

    const result = await prisma.$transaction(async (tx) => {
      const existingExpenditure = await tx.expenditure.findUnique({
        where: { id },
        include: { fundingSource: true }
      })

      if (!existingExpenditure) {
        throw new Error('Expenditure not found')
      }

      // Handle funding source changes
      if (data.fundingSourceId !== undefined || data.amount !== undefined) {
        // Restore amount to old funding source if it exists
        if (existingExpenditure.fundingSourceId) {
          await validateAndUpdateFundingSource(
            tx, 
            existingExpenditure.fundingSourceId, 
            existingExpenditure.amount,
            'add'
          )
        }

        // Subtract amount from new funding source if it exists
        if (data.fundingSourceId || existingExpenditure.fundingSourceId) {
          await validateAndUpdateFundingSource(
            tx,
            data.fundingSourceId || existingExpenditure.fundingSourceId,
            data.amount || existingExpenditure.amount,
            'subtract'
          )
        }

        // Update transactions
        await deleteExpenditureTransaction(
          tx, 
          existingExpenditure.fundingSourceId,
          existingExpenditure.description
        )

        await createExpenditureTransaction(tx, {
          type: TransactionType.EXPENSE,
          total: data.amount || existingExpenditure.amount,
          paid: data.amount || existingExpenditure.amount,
          businessId: existingExpenditure.businessId,
          fundingSourceId: data.fundingSourceId,
          notes: `Expenditure: ${data.description || existingExpenditure.description}`,
        })
      }

      const expenditure = await tx.expenditure.update({
        where: { id },
        data,
        include: {
          fundingSource: true,
        }
      })

      return expenditure
    })

    return { success: true, expenditure: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update expenditure' 
    }
  }
}

export async function deleteExpenditure(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.$transaction(async (tx) => {
      const expenditure = await tx.expenditure.findUnique({
        where: { id },
        include: { fundingSource: true }
      })

      if (!expenditure) {
        throw new Error('Expenditure not found')
      }

      // Restore amount to funding source if it exists
      if (expenditure.fundingSourceId) {
        await validateAndUpdateFundingSource(
          tx,
          expenditure.fundingSourceId,
          expenditure.amount,
          'add'
        )
      }

      // Delete associated transaction
      await deleteExpenditureTransaction(tx, expenditure.fundingSourceId, expenditure.description)

      // Delete the expenditure
      await tx.expenditure.delete({
        where: { id }
      })
    })

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete expenditure' 
    }
  }
}