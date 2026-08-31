import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../src/components/FormField";
import { useProducts } from "../src/context/ProductContext";
import { ProductFormErrors, ProductFormValues } from "../src/types";
import { isFormValid, validateProduct } from "../src/utils/validateProduct";

const EMPTY_FORM: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: "",
};

const App = () => {
  const router = useRouter();
  const { addProduct, loading } = useProducts();
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const handleChange = (field: keyof ProductFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the field's error as soon as the user edits it again.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      Alert.alert("Check the form", "Please fix the highlighted fields.");
      return;
    }

    await addProduct({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      image: form.image.trim(),
      rating: 0,
    });

    Alert.alert("Product added", `"${form.name}" was added successfully.`, [
      {
        text: "OK",
        onPress: () => {
          setForm(EMPTY_FORM);
          router.push("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Fill in the details below to list a new product.
        </Text>

        {form.image.trim().length > 0 && (
          <Image source={{ uri: form.image.trim() }} style={styles.preview} />
        )}

        <FormField
          label="Product Name"
          value={form.name}
          onChangeText={(t) => handleChange("name", t)}
          placeholder="e.g. Wireless Mouse"
          error={errors.name}
        />
        <FormField
          label="Description"
          value={form.description}
          onChangeText={(t) => handleChange("description", t)}
          placeholder="Briefly describe the product"
          error={errors.description}
          multiline
        />
        <FormField
          label="Price (₱)"
          value={form.price}
          onChangeText={(t) => handleChange("price", t)}
          placeholder="e.g. 999"
          error={errors.price}
          keyboardType="numeric"
        />
        <FormField
          label="Category"
          value={form.category}
          onChangeText={(t) => handleChange("category", t)}
          placeholder="e.g. Electronics"
          error={errors.category}
        />
        <FormField
          label="Stock Quantity"
          value={form.stock}
          onChangeText={(t) => handleChange("stock", t)}
          placeholder="e.g. 20"
          error={errors.stock}
          keyboardType="numeric"
        />
        <FormField
          label="Image URL"
          value={form.image}
          onChangeText={(t) => handleChange("image", t)}
          placeholder="https://..."
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
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Add Product</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 18,
    paddingTop: 0,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 13,
    color: "#868E96",
    marginTop: 0,
    marginBottom: 18,
  },
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginBottom: 19,
    backgroundColor: "#EEE",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
});
