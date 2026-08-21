import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        fullName: body.fullName ?? existing.fullName,
        phone: body.phone ?? existing.phone,
        streetAddress: body.streetAddress ?? existing.streetAddress,
        city: body.city ?? existing.city,
        state: body.state ?? existing.state,
        postalCode: body.postalCode ?? existing.postalCode,
        country: body.country ?? existing.country,
        isDefault: body.isDefault !== undefined ? body.isDefault : existing.isDefault,
      },
    });

    return NextResponse.json({ address: updated, message: 'Address updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating address' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ message: 'Address deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting address' }, { status: 500 });
  }
}
