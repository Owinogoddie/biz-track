'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

const profileSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email(),
  picture: z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

export async function updateProfile(data: ProfileData) {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Validate the input data
    const validated = profileSchema.parse(data)
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validated.name,
        email: validated.email,
        picture: validated.picture,
      },
    })

    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        picture: updatedUser.picture,
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid input data',
        validationErrors: error.errors 
      }
    }
    
    console.error('Profile update error:', error)
    return { 
      success: false, 
      error: 'Failed to update profile' 
    }
  }
}

export async function getProfile() {
  try {
    const user = await getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        emailVerified: true,
        role: true,
      }
    })

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    return { success: true, profile }
  } catch (error) {
    console.error('Get profile error:', error)
    return { success: false, error: 'Failed to fetch profile' }
  }
}