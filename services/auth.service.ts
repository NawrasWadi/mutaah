import { apiClient } from "@/api/client";
import { LoginFormData, RegisterFormData } from "@/types/auth";

export const authService = {
  login: async (data: LoginFormData) => {
    const res = await apiClient.post("/auth/login", {
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
    const res = await apiClient.post("/auth/register", payload);
    return res.data; // { message, access_token, token_type, user }
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
  forgotPassword: async (identifier: string) => {
  const res = await apiClient.post("/auth/forgot-password", { identifier });
  return res.data;
},

};