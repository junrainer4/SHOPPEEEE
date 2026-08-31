import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantityStepper from "../../src/components/QuantityStepper";
import { useCart } from "../../src/context/CartContext";
import { useProducts } from "../../src/context/ProductContext";

const App = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById, deleteProduct } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(id);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found.</Text>
          <Pressable style={styles.backLink} onPress={() => router.back()}>
            <Text style={styles.backLinkText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      "Added to cart",
      `${quantity} x ${product.name} added to your cart.`,
      [{ text: "OK" }]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete product",
      `Are you sure you want to delete "${product.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(product.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#FFB800" />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>

          <View style={styles.stockRow}>
            <Ionicons
              name={product.stock > 0 ? "checkmark-circle" : "close-circle"}
              size={16}
              color={product.stock > 0 ? "#2F9E44" : "#E03131"}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.stock > 0 ? "#2F9E44" : "#E03131" },
              ]}
            >
              {product.stock > 0
                ? `${product.stock} items in stock`
                : "Out of stock"}
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.quantityRow}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => setQuantity((q) => Math.min(q + 1, product.stock))}
              onDecrement={() => setQuantity((q) => Math.max(q - 1, 1))}
              max={Math.max(product.stock, 1)}
            />
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.editButton}
              onPress={() => router.push(`/edit/${product.id}`)}
            >
              <Ionicons name="create-outline" size={18} color="#212529" />
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#E03131" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.addToCartButton,
            product.stock === 0 && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Ionicons name="cart" size={18} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  image: {
  width: "100%",
  maxWidth: 180,
  aspectRatio: 1,
  alignSelf: "center",
  borderRadius: 14,
  backgroundColor: "#F1F3F5",
  marginTop: 16,
},
  body: { padding: 18 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { flex: 1, fontSize: 21, fontWeight: "800", color: "#212529", marginRight: 8 },
  ratingPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF4E0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { marginLeft: 3, fontSize: 12, fontWeight: "700", color: "#495057" },
  category: { marginTop: 4, fontSize: 13, color: "#868E96" },
  price: { marginTop: 10, fontSize: 24, fontWeight: "800", color: "#FF6B35" },
  stockRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  stockText: { marginLeft: 6, fontSize: 13, fontWeight: "600" },
  sectionLabel: { fontSize: 14, fontWeight: "700", color: "#212529", marginTop: 18, marginBottom: 6 },
  description: { fontSize: 14, color: "#495057", lineHeight: 20 },
  quantityRow: { marginTop: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actionRow: { flexDirection: "row", marginTop: 22, gap: 10 },
  editButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#DEE2E6" },
  editButtonText: { marginLeft: 6, fontWeight: "600", color: "#212529" },
  deleteButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#FFC9C9", backgroundColor: "#FFF5F5" },
  deleteButtonText: { marginLeft: 6, fontWeight: "600", color: "#E03131" },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#F1F3F5" },
  addToCartButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FF6B35", paddingVertical: 14, borderRadius: 12 },
  addToCartButtonDisabled: { backgroundColor: "#CED4DA" },
  addToCartText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginLeft: 8 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 15, color: "#868E96" },
  backLink: { marginTop: 12 },
  backLinkText: { color: "#FF6B35", fontWeight: "600" },
});