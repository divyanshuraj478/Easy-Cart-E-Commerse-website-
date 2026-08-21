'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { ProductType } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { StarRating } from '../ui/StarRating';
import { formatCurrency } from '@/lib/formatters';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isPrimary)?.url || product.images[0].url
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-900">
        <div>
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
            <Link href={`/product/${product.slug}`}>
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            {/* Badges */}
            <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10">
              {product.discountPercent > 0 && (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white shadow-md">
                  -{product.discountPercent}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-black text-white shadow-md">
                  BEST SELLER
                </span>
              )}
              {product.isFlashDeal && (
                <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-black text-white shadow-md">
                  HOT DEAL
                </span>
              )}
            </div>

            {/* Top Right Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
              className={`absolute right-2.5 top-2.5 z-10 rounded-full p-2 backdrop-blur-md transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/80 text-gray-700 hover:bg-white dark:bg-gray-900/80 dark:text-gray-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            {/* Quick View Hover Button */}
            <button
              onClick={() => setQuickViewOpen(true)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-gray-900 shadow-lg backdrop-blur-md hover:bg-white dark:bg-gray-900/90 dark:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {product.category?.name || product.brand || 'Easy-Cart'}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-700 dark:text-gray-300">{product.rating}</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800/80">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-black text-gray-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs font-medium text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition-all hover:bg-brand-700 hover:shadow-lg disabled:opacity-50"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{product.stock > 0 ? 'Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
