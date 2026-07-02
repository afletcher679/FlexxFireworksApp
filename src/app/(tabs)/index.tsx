import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductList } from "../../components/product-list";
import { ProductSearchFilterControls } from "../../components/product-search-filter-controls";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { Spacing } from "../../constants/theme";
import { useProductFilter } from "../../hooks/use-product-filter";
import { useTheme } from "../../hooks/use-theme";
import { supabase } from "../../lib/supabase";
import type { Firework } from "../../types";

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [products, setProducts] = useState<Firework[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterControlsOpen, setIsFilterControlsOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("fireworks").select("*");

      if (error) throw error;

      const typedData = (data || []) as Firework[];
      setProducts(typedData);
    } catch (error) {
      console.error("Error fetching fireworks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const refreshCatalog = async () => {
        await supabase.auth.signOut();
        fetchProducts();
      };

      refreshCatalog();
    }, [fetchProducts]),
  );
  const { filters, setFilters, sortKey, setSortKey, filteredProducts } =
    useProductFilter(products);

  const maxPriceCeiling = useMemo(() => {
    if (products.length === 0) return 100;
    return Math.ceil(
      Math.max(
        ...products.map((p) => parseFloat(p.price as unknown as string)),
      ),
    );
  }, [products]);

  if (loading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: theme.background },
          { paddingTop: insets.top + Spacing.four },
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.tint} />
      </ThemedView>
    );
  }
  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: theme.background },
        { paddingTop: insets.top + Spacing.four },
      ]}
    >
      <ThemedText style={{ color: theme.textMuted, textAlign: "center" }}>
        {products.length} fireworks
      </ThemedText>
      {/* Sticky controls section - OUTSIDE ScrollView */}
      <ThemedView
        style={[styles.stickyControls, { borderBottomColor: theme.border }]}
      >
        <ThemedView onTouchStart={(event) => event.stopPropagation()}>
          <ProductSearchFilterControls
            filters={filters}
            setFilters={setFilters}
            sortKey={sortKey}
            setSortKey={setSortKey}
            maxPriceCeiling={maxPriceCeiling}
            isOpen={isFilterControlsOpen}
            onOpenChange={setIsFilterControlsOpen}
          />
        </ThemedView>
      </ThemedView>

      {/* Main scrollable content */}
      <ScrollView
        style={styles.scrollView}
        onTouchStart={() => {
          if (isFilterControlsOpen) {
            setIsFilterControlsOpen(false);
          }
        }}
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
    alignItems: "center",
    gap: Spacing.one,
  },
  stickyControls: {
    padding: Spacing.four,
    gap: Spacing.three,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  main: {
    padding: Spacing.four,
  },
});
