import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AddProductForm } from '@/components/add-product-form';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AddProductPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const handleAddProduct = async (newProduct: {
    name: string;
    brand: string;
    category: string;
    price: string;
    description: string;
    durationSeconds: string;
    stock: string;
    tags: string;
    videoUrl: string;
  }) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          brand: newProduct.brand || null,
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          durationSeconds: parseInt(newProduct.durationSeconds) || 0,
          stock: parseInt(newProduct.stock) || 0,
          tags: newProduct.tags ? newProduct.tags.split(',').map(t => t.trim()) : [],
          videoUrl: newProduct.videoUrl || null,
        }]);

      if (error) throw error;
      router.back();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{ top: insets.top, bottom: insets.bottom }}
      contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Add New Product</ThemedText>
        </ThemedView>

        <ThemedView style={styles.formWrapper}>
          <AddProductForm
            onAddProduct={handleAddProduct}
            isOpen={true}
            onOpenChange={() => router.back()}
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: 800,
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  header: {
    marginBottom: Spacing.four,
  },
  formWrapper: {
    width: '100%',
  },
});
