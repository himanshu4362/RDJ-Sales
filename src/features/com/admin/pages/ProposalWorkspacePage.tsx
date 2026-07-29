import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSignature, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { useAppSelector } from '../../../../store/hooks';
import { useGetOpportunityByIdQuery, useUpdateOpportunityStatusMutation } from '../../../sales-opportunity/api/opportunity.api';
import { useGenerateCommercialOrderMutation } from '../../api/com.api';
import { Button } from '../../../../common/components/ui/Button';
import { Input } from '../../../../common/components/ui/Input';
import { Label } from '../../../../common/components/ui/Label';
import { Select } from '../../../../common/components/ui/Select';
import { Textarea } from '../../../../common/components/ui/Textarea';
import { formatCurrency } from '../../../../common/utils/formatters';

export const ProposalWorkspacePage: React.FC = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const navigate = useNavigate();
  const { member } = useAppSelector(state => state.auth);

  const { data: opp, isLoading } = useGetOpportunityByIdQuery(opportunityId ?? '');
  const [generateOrder, { isLoading: isGenerating }] = useGenerateCommercialOrderMutation();
  const [updateOpportunityStatus] = useUpdateOpportunityStatusMutation();

  // Proposal State (Drafting the Agreement)
  const [quantity, setQuantity] = useState(opp?.requestedQuantity?.toString() || '1');
  const [unitPrice, setUnitPrice] = useState('');
  const [advancePercent, setAdvancePercent] = useState('50');
  const [logisticsMethod, setLogisticsMethod] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [workflowType, setWorkflowType] = useState<'OFF_THE_SHELF' | 'CUSTOM_FABRICATION'>('CUSTOM_FABRICATION');
  const [customMods, setCustomMods] = useState('');

  if (isLoading || !opp) return <div className="p-8">Loading Proposal Context...</div>;

  const handleStrikeAgreement = async () => {
    if (!member) return;

    try {
      // 1. Generate the COM Aggregate
      const newOrder = await generateOrder({
        sourceOpportunityId: opp.id,
        workflowType,
        performedBy: { id: member.identity.id, name: member.profile.displayName },
        agreement: {
          customer: { name: opp.customerName, phone: opp.customerPhone, location: opp.location },
          equipment: [{
            productId: opp.productId,
            name: opp.productName,
            model: opp.productModel,
            customModifications: customMods || undefined
          }],
          financials: {
            unitPrice: Number(unitPrice),
            quantity: Number(quantity),
            requiredAdvancePercentage: Number(advancePercent)
          },
          logisticsMethod
        }
      }).unwrap();

      // 2. Resolve the original Opportunity
      await updateOpportunityStatus({ id: opp.id, status: 'COMPLETED' }).unwrap();

      // 3. Navigate to the new COM Workspace
      navigate(ROUTES.ORDER_DETAILS(newOrder.id), { replace: true });
    } catch (error) {
      console.error('Failed to generate Commercial Order', error);
    }
  };

  const calculatedTotal = Number(unitPrice) * Number(quantity);
  const calculatedAdvance = calculatedTotal * (Number(advancePercent) / 100);

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">
      <div className="bg-surface-primary border-b border-border-default sticky top-0 z-20 px-4 md:px-8 py-5">
        <button onClick={() => navigate(ROUTES.OPPORTUNITY_DETAILS(opp.id))} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary uppercase tracking-wider mb-4 transition-colors w-max">
          <ArrowLeft size={16} /> Back to Lead
        </button>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Draft Commercial Proposal</h1>
        <p className="text-sm text-text-secondary mt-1">Finalize terms before generating the agreement for {opp.customerName}.</p>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pt-8 flex flex-col gap-8">
        
        {/* Section 1: Equipment & Workflow */}
        <div className="bg-surface-primary border border-border-default rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest border-b border-border-default pb-3 mb-5">Equipment & Scope</h2>
          <div className="flex flex-col gap-5">
            <div className="p-4 bg-surface-secondary rounded-lg border border-border-default">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1">Base Product</span>
              <span className="text-lg font-bold text-text-primary">{opp.productName} ({opp.productModel})</span>
            </div>
            <div>
              <Label>Custom Modifications / Agreed Revisions</Label>
              <Textarea 
                placeholder="e.g., 'Load with 15-inch Ahuja driver instead of default'" 
                value={customMods} onChange={(e) => setCustomMods(e.target.value)}
              />
            </div>
            <div>
              <Label>Production Track</Label>
              <Select value={workflowType} onChange={(e) => setWorkflowType(e.target.value as any)}>
                <option value="CUSTOM_FABRICATION">Custom Fabrication (Requires Workshop Build)</option>
                <option value="OFF_THE_SHELF">Off-The-Shelf (Inventory Only)</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Terms */}
        <div className="bg-surface-primary border border-border-default rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest border-b border-border-default pb-3 mb-5">Financial Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <Label>Quantity</Label>
              <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
              <Label>Negotiated Unit Price ( )</Label>
              <Input type="number" placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
            </div>
            <div>
              <Label>Required Advance</Label>
              <Select value={advancePercent} onChange={(e) => setAdvancePercent(e.target.value)}>
                <option value="100">100% (Full Upfront)</option>
                <option value="50">50% (Standard Custom)</option>
                <option value="0">0% (Pay on Delivery)</option>
              </Select>
            </div>
          </div>
          
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-brand-primary uppercase tracking-wider">Required Advance to Start Work</span>
              <span className="text-2xl font-black text-text-primary">{formatCurrency(calculatedAdvance || 0)}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">Order Total</span>
              <span className="text-lg font-bold text-text-secondary">{formatCurrency(calculatedTotal || 0)}</span>
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="bg-surface-primary border border-border-default p-4 rounded-xl shadow-md flex justify-between items-center sticky bottom-6 z-30">
          <p className="text-sm text-text-secondary font-medium hidden sm:block">
            Generating this order creates an immutable commercial record.
          </p>
          <Button 
            onClick={handleStrikeAgreement} 
            disabled={isGenerating || !unitPrice || !quantity} 
            className="flex items-center gap-2 px-8 h-12 w-full sm:w-auto"
          >
            <FileSignature size={18} />
            {isGenerating ? 'Generating...' : 'Strike Agreement & Generate Order'}
          </Button>
        </div>

      </div>
    </div>
  );
};