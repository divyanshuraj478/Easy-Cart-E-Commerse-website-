import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const term = q.trim();

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { description: { contains: term } },
          { brand: { contains: term } },
          { category: { name: { contains: term } } },
        ],
      },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        discountPercent: true,
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
        category: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ suggestions: products });
  } catch (error) {
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
