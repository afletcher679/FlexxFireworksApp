import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Category } from '@/types';

const CATEGORIES: Category[] = ['Cake', 'Fountain', 'Roman Candle', 'Mortar', 'Sparkler', 'Novelty', 'Rocket'];

interface CategoryPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

export function CategoryPicker({ value, onValueChange, required }: CategoryPickerProps) {
  const theme = useTheme();

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
        {CATEGORIES.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
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
