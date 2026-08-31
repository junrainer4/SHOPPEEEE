import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../src/components/FormField";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";
import { ProductFormErrors, ProductFormValues } from "../../src/types";
import { isFormValid, validateProduct } from "../../src/utils/validateProduct";

const App = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById, updateProduct, loading } = useProducts();
  const { isDarkMode } = useTheme();

  const [form, setForm] = useState<ProductFormValues>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});

  useEffect(() => {
    if (id) {
      const product = getProductById(id);
      if (product) {
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock),
          image: product.image,
        });
      }
    }
  }, [id, getProductById]);

  const handleChange = (field: keyof ProductFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg, image/png, image/webp";
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            handleChange("image", result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photos to update the product image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const imageUri = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      handleChange("image", imageUri);
    }
  };

  const handleRemoveImage = () => {
    handleChange("image", "");
  };

  const handleSubmit = async () => {
    if (!id) return;

    const validationErrors = validateProduct(form);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) {
      Alert.alert("Check the form", "Please fix the highlighted fields.");
      return;
    }

    await updateProduct(id, {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      image: form.image.trim(),
      rating: 0,
    });

    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.subtitle, isDarkMode && styles.darkMutedText]}>
          Update the details for {form.name ? `"${form.name}"` : "this product"}.
        </Text>

        <Text style={[styles.label, isDarkMode && styles.darkText]}>Product Image</Text>
        <Pressable
          style={[styles.imagePicker, isDarkMode && styles.darkImagePicker]}
          onPress={handlePickImage}
        >
          {form.image.trim().length > 0 && !form.image.startsWith("blob:") ? (
            <Image
              source={{ uri: form.image.trim() }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={28} color="#ADB5BD" />
              <Text style={styles.imagePlaceholderText}>Tap to change photo</Text>
            </View>
          )}
        </Pressable>
        {form.image.trim().length > 0 && (
          <Pressable onPress={handleRemoveImage} style={styles.removeImageButton}>
            <Ionicons name="trash-outline" size={14} color="#E03131" />
            <Text style={styles.removeImageText}>Remove photo</Text>
          </Pressable>
        )}
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

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

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },
  scrollContent: { padding: 18, paddingTop: 0, paddingBottom: 40 },
  subtitle: { fontSize: 13, color: "#868E96", marginTop: 0, marginBottom: 18 },
  darkMutedText: { color: "#AEB5B8" },
  label: { fontSize: 13, fontWeight: "600", color: "#212529", marginBottom: 6 },
  darkText: { color: "#ECEDEE" },
  imagePicker: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  darkImagePicker: { backgroundColor: "#202426", borderColor: "#343A40" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: { marginTop: 6, fontSize: 12, color: "#ADB5BD" },
  preview: { width: "100%", height: "100%" },
  removeImageButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginTop: 8 },
  removeImageText: { marginLeft: 4, fontSize: 12, color: "#E03131", fontWeight: "600" },
  errorText: { marginTop: 6, fontSize: 12, color: "#E03131" },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
  },
  submitButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginLeft: 8 },
  cancelButton: { alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  cancelText: { color: "#868E96", fontWeight: "600" },
});