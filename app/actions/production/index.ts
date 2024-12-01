'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateProductionInput {
  batchNumber: string
  productName: string
  startDate: Date
  endDate?: Date
  status: string
  businessId: string
  productId?: string
}

export async function createProduction(data: CreateProductionInput) {
  // console.log(data)
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const production = await prisma.production.create({
      data: {
        ...data,
        stages: {
          create: [
            {
              name: "Initial Stage",
              order: 1,
              status: "PENDING"
            }
          ]
        }
      },
      include: {
        stages: true,
        product: true
      }
    })

    return { success: true, production }
  } catch (error: any) {
    // console.log(error)
    if (error.code === 'P2002') {
      return { success: false, error: 'A production with this batch number already exists' }
    }
    return { success: false, error: 'Failed to create production' }
  }
}

export async function getProductions(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const productions = await prisma.production.findMany({
      where: {
        businessId
      },
      include: {
        stages: true,
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, productions }
  } catch (error) {
    return { success: false, error: 'Failed to fetch productions' }
  }
}
export async function getProductionWithDetails(id: string) {
  try {
    const userResult = await getUserAction()
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const production = await prisma.production.findUnique({
      where: { id },
      include: {
        stages: {
          include: {
            resources: true,
            labor: {
              include: {
                worker: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!production) {
      return { success: false, error: 'Production not found' }
    }

    return { success: true, production }
  } catch (error) {
    return { success: false, error: 'Failed to fetch production details' }
  }
}
export async function updateProduction(id: string, data: Partial<CreateProductionInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const production = await prisma.production.update({
      where: { id },
      data,
      include: {
        stages: true,
        product: true
      }
    })

    return { success: true, production }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A production with this batch number already exists' }
    }
    return { success: false, error: 'Failed to update production' }
  }
}

export async function deleteProduction(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.production.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete production' }
  }
}