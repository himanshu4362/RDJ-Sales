import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { useGetOpportunityByIdQuery, useUpdateOpportunityStatusMutation } from '../../api/opportunity.api';
// Cross-domain imports
import { useCreateOrderMutation, useGetOrderByOpportunityIdQuery } from '../../../orders/api/orders.api';
import { OpportunityStatusBadge } from '../components/OpportunityStatusBadge';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { Button } from '../../../../common/components/ui/Button';
import { Input } from '../../../../common/components/ui/Input';
import { FieldError } from '../../../../common/components/ui/FieldError';
import type { OpportunityStatus } from '../../domain/opportunity.types';

export const AdminOpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: opp, isLoading, isError } = useGetOpportunityByIdQuery(id ?? '');
  const [updateStatus] = useUpdateOpportunityStatusMutation();

  // 1. Cross-Domain Query: Does this Opportunity already have an active Order?
  const { data: linkedOrder, isLoading: isCheckingOrder } = useGetOrderByOpportunityIdQuery(id ?? '', { skip: !id });
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  // Transition UI State
  const [isConverting, setIsConverting] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState<string>('');
  const [agreedQty, setAgreedQty] = useState<string>('');
  const [conversionError, setConversionError] = useState<string | null>(null);

  if (isLoading || isCheckingOrder) return <div className="p-8 max-w-7xl mx-auto"><LoadingSkeleton className="h-48 w-full" /></div>;
  if (isError || !opp) return <div className="p-8 text-center text-danger font-bold">Opportunity not found.</div>;

  // Format WhatsApp number (strip spaces/symbols for standard Indian dialing)
  const waNumber = opp.customerPhone.replace(/\D/g, '');
  const waLink = `https://wa.me/91${waNumber}`;

  // Handles creating the commercial order from an opportunity and marking the deal won
  const handleConvertToOrder = async () => {
    setConversionError(null);
    const price = Number(agreedPrice);
    const qty = Number(agreedQty);

    if (!price || price <= 0) return setConversionError('Enter a valid unit price.');
    if (!qty || qty <= 0) return setConversionError('Enter a valid quantity.');

    try {
      // 1. Create the commercial agreement snapshot
      const newOrder = await createOrder({
        customerName: opp.customerName,
        customerPhone: opp.customerPhone,
        location: opp.location,
        opportunityId: opp.id,
        items: [{
          productId: opp.productId,
          productName: opp.productName,
          productModel: opp.productModel,
          productImage: opp.productImage,
          quantity: qty,
          unitPrice: price,
          subtotal: price * qty
        }],
        totalAmount: price * qty
      }).unwrap();

      // 2. Mark Opportunity as "Deal Won"
      await updateStatus({ id: opp.id, status: 'COMPLETED' }).unwrap();

      // 3. Navigate to the new Order Workspace
      navigate(ROUTES.ORDER_DETAILS(newOrder.id));
    } catch (error) {
      setConversionError('Failed to create order. Please try again.');
    }
  };

  const handleOpenConversion = () => {
    setAgreedQty(opp.requestedQuantity?.toString() || '1');
    setIsConverting(true);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">

      {/* 1. Unified Operational Header (Customer Command Center) */}
      <div className="bg-surface-primary border-b border-border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">

          <button onClick={() => navigate(ROUTES.OPPORTUNITIES)} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary uppercase tracking-wider mb-4 transition-colors w-max">
            <ArrowLeft size={16} /> Back to Pipeline
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{opp.customerName}</h1>
                <OpportunityStatusBadge status={opp.status} />
              </div>
              <p className="text-sm font-medium text-text-secondary">
                Requested on {new Date(opp.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Communication & Action Toolbar */}
            <div className="flex items-center gap-3">

              {/* The Business Transition Logic: Convert to Order / View Commercial Order */}
              {linkedOrder ? (
                <Button onClick={() => navigate(ROUTES.ORDER_DETAILS(linkedOrder.id))} className="flex items-center gap-2 bg-success text-white hover:bg-success/90">
                  <ShoppingCart size={18} /> View Commercial Order
                </Button>
              ) : isConverting ? (
                <div className="flex flex-col items-end gap-1 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 bg-surface-secondary p-1.5 rounded-lg border border-border-default">
                    <Input
                      type="number" placeholder="Qty" value={agreedQty}
                      onChange={(e) => setAgreedQty(e.target.value)}
                      className="h-10 w-20 text-sm font-bold"
                    />
                    <Input
                      type="number" placeholder="Unit Price (₹)" value={agreedPrice}
                      onChange={(e) => setAgreedPrice(e.target.value)}
                      className="h-10 w-32 text-sm font-bold" autoFocus
                    />
                    <Button onClick={handleConvertToOrder} disabled={isCreatingOrder} className="h-10 px-4">
                      {isCreatingOrder ? <Loader2 size={16} className="animate-spin" /> : 'Confirm'}
                    </Button>
                    <Button variant="ghost" onClick={() => setIsConverting(false)} className="h-10 px-3 text-text-secondary">Cancel</Button>
                  </div>
                  {conversionError && <FieldError error={conversionError} />}
                </div>
              ) : (
                <Button onClick={handleOpenConversion} className="flex items-center gap-2 bg-brand-primary text-white hover:bg-brand-secondary">
                  <ShoppingCart size={18} /> Convert to Order
                </Button>
              )}

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a href={`tel:${opp.customerPhone}`} className="flex items-center gap-2 bg-surface-secondary hover:bg-border-default text-text-primary border border-border-default px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
                <Phone size={18} /> Call
              </a>
              <div className="h-8 w-px bg-border-default mx-1" />
              <select
                value={opp.status}
                onChange={(e) => updateStatus({ id: opp.id, status: e.target.value as OpportunityStatus })}
                className="text-sm font-bold bg-surface-primary border border-border-default rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer shadow-sm hover:border-text-primary transition-colors"
              >
                <option value="NEW">Mark New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancel</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* 2. Lead Dossier (The Request) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="bg-surface-primary border border-border-default rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-border-default pb-3">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Phone Number</span>
                  <span className="text-lg font-bold text-text-primary">{opp.customerPhone}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Setup Location</span>
                  <span className="text-lg font-bold text-text-primary">{opp.location}</span>
                </div>
              </div>
            </div>

            {opp.message && (
              <div className="bg-surface-primary border border-border-default rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 border-b border-border-default pb-3">Additional Requirements</h2>
                <p className="text-text-primary text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  "{opp.message}"
                </p>
              </div>
            )}
          </div>

          {/* 3. Product Snapshot (Sticky Context) */}
          <div className="w-full lg:w-1/3 sticky top-50">
            <div className="bg-surface-primary border border-border-default rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-surface-secondary border-b border-border-default px-5 py-3">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Requested Equipment</span>
              </div>

              <div className="aspect-4/3 bg-surface-secondary flex items-center justify-center border-b border-border-default">
                {opp.productImage ? (
                  <img src={opp.productImage} alt={opp.productName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-brand-primary font-black tracking-widest text-xl">RDJ</span>
                )}
              </div>

              <div className="p-5 flex flex-col">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{opp.productModel}</span>
                <span className="text-lg font-bold text-text-primary line-clamp-2">{opp.productName}</span>

                <button onClick={() => navigate(ROUTES.ADMIN_PRODUCT_DETAILS(opp.productSlug))} className="mt-6 text-sm font-bold text-brand-primary hover:underline text-left flex items-center gap-1">
                  View Admin Catalog Record
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};