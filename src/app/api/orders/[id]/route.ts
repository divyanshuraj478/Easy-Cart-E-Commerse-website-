import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const body = await req.json();
    const { status, paymentStatus, trackingNumber } = body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    // Customer can only cancel eligible order
    if (user.role !== 'ADMIN') {
      if (order.userId !== user.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      if (status === 'CANCELLED' && ['ORDER_PLACED', 'CONFIRMED'].includes(order.status)) {
        const updated = await prisma.order.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });

        // Create Notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Order Cancelled',
            message: `Order #${order.orderNumber} has been cancelled.`,
            type: 'ORDER',
          },
        });

        return NextResponse.json({ order: updated, message: 'Order cancelled successfully' });
      } else {
        return NextResponse.json({ message: 'Order cannot be cancelled at this stage' }, { status: 400 });
      }
    }

    // Admin updates
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || order.status,
        paymentStatus: paymentStatus || order.paymentStatus,
        trackingNumber: trackingNumber ?? order.trackingNumber,
      },
    });

    // Notify customer on status update
    if (status && status !== order.status) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          title: `Order Status Updated: ${status.replace(/_/g, ' ')}`,
          message: `Your order #${order.orderNumber} status has been updated to ${status.replace(/_/g, ' ')}.`,
          type: 'ORDER',
        },
      });
    }

    return NextResponse.json({ order: updated, message: 'Order status updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}
