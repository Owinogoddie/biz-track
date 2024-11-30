'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateCategoryInput {
  name: string
  description?: string
  businessId: string
}

export async function createCategory(data: CreateCategoryInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const category = await prisma.category.create({
      data
    })

    return { success: true, category }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A category with this name already exists' }
    }
    return { success: false, error: 'Failed to create category' }
  }
}

export async function getCategories(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const categories = await prisma.category.findMany({
      where: {
        businessId
      }
    })

    return { success: true, categories }
  } catch (error) {
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function updateCategory(id: string, data: Partial<CreateCategoryInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const category = await prisma.category.update({
      where: { id },
      data
    })

    return { success: true, category }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A category with this name already exists' }
    }
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.category.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete category' }
  }
}