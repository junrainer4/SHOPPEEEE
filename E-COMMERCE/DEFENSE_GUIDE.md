# 🎓 React Native E-Commerce App ("Nova") – Complete Defense & Code Guide

> 💡 **Tip for Defense:** Keep your verbal answers short (1–2 sentences). Focus on **what it is**, **what it does**, and **where to find it in the code**.

---

## 📁 SECTION 1: Project Structure & File System

### ❓ "Why did you create a `src/` folder?"
* **Answer:** *"Expo Router treats everything inside `app/` as a navigation route. We created `src/` to separate our business logic, contexts, components, and types from our screens (**Separation of Concerns**)."*

### ❓ "What kind of logic is inside `src/`? Can you give an example?"
* **Simple Answer:** *"The logic in `src/` is the math, rules, and memory behind the scenes — keeping our visual screens clean and focused only on UI layout."*

| Logic Type | What It Does | Exact File & Lines (Start – End) |
|---|---|---|
| **1. The Rules (Form Validation)** | Checks that product names have $\ge 3$ letters, prices are $> 0$, and stock is $\ge 0$ before saving. | `src/utils/validateProduct.ts:3–43` |
| **2. The Math (Cart Grand Total)** | Automatically computes `Price × Quantity` across all cart items using `cart.reduce(...)`. | `src/context/CartContext.tsx:65–68` |
| **3. Safety Bounds (Quantity Stepper)** | Prevents item counts from dropping below 1 or exceeding current product stock. | `src/context/CartContext.tsx:43–56` |
| **4. Database Memory (Product CRUD)** | Generates unique IDs and handles adding, updating, and deleting products in storage. | `src/context/ProductContext.tsx:51–86` |

---

### ❓ "What is the difference between `.ts` and `.tsx`?"
* **Answer:** *"**`.ts`** is for pure logic, data, and TypeScript types (no visual tags). **`.tsx`** is for React components containing visual JSX UI elements like `<View>` and `<Text>`."*

```text
📁 shoppeee/
├── 📁 app/ (Navigation & 8 Screens)
│   ├── _layout.tsx           -> Root Stack Navigator & Theme Provider
│   ├── index.tsx             -> Entry redirect to /login
│   ├── login.tsx             -> 1. Login Screen
│   ├── add.tsx               -> 2. Add Product Screen
│   ├── cart.tsx              -> 3. Shopping Cart Screen
│   ├── (tabs)/
│   │   ├── _layout.tsx       -> Bottom Tab Navigator (Home, Explore, Profile)
│   │   ├── index.tsx         -> 4. Home Screen (Product Grid & Search)
│   │   ├── explore.tsx       -> 5. Explore Screen (Sorted & Filtered List)
│   │   └── profile.tsx       -> 6. Profile & Settings Screen
│   ├── product/[id].tsx      -> 7. Product Details Screen (Dynamic Route)
│   └── edit/[id].tsx         -> 8. Edit Product Screen (Dynamic Route)
│
└── 📁 src/ (Logic & Reusable Code)
    ├── types/index.ts        -> (.ts) TypeScript Interfaces (Product, CartItem)
    ├── data/products.ts      -> (.ts) Mock dataset & category list
    ├── context/              -> (.tsx) 4 Global Contexts (Product, Cart, Order, Theme)
    ├── components/           -> (.tsx) FormField, ProductCard, QuantityStepper
    └── utils/validateProduct.ts -> (.ts) Form validation rules engine
```

---

## 📋 SECTION 2: Teacher's 5 Instructions Direct Mapping (Where to Show in Code)

### 1️⃣ React Native Components
*Your project demonstrates the use of all required components + bonus components with exact start–end line ranges:*

| Component | File & Exact Lines (Start – End) | Purpose in the App |
|---|---|---|
| **`View`** | `src/components/ProductCard.tsx:30–53` & `55–71`<br>`app/(tabs)/index.tsx:80–248` | Fundamental layout container & Flexbox alignment |
| **`Text`** | `src/components/ProductCard.tsx:56–58` (Name) & `63` (Price)<br>`app/(tabs)/index.tsx:95` (Title) & `109` (Badge) | Renders typography, labels, prices, and titles |
| **`TextInput`** | `src/components/FormField.tsx:26–39`<br>`app/login.tsx:60–69` (Email) & `74–82` (Password)<br>`app/(tabs)/index.tsx:129–137` (Search) | Controlled user text inputs (Name, Price, Search, Login) |
| **`Pressable`** | `src/components/ProductCard.tsx:22–72`<br>`app/add.tsx:279–292` (Submit button)<br>`app/login.tsx:91–93` (Sign In button) | Modern touch button interactions & pressed states |
| **`Image`** | `src/components/ProductCard.tsx:32–37`<br>`app/product/[id].tsx:138–143`<br>`app/cart.tsx:21` | Displays product photos with `onError` fallback placeholder |
| **`ScrollView`** | `app/add.tsx:136–293`<br>`app/login.tsx:45–95`<br>`app/product/[id].tsx:135–259` | Scrollable container for forms and screens longer than viewport |
| **`FlatList`** | `app/(tabs)/index.tsx:234–246` (2-Column Grid)<br>`app/(tabs)/index.tsx:183–216` (Horizontal Categories)<br>`app/cart.tsx:69–74` (Cart Items List) | High-performance virtualized 2-column grid & Cart list |
| **`SafeAreaView`** | `app/login.tsx:26–97`<br>`app/add.tsx:135–294`<br>`app/cart.tsx:49–87`<br>`app/product/[id].tsx:110–369` | Protects UI from phone notches, camera punch holes, and home bars |
| **`ActivityIndicator`** | `app/(tabs)/index.tsx:221`<br>`app/add.tsx:285` | Circular loading spinner during async actions and form saves |
| **`Modal`** | `app/product/[id].tsx:262–340` (Order Summary Modal)<br>`app/product/[id].tsx:342–368` (Success Modal)<br>`app/(tabs)/profile.tsx:234–306` (Order History Modal) | Pop-up overlay windows controlled by boolean `visible` state |
| **`Alert`** | `app/product/[id].tsx:85–101` (Delete Confirmation)<br>`app/add.tsx:70` & `103` (Validation Error)<br>`app/login.tsx:18–19` (Empty fields error) | Native confirmation dialogs and validation error alerts |
| **`Switch`** *(Extra)* | `app/(tabs)/profile.tsx:187–193` | Interactive Dark / Light mode toggle switch |
| **`KeyboardAvoidingView`** *(Extra)* | `app/login.tsx:41–96` | Automatically lifts form inputs above the virtual keyboard |

---

### 2️⃣ Navigation (React Navigation / Expo Router)
*Your project implements **both Stack and Tab navigation**, with **8 total screens** (exceeds the 4 minimum):*

* **Navigation Types Used:**
  * **Stack Navigation:** `app/_layout.tsx:15–103` (Master screen hierarchy, header bars, and back buttons).
  * **Bottom Tab Navigation:** `app/(tabs)/_layout.tsx:11–71` (Persistent tabs: Home 🏠, Explore 🧭, and Profile 👤).

* **The 8 Screens:**
  1. **Home Screen:** `app/(tabs)/index.tsx` (Product grid & real-time search)
  2. **List / Product Screen:** `app/(tabs)/explore.tsx` (1-column sorted catalog & FAB button)
  3. **Add / Create Screen:** `app/add.tsx` (Add Product form with image picker)
  4. **Details Screen:** `app/product/[id].tsx` (Dynamic route with buy now & delete)
  5. **Edit Screen:** `app/edit/[id].tsx` (Dynamic route pre-filled for editing)
  6. **Profile Screen:** `app/(tabs)/profile.tsx` (User stats, dark mode, order history modal)
  7. **Login Screen:** `app/login.tsx` (Initial sign-in screen)
  8. **Cart Screen:** `app/cart.tsx` (Shopping cart with quantity stepper and total calculation)

---

### 3️⃣ Passing Data Between Screens (Navigation Parameters)

* **Passing the Parameter:**
  * From Home to Details: `app/(tabs)/index.tsx:243` $\rightarrow$ `router.push('/product/' + item.id)`
  * From Explore to Details: `app/(tabs)/explore.tsx:43` $\rightarrow$ `router.push('/product/' + item.id)`
  * From Details to Edit: `app/product/[id].tsx:205` $\rightarrow$ `router.push('/edit/' + product.id)`

* **Receiving the Parameter:**
  * In Details Screen: `app/product/[id].tsx:15` $\rightarrow$ `const { id } = useLocalSearchParams<{ id: string }>()`
  * In Edit Screen: `app/edit/[id].tsx:23` $\rightarrow$ `const { id } = useLocalSearchParams<{ id: string }>()`

---

### 4️⃣ User Input and State Management

* **Local Component State (`useState`):**
  * `app/add.tsx:18–27` $\rightarrow$ `form` object manages inputs for Name, Description, Price, Category, Stock, and Photo.
  * `app/(tabs)/index.tsx:16` $\rightarrow$ `search` state manages real-time query text.
  * `app/login.tsx:12–14` $\rightarrow$ `email`, `password`, and `showPassword` toggle.

* **Global State Management (4 React Contexts):**
  * `src/context/ProductContext.tsx:21–108` $\rightarrow$ Global CRUD operations (`addProduct`, `updateProduct`, `deleteProduct`).
  * `src/context/CartContext.tsx:16–84` $\rightarrow$ Global Cart state (`cart`, `totalAmount`, `totalItems`).
  * `src/context/OrderContext.tsx` $\rightarrow$ Global Order history records.
  * `src/context/ThemeContext.tsx:11–32` $\rightarrow$ Global Dark / Light mode toggle state.

---

### 5️⃣ Form Validation

* **Validation Rules Engine:** `src/utils/validateProduct.ts:3–43`
  * **Name**: Required & minimum 3 characters (`lines 6–10`).
  * **Description**: Required & minimum 10 characters (`lines 12–16`).
  * **Price**: Required & must be a positive number $> 0$ (`lines 18–22`).
  * **Stock**: Required & must be a whole integer $\ge 0$ (`lines 28–36`).
  * **Category**: Required (`lines 24–26`).
  * **Image**: Photo is required (`lines 38–40`).

* **Enforcing Validation Before Saving / Updating:**
  * **In Add Product (`app/add.tsx:98–105`):**
    ```tsx
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);
    if (!isFormValid(validationErrors)) {
      Alert.alert("Check the form", "Please fix the highlighted fields.");
      return; // Stops here, does NOT save to context
    }
    await addProduct(...); // Only saves if 100% valid
    ```
  * **In Edit Product (`app/edit/[id].tsx:102–110`):**
    ```tsx
    const validationErrors = validateProduct(form);
    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors);
      return; // Stops here, does NOT update
    }
    await updateProduct(...); // Only updates if valid
    ```

---

## 🧬 SECTION 3: Master Code-by-Code Breakdown (Every Visual File)

---

### 1. 📄 `app/login.tsx` (Login Screen)

#### A. State Hooks (Email, Password, Show/Hide Password)
```tsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
```
* **What it is:** Local memory for the login inputs (`lines 12–14`).
* **What it does:** Saves the typed email and password in real time; `showPassword` toggles password masking (`secureTextEntry`).
* **Visual Output:** Populates what is typed in the boxes and toggles the eye icon 👁️.

#### B. `handleLogin` Function
```tsx
const handleLogin = () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert("Error", "Please enter both email and password.");
    return;
  }
  router.replace("/(tabs)");
};
```
* **What it is:** Form submit trigger (`lines 16–23`).
* **What it does:** Verifies fields aren't blank. If valid, replaces the screen with the main `(tabs)` Home screen so the user cannot press "Back" to return to login.

#### C. Visual Layout (JSX) (`lines 26–97`)
* **Cart Badge & Title:** Orange icon box + *"Welcome to Nova"*.
* **Inputs:** Email input (`lines 60–69`) with mail icon; Password input (`lines 74–82`) with lock icon + eye pressable.
* **Button:** Orange *"Sign In"* button (`lines 91–93`) that executes `handleLogin`.

---

### 2. 📄 `app/(tabs)/index.tsx` (Home Screen)

#### A. State & Hooks (Search, Category, Loading)
```tsx
const { products } = useProducts();
const { totalItems } = useCart();
const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");
const [isLoading, setIsLoading] = useState(true);
```
* **What it is:** Home screen variables and global context listeners (`lines 23–29`).
* **What it does:** Listens for products from `ProductContext` and cart item count; stores current search query and active category chip.

#### B. Search & Filter Calculations (`useMemo`)
```tsx
const filteredProducts = useMemo(() => {
  return products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [products, search, category]);
```
* **What it is:** Real-time product search & category filter engine (`lines 46–54`).
* **What it does:** Instantly filters the catalog whenever the user types in the search bar or taps a category.

#### C. Search Highlight Function (`renderHighlightedText`)
```tsx
const renderHighlightedText = (text: string, query: string, baseStyle: any) => { ... }
```
* **What it is:** Text formatting helper using Regular Expressions (`lines 65–87`).
* **What it does:** Splits product names and highlights matching letters in orange bold text.

#### D. Visual Layout (JSX) (`lines 80–248`)
* **Header:** "Nova" brand title + Cart icon button with active red badge counter (`totalItems`).
* **Search Input:** Search icon, clear `(X)` button, and real-time autocomplete suggestions (`lines 129–137`).
* **Category Bar:** Horizontal `<FlatList horizontal>` of filter chips (`lines 183–216`).
* **Product Grid:** 2-column `<FlatList numColumns={2}>` rendering `<ProductCard>` components (`lines 234–246`).

---

### 3. 📄 `app/(tabs)/explore.tsx` (Explore Screen)

#### A. Sort Options & State
```tsx
type SortKey = "default" | "priceAsc" | "priceDesc" | "rating";
const [sortKey, setSortKey] = useState<SortKey>("default");
```
* **What it is:** Active sorting filter tracker (`lines 10–23`).
* **What it does:** Remembers whether the user wants products sorted by *Featured, Cheapest, Most expensive, or Top Rated*.

#### B. Sorting Engine (`useMemo`)
```tsx
const sortedProducts = useMemo(() => {
  const list = [...products];
  switch (sortKey) {
    case "priceAsc": return list.sort((a, b) => a.price - b.price);
    case "priceDesc": return list.sort((a, b) => b.price - a.price);
    case "rating": return list.sort((a, b) => b.rating - a.rating);
    default: return list;
  }
}, [products, sortKey]);
```
* **What it is:** Sorting algorithm (`lines 25–37`).
* **What it does:** Clones the product list and sorts it mathematically by price or rating.

#### C. Visual Layout (JSX) (`lines 48–124`)
* **Top Header:** "Explore Catalog" title.
* **Filter Pills:** Clickable sort buttons (*Featured, Cheapest, Most Expensive, Top Rated*).
* **1-Column List:** Vertical rows of products showing photo, name, category, price, and ⭐ rating (`lines 112–118`).
* **FAB Button:** Floating round orange `+` button in bottom corner to open the Add Screen (`lines 120–122`).

---

### 4. 📄 `app/(tabs)/profile.tsx` (Profile Screen)

#### A. Theme & Order Hooks
```tsx
const { isDarkMode, toggleDarkMode } = useTheme();
const { orders } = useOrders();
const [showOrdersModal, setShowOrdersModal] = useState(false);
```
* **What it is:** User preferences and order history listeners (`lines 20–25`).
* **What it does:** Connects to `ThemeContext` for dark mode and `OrderContext` for past purchases.

#### B. User Stats Calculations
```tsx
const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
const totalOrders = orders.length;
```
* **What it is:** Summary statistics (`lines 35–40`).
* **What it does:** Sums up the price of all completed orders.

#### C. Visual Layout (JSX) (`lines 135–245`)
* **User Profile Card:** Avatar photo, user name ("Rainer"), and email.
* **Quick Stats Cards:** Side-by-side boxes showing *Total Spent (₱)* and *Total Orders*.
* **Dark Mode Switch:** `<Switch>` component that flips the theme instantly (`lines 187–193`).
* **"My Order History" Button:** Opens a `<Modal>` with past receipts and items bought (`lines 234–306`).
* **"Sign Out" Button:** Red button that runs `router.replace("/login")` (`lines 226–231`).

---

### 5. 📄 `app/product/[id].tsx` (Product Details Screen)

#### A. Route Parameters & Product Lookup
```tsx
const { id } = useLocalSearchParams<{ id: string }>();
const product = id ? getProductById(id) : undefined;
const [quantity, setQuantity] = useState(1);
const [showCheckoutModal, setShowCheckoutModal] = useState(false);
```
* **What it is:** Dynamic route reader and screen state (`lines 15–25`).
* **What it does:** Reads the `[id]` from the URL, fetches the exact product data from `ProductContext`, and tracks quantity.

#### B. Action Handlers (`handleAddToCart`, `handleConfirmOrder`, `handleDelete`)
```tsx
const handleAddToCart = () => { addToCart(product, quantity); };
const handleConfirmOrder = () => { addOrder(...); setShowCheckoutModal(false); setShowSuccessModal(true); };
const handleDelete = () => { ... deleteProduct(product.id); removeFromCart(product.id); router.replace("/(tabs)"); };
```
* **What it is:** User interaction functions (`lines 57–102`).
* **What it does:** Adds to cart, creates a checkout order record, or confirms product deletion across Web & Mobile.

#### C. Visual Layout (JSX) (`lines 110–369`)
* **Hero Image:** Full-width product photo with `onError` fallback icon (`lines 138–143`).
* **Info Section:** Name, category chip, rating stars, price, and full description.
* **Quantity Selector:** `<QuantityStepper>` to choose amount (`lines 230–237`).
* **Action Buttons:** *"Add to Cart"*, *"Buy Now"*, *"Edit Product"*, and *"Delete"*.
* **Modals:** Buy Now Checkout Summary popup (`lines 262–340`) & Order Success popup (`lines 342–368`).

---

### 6. 📄 `app/add.tsx` (Add Product Screen)

#### A. Form State Object
```tsx
const [form, setForm] = useState<ProductFormValues>({
  name: "", description: "", price: "", category: "", stock: "", image: ""
});
const [errors, setErrors] = useState<ProductFormErrors>({});
```
* **What it is:** Input storage memory (`lines 18–27`).
* **What it does:** Holds the typed values for the 6 product attributes and stores validation error strings.

#### B. `handleChange` Function
```tsx
const handleChange = (field: keyof ProductFormValues, value: string) => {
  setForm((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: undefined }));
};
```
* **What it is:** Keystroke synchronizer (`lines 43–46`).
* **What it does:** Updates the specific field being typed in and clears any red error label under that field.

#### C. `handlePickImage` Function
```tsx
const handlePickImage = async () => { ... ImagePicker.launchImageLibraryAsync(...) }
```
* **What it is:** Image gallery launcher (`lines 48–92`).
* **What it does:** Launches the device's photo gallery (or web file input) and saves the image URI into `form.image`.

#### D. `handleSubmit` Function
```tsx
const handleSubmit = async () => {
  const validationErrors = validateProduct(form);
  setErrors(validationErrors);
  if (!isFormValid(validationErrors)) { Alert.alert("Check the form", "Please fix the highlighted fields."); return; }
  await addProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
  router.replace("/(tabs)");
};
```
* **What it is:** Form validator & database saver (`lines 98–132`).
* **What it does:** Runs `validateProduct()`. If valid, converts numbers and saves the new item to `ProductContext`.

#### E. Visual Layout (JSX) (`lines 135–294`)
* **Image Upload Box:** Square dashed box with camera icon or chosen image preview (`lines 145–171`).
* **Form Inputs:** `<FormField>` components for Name, Price, Stock, Description (`lines 174–277`).
* **Category Selector:** Clickable category chips or `+ Other` custom category input.
* **Submit Button:** Orange *"Add Product"* button with `<ActivityIndicator>` loading spinner (`lines 279–292`).

---

### 7. 📄 `app/edit/[id].tsx` (Edit Product Screen)

#### A. Pre-fill State
```tsx
const { id } = useLocalSearchParams<{ id: string }>();
const product = id ? getProductById(id) : undefined;
const [form, setForm] = useState<ProductFormValues>({
  name: product?.name ?? "",
  price: String(product?.price ?? ""),
  ...
});
```
* **What it is:** Update form initialized with existing data (`lines 23–36`).
* **What it does:** Reads the existing product and fills all inputs so the user only edits what they want to change.

#### B. `handleUpdate` Function
```tsx
const handleUpdate = async () => {
  await updateProduct(id, { ...form, price: Number(form.price), stock: Number(form.stock) });
  router.back();
};
```
* **What it is:** Modification saver (`lines 97–125`).
* **What it does:** Updates the product record in `ProductContext` and returns to the previous screen.

---

### 8. 📄 `app/cart.tsx` (Shopping Cart Screen)

#### A. Cart Hook
```tsx
const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
```
* **What it is:** Global shopping cart listener (`line 13`).
* **What it does:** Reads the list of added items and the calculated grand total.

#### B. `renderItem` Function
```tsx
const renderItem = ({ item }: { item: CartItem }) => (
  <View style={styles.cartCard}>
    <Image source={{ uri: item.product.image }} style={styles.image} />
    <Text>{item.product.name}</Text>
    <Text>₱{item.product.price}</Text>
    <QuantityStepper quantity={item.quantity} onIncrement={...} onDecrement={...} />
    <Pressable onPress={() => removeFromCart(item.product.id)}><Ionicons name="trash-outline" /></Pressable>
  </View>
);
```
* **What it is:** Individual cart row renderer (`lines 16–46`).
* **What it does:** Formats each product with its image, price, quantity selector, and red trash delete button.

#### C. Visual Layout (JSX) (`lines 48–88`)
* **Empty Cart View:** Shows cart icon + *"Your cart is empty"* + *"Start Shopping"* button if `cart.length === 0` (`lines 50–66`).
* **Cart List:** `<FlatList>` of item rows if items exist (`lines 69–74`).
* **Sticky Footer:** Bottom bar with **Total Amount (₱)** and checkout summary (`lines 75–85`).

---

### 9. 📄 `app/_layout.tsx` (Root Stack Navigation)

```tsx
<ThemeProvider>
  <ProductProvider>
    <CartProvider>
      <OrderProvider>
        <Stack screenOptions={{ ... }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ title: "My Cart" }} />
          <Stack.Screen name="add" options={{ title: "Add Product" }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        </Stack>
      </OrderProvider>
    </CartProvider>
  </ProductProvider>
</ThemeProvider>
```
* **What it is:** The root application wrapper (`lines 15–117`).
* **What it does:** Wraps all 4 Context Providers around the app and defines the Master Stack navigation hierarchy, headers, and theme colors.

---

### 10. 📄 `app/(tabs)/_layout.tsx` (Bottom Tab Navigation)

```tsx
<Tabs screenOptions={{ tabBarActiveTintColor: "#FF6B35", ... }}>
  <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ... }} />
  <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: ... }} />
  <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ... }} />
</Tabs>
```
* **What it is:** Bottom Tab Bar controller (`lines 11–71`).
* **What it does:** Configures the 3 persistent bottom tabs: **Home 🏠**, **Explore 🧭**, and **Profile 👤**.

---

### 11. 📄 `src/components/ProductCard.tsx` (Reusable Card)

```tsx
const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} onError={() => setImageError(true)} />
      {product.stock === 0 && <Badge text="Out of stock" />}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>
      <StarRating rating={product.rating} />
    </Pressable>
  );
};
```
* **What it is:** Reusable product box component (`lines 12–74`).
* **What it does:** Renders a 2-column card with image fallback, stock badge, title, formatted price (`toLocaleString()`), and star rating.

---

### 12. 📄 `src/components/QuantityStepper.tsx` (Quantity Selector)

```tsx
const QuantityStepper: React.FC<Props> = ({ quantity, onIncrement, onDecrement, max }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onDecrement} disabled={quantity <= 1}><Text>-</Text></Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable onPress={onIncrement} disabled={quantity >= max}><Text>+</Text></Pressable>
    </View>
  );
};
```
* **What it is:** Reusable `[-] 1 [+]` widget (`lines 13–46`).
* **What it does:** Adjusts item counts with safety bounds (minimum 1, maximum product stock).

---

### 13. 📄 `src/components/FormField.tsx` (Form Input with Error)

```tsx
const FormField: React.FC<Props> = ({ label, value, onChangeText, error, ... }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, error && styles.inputError]} value={value} onChangeText={onChangeText} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
```
* **What it is:** Standardized text input box (`lines 14–48`).
* **What it does:** Renders a field title, input box with red border on error, and red error text underneath.

---

## 🔄 SECTION 4: App Flow in 3 Sentences

1. **Navigation:** `_layout.tsx` loads the global contexts and opens `login.tsx`, which navigates into the `(tabs)` bottom navigator upon sign-in.
2. **Passing Data:** Tapping a product runs `router.push('/product/' + id)`, and `product/[id].tsx` reads it using `useLocalSearchParams()`.
3. **State Management:** Adding products or updating cart items updates global Context (`ProductContext` & `CartContext`), immediately syncing state across all screens.

---

## ⚡ SECTION 5: Quick-Fire Defense Q&A (Short & Punchy)

### Part A: Components & Styling
1. **Q: Why use `FlatList` instead of `ScrollView` for product lists?**
   > *`FlatList` uses virtualization to render only visible items on screen, saving memory. `ScrollView` renders all items at once, which causes lag on large lists.*

2. **Q: How does your app handle broken image URLs?**
   > *We use the `onError` prop on `<Image>` to toggle a state and render a fallback placeholder icon (`ProductCard.tsx:36`).*

3. **Q: How does Dark Mode work in your styles?**
   > *We read `isDarkMode` from `useTheme()` and use ternary operators like `backgroundColor: isDarkMode ? "#202426" : "#FFFFFF"`.*

4. **Q: Where did you use horizontal scrolling?**
   > *In `app/(tabs)/index.tsx:183–216` for the category filter chips using `<FlatList horizontal showsHorizontalScrollIndicator={false}>`.*

---

### Part B: Navigation & Routes
5. **Q: How many screens are there in your app?**
   > *8 screens: Login, Home, Explore, Profile, Details, Add, Edit, and Cart.*

6. **Q: What is the difference between `router.push()` and `router.replace()`?**
   > *`push()` adds the new screen to the history stack (allowing the Back button to work); `replace()` swaps the current screen (used for Login/Logout so users can't go back).*

7. **Q: How do dynamic routes (`[id].tsx`) work?**
   > *The filename `[id].tsx` creates a parameterized URL. We read the ID from the route using `useLocalSearchParams<{ id: string }>()` in `product/[id].tsx:15`.*

8. **Q: What happens if a user navigates to an invalid product ID?**
   > *`getProductById(id)` returns `undefined`, and the screen gracefully renders a "Product not found" message with a "Go Back" button.*

---

### Part C: State Management & Context
9. **Q: Why did you use React Context instead of local component state?**
   > *To avoid "prop drilling" and share live updates (like Cart item counts and Product CRUD) across completely independent screens.*

10. **Q: What Contexts did you build?**
    > *4 Contexts: `ProductContext` (CRUD operations), `CartContext` (Cart items & totals), `OrderContext` (Order history), and `ThemeContext` (Dark/Light mode).*

11. **Q: How is the total cart amount calculated?**
    > *Using `cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)` in `CartContext.tsx`.*

12. **Q: How does the Quantity Stepper work?**
    > *In `src/components/QuantityStepper.tsx`, plus/minus buttons update quantity bounded by `max={stock}` and a minimum of `1`.*

---

### Part D: Form Handling & Validation
13. **Q: Where is form validation located?**
    > *In `src/utils/validateProduct.ts` inside the `validateProduct()` function.*

14. **Q: What validation rules did you implement?**
    > *Name (≥3 chars), Description (≥10 chars), Price (>0 number), Stock (≥0 whole number), Category (required), and Image (required).*

15. **Q: How do you prevent submission of invalid inputs?**
    > *In `app/add.tsx:98–105`, we run `validateProduct(form)`; if any errors exist, we trigger an `Alert` popup and stop execution before calling `addProduct()`.*
