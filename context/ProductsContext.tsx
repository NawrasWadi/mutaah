"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { PublicProduct } from "@/types/product";
import { mockProducts } from "@/mock/product";

interface ProductsContextType {
  products: PublicProduct[];
  addProduct: (product: PublicProduct) => void;
  updateProduct: (id: number, updates: Partial<PublicProduct>) => void;
  updateProductStatus: (id: number, status: PublicProduct["status"]) => void;
  removeProduct: (id: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<PublicProduct[]>(mockProducts);

  const addProduct = (product: PublicProduct) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: number, updates: Partial<PublicProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateProductStatus = (id: number, status: PublicProduct["status"]) => {
    updateProduct(id, { status });
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, updateProductStatus, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}