'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Heart, ShoppingBag, Check, Star, Shield, Truck } from 'lucide-react';
import { ProductType } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { StarRating } from '../ui/StarRating';
import { formatCurrency } from '@/lib/formatters';

interface QuickViewModalProps {
  product: ProductType | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const colorVariants = product.variants?.filter((v) => v.type === 'Color') || [];
  const sizeVariants = product.variants?.filter((v) => v.type === 'Size') || [];
  const isWishlisted = isInWishlist(product.id);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', isPrimary: true }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
              <Image
                src={images[selectedImageIndex]?.url || images[0].url}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discountPercent > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-md">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-brand-600' : 'border-transparent opacity-70'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {product.category?.name || 'General'}
              </span>
              <h2 className="mt-1 text-xl font-black text-gray-900 dark:text-white">{product.name}</h2>

              {/* Rating */}
              <div className="mt-2 flex items-center space-x-2">
                <StarRating rating={product.rating} size={16} />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className={`ml-auto text-xs font-bold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-600 line-clamp-3 dark:text-gray-300">
                {product.description}
              </p>

              {/* Color Selector */}
              {colorVariants.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Select Color: <span className="text-brand-600">{selectedColor || 'Choose option'}</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorVariants.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.value)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          selectedColor === c.value
                            ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {c.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {sizeVariants.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Select Size: <span className="text-brand-600">{selectedSize || 'Choose option'}</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizeVariants.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.value)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                          selectedSize === s.value
                            ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {s.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center space-x-3">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                disabled={product.stock <= 0}
                onClick={() => {
                  addToCart(product, quantity, selectedColor, selectedSize);
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-700 disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`rounded-2xl border p-3 transition-colors ${
                  isWishlisted
                    ? 'border-rose-500 bg-rose-50 text-rose-500 dark:bg-rose-950/50'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
