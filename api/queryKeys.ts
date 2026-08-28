export const queryKeys = {
  profile: ["profile"] as const,
  products: (filters?: Record<string, unknown>) => ["products", filters] as const,
  product: (id: string) => ["product", id] as const,
  myProducts: ["my-products"] as const,
  notifications: ["notifications"] as const,
  plans: ["plans"] as const,
  currentPlan: ["current-plan"] as const,
  savedItems: ["saved-items"] as const,
  unreadCount: ["unread-count"] as const, 
  verification: ["verification"] as const,
  myPayments: ["my-payments"] as const,
  rentalRequests: ["rental-requests"] as const,
  adminDashboard: ["admin-dashboard"] as const,
  adminPayments: ["admin-payments"] as const,
  adminSubscriptions: (status?: string) => ["admin-subscriptions", status] as const,
  adminVerifications: (status?: string) => ["admin-verifications", status] as const,
};  




