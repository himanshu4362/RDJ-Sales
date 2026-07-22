/**
 * src/features/catalog/validation/catalog.schema.ts
 */
import { z } from 'zod';
import { PRODUCT_STATUSES } from '../domain/catalog.types';

// ==========================================
// 1. Enums & Shared Types
// ==========================================
// Improvement 11: Single source of truth from Domain
export const ProductStatusEnum = z.enum(PRODUCT_STATUSES);

// ==========================================
// 2. Query Schemas
// ==========================================
export const catalogQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  // Improvement 1: trim() added to search
  search: z.string().trim().max(100, "Search query is too long").optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  status: ProductStatusEnum.optional(),
  sortBy: z.enum(['sellingPrice', 'createdAt', 'name', 'modelNumber']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ==========================================
// 3. Sub-Entity Schemas
// ==========================================
const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().url("Must be a valid image URL"),
  isPrimary: z.boolean(),
  alt: z.string().trim().max(100).optional(),
  displayOrder: z.number().int(),
});

const productSpecificationSchema = z.object({
  // Improvement 1: trim() added
  name: z.string().trim().min(1, "Specification name is required").max(100),
  value: z.string().trim().min(1, "Specification value is required").max(255),
  displayOrder: z.number().int(),
});

const productStockSchema = z.object({
  quantity: z.number().int().min(0, "Stock cannot be negative"),
});

// ==========================================
// 4. The Core Product Schema
// ==========================================
export const productSchema = z.object({
  // Improvement 2: trim() and max() on business identifiers
  sku: z.string().trim().min(1, "SKU is required").max(50),
  modelNumber: z.string().trim().min(1, "Model number is required").max(100),
  
  // Improvement 8: Max 120 chars for Name
  name: z.string().trim().min(3, "Product name must be at least 3 characters").max(120),
  shortDescription: z.string().trim().min(10).max(255, "Short description cannot exceed 255 characters"),
  
  // Improvement 7: Min 30 chars for full description
  description: z.string().trim().min(30, "A detailed description (min 30 chars) is required").max(5000),
  
  categoryId: z.string().trim().min(1, "Category is required"),
  brandId: z.string().trim().min(1, "Brand is required"),
  
  // Improvement 3: .finite() added to prevent Infinity/NaN crashes
  sellingPrice: z.number().finite("Price must be a valid number").min(0, "Selling price cannot be negative"),
  mrp: z.number().finite("MRP must be a valid number").min(0, "MRP cannot be negative"),
  
  status: ProductStatusEnum,
  stock: productStockSchema,
  
  // Improvement 9 & 10: Max constraints on arrays
  images: z.array(productImageSchema).max(20, "Maximum 20 images allowed"),
  specifications: z.array(productSpecificationSchema).max(50, "Maximum 50 specifications allowed"),
  
  // Improvement 4: Max 120 months (10 years)
  warrantyMonths: z.number().int().min(0, "Warranty cannot be negative").max(120, "Warranty exceeds maximum allowed (10 years)"),
  isFeatured: z.boolean(),
})
.superRefine((data, ctx) => {
  if (data.sellingPrice > data.mrp) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selling price cannot exceed MRP",
      path: ["sellingPrice"],
    });
  }

  if (data.status === 'ACTIVE') {
    if (data.images.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "An active product must have at least one image",
        path: ["images"],
      });
    }
    
    // Improvement 5: Ensure primary image exists and actually has a valid URL
    const primaryImages = data.images.filter(img => img.isPrimary);
    if (data.images.length > 0) {
      if (primaryImages.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Product must have exactly one primary image",
          path: ["images"],
        });
      } else if (!primaryImages[0].url || primaryImages[0].url.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Primary image must have a valid URL",
          path: ["images"],
        });
      }
    }
  }

  // Improvement 6: Trim spec names before comparing for duplicates
  const specNames = data.specifications.map(spec => spec.name.trim().toLowerCase());
  const uniqueSpecNames = new Set(specNames);
  if (uniqueSpecNames.size !== specNames.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Duplicate specifications are not allowed",
      path: ["specifications"],
    });
  }
});

export type CatalogQueryParams = z.infer<typeof catalogQuerySchema>;
export type ProductFormData = z.infer<typeof productSchema>;