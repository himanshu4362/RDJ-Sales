import { 
  useGetProductsQuery, 
  useGetProductBySlugQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from '../api/catalog.api';
import type { CatalogQuery } from '../api/catalog.api';

export const useCatalogList = (params: CatalogQuery) => useGetProductsQuery(params);
export const useProductDetails = (slug: string) => useGetProductBySlugQuery(slug, { skip: !slug });
export const useCreateProduct = () => useCreateProductMutation();
export const useUpdateProduct = () => useUpdateProductMutation(); // FIXED: Renamed