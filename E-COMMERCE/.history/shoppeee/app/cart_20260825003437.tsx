import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantityStepper from "../src/components/QuantityStepper";
import { useCart } from "../src/context/CartContext";
import { useTheme } from "../src/context/ThemeContext";
import { CartItem } from "../src/types";

const App = () => {
  const router = useRouter();
  const { cart = [], removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { isDarkMode } = useTheme();
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    clearCart();
    setSuccessModalVisible(true);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <Pressable
      style={[styles.cartCard, isDarkMode && styles.darkCard]}
      onPress={() => router.push(`/product/${item.product.id}`)}
    >
      <Image source={{ uri: item.product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, isDarkMode && styles.darkText]} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.price}>₱{item.product.price.toLocaleString()}</Text>
        <View style={styles.stepperWrapper}>
          <QuantityStepper
            quantity={item.quantity}
            onIncrement={() => updateQuantity(item.product.id, item.quantity + 1)}
            onDecrement={() => updateQuantity(item.product.id, item.quantity - 1)}
            max={item.product.stock || 99}
          />
        </View>
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          removeFromCart(item.product.id);
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#E03131" />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cart-outline"
            size={64}
            color={isDarkMode ? "#495057" : "#CED4DA"}
          />
          <Text style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, isDarkMode && styles.darkMutedText]}>
            Looks like you haven&apos;t added anything to your cart yet.
          </Text>
          <Pressable style={styles.shopButton} onPress={() => router.push("/(tabs)")}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={cart}
            keyExtractor={(item) => String(item.product.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, isDarkMode && styles.darkMutedText]}>
                Total Amount
              </Text>
              <Text style={styles.totalValue}>
                ₱{(totalAmount || 0).toLocaleString()}
              </Text>
            </View>
            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Confirm Order</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.successCard, isDarkMode && styles.darkCard]}>
            <Ionicons name="checkmark-circle" size={56} color="#40C057" />
            <Text style={[styles.successTitle, isDarkMode && styles.darkText]}>
              Order Placed Successfully! 🎉
            </Text>
            <Text style={[styles.successSubtitle, isDarkMode && styles.darkMutedText]}>
              Thank you for shopping with Nova. Your order has been placed and is now processing.
            </Text>
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

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },
  listContent: { padding: 16, paddingBottom: 120 },
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  darkCard: { backgroundColor: "#202426" },
  image: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#F1F3F5" },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 14, fontWeight: "700", color: "#212529" },
  darkText: { color: "#ECEDEE" },
  darkMutedText: { color: "#AEB5B8" },
  price: { fontSize: 14, fontWeight: "700", color: "#FF6B35", marginTop: 2 },
  stepperWrapper: { marginTop: 8, alignSelf: "flex-start" },
  deleteButton: { padding: 8, marginLeft: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    padding: 16,
  },
  darkFooter: { backgroundColor: "#202426", borderTopColor: "#343A40" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  totalLabel: { fontSize: 14, color: "#868E96" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#FF6B35" },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#212529", marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: "#868E96", textAlign: "center", marginTop: 4 },
  shopButton: { marginTop: 20, backgroundColor: "#FF6B35", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 },
  shopButtonText: { color: "#FFFFFF", fontWeight: "700" },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#212529",
    marginTop: 12,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 13,
    color: "#868E96",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    width: "100%",
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});