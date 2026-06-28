// types.ts - Shared type definitions for Fireworks app
// These types are platform-agnostic and work with both React and React Native

/**
 * Category type for fireworks products
 * Defines the available product categories
 */
export type Category =
  | "Cake"
  | "Fountain"
  | "Roman Candle"
  | "Mortar"
  | "Sparkler"
  | "Novelty"
  | "Rocket"
  | "Candle"
  | "Firecracker"
  | "Missile base"
  | "Single shot";

/**
 * Firework interface
 * Represents a single firework product with all its properties
 */
export interface Firework {
  id: number; // Unique identifier for the product
  name: string; // Product name
  category: Category; // Product category
  type?: string; // Optional type for further classification
  price: string; // Price as string (can be "40.00", "3 for 5", etc.)
  duration_seconds: number; // Duration of the effect in seconds
  description: string; // Detailed product description
  video_url?: string; // URL to product video (optional)
  stock_quantity: number; // Number of items in stock
  effects?: string[]; // Array of searchable effects
  image_url?: string; // URL to product image (optional)
}
