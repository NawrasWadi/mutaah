import { ProductStatus, DayAvailability } from "@/types/product";
import { getCategoryIcon } from "@/utils/productCategory";

// صور Placeholder من Lorem Picsum — مخصصة للاستخدام كنماذج أولية، قابلة للاستبدال لاحقاً بصور حقيقية مرفوعة من المالك
const img = (id: number) => `https://picsum.photos/id/${id}/600/450`;

export interface ProductRecord {
  id: number;
  title: string;
  category: string;
  price_per_hour: number;
  deposit_amount: number;
  status: ProductStatus;
  governorate: string;
  district: string;
  owner_full_name: string;
  owner_identity_status: "accepted" | "pending" | "rejected";
  description: string;
  images: string[]; // 4 صور — أول وحدة تُستخدم بالداشبورد، الأربعة بصفحة التفاصيل
  icon: string; // أيقونة احتياطية (fallback) لو الصورة ما حمّلت
  rental_count: number;
  rating?: number;
  is_currently_rented?: boolean;
  expiry_date?: string;
  available_dates: DayAvailability[];
}

export const PRODUCTS_DATA: ProductRecord[] = [
  {
    id: 1,
    title: "كاميرا سوني A7 III",
    category: "تصوير",
    price_per_hour: 25,
    deposit_amount: 300,
    status: "active",
    governorate: "غزة",
    district: "الرمال",
    owner_full_name: "أحمد محمد سالم",
    owner_identity_status: "accepted",
    description: "كاميرا احترافية مناسبة للتصوير الفوتوغرافي والفيديو. مزودة بعدسة 28-70mm، بطاريتين وشاحن.",
    images: [img(250), img(251), img(252), img(253)],
    icon: "photo_camera",
    rental_count: 12,
    rating: 4.9,
    available_dates: [
      { date: "2025-05-01", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
      { date: "2025-05-04", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
      { date: "2025-05-05", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
      { date: "2025-05-06", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false },
      { date: "2025-05-07", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: true },
      { date: "2025-05-08", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
      { date: "2025-05-09", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
      { date: "2025-05-10", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: true },
      { date: "2025-05-13", start_time: "10:00", end_time: "13:00", is_all_day: false, is_booked: false },
      { date: "2025-05-14", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 2,
    title: "مولد كهرباء 5KW",
    category: "طاقة ومولدات",
    price_per_hour: 40,
    deposit_amount: 500,
    status: "active",
    governorate: "غزة",
    district: "جباليا",
    owner_full_name: "محمد خالد",
    owner_identity_status: "accepted",
    description: "مولد كهرباء بقدرة 5 كيلوواط، مناسب للمناسبات والطوارئ، يعمل بالبنزين.",
    images: [img(300), img(301), img(302), img(303)],
    icon: "bolt",
    rental_count: 8,
    is_currently_rented: true,
    expiry_date: "15 مايو",
    available_dates: [
      { date: "2025-05-02", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false },
      { date: "2025-05-10", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: true },
    ],
  },
  {
    id: 3,
    title: "مثقاب بوش كهربائي",
    category: "أدوات كهربائية",
    price_per_hour: 10,
    deposit_amount: 100,
    status: "frozen",
    governorate: "غزة",
    district: "الشجاعية",
    owner_full_name: "خالد أبو سيف",
    owner_identity_status: "accepted",
    description: "مثقاب كهربائي بقوة عالية، مناسب لأعمال البناء والتركيب المنزلي.",
    images: [img(20), img(21), img(22), img(23)],
    icon: "construction",
    rental_count: 3,
    available_dates: [
      { date: "2025-05-03", start_time: "08:00", end_time: "18:00", is_all_day: false, is_booked: false },
      { date: "2025-05-12", start_time: "08:00", end_time: "18:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 4,
    title: "لابتوب ديل XPS 15",
    category: "إلكترونيات",
    price_per_hour: 30,
    deposit_amount: 250,
    status: "active",
    governorate: "غزة",
    district: "النصر",
    owner_full_name: "سامر يوسف",
    owner_identity_status: "accepted",
    description: "لابتوب بمواصفات عالية، مناسب للتصميم والبرمجة والاستخدام المكتبي المكثف.",
    images: [img(60), img(61), img(62), img(63)],
    icon: "laptop",
    rental_count: 5,
    available_dates: [
      { date: "2025-05-02", start_time: "09:00", end_time: "21:00", is_all_day: false, is_booked: false },
      { date: "2025-05-03", start_time: "09:00", end_time: "21:00", is_all_day: false, is_booked: false },
      { date: "2025-05-11", start_time: "09:00", end_time: "21:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 5,
    title: "سيارة هيونداي 2022",
    category: "مركبات",
    price_per_hour: 120,
    deposit_amount: 1500,
    status: "active",
    governorate: "غزة",
    district: "الرمال",
    owner_full_name: "وائل حماد",
    owner_identity_status: "accepted",
    description: "سيارة سيدان موديل 2022، صيانة دورية، مناسبة للرحلات والمناسبات.",
    images: [img(111), img(112), img(113), img(114)],
    icon: "directions_car",
    rental_count: 6,
    is_currently_rented: true,
    expiry_date: "20 مايو",
    available_dates: [
      { date: "2025-05-15", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: true },
      { date: "2025-05-22", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false },
    ],
  },
  {
    id: 6,
    title: "آيفون 14 برو",
    category: "إلكترونيات",
    price_per_hour: 18,
    deposit_amount: 200,
    status: "active",
    governorate: "غزة",
    district: "الزيتون",
    owner_full_name: "ليان عودة",
    owner_identity_status: "accepted",
    description: "آيفون 14 برو بحالة ممتازة، مناسب للتصوير والاستخدام اليومي.",
    images: [img(160), img(161), img(162), img(163)],
    icon: "smartphone",
    rental_count: 9,
    available_dates: [
      { date: "2025-05-04", start_time: "08:00", end_time: "22:00", is_all_day: false, is_booked: false },
      { date: "2025-05-05", start_time: "08:00", end_time: "22:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 7,
    title: "ألواح شمسية 400W",
    category: "طاقة ومولدات",
    price_per_hour: 25,
    deposit_amount: 350,
    status: "active",
    governorate: "غزة",
    district: "رفح",
    owner_full_name: "عمر الفرا",
    owner_identity_status: "accepted",
    description: "لوح شمسي بقدرة 400 واط، مناسب لتشغيل الأجهزة الأساسية أثناء انقطاع الكهرباء.",
    images: [img(180), img(181), img(182), img(183)],
    icon: "solar_power",
    rental_count: 4,
    available_dates: [
      { date: "2025-05-06", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false },
      { date: "2025-05-19", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false },
    ],
  },
  {
    id: 8,
    title: "جهاز ضغط طبي",
    category: "طبي",
    price_per_hour: 15,
    deposit_amount: 150,
    status: "active",
    governorate: "غزة",
    district: "الشمال",
    owner_full_name: "هبة سلامة",
    owner_identity_status: "accepted",
    description: "جهاز قياس ضغط دم رقمي دقيق، مناسب للاستخدام المنزلي.",
    images: [img(200), img(201), img(202), img(203)],
    icon: "medical_services",
    rental_count: 2,
    available_dates: [
      { date: "2025-05-08", start_time: "08:00", end_time: "20:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 9,
    title: "طائرة درون DJI",
    category: "تصوير",
    price_per_hour: 70,
    deposit_amount: 600,
    status: "active",
    governorate: "غزة",
    district: "تل الهوا",
    owner_full_name: "يوسف النجار",
    owner_identity_status: "accepted",
    description: "درون احترافي بجودة تصوير 4K، مناسب للفيديوهات الجوية والمناسبات.",
    images: [img(219), img(220), img(221), img(222)],
    icon: "videocam",
    rental_count: 11,
    is_currently_rented: true,
    expiry_date: "16 مايو",
    available_dates: [
      { date: "2025-05-16", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: true },
      { date: "2025-05-25", start_time: "00:00", end_time: "23:59", is_all_day: true, is_booked: false },
    ],
  },
  {
    id: 10,
    title: "شاشة سامسونج 55",
    category: "إلكترونيات",
    price_per_hour: 35,
    deposit_amount: 300,
    status: "active",
    governorate: "غزة",
    district: "الشيخ رضوان",
    owner_full_name: "رنا زقوت",
    owner_identity_status: "accepted",
    description: "شاشة سمارت 55 إنش دقة 4K، مناسبة للعروض والمناسبات.",
    images: [img(230), img(231), img(232), img(233)],
    icon: "tv",
    rental_count: 7,
    available_dates: [
      { date: "2025-05-09", start_time: "10:00", end_time: "22:00", is_all_day: false, is_booked: false },
      { date: "2025-05-17", start_time: "10:00", end_time: "22:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 11,
    title: "طابعة ليزر HP",
    category: "إلكترونيات",
    price_per_hour: 12,
    deposit_amount: 100,
    status: "active",
    governorate: "غزة",
    district: "النصر",
    owner_full_name: "باسل حرب",
    owner_identity_status: "accepted",
    description: "طابعة ليزر أبيض وأسود، سريعة وموفرة للحبر، مناسبة للطباعة الكثيفة.",
    images: [img(24), img(25), img(26), img(27)],
    icon: "print",
    rental_count: 3,
    available_dates: [
      { date: "2025-05-07", start_time: "08:00", end_time: "18:00", is_all_day: false, is_booked: false },
    ],
  },
  {
    id: 12,
    title: "ميكروسكوب ديجيتال",
    category: "طبي",
    price_per_hour: 20,
    deposit_amount: 200,
    status: "active",
    governorate: "غزة",
    district: "الشجاعية",
    owner_full_name: "دانا شحادة",
    owner_identity_status: "accepted",
    description: "ميكروسكوب رقمي بدقة تكبير عالية، مناسب للأبحاث والدراسة.",
    images: [img(48), img(49), img(50), img(51)],
    icon: "science",
    rental_count: 1,
    available_dates: [
      { date: "2025-05-20", start_time: "09:00", end_time: "17:00", is_all_day: false, is_booked: false },
    ],
  },
];

// دالة مساعدة موحّدة — أيقونة المنتج: الأيقونة المخصصة إن وجدت، وإلا أيقونة التصنيف الافتراضية
export function resolveProductIcon(record: ProductRecord): string {
  return record.icon || getCategoryIcon(record.category);
}