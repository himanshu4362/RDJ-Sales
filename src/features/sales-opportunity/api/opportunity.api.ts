import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { SalesOpportunity, CreateOpportunityPayload, OpportunityStatus } from '../domain/opportunity.types';
import type { SalesOpportunityDTO } from './opportunity.dto';

// Pure translation function (Mapper)
const mapDtoToDomain = (dto: SalesOpportunityDTO): SalesOpportunity => ({
  id: dto._id,
  customerName: dto.customer_name,
  customerPhone: dto.customer_phone,
  location: dto.city_district,
  
  // Snapshot Data
  productId: dto.product_id,
  productName: dto.product_name,
  productSlug: dto.product_slug,
  productModel: dto.product_model,
  productImage: dto.product_image,
  
  requestedQuantity: dto.req_qty || undefined,
  message: dto.customer_message || undefined,
  status: dto.pipeline_status,
  linkedOrderId: dto.linked_order_id || undefined,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});

// Temporary Mock Data Store
let mockOpportunities: SalesOpportunityDTO[] = [
  {
    _id: 'opp_test123',
    customer_name: 'Himanshu Raj',
    customer_phone: '6202739979',
    city_district: 'Jamshedpur',
    product_id: 'prod_1',
    product_name: 'ATI Pro 1200W Professional Power Amplifier',
    product_slug: 'ati-pro-1200w-amplifier',
    product_model: 'RX-1200',
    product_image: null,
    req_qty: 2,
    customer_message: 'Need this urgently.',
    pipeline_status: 'NEW',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const opportunityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Customer Action: Submit a new inquiry
    submitOpportunity: builder.mutation<SalesOpportunity, CreateOpportunityPayload>({
      queryFn: (payload) => {
        const newDto: SalesOpportunityDTO = {
          _id: `opp_${Math.random().toString(36).slice(2, 11)}`,
          customer_name: payload.customerName,
          customer_phone: payload.customerPhone,
          city_district: payload.location,
          
          product_id: payload.productId,
          product_name: payload.productName,
          product_slug: payload.productSlug,
          product_model: payload.productModel,
          product_image: payload.productImage,
          
          req_qty: payload.requestedQuantity ?? null,
          customer_message: payload.message ?? null,
          pipeline_status: 'NEW',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockOpportunities.unshift(newDto);
        return { data: mapDtoToDomain(newDto) };
      },
      invalidatesTags: [{ type: CACHE_TAGS.Opportunity, id: 'OPPORTUNITY_LIST' }],
    }),

    linkOrderToOpportunity: builder.mutation<SalesOpportunity, { id: string; orderId: string }>({
      queryFn: ({ id, orderId }) => {
        const index = mockOpportunities.findIndex(o => o._id === id);
        if (index === -1) return { error: { status: 404, statusText: 'Not Found', data: 'Opportunity not found' } };
        
        mockOpportunities[index] = { 
          ...mockOpportunities[index], 
          linked_order_id: orderId, 
          pipeline_status: 'COMPLETED' // Business Rule: Creating an order completes the opportunity
        };
        return { data: mapDtoToDomain(mockOpportunities[index]) };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: CACHE_TAGS.Opportunity, id: arg.id }, 
        { type: CACHE_TAGS.Opportunity, id: 'OPPORTUNITY_LIST' }
      ],
    }),

    // Admin Action: View pipeline
    getOpportunities: builder.query<{ data: SalesOpportunity[] }, void>({
      queryFn: () => {
        return { data: { data: mockOpportunities.map(mapDtoToDomain) } };
      },
      providesTags: [{ type: CACHE_TAGS.Opportunity, id: 'OPPORTUNITY_LIST' }],
    }),

    // Admin Action: Direct retrieval for Details Page
    getOpportunityById: builder.query<SalesOpportunity, string>({
      queryFn: (id) => {
        const found = mockOpportunities.find(o => o._id === id);
        if (!found) return { error: { status: 404, statusText: 'Not Found', data: 'Opportunity not found' } };
        return { data: mapDtoToDomain(found) };
      },
      providesTags: (_result, _error, id) => [{ type: CACHE_TAGS.Opportunity, id }],
    }),

    // Admin Action: Move pipeline stage
    updateOpportunityStatus: builder.mutation<SalesOpportunity, { id: string; status: OpportunityStatus }>({
      queryFn: ({ id, status }) => {
        const index = mockOpportunities.findIndex(o => o._id === id);
        if (index === -1) return { error: { status: 404, statusText: 'Not Found', data: 'Opportunity not found' } };
        
        mockOpportunities[index] = {
          ...mockOpportunities[index],
          pipeline_status: status,
          updated_at: new Date().toISOString(),
        };
        return { data: mapDtoToDomain(mockOpportunities[index]) };
      },
      invalidatesTags: [{ type: CACHE_TAGS.Opportunity, id: 'OPPORTUNITY_LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useSubmitOpportunityMutation, 
  useGetOpportunitiesQuery, 
  useGetOpportunityByIdQuery,
  useUpdateOpportunityStatusMutation,
  useLinkOrderToOpportunityMutation // NEW
} = opportunityApi;