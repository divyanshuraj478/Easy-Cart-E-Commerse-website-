'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Star, Check } from 'lucide-react';

interface FilterState {
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  discount: string;
  inStock: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: { id: string; name: string; slug: string }[];
}

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  categories,
}: ProductFiltersProps) {
  const brands = [
    'AuraSound',
    'PulseTech',
    'AsusTech',
    'UrbanCraft',
    'AeroStep',
    'GlowGoddess',
    'Caffeto',
    'BeanCraft',
    'ZenFit',
  ];

  return (
    <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
          <SlidersHorizontal className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          Filter Products
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Category</label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ ...filters, category: '' })}
            className={`block w-full rounded-xl px-3 py-1.5 text-left text-xs font-medium transition-colors ${
              !filters.category
                ? 'bg-brand-50 font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-400'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.slug })}
              className={`block w-full rounded-xl px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                filters.category === cat.slug
                  ? 'bg-brand-50 font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Price Range (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <span className="text-xs text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Minimum Rating</label>
        <div className="space-y-1">
          {['4', '3', '2'].map((r) => (
            <button
              key={r}
              onClick={() => onFilterChange({ ...filters, rating: filters.rating === r ? '' : r })}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.rating === r
                  ? 'bg-amber-50 font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {r} Stars & Above
              </span>
              {filters.rating === r && <Check className="h-3.5 w-3.5 text-amber-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Discount</label>
        <div className="space-y-1">
          {['10', '20', '30'].map((d) => (
            <button
              key={d}
              onClick={() => onFilterChange({ ...filters, discount: filters.discount === d ? '' : d })}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.discount === d
                  ? 'bg-rose-50 font-bold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <span>{d}% Off or More</span>
              {filters.discount === d && <Check className="h-3.5 w-3.5 text-rose-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
