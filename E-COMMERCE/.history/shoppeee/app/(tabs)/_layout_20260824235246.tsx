import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../src/context/ThemeContext";

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: isDarkMode ? "#868E96" : "#ADB5BD",
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#202426" : "#FFFFFF",
          borderTopColor: isDarkMode ? "#343A40" : "#E9ECEF",
        },
        headerStyle: {
          backgroundColor: isDarkMode ? "#202426" : "#FFFFFF",
        },
        headerTintColor: isDarkMode ? "#ECEDEE" : "#212529",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="person" size={22} color="#FF6B35" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: isDarkMode ? "#ECEDEE" : "#212529",
                  marginLeft: 6,
                }}
              >
                Profile
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}