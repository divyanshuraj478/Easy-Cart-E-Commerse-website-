'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductType } from '@/types';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchProducts() {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    searchProducts();
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center space-x-3 text-brand-600 dark:text-brand-400">
          <Search className="h-6 w-6" />
          <h1 className="text-xl font-black text-gray-900 dark:text-white sm:text-2xl">
            Search Results for <span className="text-brand-600 dark:text-brand-400">"{query}"</span>
          </h1>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Found <strong>{products.length}</strong> matching products.
        </p>
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
