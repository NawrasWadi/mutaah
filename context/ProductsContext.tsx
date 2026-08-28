"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { PublicProduct } from "@/types/product";
import { mockProducts } from "@/mock/product";

interface ProductsContextType {
  products: PublicProduct[];
  addProduct: (product: PublicProduct) => void;
  updateProduct: (id: string, updates: Partial<PublicProduct>) => void;
  updateProductStatus: (id: string, status: PublicProduct["status"]) => void;
  removeProduct: (id: string) => void;
  markAsRented: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<PublicProduct[]>(mockProducts);

  const addProduct = (product: PublicProduct) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<PublicProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateProductStatus = (id: string, status: PublicProduct["status"]) => {
    updateProduct(id, { status });
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const markAsRented = (id: string) => {
  updateProduct(id, { is_currently_rented: true });
};

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, updateProductStatus, removeProduct,markAsRented  }}>
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