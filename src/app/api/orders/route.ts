import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    }
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      discountAmount,
      shippingFee,
      taxAmount,
      grandTotal,
      couponCode,
      stripePaymentIntentId,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ message: 'Invalid order details' }, { status: 400 });
    }

    const orderNumber = 'EC-' + Math.floor(100000 + Math.random() * 900000);

    const paymentStatus = paymentMethod === 'COD' ? 'PENDING' : 'PAID';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'ORDER_PLACED',
        totalAmount: parseFloat(totalAmount) || 0,
        discountAmount: parseFloat(discountAmount) || 0,
        shippingFee: parseFloat(shippingFee) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        grandTotal: parseFloat(grandTotal) || 0,
        paymentMethod: paymentMethod || 'COD',
        paymentStatus,
        stripePaymentIntentId: stripePaymentIntentId || null,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        estimatedDelivery: '3 - 5 Business Days',
        trackingNumber: 'TRK-' + Math.floor(1000 + Math.random() * 9000) + '-STD',
      },
    });

    // Create OrderItems & decrement stock
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.product.id,
          productName: item.product.name,
          productPrice: item.product.price,
          selectedColor: item.selectedColor || null,
          selectedSize: item.selectedSize || null,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
        },
      });

      // Update product stock
      await prisma.product.update({
        where: { id: item.product.id },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // Update coupon usage count if applied
    if (couponCode) {
      await prisma.coupon.updateMany({
        where: { code: couponCode.toUpperCase() },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Clear user cart
    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Order Confirmed! 🎉',
        message: `Your order #${orderNumber} has been placed successfully.`,
        type: 'ORDER',
      },
    });

    return NextResponse.json({ order, message: 'Order placed successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}
