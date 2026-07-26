/**
 * src/app/navigation/routes.ts
 * 
 * Defines all application route paths.
 * By centralizing these, we guarantee that URL structures remain 
 * consistent, shareable, and decoupled from UI component names.
 */

export const ROUTES = {
  // ==========================================
  // DISCOVERY ZONE (Public Access)
  // ==========================================
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT_CREATE: '/catalog/new',
  PRODUCT_EDIT: (productSlug: string) => `/catalog/${productSlug}/edit`,
  // Uses a pure function to enforce business identity in dynamic URLs
  PRODUCT_DETAILS: (productSlug: string) => `/catalog/${productSlug}`,
  CONFIGURATOR: '/configurator',

  // ==========================================
  // AUTHENTICATION JOURNEY
  // ==========================================
  LOGIN: '/login',

  // ==========================================
  // ACTION ZONE (Protected / Requires Session)
  // ==========================================
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`,
  PAYMENTS: '/payments', // Open payments ledger
  REPAIRS: '/repairs',
  VIP_APPOINTMENTS: '/vip',

  // ==========================================
  // ADMINISTRATIVE ZONE (Role-Based)
  // ==========================================
  ADMIN_DASHBOARD: '/admin',
  
  
  // ==========================================
  // COMMUNICATION ZONE (Future Scope)
  // ==========================================
  // CHAT: '/chat',
  // BROADCASTS: '/broadcasts',
  // CONSULTATIONS: '/consultations',
} as const;

// Type helper for future strict-typing of route consumption
export type AppRoutes = typeof ROUTES;