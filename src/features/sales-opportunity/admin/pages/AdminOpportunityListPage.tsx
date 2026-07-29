import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Inbox, Search, Filter } from 'lucide-react';
import { ROUTES } from '../../../../app/navigation/routes';
import { useGetOpportunitiesQuery, useUpdateOpportunityStatusMutation } from '../../api/opportunity.api';
import { OpportunityStatusBadge } from '../components/OpportunityStatusBadge';
import { LoadingSkeleton } from '../../../../common/components/ui/LoadingSkeleton';
import type { OpportunityStatus } from '../../domain/opportunity.types';

export const AdminOpportunityListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetOpportunitiesQuery();
  const [updateStatus] = useUpdateOpportunityStatusMutation();

  const [searchQuery, setSearchQuery] = useState('');

  const opportunities = data?.data || [];

  // P2: Business Logic Sorting (NEW -> IN_PROGRESS -> COMPLETED -> CANCELLED)
  const processedOpportunities = useMemo(() => {
    const statusWeight: Record<OpportunityStatus, number> = {
      NEW: 0,
      IN_PROGRESS: 1,
      COMPLETED: 2,
      CANCELLED: 3,
    };

    return opportunities
      // P1: Functional Search Filter
      .filter(opp =>
        opp.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.customerPhone.includes(searchQuery) ||
        opp.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by business status first
        const weightDiff = statusWeight[a.status] - statusWeight[b.status];
        if (weightDiff !== 0) return weightDiff;
        // Then sort by newest request
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [opportunities, searchQuery]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <LoadingSkeleton className="h-10 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} className="h-16 w-full" />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-danger">Failed to load opportunities</h2>
        <p className="text-text-secondary mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-secondary pb-24">

      {/* 1. Admin Header */}
      <div className="bg-surface-primary border-b border-border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.ADMIN_WORKSPACE)}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-surface-secondary"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Sales Opportunities</h1>
            <p className="text-xs text-text-secondary font-medium">Manage customer requests and quotes</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8">

        {/* 2. Operational Toolbar (Craftsmanship Improvement) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-surface-primary p-4 rounded-xl border border-border-default shadow-sm">
          <div className="flex items-center flex-1 max-w-md border border-border-default rounded-lg bg-surface-secondary px-3 py-2 focus-within:border-text-primary transition-colors">
            <Search size={18} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by customer, phone, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm px-3 text-text-primary w-full placeholder:text-text-muted"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm font-bold text-text-secondary bg-surface-secondary border border-border-default px-4 py-2 rounded-lg hover:text-text-primary transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* 3. Pipeline Table Body */}
        {processedOpportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-primary border border-border-default rounded-xl shadow-sm">
            <div className="w-24 h-24 bg-surface-secondary border-2 border-dashed border-border-default rounded-full flex flex-col items-center justify-center text-text-muted mb-6">
              <Inbox size={32} className="mb-1" />
              <span className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">Asset Placeholder</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">No matching opportunities</h3>
            <p className="text-text-secondary mt-2 max-w-md">
              {searchQuery ? "Try adjusting your search criteria." : "You currently have no active sales opportunities. New customer requests will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="bg-surface-primary border border-border-default rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-secondary border-b border-border-default text-xs font-bold text-text-muted uppercase tracking-wider">
                    <th className="p-4 pl-6">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Requested Product</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {processedOpportunities.map((opp) => (
                    <tr
                      key={opp.id}
                      onClick={() => navigate(ROUTES.OPPORTUNITY_DETAILS(opp.id))}
                      className="hover:bg-surface-secondary/50 transition-colors group cursor-pointer"
                    >
                      <td className="p-4 pl-6">
                        <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
                          {new Date(opp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-primary">{opp.customerName}</span>
                          <span className="text-xs font-medium text-text-secondary mt-0.5">{opp.customerPhone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-primary line-clamp-1">{opp.productName}</span>
                          <span className="text-xs font-medium text-text-muted mt-0.5">Qty: {opp.requestedQuantity || 1}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-text-secondary line-clamp-1">{opp.location}</span>
                      </td>
                      <td className="p-4">
                        <OpportunityStatusBadge status={opp.status} />
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {/* P1: Type safety enforced (Removed 'as any') */}
                        <select
                          value={opp.status}
                          onClick={(e) => e.stopPropagation()} // Prevents row click when interacting with dropdown
                          onChange={(e) => updateStatus({ id: opp.id, status: e.target.value as OpportunityStatus })}
                          className="text-xs font-bold bg-surface-primary border border-border-default rounded px-2 py-1.5 text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer hover:bg-surface-secondary transition-colors"
                        >
                          <option value="NEW">Mark New</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};