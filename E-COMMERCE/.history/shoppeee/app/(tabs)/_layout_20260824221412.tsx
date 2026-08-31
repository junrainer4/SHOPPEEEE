import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

const App = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#ADB5BD",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarIconStyle: styles.tabIcon,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "compass" : "compass-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default App;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    height: Platform.OS === "web" ? 64 : 58,
    paddingTop: 6,
    paddingBottom: Platform.OS === "web" ? 8 : 6,
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
  },
});