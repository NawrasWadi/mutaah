export const queryKeys = {
  profile: ["profile"] as const,
  products: (filters?: Record<string, unknown>) => ["products", filters] as const,
  product: (id: number) => ["product", id] as const,
  myProducts: ["my-products"] as const,
  notifications: ["notifications"] as const,
  plans: ["plans"] as const,
  currentPlan: ["current-plan"] as const,
};