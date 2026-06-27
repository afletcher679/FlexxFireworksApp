import { useState } from 'react';
import { StyleSheet, Pressable, Alert, View } from 'react-native';

import { Firework } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductForm } from '@/components/product-form';
import { ProductImage } from '@/components/product-image';
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
        {/* Title */}
        <ThemedText style={[styles.fireworkName, { color: theme.accent }]}>{product.name}</ThemedText>
        
        {/* Content Row: Image on left, Data on right */}
        <ThemedView style={styles.contentRow}>
          {!!product.image_url && <ProductImage imageUrl={product.image_url} />}
          
          <ThemedView style={styles.displayMode}>
            {!!product.type && (
              <ThemedText themeColor="textSecondary">Type: {product.type}</ThemedText>
            )}
            <ThemedText themeColor="textSecondary">Category: {product.category}</ThemedText>
            <ThemedText style={styles.price}>${product.price}</ThemedText>
            <ThemedText themeColor="textSecondary">Duration (seconds): {product.duration_seconds ?? 'N/A'}</ThemedText>
            <ThemedText themeColor="textSecondary">Stock Quantity: {product.stock_quantity ?? 'N/A'}</ThemedText>
            {product.effects && product.effects.length > 0 && (
              <ThemedText themeColor="textSecondary">Effects: {product.effects.join(', ')}</ThemedText>
            )}
            <ThemedText numberOfLines={2} style={styles.description}>
              {product.description}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Buttons at bottom */}
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
    marginBottom: Spacing.two,
    padding: Spacing.two,
    flexDirection: 'column',
    gap: Spacing.two,
  },
  contentRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  displayMode: {
    flex: 1,
    gap: Spacing.one,
  },
  price: {
    fontWeight: '600',
    fontSize: 16,
  },
  description: {
    marginTop: Spacing.one,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
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
