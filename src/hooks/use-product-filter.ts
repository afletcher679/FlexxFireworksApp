// use-product-filter.ts - Custom hook for managing product filtering and sorting
// Handles all filtering logic including:
// - Text search across product name, description, and tags
// - Category-based filtering (multi-select)
// - Maximum price filtering
// - Multiple sorting options (name A-Z, price ascending/descending)
// Uses useMemo for performance optimization to avoid unnecessary recalculations

import { useState, useMemo } from 'react';

// Product type - should match your Firework interface
export interface Firework {
  id: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  durationSeconds?: number;
  description?: string;
  videoUrl?: string;
  stock: number;
  tags?: string[];
}

// Category type definition
export type Category = string; // Update this based on your actual categories

export type SortOptions = 'price-asc' | 'price-desc' | 'name';

export interface Filters {
  query: string;
  categories: Set<Category>;
  maxPrice: number | null;
}

const EMPTY_FILTERS: Filters = {
  query: '',
  categories: new Set(),
  maxPrice: null,
};

// Helper function to check if a product matches the search query
// Searches across product name, description, and tags
function matchesQuery(firework: Firework, query: string): boolean {
  if (!query) return true;
  const haystack = [
    firework.name,
    firework.description ?? '',
    ...(firework.tags ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

export function useProductFilter(products: Firework[]) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortOptions>('name');

  // Memoize filtered and sorted products to avoid unnecessary recalculations
  // Only recalculates when products, filters, or sortKey change
  const filteredProducts = useMemo(() => {
    // Apply all active filters
    const result = products.filter((product) => {
      if (!matchesQuery(product, filters.query)) return false;
      if (
        filters.categories.size > 0 &&
        !filters.categories.has(product.category)
      )
        return false;
      if (filters.maxPrice !== null && product.price > filters.maxPrice)
        return false;
      return true;
    });

    // Sort by selected option
    switch (sortKey) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'name':
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, filters, sortKey]);

  // Return hook state and methods for managing filters
  return { filters, setFilters, sortKey, setSortKey, filteredProducts };
}
