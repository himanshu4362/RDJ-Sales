/**
 * Global Cache Tags for RTK Query.
 * Feature modules will use these to invalidate data consistently.
 */
export const CACHE_TAGS = {
  Product: 'Product',
  Order: 'Order',
  Repair: 'Repair',
  User: 'User',
} as const;

export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS];