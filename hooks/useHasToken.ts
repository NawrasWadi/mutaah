"use client";
import { useState, useEffect } from "react";
import { tokenStorage } from "@/utils/tokenStorage";

export function useHasToken() {
  // القيمة الابتدائية محسوبة مباشرة هون (lazy initializer) — مش جوا effect
  const [hasToken, setHasToken] = useState(() => !!tokenStorage.getAccessToken());

  useEffect(() => {
    const handleChange = () => setHasToken(!!tokenStorage.getAccessToken());
    window.addEventListener("auth-token-changed", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("auth-token-changed", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  return hasToken;
}