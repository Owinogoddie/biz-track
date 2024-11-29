'use server'

import prisma from '@/lib/prisma'

interface CreateBusinessInput {
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  ownerId: string
}

export async function createBusiness(ownerId: string, data: Omit<CreateBusinessInput, 'ownerId'>) {
    console.log(data,ownerId)
  try {
    const business = await prisma.business.create({
      data: {
        ...data,
        ownerId,
      },
    })

    return { success: true, business }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to create business' }
  }
}

export async function getBusinesses(userId: string) {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            users: {
              some: {
                userId: userId
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