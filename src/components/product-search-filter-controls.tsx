import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import type { Filters, SortOptions } from "../hooks/use-product-filter";
import { useTheme } from "../hooks/use-theme";
import { FilterPanel } from "./filter-panel";
import { SearchBar } from "./search-bar";
import { Collapsible } from "./ui/collapsible";

interface ProductSearchFilterControlsProps {
  filters: Filters;
  setFilters: (nextFilters: Filters) => void;
  sortKey: SortOptions;
  setSortKey: (option: SortOptions) => void;
  maxPriceCeiling?: number;
  title?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function ProductSearchFilterControls({
  filters,
  setFilters,
  sortKey,
  setSortKey,
  maxPriceCeiling,
  title = "Search, Filter, and Sort",
  isOpen,
  onOpenChange,
}: ProductSearchFilterControlsProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { borderColor: theme.sectionBorder }]}>
      <Collapsible title={title} isOpen={isOpen} onOpenChange={onOpenChange}>
        <SearchBar
          query={filters.query}
          onQueryChange={(query) => setFilters({ ...filters, query })}
        />
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          sortOption={sortKey}
          setSortOption={setSortKey}
          maxPriceCeiling={maxPriceCeiling}
        />
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 6,
    margin: Spacing.one,
  },
});
