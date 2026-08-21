'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  Zap,
  TrendingUp,
  Award,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FlashDealTimer } from '@/components/product/FlashDealTimer';
import { ProductType, CategoryType } from '@/types';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [flashDeals, setFlashDeals] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [featRes, flashRes, bestRes, catRes] = await Promise.all([
          fetch('/api/products?featured=true&limit=8'),
          fetch('/api/products?flashDeals=true&limit=4'),
          fetch('/api/products?bestSellers=true&limit=4'),
          fetch('/api/categories'),
        ]);

        const featData = await featRes.json();
        const flashData = await flashRes.json();
        const bestData = await bestRes.json();
        const catData = await catRes.json();

        setFeaturedProducts(featData.products || []);
        setFlashDeals(flashData.products || []);
        setBestSellers(bestData.products || []);
        setCategories(catData.categories || []);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      toast.success('Thank you for subscribing to Easy-Cart deals!');
      setEmailInput('');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-brand-900 to-violet-950 pt-8 pb-16 text-white shadow-2xl">
        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Hero Left CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/20">
                <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
                <span>Everything You Need. Just a Cart Away.</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
                Shop Smarter.{' '}
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                  Live Better.
                </span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-xl text-base text-indigo-100 sm:text-lg leading-relaxed font-light">
                Discover over 30,000+ curated electronics, fashion apparel, beauty cosmetics, and household essentials with express worldwide delivery and 100% buyer protection.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-amber-400 px-8 py-4 text-base font-extrabold text-gray-950 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-300 hover:scale-105"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                </Link>
                <Link
                  href="/shop?deals=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20"
                >
                  <Zap className="h-5 w-5 text-amber-400" />
                  Explore Deals
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left text-xs font-medium text-indigo-200">
                <div>
                  <span className="block text-xl font-extrabold text-white">30,000+</span>
                  <span>Products Available</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-white">99.8%</span>
                  <span>Satisfaction Rate</span>
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-white">24/7</span>
                  <span>Customer Support</span>
                </div>
              </div>
            </div>

            {/* Hero Right Image Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl backdrop-blur-lg">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
                  alt="Easy-Cart Shopping"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-4 text-gray-900 shadow-xl backdrop-blur-md dark:bg-gray-900/90 dark:text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600">Featured Offer</span>
                      <h4 className="text-sm font-black">Aura Studio Headphones</h4>
                    </div>
                    <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-extrabold text-white">20% OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Explore Collections</span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">Shop By Category</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline dark:text-brand-400">
            View All Categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=600&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="mt-2.5 text-xs font-bold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH DEALS SECTION */}
      {flashDeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 p-6 sm:p-8 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white sm:text-2xl">Limited Time Flash Deals</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Extra discounts on trending items before time runs out!</p>
                </div>
              </div>

              <FlashDealTimer />
            </div>

            <ProductGrid products={flashDeals} loading={loading} />
          </div>
        </section>
      )}

      {/* 4. FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Curated For You</span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">Featured Products</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline dark:text-brand-400">
            Explore All Products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* 5. BEST SELLERS SECTION */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Customer Favorites</span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">Best Sellers</h2>
              </div>
            </div>
            <Link href="/shop?sort=popularity" className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline dark:text-brand-400">
              View Popular Items <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ProductGrid products={bestSellers} loading={loading} />
        </section>
      )}

      {/* 6. WHY EASY-CART SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">The Easy-Cart Advantage</span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">Why Millions Choose Easy-Cart</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">We make online shopping reliable, convenient, and completely stress-free.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Fast Worldwide Delivery</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Get your orders delivered swiftly with real-time GPS tracking.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">100% Secure Payments</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bank-level 256-bit SSL encryption for all transaction methods.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <RefreshCw className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Easy 30-Day Returns</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Not completely satisfied? Return or exchange with zero hassle.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <Headphones className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">24/7 Dedicated Support</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Our customer team is always here to resolve any inquiry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
              <Mail className="h-3.5 w-3.5" /> Newsletter Subscription
            </span>
            <h2 className="text-3xl font-black sm:text-4xl">Get Special Offers & Secret Coupons</h2>
            <p className="text-xs text-indigo-100 sm:text-sm">
              Subscribe to the Easy-Cart newsletter and receive a <strong>10% instant discount code</strong> directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-2xl border-none bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
              />
              <button
                type="submit"
                className="flex-shrink-0 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-gray-950 shadow-lg transition-all hover:bg-amber-300"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
