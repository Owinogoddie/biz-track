'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { PaymentPeriod } from '@prisma/client'

export interface CreateWorkerInput {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string
  role?: string
  hourlyRate?: number | null
  paymentPeriod?: PaymentPeriod
  dailyRate?: number | null
  monthlyRate?: number | null
  isCasual?: boolean
}

export async function createWorker(data: CreateWorkerInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }
    const email = data.isCasual && !data.email 
    ? `casual-${Date.now()}@temp.com`
    : data.email

    const worker = await prisma.worker.create({
      data: {
        ...data,
        email,
        isCasual: data.isCasual || false,
        hourlyRate: data.hourlyRate || null,
        dailyRate: data.dailyRate || null,
        monthlyRate: data.monthlyRate || null,
      }
    })

    return { success: true, worker }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A worker with this email already exists' }
    }
    return { success: false, error: 'Failed to create worker' }
  }
}

export async function getWorkers() {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const workers = await prisma.worker.findMany({
      orderBy: [
        { isCasual: 'asc' },
        { firstName: 'asc' }
      ]
    })
    return { success: true, workers }
  } catch (error) {
    return { success: false, error: 'Failed to fetch workers' }
  }
}

export async function updateWorker(id: string, data: Partial<CreateWorkerInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const worker = await prisma.worker.update({
      where: { id },
      data: {
        ...data,
        hourlyRate: data.hourlyRate ?? undefined,
        dailyRate: data.dailyRate ?? undefined,
        monthlyRate: data.monthlyRate ?? undefined,
      }
    })

    return { success: true, worker }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A worker with this email already exists' }
    }
    return { success: false, error: 'Failed to update worker' }
  }
}

export async function deleteWorker(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.worker.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete worker' }
  }
}