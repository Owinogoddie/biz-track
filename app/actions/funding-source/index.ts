'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { FundingType } from '@prisma/client'

export interface CreateFundingSourceInput {
  type: FundingType
  name: string
  description?: string
  provider: string
  amount: number
  terms?: any
  status?: string
  startDate?: Date
  endDate?: Date
  businessId: string
}

export async function createFundingSource(data: CreateFundingSourceInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const fundingSource = await prisma.fundingSource.create({
      data
    })

    return { success: true, fundingSource }
  } catch (error) {
    return { success: false, error: 'Failed to create funding source' }
  }
}

export async function getFundingSources(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const fundingSources = await prisma.fundingSource.findMany({
      where: { 
        businessId,
        amount: {
          gt: 0
        }
      },
      include: {
        expenditures: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, fundingSources }
  } catch (error) {
    return { success: false, error: 'Failed to fetch funding sources' }
  }
}

export async function updateFundingSource(id: string, data: Partial<CreateFundingSourceInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const fundingSource = await prisma.fundingSource.update({
      where: { id },
      data
    })

    return { success: true, fundingSource }
  } catch (error) {
    return { success: false, error: 'Failed to update funding source' }
  }
}

export async function deleteFundingSource(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.fundingSource.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete funding source' }
  }
}