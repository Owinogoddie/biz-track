'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { StageStatus } from '@prisma/client'

export interface CreateStageInput {
  name: string
  description?: string
  status: StageStatus
  order: number
  productionId: string
}

export async function createStage(data: CreateStageInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const stage = await prisma.stage.create({
      data,
      include: {
        resources: true,
        workers: true,
        labor: true
      }
    })

    return { success: true, stage }
  } catch (error) {
    return { success: false, error: 'Failed to create stage' }
  }
}
export async function getStages(productionId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const stages = await prisma.stage.findMany({
      where: { productionId },
      include: {
        resources: true,
        labor: {
          include: {
            worker: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return { success: true, stages }
  } catch (error) {
    return { success: false, error: 'Failed to fetch stages' }
  }
}
export async function updateStage(id: string, data: Partial<CreateStageInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const stage = await prisma.stage.update({
      where: { id },
      data,
      include: {
        resources: true,
        workers: true,
        labor: true
      }
    })

    return { success: true, stage }
  } catch (error) {
    return { success: false, error: 'Failed to update stage' }
  }
}

export async function deleteStage(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.stage.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete stage' }
  }
}