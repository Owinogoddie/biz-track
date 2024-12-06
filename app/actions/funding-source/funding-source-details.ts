'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export async function getFundingSourceDetails(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const fundingSource = await prisma.fundingSource.findUnique({
      where: { id },
      include: {
        expenditures: {
          orderBy: { date: 'desc' },
        },
        transactions: {
          include: {
            items: {
              include: {
                product: true,
              }
            },
            customer: true,
            supplier: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!fundingSource) {
      return { success: false, error: 'Funding source not found' }
    }

    return { success: true, fundingSource }
  } catch (error) {
    return { success: false, error: 'Failed to fetch funding source details' }
  }
}