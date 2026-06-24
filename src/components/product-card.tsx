// product-card.tsx - Individual product display card component for React Native
// Displays a single firework product with all its details including:
// - Name, brand, and price
// - Category and duration information
// - Description and tags
// - Expandable details with a toggle button

import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Collapsible } from '@/components/ui/collapsible';
import type { Firework } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { ProductVideo } from '@/components/product-video';
import { ProductImage } from '@/components/product-image';
import { ThemedView } from './themed-view';

interface ProductCardProps {
  product: Firework; // The firework product to display
}

export function ProductCard({ product }: ProductCardProps) {
  // Track video shown state
  const [isVideoShown, setIsVideoShown] = useState(false);
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
    <View style={[themedStyles.card, { borderColor: theme.accentSecondary, borderWidth: 1 }]}>
      {/* Image and Info Section */}
      <View style={styles.contentContainer}>
        {/* Product Image on the left */}
        <ProductImage imageUrl={product.image_url} />

        {/* Product Info on the right */}
        <View style={styles.infoContainer}>
          <Text style={themedStyles.productName}>{product.name}</Text>
          <Text style={themedStyles.productPrice}>${product.price}</Text>

          {/* Meta information: category and duration */}
          <View style={styles.meta}>
            <View style={themedStyles.metaBadge}>
              <Text style={themedStyles.metaBadgeText}>
                {product.category.replace('-', ' ')}
              </Text>
            </View>
            {product.type && (
              <Text style={[themedStyles.productBrand, styles.typeText]}>{product.type}</Text>
            )}
            {product.duration_seconds && (
              <View style={themedStyles.metaBadge}>
                <Text style={themedStyles.metaBadgeText}>
                  {product.duration_seconds} seconds
                </Text>
              </View>
            )}
          </View>

          {/* Optional description field */}
          {product.description && (
            <Text style={[themedStyles.description, styles.descriptionText]}>{product.description}</Text>
          )}
        </View>
      </View>
      
      {product.video_url && (
        <Collapsible title={isVideoShown ? 'Hide Demo' : 'Show Demo'} >
          <View style={[styles.videoContainer, {borderColor: theme.accent}]}>
            <ProductVideo videoUrl={product.video_url} />
          </View>
        </Collapsible>
      )}

      {/* Product effects/labels rendered as individual badges */}
      {product.effects && product.effects.length > 0 && (
        <View style={styles.tagsContainer}>
          {product.effects.map((effect: string) => (
            <View key={effect} style={themedStyles.tag}>
              <Text style={themedStyles.tagText}>{effect}</Text>
            </View>
          ))}
        </View>
      )}

    </View>
  );
}

export default ProductCard;


const styles = StyleSheet.create({
  // Main card container
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  // Content container with image and info side by side
  contentContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  // Info container (name, price, meta, description)
  infoContainer: {
    flex: 1,
  },
  // Product name text
  productName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  // Brand/Type text
  productBrand: {
    fontSize: 13,
    marginBottom: 4,
  },
  // Price text
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  // Meta information container (category and duration)
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
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
  // Type text styling (displayed inline with meta, no badge)
  typeText: {
    marginBottom: 0,
  },
  // Description text
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Description text with spacing
  descriptionText: {
    marginTop: 6,
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
  // Video player styling
  videoContainer: {
    alignSelf: 'stretch',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
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
