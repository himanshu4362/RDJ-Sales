export interface OrderItemDTO {
  product_id: string;
  product_name: string;
  product_model: string;
  product_image: string | null;
  qty: number;
  unit_price_paise: number;
  subtotal_paise: number;
}

export interface OrderDTO {
  _id: string;
  order_ref: string;
  
  cust_name: string;
  cust_phone: string;
  cust_location: string;
  
  line_items: OrderItemDTO[];
  total_value_paise: number;
  
  current_status: 'CONFIRMED' | 'READY' | 'DELIVERED' | 'CANCELLED';
  
  source_opportunity_id: string | null;
  
  created_at: string;
  updated_at: string;
}