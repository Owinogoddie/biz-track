'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '@/app/actions/auth'

interface CreateBusinessInput {
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
  address?: string
}

export async function createBusiness(data: CreateBusinessInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const business = await prisma.business.create({
      data: {
        ...data,
        ownerId: userResult.user.id,
      },
    })

    return { success: true, business }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to create business' }
  }
}

export async function getBusinesses() {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const businesses = await prisma.business.findMany({
      where: {
        OR: [
          { ownerId: userResult.user.id },
          {
            users: {
              some: {
                userId: userResult.user.id
              }
            }
          }
        ]
      }
    })

    return { success: true, businesses }
  } catch (error) {
    return { success: false, error: 'Failed to fetch businesses' }
  }
}