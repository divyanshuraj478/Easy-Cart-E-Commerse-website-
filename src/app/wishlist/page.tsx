'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/formatters';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">My Wishlist ❤️</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Saved products you love. Move them to your cart whenever you are ready!
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950 dark:text-rose-400">
            <Heart className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Your Wishlist is Empty</h3>
          <p className="mt-1 text-xs text-gray-500">Click the heart icon on any product card to save your favorites!</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-8 py-3 text-xs font-bold text-white shadow-lg hover:bg-brand-700"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-500 shadow-md backdrop-blur-md hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {product.category?.name}
                  </span>
                  <Link href={`/product/${product.slug}`} className="block">
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900 hover:text-brand-600 dark:text-white">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-black text-brand-600 dark:text-brand-400">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  disabled={product.stock <= 0}
                  onClick={() => {
                    addToCart(product);
                    removeFromWishlist(product.id);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 disabled:opacity-50"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
