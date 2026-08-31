import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const getProductById = useCallback(
    (id: string) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    setLoading(true);
    await delay(600);
    setProducts((prev) => {
      const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      return [...prev, { ...product, id: newId }];
    });
    setLoading(false);
  }, []);

  const updateProduct = useCallback(
    async (id: string, updates: Omit<Product, "id">) => {
      setLoading(true);
      await delay(600);
      setProducts((prev) =>
        prev.map((p) => (String(p.id) === String(id) ? { ...updates, id } : p))
      );
      setLoading(false);
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
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