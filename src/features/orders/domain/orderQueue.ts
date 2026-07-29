import type { Order, OrderStatus } from './orders.types';

export const processOperationsQueue = (orders: Order[], searchQuery: string): Order[] => {
  const statusWeight: Record<OrderStatus, number> = {
    CONFIRMED: 0,
    READY: 1,
    DELIVERED: 2,
    CANCELLED: 3,
  };

  const lowerQuery = searchQuery.toLowerCase();

  return orders
    .filter(order => 
      order.orderNumber.toLowerCase().includes(lowerQuery) ||
      order.customerName.toLowerCase().includes(lowerQuery) ||
      order.customerPhone.includes(lowerQuery)
    )
    .sort((a, b) => {
      // 1. Sort by operational priority (Active work first)
      const weightDiff = statusWeight[a.status] - statusWeight[b.status];
      if (weightDiff !== 0) return weightDiff;
      // 2. Sort by oldest unfulfilled work first within the same status
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
};