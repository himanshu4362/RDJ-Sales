/**
 * src/app/navigation/routes.ts
 */
export const ROUTES = {
  // ==========================================
  // DISCOVERY ZONE (Public Access)
  // ==========================================
  HOME: '/',
  CATALOG: '/catalog', 
  PRODUCT_DETAILS: (productSlug: string) => `/catalog/${productSlug}`,
  CONFIGURATOR: '/configurator',
  ADMIN_WORKSPACE: '/admin',
  OPPORTUNITIES: '/admin/opportunities',
  ORDERS: '/admin/orders', 
  REPAIRS: '/admin/repairs', 
  VIP_APPOINTMENTS: '/admin/vip', 
  // ==========================================
  // AUTHENTICATION JOURNEY
  // ==========================================
  LOGIN: '/login',

  // ==========================================
  // ACTION ZONE (Protected / Requires Session)
  // ==========================================
  CART: '/cart',
  ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`,
  PAYMENTS: '/payments',

  // ==========================================
  // ADMINISTRATIVE ZONE (Role-Based)
  // ==========================================
  ADMIN_DASHBOARD: '/admin',
  ADMIN_CATALOG: '/admin/catalog',
  ADMIN_PRODUCT_CREATE: '/admin/catalog/new',
  ADMIN_PRODUCT_EDIT: (productSlug: string) => `/admin/catalog/${productSlug}/edit`,
  ADMIN_PRODUCT_DETAILS: (productSlug: string) => `/admin/catalog/${productSlug}`,
  
  // NEW: Added dynamic path generator for opportunity details
  OPPORTUNITY_DETAILS: (id: string) => `/admin/opportunities/${id}`,
} as const;

export type AppRoutes = typeof ROUTES;
