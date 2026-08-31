import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../src/components/FormField";
import { useProducts } from "../../src/context/ProductContext";
import { ProductFormErrors, ProductFormValues } from "../../src/types";
import { isFormValid, validateProduct } from "../../src/utils/validateProduct";

const App = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById, updateProduct, loading } = useProducts();
  const product = getProductById(id);

  const [form, setForm] = useState<ProductFormValues>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    category: product?.category ?? "",
    stock: product ? String(product.stock) : "",
    image: product?.image ?? "",
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleChange = (field: keyof ProductFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      Alert.alert("Check the form", "Please fix the highlighted fields.");
      return;
    }

    await updateProduct(product.id, {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      image: form.image.trim(),
      rating: product.rating,
    });

    Alert.alert("Product updated", `"${form.name}" was updated successfully.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Product</Text>
        <Text style={styles.subtitle}>Update the details for &quot;{product.name}&quot;.</Text>

        {form.image.trim().length > 0 && (
          <Image source={{ uri: form.image.trim() }} style={styles.preview} />
        )}

        <FormField
          label="Product Name"
          value={form.name}
          onChangeText={(t) => handleChange("name", t)}
          error={errors.name}
        />
        <FormField
          label="Description"
          value={form.description}
          onChangeText={(t) => handleChange("description", t)}
          error={errors.description}
          multiline
        />
        <FormField
          label="Price (₱)"
          value={form.price}
          onChangeText={(t) => handleChange("price", t)}
          error={errors.price}
          keyboardType="numeric"
        />
        <FormField
          label="Category"
          value={form.category}
          onChangeText={(t) => handleChange("category", t)}
          error={errors.category}
        />
        <FormField
          label="Stock Quantity"
          value={form.stock}
          onChangeText={(t) => handleChange("stock", t)}
          error={errors.stock}
          keyboardType="numeric"
        />
        <FormField
          label="Image URL"
          value={form.image}
          onChangeText={(t) => handleChange("image", t)}
          error={errors.image}
        />

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Save Changes</Text>
            </>
          )}
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 18, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "800", color: "#212529" },
  subtitle: { fontSize: 13, color: "#868E96", marginTop: 4, marginBottom: 18 },
  preview: { width: "100%", height: 160, borderRadius: 14, marginBottom: 16, backgroundColor: "#EEE" },
  submitButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, marginTop: 8 },
  submitButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginLeft: 8 },
  cancelButton: { alignItems: "center", paddingVertical: 14 },
  cancelButtonText: { color: "#868E96", fontWeight: "600" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 15, color: "#868E96" },
});