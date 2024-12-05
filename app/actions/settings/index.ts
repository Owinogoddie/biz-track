'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { businessFormSchema } from '@/app/dashboard/settings/business/business-form'



export async function updateBusiness(businessId: string, data: z.infer<typeof businessFormSchema>) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user owns or has access to this business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        OR: [
          { ownerId: user.id },
          {
            users: {
              some: {
                userId: user.id,
                role: 'ADMIN'
              }
            }
          }
        ]
      }
    })

    if (!business) {
      return { success: false, error: 'Business not found or access denied' }
    }

    // Validate input data
    // const validated = businessFormSchema.parse(data)

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data
    })

    return { 
      success: true, 
      business: updatedBusiness,
      message: 'Business updated successfully'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid input data',
        validationErrors: error.errors 
      }
    }
    
    console.error('Business update error:', error)
    return { 
      success: false, 
      error: 'Failed to update business' 
    }
  }
}

export async function getBusinessAction(businessId: string) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        OR: [
          { ownerId: user.id },
          {
            users: {
              some: {
                userId: user.id
              }
            }
          }
        ]
      }
    })

    if (!business) {
      return { success: false, error: 'Business not found or access denied' }
    }

    return { success: true, business }
  } catch (error) {
    console.error('Get business error:', error)
    return { success: false, error: 'Failed to fetch business' }
  }
}