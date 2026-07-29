import React from 'react';
import type { OrderStatus } from '../../domain/orders.types';

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles: Record<OrderStatus, string> = {
    CONFIRMED: 'bg-warning/10 text-warning border-warning/20',
    READY: 'bg-success/10 text-success border-success/20',
    DELIVERED: 'bg-surface-elevated text-text-muted border-border-default',
    CANCELLED: 'bg-danger/10 text-danger border-danger/20',
  };

  const labels: Record<OrderStatus, string> = {
    CONFIRMED: 'Confirmed',
    READY: 'Ready for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};