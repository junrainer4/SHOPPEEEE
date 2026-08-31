import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "../src/context/ProductContext";
interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, label, onPress, right }) => (
  <Pressable
    style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.rowLeft}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#FF6B35" />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    {right ?? (onPress && <Ionicons name="chevron-forward" size={18} color="#CED4DA" />)}
  </Pressable>
);

export default function ProfileScreen() {
  const { products } = useProducts();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [addressesVisible, setAddressesVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [profileName, setProfileName] = useState("Juan Dela Cruz");
  const [profileEmail, setProfileEmail] = useState("juan.delacruz@example.com");
  const [nameDraft, setNameDraft] = useState(profileName);
  const [emailDraft, setEmailDraft] = useState(profileEmail);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addressDraft, setAddressDraft] = useState("");

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => Alert.alert("Logged out", "See you again soon!"),
      },
    ]);
  };

  const openEditProfile = () => {
    setNameDraft(profileName);
    setEmailDraft(profileEmail);
    setEditProfileVisible(true);
  };

  const saveProfile = () => {
    setProfileName(nameDraft.trim() || profileName);
    setProfileEmail(emailDraft.trim() || profileEmail);
    setEditProfileVisible(false);
  };

  const openAddresses = () => {
    setAddressDraft(shippingAddress);
    setAddressesVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>{profileName}</Text>
            <Text style={styles.email}>{profileEmail}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Products Listed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.6</Text>
            <Text style={styles.statLabel}>Seller Rating</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ true: "#FFB08A", false: "#DEE2E6" }}
                thumbColor={notificationsEnabled ? "#FF6B35" : "#F8F9FA"}
              />
            }
          />
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            right={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ true: "#FFB08A", false: "#DEE2E6" }}
                thumbColor={darkModeEnabled ? "#FF6B35" : "#F8F9FA"}
              />
            }
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingRow
            icon="person-outline"
            label="Edit Profile"
            onPress={openEditProfile}
          />
          <SettingRow
            icon="location-outline"
            label="Shipping Addresses"
            onPress={openAddresses}
          />
          <SettingRow
            icon="information-circle-outline"
            label="About ShopEase"
            onPress={() => setAboutVisible(true)}
          />
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#E03131" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={aboutVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="storefront-outline" size={34} color="#FF6B35" />
            <Text style={styles.modalTitle}>ShopEase</Text>
            <Text style={styles.modalBody}>
              ShopEase is a demo e-commerce app built with React Native,
              TypeScript, Expo Router, and Context API to showcase component
              usage, navigation, state management, and form validation.
            </Text>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setAboutVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editProfileVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setNameDraft}
              placeholder="Full name"
              style={styles.input}
              value={nameDraft}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmailDraft}
              placeholder="Email address"
              style={styles.input}
              value={emailDraft}
            />
            <Pressable style={styles.modalCloseButton} onPress={saveProfile}>
              <Text style={styles.modalCloseText}>Save Changes</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setEditProfileVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={addressesVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddressesVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Shipping Addresses</Text>
            <Text style={styles.addressStatus}>
              {shippingAddress || "No saved address yet."}
            </Text>
            <TextInput
              multiline
              onChangeText={setAddressDraft}
              placeholder="Enter your delivery address"
              style={[styles.input, styles.addressInput]}
              value={addressDraft}
            />
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => {
                setShippingAddress(addressDraft.trim());
                setAddressesVisible(false);
              }}
            >
              <Text style={styles.modalCloseText}>Save Address</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setAddressesVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#212529",
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEE",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212529",
  },
  email: {
    fontSize: 12,
    color: "#868E96",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FF6B35",
  },
  statLabel: {
    fontSize: 11,
    color: "#868E96",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#868E96",
    marginTop: 22,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  rowPressed: {
    backgroundColor: "#F8F9FA",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FFF1E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFC9C9",
    backgroundColor: "#FFF5F5",
  },
  logoutText: {
    marginLeft: 8,
    color: "#E03131",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#212529",
    marginTop: 10,
  },
  modalBody: {
    fontSize: 13,
    color: "#495057",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 19,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 12,
    color: "#212529",
    backgroundColor: "#F8F9FA",
  },
  addressInput: {
    minHeight: 76,
    textAlignVertical: "top",
  },
  addressStatus: {
    width: "100%",
    color: "#495057",
    fontSize: 13,
    marginTop: 12,
  },
  modalCloseButton: {
    marginTop: 18,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 26,
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelText: {
    color: "#868E96",
    fontWeight: "600",
  },
});
