import type { ProductStatus } from '../domain/catalog.types';

export const PRODUCT_STATUS_UI: Record<ProductStatus, { label: string; variant: 'success' | 'danger' | 'warning' | 'default' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  OUT_OF_STOCK: { label: 'Out of Stock', variant: 'danger' },
  DISCONTINUED: { label: 'Discontinued', variant: 'warning' },
  DRAFT: { label: 'Draft', variant: 'default' },
};