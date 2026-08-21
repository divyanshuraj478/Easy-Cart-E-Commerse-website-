import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true, category: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
      },
    });
  }

  return cart;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ items: [] });

    const cart = await getOrCreateCart(user.id);
    return NextResponse.json({ items: cart.items });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { productId, quantity = 1, selectedColor, selectedSize } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
    }

    const cart = await getOrCreateCart(user.id);

    const existingItem = cart.items.find(
      (item) =>
        item.productId === productId &&
        item.selectedColor === (selectedColor || null) &&
        item.selectedSize === (selectedSize || null)
    );

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
        },
      });
    }

    const updatedCart = await getOrCreateCart(user.id);
    return NextResponse.json({ items: updatedCart.items, message: 'Cart updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating cart' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { itemId, quantity } = await req.json();
    if (!itemId || quantity === undefined) {
      return NextResponse.json({ message: 'Invalid arguments' }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const updatedCart = await getOrCreateCart(user.id);
    return NextResponse.json({ items: updatedCart.items });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating item quantity' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ message: 'Item ID required' }, { status: 400 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await getOrCreateCart(user.id);
    return NextResponse.json({ items: updatedCart.items, message: 'Item removed' });
  } catch (error) {
    return NextResponse.json({ message: 'Error removing item' }, { status: 500 });
  }
}
