import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "../src/context/CartContext";
import { ProductProvider } from "../src/context/ProductContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProductProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerTintColor: "#212529" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{ title: "Product Details" }}
            />
            <Stack.Screen
              name="edit/[id]"
              options={{ title: "Edit Product" }}
            />
            <Stack.Screen name="add" options={{ title: "Add Product" }} />
            <Stack.Screen name="cart" options={{ title: "My Cart" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
          </Stack>
        </CartProvider>
      </ProductProvider>
    </SafeAreaProvider>
  );
}