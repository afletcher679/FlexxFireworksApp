// product-card.tsx - Individual product display card component for React Native
// Displays a single firework product with all its details including:
// - Name, brand, and price
// - Category and duration information
// - Description and tags
// - Expandable details with a toggle button

import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import type { Firework } from '@/types';


interface ProductCardProps {
  product: Firework; // The firework product to display
}

const styles = StyleSheet.create({
  // Main card container
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  // Header section with product name/brand and price
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  // Left side of header (name and brand)
  headerLeft: {
    flex: 1,
  },
  // Product name text
  productName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  // Brand text (if available)
  productBrand: {
    fontSize: 13,
    marginTop: 2,
  },
  // Price text
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Meta information container (category and duration)
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  // Category badge styling
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 12,
  },
  // Description text
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  // Tags container
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  // Individual tag styling
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
  },
  // Toggle button styling
  expandButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  expandButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export function ProductCard({ product }: ProductCardProps) {
  // Track expanded/collapsed state for additional details
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  // Dynamic styles based on theme
  const themedStyles = {
    card: [styles.card, { backgroundColor: theme.background, borderColor: theme.border }],
    metaBadge: [styles.metaBadge, { backgroundColor: theme.inputBackground }],
    metaBadgeText: [styles.metaBadgeText, { color: theme.textMuted }],
    productName: [styles.productName, { color: theme.text }],
    productBrand: [styles.productBrand, { color: theme.textMuted }],
    productPrice: [styles.productPrice, { color: theme.accent }],
    description: [styles.description, { color: theme.text }],
    tag: [styles.tag, { backgroundColor: theme.inputBackground }],
    tagText: [styles.tagText, { color: theme.textMuted }],
    expandButton: [styles.expandButton, { backgroundColor: theme.accent }],
  };

  return (
    <View style={themedStyles.card}>
      {/* Header section with product name/brand and price */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={themedStyles.productName}>{product.name}</Text>
          {product.brand && <Text style={themedStyles.productBrand}>{product.brand}</Text>}
        </View>
        <Text style={themedStyles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>

      {/* Meta information: category and duration */}
      <View style={styles.meta}>
        <View style={themedStyles.metaBadge}>
          <Text style={themedStyles.metaBadgeText}>
            {product.category.replace('-', ' ')}
          </Text>
        </View>
        {product.durationSeconds && (
          <View style={themedStyles.metaBadge}>
            <Text style={themedStyles.metaBadgeText}>
              {product.durationSeconds} seconds
            </Text>
          </View>
        )}
      </View>

      {/* Optional description field */}
      {product.description && (
        <Text style={themedStyles.description}>{product.description}</Text>
      )}

      {/* Product tags/labels rendered as individual badges */}
      {product.tags && product.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {product.tags.map((tag) => (
            <View key={tag} style={themedStyles.tag}>
              <Text style={themedStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Toggle button to expand/collapse product details */}
      <Pressable
        style={themedStyles.expandButton}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? 'Show Less' : 'Show More'}
        </Text>
      </Pressable>
    </View>
  );
}

export default ProductCard;
