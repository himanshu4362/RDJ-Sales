// import { baseApi } from '../../../store/api/baseApi';
// import { CACHE_TAGS } from '../../../store/api/tags';
// import type { Product } from '../domain/catalog.types';
// import type { ProductDTO } from './catalog.dto';
// import { mapProductDtoToDomain } from './catalog.mapper';

// // Defines the contract for searching and filtering (Ravi's primary use case)
// export interface CatalogQuery {
//   page?: number;
//   limit?: number;
//   search?: string; // Optimized for model numbers and brand names
//   categoryId?: string;
//   brandId?: string;
//   status?: string;
//   sort?: string;
// }

// // Matches the exact list schema defined in 07_API_Integration_Contracts.md
// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// export const catalogApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
    
//     // 1. The Primary Entry Point: Getting the list of products
//     getProducts: builder.query<PaginatedResponse<Product>, CatalogQuery>({
//       query: (params) => ({
//         url: '/catalog/products',
//         params, // RTK Query automatically converts this to ?page=1&search=ATI
//       }),
//       transformResponse: (response: PaginatedResponse<ProductDTO>) => {
//         return {
//           data: (response.data ?? []).map(mapProductDtoToDomain),
//           meta: response.meta,
//         };
//       },
//       providesTags: (result) => 
//         result 
//           ? [
//               ...result.data.map(({ id }) => ({ type: CACHE_TAGS.Product, id })),
//               { type: CACHE_TAGS.Product, id: 'LIST' }
//             ]
//           : [{ type: CACHE_TAGS.Product, id: 'LIST' }],
//     }),

//     // 2. The Detail View
//     getProductBySlug: builder.query<Product, string>({
//       query: (slug) => `/catalog/products/${slug}`,
//       transformResponse: (response: { data: ProductDTO }) => {
//         return mapProductDtoToDomain(response.data);
//       },
//       providesTags: (result, error, slug) => [{ type: CACHE_TAGS.Product, id: slug }],
//     }),
    
//   }),
//   overrideExisting: false,
// });

// export const { useGetProductsQuery, useGetProductBySlugQuery } = catalogApi;


import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { Product } from '../domain/catalog.types';
import type { ProductDTO } from './catalog.dto';
import { mapProductDtoToDomain } from './catalog.mapper';

// Defines the contract for searching and filtering
export interface CatalogQuery {
  page?: number;
  limit?: number;
  search?: string; 
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

// Centralized mock data outside the endpoints definition for code scannability
const mockProducts: ProductDTO[] = [
  {
    _id: 'prod_1',
    slug: 'ati-pro-1200w-amplifier',
    sku: 'ATI-AMP-1200',
    model_no: 'RX-1200',
    product_name: 'ATI Pro 1200W Professional Power Amplifier',
    short_desc: 'Heavy-duty 2-channel amplifier for live sound and DJ setups.',
    full_desc: '...',
    category_id: 'cat_amps',
    brand_id: 'brand_ati',
    selling_price_paise: 3450000, 
    mrp_paise: 3800000, 
    inventory_count: 4,
    status_code: 'ACTIVE',
    images: [], 
    specs: [],
    warranty_duration: 12,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_2',
    slug: 'ahuja-l15-mb300',
    sku: 'AHUJA-SPK-300',
    model_no: 'L15-MB300',
    product_name: 'Ahuja 15" Mid-Bass PA Speaker',
    short_desc: 'High-efficiency 300W RMS speaker for custom cabinet builds.',
    full_desc: '...',
    category_id: 'cat_speakers',
    brand_id: 'brand_ahuja',
    selling_price_paise: 420000, 
    mrp_paise: 450000, 
    inventory_count: 12,
    status_code: 'ACTIVE',
    images: [], 
    specs: [],
    warranty_duration: 12,
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_3',
    slug: 'jbl-prx412m',
    sku: 'JBL-PRX-412',
    model_no: 'PRX412M',
    product_name: 'JBL PRX412M 12" Two-Way Stage Monitor',
    short_desc: 'Premium passive stage monitor for live performances.',
    full_desc: '...',
    category_id: 'cat_monitors',
    brand_id: 'brand_jbl',
    selling_price_paise: 4250000, 
    mrp_paise: 4800000, 
    inventory_count: 0,
    status_code: 'OUT_OF_STOCK',
    images: [],
    specs: [],
    warranty_duration: 24,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_4',
    slug: 'yamaha-mg16xu',
    sku: 'YAM-MIX-16',
    model_no: 'MG16XU',
    product_name: 'Yamaha 16-Channel Analog Mixing Console',
    short_desc: '16-input mixer with built-in SPX digital effects and USB.',
    full_desc: '...',
    category_id: 'cat_mixers',
    brand_id: 'brand_yamaha',
    selling_price_paise: 3800000, 
    mrp_paise: 4100000, 
    inventory_count: 2,
    status_code: 'ACTIVE',
    images: [],
    specs: [],
    warranty_duration: 12,
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'prod_5',
    slug: 'custom-dual-18-cabinet',
    sku: 'RDJ-CAB-D18',
    model_no: 'RDJ-D18-PRO',
    product_name: 'Custom Dual 18" Subwoofer Empty Cabinet',
    short_desc: 'Heavy-duty plywood construction, painted finish with internal bracing.',
    full_desc: '...',
    category_id: 'cat_cabinets',
    brand_id: 'brand_custom',
    selling_price_paise: 1850000, // ₹18,500
    mrp_paise: 2200000, // ₹22,000
    inventory_count: 6,
    status_code: 'ACTIVE',
    images: [],
    specs: [],
    warranty_duration: 6,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Getting the list of products (Simulated Server Filters)
    getProducts: builder.query<PaginatedResponse<Product>, CatalogQuery>({
      queryFn: (params) => {
        let filteredData = [...mockProducts];

        // Search Filter (Matches against name, model number, or SKU)
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredData = filteredData.filter(
            (prod) =>
              prod.product_name.toLowerCase().includes(searchLower) ||
              prod.model_no.toLowerCase().includes(searchLower) ||
              prod.sku.toLowerCase().includes(searchLower)
          );
        }

        // Dropdown Category Filter
        if (params?.categoryId) {
          filteredData = filteredData.filter((prod) => prod.category_id === params.categoryId);
        }

        // Dropdown Brand Filter
        if (params?.brandId) {
          filteredData = filteredData.filter((prod) => prod.brand_id === params.brandId);
        }

        // Status Filter
        if (params?.status) {
          filteredData = filteredData.filter((prod) => prod.status_code === params.status);
        }

        // Core Sorting Processor
        if (params?.sort) {
          const [field, order] = params.sort.split(':'); // Format expected: 'selling_price_paise:asc' or 'created_at:desc'
          filteredData.sort((a, b) => {
            let valA = a[field as keyof ProductDTO];
            let valB = b[field as keyof ProductDTO];

            if (typeof valA === 'string' && typeof valB === 'string') {
              return order === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
              return order === 'desc' ? valB - valA : valA - valB;
            }
            return 0;
          });
        }

        // Pagination Engine
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        const total = filteredData.length;
        const totalPages = Math.ceil(total / limit) || 1;
        
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filteredData.slice(startIndex, startIndex + limit);

        // Map final output to frontend Domain
        const domainData = paginatedSlice.map(mapProductDtoToDomain);

        return {
          data: {
            data: domainData,
            meta: { total, page, limit, totalPages },
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: CACHE_TAGS.Product, id })),
              { type: CACHE_TAGS.Product, id: 'LIST' },
            ]
          : [{ type: CACHE_TAGS.Product, id: 'LIST' }],
    }),

    // 2. The Detail View (Resolves locally using the mock database)
    getProductBySlug: builder.query<Product, string>({
      queryFn: (slug) => {
        const matchingDto = mockProducts.find((prod) => prod.slug === slug);

        if (!matchingDto) {
          return {
            error: {
              status: 404,
              statusText: 'Not Found',
              data: { message: `Product with slug '${slug}' was not found in mock store.` },
            },
          };
        }

        return { data: mapProductDtoToDomain(matchingDto) };
      },
      providesTags: (_result, _error, slug) => [{ type: CACHE_TAGS.Product, id: slug }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductBySlugQuery } = catalogApi;

