import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '../../api/orders.api';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { formatCurrency } from '../../../../common/utils/formatters';
import type { OrderStatus } from '../../domain/orders.types';

export const AdminOrderWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(id ?? '');
  const [updateStatus, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, reset: resetUpdate }] = useUpdateOrderStatusMutation();

  // Clear success checkmark after 3 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isUpdateSuccess || isUpdateError) {
      timeout = setTimeout(() => resetUpdate(), 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isUpdateSuccess, isUpdateError, resetUpdate]);

  if (isLoading) return <div className="p-8 max-w-7xl mx-auto"><LoadingSkeleton className="h-64 w-full" /></div>;
  if (isError || !order) return <div className="p-8 text-center text-danger font-bold">Order not found.</div>;

  const waNumber = order.customerPhone.replace(/\D/g, '');
  
  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">
      
      {/* RDJ OPERATIONAL HEADER */}
      <div className="bg-surface-primary border-b border-border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <button onClick={() => navigate(ROUTES.ORDERS)} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-text-primary uppercase tracking-wider mb-4 transition-colors w-max">
            <ArrowLeft size={16} /> Back to Queue
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{order.orderNumber}</h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                {order.customerName}
              </p>
            </div>

            {/* NEXT ACTIONS */}
            <div className="flex items-center gap-3">
              <a href={`https://wa.me/91${waNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-surface-secondary hover:bg-border-default text-text-primary border border-border-default px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
                <MessageCircle size={18} className="text-[#25D366]" /> Message
              </a>
              <a href={`tel:${order.customerPhone}`} className="flex items-center gap-2 bg-surface-secondary hover:bg-border-default text-text-primary border border-border-default px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
                <Phone size={18} className="text-brand-primary" /> Call
              </a>
              <div className="h-8 w-px bg-border-default mx-1" />
              
              <div className="flex items-center gap-2 relative">
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus({ id: order.id, status: e.target.value as OrderStatus })}
                  disabled={isUpdating}
                  className="text-sm font-bold bg-brand-primary text-surface-primary border border-transparent rounded-lg px-4 py-2.5 focus:outline-none cursor-pointer shadow-sm hover:bg-brand-secondary transition-colors disabled:opacity-70"
                >
                  <option value="CONFIRMED">Status: Confirmed</option>
                  <option value="READY">Status: Ready</option>
                  <option value="DELIVERED">Status: Delivered</option>
                  <option value="CANCELLED">Status: Cancelled</option>
                </select>
                
                {/* Integrity Feedback Indicators */}
                <div className="absolute -right-8 flex items-center justify-center">
                  {isUpdating && <Loader2 size={18} className="text-text-muted animate-spin" />}
                  {isUpdateSuccess && <CheckCircle2 size={18} className="text-success animate-in zoom-in" />}
                  {isUpdateError && <span title="Update failed"><AlertCircle size={18} className="text-danger animate-in zoom-in" /></span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ZONE 1: COMMERCIAL AGREEMENT */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-primary border border-border-default rounded-xl shadow-sm overflow-hidden">
              <div className="bg-surface-secondary/50 border-b border-border-default px-6 py-4 flex justify-between items-center">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Commercial Agreement</h2>
                <span className="text-xs font-semibold text-text-secondary">Created {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="divide-y divide-border-default">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-6 flex items-start gap-4 hover:bg-surface-secondary/30 transition-colors">
                    <div className="w-16 h-16 bg-surface-secondary rounded-md border border-border-default overflow-hidden flex items-center justify-center shrink-0">
                      {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-brand-primary">RDJ</span>}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{item.productModel}</div>
                      <div className="font-bold text-text-primary leading-tight">{item.productName}</div>
                      <div className="text-sm text-text-secondary mt-2 font-medium">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</div>
                    </div>
                    <div className="font-black text-text-primary text-right text-lg">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-secondary/50 border-t border-border-default p-6 flex justify-between items-center">
                <span className="font-bold text-text-secondary uppercase tracking-widest">Order Total</span>
                <span className="text-3xl font-black text-brand-primary tracking-tight">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* ZONE 2 & 3: CUSTOMER CONTEXT & ORIGIN */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface-primary border border-border-default rounded-xl shadow-sm p-6 flex flex-col gap-6">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest border-b border-border-default pb-3">Customer Details</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Name</span>
                  <span className="font-bold text-text-primary">{order.customerName}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Contact</span>
                  <a href={`tel:${order.customerPhone}`} className="font-bold text-brand-primary hover:underline">{order.customerPhone}</a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-text-muted mt-0.5 shrink-0" />
                  <span className="font-medium text-text-secondary">{order.location}</span>
                </div>
              </div>
            </div>

            {/* Demoted Sales Origin: Now a subtle footer context card */}
            {order.opportunityId && (
              <div className="bg-surface-secondary border border-border-default rounded-lg p-4 flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">History</span>
                 </div>
                 <p className="text-xs text-text-secondary font-medium">
                   Originated from Sales Opportunity.
                 </p>
                 <button onClick={() => navigate(ROUTES.OPPORTUNITY_DETAILS(order.opportunityId!))} className="flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-brand-primary transition-colors w-max">
                   View Source Record <ExternalLink size={12} />
                 </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};