'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import { ClientType } from '@prisma/client'

export interface CreateDistributionClientInput {
  name: string
  type: ClientType
  businessId: string
  address?: string
  contactPerson?: string
  phone?: string
  email?: string
}

export async function createDistributionClient(data: CreateDistributionClientInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const client = await prisma.distributionClient.create({
      data
    })

    return { success: true, client }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A client with this name already exists' }
    }
    return { success: false, error: 'Failed to create client' }
  }
}

export async function getDistributionClients(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const clients = await prisma.distributionClient.findMany({
      where: {
        businessId
      }
    })

    return { success: true, clients }
  } catch (error) {
    return { success: false, error: 'Failed to fetch clients' }
  }
}

export async function updateDistributionClient(id: string, data: Partial<CreateDistributionClientInput>) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const client = await prisma.distributionClient.update({
      where: { id },
      data
    })

    return { success: true, client }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'A client with this name already exists' }
    }
    return { success: false, error: 'Failed to update client' }
  }
}

export async function deleteDistributionClient(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.distributionClient.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete client' }
  }
}