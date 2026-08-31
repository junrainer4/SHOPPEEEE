import React, { createContext, useContext, useState } from "react";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  status: "Processing" | "Delivered" | "Shipped";
  items: OrderItem[];
  totalPrice: number;
}

interface OrderContextType {
  orders: OrderRecord[];
  addOrder: (items: OrderItem[], totalPrice: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const addOrder = (items: OrderItem[], totalPrice: number) => {
    const newOrder: OrderRecord = {
      id: `#NOV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: "Just now",
      status: "Processing",
      items,
      totalPrice,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};