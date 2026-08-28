// المفاتيح مطابقة حرفياً لتوثيق الـ API — هاي القيم يلي بترسل/تستقبل من الباك
export const CATEGORY_ICON_MAP: Record<string, string> = {
  cameras: "photo_camera",
  clothes: "checkroom",
  electronics: "devices",
  items: "inventory_2",
  camping: "cabin",
  "medical items": "medical_services",
  instruments: "piano",
  books: "menu_book",
  "house items": "chair",
};

// للعرض بالـ UI فقط — لا ترسل هذه القيم للباك أبداً
export const CATEGORY_LABELS: Record<string, string> = {
  cameras: "كاميرات",
  clothes: "ملابس",
  electronics: "إلكترونيات",
  items: "أغراض عامة",
  camping: "تخييم",
  "medical items": "أدوات طبية",
  instruments: "آلات موسيقية",
  books: "كتب",
  "house items": "أغراض منزلية",
};

export const PRODUCT_CATEGORIES = Object.keys(CATEGORY_ICON_MAP) as readonly string[];

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICON_MAP[category] ?? "inventory_2";
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}