export interface SalesOpportunityDTO {
  _id: string;
  customer_name: string;
  customer_phone: string;
  city_district: string;
  
  // Snapshot data
  product_id: string;
  product_name: string;
  product_slug: string;
  product_model: string;
  product_image: string | null;
  
  req_qty: number | null;
  customer_message: string | null;
  
  pipeline_status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  linked_order_id?: string | null; // NEW
  created_at: string;
  updated_at: string;
}