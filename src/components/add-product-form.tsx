import { useState } from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LabeledInput } from '@/components/labeled-input';
import { CategoryPicker } from '@/components/category-picker';
import { Toast, type ToastType } from '@/components/toast';
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
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const [showToast, setShowToast] = useState(false);
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
    imageUrl: '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      setToastMessage('Please fill in name, price, and category');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSaving(true);
    try {
      await onAddProduct(formData);
      setToastMessage('Product added successfully!');
      setToastType('success');
      setShowToast(true);
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
        imageUrl: '',
      });
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      setToastMessage('Failed to add product');
      setToastType('error');
      setShowToast(true);
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
      imageUrl: '',
    });
  };

  return (

        <ThemedView style={[styles.formContainer]}>
          

          <LabeledInput
            label="Product Name"
            required
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <LabeledInput
            label="Brand"
            placeholder="Enter brand name"
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
          />

          <CategoryPicker
            value={formData.category}
            onValueChange={(text) => setFormData({ ...formData, category: text })}
            required
          />

          <LabeledInput
            label="Price"
            required
            placeholder="e.g. 40.00 or 3 for 5"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />

          <LabeledInput
            label="Duration (seconds)"
            placeholder="Enter duration"
            keyboardType="number-pad"
            value={formData.durationSeconds}
            onChangeText={(text) => setFormData({ ...formData, durationSeconds: text })}
          />

          <LabeledInput
            label="Stock Quantity"
            placeholder="Enter stock amount"
            keyboardType="number-pad"
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
          />

          <LabeledInput
            label="Description"
            placeholder="Enter product description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
          />

          <LabeledInput
            label="Tags"
            placeholder="comma-separated tags"
            value={formData.tags}
            onChangeText={(text) => setFormData({ ...formData, tags: text })}
          />

          <LabeledInput
            label="Video URL"
            placeholder="Optional video URL"
            value={formData.videoUrl}
            onChangeText={(text) => setFormData({ ...formData, videoUrl: text })}
          />
          <LabeledInput
            label="Image URL"
            placeholder="Optional image URL"
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
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


        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onDismiss={() => setShowToast(false)}
          />
        )}
     </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: Spacing.four,
  },
  formContainer: {
    gap: Spacing.two,
    padding: Spacing.four,
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
