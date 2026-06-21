"use client";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    // [DESIGN/STRUCTURE] - طبقة التعتيم الخلفية (Overlay)
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* إغلاق عند الضغط في أي مكان خارج الكارد */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* // [DESIGN/STRUCTURE] - الكارد الرئيسي (Compact -2) */}
      <div className="relative bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white animate-in zoom-in-95 duration-300">
        
        {/* أيقونة القفل */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4">
            <span className="material-symbols-rounded text-[32px]">lock_reset</span>
          </div>
          <h2 className="text-[18px] font-black text-gray-800 mb-2">استعادة كلمة السر</h2>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            أرسلنا كود مكوّن من <strong className="text-gray-600">6 أرقام</strong> إلى<br/>
            <strong className="text-primary font-bold text-[12px]" dir="ltr">+970 59X XXX XXXX</strong>
          </p>
        </div>

        {/* // [DESIGN/STRUCTURE] - مربعات الـ OTP */}
        <div className="flex gap-2 justify-center mb-6" dir="ltr">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <input 
              key={i}
              type="text" 
              maxLength={1}
              className={`w-10 h-12 text-center text-lg font-bold rounded-2xl border transition-all outline-none
                ${i === 3 ? 'border-primary bg-white shadow-[0_0_0_3px_rgba(0,167,157,0.1)]' : 'border-gray-100 bg-gray-50 focus:border-primary'}
              `}
              defaultValue={i === 0 ? "3" : i === 1 ? "7" : ""}
            />
          ))}
        </div>

        {/* عداد الوقت وإعادة الإرسال */}
        <div className="text-center mb-6">
          <div className="text-[11px] text-gray-400 mb-1">
            ينتهي الكود بعد <strong className="text-primary">04:32</strong>
          </div>
          <button className="text-[12px] text-gray-500 font-medium">
            لم يصلك الكود؟ <span className="text-primary font-bold hover:underline cursor-pointer">إعادة الإرسال</span>
          </button>
        </div>

        {/* زر التأكيد */}
        <button className="w-full py-3.5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all">
          تأكيد الكود
        </button>

        {/* العودة لتسجيل الدخول */}
        <button 
          onClick={onClose}
          className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 text-[12px] font-bold hover:text-primary transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
          العودة لتسجيل الدخول
        </button>

      </div>
    </div>
  );
}