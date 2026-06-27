// filter-panel.tsx - Control panel for filtering and sorting products
// Provides three filter options:
// 1. Sort dropdown (by name A-Z, price low-to-high, price high-to-low)
// 2. Category chips for multi-select filtering
// 3. Price range slider to set maximum price
// Updates parent component with filter changes in real-time

import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { useTheme } from '../hooks/use-theme';
import { getCategories } from '../lib/categories';
import type { Filters, SortOptions } from '../hooks/use-product-filter';
import type { Category } from '../types';

interface FilterPanelProps {
  filters: Filters;
  setFilters: (nextFilters: Filters) => void;
  sortOption: SortOptions;
  setSortOption: (option: SortOptions) => void;
  maxPriceCeiling?: number;
}

const styles = StyleSheet.create({
  // Main filter panel container
  container: {
    marginBottom: 12,
  },
  // Individual filter section
  section: {
    marginBottom: 16,
  },
  // Filter label text
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  // Sort dropdown container
  pickerContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  // Category chips container
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // Individual chip styling
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Selected chip styling
  chipSelected: {
    borderWidth: 2,
  },
  // Price slider container
  sliderContainer: {
    paddingVertical: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export function FilterPanel({
  filters,
  setFilters,
  sortOption,
  setSortOption,
  maxPriceCeiling,
}: FilterPanelProps) {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories from database on component mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.error('Failed to load categories:', error));
  }, []);

  // Toggle category selection: add or remove from active categories
  const toggleCategory = (category: Category) => {
    const nextCategories = new Set(filters.categories);
    if (nextCategories.has(category)) {
      nextCategories.delete(category);
    } else {
      nextCategories.add(category);
    }
    setFilters({ ...filters, categories: nextCategories });
  };

  // Update max price filter, setting to null if user reaches the ceiling
  const onMaxPriceChange = (value: number) => {
    setFilters({ ...filters, maxPrice: value >= maxPriceCeiling ? null : value });
  };

  // Display current max price or the ceiling if no filter is set
  const displayedMax = filters.maxPrice ?? maxPriceCeiling;

  const themedStyles = {
    label: [styles.label, { color: theme.text }],
    chip: [styles.chip, { backgroundColor: theme.inputBackground }],
    chipText: [styles.chipText, { color: theme.textMuted }],
    chipSelected: [
      styles.chip,
      styles.chipSelected,
      { borderColor: theme.accent, backgroundColor: theme.accentSoft },
    ],
    chipSelectedText: [styles.chipText, { color: theme.accent }],
  };

  return (
    <View style={styles.container}>
      {/* Sort dropdown with three options */}
      <View style={styles.section}>
        <Text style={themedStyles.label}>Sort</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.inputBackground }]}>
          <Picker
            style={styles.picker}
            selectedValue={sortOption}
            onValueChange={(itemValue: SortOptions) => setSortOption(itemValue)}
            itemStyle={{ color: theme.text }}
          >
            <Picker.Item label="Name (A-Z)" value="name" />
            <Picker.Item label="Price (Low to High)" value="price-asc" />
            <Picker.Item label="Price (High to Low)" value="price-desc" />
          </Picker>
        </View>
      </View>

      {/* Category filter with clickable chips for multi-select */}
      <View style={styles.section}>
        <Text style={themedStyles.label}>Category</Text>
        <View style={styles.chipRow}>
          {categories.map((category) => {
            const isSelected = filters.categories.has(category);
            return (
              <Pressable
                key={category}
                style={isSelected ? themedStyles.chipSelected : themedStyles.chip}
                onPress={() => toggleCategory(category)}
              >
                <Text style={isSelected ? themedStyles.chipSelectedText : themedStyles.chipText}>
                  {category.replace('-', ' ')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Price range slider with dynamic label showing current max */}
      <View style={styles.section}>
        {maxPriceCeiling !== undefined && (
          <Text style={themedStyles.label}>
            Max Price: ${displayedMax.toFixed(0)}
            {filters.maxPrice !== null && ' (custom)'}
          </Text>
        )}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={maxPriceCeiling}
            step={1}
            value={displayedMax}
            onValueChange={onMaxPriceChange}
            minimumTrackTintColor={theme.accent}
            maximumTrackTintColor={theme.border}
          />
        </View>
      </View>
    </View>
  );
}

export default FilterPanel;
