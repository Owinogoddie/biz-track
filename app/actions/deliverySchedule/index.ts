'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { Frequency } from '@prisma/client'

export interface CreateDeliveryScheduleInput {
  businessId: string
  clientId: string
  routeId: string
  frequency: Frequency
  dayOfWeek?: number
  dayOfMonth?: number
  timeWindow?: string
}

export async function createDeliverySchedule(data: CreateDeliveryScheduleInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const schedule = await prisma.deliverySchedule.create({
      data,
      include: {
        client: true,
        route: true,
      }
    })

    return { success: true, schedule }
  } catch (error: any) {
    return { success: false, error: 'Failed to create schedule' }
  }
}

export async function getDeliverySchedules(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const schedules = await prisma.deliverySchedule.findMany({
      where: {
        businessId
      },
      include: {
        client: true,
        route: true,
      }
    })

    return { success: true, schedules }
  } catch (error) {
    return { success: false, error: 'Failed to fetch schedules' }
  }
}

export async function updateDeliverySchedule(id: string, data: Partial<CreateDeliveryScheduleInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const schedule = await prisma.deliverySchedule.update({
      where: { id },
      data,
      include: {
        client: true,
        route: true,
      }
    })

    return { success: true, schedule }
  } catch (error) {
    return { success: false, error: 'Failed to update schedule' }
  }
}

export async function deleteDeliverySchedule(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.deliverySchedule.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete schedule' }
  }
}