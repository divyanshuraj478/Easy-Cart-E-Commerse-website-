import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { rating, title, comment } = await req.json();

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: 'Review not found' }, { status: 404 });

    if (existing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: rating !== undefined ? parseInt(rating) : existing.rating,
        title: title ?? existing.title,
        comment: comment ?? existing.comment,
      },
    });

    return NextResponse.json({ review: updated, message: 'Review updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating review' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: 'Review not found' }, { status: 404 });

    if (existing.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting review' }, { status: 500 });
  }
}
