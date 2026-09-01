import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../../src/context/OrderContext";
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
  const { orders } = useOrders();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [addressesVisible, setAddressesVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [profileName, setProfileName] = useState("Juan Dela Cruz");
  const [profileEmail, setProfileEmail] = useState("juan.delacruz@example.com");
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/150?img=12"
  );
  const [nameDraft, setNameDraft] = useState(profileName);
  const [emailDraft, setEmailDraft] = useState(profileEmail);
  const [imageDraft, setImageDraft] = useState(profileImage);
  const [shippingAddress, setShippingAddress] = useState("123 Rizal Ave, Metro Manila");
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

  const handlePickAvatar = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/jpeg, image/png, image/webp";
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result as string;
            setImageDraft(result);
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
        "Please allow access to your photos to update your profile picture."
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
      setImageDraft(imageUri);
    }
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, isDarkMode && styles.darkCard]}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={[styles.name, isDarkMode && styles.darkText]}>{profileName}</Text>
            <Text style={[styles.email, isDarkMode && styles.darkMutedText]}>{profileEmail}</Text>
            {Boolean(shippingAddress) && (
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={12} color="#FF6B35" />
                <Text style={[styles.addressText, isDarkMode && styles.darkMutedText]} numberOfLines={1}>
                  {shippingAddress}
                </Text>
              </View>
            )}
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
            icon="receipt-outline"
            label="My Orders"
            darkMode={isDarkMode}
            onPress={() => setOrdersVisible(true)}
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
        visible={ordersVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setOrdersVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, styles.ordersModalCard, isDarkMode && styles.darkCard]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="receipt-outline" size={24} color="#FF6B35" />
                <Text style={[styles.modalTitle, isDarkMode && styles.darkText, { marginTop: 0, marginLeft: 8 }]}>
                  My Orders
                </Text>
              </View>
              <Pressable onPress={() => setOrdersVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? "#ECEDEE" : "#212529"} />
              </Pressable>
            </View>

            {orders.length === 0 ? (
              <View style={styles.emptyOrdersView}>
                <Ionicons name="cube-outline" size={48} color="#CED4DA" />
                <Text style={[styles.emptyOrdersText, isDarkMode && styles.darkMutedText]}>
                  No orders placed yet.
                </Text>
              </View>
            ) : (
              <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                style={{ width: "100%", marginTop: 12 }}
                renderItem={({ item }) => (
                  <View style={[styles.orderItemCard, isDarkMode && styles.darkInput]}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>{item.id}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={[styles.orderDateText, isDarkMode && styles.darkMutedText]}>
                      {item.date}
                    </Text>

                    {item.items.map((subItem, index) => (
                      <Text key={index} style={[styles.orderDetailsText, isDarkMode && styles.darkText]}>
                        {subItem.quantity}x {subItem.name}
                      </Text>
                    ))}

                    <View style={styles.orderTotalDivider} />
                    <View style={styles.orderTotalRow}>
                      <Text style={[styles.orderTotalLabel, isDarkMode && styles.darkMutedText]}>
                        Total Amount
                      </Text>
                      <Text style={styles.orderPriceText}>₱{item.totalPrice.toLocaleString()}</Text>
                    </View>
                  </View>
                )}
              />
            )}

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setOrdersVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

            <Pressable style={styles.avatarPickerWrapper} onPress={handlePickAvatar}>
              <Image source={{ uri: imageDraft }} style={styles.modalAvatar} />
              <View style={styles.avatarCameraBadge}>
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </Pressable>

            <TextInput
              autoCapitalize="words"
              onChangeText={setNameDraft}
              placeholder="Full name"
              placeholderTextColor="#ADB5BD"
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={nameDraft}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmailDraft}
              placeholder="Email address"
              placeholderTextColor="#ADB5BD"
              style={[styles.input, isDarkMode && styles.darkInput]}
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
          <View style={[styles.modalCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Shipping Addresses</Text>
            <Text style={[styles.addressStatus, isDarkMode && styles.darkMutedText]}>
              {shippingAddress || "No saved address yet."}
            </Text>
            <TextInput
              multiline
              onChangeText={setAddressDraft}
              placeholder="Enter your delivery address"
              placeholderTextColor="#ADB5BD"
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
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  addressText: {
    fontSize: 11,
    color: "#868E96",
    marginLeft: 3,
    flex: 1,
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
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  ordersModalCard: {
    maxHeight: "80%",
    alignItems: "stretch",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#212529",
    marginTop: 10,
    marginBottom: 8,
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
  avatarPickerWrapper: {
    position: "relative",
    marginVertical: 14,
    alignSelf: "center",
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E9ECEF",
  },
  avatarCameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B35",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
    borderColor: "#343A40",
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
  orderItemCard: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FF6B35",
  },
  orderDateText: {
    fontSize: 11,
    color: "#868E96",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "rgba(255, 107, 53, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FF6B35",
  },
  orderDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#212529",
  },
  orderTotalDivider: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginVertical: 8,
  },
  orderTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotalLabel: {
    fontSize: 12,
    color: "#868E96",
  },
  orderPriceText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FF6B35",
  },
  emptyOrdersView: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyOrdersText: {
    fontSize: 13,
    color: "#868E96",
    marginTop: 8,
  },
  modalCloseButton: {
    marginTop: 14,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
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