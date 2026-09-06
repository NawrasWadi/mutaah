"use client";
import { useState, useEffect } from "react";
import { tokenStorage } from "@/utils/tokenStorage";

export function useUserRole() {
  // القيمة الابتدائية محسوبة مباشرة هون (lazy initializer) — مش جوا effect
  const [role, setRole] = useState<string | null>(() => tokenStorage.getRole());

  useEffect(() => {
    const handleChange = () => setRole(tokenStorage.getRole());
    window.addEventListener("auth-token-changed", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("auth-token-changed", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  return role;
}