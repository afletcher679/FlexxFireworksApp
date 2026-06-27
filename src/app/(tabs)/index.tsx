import { useMemo, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase, testConnection } from '@/lib/supabase';
import type { Firework, Category } from '@/types';
import { useProductFilter } from '@/hooks/use-product-filter';
import { SearchBar } from '@/components/search-bar';
import { FilterPanel } from '@/components/filter-panel';
import { ProductList } from '@/components/product-list';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';


export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [products, setProducts] = useState<Firework[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('fireworks')
          .select('*');

        if (error) throw error;
       // Transform and validate the data
      const typedData = (data || []) as Firework[];
    
        setProducts(typedData);
      } catch (error) {
        console.error('Error fetching fireworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const { filters, setFilters, sortKey, setSortKey, filteredProducts } =
    useProductFilter(products);

const maxPriceCeiling = useMemo(() => {
  if (products.length === 0) return 100;
  return Math.ceil(Math.max(...products.map(p => parseFloat(p.price as unknown as string))));
}, [products]);


if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: theme.background }, { paddingTop: insets.top + Spacing.six }, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </ThemedView>
    );
  }
  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }, { paddingTop: insets.top + Spacing.six }]}>
      <ThemedText style={{ color: theme.textMuted, textAlign: 'center' }}>{products.length} fireworks</ThemedText>
      {/* Sticky controls section - OUTSIDE ScrollView */}
      <ThemedView style={[styles.stickyControls, { borderBottomColor: theme.border }]}>

        <Collapsible title="Search, Filter, and Sort">
          <SearchBar
            query={filters.query}
            onQueryChange={query => setFilters({ ...filters, query })}
          />
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            sortOption={sortKey}
            setSortOption={setSortKey}
            maxPriceCeiling={maxPriceCeiling}
          />
        </Collapsible>
      </ThemedView>

      {/* Main scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
      >
        <ThemedView style={styles.main}>
          <ProductList products={filteredProducts} />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  stickyControls: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  main: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
});
