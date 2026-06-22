import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import productsData from '@/data/products.json';
import type { Firework } from '@/types';
import { useProductFilter } from '../hooks/use-product-filter';
import { SearchBar } from '@/components/search-bar';
import { FilterPanel } from '@/components/filter-panel';
import { ProductList } from '@/components/product-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const products: Firework[] = productsData as Firework[];

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const { filters, setFilters, sortKey, setSortKey, filteredProducts } =
    useProductFilter(products);

  const maxPriceCeiling = useMemo(() => {
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }, { paddingTop: insets.top + Spacing.six }]}>
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
