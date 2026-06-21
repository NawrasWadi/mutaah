export interface Product {
  name: string;
  loc: string;
  price: string;
  unit: string;
  icon: string;
  status: string;
}

export const products: Product[] = [
  { name: "كاميرا سوني A7 III", loc: "غزة — الرمال", price: "25", unit: "ساعة", icon: "photo_camera", status: "متاح" },
  { name: "مولد كهرباء 5KW", loc: "غزة — جباليا", price: "40", unit: "يوم", icon: "bolt", status: "متاح" },
  { name: "لابتوب ديل XPS 15", loc: "غزة — النصر", price: "30", unit: "ساعة", icon: "laptop", status: "مؤجر" },
  { name: "مثقاب بوش كهربائي", loc: "غزة — الشجاعية", price: "10", unit: "ساعة", icon: "construction", status: "متاح" },
  { name: "آيفون 14 برو", loc: "غزة — الزيتون", price: "18", unit: "ساعة", icon: "smartphone", status: "متاح" },
  { name: "سيارة هيونداي 2022", loc: "غزة — الرمال", price: "120", unit: "يوم", icon: "directions_car", status: "متاح" },
  { name: "ألواح شمسية 400W", loc: "غزة — رفح", price: "25", unit: "يوم", icon: "solar_power", status: "متاح" },
  { name: "جهاز ضغط طبي", loc: "غزة — الشمال", price: "15", unit: "يوم", icon: "medical_services", status: "مجمد" },
  { name: "طائرة درون DJI", loc: "غزة — تل الهوا", price: "70", unit: "يوم", icon: "videocam", status: "متاح" },
  { name: "شاشة سامسونج 55", loc: "غزة — الشيخ رضوان", price: "35", unit: "يوم", icon: "tv", status: "متاح" },
  { name: "طابعة ليزر HP", loc: "غزة — النصر", price: "12", unit: "يوم", icon: "print", status: "متاح" },
  { name: "ميكروسكوب ديجيتال", loc: "غزة — الشجاعية", price: "20", unit: "يوم", icon: "science", status: "متاح" },
];
