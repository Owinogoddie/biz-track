'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'
import type { AssetType, MaintenanceStatus } from '@prisma/client'

export interface CreateAssetInput {
  name: string
  description?: string | null
  assetType: AssetType
  serialNumber?: string | null
  purchaseDate: Date
  condition: MaintenanceStatus
  nextMaintenance?: Date | null
  notes?: string | null
  businessId: string
}

export interface UpdateAssetInput extends Partial<Omit<CreateAssetInput, 'businessId'>> {
  id: string
}

export async function createAsset(data: CreateAssetInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const asset = await prisma.inventoryAsset.create({
      data: {
        ...data,
        description: data.description || null,
        serialNumber: data.serialNumber || null,
        nextMaintenance: data.nextMaintenance || null,
        notes: data.notes || null,
      }
    })

    return { success: true, asset }
  } catch (error) {
    console.error('Asset creation error:', error)
    return { success: false, error: 'Failed to create asset' }
  }
}

export async function updateAsset(data: UpdateAssetInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { id, ...updateData } = data
    const asset = await prisma.inventoryAsset.update({
      where: { id },
      data: {
        ...updateData,
        description: updateData.description || null,
        serialNumber: updateData.serialNumber || null,
        nextMaintenance: updateData.nextMaintenance || null,
        notes: updateData.notes || null,
      }
    })

    return { success: true, asset }
  } catch (error) {
    console.error('Asset update error:', error)
    return { success: false, error: 'Failed to update asset' }
  }
}


export async function getAssets(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const assets = await prisma.inventoryAsset.findMany({
      where: { businessId },
      include: {
        maintenanceLogs: {
          orderBy: { date: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, assets }
  } catch (error) {
    return { success: false, error: 'Failed to fetch assets' }
  }
}



export async function createMaintenanceLog(data: {
  description: string
  date: Date
  cost?: number
  performedBy?: string
  assetId: string
}) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const log = await prisma.maintenanceLog.create({
      data
    })

    await prisma.inventoryAsset.update({
      where: { id: data.assetId },
      data: { lastMaintenance: data.date }
    })

    return { success: true, log }
  } catch (error) {
    return { success: false, error: 'Failed to create maintenance log' }
  }
}

export async function deleteAsset(assetId: string) {
    try {
      // Verify user authentication
      const userResult = await getUserAction()
      
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'User not authenticated' }
      }
  
      // Delete the asset and its associated maintenance logs
      await prisma.$transaction(async (tx) => {
        // First, delete all maintenance logs associated with the asset
        await tx.maintenanceLog.deleteMany({
          where: { assetId }
        })
  
        // Then delete the asset itself
        await tx.inventoryAsset.delete({
          where: { id: assetId }
        })
      })
  
      return { success: true, message: 'Asset deleted successfully' }
    } catch (error) {
      console.error('Asset deletion error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete asset' 
      }
    }
  }