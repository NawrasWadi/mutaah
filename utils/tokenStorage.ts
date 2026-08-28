const ACCESS_TOKEN_KEY = "access_token";
const USER_ROLE_KEY = "user_role";

const notifyTokenChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-token-changed"));
  }
};

export const tokenStorage = {
  setToken: (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    notifyTokenChange();
  },
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  // ⭐ جديد — GET /profile لا يرجع role إطلاقاً (مؤكد من Postman)،
  // بعكس POST /login التي ترجعه. نخزّنها هنا وقت تسجيل الدخول فقط.
  setRole: (role: string) => {
    localStorage.setItem(USER_ROLE_KEY, role);
  },
  getRole: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_ROLE_KEY);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    notifyTokenChange();
  },
};