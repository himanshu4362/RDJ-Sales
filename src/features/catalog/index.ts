// The Module Firewall
// Exporting administrative views with explicit aliases for external routing
export { CatalogListPage as AdminCatalogListPage } from './admin/pages/CatalogListPage';
export { ProductDetailsPage as AdminProductDetailsPage } from './admin/pages/ProductDetailsPage';
export { CreateProductPage as AdminCreateProductPage } from './admin/pages/CreateProductPage';
export { EditProductPage as AdminEditProductPage } from './admin/pages/EditProductPage';

export type { Product, ProductStatus } from './domain/catalog.types';