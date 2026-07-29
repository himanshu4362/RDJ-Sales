import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Search, ClipboardList } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { useGetOrdersQuery } from '../../api/orders.api';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { formatCurrency } from '../../../../common/utils/formatters';
import { processOperationsQueue } from '../../domain/orderQueue';

export const AdminOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetOrdersQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const orders = data?.data || [];
  const processedOrders = useMemo(() => processOperationsQueue(orders, searchQuery), [orders, searchQuery]);

  if (isLoading) return <div className="p-8"><LoadingSkeleton className="h-64 w-full" /></div>;
  if (isError) return <div className="p-8 text-danger font-bold text-center">Failed to load Operations Queue.</div>;

  const isTotallyEmpty = orders.length === 0;

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">
      <div className="bg-surface-primary border-b border-border-default sticky top-0 z-20 px-4 md:px-8 py-5">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Operations Queue</h1>
        <p className="text-sm text-text-secondary mt-1">Manage active commercial agreements and fulfillment.</p>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 bg-surface-primary p-4 rounded-xl border border-border-default shadow-sm">
          <div className="flex items-center flex-1 max-w-md border border-border-default rounded-lg bg-surface-secondary px-3 py-2 focus-within:border-text-primary transition-colors">
            <Search size={18} className="text-text-muted shrink-0" />
            <input 
              type="text" 
              placeholder="Search by Order #, Customer, or Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm px-3 text-text-primary w-full placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Empty State A: Absolutely no orders exist */}
        {isTotallyEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-primary border border-border-default rounded-xl shadow-sm">
             <ClipboardList size={48} className="text-border-default mb-4" />
             <h3 className="text-xl font-bold text-text-primary">No Orders Yet</h3>
             <p className="text-text-secondary mt-2">When deals are closed, they will appear here for fulfillment.</p>
          </div>
        ) : (
          <div className="bg-surface-primary border border-border-default rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary border-b border-border-default text-xs font-bold text-text-muted uppercase tracking-wider">
                  <th className="p-4 pl-6">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {/* Empty State B: Search yielded no results */}
                {processedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-text-secondary">
                      <Search size={32} className="mx-auto text-border-default mb-3" />
                      No matches found for "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  processedOrders.map(order => (
                    <tr 
                      key={order.id} 
                      onClick={() => navigate(ROUTES.ORDER_DETAILS(order.id))}
                      className={`cursor-pointer transition-colors ${order.status === 'DELIVERED' || order.status === 'CANCELLED' ? 'opacity-60 bg-surface-secondary/30 hover:opacity-100 hover:bg-surface-secondary/80' : 'hover:bg-surface-secondary/50 group'}`}
                    >
                      <td className="p-4 pl-6 font-bold text-text-primary group-hover:text-brand-primary">{order.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-bold text-text-primary">{order.customerName}</div>
                        <div className="text-xs text-text-secondary">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 font-black text-text-primary">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-4"><OrderStatusBadge status={order.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};