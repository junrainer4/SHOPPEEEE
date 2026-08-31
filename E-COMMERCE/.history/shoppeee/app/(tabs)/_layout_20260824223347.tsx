import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../src/context/CartContext";
import { ProductProvider } from "../src/context/ProductContext";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext";

function ScreenHeader({
  navigation,
  title,
}: {
  navigation: { goBack: () => void };
  title: string;
}) {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.header, isDarkMode && styles.darkHeader]}
    >
      <View style={styles.headerContent}>
        <Pressable
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? "#ECEDEE" : "#212529"}
          />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkTitle]}>
          {title}
        </Text>
      </View>
      <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
    </SafeAreaView>
  );
}

function MainLayout() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack screenOptions={{ headerTintColor: isDarkMode ? "#ECEDEE" : "#212529" }}>
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
          options={{
            header: ({ navigation }) => (
              <ScreenHeader navigation={navigation} title="Edit Product" />
            ),
          }}
        />
        <Stack.Screen
          name="add"
          options={{
            header: ({ navigation }) => (
              <ScreenHeader navigation={navigation} title="Add New Product" />
            ),
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            header: ({ navigation }) => (
              <ScreenHeader navigation={navigation} title="My Cart" />
            ),
          }}
        />
      </Stack>
    </>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ProductProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </ProductProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
  },
  darkHeader: {
    backgroundColor: "#202426",
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
  darkTitle: {
    color: "#ECEDEE",
  },
  divider: {
    backgroundColor: "#E9ECEF",
    height: 1,
  },
  darkDivider: {
    backgroundColor: "#343A40",
  },
});