'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateProductInput {
  name: string
  description?: string
  sku?: string
  barcode?: string
  price: number
  cost: number
  quantity: number
  minQuantity: number
  categoryId: string
  businessId: string
}

export async function createProduct(data: CreateProductInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: true,
      },
    })

    return { success: true, product }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A product with this SKU or barcode already exists' }
    }
    return { success: false, error: 'Failed to create product' }
  }
}


export async function getProducts(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const products = await prisma.product.findMany({
      where: {
        businessId
      },
      include: {
        category: true,
      }
    })

    return { success: true, products }
  } catch (error) {
    return { success: false, error: 'Failed to fetch products' }
  }
}
export async function updateProduct(id: string, data: Partial<CreateProductInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      }
    })

    return { success: true, product }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A product with this SKU or barcode already exists' }
    }
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.product.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete product' }
  }
}