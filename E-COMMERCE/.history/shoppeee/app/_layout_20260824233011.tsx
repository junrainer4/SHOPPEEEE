import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { CartProvider } from "../src/context/CartContext";
import { ProductProvider } from "../src/context/ProductContext";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";

const RootLayoutNav = () => {
  const { isDarkMode } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? "#202426" : "#FFFFFF",
        },
        headerTintColor: isDarkMode ? "#ECEDEE" : "#212529",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="cart"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="cart" size={22} color="#FF6B35" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: isDarkMode ? "#ECEDEE" : "#212529",
                  marginLeft: 6,
                }}
              >
                My Cart
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen name="product/[id]" options={{ title: "Product Details" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Product" }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <RootLayoutNav />
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}