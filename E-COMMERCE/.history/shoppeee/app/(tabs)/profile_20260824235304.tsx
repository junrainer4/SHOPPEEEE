import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "../../src/context/ProductContext";
import { useTheme } from "../../src/context/ThemeContext";

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  darkMode?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  onPress,
  right,
  darkMode,
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.row,
      darkMode && styles.darkRow,
      pressed && onPress && styles.rowPressed,
    ]}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.rowLeft}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#FF6B35" />
      </View>
      <Text style={[styles.rowLabel, darkMode && styles.darkText]}>{label}</Text>
    </View>
    {right ?? (onPress && <Ionicons name="chevron-forward" size={18} color="#CED4DA" />)}
  </Pressable>
);

const App = () => {
  const router = useRouter();
  const { products } = useProducts();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [addressesVisible, setAddressesVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [profileName, setProfileName] = useState("Juan Dela Cruz");
  const [profileEmail, setProfileEmail] = useState("juan.delacruz@example.com");
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/150?img=12"
  );
  const [nameDraft, setNameDraft] = useState(profileName);
  const [emailDraft, setEmailDraft] = useState(profileEmail);
  const [imageDraft, setImageDraft] = useState(profileImage);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addressDraft, setAddressDraft] = useState("");

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    router.replace("/login");
  };

  const openEditProfile = () => {
    setNameDraft(profileName);
    setEmailDraft(profileEmail);
    setImageDraft(profileImage);
    setEditProfileVisible(true);
  };

  const saveProfile = () => {
    setProfileName(nameDraft.trim() || profileName);
    setProfileEmail(emailDraft.trim() || profileEmail);
    setProfileImage(imageDraft.trim() || profileImage);
    setEditProfileVisible(false);
  };

  const openAddresses = () => {
    setAddressDraft(shippingAddress);
    setAddressesVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, isDarkMode && styles.darkCard]}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
          <View style={{ marginLeft: 14 }}>
            <Text style={[styles.name, isDarkMode && styles.darkText]}>{profileName}</Text>
            <Text style={[styles.email, isDarkMode && styles.darkMutedText]}>{profileEmail}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, isDarkMode && styles.darkCard]}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={[styles.statLabel, isDarkMode && styles.darkMutedText]}>Products Listed</Text>
          </View>
          <View style={[styles.statBox, isDarkMode && styles.darkCard]}>
            <Text style={styles.statValue}>4.6</Text>
            <Text style={[styles.statLabel, isDarkMode && styles.darkMutedText]}>Seller Rating</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isDarkMode && styles.darkMutedText]}>Preferences</Text>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            darkMode={isDarkMode}
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
            darkMode={isDarkMode}
            right={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ true: "#FFB08A", false: "#DEE2E6" }}
                thumbColor={isDarkMode ? "#FF6B35" : "#F8F9FA"}
              />
            }
          />
        </View>

        <Text style={[styles.sectionTitle, isDarkMode && styles.darkMutedText]}>Account</Text>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <SettingRow
            icon="person-outline"
            label="Edit Profile"
            darkMode={isDarkMode}
            onPress={openEditProfile}
          />
          <SettingRow
            icon="location-outline"
            label="Shipping Addresses"
            darkMode={isDarkMode}
            onPress={openAddresses}
          />
          <SettingRow
            icon="information-circle-outline"
            label="About Nova"
            darkMode={isDarkMode}
            onPress={() => setAboutVisible(true)}
          />
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={18} color="#E03131" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={logoutModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDarkMode && styles.darkCard]}>
            <Ionicons name="log-out-outline" size={36} color="#E03131" />
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Log Out</Text>
            <Text style={[styles.modalBody, isDarkMode && styles.darkMutedText]}>
              Are you sure you want to log out of your Nova account?
            </Text>

            <Pressable style={styles.confirmLogoutButton} onPress={confirmLogout}>
              <Text style={styles.confirmLogoutText}>Log Out</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={aboutVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isDarkMode && styles.darkCard]}>
            <Ionicons name="storefront-outline" size={34} color="#FF6B35" />
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Nova</Text>
            <Text style={[styles.modalBody, isDarkMode && styles.darkMutedText]}>
              Nova is a modern e-commerce application built with React Native,
              TypeScript, Expo Router, and Context API to showcase component
              architecture, dynamic routing, global state management, and real-time form handling.
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
          <View style={[styles.modalCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Edit Profile</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setNameDraft}
              placeholder="Full name"
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={nameDraft}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmailDraft}
              placeholder="Email address"
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={emailDraft}
            />
            <TextInput
              autoCapitalize="none"
              onChangeText={setImageDraft}
              placeholder="Profile image URL"
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={imageDraft}
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
          <View style={[styles.modalCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Shipping Addresses</Text>
            <Text style={[styles.addressStatus, isDarkMode && styles.darkMutedText]}>
              {shippingAddress || "No saved address yet."}
            </Text>
            <TextInput
              multiline
              onChangeText={setAddressDraft}
              placeholder="Enter your delivery address"
              style={[
                styles.input,
                styles.addressInput,
                isDarkMode && styles.darkInput,
              ]}
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
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  darkContainer: {
    backgroundColor: "#151718",
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  darkCard: {
    backgroundColor: "#202426",
  },
  darkText: {
    color: "#ECEDEE",
  },
  darkMutedText: {
    color: "#AEB5B8",
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
  darkRow: {
    borderBottomColor: "#343A40",
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
  confirmLogoutButton: {
    marginTop: 20,
    backgroundColor: "#E03131",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  confirmLogoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
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
  darkInput: {
    backgroundColor: "#151718",
    borderColor: "#495057",
    color: "#ECEDEE",
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
    marginTop: 4,
  },
  cancelText: {
    color: "#868E96",
    fontWeight: "600",
  },
});