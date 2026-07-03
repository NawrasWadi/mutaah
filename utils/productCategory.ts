export const CATEGORY_ICON_MAP: Record<string, string> = {
  "تصوير": "photo_camera",
  "إلكترونيات": "devices",
  "أدوات كهربائية": "construction",
  "طاقة ومولدات": "bolt",
  "مركبات": "directions_car",
  "أثاث": "chair",
  "طبي": "medical_services",
  "ألعاب": "sports_esports",
  "أخرى": "inventory_2",
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICON_MAP[category] ?? "inventory_2";
}