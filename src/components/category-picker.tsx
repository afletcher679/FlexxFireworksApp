import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getCategories } from '@/lib/categories';
import { Category } from '@/types';

interface CategoryPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

export function CategoryPicker({ value, onValueChange, required }: CategoryPickerProps) {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>
        Category
        {required && <ThemedText style={styles.required}> *</ThemedText>}
      </ThemedText>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        style={[
          styles.picker,
          { backgroundColor: theme.background, color: theme.text },
        ]}
        itemStyle={{ color: theme.text }}
      >
        <Picker.Item label="Select a category" value="" />
        {isLoading ? (
          <Picker.Item label="Loading..." value="" />
        ) : (
          categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))
        )}
      </Picker>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  required: {
    color: '#FF3B30',
  },
  picker: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#D0D0D0',
  },
});
