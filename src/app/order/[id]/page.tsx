'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Printer, Package, Truck, Clock, ShieldCheck, MapPin, ArrowLeft } from 'lucide-react';
import { OrderType } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        }
      } catch (err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
        <p className="mt-2 text-xs font-bold text-gray-500">Loading Order Invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-black">Order Not Found</h2>
        <Link href="/account?tab=orders" className="mt-4 inline-block text-xs font-bold text-brand-600 underline">
          View My Orders
        </Link>
      </div>
    );
  }

  let addressObj: any = {};
  try {
    addressObj = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
  } catch (e) {
    addressObj = { streetAddress: order.shippingAddress };
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 print:p-0 print:max-w-none">
      {/* Top Print & Navigation Bar */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/account?tab=orders" className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-2xl bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-black dark:bg-gray-800"
        >
          <Printer className="h-4 w-4" /> Print Invoice
        </button>
      </div>

      {/* Confirmation Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white shadow-xl space-y-3 print:bg-none print:text-black">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="h-10 w-10 text-white" />
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Order Confirmed!</h1>
            <p className="text-xs text-emerald-100">
              Thank you for shopping with Easy-Cart. Order <strong>#{order.orderNumber}</strong> has been received.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Card Container */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6 print:border-none print:shadow-none">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <span className="text-2xl font-black text-brand-600 dark:text-brand-400">Easy-Cart</span>
            <p className="text-xs text-gray-500">Official Sales Invoice & Receipt</p>
          </div>

          <div className="text-left sm:text-right text-xs text-gray-500">
            <p><strong>Order ID:</strong> #{order.orderNumber}</p>
            <p><strong>Date:</strong> {formatDateTime(order.createdAt)}</p>
            <p><strong>Payment Status:</strong> <span className="font-bold text-emerald-600">{order.paymentStatus}</span></p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50 space-y-2 print:hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Order Status: <span className="text-brand-600">{order.status.replace(/_/g, ' ')}</span>
          </h3>
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="text-emerald-600">✓ Order Placed</span>
            <span>→</span>
            <span className={['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-emerald-600' : ''}>Confirmed</span>
            <span>→</span>
            <span className={['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-emerald-600' : ''}>Shipped</span>
            <span>→</span>
            <span className={order.status === 'DELIVERED' ? 'text-emerald-600' : ''}>Delivered</span>
          </div>
        </div>

        {/* Address & Payment Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Shipping Address</h4>
            <p className="font-bold">{addressObj.fullName}</p>
            <p className="text-gray-500">{addressObj.streetAddress}</p>
            <p className="text-gray-500">{addressObj.city}, {addressObj.state} {addressObj.postalCode}</p>
            <p className="text-gray-500">Phone: {addressObj.phone}</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Payment & Shipping Method</h4>
            <p className="text-gray-500"><strong>Method:</strong> {order.paymentMethod}</p>
            <p className="text-gray-500"><strong>Tracking #:</strong> {order.trackingNumber || 'Pending'}</p>
            <p className="text-gray-500"><strong>Estimated Delivery:</strong> {order.estimatedDelivery || '3-5 Business Days'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Purchased Items</h4>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-bold text-gray-900 dark:text-white">{item.productName}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.productPrice)}</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping Fee</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax Amount</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-black text-gray-900 dark:border-gray-800 dark:text-white">
              <span>Grand Total</span>
              <span className="text-brand-600 dark:text-brand-400">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
