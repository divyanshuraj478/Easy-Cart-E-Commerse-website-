'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductType, CategoryType } from '@/types';
import { ArrowUpDown } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('popularity');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products?category=${slug}&sort=${sort}`),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        const currentCat = catData.categories?.find((c: any) => c.slug === slug);
        setCategory(currentCat || { name: slug.toUpperCase(), slug });
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Error fetching category page:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchData();
  }, [slug, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Category Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-brand-800 to-violet-900 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black capitalize sm:text-4xl">
          {category?.name || slug} Category
        </h1>
        {category?.description && (
          <p className="mt-2 text-xs text-indigo-100 sm:text-sm max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Showing <strong className="text-gray-900 dark:text-white">{products.length}</strong> items in{' '}
          <span className="capitalize font-bold text-brand-600 dark:text-brand-400">{category?.name}</span>
        </span>

        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="popularity">Popularity</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price Low to High</option>
            <option value="price_desc">Price High to Low</option>
            <option value="rating_desc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
