import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { Product } from '../domain/catalog.types';
import type { ProductDTO } from './catalog.dto';
import { mapProductDtoToDomain } from './catalog.mapper';

// Defines the contract for searching and filtering (Ravi's primary use case)
export interface CatalogQuery {
  page?: number;
  limit?: number;
  search?: string; // Optimized for model numbers and brand names
  categoryId?: string;
  brandId?: string;
  status?: string;
  sort?: string;
}

// Matches the exact list schema defined in 07_API_Integration_Contracts.md
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // 1. The Primary Entry Point: Getting the list of products
    getProducts: builder.query<PaginatedResponse<Product>, CatalogQuery>({
      query: (params) => ({
        url: '/catalog/products',
        params, // RTK Query automatically converts this to ?page=1&search=ATI
      }),
      transformResponse: (response: PaginatedResponse<ProductDTO>) => {
        return {
          data: (response.data ?? []).map(mapProductDtoToDomain),
          meta: response.meta,
        };
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: CACHE_TAGS.Product, id })),
              { type: CACHE_TAGS.Product, id: 'LIST' }
            ]
          : [{ type: CACHE_TAGS.Product, id: 'LIST' }],
    }),

    // 2. The Detail View
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/catalog/products/${slug}`,
      transformResponse: (response: { data: ProductDTO }) => {
        return mapProductDtoToDomain(response.data);
      },
      providesTags: (result, error, slug) => [{ type: CACHE_TAGS.Product, id: slug }],
    }),
    
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductBySlugQuery } = catalogApi;