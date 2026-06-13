"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function EmailVerificationModal({ isOpen, onClose, email = "example@email.com" }: ModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white animate-in zoom-in-95 duration-300">
        
        {/* أيقونة البريد */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4">
            <span className="material-symbols-rounded text-[32px]">mark_email_unread</span>
          </div>
          <h2 className="text-[18px] font-black text-gray-800 mb-2">تحقق من بريدك</h2>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            أرسلنا كود مكوّن من <strong className="text-gray-600">6 أرقام</strong> إلى<br/>
            <strong className="text-primary font-bold text-[12px]">{email}</strong>
          </p>
        </div>

        {/* مربعات الـ OTP */}
        <div className="flex gap-2 justify-center mb-6" dir="ltr">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className={`w-10 h-12 text-center text-lg font-bold rounded-2xl border transition-all outline-none
                ${i === 3 ? 'border-primary bg-white shadow-[0_0_0_3px_rgba(0,167,157,0.1)]' : 'border-gray-100 bg-gray-50 focus:border-primary'}
              `}
              defaultValue={i === 0 ? "5" : i === 1 ? "9" : i === 2 ? "2" : ""}
            />
          ))}
        </div>

        {/* عداد الوقت وإعادة الإرسال */}
        <div className="text-center mb-6">
          <div className="text-[11px] text-gray-400 mb-1">
            ينتهي الكود بعد <strong className="text-primary font-jakarta">02:15</strong>
          </div>
          <button className="text-[12px] text-gray-500 font-medium hover:opacity-80 transition-opacity">
            لم يصلك الكود؟ <span className="text-primary font-bold hover:underline cursor-pointer">إعادة الإرسال</span>
          </button>
        </div>

        {/* زر التأكيد */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3.5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          تأكيد البريد
        </button>

      </div>
    </div>
  );
}