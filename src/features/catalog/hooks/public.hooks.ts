import { useGetPublicProductsQuery, useGetProductBySlugQuery } from '../api/catalog.api';
import type { CatalogQuery } from '../api/catalog.api';

export const usePublicCatalogList = (params: Omit<CatalogQuery, 'status'>) => useGetPublicProductsQuery(params);
export const usePublicProductDetails = (slug: string) => useGetProductBySlugQuery(slug, { skip: !slug });