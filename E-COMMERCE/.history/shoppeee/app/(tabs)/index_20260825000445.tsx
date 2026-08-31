import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ProductCard from "../../src/components/ProductCard";
import { useCart } from "../../src/context/CartContext";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";
import { CATEGORIES } from "../../src/data/products";

const App = () => {
  const router = useRouter();
  const { products } = useProducts();
  const { totalItems } = useCart();
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [search, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const handleSelectCategory = (item: string, index: number) => {
    setCategory(item);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const renderHighlightedText = (text: string, query: string, baseStyle: any) => {
    if (!query.trim()) return <Text style={baseStyle}>{text}</Text>;

    const regex = new RegExp(`(${query.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);

    return (
      <Text style={baseStyle}>
        {parts.map((part, index) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <Text key={index} style={styles.highlightText}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {Platform.OS === "web" && (
        <style>
          {`
            input:focus {
              outline: none !important;
            }
          `}
        </style>
      )}

      <View style={styles.header}>
        <Pressable onPress={() => router.push("/profile")}>
          <View style={styles.brand}>
            <Ionicons name="cart" size={28} color="#FF6B35" />
            <Text style={[styles.title, isDarkMode && styles.darkText]}>Nova</Text>
          </View>
        </Pressable>
        <Pressable
          style={[styles.cartIconButton, isDarkMode && styles.darkCard]}
          onPress={() => router.push("/cart")}
        >
          <Ionicons
            name="cart-outline"
            size={24}
            color={isDarkMode ? "#ECEDEE" : "#212529"}
          />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={{ zIndex: 10 }}>
        <View
          style={[
            styles.searchWrapper,
            isDarkMode && styles.darkSearchWrapper,
            isFocused && styles.searchWrapperFocused,
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color="#868E96"
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkInputText]}
            placeholder="Search products..."
            placeholderTextColor={isDarkMode ? "#868E96" : "#ADB5BD"}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#868E96" />
            </Pressable>
          )}
        </View>

        {isFocused && suggestions.length > 0 && (
          <View style={[styles.suggestionsDropdown, isDarkMode && styles.darkDropdown]}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
              {suggestions.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.suggestionRow,
                    isDarkMode && styles.darkSuggestionRow,
                    pressed && styles.suggestionPressed,
                  ]}
                  onPress={() => {
                    setSearch(item.name);
                    setIsFocused(false);
                    router.push(`/product/${item.id}`);
                  }}
                >
                  <Ionicons name="search" size={14} color="#FF6B35" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    {renderHighlightedText(
                      item.name,
                      search,
                      [styles.suggestionText, isDarkMode && styles.darkText]
                    )}
                    <Text
                      style={[styles.suggestionCategory, isDarkMode && styles.darkMutedText]}
                    >
                      In {item.category}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.categoryWrapper}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.chip,
                isDarkMode && styles.darkChip,
                category === item && styles.chipActive,
              ]}
              onPress={() => handleSelectCategory(item, index)}
            >
              <Text
                style={[
                  styles.chipText,
                  isDarkMode && styles.darkChipText,
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
          <Text style={[styles.loadingText, isDarkMode && styles.darkMutedText]}>
            Loading products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={40} color="#CED4DA" />
          <Text style={[styles.emptyText, isDarkMode && styles.darkMutedText]}>
            No products found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },

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

  title: { fontSize: 24, fontWeight: "800", color: "#212529" },
  darkText: { color: "#ECEDEE" },
  darkMutedText: { color: "#AEB5B8" },

  cartIconButton: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: "#202426",
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
  searchWrapperFocused: {
    borderColor: "#FF6B35",
    borderWidth: 1.5,
  },
  darkSearchWrapper: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
  },

  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: "#212529" },
  darkInputText: { color: "#ECEDEE" },

  suggestionsDropdown: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  darkDropdown: { backgroundColor: "#202426", borderColor: "#343A40" },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  darkSuggestionRow: { borderBottomColor: "#343A40" },
  suggestionPressed: { backgroundColor: "#FFF1E9" },
  suggestionText: { fontSize: 13, fontWeight: "600", color: "#212529" },
  highlightText: { color: "#FF6B35", fontWeight: "800" },
  suggestionCategory: { fontSize: 11, color: "#868E96", marginTop: 2 },

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
  darkChip: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
  },

  chipActive: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
  chipText: { fontSize: 13, color: "#495057", fontWeight: "500" },
  darkChipText: { color: "#ECEDEE" },
  chipTextActive: { color: "#FFFFFF" },

  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 8,
  },

  columnWrapper: {
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