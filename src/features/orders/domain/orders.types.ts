export const ORDER_STATUSES = ['CONFIRMED', 'READY', 'DELIVERED', 'CANCELLED'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export interface OrderItem {
  productId: string;
  productName: string;
  productModel: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number; // The agreed price at the moment of creation
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // Human-readable (e.g., ORD-2026-0001)
  
  // Sourced from Opportunity, but owned by Order now
  customerName: string;
  customerPhone: string;
  location: string;
  
  items: OrderItem[];
  totalAmount: number;
  
  status: OrderStatus;
  
  opportunityId?: string; // Optional link back to the sales origin
  
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderPayload = Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>;