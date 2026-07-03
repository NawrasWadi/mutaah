// src/services/product.service.ts
import { MOCK_MY_PRODUCTS } from "@/mock/my-items";
import { MyProduct} from "@/types/product";

export const getMyProducts = async (): Promise<MyProduct[]> => {
  // محاكاة جلب البيانات من API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MY_PRODUCTS), 500);
  });
};



