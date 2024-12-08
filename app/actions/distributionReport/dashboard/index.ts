import prisma from "@/lib/prisma";
import { getUserAction } from "../../auth";

export const getDashboardMetrics = async () => {
  try {
    const userResult = await getUserAction();
    if (!userResult.success) {
      return { success: false, error: "User not authenticated" };
    }

    const [
      activeOrders,
      todayDeliveries,
      pendingPayments,
      activeClients,
      previousPeriodOrders,
      previousPeriodDeliveries
    ] = await Promise.all([
      // Active orders count
      prisma.deliveryOrder.count({
        where: {
          status: {
            in: ["PENDING", "IN_TRANSIT"]
          }
        }
      }),
      // Today's deliveries
      prisma.deliveryOrder.count({
        where: {
          scheduledDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      // Pending payments total
      prisma.payment.aggregate({
        where: {
          status: "PENDING"
        },
        _sum: {
          amount: true
        }
      }),
      // Active clients
      prisma.distributionClient.count(),
      // Previous period orders (for change calculation)
      prisma.deliveryOrder.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 14)),
            lt: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      }),
      // Previous period deliveries
      prisma.deliveryOrder.count({
        where: {
          scheduledDate: {
            gte: new Date(new Date().setDate(new Date().getDate() - 1))
          },
          status: "DELIVERED"
        }
      })
    ]);

    // Calculate percentage changes
    const orderChange = previousPeriodOrders ? 
      ((activeOrders - previousPeriodOrders) / previousPeriodOrders) * 100 : 0;
    const deliveryChange = previousPeriodDeliveries ? 
      ((todayDeliveries - previousPeriodDeliveries) / previousPeriodDeliveries) * 100 : 0;

    return {
      success: true,
      activeOrders,
      todayDeliveries,
      pendingPayments: pendingPayments._sum.amount || 0,
      activeClients,
      orderChange: Math.round(orderChange),
      deliveryChange: Math.round(deliveryChange),
      paymentChange: -5, // Mock value for demo
      clientChange: 12 // Mock value for demo
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
};

export const getRecentActivities = async () => {
  try {
    const userResult = await getUserAction();
    if (!userResult.success) {
      return { success: false, error: "User not authenticated" };
    }

    const recentOrders = await prisma.deliveryOrder.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        client: true
      }
    });

    const activities = recentOrders.map(order => ({
      id: order.id,
      type: "order",
      description: `New order for ${order.client.name}`,
      timestamp: order.createdAt.toLocaleString()
    }));

    return {
      success: true,
      activities
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return { success: false, error: "Failed to fetch activities" };
  }
};