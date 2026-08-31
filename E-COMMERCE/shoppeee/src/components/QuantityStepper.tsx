import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface Props {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

const QuantityStepper: React.FC<Props> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Pressable
        style={[styles.button, quantity <= min && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={quantity <= min}
      >
        <Ionicons
          name="remove"
          size={16}
          color={isDarkMode ? "#ECEDEE" : "#212529"}
        />
      </Pressable>
      <Text style={[styles.quantity, isDarkMode && styles.darkQuantity]}>
        {quantity}
      </Text>
      <Pressable
        style={[styles.button, quantity >= max && styles.buttonDisabled]}
        onPress={onIncrement}
        disabled={quantity >= max}
      >
        <Ionicons
          name="add"
          size={16}
          color={isDarkMode ? "#ECEDEE" : "#212529"}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  darkContainer: {
    borderColor: "#343A40",
    backgroundColor: "#202426",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  quantity: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
  },
  darkQuantity: {
    color: "#ECEDEE",
  },
});

export default QuantityStepper;