"use server"

import prisma from '@/lib/prisma'
import { getUserAction } from '@/app/actions/auth'
import { FundingType, TransactionType } from '@prisma/client'

interface CreateBusinessInput {
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  openingBalance: number
  openingBalanceSource?: FundingType
}

export async function createBusiness(data: CreateBusinessInput) {
  try {
    const userResult = await getUserAction();

    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const business = await prisma.business.create({
      data: {
        ...data,
        ownerId: userResult.user.id,
        openingBalance: data.openingBalance, // Set the opening balance initially
      },
    });

    // Create an opening balance funding source and transaction if the opening balance is not zero
    if (data.openingBalance !== 0) {
      const fundingSource = await prisma.fundingSource.create({
        data: {
          type: FundingType.OPENING_BALANCE,
          name: 'Opening Balance',
          description: 'Initial business capital',
          provider: 'Business Owner',
          amount: data.openingBalance,
          status: 'ACTIVE',
          businessId: business.id,
        },
      });

      await prisma.transaction.create({
        data: {
          type: TransactionType.CREDIT,
          status: 'COMPLETED',
          total: data.openingBalance,
          paid: data.openingBalance,
          notes: 'Opening Balance Transaction',
          businessId: business.id,
          fundingSourceId: fundingSource.id,
        },
      });
    }

    return { success: true, business };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create business' };
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
    const userResult = await getUserAction();

    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if the user owns the business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userResult.user.id,
      },
    });

    if (!business) {
      return { success: false, error: 'Business not found or you do not have permission' };
    }

    // Perform a transaction to delete related records and the business
    await prisma.$transaction([
      prisma.fundingSource.deleteMany({ where: { businessId } }),
      prisma.transaction.deleteMany({ where: { businessId } }),
      prisma.businessUser.deleteMany({ where: { businessId } }),
      prisma.saleItem.deleteMany({ where: { sale: { businessId } } }),
      prisma.sale.deleteMany({ where: { businessId } }),
      prisma.transactionItem.deleteMany({ where: { transaction: { businessId } } }),
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
      prisma.business.delete({ where: { id: businessId } }),
    ]);

    return { success: true, message: 'Business and all related data deleted successfully' };
  } catch (error) {
    console.error('Delete business error:', error);
    return { success: false, error: 'Failed to delete business' };
  }
}
