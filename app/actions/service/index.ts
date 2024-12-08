'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateServiceInput {
  name: string
  description?: string
  price: number
  duration: number
  categoryId?: string
  businessId: string
}

export async function createService(data: CreateServiceInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const service = await prisma.service.create({
      data,
      include: {
        category: true,
      },
    })

    return { success: true, service }
  } catch (error) {
    return { success: false, error: 'Failed to create service' }
  }
}

export async function getServices(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const services = await prisma.service.findMany({
      where: {
        businessId
      },
      include: {
        category: true,
      }
    })

    return { success: true, services }
  } catch (error) {
    return { success: false, error: 'Failed to fetch services' }
  }
}

export async function updateService(id: string, data: Partial<CreateServiceInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const service = await prisma.service.update({
      where: { id },
      data,
      include: {
        category: true,
      }
    })

    return { success: true, service }
  } catch (error) {
    return { success: false, error: 'Failed to update service' }
  }
}

export async function deleteService(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.service.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete service' }
  }
}