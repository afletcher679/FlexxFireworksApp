import { StyleSheet, Pressable } from 'react-native';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { LabeledInput } from '../components/labeled-input';
import { CategoryPicker } from '../components/category-picker';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

interface ProductFormData {
  name: string;
  type?: string;
  category: string;
  price: string;
  description: string;
  duration_seconds?: number | string;
  stock_quantity?: number | string;
  effects?: string[];
  video_url?: string;
  image_url?: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  mode?: 'add' | 'edit';
  submitButtonText?: string;
}

export function ProductForm({
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
  mode = 'add',
  submitButtonText = 'Add Product',
}: ProductFormProps) {
  const theme = useTheme();
  const isEditMode = mode === 'edit';

  const handleFieldChange = (field: string, value: any) => {
    onFormChange(field, value);
  };

  return (
    <ThemedView style={[styles.formContainer]}>
      {isEditMode && (
        <ThemedText type="subtitle" style={styles.title}>
          Edit {formData.name || 'Product'}
        </ThemedText>
      )}

      <LabeledInput
        label="Product Name"
        required
        placeholder="Enter product name"
        value={formData.name || ''}
        onChangeText={(text) => handleFieldChange('name', text)}
      />

      {!!formData.type && (
        <LabeledInput
          label="Type"
          placeholder="Enter product type"
          value={formData.type || ''}
          onChangeText={(text) => handleFieldChange('type', text)}
        />
      )}

      <CategoryPicker
        value={formData.category}
        onValueChange={(text) => handleFieldChange('category', text)}
        required
      />
      <LabeledInput
        label="Type"
        placeholder="Enter product type"
        value={formData.type || ''}
        onChangeText={(text) => handleFieldChange('type', text)}
      />

      <LabeledInput
        label="Price"
        required
        placeholder="e.g. 40.00 or 3 for 5"
        value={formData.price || ''}
        onChangeText={(text) => handleFieldChange('price', text)}
      />

      <LabeledInput
        label="Duration (seconds)"
        placeholder="Enter duration"
        keyboardType="number-pad"
        value={formData.duration_seconds?.toString() || ''}
        onChangeText={(text) =>
          handleFieldChange('duration_seconds', text ? parseInt(text) : 0)
        }
      />

      <LabeledInput
        label="Stock Quantity"
        placeholder="Enter stock amount"
        keyboardType="number-pad"
        value={formData.stock_quantity?.toString() || ''}
        onChangeText={(text) =>
          handleFieldChange('stock_quantity', text ? parseInt(text) : 0)
        }
      />

      <LabeledInput
        label="Description"
        placeholder="Enter product description"
        value={formData.description || ''}
        onChangeText={(text) => handleFieldChange('description', text)}
        multiline
        numberOfLines={3}
      />

      <LabeledInput
        label="Effects"
        placeholder="comma-separated effects"
        value={formData.effects?.join(', ') || ''}
        onChangeText={(text) =>
          handleFieldChange('effects', text.split(',').map((t) => t.trim()))
        }
      />

      <LabeledInput
        label="Video File Name"
        placeholder="Optional video file name"
        value={formData.video_url || ''}
        onChangeText={(text) => handleFieldChange('video_url', text)}
      />

        <LabeledInput
          label="Image File Name"
          placeholder="Optional image file name"
          value={formData.image_url || ''}
          onChangeText={(text) => handleFieldChange('image_url', text)}
        />
      
      <ThemedView style={styles.buttonGroup}>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: theme.accent },
            pressed && styles.pressedButton,
            isSubmitting && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={isSubmitting}>
          <ThemedText style={[styles.buttonText, { color: theme.background }]}>
            {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : submitButtonText}
          </ThemedText>
        </Pressable>

        {isEditMode && onCancel ? (
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.pressedButton,
            ]}
            onPress={onCancel}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </Pressable>
        ) : (
          !isEditMode && (
            <Pressable
              style={({ pressed }) => [
                styles.resetButton,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressedButton,
              ]}
              onPress={() => {
                handleFieldChange('name', '');
                handleFieldChange('category', '');
                handleFieldChange('price', '');
                handleFieldChange('description', '');
                handleFieldChange('duration_seconds', 0);
                handleFieldChange('stock_quantity', 0);
                handleFieldChange('effects', []);
                handleFieldChange('video_url', '');
                handleFieldChange('image_url', '');
              }}>
              <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
            </Pressable>
          )
        )}

        {isEditMode && onDelete && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.pressedButton,
            ]}
            onPress={onDelete}
            disabled={isDeleting}>
            <ThemedText style={styles.deleteButtonText}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: Spacing.two,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
  },
  title: {
    marginBottom: Spacing.two,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginVertical: Spacing.two,
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
  cancelButton: {
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
  resetButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButtonText: {
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
  disabledButton: {
    opacity: 0.5,
  },
});
