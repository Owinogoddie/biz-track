'use server'
import prisma from '@/lib/prisma'

export async function getBusinessUsers(businessId: string) {
  try {
    const employees = await prisma.businessUser.findMany({
      where: { businessId }
    })
    return { success: true, employees }
  } catch (error) {
    return { success: false, error: 'Failed to fetch employees' }
  }
}