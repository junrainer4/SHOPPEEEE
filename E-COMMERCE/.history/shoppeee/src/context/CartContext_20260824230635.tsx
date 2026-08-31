import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CartItem, Product } from "../types";

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => String(item.product.id) === String(product.id)
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99),
        };
        return updated;
      }

      return [...prevCart, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string | number) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
  }, []);

  const updateQuantity = useCallback((productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        String(item.product.id) === String(productId)
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};