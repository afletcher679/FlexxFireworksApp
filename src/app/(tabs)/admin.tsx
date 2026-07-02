import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AdminLogin from "@/components/admin-login";
import { InventoryCard } from "../../components/inventory-card";
import { ProductSearchFilterControls } from "../../components/product-search-filter-controls";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { Spacing } from "../../constants/theme";
import { useProductFilter } from "../../hooks/use-product-filter";
import { useTheme } from "../../hooks/use-theme";
import { supabase } from "../../lib/supabase";
import { Firework } from "../../types";

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Firework[]>([]);
  const [isFilterControlsOpen, setIsFilterControlsOpen] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      const syncSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          setIsAuthenticated(false);
          setProducts([]);
          return;
        }

        setIsAuthenticated(true);
        fetchProducts();
      };

      syncSession();
    }, []),
  );

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("fireworks").select("*");

      if (error) throw error;
      const typedData = (data || []) as Firework[];
      setProducts(typedData);
    } catch (error) {
      console.error("Error fetching fireworks:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setProducts([]);
  };

  const handleUpdateProduct = async (updatedProduct: Firework) => {
    try {
      const { data, error } = await supabase
        .from("fireworks")
        .update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          price: updatedProduct.price,
          description: updatedProduct.description,
          duration_seconds: updatedProduct.duration_seconds,
          stock_quantity: updatedProduct.stock_quantity,
          effects: updatedProduct.effects || [],
          video_url: updatedProduct.video_url || null,
          image_url: updatedProduct.image_url || null,
        })
        .eq("id", updatedProduct.id)
        .select("*")
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error(
          "Update did not return a row. Check Supabase RLS UPDATE policy for fireworks.",
        );
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === data.id ? (data as Firework) : product,
        ),
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const { error } = await supabase.from("fireworks").delete().eq("id", id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error("Error deleting fireworks:", error);
      throw error;
    }
  };

  const handleAddProduct = () => {
    router.push("/add-product");
  };

  const { filters, setFilters, sortKey, setSortKey, filteredProducts } =
    useProductFilter(products);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      onTouchStart={() => {
        if (isFilterControlsOpen) {
          setIsFilterControlsOpen(false);
        }
      }}
    >
      <ThemedView style={styles.container}>
        <ThemedView
          style={[
            styles.headerContainer,
            { paddingTop: insets.top + Spacing.four },
          ]}
        >
          <ThemedText
            type="subtitle"
            style={styles.headerTitle}
            numberOfLines={2}
          >
            Inventory Management
          </ThemedText>
          <ThemedView style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}
              onPress={handleAddProduct}
            >
              <ThemedText
                style={[styles.buttonText, { color: theme.background }]}
              >
                Add Product
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.pressed,
              ]}
              onPress={handleLogout}
            >
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        {/* Products List */}
        <ThemedView style={styles.contentArea}>
          <ThemedView onTouchStart={(event) => event.stopPropagation()}>
            <ProductSearchFilterControls
              filters={filters}
              setFilters={setFilters}
              sortKey={sortKey}
              setSortKey={setSortKey}
              isOpen={isFilterControlsOpen}
              onOpenChange={setIsFilterControlsOpen}
            />
          </ThemedView>
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
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    width: "100%",
  },
  loginContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    gap: Spacing.four,
    justifyContent: "center",
    minHeight: 400,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordInputWithToggle: {
    paddingRight: 44,
  },
  passwordToggleButton: {
    position: "absolute",
    right: Spacing.two,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
  },
  loginButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: Spacing.two,
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    width: "100%",
  },
  logoutButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    width: "100%",
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
    padding: Spacing.four,
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
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
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
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
  },
});
