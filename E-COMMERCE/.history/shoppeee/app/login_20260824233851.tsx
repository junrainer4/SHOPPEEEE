import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../src/context/ThemeContext";

const LoginScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="cart" size={36} color="#FF6B35" />
            </View>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>Welcome to Nova</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkMutedText]}>
              Sign in to manage products and check your cart
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>Email Address</Text>
            <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
              <Ionicons name="mail-outline" size={20} color="#868E96" />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInputText]}
                placeholder="email@domain.com"
                placeholderTextColor="#ADB5BD"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, isDarkMode && styles.darkText]}>Password</Text>
            <View style={[styles.inputWrapper, isDarkMode && styles.darkInputWrapper]}>
              <Ionicons name="lock-closed-outline" size={20} color="#868E96" />
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInputText]}
                placeholder="Enter password"
                placeholderTextColor="#ADB5BD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#868E96"
                />
              </Pressable>
            </View>

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  darkContainer: {
    backgroundColor: "#151718",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 53, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#212529",
  },
  subtitle: {
    fontSize: 14,
    color: "#868E96",
    textAlign: "center",
    marginTop: 6,
  },
  darkText: {
    color: "#ECEDEE",
  },
  darkMutedText: {
    color: "#AEB5B8",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 6,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  darkInputWrapper: {
    backgroundColor: "#202426",
    borderColor: "#343A40",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
    marginLeft: 8,
  },
  darkInputText: {
    color: "#ECEDEE",
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});