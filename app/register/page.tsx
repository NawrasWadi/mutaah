"use client";
import { useState } from "react";
import Link from "next/link";
import PhoneVerificationModal from "../../components/EmailVerificationModal";

export default function RegisterPage() {
  // ---------------------------------------------------------
  // [CONTENT/DATA] - بيانات المحافظات والمناطق
  // ---------------------------------------------------------
  const locationData: Record<string, string[]> = {
    "شمال غزة": ["جباليا", "مخيم جباليا", "بيت لاهيا", "بيت حانون", "العطاطرة", "مشروع بيت لاهيا", "عزبة عبد ربه", "أم النصر", "القرية البدوية"],
    "غزة": ["مدينة غزة", "الشجاعية", "الرمال", "الشيخ رضوان", "تل الهوى", "الزيتون", "الصبرة", "التفاح", "النصر", "الدرج", "الشيخ عجلين", "مخيم الشاطئ", "الزهراء", "المغراقة", "جحر الديك"],
    "الوسطى": ["دير البلح", "النصيرات", "مخيم النصيرات", "البريج", "مخيم البريج", "المغازي", "مخيم المغازي", "الزوايدة", "وادي غزة"],
    "خان يونس": ["خان يونس", "بني سهيلا", "عبسان الكبيرة", "عبسان الجديدة", "خزاعة", "القرارة", "السطر الشرقي", "السطر الغربي", "معن", "قيزان النجار", "قيزان أبو رشوان"],
    "رفح": ["رفح", "مخيم رفح", "تل السلطان", "الشوكة", "النصر", "مصبح", "خربة العدس", "حي الجنينة", "حي السلام"]
  };

  // [LOGIC] - حالات التحكم
  const [formData, setFormData] = useState({
  fullName: "",
  username: "",
  email: "",
  governorate: "",
  area: "",
  password: "",
  confirmPassword: "",
  terms: false
});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  
  const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.fullName.trim())
    newErrors.fullName = "الاسم الكامل مطلوب";
  else if (formData.fullName.trim().length < 3)
    newErrors.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";

  if (!formData.username.trim())
    newErrors.username = "اسم المستخدم مطلوب";
  else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
    newErrors.username = "اسم المستخدم: حروف وأرقام و _ فقط، بدون مسافات";

  if (!formData.email.trim())
    newErrors.email = "البريد الإلكتروني مطلوب";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";

  if (!formData.governorate)
    newErrors.governorate = "اختر المحافظة";

  if (!formData.area)
    newErrors.area = "اختر المنطقة";

  if (!formData.password)
    newErrors.password = "كلمة المرور مطلوبة";
  else if (formData.password.length < 6)
    newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

  if (!formData.confirmPassword)
    newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
  else if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";

  if (!formData.terms)
    newErrors.terms = "يجب الموافقة على الشروط";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f7] p-4 py-12">
      
      {/* // [DESIGN/STRUCTURE] - الكارد الرئيسي (Compact -2) */}
      <div className="bg-white w-full max-w-[360px] rounded-[35px] p-6 shadow-xl shadow-primary/5 border border-white/50">
        
        {/* اللوجو */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-black italic tracking-tighter bg-gradient-to-r from-primary to-[#43a047] bg-clip-text text-transparent">
            مُتاح
          </h1>
        </div>

        {/* سويتش الدخول/التسجيل */}
        <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
          <Link href="/login" className="flex-1 py-2 text-center text-gray-400 text-[12px] font-bold hover:text-primary transition-colors">
            تسجيل الدخول
          </Link>
          <button className="flex-1 py-2 rounded-[10px] bg-primary text-white text-[12px] font-bold shadow-sm">
            إنشاء حساب
          </button>
        </div>

        <form className="space-y-3 text-right">
          
          {/* الاسم الكامل */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-500 mr-1">الاسم الكامل</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">badge</span>
              <input 
                type="text" 
                placeholder="محمد أحمد الخطيب"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all" 
              />           
          </div>
          </div>
          {errors.fullName && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.fullName}</p>}


          {/* اسم المستخدم */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-500 mr-1">اسم المستخدم</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">alternate_email</span>
              <input 
                type="text" 
                placeholder="أدخل اسم المستخدم "
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all" 
              />   
          </div>
          </div>
          {errors.username && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.username}</p>}


          {/* البريد الإلكتروني */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-500 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">mail</span>
              <input 
                type="email" 
                placeholder="example@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all" 
              />
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.email}</p>}


{/* المنطقة */}
<div className="space-y-1">
  <label className="block text-[11px] font-bold text-gray-500 mr-1">المنطقة</label>
  <div className="space-y-2">
    <div className="relative">
      <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">location_city</span>
      <select 
        className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary"
        value={formData.governorate}
        onChange={(e) => setFormData({...formData, governorate: e.target.value, area: ""})}
      >
        <option value="">اختر المحافظة</option>
        {Object.keys(locationData).map((gov) => <option key={gov} value={gov}>{gov}</option>)}
      </select>
      <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
    </div>
    {errors.governorate && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.governorate}</p>}

    <div className="relative">
      <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">location_on</span>
      <select 
        className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary disabled:opacity-50"
        value={formData.area}
        onChange={(e) => setFormData({...formData, area: e.target.value})}
        disabled={!formData.governorate}
      >
        <option value="">اختر المنطقة / الحي</option>
        {formData.governorate && locationData[formData.governorate].map((area) => <option key={area} value={area}>{area}</option>)}
      </select>
      <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
    </div>
    {errors.area && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.area}</p>}

  </div>
</div>

          {/* كلمة المرور */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-500 mr-1">كلمة المرور</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">lock</span>
              <input type={showPass ? "text" : "password"} placeholder="••••••••"  value={formData.password}
  onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pr-11 pl-11 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-rounded text-[16px]">{showPass ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>
          {errors.password && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.password}</p>}


          {/* تأكيد كلمة المرور - الحقل الجديد */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-gray-500 mr-1">تأكيد كلمة المرور</label>
            <div className="relative group">
              <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">verified_user</span>
              <input type={showConfirmPass ? "text" : "password"} placeholder="أعد كتابة كلمة المرور"   value={formData.confirmPassword}
  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pr-11 pl-11 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] outline-none focus:bg-white focus:border-primary transition-all" />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-rounded text-[16px]">{showConfirmPass ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.confirmPassword}</p>}


          {/* شروط الاستخدام والخصوصية مع روابط فعالة */}
          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" id="terms" className="mt-0.5 accent-primary h-3.5 w-3.5 cursor-pointer" />
            <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight cursor-pointer select-none">
              أوافق على <Link href="/terms" className="text-primary font-bold hover:underline">شروط الاستخدام</Link> و <Link href="/privacy" className="text-primary font-bold hover:underline">سياسة الخصوصية</Link>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-[10px] mt-1 text-right">{errors.terms}</p>}


          {/* زر إنشاء الحساب */}
          <button type="button" 
            onClick={() => { if (validate()) setIsVerifyModalOpen(true); } }// نفتح المودال هنا
            className="w-full py-3.5 mt-2 rounded-[18px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all">
            إنشاء حساب
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-[11px] font-medium">
            لديك حساب بالفعل؟ <Link href="/login" className="text-primary font-black hover:underline mr-1 transition-all">تسجيل الدخول</Link>
          </p>
        </div>

      </div>
        <PhoneVerificationModal 
        isOpen={isVerifyModalOpen} 
        onClose={() => setIsVerifyModalOpen(false)} 
      />
    </div>
  );
}