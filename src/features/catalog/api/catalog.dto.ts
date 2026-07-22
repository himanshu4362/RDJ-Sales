/**
 * src/features/catalog/api/catalog.dto.ts
 * 
 * Defines the exact JSON shape returned by the backend server.
 * Notice how it differs from our frontend Domain Model (snake_case, flat structures).
 */

export interface ProductImageDTO {
  id: string;
  s3_url: string;
  is_primary: boolean;
  alt_text: string | null;
  sort_order: number;
}

export interface ProductDTO {
  _id: string;
  slug: string;
  model_no: string;
  product_name: string;
  short_desc: string;
  full_desc: string;
  
  category_id: string;
  brand_id: string;
  
  // Backend returns prices in lowest denomination (paise) to prevent float errors
  selling_price_paise: number;
  mrp_paise: number;
  
  inventory_count: number;
  status_code: 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED' | 'DRAFT';
  
  images: ProductImageDTO[];
  specs: Array<{ key: string; val: string; order: number }>;
  
  warranty_duration: number;
  is_featured: boolean;
  
  created_at: string;
  updated_at: string;
}