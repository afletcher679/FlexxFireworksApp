import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

// Map image file paths to require statements for local assets
const imageAssets: Record<string, any> = {
  'coming_soon_flame.jpg': require('@/assets/images/fireworks/coming_soon_flame.jpg'),
  // Add more images here as needed
};

interface ProductImageProps {
  imageUrl?: string;
}

export function ProductImage({ imageUrl }: ProductImageProps) {
  if (!imageUrl) return null;

  const getImageSource = () => {
    // Extract filename from full path (e.g., "assets/images/fireworks/coming_soon_flame.jpg" -> "coming_soon_flame.jpg")
    const filename = imageUrl.split('/').pop();
    const required = filename ? imageAssets[filename] : null;

    if (required) {
      return required;
    }

    // Fallback to URI
    console.log('Using URI fallback for image:', imageUrl);
    return { uri: imageUrl };
  };

  return <Image source={getImageSource()} style={styles.productImage} />;
}

const styles = StyleSheet.create({
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    flexShrink: 0,
  },
});
