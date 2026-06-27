import { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '../../lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { InventoryCard } from '../../components/inventory-card';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/use-theme';
import { Firework } from '../../types';
import { Collapsible } from '../../components/ui/collapsible';
import { useProductFilter } from '../../hooks/use-product-filter';
import { FilterPanel } from '../../components/filter-panel';
import SearchBar from '../../components/search-bar';

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [products, setProducts] = useState<Firework[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + 80,
  };
const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

    // Reset auth state when the tab loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsAuthenticated(false);
        setEmail('');
        setPasswordInput('');
        setLoginError('');
        setProducts([]);
        supabase.auth.signOut();
      };
    }, [])
  );
  
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('fireworks')
        .select('*');

      if (error) throw error;
      const typedData = (data || []) as Firework[];
      setProducts(typedData);
    } catch (error) {
      console.error('Error fetching fireworks:', error);
    }
  };

const handleLogin = async () => {
    if (!email || !passwordInput) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Attempting sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordInput,
      });

      console.log('Auth response - data:', JSON.stringify(data), 'error:', JSON.stringify(error));

      if (error) throw error;

      // Check if the signed-in user has the admin role
      console.log('Checking profile for user id:', data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      console.log('Profile response - data:', JSON.stringify(profile), 'error:', JSON.stringify(profileError));

      if (profileError) throw profileError;

      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        Alert.alert('Access Denied', 'You do not have admin permissions');
        return;
      }

      setIsAuthenticated(true);
      setPasswordInput('');
      setEmail('');
    } catch (error: any) {
      console.log('Login error caught:', JSON.stringify(error));
      setLoginError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateProduct = async (updatedProduct: Firework) => {
    try {
      const { error } = await supabase
        .from('fireworks')
        .update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          price: updatedProduct.price,
          description: updatedProduct.description,
          duration_seconds: updatedProduct.duration_seconds,
          stock_quantity: updatedProduct.stock_quantity,
          effects: updatedProduct.effects || [],
          video_url: updatedProduct.video_url || null,
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
        .from('fireworks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting fireworks:', error);
      throw error;
    }
  };

  const handleAddProduct = () => {
    router.push('/add-product');
  };
  const { filters, setFilters, sortKey, setSortKey, filteredProducts } =
    useProductFilter(products);
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
              Sign in to access inventory
            </ThemedText>

            {loginError ? (
              <ThemedText style={styles.errorText}>{loginError}</ThemedText>
            ) : null}

            <TextInput
              style={[
                styles.passwordInput,
                {
                  backgroundColor: theme.backgroundElement,
                  color: theme.text,
                  borderColor: loginError ? '#ef4444' : theme.textSecondary,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => { setLoginError(''); setEmail(text); }}
            />

            <TextInput
              style={[
                styles.passwordInput,
                {
                  backgroundColor: theme.backgroundElement,
                  color: theme.text,
                  borderColor: theme.textSecondary,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={true}
              value={passwordInput}
              onChangeText={(text) => { setLoginError(''); setPasswordInput(text); }}
            />

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                { backgroundColor: theme.tint },
                pressed && styles.pressed,
              ]}
              onPress={handleLogin}
              disabled={isLoading}>
              <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                {isLoading ? 'Signing in...' : 'Login'}
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
                <Pressable
                  style={({ pressed }) => [
                    styles.addButton,
                    { backgroundColor: theme.accent },
                    pressed && styles.pressed,
                  ]}
                  onPress={handleAddProduct}>
      <ThemedText style={[styles.buttonText, { color: theme.background }]}>
        Add Product
      </ThemedText>
    </Pressable>
  
  <Pressable
    style={({ pressed }) => [
      styles.headerButton,
      { backgroundColor: theme.backgroundElement },
      pressed && styles.pressed,
    ]}
    onPress={handleLogout}>
    <ThemedText style={styles.logoutText}>Logout</ThemedText>
  </Pressable>
</ThemedView>

        </ThemedView>
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
                  />
                </Collapsible>
                {/* Products List */}
        <ThemedView style={styles.contentArea}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Fireworks ({products.length})
          </ThemedText>

          {filteredProducts.map((product) => (
            <InventoryCard
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
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
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
    errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
});
