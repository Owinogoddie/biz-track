'use server'

import prisma from '@/lib/prisma'
import { getUserAction } from '@/app/actions/auth'
import { BusinessType, FundingType, TransactionType } from '@prisma/client'

interface CreateBusinessInput {
  name: string
  type: BusinessType
  description?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  openingBalance: number
  primaryColor?: string
  secondaryColor?: string
}

export async function createBusiness(data: CreateBusinessInput) {
  try {
    const userResult = await getUserAction();

    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const business = await prisma.business.create({
      data: {
        name: data.name,
        businessType: data.type,
        description: data.description,
        email: data.email,
        phone: data.phone,
        website: data.website,
        address: data.address,
        openingBalance: data.openingBalance,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        ownerId: userResult.user.id,
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

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userResult.user.id,
      },
    });

    if (!business) {
      return { success: false, error: 'Business not found or you do not have permission' };
    }

    // Delete all related records in the correct order to maintain referential integrity
    await prisma.$transaction([
      // Delete service-related records
      prisma.appointment.deleteMany({ where: { businessId } }),
      prisma.service.deleteMany({ where: { businessId } }),

      // Delete subscription-related records
      prisma.member.deleteMany({ where: { businessId } }),
      prisma.membershipPlan.deleteMany({ where: { businessId } }),

      // Delete distribution-related records
      prisma.deliverySchedule.deleteMany({ where: { businessId } }),
      prisma.deliveryRoute.deleteMany({ where: { businessId } }),
      prisma.distributionClient.deleteMany({ where: { businessId } }),

      // Delete common business records
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
      prisma.subscription.deleteMany({ where: { businessId } }),
      prisma.expenditure.deleteMany({ where: { businessId } }),
      prisma.debt.deleteMany({ where: { businessId } }),
      prisma.installmentPlan.deleteMany({ where: { businessId } }),
      prisma.purchaseOrder.deleteMany({ where: { businessId } }),
      prisma.supplierContract.deleteMany({ where: { businessId } }),
      prisma.inventoryAsset.deleteMany({ where: { businessId } }),

      // Finally delete the business itself
      prisma.business.delete({ where: { id: businessId } }),
    ]);

    return { success: true, message: 'Business and all related data deleted successfully' };
  } catch (error) {
    console.error('Delete business error:', error);
    return { success: false, error: 'Failed to delete business' };
  }
}