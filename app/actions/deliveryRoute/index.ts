'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateRouteInput {
  name: string
  description?: string
  businessId: string
  clientIds?: string[]
}

export async function createRoute(data: CreateRouteInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const route = await prisma.deliveryRoute.create({
      data: {
        name: data.name,
        description: data.description,
        businessId: data.businessId,
        clients: data.clientIds ? {
          connect: data.clientIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        clients: true
      }
    })

    return { success: true, route }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A route with this name already exists' }
    }
    return { success: false, error: 'Failed to create route' }
  }
}

export async function getRoutes(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const routes = await prisma.deliveryRoute.findMany({
      where: {
        businessId
      },
      include: {
        clients: true
      }
    })

    return { success: true, routes }
  } catch (error) {
    return { success: false, error: 'Failed to fetch routes' }
  }
}

export async function updateRoute(id: string, data: Partial<CreateRouteInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const route = await prisma.deliveryRoute.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        clients: data.clientIds ? {
          set: data.clientIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        clients: true
      }
    })

    return { success: true, route }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A route with this name already exists' }
    }
    return { success: false, error: 'Failed to update route' }
  }
}

export async function deleteRoute(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.deliveryRoute.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete route' }
  }
}