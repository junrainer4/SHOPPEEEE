import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../src/components/FormField";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";
import { ProductFormErrors, ProductFormValues } from "../../src/types";
import { isFormValid, validateProduct } from "../../src/utils/validateProduct";

const App = () => {
  const router = useRouter();
  const { addProduct, products, loading } = useProducts();
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
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const existingCategories = useMemo(() => {
    const cats = Array.from(
      new Set(
        products
          .map((p) => p.category?.trim())
          .filter((c): c is string => Boolean(c && c.length > 0))
      )
    );
    return cats.sort((a, b) => a.localeCompare(b));
  }, [products]);

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
        "Please allow access to your photos to upload a product image."
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

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    });
    setIsCustomCategory(false);

    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Add Product</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkMutedText]}>
          Fill in the details below to list a new product.
        </Text>

        <Text style={[styles.label, isDarkMode && styles.darkText]}>Product Image</Text>
        <Pressable
          style={[styles.imagePicker, isDarkMode && styles.darkImagePicker]}
          onPress={handlePickImage}
        >
          {form.image.trim().length > 0 ? (
            <Image
              source={{ uri: form.image.trim() }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={28} color="#ADB5BD" />
              <Text style={styles.imagePlaceholderText}>Tap to choose a photo</Text>
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

        <Text style={[styles.label, { marginTop: 16 }, isDarkMode && styles.darkText]}>
          Category
        </Text>

        <View style={styles.chipContainer}>
          {existingCategories.map((cat) => {
            const isSelected = !isCustomCategory && form.category.toLowerCase() === cat.toLowerCase();
            return (
              <Pressable
                key={cat}
                style={[
                  styles.chip,
                  isDarkMode && styles.darkChip,
                  isSelected && styles.chipSelected,
                ]}
                onPress={() => {
                  setIsCustomCategory(false);
                  handleChange("category", cat);
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    isDarkMode && styles.darkMutedText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            style={[
              styles.chip,
              styles.newCategoryChip,
              isCustomCategory && styles.chipSelected,
            ]}
            onPress={() => {
              setIsCustomCategory(true);
              handleChange("category", "");
            }}
          >
            <Ionicons
              name="add"
              size={14}
              color={isCustomCategory ? "#FFFFFF" : "#FF6B35"}
            />
            <Text
              style={[
                styles.newCategoryChipText,
                isCustomCategory && styles.chipTextSelected,
              ]}
            >
              New Category
            </Text>
          </Pressable>
        </View>

        {isCustomCategory && (
          <TextInput
            style={[styles.customCategoryInput, isDarkMode && styles.darkInput]}
            placeholder="Type new category name..."
            placeholderTextColor="#ADB5BD"
            value={form.category}
            onChangeText={(t) => handleChange("category", t)}
            autoCapitalize="words"
          />
        )}
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

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
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#151718" },
  scrollContent: { padding: 18, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "800", color: "#212529" },
  subtitle: { fontSize: 13, color: "#868E96", marginTop: 2, marginBottom: 18 },
  darkText: { color: "#ECEDEE" },
  darkMutedText: { color: "#AEB5B8" },
  label: { fontSize: 13, fontWeight: "600", color: "#212529", marginBottom: 6 },
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
  removeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  removeImageText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#E03131",
    fontWeight: "600",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  darkChip: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
  },
  chipSelected: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  chipText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  newCategoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#FF6B35",
  },
  newCategoryChipText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "700",
    marginLeft: 4,
  },
  customCategoryInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginTop: 4,
    color: "#212529",
  },
  darkInput: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
    color: "#ECEDEE",
  },
  errorText: { marginTop: 6, fontSize: 12, color: "#E03131" },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
  },
  submitButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15, marginLeft: 8 },
});