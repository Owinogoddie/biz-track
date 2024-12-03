'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateCustomerInput {
  name: string
  phone?: string
  email?: string
  address?: string
  businessId: string
}

export async function createCustomer(data: CreateCustomerInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const customer = await prisma.customer.create({
      data
    })

    return { success: true, customer }
  } catch (error) {
    return { success: false, error: 'Failed to create customer' }
  }
}

export async function getCustomers(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const customers = await prisma.customer.findMany({
      where: { businessId },
    })

    return { success: true, customers }
  } catch (error) {
    return { success: false, error: 'Failed to fetch customers' }
  }
}