import { apiClient } from "@/api/client";
import { LoginFormData, RegisterFormData } from "@/types/auth";
import {UserProfile} from "@/types/auth";
import {ResetPasswordFormData } from "@/types/auth";
export const authService = {
  login: async (data: LoginFormData) => {
    const res = await apiClient.post("login", {
      login: data.identifier,
      password: data.password,
    });
    return res.data; // { message, access_token, token_type, user }
  },

  register: async (data: RegisterFormData) => {
    const { confirmPassword, terms, ...rest } = data;
    const payload = {
      ...rest,
      password_confirmation: confirmPassword,
      terms,
    };
    const res = await apiClient.post("register", payload);
    return res.data; // { message, access_token, token_type, user }
  },

  logout: async () => {
    await apiClient.post("logout");
  },

  // ✅ مصححة: الرد { user: {...} } مباشرة، بدون تغليف {success, data}
// المعتاد بباقي الـ endpoints — هذا الـ endpoint استثناء مؤكد من اختبار فعلي
getMe: async (): Promise<UserProfile> => {
  const res = await apiClient.get("profile");
  return res.data.user;
},

  forgotPassword: async (email: string) => {
    const res = await apiClient.post("forgot-password", { email });
    return res.data;
  },

  // 🆕 جديدة بالكامل
  resetPassword: async (data: ResetPasswordFormData) => {
    const res = await apiClient.post("reset-password", data);
    return res.data;
  },
};