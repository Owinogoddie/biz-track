'use server'
import prisma from '@/lib/prisma'
import { getUserAction } from '../auth'

export interface CreateInstallmentPlanInput {
  totalAmount: number
  productId: string
  customerId: string
  businessId: string
  endDate?: Date
  notes?: string
}

export interface UpdateInstallmentPlanInput {
  id: string
  totalAmount?: number
  endDate?: Date
  notes?: string
}
export async function createInstallmentPlan(data: CreateInstallmentPlanInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const plan = await prisma.installmentPlan.create({
      data,
      include: {
        product: true,
        customer: true,
        payments: true,
      },
    })

    return { success: true, plan }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to create installment plan' }
  }
}

export async function getInstallmentPlans(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const plans = await prisma.installmentPlan.findMany({
      where: { businessId },
      include: {
        product: true,
        customer: true,
        payments: true,
      },
    })

    return { success: true, plans }
  } catch (error) {
    return { success: false, error: 'Failed to fetch installment plans' }
  }
}

export async function getInstallmentPlan(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const plan = await prisma.installmentPlan.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    })

    if (!plan) {
      return { success: false, error: 'Installment plan not found' }
    }

    return { success: true, plan }
  } catch (error) {
    return { success: false, error: 'Failed to fetch installment plan' }
  }
}

export async function updateInstallmentPlan(data: UpdateInstallmentPlanInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const currentPlan = await prisma.installmentPlan.findUnique({
      where: { id: data.id },
      include: { payments: true },
    })

    if (!currentPlan) {
      return { success: false, error: 'Plan not found' }
    }

    const totalPaid = currentPlan.payments.reduce((sum, p) => sum + p.amount, 0)
    const newTotalAmount = data.totalAmount ?? currentPlan.totalAmount

    const plan = await prisma.installmentPlan.update({
      where: { id: data.id },
      data: {
        totalAmount: data.totalAmount,
        endDate: data.endDate,
        notes: data.notes,
        status: totalPaid >= newTotalAmount ? 'COMPLETED' : 'ACTIVE',
      },
      include: {
        product: true,
        customer: true,
        payments: true,
      },
    })

    return { success: true, plan }
  } catch (error) {
    return { success: false, error: 'Failed to update installment plan' }
  }
}

export async function deleteInstallmentPlan(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.installmentPlan.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete installment plan' }
  }
}


export async function addInstallmentPayment(
  installmentPlanId: string,
  amount: number,
  notes?: string
) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if plan is already completed
    const existingPlan = await prisma.installmentPlan.findUnique({
      where: { id: installmentPlanId },
      include: { payments: true },
    })

    if (!existingPlan) {
      return { success: false, error: 'Installment plan not found' }
    }

    if (existingPlan.status === 'COMPLETED') {
      return { success: false, error: 'Cannot add payment to a completed installment plan' }
    }

    const payment = await prisma.installmentPayment.create({
      data: {
        amount,
        notes,
        installmentPlanId,
      },
    })

    const totalPaid = existingPlan.payments.reduce((sum, p) => sum + p.amount, 0) + amount
    await prisma.installmentPlan.update({
      where: { id: installmentPlanId },
      data: {
        paidAmount: totalPaid,
        status: totalPaid >= existingPlan.totalAmount ? 'COMPLETED' : 'ACTIVE',
      },
    })

    return { success: true, payment }
  } catch (error) {
    return { success: false, error: 'Failed to add payment' }
  }
}


export async function updateInstallmentPayment(
  id: string,
  amount: number,
  notes?: string
) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const payment = await prisma.installmentPayment.update({
      where: { id },
      data: {
        amount,
        notes,
      },
    })

    // Update plan's paid amount and status
    const plan = await prisma.installmentPlan.findUnique({
      where: { id: payment.installmentPlanId },
      include: { payments: true },
    })

    if (plan) {
      const totalPaid = plan.payments.reduce((sum, p) => sum + p.amount, 0)
      await prisma.installmentPlan.update({
        where: { id: payment.installmentPlanId },
        data: {
          paidAmount: totalPaid,
          status: totalPaid >= plan.totalAmount ? 'COMPLETED' : 'ACTIVE',
        },
      })
    }

    return { success: true, payment }
  } catch (error) {
    return { success: false, error: 'Failed to update payment' }
  }
}


export async function deleteInstallmentPayment(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const payment = await prisma.installmentPayment.delete({
      where: { id },
    })

    // Update plan's paid amount and status
    const plan = await prisma.installmentPlan.findUnique({
      where: { id: payment.installmentPlanId },
      include: { payments: true },
    })

    if (plan) {
      const totalPaid = plan.payments.reduce((sum, p) => sum + p.amount, 0)
      await prisma.installmentPlan.update({
        where: { id: payment.installmentPlanId },
        data: {
          paidAmount: totalPaid,
          status: totalPaid >= plan.totalAmount ? 'COMPLETED' : 'ACTIVE',
        },
      })
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete payment' }
  }
}
