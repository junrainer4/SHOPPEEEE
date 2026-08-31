import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../src/context/CartContext";
import { ProductProvider } from "../src/context/ProductContext";

function ScreenHeader({
  navigation,
  title,
}: {
  navigation: { goBack: () => void };
  title: string;
}) {
  return (
    <SafeAreaView edges={["top"]} style={styles.header}>
      <View style={styles.headerContent}>
        <Pressable
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#212529" />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.divider} />
    </SafeAreaView>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <ProductProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerTintColor: "#212529" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{
                header: ({ navigation }) => (
                  <ScreenHeader navigation={navigation} title="Product Details" />
                ),
              }}
            />
            <Stack.Screen
              name="edit/[id]"
              options={{ title: "Edit Product" }}
            />
            <Stack.Screen name="add" options={{ title: "Add New Product" }} />
            <Stack.Screen
              name="cart"
              options={{
                header: ({ navigation }) => (
                  <ScreenHeader navigation={navigation} title="My Cart" />
                ),
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                header: ({ navigation }) => (
                  <ScreenHeader navigation={navigation} title="Profile" />
                ),
              }}
            />
          </Stack>
        </CartProvider>
      </ProductProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
  },
  headerContent: {
    alignItems: "center",
    height: 64,
    justifyContent: "center",
  },
  backButton: {
    left: 16,
    padding: 4,
    position: "absolute",
  },
  headerTitle: {
    color: "#212529",
    fontSize: 18,
    fontWeight: "700",
  },
  divider: {
    backgroundColor: "#E9ECEF",
    height: 3,
  },
});