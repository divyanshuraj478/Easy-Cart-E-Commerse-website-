import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { slug } = params;
    const body = await req.json();

    const product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const price = body.price !== undefined ? parseFloat(body.price) : product.price;
    const originalPrice = body.originalPrice !== undefined ? parseFloat(body.originalPrice) : product.originalPrice;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: body.name ?? product.name,
        description: body.description ?? product.description,
        specifications: body.specifications ?? product.specifications,
        price,
        originalPrice,
        discountPercent,
        stock: body.stock !== undefined ? parseInt(body.stock) : product.stock,
        brand: body.brand ?? product.brand,
        categoryId: body.categoryId ?? product.categoryId,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : product.isFeatured,
        isBestSeller: body.isBestSeller !== undefined ? Boolean(body.isBestSeller) : product.isBestSeller,
        isFlashDeal: body.isFlashDeal !== undefined ? Boolean(body.isFlashDeal) : product.isFlashDeal,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ product: updated, message: 'Product updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { slug } = params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: product.id } });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}
