'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface Category {
  _id: string;
  name: string;
}

interface CoursesFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export default function CoursesFilters({
  categories,
  currentCategory,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: CoursesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(currentMinPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice || '');

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to first page when filter changes
    params.delete('page');
    
    startTransition(() => {
      router.push(`/courses?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', search);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    
    params.delete('page');
    
    startTransition(() => {
      router.push(`/courses?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    startTransition(() => {
      router.push('/courses');
    });
  };

  const hasActiveFilters = 
    currentCategory || 
    currentSort || 
    currentMinPrice || 
    currentMaxPrice || 
    searchParams.get('search');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Courses
        </label>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {isPending ? '...' : 'Go'}
          </button>
        </form>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={currentSort || ''}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:opacity-50"
        >
          <option value="">Default (Newest)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Category
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <button
            onClick={() => updateFilter('category', '')}
            disabled={isPending}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
              !currentCategory
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => updateFilter('category', category._id)}
              disabled={isPending}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                currentCategory === category._id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-3">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min price ($)"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price ($)"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
          <button
            onClick={handlePriceFilter}
            disabled={isPending}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {isPending ? 'Applying...' : 'Apply Price Filter'}
          </button>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {searchParams.get('search') && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Search: {searchParams.get('search')}
              </span>
            )}
            {currentCategory && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Category
              </span>
            )}
            {currentSort && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Sorted
              </span>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Price Range
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}