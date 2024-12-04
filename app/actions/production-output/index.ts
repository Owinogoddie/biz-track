'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateProductionOutputInput {
    productionId: string
    name: string
    description?: string | undefined
    quantity: number
    unit: string
    pricePerUnit: number
  }

export async function createProductionOutput(data: CreateProductionOutputInput) {
  try {
    const userResult = await getUserAction()
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const output = await prisma.productionOutput.create({
      data: {
        ...data,
        totalValue: data.quantity * data.pricePerUnit
      }
    })

    return { success: true, output }
  } catch (error) {
    return { success: false, error: 'Failed to create production output' }
  }
}
export async function updateProductionOutput(id: string, data: CreateProductionOutputInput) {
    try {
      const userResult = await getUserAction()
      
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'User not authenticated' }
      }
  
      const output = await prisma.productionOutput.update({
        where: { id },
        data: {
          ...data,
          totalValue: data.quantity * data.pricePerUnit
        }
      })
  
      return { success: true, output }
    } catch (error: any) {
      return { success: false, error: 'Failed to update production output' }
    }
  }
  
export async function getProductionOutputs(productionId: string) {
  try {
    const userResult = await getUserAction()
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const outputs = await prisma.productionOutput.findMany({
      where: { productionId },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, outputs }
  } catch (error) {
    return { success: false, error: 'Failed to fetch production outputs' }
  }
}

export async function deleteProductionOutput(id: string) {
  try {
    const userResult = await getUserAction()
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.productionOutput.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete production output' }
  }
}