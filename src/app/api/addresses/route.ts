import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ addresses: [] });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching addresses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { fullName, phone, streetAddress, city, state, postalCode, country, isDefault } = await req.json();

    if (!fullName || !phone || !streetAddress || !city || !state || !postalCode) {
      return NextResponse.json({ message: 'All address fields are required' }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const count = await prisma.address.count({ where: { userId: user.id } });

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        streetAddress,
        city,
        state,
        postalCode,
        country: country || 'United States',
        isDefault: isDefault || count === 0,
      },
    });

    return NextResponse.json({ address, message: 'Address added' });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding address' }, { status: 500 });
  }
}
