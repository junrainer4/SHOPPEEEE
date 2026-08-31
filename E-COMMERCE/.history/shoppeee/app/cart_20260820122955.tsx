import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantityStepper from "../src/components/QuantityStepper";
import { useCart } from "../src/context/CartContext";
import { CartItem } from "../src/types";

export default function CartScreen() {
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const [modalVisible, setModalVisible] = useState(false);

  const handleRemove = (item: CartItem) => {
    Alert.alert(
      "Remove item",
      `Remove "${item.product.name}" from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(item.product.id),
        },
      ]
    );
  };

  const handleConfirmOrder = () => {
    setModalVisible(false);
    clearCart();
    Alert.alert("Order placed!", "Thank you for shopping with ShopEase.");
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.itemPrice}>
          ₱{item.product.price.toLocaleString()}
        </Text>
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={() => incrementQuantity(item.product.id)}
          onDecrement={() => decrementQuantity(item.product.id)}
        />
      </View>
      <Pressable
        style={styles.removeButton}
        onPress={() => handleRemove(item)}
      >
        <Ionicons name="trash-outline" size={18} color="#E03131" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.subtitle}>{totalItems} item(s)</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={48} color="#CED4DA" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>
            Browse products and add items to your cart.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₱{totalPrice.toLocaleString()}
              </Text>
            </View>
            <Pressable
              style={styles.checkoutButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </Pressable>
          </View>
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalSubtitle}>
              You're about to place an order for {totalItems} item(s).
            </Text>

            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Subtotal</Text>
              <Text style={styles.modalSummaryValue}>
                ₱{totalPrice.toLocaleString()}
              </Text>
            </View>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Shipping</Text>
              <Text style={styles.modalSummaryValue}>Free</Text>
            </View>
            <View style={styles.modalDivider} />
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalTotalLabel}>Total</Text>
              <Text style={styles.modalTotalValue}>
                ₱{totalPrice.toLocaleString()}
              </Text>
            </View>

            <Pressable
              style={styles.confirmButton}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.confirmButtonText}>Place Order</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  listContent: {
    padding: 12,
  },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#EEE",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212529",
  },
  itemPrice: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 6,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#495057",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#ADB5BD",
    textAlign: "center",
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F3F5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 15,
    color: "#495057",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#212529",
  },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#212529",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#868E96",
    marginTop: 4,
    marginBottom: 16,
  },
  modalSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalSummaryLabel: {
    fontSize: 13,
    color: "#495057",
  },
  modalSummaryValue: {
    fontSize: 13,
    color: "#212529",
    fontWeight: "600",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F1F3F5",
    marginVertical: 8,
  },
  modalTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212529",
  },
  modalTotalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FF6B35",
  },
  confirmButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#868E96",
    fontWeight: "600",
  },
});
