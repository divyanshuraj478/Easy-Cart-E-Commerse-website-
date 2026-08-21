import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const discount = searchParams.get('discount');
    const inStock = searchParams.get('inStock');
    const q = searchParams.get('q');
    const isFeatured = searchParams.get('featured');
    const isBestSeller = searchParams.get('bestSellers');
    const isFlashDeal = searchParams.get('flashDeals');
    const sort = searchParams.get('sort') || 'popularity';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { equals: brand };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    if (discount) {
      where.discountPercent = { gte: parseInt(discount) };
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isBestSeller === 'true') {
      where.isBestSeller = true;
    }

    if (isFlashDeal === 'true') {
      where.isFlashDeal = true;
    }

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { brand: { contains: q } },
        { category: { name: { contains: q } } },
      ];
    }

    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating_desc':
        orderBy = { rating: 'desc' };
        break;
      case 'discount_desc':
        orderBy = { discountPercent: 'desc' };
        break;
      case 'popularity':
      default:
        orderBy = { reviewCount: 'desc' };
        break;
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: true,
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      specifications,
      price,
      originalPrice,
      stock,
      brand,
      categoryId,
      images,
      colors,
      sizes,
      isFeatured,
      isBestSeller,
      isFlashDeal,
    } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ message: 'Required fields missing' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const origPrice = parseFloat(originalPrice) || parseFloat(price);
    const numPrice = parseFloat(price);
    const discountPercent = origPrice > numPrice ? Math.round(((origPrice - numPrice) / origPrice) * 100) : 0;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        specifications: specifications || null,
        price: numPrice,
        originalPrice: origPrice,
        discountPercent,
        stock: parseInt(stock) || 0,
        brand: brand || null,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isFlashDeal: Boolean(isFlashDeal),
        flashDealEnd: isFlashDeal ? new Date(Date.now() + 86400000 * 3) : null,
      },
    });

    // Create Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: images[i],
            isPrimary: i === 0,
          },
        });
      }
    } else {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          isPrimary: true,
        },
      });
    }

    // Create Variants
    if (Array.isArray(colors)) {
      for (const color of colors) {
        await prisma.productVariant.create({
          data: { productId: product.id, type: 'Color', value: color, stock: Math.floor(product.stock / colors.length) },
        });
      }
    }

    if (Array.isArray(sizes)) {
      for (const size of sizes) {
        await prisma.productVariant.create({
          data: { productId: product.id, type: 'Size', value: size, stock: Math.floor(product.stock / sizes.length) },
        });
      }
    }

    const created = await prisma.product.findUnique({
      where: { id: product.id },
      include: { category: true, images: true, variants: true },
    });

    return NextResponse.json({ product: created, message: 'Product created successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}
