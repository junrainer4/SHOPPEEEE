import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../src/context/CartContext";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart, cart } = useCart();
  const { isDarkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#CED4DA" />
          <Text style={[styles.notFoundText, isDarkMode && styles.darkText]}>
            Product not found
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDarkMode ? "#ECEDEE" : "#212529"}
          />
        </Pressable>
        <Pressable
          onPress={() => router.push("/cart")}
          style={[styles.iconButton, styles.cartButton]}
        >
          <Ionicons
            name="cart-outline"
            size={22}
            color={isDarkMode ? "#ECEDEE" : "#212529"}
          />
          {totalCartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.imageContainer, isDarkMode && styles.darkCard]}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={[styles.ratingText, isDarkMode && styles.darkText]}>
              {product.rating.toFixed(1)}
            </Text>
          </View>

          <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>

          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Description
          </Text>
          <Text style={[styles.description, isDarkMode && styles.darkMutedText]}>
            {product.description ||
              "Experience premium build quality and high performance with this product. Perfect for everyday use."}
          </Text>

          <View style={styles.quantityContainer}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              Quantity
            </Text>
            <View style={styles.quantitySelector}>
              <Pressable
                style={[styles.qtyBtn, isDarkMode && styles.darkCard]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={isDarkMode ? "#ECEDEE" : "#212529"}
                />
              </Pressable>
              <Text style={[styles.qtyValue, isDarkMode && styles.darkText]}>
                {quantity}
              </Text>
              <Pressable
                style={[styles.qtyBtn, isDarkMode && styles.darkCard]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={isDarkMode ? "#ECEDEE" : "#212529"}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {addedToast && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.toastText}>Added to Cart</Text>
        </View>
      )}

      <View style={[styles.footer, isDarkMode && styles.darkCard]}>
        <Pressable style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={18} color="#FF6B35" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
        <Pressable style={styles.buyNowBtn} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  cartButton: { position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  scrollContent: { paddingBottom: 100 },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  detailsContainer: { padding: 18 },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF1E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: { color: "#FF6B35", fontSize: 12, fontWeight: "700" },
  title: { fontSize: 20, fontWeight: "800", color: "#212529" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { marginLeft: 4, fontSize: 13, fontWeight: "700" },
  price: { fontSize: 22, fontWeight: "800", color: "#FF6B35", marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 18, color: "#212529" },
  description: { fontSize: 13, color: "#868E96", marginTop: 6, lineHeight: 20 },
  quantityContainer: { marginTop: 12 },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  qtyValue: { fontSize: 15, fontWeight: "700" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF6B35",
    paddingVertical: 12,
    gap: 6,
  },
  addToCartText: { color: "#FF6B35", fontWeight: "700" },
  buyNowBtn: {
    flex: 1,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  buyNowText: { color: "#FFFFFF", fontWeight: "700" },
  darkCard: { backgroundColor: "#202426" },
  darkText: { color: "#ECEDEE" },
  darkMutedText: { color: "#AEB5B8" },
  toast: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toastText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  notFoundContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 16, fontWeight: "700", marginTop: 12 },
  backButton: { marginTop: 16, backgroundColor: "#FF6B35", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backButtonText: { color: "#FFFFFF", fontWeight: "700" },
});