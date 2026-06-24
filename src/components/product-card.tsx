// product-card.tsx - Individual product display card component for React Native
// Displays a single firework product with all its details including:
// - Name, brand, and price
// - Category and duration information
// - Description and tags
// - Expandable details with a toggle button

import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Collapsible } from '@/components/ui/collapsible';
import type { Firework } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { ProductVideo } from '@/components/product-video';

// Map video file paths to require statements for local assets
const videoAssets: Record<string, any> = {
  'Double_horror_36_shot.mp4': require('@/assets/videos/Double_horror_36_shot.mp4'),
  'Kush_66_shot.mp4': require('@/assets/videos/Kush_66_shot.mp4'),
  'Liberation_Day_300_shot.mp4': require('@/assets/videos/Liberation_Day_300_shot.mp4'),
  'stage_1_49_shots.mp4': require('@/assets/videos/stage_1_49_shots.mp4'),
  'stargazing_100shots.mp4': require('@/assets/videos/stargazing_100shots.mp4'),
  // Add more videos here as needed
};


interface ProductCardProps {
  product: Firework; // The firework product to display
}

export function ProductCard({ product }: ProductCardProps) {
  // Track video shown state
  const [isVideoShown, setIsVideoShown] = useState(false);
  const theme = useTheme();

    // Helper function to get video source
  const getVideoSource = () => {
    if (!product.video_url) return null;
    
    const required = videoAssets[product.video_url];
    if (required) {
      return required;
    }
    
    // Fallback to URI
    console.log('Using URI fallback:', product.video_url);
    return { uri: product.video_url };
  };

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
      {/* Header section with product name/brand and price */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={themedStyles.productName}>{product.name}</Text>
          {product.type && <Text style={themedStyles.productBrand}>{product.type}</Text>}
        </View>
        <Text style={themedStyles.productPrice}>${product.price}</Text>
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
      
      {product.video_url && (
        <Collapsible title={isVideoShown ? 'Hide Demo' : 'Show Demo'}>
          <View style={[styles.videoContainer, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}>
            <ProductVideo source={getVideoSource()} />
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
  // Video player styling
videoContainer: {
  alignSelf: 'stretch',   // ← replaces width: '100%'
  aspectRatio: 16 / 9,
  borderRadius: 10,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
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
