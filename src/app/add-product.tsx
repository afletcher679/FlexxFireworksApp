import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top }, { paddingLeft: Spacing.three }]}>
    <Pressable onPress={() => router.push('/admin')} style={styles.backButton}>
      <ThemedText style={styles.backArrow}>‹</ThemedText>
      <ThemedText style={styles.backLabel}>Admin</ThemedText>
    </Pressable>
    <ThemedText type="subtitle">Add New Product</ThemedText>
  </ThemedView>
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{ top: insets.top, bottom: insets.bottom }}
      contentContainerStyle={styles.contentContainer}>

        <ThemedView style={styles.formWrapper}>
          <AddProductForm
            onAddProduct={handleAddProduct}
            isOpen={true}
            onOpenChange={() => router.back()}
          />
        </ThemedView>

    </ScrollView>
    </ThemedView>
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
    flexGrow: 1,
    width: '100%',
  },
  header: {
    marginBottom: Spacing.four,
  },
  formWrapper: {
    width: '100%',
  },
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing.one,
  marginBottom: Spacing.two,
},
backArrow: {
  fontSize: 28,
  lineHeight: 30,
},
backLabel: {
  fontSize: 16,
},
});
