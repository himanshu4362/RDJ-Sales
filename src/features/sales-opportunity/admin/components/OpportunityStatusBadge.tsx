import React from 'react';
import type { OpportunityStatus } from '../../domain/opportunity.types';

export const OpportunityStatusBadge: React.FC<{ status: OpportunityStatus }> = ({ status }) => {
  const styles: Record<OpportunityStatus, string> = {
    NEW: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    IN_PROGRESS: 'bg-info/10 text-info border-info/20',
    COMPLETED: 'bg-success/10 text-success border-success/20',
    CANCELLED: 'bg-surface-elevated text-text-muted border-border-default',
  };

  const labels: Record<OpportunityStatus, string> = {
    NEW: 'New Request',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};