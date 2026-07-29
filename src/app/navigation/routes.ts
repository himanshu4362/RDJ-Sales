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
  // AUTHENTICATION (Public Access)
  // ==========================================
  LOGIN: '/login',

  // ==========================================
  // CUSTOMER ZONE (Protected / Requires Session)
  // ==========================================
  MEMBER_HOME: '/member',
  CART: '/cart',
  PAYMENTS: '/payments',

  // ==========================================
  // BUSINESS ZONE (Protected / Admin Role)
  // ==========================================
  ADMIN_WORKSPACE: '/admin',
  ADMIN_DASHBOARD: '/admin',

  OPPORTUNITIES: '/admin/opportunities',
  OPPORTUNITY_DETAILS: (id: string) => `/admin/opportunities/${id}`,

  ORDERS: '/admin/orders',
  ORDER_DETAILS: (id: string) => `/admin/orders/${id}`,

  REPAIRS: '/admin/repairs',
  VIP_APPOINTMENTS: '/admin/vip',

  ADMIN_CATALOG: '/admin/catalog',
  ADMIN_PRODUCT_CREATE: '/admin/catalog/new',
  ADMIN_PRODUCT_EDIT: (productSlug: string) => `/admin/catalog/${productSlug}/edit`,
  ADMIN_PRODUCT_DETAILS: (productSlug: string) => `/admin/catalog/${productSlug}`,
} as const;

export type AppRoutes = typeof ROUTES;