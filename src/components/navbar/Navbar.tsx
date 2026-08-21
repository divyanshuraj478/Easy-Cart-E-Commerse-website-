'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SearchAutocomplete } from './SearchAutocomplete';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Books', slug: 'books' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-800/80 dark:bg-gray-950/80">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-4 py-1.5 text-center text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 animate-bounce-subtle text-amber-300" />
          Grand Sale: Use Code <span className="underline decoration-amber-300 font-bold">EASY20</span> for 20% OFF! Free Shipping on orders over ₹1,499.
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-transform group-hover:scale-105">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              Easy<span className="text-brand-600 dark:text-brand-400">-Cart</span>
            </span>
            <span className="hidden text-[10px] font-medium tracking-wide text-gray-500 sm:block dark:text-gray-400">
              Shop Smarter. Live Better.
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden flex-1 justify-center md:flex px-4">
          <SearchAutocomplete />
        </div>

        {/* Action Icons & Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          )}

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-900/60"
          >
            <ShoppingBag className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Auth Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 p-1 pr-2.5 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[100px] truncate text-xs font-semibold text-gray-800 sm:inline dark:text-gray-200">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                  <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    {user.role === 'ADMIN' && (
                      <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                        STORE ADMIN
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                    <Link
                      href="/account?tab=addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <MapPin className="h-4 w-4" />
                      Saved Addresses
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              Sign In
            </Link>
          )}

          {/* Hamburger Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <SearchAutocomplete />
      </div>

      {/* Navigation Sub-Bar (Desktop) */}
      <nav className="hidden border-t border-gray-100 bg-gray-50/50 md:block dark:border-gray-800/60 dark:bg-gray-900/50">
        <div className="mx-auto flex max-w-7xl items-center space-x-6 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-bold text-gray-900 shadow-sm border border-gray-200 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <Layers className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              All Categories
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="block rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/"
            className={`transition-colors hover:text-brand-600 ${
              pathname === '/' ? 'font-bold text-brand-600 dark:text-brand-400' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`transition-colors hover:text-brand-600 ${
              pathname === '/shop' ? 'font-bold text-brand-600 dark:text-brand-400' : ''
            }`}
          >
            Shop All
          </Link>
          <Link
            href="/shop?deals=true"
            className="flex items-center gap-1 font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Flash Deals
          </Link>
          <Link href="/wishlist" className="transition-colors hover:text-brand-600">
            Wishlist ({wishlist.length})
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="ml-auto font-bold text-amber-600 hover:underline dark:text-amber-400"
            >
              ★ Store Admin Panel
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white px-4 pb-6 pt-3 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col space-y-3 font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Shop All
            </Link>
            <Link
              href="/shop?deals=true"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 dark:text-amber-400"
            >
              🔥 Flash Deals
            </Link>
            <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
              <p className="px-3 text-xs font-bold uppercase tracking-wider text-gray-400">Categories</p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
