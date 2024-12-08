import prisma from '@/lib/prisma'
import { getUserAction } from '@/app/auth'
import { PaymentStatus } from '@prisma/client';

export const getOverviewMetrics = async (dateRange: { from: Date; to: Date }) => {
  try {
    const userResult = await getUserAction()
    if (!userResult.success) {
      return { success: false, error: 'User not authenticated' }
    }

    const [
      totalDeliveries,
      onTimeDeliveries,
      revenue,
      activeClients
    ] = await Promise.all([
      // Total deliveries in date range
      prisma.deliveryOrder.count({
        where: {
          scheduledDate: {
            gte: dateRange.from,
            lte: dateRange.to
          }
        }
      }),
      // On-time deliveries
      prisma.deliveryOrder.count({
        where: {
          scheduledDate: {
            gte: dateRange.from,
            lte: dateRange.to
          },
          status: 'DELIVERED'
        }
      }),
      // Total revenue
      prisma.payment.aggregate({
        where: {
          order: {
            scheduledDate: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          },
          status: PaymentStatus.PAID
        },
        _sum: {
          amount: true
        }
      }),
      // Active clients
      prisma.distributionClient.count({
        where: {
          orders: {
            some: {
              scheduledDate: {
                gte: dateRange.from,
                lte: dateRange.to
              }
            }
          }
        }
      })
    ])

    return {
      success: true,
      totalDeliveries,
      onTimeRate: totalDeliveries ? (onTimeDeliveries / totalDeliveries) * 100 : 0,
      revenue: revenue._sum.amount || 0,
      activeClients
    }
  } catch (error) {
    console.error('Error fetching overview metrics:', error)
    return { success: false, error: 'Failed to fetch metrics' }
  }
}

export const getDeliveryPerformance = async (dateRange: { from: Date; to: Date }) => {
  try {
    const userResult = await getUserAction()
    if (!userResult.success) {
      return { success: false, error: 'User not authenticated' }
    }

    // Get daily delivery counts
    const volumeTrend = await prisma.deliveryOrder.groupBy({
      by: ['scheduledDate'],
      where: {
        scheduledDate: {
          gte: dateRange.from,
          lte: dateRange.to
        }
      },
      _count: true
    })

    // Get status distribution
    const statusDistribution = await prisma.deliveryOrder.groupBy({
      by: ['status'],
      where: {
        scheduledDate: {
          gte: dateRange.from,
          lte: dateRange.to
        }
      },
      _count: true
    })

    return {
      success: true,
      volumeTrend: volumeTrend.map(day => ({
        date: day.scheduledDate.toLocaleDateString(),
        deliveries: day._count
      })),
      statusDistribution: statusDistribution.map(status => ({
        status: status.status,
        count: status._count
      }))
    }
  } catch (error) {
    console.error('Error fetching delivery performance:', error)
    return { success: false, error: 'Failed to fetch delivery performance' }
  }
}

export const getFinancialMetrics = async (dateRange: { from: Date; to: Date }) => {
  try {
    const userResult = await getUserAction()
    if (!userResult.success) {
      return { success: false, error: 'User not authenticated' }
    }

    // Get daily revenue
    const revenueTrend = await prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: dateRange.from,
          lte: dateRange.to
        },
        status: 'PAID'
      },
      _sum: {
        amount: true
      }
    })

    // Get payment method distribution
    const paymentMethods = await prisma.payment.groupBy({
      by: ['method'],
      where: {
        createdAt: {
          gte: dateRange.from,
          lte: dateRange.to
        },
        status: 'PAID'
      },
      _count: true
    })

    return {
      success: true,
      revenueTrend: revenueTrend.map(day => ({
        date: day.createdAt.toLocaleDateString(),
        revenue: day._sum.amount || 0
      })),
      paymentMethods: paymentMethods.map(method => ({
        name: method.method,
        value: method._count
      }))
    }
  } catch (error) {
    console.error('Error fetching financial metrics:', error)
    return { success: false, error: 'Failed to fetch financial metrics' }
  }
}

export const getClientSatisfaction = async (dateRange: { from: Date; to: Date }) => {
  // Note: This is still mock data since the schema doesn't include satisfaction metrics
  // You would need to add a satisfaction/feedback model to track this
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    satisfactionMetrics: [
      { subject: 'Delivery Time', score: 4.2 },
      { subject: 'Product Quality', score: 4.5 },
      { subject: 'Driver Behavior', score: 4.8 },
      { subject: 'Order Accuracy', score: 4.3 },
      { subject: 'Communication', score: 4.0 }
    ],
    feedbackDistribution: [
      { category: 'Service', positive: 85, negative: 15 },
      { category: 'Timeliness', positive: 75, negative: 25 },
      { category: 'Quality', positive: 90, negative: 10 },
      { category: 'Support', positive: 80, negative: 20 }
    ]
  }
}