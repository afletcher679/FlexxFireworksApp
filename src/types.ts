// types.ts - Shared type definitions for Fireworks app
// These types are platform-agnostic and work with both React and React Native

/**
 * Category type for fireworks products
 * Defines the available product categories
 */
export type Category =
  | 'Cake'
  | 'Fountain'
  | 'Roman Candle'
  | 'Mortar'
  | 'Sparkler'
  | 'Novelty'
  | 'Multi-Shot'
  | 'Assortment'
  | 'Rocket'
  | 'Other';

/**
 * Firework interface
 * Represents a single firework product with all its properties
 */
export interface Firework {
  id: string; // Unique identifier for the product
  name: string; // Product name
  brand?: string; // Manufacturer brand (optional)
  category: Category; // Product category
  price: number; // Price in dollars
  durationSeconds: number; // Duration of the effect in seconds
  description: string; // Detailed product description
  videoUrl?: string; // URL to product video (optional)
  stock: number; // Number of items in stock
  tags: string[]; // Array of searchable tags
}
