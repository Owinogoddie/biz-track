'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { ResourceType } from '@prisma/client'

export interface CreateResourceInput {
  name: string
  type: ResourceType
  quantity: number
  unit: string
  cost?: number
  stageId: string
}

export async function createResource(data: CreateResourceInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { stageId, ...resourceData } = data

    const resource = await prisma.resource.create({
      data: {
        ...resourceData,
        quantity: Number(resourceData.quantity),
        cost: resourceData.cost ? Number(resourceData.cost) : undefined,
        stages: {
          connect: [{ id: stageId }]
        }
      },
      include: {
        stages: true
      }
    })

    return { success: true, resource }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to create resource' }
  }
}

export async function updateResource(id: string, data: Partial<CreateResourceInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { stageId, ...resourceData } = data

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...resourceData,
        quantity: resourceData.quantity ? Number(resourceData.quantity) : undefined,
        cost: resourceData.cost ? Number(resourceData.cost) : undefined,
        stages: stageId ? {
          set: [],
          connect: [{ id: stageId }]
        } : undefined
      },
      include: {
        stages: true
      }
    })

    return { success: true, resource }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to update resource' }
  }
}

export async function deleteResource(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.resource.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete resource' }
  }
}