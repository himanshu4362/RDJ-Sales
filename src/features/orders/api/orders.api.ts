import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { Order, CreateOrderPayload, OrderStatus } from '../domain/orders.types';
import type { OrderDTO } from './orders.dto';
import { convertPaiseToRupees } from '../../catalog/utils/currency';

const mapDtoToDomain = (dto: OrderDTO): Order => ({
  id: dto._id,
  orderNumber: dto.order_ref,
  customerName: dto.cust_name,
  customerPhone: dto.cust_phone,
  location: dto.cust_location,
  items: dto.line_items.map(item => ({
    productId: item.product_id,
    productName: item.product_name,
    productModel: item.product_model,
    productImage: item.product_image,
    quantity: item.qty,
    unitPrice: convertPaiseToRupees(item.unit_price_paise),
    subtotal: convertPaiseToRupees(item.subtotal_paise),
  })),
  totalAmount: convertPaiseToRupees(dto.total_value_paise),
  status: dto.current_status,
  opportunityId: dto.source_opportunity_id || undefined,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});

const mockOrders: OrderDTO[] = [];

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<{ data: Order[] }, void>({
      queryFn: () => ({ data: { data: mockOrders.map(mapDtoToDomain) } }),
      providesTags: [{ type: CACHE_TAGS.Order, id: 'ORDER_LIST' }],
    }),
    
    getOrderById: builder.query<Order, string>({
      queryFn: (id) => {
        const found = mockOrders.find(o => o._id === id);
        if (!found) return { error: { status: 404, statusText: 'Not Found', data: 'Order not found' } };
        return { data: mapDtoToDomain(found) };
      },
      providesTags: (_result, _error, id) => [{ type: CACHE_TAGS.Order, id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderPayload>({
      queryFn: (payload) => {
        const newDto: OrderDTO = {
          // MOCK ONLY: Backend owns business identifier generation
          _id: `ord_${Math.random().toString(36).slice(2, 11)}`,
          order_ref: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          cust_name: payload.customerName,
          cust_phone: payload.customerPhone,
          cust_location: payload.location,
          line_items: payload.items.map(item => ({
            product_id: item.productId,
            product_name: item.productName,
            product_model: item.productModel,
            product_image: item.productImage,
            qty: item.quantity,
            unit_price_paise: item.unitPrice * 100,
            subtotal_paise: item.subtotal * 100,
          })),
          total_value_paise: payload.totalAmount * 100,
          current_status: 'CONFIRMED',
          source_opportunity_id: payload.opportunityId || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockOrders.unshift(newDto);
        return { data: mapDtoToDomain(newDto) };
      },
      invalidatesTags: [{ type: CACHE_TAGS.Order, id: 'ORDER_LIST' }],
    }),

    getOrderByOpportunityId: builder.query<Order | null, string>({
      queryFn: (opportunityId) => {
        // Find the most recent active order linked to this opportunity
        const found = mockOrders.find(o => o.source_opportunity_id === opportunityId && o.current_status !== 'CANCELLED');
        if (!found) return { data: null };
        return { data: mapDtoToDomain(found) };
      },
      providesTags: (_result, _error, opportunityId) => [{ type: CACHE_TAGS.Order, id: `opp_${opportunityId}` }],
    }),

    updateOrderStatus: builder.mutation<Order, { id: string; status: OrderStatus }>({
      queryFn: ({ id, status }) => {
        const index = mockOrders.findIndex(o => o._id === id);
        if (index === -1) return { error: { status: 404, statusText: 'Not Found', data: 'Order not found' } };
        
        mockOrders[index] = { ...mockOrders[index], current_status: status, updated_at: new Date().toISOString() };
        return { data: mapDtoToDomain(mockOrders[index]) };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: CACHE_TAGS.Order, id: 'ORDER_LIST' },
        { type: CACHE_TAGS.Order, id: arg.id }
      ],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetOrdersQuery, 
  useGetOrderByIdQuery, 
  useGetOrderByOpportunityIdQuery,
  useCreateOrderMutation, 
  useUpdateOrderStatusMutation 
} = ordersApi;