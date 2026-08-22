'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/formatters';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    grandTotal,
    discountAmount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = React.useState('');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl dark:bg-gray-900 dark:text-white flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-base font-black text-gray-900 dark:text-white">Your Shopping Cart</h2>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {items.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 dark:divide-gray-800">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">Your cart is empty</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Discover amazing deals and start adding products!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 rounded-2xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white">
                        <h3 className="line-clamp-1">{item.product.name}</h3>
                        <span>{formatCurrency(item.product.price * item.quantity)}</span>
                      </div>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {item.selectedColor && `Color: ${item.selectedColor} `}
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-3 dark:border-gray-800">
              {/* Coupon Row */}
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Coupon "{coupon.code}" Applied (-{formatCurrency(discountAmount)})
                  </span>
                  <button onClick={removeCoupon} className="text-rose-600 underline text-[10px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (couponCode) await applyCoupon(couponCode);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. EASY20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black dark:bg-gray-800"
                  >
                    Apply
                  </button>
                </form>
              )}

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {subtotal >= 1499 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black text-gray-900 dark:border-gray-800 dark:text-white">
                  <span>Estimated Total</span>
                  <span className="text-brand-600 dark:text-brand-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Checkout <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
