import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const STORAGE_KEY = "@nova_products_data";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSavedProducts = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData !== null) {
          setProducts(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load products from storage:", error);
      }
    };

    loadSavedProducts();
  }, []);

  const saveProductsToStorage = async (newProductsList: Product[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProductsList));
    } catch (error) {
      console.error("Failed to save products to storage:", error);
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
      saveProductsToStorage(updatedList);
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
        saveProductsToStorage(updatedList);
        return updatedList;
      });
      setLoading(false);
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updatedList = prev.filter((p) => String(p.id) !== String(id));
      saveProductsToStorage(updatedList);
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