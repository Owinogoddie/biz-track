'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateFormulaInput {
  name: string
  description?: string
  businessId: string
  productId: string
}

export async function createFormula(data: CreateFormulaInput) {
  console.log(data)
  try {
    const userResult = await getUserAction();

    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const formula = await prisma.productionFormula.create({
      data: {
        name: data.name,
        description: data.description,
        businessId: data.businessId,
        productId: data.productId,
      },
      include: {
        product: true
      }
    });

    return { success: true, formula };
  } catch (error: any) {
    console.error('Create formula error:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'A formula with this name already exists' };
    }
    return { success: false, error: 'Failed to create formula' };
  }
}

export async function getFormulas(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const formulas = await prisma.productionFormula.findMany({
      where: { businessId },
      include: {
        product: true
      }
    })

    return { success: true, formulas }
  } catch (error) {
    return { success: false, error: 'Failed to fetch formulas' }
  }
}

export async function updateFormula(id: string, data: Partial<CreateFormulaInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const formula = await prisma.productionFormula.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        productId: data.productId,
      },
      include: {
        product: true
      }
    });

    return { success: true, formula }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A formula with this name already exists' }
    }
    return { success: false, error: 'Failed to update formula' }
  }
}

export async function deleteFormula(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }
    
    await prisma.productionFormula.delete({
      where: { id }
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete formula' }
  }
}