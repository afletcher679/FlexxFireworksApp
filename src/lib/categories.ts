import { supabase } from "../lib/supabase";
import { Category } from "../types";

let cachedCategories: Category[] | null = null;

/**
 * Fetch the Category enum values from Supabase PostgreSQL enum type
 * Queries the information_schema.enums table for the 'category' enum
 */
export async function fetchCategoriesFromDatabase(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.rpc("get_category_enum_values");

    if (error) throw error;

    const categories = (data as string[]).map((val) => val as Category);
    cachedCategories = categories;
    return categories;
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    throw error;
  }
}

/**
 * Get categories with caching
 * First call queries the database, subsequent calls return cached value
 */
export async function getCategories(): Promise<Category[]> {
  if (cachedCategories) {
    return cachedCategories;
  }
  return fetchCategoriesFromDatabase();
}

/**
 * Clear the cache (useful for testing or refreshing)
 */
export function clearCategoriesCache(): void {
  cachedCategories = null;
}
