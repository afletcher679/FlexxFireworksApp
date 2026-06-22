// search-bar.tsx - Search input component for filtering products
// Allows users to search for fireworks by name, description, or tags.
// Displays a clear button when there's active search text.

import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface SearchBarProps {
  query: string; // Current search query string
  onQueryChange: (newQuery: string) => void; // Callback to update search query
}

const styles = StyleSheet.create({
  // Main search bar container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 8,
    marginBottom: 12,
  },
  // Search input field
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  // Clear button styling
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const theme = useTheme();

  const themedStyles = {
    container: [styles.container, { backgroundColor: theme.inputBackground, borderColor: theme.border }],
    input: [styles.input, { color: theme.text }],
    clearButtonText: [styles.clearButtonText, { color: theme.text }],
  };

  return (
    <View style={themedStyles.container}>
      {/* Search input field that triggers onQueryChange callback as user types */}
      <TextInput
        style={themedStyles.input}
        placeholder="Search fireworks..."
        placeholderTextColor={theme.textMuted}
        value={query}
        onChangeText={onQueryChange}
        editable={true}
      />
      {/* Clear button appears when there's active search text */}
      {query ? (
        <Pressable
          style={styles.clearButton}
          onPress={() => onQueryChange('')}
          hitSlop={8}
        >
          <Text style={themedStyles.clearButtonText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default SearchBar;
