import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "../../src/context/ProductContext";
import { Product } from "../../src/types";

type SortKey = "default" | "priceAsc" | "priceDesc" | "rating";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Featured" },
  { key: "priceAsc", label: "Price: Low to High" },
  { key: "priceDesc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { products } = useProducts();
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
      style={styles.row}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.rowImage} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowCategory}>{item.category}</Text>
        <View style={styles.rowFooter}>
          <Text style={styles.rowPrice}>₱{item.price.toLocaleString()}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CED4DA" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>
          Browse and sort every product in the catalog.
        </Text>
      </View>

      <FlatList
        horizontal
        data={SORT_OPTIONS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.sortChip,
              sortKey === item.key && styles.sortChipActive,
            ]}
            onPress={() => setSortKey(item.key)}
          >
            <Text
              style={[
                styles.sortChipText,
                sortKey === item.key && styles.sortChipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Pressable style={styles.fab} onPress={() => router.push("/add")}>
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#212529",
  },
  subtitle: {
    fontSize: 13,
    color: "#868E96",
    marginTop: 2,
  },
  sortRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
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
  rowImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#EEE",
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
