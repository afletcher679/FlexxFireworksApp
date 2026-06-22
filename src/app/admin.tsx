import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductUpdateCard } from '@/components/product-update-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Firework } from '@/types';

const ADMIN_PASSWORD = 'test123';

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [products, setProducts] = useState<Firework[]>([]);
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + 80,
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      const typedData = (data || []) as Firework[];
      setProducts(typedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      Alert.alert('Error', 'Incorrect password');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateProduct = async (updatedProduct: Firework) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          brand: updatedProduct.brand || null,
          category: updatedProduct.category,
          price: updatedProduct.price,
          description: updatedProduct.description,
          durationSeconds: updatedProduct.durationSeconds,
          stock: updatedProduct.stock,
          tags: updatedProduct.tags || [],
          videoUrl: updatedProduct.videoUrl || null,
        })
        .eq('id', updatedProduct.id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const handleAddProduct = () => {
    // This will be handled by the "Add Product" screen, so we just navigate there
  };

  if (!isAuthenticated) {
    return (
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInset={insets}
        contentContainerStyle={styles.contentContainer}>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.loginContainer}>
            <ThemedText type="subtitle" style={styles.title}>
              Admin Login
            </ThemedText>
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              Enter password to access inventory
            </ThemedText>

            <TextInput
              style={[
                styles.passwordInput,
                {
                  backgroundColor: theme.backgroundElement,
                  color: theme.text,
                  borderColor: theme.textSecondary,
                },
              ]}
              placeholder="Enter password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={true}
              value={passwordInput}
              onChangeText={setPasswordInput}
            />

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                { backgroundColor: theme.tint },
                pressed && styles.pressed,
              ]}
              onPress={handleLogin}>
              <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                Login
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.headerContainer, {paddingTop: insets.top + Spacing.six }]}>
          <ThemedText type="subtitle">Inventory Management</ThemedText>
          <ThemedView style={styles.buttonRow}>
  <Link href="/add-product" asChild>
    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        { backgroundColor: theme.accent },
        pressed && styles.pressed,
      ]}
        onPress={handleLogout}>
      <ThemedText style={[styles.buttonText, { color: theme.background }]}>
        Add Product
      </ThemedText>
    </Pressable>
  </Link>
  
  <Pressable
    style={({ pressed }) => [
      styles.headerButton,
      { backgroundColor: theme.backgroundElement },
      pressed && styles.pressed,
    ]}
    onPress={handleAddProduct}>
    <ThemedText style={styles.logoutText}>Logout</ThemedText>
  </Pressable>
</ThemedView>

        </ThemedView>

        {/* Products List */}
        <ThemedView style={styles.contentArea}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Products ({products.length})
          </ThemedText>

          {products.map((product) => (
            <ProductUpdateCard
              key={product.id}
              product={product}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
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
  },
  loginContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    gap: Spacing.four,
    justifyContent: 'center',
    minHeight: 400,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logoutButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  headerButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  logoutText: {
    fontSize: 14,
  },
  contentArea: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitle: {
    marginTop: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  addButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productItem: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  deleteButton: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.one,
  },
});
