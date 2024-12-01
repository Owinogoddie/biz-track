'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { BusinessRole } from '@prisma/client'
import { generateEmailVerificationToken, sendEmployeeInviteEmail, sendVerificationEmail } from '@/lib/mail'
import bcrypt from 'bcryptjs'

interface CreateBusinessUserInput {
  email: string
  role: BusinessRole
  businessId: string
}


export async function createBusinessUser(data: CreateBusinessUserInput) {
    try {
      const userResult = await getUserAction()
      
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'User not authenticated' }
      }
  
      // Check if user already exists in the business
      const existingBusinessUser = await prisma.businessUser.findFirst({
        where: {
          business: { id: data.businessId },
          user: { email: data.email }
        }
      })
  
      if (existingBusinessUser) {
        return { success: false, error: 'This email is already registered in this business' }
      }
  
      // Generate a random password for the new user
      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(tempPassword, 10)
      
      // Create or get the user
      const user = await prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: {
          email: data.email,
          hashedPassword,
        },
      })
  
      // Generate verification code if email not verified
      if (!user.emailVerified) {
        const verificationCode = await generateEmailVerificationToken()
        const expiresAt = new Date(Date.now() + 600000) // 10 minutes
  
        await prisma.verificationCode.create({
          data: {
            code: verificationCode,
            email: data.email,
            expiresAt,
            userId: user.id,
          },
        })
  
        // Send verification email with temporary password
        await sendEmployeeInviteEmail(data.email, verificationCode, tempPassword)
      }
  
      // Create business user relationship
      const businessUser = await prisma.businessUser.create({
        data: {
          userId: user.id,
          businessId: data.businessId,
          role: data.role,
        },
        include: {
          user: true,
        },
      })
  
      return { success: true, employee: businessUser }
    } catch (error: any) {
      if (error.code === 'P2002') {
        return { success: false, error: 'This user is already part of the business' }
      }
      return { success: false, error: 'Failed to add employee' }
    }
  }
  

export async function getBusinessUsers(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const employees = await prisma.businessUser.findMany({
      where: {
        businessId
      },
      include: {
        user: true
      }
    })

    return { success: true, employees }
  } catch (error) {
    return { success: false, error: 'Failed to fetch employees' }
  }
}

export async function updateBusinessUser(id: string, data: Partial<CreateBusinessUserInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const employee = await prisma.businessUser.update({
      where: { id },
      data,
      include: {
        user: true
      }
    })

    return { success: true, employee }
  } catch (error) {
    return { success: false, error: 'Failed to update employee' }
  }
}

export async function deleteBusinessUser(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.businessUser.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove employee' }
  }
}