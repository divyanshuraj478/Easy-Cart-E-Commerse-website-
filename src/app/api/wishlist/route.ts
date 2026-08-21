import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function getOrCreateWishlist(userId: string) {
  let wishlist = await prisma.wishlist.findUnique({
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

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
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

  return wishlist;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ products: [] });

    const wishlist = await getOrCreateWishlist(user.id);
    const products = wishlist.items.map((item) => item.product);

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ message: 'Product ID required' }, { status: 400 });

    const wishlist = await getOrCreateWishlist(user.id);

    const existing = wishlist.items.find((i) => i.productId === productId);
    if (!existing) {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId },
      });
    }

    const updated = await getOrCreateWishlist(user.id);
    return NextResponse.json({ products: updated.items.map((i) => i.product), message: 'Wishlist updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating wishlist' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) return NextResponse.json({ message: 'Product ID required' }, { status: 400 });

    const wishlist = await getOrCreateWishlist(user.id);
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });

    const updated = await getOrCreateWishlist(user.id);
    return NextResponse.json({ products: updated.items.map((i) => i.product), message: 'Item removed from wishlist' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating wishlist' }, { status: 500 });
  }
}
