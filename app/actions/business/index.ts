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
  openingBalance: number

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

    // Create an opening balance transaction if balance is not zero
    if (data.openingBalance !== 0) {
      await prisma.transaction.create({
        data: {
          type: 'CREDIT',
          status: 'COMPLETED',
          total: data.openingBalance,
          paid: data.openingBalance,
          notes: 'Opening Balance',
          businessId: business.id,
        },
      })
    }

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


export async function deleteBusiness(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if user owns the business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userResult.user.id
      }
    })

    if (!business) {
      return { success: false, error: 'Business not found or you do not have permission' }
    }

    // Delete all related records in the correct order to handle foreign key constraints
    await prisma.$transaction([
      // Delete all related records first
      prisma.businessUser.deleteMany({ where: { businessId } }),
      prisma.saleItem.deleteMany({ where: { sale: { businessId } } }),
      prisma.sale.deleteMany({ where: { businessId } }),
      prisma.transactionItem.deleteMany({ where: { transaction: { businessId } } }),
      prisma.transaction.deleteMany({ where: { businessId } }),
      prisma.product.deleteMany({ where: { businessId } }),
      prisma.category.deleteMany({ where: { businessId } }),
      prisma.supplier.deleteMany({ where: { businessId } }),
      prisma.customer.deleteMany({ where: { businessId } }),
      prisma.production.deleteMany({ where: { businessId } }),
      prisma.subscription.deleteMany({ where: { businessId } }),
      prisma.debt.deleteMany({ where: { businessId } }),
      prisma.expenditure.deleteMany({ where: { businessId } }),
      prisma.installmentPlan.deleteMany({ where: { businessId } }),
      prisma.purchaseOrder.deleteMany({ where: { businessId } }),
      prisma.supplierContract.deleteMany({ where: { businessId } }),
      // Finally delete the business itself
      prisma.business.delete({ where: { id: businessId } })
    ])

    return { success: true, message: 'Business and all related data deleted successfully' }
  } catch (error) {
    console.error('Delete business error:', error)
    return { success: false, error: 'Failed to delete business' }
  }
}