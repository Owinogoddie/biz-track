'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateMaterialInput {
  name: string
  description?: string
  businessId: string
  quantity: number
  unit: string
  costPerUnit: number
}

export async function createMaterial(data: CreateMaterialInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const material = await prisma.product.create({
      data: {
        ...data,
        type: 'MATERIAL' // Assuming Product model has a type field to distinguish materials
      }
    })

    return { success: true, material }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A material with this name already exists' }
    }
    return { success: false, error: 'Failed to create material' }
  }
}

export async function getMaterials(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const materials = await prisma.product.findMany({
      where: {
        businessId,
        type: 'MATERIAL'
      }
    })

    return { success: true, materials }
  } catch (error) {
    return { success: false, error: 'Failed to fetch materials' }
  }
}

export async function updateMaterial(id: string, data: Partial<CreateMaterialInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const material = await prisma.product.update({
      where: { id },
      data
    })

    return { success: true, material }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A material with this name already exists' }
    }
    return { success: false, error: 'Failed to update material' }
  }
}

export async function deleteMaterial(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if material is used in any formulas
    const formulaUsage = await prisma.formulaMaterial.findFirst({
      where: { materialId: id }
    })

    if (formulaUsage) {
      return { 
        success: false, 
        error: 'Cannot delete material as it is used in production formulas' 
      }
    }

    await prisma.product.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete material' }
  }
}
