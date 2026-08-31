import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantityStepper from "../../src/components/QuantityStepper";
import { useCart } from "../../src/context/CartContext";
import { useOrders } from "../../src/context/OrderContext";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";
import { CartItem } from "../../src/types";

const App = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById, deleteProduct } = useProducts();
  const { cart = [], addToCart } = useCart();
  const { addOrder } = useOrders();
  const { isDarkMode } = useTheme();

  const product = id ? getProductById(id) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isInCart = Boolean(
    product && cart.some((item: CartItem) => String(item.product.id) === String(product.id))
  );

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Stack.Screen options={{ headerShown: false }} />
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

  const handleOpenBuyNowModal = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = () => {
    addOrder(
      [{ name: product.name, quantity, price: product.price }],
      totalBuyNowAmount
    );
    setShowCheckoutModal(false);
    setShowSuccessModal(true);
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

  const totalBuyNowAmount = product.price * quantity;

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.topHeader, isDarkMode && styles.darkHeader]}>
        <Pressable onPress={() => router.back()} style={styles.headerBackBtn}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDarkMode ? "#ECEDEE" : "#212529"}
          />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="information-circle" size={22} color="#FF6B35" />
          <Text style={[styles.headerTitleText, isDarkMode && styles.darkText]}>
            Product Details
          </Text>
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

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

              <Pressable style={styles.buyNowButton} onPress={handleOpenBuyNowModal}>
                <Text style={styles.buyNowText}>Buy Now</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Checkout Summary Modal */}
      <Modal
        visible={showCheckoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
                Order Summary
              </Text>
              <Pressable onPress={() => setShowCheckoutModal(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDarkMode ? "#ECEDEE" : "#212529"}
                />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalItemCard}>
                {hasValidImage ? (
                  <Image source={{ uri: product.image }} style={styles.modalImage} />
                ) : (
                  <View style={styles.modalPlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#ADB5BD" />
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.modalItemTitle, isDarkMode && styles.darkText]} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={[styles.modalItemCategory, isDarkMode && styles.darkMutedText]}>
                    {product.category}
                  </Text>
                  <Text style={styles.modalItemPrice}>
                    ₱{product.price.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.modalSummaryRow}>
                <Text style={[styles.modalSummaryLabel, isDarkMode && styles.darkMutedText]}>
                  Quantity
                </Text>
                <Text style={[styles.modalSummaryValue, isDarkMode && styles.darkText]}>
                  {quantity}
                </Text>
              </View>

              <View style={styles.modalSummaryRow}>
                <Text style={[styles.modalSummaryLabel, isDarkMode && styles.darkMutedText]}>
                  Price per item
                </Text>
                <Text style={[styles.modalSummaryValue, isDarkMode && styles.darkText]}>
                  ₱{product.price.toLocaleString()}
                </Text>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalSummaryRow}>
                <Text style={[styles.modalTotalLabel, isDarkMode && styles.darkText]}>
                  Total Amount
                </Text>
                <Text style={styles.modalTotalValue}>
                  ₱{totalBuyNowAmount.toLocaleString()}
                </Text>
              </View>
            </View>

            <Pressable style={styles.confirmOrderButton} onPress={handleConfirmOrder}>
              <Text style={styles.confirmOrderText}>Confirm Order</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Order Success Pop-up Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.successCard, isDarkMode && styles.darkModalContent]}>
            <Ionicons name="checkmark-circle" size={56} color="#40C057" />
            <Text style={[styles.successTitle, isDarkMode && styles.darkText]}>
              Order Successful! 🎉
            </Text>
            <Text style={[styles.successMessage, isDarkMode && styles.darkMutedText]}>
              Thank you for purchasing {quantity}x {product.name}. Your order has been placed successfully.
            </Text>
            <Pressable
              style={styles.successDoneBtn}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(tabs)");
              }}
            >
              <Text style={styles.successDoneBtnText}>Continue Shopping</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10, // Adds top spacing so it sits below the notch/status bar area
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  darkHeader: { backgroundColor: "#202426", borderBottomColor: "#343A40" },
  headerBackBtn: { width: 32, alignItems: "flex-start", justifyContent: "center" },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  headerTitleText: { fontSize: 18, fontWeight: "800", color: "#212529", marginLeft: 6 },
  headerRightSpacer: { width: 32 },
  scrollContent: { paddingBottom: 20 },
  imageWrapper: { width: "100%", height: 280, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  darkImageWrapper: { backgroundColor: "#202426" },
  image: { width: "100%", height: "100%" },
  placeholder: { width: "100%", height: "100%", backgroundColor: "#F1F3F5", alignItems: "center", justifyContent: "center" },
  darkPlaceholder: { backgroundColor: "#151718" },
  details: { padding: 18 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  title: { fontSize: 22, fontWeight: "800", color: "#212529" },
  darkText: { color: "#ECEDEE" },
  category: { fontSize: 13, color: "#868E96", marginTop: 2 },
  darkMutedText: { color: "#AEB5B8" },
  ratingBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF9DB", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#212529", marginLeft: 4 },
  price: { fontSize: 24, fontWeight: "800", color: "#FF6B35", marginTop: 12 },
  stockRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  stockText: { fontSize: 13, fontWeight: "600", marginLeft: 6 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#212529", marginTop: 20, marginBottom: 6 },
  description: { fontSize: 14, color: "#495057", lineHeight: 20 },
  quantityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  editButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DEE2E6", borderRadius: 12, paddingVertical: 12 },
  darkEditButton: { backgroundColor: "#202426", borderColor: "#343A40" },
  editButtonText: { marginLeft: 6, color: "#212529", fontWeight: "700" },
  deleteButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FFC9C9", borderRadius: 12, paddingVertical: 12 },
  deleteButtonText: { marginLeft: 6, color: "#E03131", fontWeight: "700" },
  footer: { backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E9ECEF", padding: 16 },
  darkFooter: { backgroundColor: "#202426", borderTopColor: "#343A40" },
  buttonGroup: { flexDirection: "row", gap: 12 },
  addToCartOutlineButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#FF6B35", borderRadius: 12, paddingVertical: 14 },
  addToCartOutlineText: { color: "#FF6B35", fontWeight: "700", fontSize: 15, marginLeft: 6 },
  viewCartButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#2B8A3E", borderRadius: 12, paddingVertical: 14 },
  buyNowButton: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14 },
  buyNowText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  cartButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginLeft: 6 },
  notFoundContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  notFoundText: { fontSize: 16, color: "#212529", marginTop: 10, fontWeight: "600" },
  backButton: { marginTop: 16, backgroundColor: "#FF6B35", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backButtonText: { color: "#FFFFFF", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  darkModalContent: { backgroundColor: "#202426" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#212529" },
  modalBody: { marginBottom: 20 },
  modalItemCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F9FA", borderRadius: 12, padding: 10, marginBottom: 16 },
  modalImage: { width: 60, height: 60, borderRadius: 8 },
  modalPlaceholder: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#E9ECEF", alignItems: "center", justifyContent: "center" },
  modalItemTitle: { fontSize: 14, fontWeight: "700", color: "#212529" },
  modalItemCategory: { fontSize: 12, color: "#868E96", marginTop: 2 },
  modalItemPrice: { fontSize: 14, fontWeight: "700", color: "#FF6B35", marginTop: 4 },
  modalSummaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  modalSummaryLabel: { fontSize: 14, color: "#868E96" },
  modalSummaryValue: { fontSize: 14, fontWeight: "600", color: "#212529" },
  modalDivider: { height: 1, backgroundColor: "#DEE2E6", marginVertical: 12 },
  modalTotalLabel: { fontSize: 16, fontWeight: "800", color: "#212529" },
  modalTotalValue: { fontSize: 18, fontWeight: "800", color: "#FF6B35" },
  confirmOrderButton: { backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  confirmOrderText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  modalOverlayCenter: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 24 },
  successCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, alignItems: "center", width: "100%" },
  successTitle: { fontSize: 18, fontWeight: "800", marginTop: 12, textAlign: "center" },
  successMessage: { fontSize: 13, color: "#868E96", textAlign: "center", marginTop: 6, lineHeight: 18 },
  successDoneBtn: { marginTop: 20, backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28, width: "100%", alignItems: "center" },
  successDoneBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});