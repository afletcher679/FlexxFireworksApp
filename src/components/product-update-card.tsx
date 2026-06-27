import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Alert } from 'react-native';

import { Firework } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LabeledInput } from '@/components/labeled-input';
import { CategoryPicker } from '@/components/category-picker';
import { Toast, type ToastType } from '@/components/toast';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Collapsible } from '@/components/ui/collapsible';

interface ProductUpdateCardProps {
  product: Firework;
  onUpdate: (updatedProduct: Firework) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function ProductUpdateCard({ product, onUpdate, onDelete }: ProductUpdateCardProps) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const [showToast, setShowToast] = useState(false);

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
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', onPress: () => {} },
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
          },
        },
      ]
    );
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
          <ThemedText type="subtitle">{product.name}</ThemedText>
          {!!product.type && (
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
    <ThemedView
      style={[
        styles.cardContainer,
        { backgroundColor: theme.backgroundElement },
      ]}>

        <ThemedView style={styles.editMode}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Product name"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.name}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, name: text })
            }
          />

          <CategoryPicker
            value={editedProduct.category}
            onValueChange={(text) =>
              setEditedProduct({ ...editedProduct, category: text as any })
            }
            required
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Price (e.g. 40.00 or 3 for $5.00)"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.price}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, price: text })
            }
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Duration (seconds)"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={editedProduct.duration_seconds.toString()}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, duration_seconds: parseInt(text) || 0 })
            }
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Stock quantity"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            value={editedProduct.stock_quantity.toString()}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, stock_quantity: parseInt(text) || 0 })
            }
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Description"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.description}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, description: text })
            }
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Video URL (optional)"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.video_url || ''}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, video_url: text })
            }
          />

          <ThemedView style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressedButton,
                isSaving && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isSaving}>
              <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                {isSaving ? 'Saving...' : 'Save'}
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressedButton,
              ]}
              onPress={handleCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
          </ThemedView>
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
  cardContainer: {
    borderRadius: 8,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  displayMode: {
    gap: Spacing.two,
  },
  price: {
    fontWeight: '600',
    fontSize: 16,
  },
  description: {
    marginTop: Spacing.two,
  },
  editMode: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
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
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 6,
    alignItems: 'center',
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
  cancelButtonText: {
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
