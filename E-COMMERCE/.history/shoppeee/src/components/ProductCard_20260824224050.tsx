import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";
import { useTheme } from "../context/ThemeContext";

interface Props {
  product: Product;
  onPress: () => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  const { isDarkMode } = useTheme();
  const [imageError, setImageError] = useState(false);

  const hasValidImage =
    Boolean(product.image) &&
    product.image.trim().length > 0 &&
    !imageError;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isDarkMode && styles.darkCard,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {hasValidImage ? (
          <Image
            source={{ uri: product.image }}
            style={[styles.image, isDarkMode && styles.darkImage]}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.placeholder, isDarkMode && styles.darkPlaceholder]}>
            <Ionicons
              name="image-outline"
              size={32}
              color={isDarkMode ? "#495057" : "#CED4DA"}
            />
          </View>
        )}

        {product.stock === 0 && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, isDarkMode && styles.darkText]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.category, isDarkMode && styles.darkMutedText]}>
          {product.category}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#FFB800" />
            <Text style={[styles.ratingText, isDarkMode && styles.darkMutedText]}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    margin: "1.5%",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  darkCard: {
    backgroundColor: "#202426",
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: "#F1F3F5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  darkImage: {
    backgroundColor: "#151718",
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
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
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
  darkText: {
    color: "#ECEDEE",
  },
  category: {
    fontSize: 11,
    color: "#868E96",
    marginTop: 2,
  },
  darkMutedText: {
    color: "#AEB5B8",
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