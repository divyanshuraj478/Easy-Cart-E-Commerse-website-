import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const [
      totalSalesAgg,
      totalOrdersCount,
      totalCustomersCount,
      totalProductsCount,
      pendingOrdersCount,
      completedOrdersCount,
      recentOrders,
      bestSellers,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { grandTotal: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.count({ where: { status: { in: ['ORDER_PLACED', 'CONFIRMED', 'PACKED'] } } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { reviewCount: 'desc' },
        include: { category: true },
      }),
    ]);

    // Monthly revenue mock/aggregate calculation
    const revenueTimeline = [
      { month: 'Jan', revenue: 4200 },
      { month: 'Feb', revenue: 5800 },
      { month: 'Mar', revenue: 7300 },
      { month: 'Apr', revenue: 6100 },
      { month: 'May', revenue: 8900 },
      { month: 'Jun', revenue: 10400 },
      { month: 'Jul', revenue: 12500 },
      { month: 'Aug', revenue: (totalSalesAgg._sum.grandTotal || 0) + 14200 },
    ];

    return NextResponse.json({
      totalSales: totalSalesAgg._sum.grandTotal || 0,
      totalOrders: totalOrdersCount,
      totalCustomers: totalCustomersCount,
      totalProducts: totalProductsCount,
      pendingOrders: pendingOrdersCount,
      completedOrders: completedOrdersCount,
      revenueTimeline,
      recentOrders,
      bestSellers,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching admin stats' }, { status: 500 });
  }
}
