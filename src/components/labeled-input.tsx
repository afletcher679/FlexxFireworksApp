import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { Spacing } from '../constants/theme';
import { useTheme } from '../hooks/use-theme';

interface LabeledInputProps extends TextInputProps {
  label: string;
  required?: boolean;
}

export function LabeledInput({ label, required, ...props }: LabeledInputProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.label, { color: theme.accent }]}>
        {label}
        {required && <ThemedText style={styles.required}> *</ThemedText>}
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
        ]}
        placeholderTextColor={theme.textMuted}
        {...props}
      />
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
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: Spacing.two,
    fontSize: 14,
  },
});
