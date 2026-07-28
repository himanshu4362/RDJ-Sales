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
  PAYMENTS: '/payments',
  REPAIRS: '/repairs',
  VIP_APPOINTMENTS: '/vip',

  // ==========================================
  // ADMINISTRATIVE ZONE (Role-Based)
  // ==========================================
  ADMIN_DASHBOARD: '/admin',
  ADMIN_CATALOG: '/admin/catalog',
  ADMIN_PRODUCT_CREATE: '/admin/catalog/new',
  ADMIN_PRODUCT_EDIT: (productSlug: string) => `/admin/catalog/${productSlug}/edit`,
  ADMIN_PRODUCT_DETAILS: (productSlug: string) => `/admin/catalog/${productSlug}`,
} as const;

export type AppRoutes = typeof ROUTES;