import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { CartProvider } from "../src/context/CartContext";
import { OrderProvider } from "../src/context/OrderContext";
import { ProductProvider } from "../src/context/ProductContext";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";

const RootLayoutNav = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? "#202426" : "#FFFFFF",
        },
        headerTintColor: isDarkMode ? "#ECEDEE" : "#212529",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="cart"
        options={{
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/(tabs)")
              }
              style={{ paddingRight: 12, paddingVertical: 6 }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDarkMode ? "#ECEDEE" : "#212529"}
              />
            </Pressable>
          ),
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
      <Stack.Screen
        name="add"
        options={{
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/(tabs)")
              }
              style={{ paddingRight: 12, paddingVertical: 6 }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDarkMode ? "#ECEDEE" : "#212529"}
              />
            </Pressable>
          ),
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="add-circle" size={22} color="#FF6B35" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: isDarkMode ? "#ECEDEE" : "#212529",
                  marginLeft: 6,
                }}
              >
                Add Product
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Product" }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <RootLayoutNav />
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}