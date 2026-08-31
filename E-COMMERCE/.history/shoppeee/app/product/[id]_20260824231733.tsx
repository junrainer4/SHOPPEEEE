import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantityStepper from "../../src/components/QuantityStepper";
import { useCart } from "../../src/context/CartContext";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";

const App = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById, deleteProduct } = useProducts();
  const { cart = [], addToCart } = useCart();
  const { isDarkMode } = useTheme();

  const product = id ? getProductById(id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const isInCart = Boolean(
    product && cart.some((item) => String(item.product.id) === String(product.id))
  );

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#868E96" />
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
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(product.id);
            router.push("/(tabs)");
          },
        },
      ]
    );
  };

  const hasValidImage =
    Boolean(product.image) && product.image.trim().length > 0 && !imageError;

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.imageWrapper, isDarkMode && styles.darkImageWrapper]}>
            {hasValidImage ? (
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={[styles.placeholder, isDarkMode && styles.darkPlaceholder]}>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={isDarkMode ? "#495057" : "#CED4DA"}
                />
              </View>
            )}
          </View>

          <View style={styles.details}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, isDarkMode && styles.darkText]}>
                  {product.name}
                </Text>
                <Text style={[styles.category, isDarkMode && styles.darkMutedText]}>
                  {product.category}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
              </View>
            </View>

            <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>

            <View style={styles.stockRow}>
              <Ionicons
                name={product.stock > 0 ? "checkmark-circle" : "close-circle"}
                size={16}
                color={product.stock > 0 ? "#2B8A3E" : "#E03131"}
              />
              <Text
                style={[
                  styles.stockText,
                  { color: product.stock > 0 ? "#2B8A3E" : "#E03131" },
                ]}
              >
                {product.stock > 0 ? `${product.stock} items in stock` : "Out of stock"}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, isDarkMode && styles.darkMutedText]}>
              Description
            </Text>
            <Text style={[styles.description, isDarkMode && styles.darkMutedText]}>
              {product.description}
            </Text>

            {product.stock > 0 && (
              <View style={styles.quantityRow}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkMutedText]}>
                  Quantity
                </Text>
                <QuantityStepper
                  quantity={quantity}
                  onIncrement={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                  max={product.stock}
                />
              </View>
            )}

            <View style={styles.actionRow}>
              <Pressable
                style={[styles.editButton, isDarkMode && styles.darkEditButton]}
                onPress={() => router.push(`/edit/${product.id}`)}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={isDarkMode ? "#ECEDEE" : "#212529"}
                />
                <Text style={[styles.editButtonText, isDarkMode && styles.darkText]}>
                  Edit
                </Text>
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={18} color="#E03131" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {product.stock > 0 && (
          <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
            <View style={styles.buttonGroup}>
              {isInCart ? (
                <Pressable
                  style={styles.viewCartButton}
                  onPress={() => router.push("/cart")}
                >
                  <Ionicons name="cart" size={18} color="#FFFFFF" />
                  <Text style={styles.cartButtonText}>View Cart</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.addToCartOutlineButton}
                  onPress={handleAddToCart}
                >
                  <Ionicons name="cart-outline" size={18} color="#FF6B35" />
                  <Text style={styles.addToCartOutlineText}>Add to Cart</Text>
                </Pressable>
              )}

              <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
                <Text style={styles.buyNowText}>Buy Now</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
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
  scrollContent: {
    paddingBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    height: 280,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  darkImageWrapper: {
    backgroundColor: "#202426",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
  },
  darkPlaceholder: {
    backgroundColor: "#151718",
  },
  details: {
    padding: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#212529",
  },
  darkText: {
    color: "#ECEDEE",
  },
  category: {
    fontSize: 13,
    color: "#868E96",
    marginTop: 2,
  },
  darkMutedText: {
    color: "#AEB5B8",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9DB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#212529",
    marginLeft: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B35",
    marginTop: 12,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  stockText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212529",
    marginTop: 20,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 12,
    paddingVertical: 12,
  },
  darkEditButton: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
  },
  editButtonText: {
    marginLeft: 6,
    color: "#212529",
    fontWeight: "700",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFC9C9",
    borderRadius: 12,
    paddingVertical: 12,
  },
  deleteButtonText: {
    marginLeft: 6,
    color: "#E03131",
    fontWeight: "700",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    padding: 16,
  },
  darkFooter: {
    backgroundColor: "#202426",
    borderTopColor: "#343A40",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  addToCartOutlineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
  },
  addToCartOutlineText: {
    color: "#FF6B35",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
  viewCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B8A3E",
    borderRadius: 12,
    paddingVertical: 14,
  },
  buyNowButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
  },
  buyNowText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  cartButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: "#212529",
    marginTop: 10,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});