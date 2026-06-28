import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../lib/supabase";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { AddProductForm } from "../components/add-product-form";
import { Spacing } from "../constants/theme";
import { useTheme } from "../hooks/use-theme";

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
    duration_seconds: number;
    stock_quantity: number;
    effects: string[];
    video_url: string;
    image_url: string;
  }) => {
    try {
      const { error } = await supabase.from("fireworks").insert([
        {
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          description: newProduct.description,
          duration_seconds: newProduct.duration_seconds || 0,
          stock_quantity: newProduct.stock_quantity || 0,
          effects: newProduct.effects || [],
          video_url: newProduct.video_url || null,
          image_url: newProduct.image_url || null,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[
          styles.header,
          { paddingTop: insets.top },
          { paddingLeft: Spacing.three },
        ]}
      >
        <Pressable
          onPress={() => router.push("/admin")}
          style={styles.backButton}
        >
          <ThemedText style={styles.backArrow}>‹</ThemedText>
          <ThemedText style={styles.backLabel}>Admin</ThemedText>
        </Pressable>
        <ThemedText type="subtitle">Add New Product</ThemedText>
      </ThemedView>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInset={{ top: insets.top, bottom: insets.bottom }}
        contentContainerStyle={styles.contentContainer}
      >
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
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    width: "100%",
  },
  header: {
    marginBottom: Spacing.four,
  },
  formWrapper: {
    width: "100%",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
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
