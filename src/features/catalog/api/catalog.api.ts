import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { Product } from '../domain/catalog.types';
import type { ProductDTO } from './catalog.dto';
import { mapProductDtoToDomain } from './catalog.mapper';
import type { ProductFormData } from '../validation/catalog.schema';

export interface CatalogQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; };
}

const mockProducts: ProductDTO[] = [
  { _id: 'prod_1', slug: 'ati-pro-1200w-amplifier', sku: 'ATI-AMP-1200', model_no: 'RX-1200', product_name: 'ATI Pro 1200W Professional Power Amplifier', short_desc: 'Heavy-duty 2-channel amplifier for live sound and DJ setups.', full_desc: '...', category_id: 'cat_amps', brand_id: 'brand_ati', selling_price_paise: 3450000, mrp_paise: 3800000, inventory_count: 4, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 12, is_featured: true, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), updated_at: new Date().toISOString(), },
  { _id: 'prod_2', slug: 'ahuja-l15-mb300', sku: 'AHUJA-SPK-300', model_no: 'L15-MB300', product_name: 'Ahuja 15" Mid-Bass PA Speaker', short_desc: 'High-efficiency 300W RMS speaker for custom cabinet builds.', full_desc: '...', category_id: 'cat_speakers', brand_id: 'brand_ahuja', selling_price_paise: 420000, mrp_paise: 450000, inventory_count: 12, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 12, is_featured: false, created_at: new Date(Date.now() - 86400000 * 10).toISOString(), updated_at: new Date().toISOString(), },
  { _id: 'prod_3', slug: 'jbl-prx412m', sku: 'JBL-PRX-412', model_no: 'PRX412M', product_name: 'JBL PRX412M 12" Two-Way Stage Monitor', short_desc: 'Premium passive stage monitor for live performances.', full_desc: '...', category_id: 'cat_monitors', brand_id: 'brand_jbl', selling_price_paise: 4250000, mrp_paise: 4800000, inventory_count: 0, status_code: 'OUT_OF_STOCK', images: [], specs: [], warranty_duration: 24, is_featured: true, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date().toISOString(), },
  { _id: 'prod_4', slug: 'yamaha-mg16xu', sku: 'YAM-MIX-16', model_no: 'MG16XU', product_name: 'Yamaha 16-Channel Analog Mixing Console', short_desc: '16-input mixer with built-in SPX digital effects and USB.', full_desc: '...', category_id: 'cat_mixers', brand_id: 'brand_yamaha', selling_price_paise: 3800000, mrp_paise: 4100000, inventory_count: 2, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 12, is_featured: false, created_at: new Date(Date.now() - 86400000 * 15).toISOString(), updated_at: new Date().toISOString(), },
  { _id: 'prod_5', slug: 'custom-dual-18-cabinet', sku: 'RDJ-CAB-D18', model_no: 'RDJ-D18-PRO', product_name: 'Custom Dual 18" Subwoofer Empty Cabinet', short_desc: 'Heavy-duty plywood construction, painted finish with internal bracing.', full_desc: '...', category_id: 'cat_cabinets', brand_id: 'brand_custom', selling_price_paise: 1850000, mrp_paise: 2200000, inventory_count: 6, status_code: 'ACTIVE', images: [], specs: [], warranty_duration: 6, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), },
];

// Helper to isolate mapper responsibility
const mapSpecificationsToDto = (specs: ProductFormData['specifications']) => {
  return specs.map((spec, index) => ({
    key: spec.name,
    val: spec.value,
    order: index
  }));
};

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, CatalogQuery>({
      queryFn: (params) => {
        let filteredData = [...mockProducts];
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredData = filteredData.filter(
            (prod) => prod.product_name.toLowerCase().includes(searchLower) || prod.model_no.toLowerCase().includes(searchLower) || prod.sku.toLowerCase().includes(searchLower)
          );
        }
        if (params?.categoryId) filteredData = filteredData.filter((prod) => prod.category_id === params.categoryId);
        if (params?.brandId) filteredData = filteredData.filter((prod) => prod.brand_id === params.brandId);
        if (params?.status) filteredData = filteredData.filter((prod) => prod.status_code === params.status);
        if (params?.sortBy) {
          const fieldMap: Record<string, keyof ProductDTO> = { sellingPrice: 'selling_price_paise', createdAt: 'created_at', name: 'product_name', modelNumber: 'model_no' };
          const field = fieldMap[params.sortBy] || 'created_at';
          const order = params?.sortOrder || 'desc';
          filteredData.sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
          });
        } else {
          filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        const total = filteredData.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filteredData.slice(startIndex, startIndex + limit);
        const domainData = paginatedSlice.map(mapProductDtoToDomain);
        return { data: { data: domainData, meta: { total, page, limit, totalPages } } };
      },
      providesTags: (result) => result ? [ ...result.data.map(({ id }) => ({ type: CACHE_TAGS.Product, id })), { type: CACHE_TAGS.Product, id: 'LIST' } ] : [{ type: CACHE_TAGS.Product, id: 'LIST' }],
    }),
    
    getProductBySlug: builder.query<Product, string>({
      queryFn: (slug) => {
        const matchingDto = mockProducts.find((prod) => prod.slug === slug);
        if (!matchingDto) {
          return { error: { status: 404, statusText: 'Not Found', data: { message: `Product not found.` } } };
        }
        return { data: mapProductDtoToDomain(matchingDto) };
      },
      providesTags: (_result, _error, slug) => [{ type: CACHE_TAGS.Product, id: slug }],
    }),

    createProduct: builder.mutation<Product, ProductFormData>({
      queryFn: (formData) => {
        const newSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 100);
        const newId = `prod_${Math.random().toString(36).slice(2, 11)}`;
        const newDto: ProductDTO = {
          _id: newId, sku: formData.sku, slug: newSlug, model_no: formData.modelNumber, product_name: formData.name, short_desc: formData.shortDescription, full_desc: formData.description, category_id: formData.categoryId, brand_id: formData.brandId, selling_price_paise: formData.sellingPrice * 100, mrp_paise: formData.mrp * 100, inventory_count: formData.stock.quantity, status_code: formData.status,
          images: formData.images.map((img, idx) => ({ id: img.id || `img_${Math.random().toString(36).slice(2, 11)}`, s3_url: img.url, is_primary: img.isPrimary, alt_text: img.alt || null, sort_order: img.displayOrder ?? idx })),
          specs: mapSpecificationsToDto(formData.specifications),
          warranty_duration: formData.warrantyMonths, is_featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        }; 
        mockProducts.unshift(newDto);
        return { data: mapProductDtoToDomain(newDto) };
      },
      invalidatesTags: [{ type: CACHE_TAGS.Product, id: 'LIST' }],
    }),

    getPublicProducts: builder.query<PaginatedResponse<Product>, Omit<CatalogQuery, 'status'>>({
      queryFn: (params) => {
        let filteredData = mockProducts.filter(prod => prod.status_code === 'ACTIVE');
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredData = filteredData.filter(
            (prod) => prod.product_name.toLowerCase().includes(searchLower) || prod.model_no.toLowerCase().includes(searchLower) || prod.sku.toLowerCase().includes(searchLower)
          );
        }
        if (params?.categoryId) filteredData = filteredData.filter((prod) => prod.category_id === params.categoryId);
        if (params?.brandId) filteredData = filteredData.filter((prod) => prod.brand_id === params.brandId);
        
        filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 20;
        const total = filteredData.length;
        const startIndex = (page - 1) * limit;
        
        return { 
          data: { 
            data: filteredData.slice(startIndex, startIndex + limit).map(mapProductDtoToDomain), 
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } 
          } 
        };
      },
      providesTags: ['Product'], 
    }),

    updateProduct: builder.mutation<Product, { slug: string; data: ProductFormData }>({
      queryFn: ({ slug, data }) => {
        const index = mockProducts.findIndex(p => p.slug === slug);
        if (index === -1) return { error: { status: 404, statusText: 'Not Found', data: 'Product not found' } };
        const existingDto = mockProducts[index];
        const updatedDto: ProductDTO = {
          ...existingDto, sku: data.sku, model_no: data.modelNumber, product_name: data.name, short_desc: data.shortDescription, full_desc: data.description, category_id: data.categoryId, brand_id: data.brandId, selling_price_paise: data.sellingPrice * 100, mrp_paise: data.mrp * 100, inventory_count: data.stock.quantity, status_code: data.status, warranty_duration: data.warrantyMonths,
          images: data.images.map((img, idx) => ({ id: img.id || `img_${Math.random().toString(36).slice(2, 11)}`, s3_url: img.url, is_primary: img.isPrimary, alt_text: img.alt || null, sort_order: img.displayOrder ?? idx })),
          specs: mapSpecificationsToDto(data.specifications),
          updated_at: new Date().toISOString(),
        }; 
        mockProducts[index] = updatedDto;
        return { data: mapProductDtoToDomain(updatedDto) };
      },
      invalidatesTags: (result, error, arg) => [{ type: CACHE_TAGS.Product, id: arg.slug }, { type: CACHE_TAGS.Product, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPublicProductsQuery, useGetProductsQuery, useGetProductBySlugQuery, useCreateProductMutation, useUpdateProductMutation } = catalogApi;