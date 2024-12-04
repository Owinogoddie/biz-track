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
      data,
      include: {
        debts: true,
        installmentPlans: true
      }
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
      include: {
        debts: true,
        installmentPlans: true
      }
    })

    return { success: true, customers }
  } catch (error) {
    return { success: false, error: 'Failed to fetch customers' }
  }
}

export async function updateCustomer(id: string, data: Partial<CreateCustomerInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data,
      include: {
        debts: true,
        installmentPlans: true
      }
    })

    return { success: true, customer }
  } catch (error) {
    return { success: false, error: 'Failed to update customer' }
  }
}

export async function deleteCustomer(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.customer.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete customer' }
  }
}