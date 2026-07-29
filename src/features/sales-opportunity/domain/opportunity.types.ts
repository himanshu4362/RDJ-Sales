export const OPPORTUNITY_STATUSES = ['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type OpportunityStatus = typeof OPPORTUNITY_STATUSES[number];

export interface SalesOpportunity {
  id: string;
  
  // Customer Context
  customerName: string;
  customerPhone: string;
  location: string;
  
  // Product Context (Immutable Snapshot)
  productId: string;
  productName: string;
  productSlug: string;
  productModel: string;      // NEW: Snapshotted Model
  productImage: string | null; // NEW: Snapshotted Image URL
  
  requestedQuantity?: number;
  message?: string;
  
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateOpportunityPayload = Omit<SalesOpportunity, 'id' | 'status' | 'createdAt' | 'updatedAt'>;