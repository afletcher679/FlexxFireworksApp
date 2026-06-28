// product-list.tsx - Container component for displaying product cards
// Renders a list of firework products using the ProductCard component.
// Shows an empty state message when no products match the current filters.

import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTheme } from "../hooks/use-theme";
import { ProductCard } from "./product-card";
import type { Firework } from "../types";

interface ProductListProps {
  products: Firework[]; // Array of firework products to display
}

const styles = StyleSheet.create({
  // Empty state container
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  // Empty state text
  emptyStateText: {
    fontSize: 16,
  },
  // List container
  listContainer: {
    paddingVertical: 8,
  },
});

export function ProductList({ products }: ProductListProps) {
  const theme = useTheme();

  const themedStyles = {
    emptyStateContainer: [
      styles.emptyStateContainer,
      { backgroundColor: theme.background },
    ],
    emptyStateText: [styles.emptyStateText, { color: theme.textMuted }],
  };

  // Show empty state message when no products match current filters
  if (products.length === 0) {
    return (
      <View style={themedStyles.emptyStateContainer}>
        <Text style={themedStyles.emptyStateText}>
          No products match the current filters.
        </Text>
      </View>
    );
  }

  // Render scrollable list of product cards, one for each product
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

export default ProductList;
