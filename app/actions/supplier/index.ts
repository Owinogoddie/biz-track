'use server'

import prisma from '@/lib/prisma'
import { SupplierStatus } from '@prisma/client'
import { getUserAction } from '../auth'

export interface CreateSupplierInput {
  name: string
  email?: string
  phone?: string
  address?: string
  status?: SupplierStatus
  rating?: number
  taxId?: string
  website?: string
  notes?: string
  businessId: string
}

export async function createSupplier(data: CreateSupplierInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Ensure status is properly set as an enum value
    const supplierData = {
      ...data,
      status: data.status || 'ACTIVE'
    }

    const supplier = await prisma.supplier.create({
      data: supplierData
    })

    return { success: true, supplier }
  } catch (error: any) {
    console.error('Supplier creation error:', error)

    if (error.code === 'P2002') {
      return { success: false, error: 'A supplier with this name already exists' }
    }
    return { success: false, error: 'Failed to create supplier' }
  }
}

export async function getSuppliers(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const suppliers = await prisma.supplier.findMany({
      where: {
        businessId
      }
    })

    return { success: true, suppliers }
  } catch (error) {
    return { success: false, error: 'Failed to fetch suppliers' }
  }
}

export async function updateSupplier(id: string, data: Partial<CreateSupplierInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data
    })

    return { success: true, supplier }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A supplier with this name already exists' }
    }
    return { success: false, error: 'Failed to update supplier' }
  }
}

export async function deleteSupplier(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.supplier.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete supplier' }
  }
}
