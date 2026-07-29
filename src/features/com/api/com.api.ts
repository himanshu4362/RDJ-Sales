import { baseApi } from '../../../store/api/baseApi';
import { CACHE_TAGS } from '../../../store/api/tags';
import type { 
  CommercialOrder, 
  AgreementSnapshot, 
  StructuredEvent, 
  ProductionWorkflow,
  BusinessEventType 
} from '../domain/com.types';

// Mock DB for COM Aggregates
export const mockCommercialOrders: CommercialOrder[] = [];

interface GenerateOrderPayload {
  sourceOpportunityId: string;
  agreement: AgreementSnapshot;
  workflowType: 'OFF_THE_SHELF' | 'CUSTOM_FABRICATION';
  performedBy: { id: string; name: string };
}

// Factory for generating standard production steps based on workflow type
const generateWorkflowSteps = (type: 'OFF_THE_SHELF' | 'CUSTOM_FABRICATION') => {
  if (type === 'OFF_THE_SHELF') {
    return [
      { id: `step_${Date.now()}_1`, code: 'INVENTORY_RESERVED', displayName: 'Inventory Reserved', status: 'PENDING' as const },
      { id: `step_${Date.now()}_2`, code: 'QC', displayName: 'Quality Control', status: 'PENDING' as const },
      { id: `step_${Date.now()}_3`, code: 'READY', displayName: 'Ready for Dispatch', status: 'PENDING' as const },
    ];
  }
  return [
    { id: `step_${Date.now()}_1`, code: 'MATERIAL_SOURCING', displayName: 'Material Sourcing', status: 'PENDING' as const },
    { id: `step_${Date.now()}_2`, code: 'CARPENTRY', displayName: 'Carpentry', status: 'PENDING' as const },
    { id: `step_${Date.now()}_3`, code: 'PAINTING', displayName: 'Painting & Finishing', status: 'PENDING' as const },
    { id: `step_${Date.now()}_4`, code: 'ASSEMBLY', displayName: 'Wiring & Assembly', status: 'PENDING' as const },
    { id: `step_${Date.now()}_5`, code: 'QC', displayName: 'Quality Control', status: 'PENDING' as const },
    { id: `step_${Date.now()}_6`, code: 'READY', displayName: 'Ready for Dispatch', status: 'PENDING' as const },
  ];
};

export const comApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateCommercialOrder: builder.mutation<CommercialOrder, GenerateOrderPayload>({
      queryFn: (payload) => {
        const timestamp = new Date().toISOString();
        const orderId = `com_${Math.random().toString(36).slice(2, 11)}`;
        
        // 1. Initialize the Workflow
        const workflow: ProductionWorkflow = {
          type: payload.workflowType,
          steps: generateWorkflowSteps(payload.workflowType),
        };

        // 2. Initialize the Audit Trail with strict business events
        const auditTrail: StructuredEvent[] = [
          {
            id: `evt_${Date.now()}_1`,
            type: 'COMMERCIAL_AGREEMENT_REACHED',
            performedBy: { type: 'ADMIN', id: payload.performedBy.id, name: payload.performedBy.name },
            occurredAt: timestamp,
            metadata: { sourceOpportunityId: payload.sourceOpportunityId }
          },
          {
            id: `evt_${Date.now()}_2`,
            type: 'COMMERCIAL_ORDER_GENERATED',
            performedBy: { type: 'SYSTEM', id: 'sys', name: 'RDJ Platform' },
            occurredAt: timestamp,
          }
        ];

        // 3. Construct the COM Aggregate
        const newOrder: CommercialOrder = {
          id: orderId,
          orderNumber: `COM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          sourceOpportunityId: payload.sourceOpportunityId,
          status: 'ADVANCE_PENDING',
          agreement: payload.agreement,
          ledger: [], // Empty ledger at creation
          workflow,
          auditTrail,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        mockCommercialOrders.unshift(newOrder);

        return { data: newOrder };
      },
      invalidatesTags: [{ type: CACHE_TAGS.Order, id: 'LIST' }, { type: CACHE_TAGS.Opportunity, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGenerateCommercialOrderMutation } = comApi;