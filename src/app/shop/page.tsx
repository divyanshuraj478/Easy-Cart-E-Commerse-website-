'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductType, CategoryType } from '@/types';
import { ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';
  const initialDeals = searchParams.get('deals') === 'true';

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: initialCategory,
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    discount: initialDeals ? '10' : '',
    inStock: false,
  });

  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {}
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.brand) params.set('brand', filters.brand);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.rating) params.set('rating', filters.rating);
        if (filters.discount) params.set('discount', filters.discount);
        if (filters.inStock) params.set('inStock', 'true');
        if (initialSearch) params.set('q', initialSearch);
        if (initialDeals) params.set('flashDeals', 'true');

        params.set('sort', sort);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        setProducts(data.products || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalProducts(data.pagination.total);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters, sort, page, initialSearch, initialDeals]);

  const handleResetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      discount: '',
      inStock: false,
    });
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-violet-800 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black sm:text-4xl">Shop All Products</h1>
        <p className="mt-2 text-xs text-indigo-100 sm:text-sm">
          Browse our complete catalog of {totalProducts} premium items with dynamic filtering and sorting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilters
            filters={filters}
            onFilterChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            onReset={handleResetFilters}
            categories={categories}
          />
        </div>

        {/* Main Product Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Mobile Filter Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-3.5 py-2 text-xs font-bold text-gray-700 md:hidden dark:bg-gray-800 dark:text-gray-200"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing <strong className="text-gray-900 dark:text-white">{products.length}</strong> of{' '}
                <strong className="text-gray-900 dark:text-white">{totalProducts}</strong> products
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="discount_desc">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden mb-6">
              <ProductFilters
                filters={filters}
                onFilterChange={(f) => {
                  setFilters(f);
                  setPage(1);
                  setMobileFilterOpen(false);
                }}
                onReset={handleResetFilters}
                categories={categories}
              />
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid products={products} loading={loading} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="px-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading Shop Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
