import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../src/context/CartContext";
import { useTheme } from "../src/context/ThemeContext";

const CartScreen = () => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isDarkMode } = useTheme();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    id: string;
    total: number;
    itemCount: number;
  } | null>(null);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const orderSummary = {
      id: `#NOV-${Math.floor(100000 + Math.random() * 900000)}`,
      total: totalPrice,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    };

    setLastOrderDetails(orderSummary);
    clearCart();
    setSuccessModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#CED4DA" />
          <Text style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, isDarkMode && styles.darkMutedText]}>
            {"Looks like you haven't added anything to your cart yet."}
          </Text>
          <Pressable
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => String(item.product.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={[styles.cartCard, isDarkMode && styles.darkCard]}>
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.productInfo}>
                  <Text
                    style={[styles.productName, isDarkMode && styles.darkText]}
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    ₱{item.product.price.toLocaleString()}
                  </Text>

                  <View style={styles.quantityRow}>
                    <Pressable
                      style={[styles.qtyButton, isDarkMode && styles.darkQtyButton]}
                      onPress={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Ionicons
                        name="remove"
                        size={14}
                        color={isDarkMode ? "#ECEDEE" : "#212529"}
                      />
                    </Pressable>
                    <Text style={[styles.qtyText, isDarkMode && styles.darkText]}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      style={[styles.qtyButton, isDarkMode && styles.darkQtyButton]}
                      onPress={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Ionicons
                        name="add"
                        size={14}
                        color={isDarkMode ? "#ECEDEE" : "#212529"}
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={() => removeFromCart(item.product.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#E03131" />
                </Pressable>
              </View>
            )}
          />

          <View style={[styles.footer, isDarkMode && styles.darkCard]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, isDarkMode && styles.darkMutedText]}>
                Total Amount:
              </Text>
              <Text style={styles.totalValue}>
                ₱{totalPrice.toLocaleString()}
              </Text>
            </View>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Confirm Order</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Order Success Modal */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDarkMode && styles.darkCard]}>
            <Ionicons name="checkmark-circle" size={54} color="#40C057" />

            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Order Placed Successfully!
            </Text>
            <Text style={[styles.modalSubtitle, isDarkMode && styles.darkMutedText]}>
              Thank you for shopping with Nova. Your order is being processed.
            </Text>

            {lastOrderDetails && (
              <View style={[styles.orderSummaryBox, isDarkMode && styles.darkSummaryBox]}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, isDarkMode && styles.darkMutedText]}>Order ID:</Text>
                  <Text style={[styles.summaryVal, isDarkMode && styles.darkText]}>{lastOrderDetails.id}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, isDarkMode && styles.darkMutedText]}>Total Items:</Text>
                  <Text style={[styles.summaryVal, isDarkMode && styles.darkText]}>{lastOrderDetails.itemCount}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, isDarkMode && styles.darkMutedText]}>Total Paid:</Text>
                  <Text style={styles.summaryPrice}>₱{lastOrderDetails.total.toLocaleString()}</Text>
                </View>
              </View>
            )}

            <Pressable
              style={styles.doneButton}
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/(tabs)");
              }}
            >
              <Text style={styles.doneButtonText}>Continue Shopping</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },
  listContent: { padding: 18, paddingBottom: 100 },
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  darkCard: { backgroundColor: "#202426" },
  darkText: { color: "#ECEDEE" },
  darkMutedText: { color: "#AEB5B8" },
  productImage: { width: 64, height: 64, borderRadius: 10 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: "700", color: "#212529" },
  productPrice: { fontSize: 13, fontWeight: "800", color: "#FF6B35", marginTop: 2 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
  },
  darkQtyButton: { backgroundColor: "#343A40" },
  qtyText: { marginHorizontal: 12, fontSize: 13, fontWeight: "700", color: "#212529" },
  deleteButton: { padding: 6, marginLeft: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  totalLabel: { fontSize: 14, color: "#868E96", fontWeight: "600" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#FF6B35" },
  checkoutButton: { backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  checkoutText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#212529", marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: "#868E96", textAlign: "center", marginTop: 6 },
  shopButton: { marginTop: 20, backgroundColor: "#FF6B35", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  shopButtonText: { color: "#FFFFFF", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, alignItems: "center", width: "100%" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#212529", textAlign: "center", marginTop: 10 },
  modalSubtitle: { fontSize: 12, color: "#868E96", textAlign: "center", marginTop: 4, lineHeight: 18 },
  orderSummaryBox: { width: "100%", backgroundColor: "#F8F9FA", borderRadius: 12, padding: 14, marginVertical: 16 },
  darkSummaryBox: { backgroundColor: "#151718" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryLabel: { fontSize: 12, color: "#868E96", fontWeight: "600" },
  summaryVal: { fontSize: 12, fontWeight: "700", color: "#212529" },
  summaryPrice: { fontSize: 13, fontWeight: "800", color: "#FF6B35" },
  doneButton: { backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28, width: "100%", alignItems: "center" },
  doneButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});