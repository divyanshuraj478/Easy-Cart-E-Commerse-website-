import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: 'Product ID, rating, and comment are required' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: parseInt(rating),
        title: title || null,
        comment,
        status: 'APPROVED',
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    // Update product average rating and count
    const reviews = await prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / reviews.length).toFixed(1));

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    });

    return NextResponse.json({ review, message: 'Review posted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error submitting review' }, { status: 500 });
  }
}
