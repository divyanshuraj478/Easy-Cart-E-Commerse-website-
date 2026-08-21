'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, Plus, Minus, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/formatters';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Shopping Cart</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Review your selected items before proceeding to checkout</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Your Shopping Cart is Empty</h3>
          <p className="mt-1 text-xs text-gray-500">Explore our wide selection of products and find something you love!</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-8 py-3 text-xs font-bold text-white shadow-lg hover:bg-brand-700"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Cart Table List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="divide-y divide-gray-100 dark:divide-gray-800 p-4 sm:p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={item.product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <Link href={`/product/${item.product.slug}`} className="text-sm font-bold text-gray-900 hover:text-brand-600 dark:text-white">
                          {item.product.name}
                        </Link>
                        <div className="text-xs text-gray-500">
                          Price: <span className="font-bold text-brand-600">{formatCurrency(item.product.price)}</span>
                        </div>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex gap-2 text-[11px] text-gray-400">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-6">
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link href="/shop" className="text-xs font-bold text-brand-600 hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-100 pb-3 dark:border-gray-800">
                Order Summary
              </h3>

              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" /> Coupon "{coupon.code}" Applied
                  </span>
                  <button onClick={removeCoupon} className="text-rose-600 underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (couponInput) await applyCoupon(couponInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. EASY20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black dark:bg-gray-800"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Cost Table */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Discount Savings</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(taxAmount)}</span>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900 dark:border-gray-800 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-brand-600 dark:text-brand-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-brand-500/20 transition-all hover:bg-brand-700"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
