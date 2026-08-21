'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders' | 'users' | 'coupons'>('analytics');

  // Stats Data
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    specifications: '',
    price: '',
    originalPrice: '',
    stock: '50',
    brand: 'Easy-Cart',
    categoryId: '',
    images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    isFeatured: false,
    isBestSeller: false,
    isFlashDeal: false,
  });

  // New Coupon Modal State
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '15',
    minOrderAmount: '40',
  });

  // New Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    async function loadAdminData() {
      if (!user || user.role !== 'ADMIN') return;

      setLoading(true);
      try {
        const [statsRes, prodRes, catRes, ordRes, usrRes, cpnRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/products?limit=50'),
          fetch('/api/categories'),
          fetch('/api/orders'),
          fetch('/api/admin/users'),
          fetch('/api/coupons'),
        ]);

        const sData = await statsRes.json();
        const pData = await prodRes.json();
        const cData = await catRes.json();
        const oData = await ordRes.json();
        const uData = await usrRes.json();
        const cpData = await cpnRes.json();

        setStats(sData);
        setProducts(pData.products || []);
        setCategories(cData.categories || []);
        setOrders(oData.orders || []);
        setUsersList(uData.users || []);
        setCoupons(cpData.coupons || []);
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-xs text-gray-500">You must be logged in as an Administrator to view the store management panel.</p>
        <Link href="/login" className="inline-block rounded-2xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md">
          Sign In as Admin
        </Link>
      </div>
    );
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          images: [productForm.images],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editingProductId ? 'Product updated!' : 'Product added successfully!');
        setProductModalOpen(false);
        setEditingProductId(null);
        // Refresh products list
        const pRes = await fetch('/api/products?limit=50');
        const pData = await pRes.json();
        setProducts(pData.products || []);
      } else {
        toast.error(data.message || 'Error saving product');
      }
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        setProducts((prev) => prev.filter((p) => p.slug !== slug && p.id !== slug));
      }
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`User account status updated to ${nextStatus}`);
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Coupon created successfully!');
        setCouponModalOpen(false);
        const cRes = await fetch('/api/coupons');
        const cData = await cRes.json();
        setCoupons(cData.coupons || []);
      } else {
        toast.error(data.message || 'Error creating coupon');
      }
    } catch (err) {
      toast.error('Error creating coupon');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Category created!');
        setCategoryModalOpen(false);
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      toast.error('Error creating category');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 text-white shadow-xl">
        <div>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            ★ Easy-Cart Store Admin Panel
          </span>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">Manage Store Operations</h1>
        </div>

        <button
          onClick={() => {
            setEditingProductId(null);
            setProductForm({
              name: '',
              description: '',
              specifications: 'Color: Red | Weight: 500g',
              price: '',
              originalPrice: '',
              stock: '50',
              brand: 'Easy-Cart',
              categoryId: categories[0]?.id || '',
              images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
              isFeatured: false,
              isBestSeller: false,
              isFlashDeal: false,
            });
            setProductModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-gray-950 shadow-lg hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      {/* Admin Tab Buttons */}
      <div className="flex overflow-x-auto border-b border-gray-200 space-x-6 text-xs font-bold dark:border-gray-800 pb-2">
        {[
          { id: 'analytics', label: 'Dashboard & Analytics', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'users', label: `Customers (${usersList.length})`, icon: Users },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 pb-2.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD ANALYTICS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(stats.totalSales)}</h3>
              <p className="mt-1 text-[11px] font-bold text-emerald-600">+18.4% from last month</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">{stats.totalOrders}</h3>
              <p className="mt-1 text-[11px] font-bold text-brand-600">{stats.pendingOrders} Pending Fulfillment</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Customers</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">{stats.totalCustomers}</h3>
              <p className="mt-1 text-[11px] font-bold text-amber-600">Active Shoppers</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Products</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">{stats.totalProducts}</h3>
              <p className="mt-1 text-[11px] font-bold text-violet-600">Across 8 Categories</p>
            </div>
          </div>

          {/* Revenue Chart Visual Bar Representation */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white">Monthly Revenue Growth ($)</h3>
            <div className="flex items-end space-x-4 h-48 pt-8">
              {stats.revenueTimeline.map((item: any) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">${item.revenue}</span>
                  <div
                    className="w-full bg-gradient-to-t from-brand-600 to-amber-400 rounded-t-xl transition-all"
                    style={{ height: `${Math.max(20, (item.revenue / 20000) * 100)}%` }}
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider dark:border-gray-800 dark:bg-gray-800/50">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                        <Image src={prod.images?.[0]?.url || 'https://via.placeholder.com/150'} alt="" fill className="object-cover" />
                      </div>
                      <span className="line-clamp-1">{prod.name}</span>
                    </td>
                    <td className="p-4">{prod.category?.name}</td>
                    <td className="p-4 font-bold text-brand-600">{formatCurrency(prod.price)}</td>
                    <td className="p-4">
                      <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="p-4">★ {prod.rating} ({prod.reviewCount})</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProductId(prod.id);
                          setProductForm({
                            name: prod.name,
                            description: prod.description,
                            specifications: prod.specifications || '',
                            price: prod.price.toString(),
                            originalPrice: prod.originalPrice.toString(),
                            stock: prod.stock.toString(),
                            brand: prod.brand || 'Easy-Cart',
                            categoryId: prod.categoryId,
                            images: prod.images?.[0]?.url || '',
                            isFeatured: prod.isFeatured,
                            isBestSeller: prod.isBestSeller,
                            isFlashDeal: prod.isFlashDeal,
                          });
                          setProductModalOpen(true);
                        }}
                        className="text-brand-600 hover:underline font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.slug)}
                        className="text-rose-600 hover:underline font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white">{cat.name}</h4>
                <p className="text-xs text-gray-500">{cat.description || 'No description'}</p>
                <p className="text-[10px] font-bold text-brand-600">Slug: {cat.slug}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider dark:border-gray-800 dark:bg-gray-800/50">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">#{ord.orderNumber}</td>
                    <td className="p-4">{ord.user?.name || 'Guest'}</td>
                    <td className="p-4 font-bold text-brand-600">{formatCurrency(ord.grandTotal)}</td>
                    <td className="p-4 font-bold text-emerald-600">{ord.paymentStatus} ({ord.paymentMethod})</td>
                    <td className="p-4">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-1.5 text-xs font-bold text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="ORDER_PLACED">ORDER_PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider dark:border-gray-800 dark:bg-gray-800/50">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Toggle Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{u.name}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4 font-bold">{u.role}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          {u.status === 'ACTIVE' ? 'Disable Account' : 'Enable Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setCouponModalOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {coupons.map((cpn) => (
              <div key={cpn.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-2">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-black text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {cpn.code}
                </span>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Discount: {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}% OFF` : `$${cpn.discountValue} OFF`}
                </p>
                <p className="text-[11px] text-gray-500">Min Order: ${cpn.minOrderAmount} • Used: {cpn.usedCount} times</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <textarea
                required
                rows={3}
                placeholder="Product Description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Specifications (e.g. Color: Red | Driver: 40mm)"
                value={productForm.specifications}
                onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Price ($)"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Original Price ($)"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Brand Name"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Product Image URL"
                value={productForm.images}
                onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <div className="flex space-x-4 pt-2">
                <label className="flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={productForm.isFlashDeal}
                    onChange={(e) => setProductForm({ ...productForm, isFlashDeal: e.target.checked })}
                  />
                  <span>Flash Deal</span>
                </label>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand-600 py-2.5 font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:text-white space-y-4">
            <h3 className="text-base font-black">Create Discount Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Coupon Code (e.g. SUMMER25)"
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Value"
                  value={couponForm.discountValue}
                  onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand-600 py-2.5 font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:text-white space-y-4">
            <h3 className="text-base font-black">Create Product Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand-600 py-2.5 font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
