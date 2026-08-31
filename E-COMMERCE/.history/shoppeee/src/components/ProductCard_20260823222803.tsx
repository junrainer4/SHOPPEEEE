import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";

interface Props {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />
      {product.stock === 0 && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Out of stock</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    margin: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F1F3F5",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#212529",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  outOfStockText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
  },
  category: {
    fontSize: 11,
    color: "#868E96",
    marginTop: 2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  price: {
    fontSize: 14,
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
});

export default ProductCard;