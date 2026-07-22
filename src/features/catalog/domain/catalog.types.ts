/**
 * src/features/catalog/domain/catalog.types.ts
 * 
 * Defines the core business entities for the Product Catalog.
 */

// Improvement 2: Scalable lifecycle status
export const PRODUCT_STATUSES = ['ACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED', 'DRAFT'] as const;
export type ProductStatus = typeof PRODUCT_STATUSES[number];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

// Improvement 3: Robust image management
export interface ProductImage {
  id: string;
  url: string; // e.g., AWS S3 Key
  isPrimary: boolean;
  alt?: string;
  displayOrder: number;
}

// Improvement 5: Ordered specifications
export interface ProductSpecification {
  name: string;
  value: string;
  displayOrder: number; 
}

// Improvement 4: Scalable inventory object
export interface ProductStock {
  quantity: number;
  // Reserved for future: reservedQuantity, damaged, minimumStockLevel, warehouseId
}

export interface ProductVariant {
  id: string;
  sku: string;
  modelNumber: string; // Specific model for this variant
  name: string;
  sellingPrice: number; // Improvement 1: Business terminology
  stock: ProductStock;
  status: ProductStatus;
  images?: ProductImage[];  // Feature Added: Variant-specific images
}

export interface Product {
  id: string;
  sku: string; // Feature Added: Base SKU for products without variants
  slug: string;
  
  // The Exact Equipment Configuration (Crucial for DJ/Audio gear)
  modelNumber: string; 
  
  name: string;
  shortDescription: string; // Improvement 7: For cards, search, and WhatsApp shares
  description: string;
  
  // Relationships
  categoryId: string;
  brandId: string;
  
  // Pricing & Inventory
  sellingPrice: number; 
  mrp: number; 
  status: ProductStatus;
  stock: ProductStock;
  
  // Media & Tech Specs
  images: ProductImage[];
  specifications: ProductSpecification[];
  
  // Optional Variations
  variants?: ProductVariant[];
  
  // Business Metadata
  warrantyMonths: number;
  isFeatured: boolean;
  
  // Improvement 6: Audit timestamps
  createdAt: string;
  updatedAt: string;
}