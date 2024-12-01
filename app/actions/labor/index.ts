'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { PaymentPeriod } from '@prisma/client'
import { createWorker } from '../worker'

export interface CreateLaborInput {
  workerId?: string
  firstName?: string
  lastName?: string
  stageId: string
  date: Date
  hours?: number | null
  days?: number | null
  rate: number
  periodType: PaymentPeriod
  notes?: string | null
}

export async function createLabor(data: CreateLaborInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    let workerId = data.workerId;

    // If it's a casual worker, create a temporary worker record
    if (!workerId && data.firstName && data.lastName) {
      const casualWorker = await createWorker({
        firstName: data.firstName,
        lastName: data.lastName,
        isCasual: true
      })

      if (!casualWorker.success) {
        return { success: false, error: 'Failed to create casual worker' }
      }

      workerId = casualWorker.worker.id
    }

    const labor = await prisma.labor.create({
      data: {
        workerId: workerId!,
        stageId: data.stageId,
        date: data.date,
        hours: data.hours,
        days: data.days,
        rate: data.rate,
        periodType: data.periodType,
        notes: data.notes
      },
      include: {
        worker: true,
        stage: true
      }
    })

    return { success: true, labor }
  } catch (error) {
    return { success: false, error: 'Failed to create labor entry' }
  }
}


export async function updateLabor(id: string, data: Partial<CreateLaborInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const labor = await prisma.labor.update({
      where: { id },
      data,
      include: {
        worker: true,
        stage: true
      }
    })

    return { success: true, labor }
  } catch (error) {
    return { success: false, error: 'Failed to update labor entry' }
  }
}

export async function deleteLabor(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.labor.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete labor entry' }
  }
}