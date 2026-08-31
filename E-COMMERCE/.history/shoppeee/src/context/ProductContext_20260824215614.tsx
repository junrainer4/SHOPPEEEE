import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { INITIAL_PRODUCTS } from "../data/products";
import { Product } from "../types";

interface ProductContextValue {
  products: Product[];
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "nova_products_data";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing saved products:", e);
        }
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [loading, setLoading] = useState(false);

  const saveProducts = (updatedList: Product[]) => {
    setProducts(updatedList);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }
  };

  const getProductById = useCallback(
    (id: string) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    setLoading(true);
    await delay(600);
    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newProductItem = { ...product, id: newId };

    setProducts((prev) => {
      const updatedList = [...prev, newProductItem];
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }
      return updatedList;
    });

    setLoading(false);
  }, []);

  const updateProduct = useCallback(
    async (id: string, updates: Omit<Product, "id">) => {
      setLoading(true);
      await delay(600);
      setProducts((prev) => {
        const updatedList = prev.map((p) =>
          String(p.id) === String(id) ? { ...updates, id } : p
        );
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        }
        return updatedList;
      });
      setLoading(false);
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updatedList = prev.filter((p) => String(p.id) !== String(id));
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }
      return updatedList;
    });
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [products, loading, getProductById, addProduct, updateProduct, deleteProduct]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextValue => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return ctx;
};