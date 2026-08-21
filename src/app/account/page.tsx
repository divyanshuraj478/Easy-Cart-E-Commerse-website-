'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  Heart,
  Star,
  Plus,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OrderType, AddressType } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import toast from 'react-hot-toast';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'profile';

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Add Address Form modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  useEffect(() => {
    if (!user) return;

    if (activeTab === 'orders') {
      setLoadingOrders(true);
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .finally(() => setLoadingOrders(false));
    }

    if (activeTab === 'addresses') {
      setLoadingAddresses(true);
      fetch('/api/addresses')
        .then((res) => res.json())
        .then((data) => setAddresses(data.addresses || []))
        .finally(() => setLoadingAddresses(false));
    }
  }, [user, activeTab]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Address saved!');
        setAddressModalOpen(false);
        setNewAddr({
          fullName: '',
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'United States',
          isDefault: false,
        });
        const refRes = await fetch('/api/addresses');
        const refData = await refRes.json();
        setAddresses(refData.addresses || []);
      } else {
        toast.error(data.message || 'Failed to add address');
      }
    } catch (err) {
      toast.error('Error adding address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Address deleted');
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      toast.error('Error deleting address');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) {
        toast.success('Order cancelled');
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
        );
      }
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Please Sign In</h2>
        <p className="text-xs text-gray-500">You must be logged in to view your profile and orders.</p>
        <Link href="/login" className="inline-block rounded-2xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-xl font-black text-white shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-xs text-gray-500">{user.email} • {user.phone || 'No phone set'}</p>
            <span className="mt-1 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {user.role} ACCOUNT
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 space-x-8 text-xs font-bold dark:border-gray-800">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'profile'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <User className="h-4 w-4" /> Personal Info
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <Package className="h-4 w-4" /> My Orders
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'addresses'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
          }`}
        >
          <MapPin className="h-4 w-4" /> Address Book
        </button>
      </div>

      {/* Tab 1: Profile Info */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 max-w-xl space-y-4">
          <h3 className="text-base font-black text-gray-900 dark:text-white">Account Details</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Full Name</span>
              <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Email Address</span>
              <span className="font-bold text-gray-900 dark:text-white">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Phone Number</span>
              <span className="font-bold text-gray-900 dark:text-white">{user.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Member Since</span>
              <span className="font-bold text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders List & Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <p className="text-xs text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <Package className="mx-auto h-10 w-10 text-gray-400" />
              <h4 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">No Orders Placed Yet</h4>
              <p className="text-xs text-gray-500">Your order history will appear here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 dark:border-gray-800 text-xs">
                  <div>
                    <span className="font-black text-gray-900 dark:text-white text-sm">Order #{order.orderNumber}</span>
                    <span className="ml-3 text-gray-400">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-black text-brand-600 dark:text-brand-400">{formatCurrency(order.grandTotal)}</span>
                  </div>
                </div>

                {/* Status Timeline Bar */}
                <div className="py-2">
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2">Fulfillment Progress:</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    <span className={order.status !== 'CANCELLED' ? 'text-emerald-600' : ''}>Placed</span>
                    <span>→</span>
                    <span className={['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-emerald-600' : ''}>Confirmed</span>
                    <span>→</span>
                    <span className={['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'text-emerald-600' : ''}>Shipped</span>
                    <span>→</span>
                    <span className={order.status === 'DELIVERED' ? 'text-emerald-600' : ''}>Delivered</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-xs">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{item.productName}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} × {formatCurrency(item.productPrice)}</p>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link href={`/order/${order.id}`} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> View Invoice & Details
                  </Link>

                  {['ORDER_PLACED', 'CONFIRMED'].includes(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Address Book */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">Saved Delivery Addresses</h3>
            <button
              onClick={() => setAddressModalOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add Address
            </button>
          </div>

          {loadingAddresses ? (
            <p className="text-xs text-gray-500">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <MapPin className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-xs font-bold text-gray-900 dark:text-white">No addresses saved yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="relative rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-2"
                >
                  {addr.isDefault && (
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      DEFAULT ADDRESS
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{addr.fullName}</h4>
                  <p className="text-xs text-gray-500">{addr.streetAddress}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}</p>
                  <p className="text-xs text-gray-500">Phone: {addr.phone}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Address Modal */}
          {addressModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:text-white space-y-4">
                <h3 className="text-base font-black">Add New Delivery Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={newAddr.streetAddress}
                    onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Country"
                      value={newAddr.country}
                      onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAddressModalOpen(false)}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-brand-600 py-2.5 font-bold text-white shadow-md hover:bg-brand-700"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading Account Dashboard...</div>}>
      <AccountContent />
    </Suspense>
  );
}
