import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { router } from "expo-router";

const App = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>About Mini Shop</Text>

      <Text style={styles.text}>
        Mini Shop is a simple shopping application created using React Native and
        Expo.
      </Text>

      <Text style={styles.text}>Developed by:</Text>

      <Text style={styles.text}>Your Name</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/products" as never)}
      >
        <Text style={styles.buttonText}>Go to Products</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#212529",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#495057",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
