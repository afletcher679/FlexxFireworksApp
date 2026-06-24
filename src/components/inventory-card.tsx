import { useState } from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';

import { Firework } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductForm } from '@/components/product-form';
import { Toast, type ToastType } from '@/components/toast';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ProductUpdateCardProps {
  product: Firework;
  onUpdate: (updatedProduct: Firework) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function ProductUpdateCard({ product, onUpdate, onDelete }: ProductUpdateCardProps) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Firework>(product);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const [showToast, setShowToast] = useState(false);

  const handleFormChange = (field: string, value: any) => {
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editedProduct.name || !editedProduct.price || !editedProduct.category) {
      setToastMessage('Please fill in name, price, and category');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(editedProduct);
      setIsEditing(false);
      setToastMessage('Product updated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to update product');
      setToastType('error');
      setShowToast(true);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    return new Promise<void>((resolve) => {
      Alert.alert(
        'Delete Product',
        `Are you sure you want to delete "${product.name}"?`,
        [
          { text: 'Cancel', onPress: () => resolve() },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setIsDeleting(true);
              try {
                await onDelete(product.id);
                setToastMessage('Product deleted successfully!');
                setToastType('success');
                setShowToast(true);
              } catch (error) {
                setToastMessage('Failed to delete product');
                setToastType('error');
                setShowToast(true);
                console.error(error);
              } finally {
                setIsDeleting(false);
              }
              resolve();
            },
          },
        ]
      );
    });
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <ThemedView
        style={[
          styles.cardContainer,
          { backgroundColor: theme.backgroundElement },
        ]}>
        <ThemedView style={styles.displayMode}>
          <ThemedText style={[styles.fireworkName, { color: theme.accent }]}>{product.name}</ThemedText>
          {product.type && (
            <ThemedText themeColor="textSecondary">Type: {product.type}</ThemedText>
          )}
          <ThemedText themeColor="textSecondary">Category: {product.category}</ThemedText>
          <ThemedText style={styles.price}>${product.price}</ThemedText>
          <ThemedText themeColor="textSecondary">Duration: {product.duration_seconds}s</ThemedText>
          <ThemedText themeColor="textSecondary">Stock: {product.stock_quantity}</ThemedText>
          {product.effects && product.effects.length > 0 && (
            <ThemedText themeColor="textSecondary">Effects: {product.effects.join(', ')}</ThemedText>
          )}
          <ThemedText numberOfLines={2} style={styles.description}>
            {product.description}
          </ThemedText>

          <ThemedView style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressedButton,
              ]}
              onPress={() => setIsEditing(true)}>
              <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                Edit
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.pressedButton,
              ]}
              onPress={handleDelete}
              disabled={isDeleting}>
              <ThemedText style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.cardContainer, { backgroundColor: theme.backgroundElement }]}>
    <ProductForm
      formData={editedProduct}
      onFormChange={handleFormChange}
      onSubmit={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      isSubmitting={isSaving}
      isDeleting={isDeleting}
      mode="edit"
      submitButtonText="Save"
      toastMessage={toastMessage}
      toastType={toastType}
      showToast={showToast}
      onToastDismiss={() => setShowToast(false)}
    />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    padding: Spacing.two,
  },
  displayMode: {
    gap: Spacing.two,
    padding: Spacing.two,
  },
  price: {
    fontWeight: '600',
    fontSize: 16,
  },
  description: {
    marginTop: Spacing.two,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  editButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: 'red',
  },
  pressedButton: {
    opacity: 0.7,
  },
  fireworkName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
