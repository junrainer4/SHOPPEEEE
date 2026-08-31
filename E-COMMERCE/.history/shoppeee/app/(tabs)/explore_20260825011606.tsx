import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";
import { Product } from "../../src/types";

type SortKey = "default" | "priceAsc" | "priceDesc" | "rating";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Featured" },
  { key: "priceAsc", label: "Cheapest" },
  { key: "priceDesc", label: "Most expensive" },
  { key: "rating", label: "Top Rated" },
];

const App = () => {
  const router = useRouter();
  const { products } = useProducts();
  const { isDarkMode } = useTheme();
  const [sortKey, setSortKey] = useState<SortKey>("default");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortKey) {
      case "priceAsc":
        return list.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [products, sortKey]);

  const renderItem = ({ item }: { item: Product }) => (
    <Pressable
      style={[styles.row, isDarkMode && styles.darkRow]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.image }}
        style={[styles.rowImage, isDarkMode && styles.darkRowImage]}
      />
      <View style={styles.rowInfo}>
        <Text
          style={[styles.rowName, isDarkMode && styles.darkText]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={[styles.rowCategory, isDarkMode && styles.darkMutedText]}>
          {item.category}
        </Text>
        <View style={styles.rowFooter}>
          <Text style={styles.rowPrice}>₱{item.price.toLocaleString()}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text
              style={[styles.ratingText, isDarkMode && styles.darkMutedText]}
            >
              {item.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDarkMode ? "#495057" : "#CED4DA"}
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Centered Top Header aligned with My Cart */}
      <View style={[styles.topHeader, isDarkMode && styles.darkHeader]}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="compass" size={22} color="#FF6B35" />
          <Text style={[styles.headerTitleText, isDarkMode && styles.darkText]}>
            Explore
          </Text>
        </View>
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.sortChip,
              isDarkMode && styles.darkSortChip,
              sortKey === item.key && styles.sortChipActive,
            ]}
            onPress={() => setSortKey(item.key)}
          >
            <Text
              style={[
                styles.sortChipText,
                isDarkMode && styles.darkSortChipText,
                sortKey === item.key && styles.sortChipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Pressable style={styles.fab} onPress={() => router.push("/add")}>
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  darkContainer: {
    backgroundColor: "#151718",
  },
  topHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 12, // Matches Explore topHeader padding
  backgroundColor: "#FFFFFF",
  borderBottomWidth: 1,
  borderBottomColor: "#E9ECEF",
},
  darkHeader: {
    backgroundColor: "#202426",
    borderBottomColor: "#343A40",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#212529",
    marginLeft: 6,
  },
  darkText: {
    color: "#ECEDEE",
  },
  darkMutedText: {
    color: "#AEB5B8",
  },
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    flexShrink: 0,
  },
  darkSortChip: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
  },
  sortChipActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  sortChipText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "500",
  },
  darkSortChipText: {
    color: "#ECEDEE",
  },
  sortChipTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 90,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  darkRow: {
    backgroundColor: "#202426",
  },
  rowImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },
  darkRowImage: {
    backgroundColor: "#151718",
  },
  rowInfo: {
    flex: 1,
    marginLeft: 10,
  },
  rowName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212529",
  },
  rowCategory: {
    fontSize: 11,
    color: "#868E96",
    marginTop: 2,
  },
  rowFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  rowPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF6B35",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 11,
    color: "#495057",
    marginLeft: 2,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});