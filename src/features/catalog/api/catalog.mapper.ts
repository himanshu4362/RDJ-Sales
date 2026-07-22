import type { Product, ProductStatus } from '../domain/catalog.types';
import type { ProductDTO } from './catalog.dto';
import { convertPaiseToRupees } from '../utils/currency';

// Defensive mapping: Explicitly map backend status codes to frontend domain statuses.
// If backend sends an unmapped string, it falls back to 'DRAFT' instead of crashing.
const STATUS_MAP: Record<string, ProductStatus> = {
  ACTIVE: 'ACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED',
  DRAFT: 'DRAFT',
};

export const mapProductDtoToDomain = (dto: ProductDTO): Product => {
  return {
    id: dto._id,
    sku: dto.sku || '', // Assuming DTO now includes sku
    slug: dto.slug,
    modelNumber: dto.model_no,
    name: dto.product_name,
    shortDescription: dto.short_desc,
    description: dto.full_desc,
    
    categoryId: dto.category_id,
    brandId: dto.brand_id,
    
    sellingPrice: convertPaiseToRupees(dto.selling_price_paise),
    mrp: convertPaiseToRupees(dto.mrp_paise),
    
    status: STATUS_MAP[dto.status_code] || 'DRAFT',
    
    stock: {
      quantity: dto.inventory_count,
    },
    
    // Defensive check (?? []) and explicit sorting by displayOrder
    images: (dto.images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => ({
        id: img.id,
        url: img.s3_url,
        isPrimary: img.is_primary,
        alt: img.alt_text || undefined,
        displayOrder: img.sort_order,
      })),
    
    // Defensive check and explicit sorting
    specifications: (dto.specs ?? [])
      .sort((a, b) => a.order - b.order)
      .map(spec => ({
        name: spec.key,
        value: spec.val,
        displayOrder: spec.order,
      })),
    
    warrantyMonths: dto.warranty_duration,
    isFeatured: dto.is_featured,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
};