// ==========================================
// 1. ORIGINS, LIFECYCLES & ENUMS
// ==========================================
export const ORDER_ORIGINS = [
  'PROPOSAL', 
  'WEBSITE_CHECKOUT', 
  'WALK_IN', 
  'DIRECT_CALL', 
  'REPEAT_CUSTOMER'
] as const;
export type OrderOrigin = typeof ORDER_ORIGINS[number];

export const ORDER_LIFECYCLE = [
  'CREATED',
  'ADVANCE_PENDING',
  'ADVANCE_RECEIVED',
  'PRODUCTION_AUTHORIZED',
  'READY_FOR_DELIVERY',
  'COMPLETED'
] as const;
export type OrderLifecycleStatus = typeof ORDER_LIFECYCLE[number];

// REFINEMENT 1: Strongly typed business events
export const BUSINESS_EVENT_TYPES = [
  'COMMERCIAL_PROPOSAL_GENERATED',
  'COMMERCIAL_PROPOSAL_REVISED',
  'COMMERCIAL_AGREEMENT_REACHED',
  'COMMERCIAL_ORDER_GENERATED',
  'ADVANCE_RECEIVED',
  'BALANCE_RECEIVED',
  'PRODUCTION_STARTED',
  'PRODUCTION_STEP_COMPLETED',
  'READY_FOR_DELIVERY',
  'DELIVERED'
] as const;
export type BusinessEventType = typeof BUSINESS_EVENT_TYPES[number];

export const PRODUCTION_TRACKS = ['OFF_THE_SHELF', 'CUSTOM_FABRICATION'] as const;
export type ProductionTrack = typeof PRODUCTION_TRACKS[number];

export const LEDGER_EVENT_TYPES = ['ADVANCE_RECEIVED', 'BALANCE_RECEIVED'] as const;
export type LedgerEventType = typeof LEDGER_EVENT_TYPES[number];

export const ACTOR_TYPES = ['SYSTEM', 'ADMIN', 'CUSTOMER'] as const;
export type ActorType = typeof ACTOR_TYPES[number];

// ==========================================
// 2. IMMUTABLE SNAPSHOTS
// ==========================================
export interface CustomerSnapshot {
  name: string;
  phone: string;
  location: string;
}

export interface EquipmentSnapshot {
  productId: string;
  name: string;
  model: string;
  customModifications?: string;
}

export interface FinancialTerms {
  unitPrice: number;
  quantity: number;
  requiredAdvancePercentage: number;
}

export interface AgreementSnapshot {
  customer: CustomerSnapshot;
  equipment: EquipmentSnapshot[];
  financials: FinancialTerms;
  agreedCompletionDate?: string;
  logisticsMethod: 'PICKUP' | 'DELIVERY';
}

// ==========================================
// 3. MUTABLE WORKFLOWS & LEDGER
// ==========================================
export interface LedgerEntry {
  id: string;
  type: LedgerEventType;
  amount: number;
  occurredAt: string; 
  referenceNumber?: string;
  paymentMethod?: string;
}

export interface ProductionStep {
  id: string;
  code: string;                  // REFINEMENT 5: Stable identifier (e.g., 'CARPENTRY')
  displayName: string;           // REFINEMENT 5: UI representation
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
}

export interface ProductionWorkflow {
  type: ProductionTrack;
  steps: ProductionStep[];
}

// ==========================================
// 4. STRUCTURED AUDIT TRAIL
// ==========================================
export interface StructuredEvent {
  id: string;
  type: BusinessEventType;       // REFINEMENT 1: Strongly typed
  performedBy: {                 // REFINEMENT 3: Renamed from 'actor'
    type: ActorType;
    id: string;
    name: string;
  };
  occurredAt: string;            // REFINEMENT 4: Explicit timeline language
  metadata?: Record<string, unknown>; // REFINEMENT 2: Type safety
}

// ==========================================
// 5. THE COM AGGREGATE ROOT
// ==========================================
export interface CommercialOrder {
  id: string;
  orderNumber: string; 
  origin: OrderOrigin;           // NEW: Distinguishes E-commerce from Consultative
  sourceOpportunityId?: string;  // REFINEMENT 4: Now optional for Walk-ins/Checkout
  status: OrderLifecycleStatus;
  
  agreement: AgreementSnapshot; 
  ledger: LedgerEntry[];        
  workflow: ProductionWorkflow; 
  auditTrail: StructuredEvent[];
  
  createdAt: string;
  updatedAt: string;
}