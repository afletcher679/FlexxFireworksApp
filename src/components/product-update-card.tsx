import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Alert } from 'react-native';

import { Firework } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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

  const handleSave = async () => {
    if (!editedProduct.name || !editedProduct.price || !editedProduct.category) {
      Alert.alert('Error', 'Please fill in name, price, and category');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(editedProduct);
      setIsEditing(false);
      Alert.alert('Success', 'Product updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
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
              Alert.alert('Success', 'Product deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
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
          {product.brand && (
            <ThemedText themeColor="textSecondary">Brand: {product.brand}</ThemedText>
          )}
          <ThemedText themeColor="textSecondary">Category: {product.category}</ThemedText>
          <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
          <ThemedText themeColor="textSecondary">Duration: {product.durationSeconds}s</ThemedText>
          <ThemedText themeColor="textSecondary">Stock: {product.stock}</ThemedText>
          {product.tags && product.tags.length > 0 && (
            <ThemedText themeColor="textSecondary">Tags: {product.tags.join(', ')}</ThemedText>
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

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Brand"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.brand || ''}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, brand: text })
            }
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Category"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.category}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, category: text as any })
            }
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Price"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
            value={editedProduct.price.toString()}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, price: parseFloat(text) || 0 })
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
            value={editedProduct.durationSeconds.toString()}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, durationSeconds: parseInt(text) || 0 })
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
            value={editedProduct.stock.toString()}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, stock: parseInt(text) || 0 })
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
            placeholder="Tags (comma-separated)"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.tags?.join(', ') || ''}
            onChangeText={(text) =>
              setEditedProduct({
                ...editedProduct,
                tags: text.split(',').map((t) => t.trim()),
              })
            }
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Video URL (optional)"
            placeholderTextColor={theme.textMuted}
            value={editedProduct.videoUrl || ''}
            onChangeText={(text) =>
              setEditedProduct({ ...editedProduct, videoUrl: text })
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
