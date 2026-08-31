import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../src/components/ProductCard";
import { CATEGORIES } from "../../src/data/products";
import { useCart } from "../../src/context/CartContext";
import { useProducts } from "../../src/context/ProductContext";

const App = () => {
  const router = useRouter();
  const { products } = useProducts();
  const { totalItems } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/profile")}>
          <View style={styles.brand}>
            <Ionicons name="cart" size={28} color="#FF6B35" />
            <Text style={styles.title}>Nova</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.cartIconButton}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={24} color="#212529" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color="#868E96"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#ADB5BD"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.categoryWrapper}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, category === item && styles.chipActive]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={40} color="#CED4DA" />
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          key={Platform.OS === "web" ? "web-grid" : "mobile-grid"}
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={Platform.OS === "web" ? undefined : 2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  greeting: { fontSize: 13, color: "#868E96" },
  title: { fontSize: 24, fontWeight: "800", color: "#212529" },

  cartIconButton: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 1,
  },

  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  cartBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },

  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: "#212529" },

  categoryWrapper: { marginTop: 14, marginBottom: 4 },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },

  chipActive: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
  chipText: { fontSize: 13, color: "#495057", fontWeight: "500" },
  chipTextActive: { color: "#FFFFFF" },

  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: { marginTop: 10, color: "#868E96", fontSize: 13 },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: { marginTop: 10, color: "#868E96", fontSize: 14 },
});