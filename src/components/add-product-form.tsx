import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Alert } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Collapsible } from '@/components/ui/collapsible';

interface AddProductFormProps {
  onAddProduct: (product: {
    name: string;
    brand: string;
    category: string;
    price: string;
    description: string;
    durationSeconds: string;
    stock: string;
    tags: string;
    videoUrl: string;
  }) => Promise<void>;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function AddProductForm({ onAddProduct, isOpen = true, onOpenChange }: AddProductFormProps) {
  const theme = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    durationSeconds: '',
    stock: '',
    tags: '',
    videoUrl: '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert('Error', 'Please fill in name, price, and category');
      return;
    }

    setIsSaving(true);
    try {
      await onAddProduct(formData);
      Alert.alert('Success', 'Product added');
      setFormData({
        name: '',
        brand: '',
        category: '',
        price: '',
        description: '',
        durationSeconds: '',
        stock: '',
        tags: '',
        videoUrl: '',
      });
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      description: '',
      durationSeconds: '',
      stock: '',
      tags: '',
      videoUrl: '',
    });
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: theme.backgroundElement },
      ]}>
      <Collapsible title="Add New Product">
        <ThemedView style={[styles.formContainer]}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Product name *"
            placeholderTextColor={theme.textMuted}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Brand"
            placeholderTextColor={theme.textMuted}
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Category *"
            placeholderTextColor={theme.textMuted}
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Price *"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Duration (seconds)"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={formData.durationSeconds}
            onChangeText={(text) => setFormData({ ...formData, durationSeconds: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Stock quantity"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Description"
            placeholderTextColor={theme.textMuted}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Tags (comma-separated)"
            placeholderTextColor={theme.textMuted}
            value={formData.tags}
            onChangeText={(text) => setFormData({ ...formData, tags: text })}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Video URL (optional)"
            placeholderTextColor={theme.textMuted}
            value={formData.videoUrl}
            onChangeText={(text) => setFormData({ ...formData, videoUrl: text })}
          />

          <ThemedView style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressedButton,
                isSaving && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isSaving}>
              <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                {isSaving ? 'Adding...' : 'Add Product'}
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.resetButton,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressedButton,
              ]}
              onPress={handleReset}>
              <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Collapsible>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: Spacing.one,
  },
  formContainer: {
    gap: Spacing.two,
    padding: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: Spacing.two,
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  submitButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  resetButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  pressedButton: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
