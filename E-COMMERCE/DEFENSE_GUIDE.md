# 🎓 React Native E-Commerce App ("Nova") – Complete Defense & Code Guide

> **Defense Tip:** Keep verbal answers short (1–2 sentences). Focus on **what it is**, **what it does**, and **where to find it in the code**.

---

# TABLE OF CONTENTS
1. **SECTION 1:** Project Architecture & File System (`app/` vs `src/`)
2. **SECTION 2:** How Screens Are Connected & Navigation Explained
3. **SECTION 3:** Teacher's 5 Core Instructions & Exact Code Mapping
4. **SECTION 4:** Elements vs. Components Explained (Core vs Custom Components)
5. **SECTION 5:** Screen-by-Screen Code Breakdown (All 8 Screens)
6. **SECTION 6:** Difference Between `router.push()` and `router.replace()`
7. **SECTION 7:** Master UI & "CSS" Styling Index (Screens, Products, Cards, Buttons, Inputs, Icons, Modals)
8. **SECTION 8:** Rapid-Fire Defense Q&A Cheat Sheet (Short & Punchy)
9. **SECTION 9:** Live Demo Step-by-Step Presentation Script

---

# SECTION 1: Project Architecture & File System

### ❓ Question: "Why did you create a `src/` folder?"
* **Answer:** *"Expo Router treats every file inside `app/` as a navigation route. We created `src/` to separate our business logic, contexts, components, and types from our screens (**Separation of Concerns**)."*

### ❓ Question: "What kind of logic is inside `src/`? Can you give examples?"
* **Answer:** *"The logic inside `src/` handles the rules, math, and memory behind the scenes so that our screen files stay clean and focused only on UI layout."*

### Table 1.1: Business Logic in `src/`
| Logic Category | What It Does | Exact File & Line Range |
|---|---|---|
| **1. The Rules (Form Validation)** | Checks that names have >= 3 letters, prices are > 0, and stock is >= 0 before saving. | `src/utils/validateProduct.ts:3–43` |
| **2. The Math (Cart Grand Total)** | Computes (Price × Quantity) across all cart items using `cart.reduce(...)`. | `src/context/CartContext.tsx:65–68` |
| **3. Safety Bounds (Quantity Stepper)** | Prevents item counts from dropping below 1 or exceeding available product stock. | `src/context/CartContext.tsx:43–56` |
| **4. Memory / Storage (Product CRUD)** | Generates unique IDs and handles adding, updating, and deleting products. | `src/context/ProductContext.tsx:51–86` |

---

### ❓ Question: "What is the difference between `.ts` and `.tsx`?"
* **Answer:** *"**`.ts`** is for pure logic, calculations, data, and TypeScript types (no visual tags). **`.tsx`** is for React components containing visual JSX elements like `<View>`, `<Text>`, and `<Image>`."*

### Directory Layout
```text
shoppeee/
├── app/ (Navigation & 8 Screens)
│   ├── _layout.tsx           -> Root Stack Navigator & Global Context Providers
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
└── src/ (Logic, Data & Reusable Code)
    ├── types/index.ts        -> (.ts) TypeScript Interfaces (Product, CartItem, Order)
    ├── data/products.ts      -> (.ts) Mock dataset & category list
    ├── context/              -> (.tsx) 4 Global Contexts (Product, Cart, Order, Theme)
    ├── components/           -> (.tsx) FormField, ProductCard, QuantityStepper
    └── utils/validateProduct.ts -> (.ts) Form validation rules engine
```

---

# SECTION 2: How Screens Are Connected & Navigation Explained

### ❓ Question: "How did you connect each screen to navigate?"
* **Answer:** *"Our screens are connected in two layers: **structurally** through Expo Router's Stack and Tab layouts, and **programmatically** using the `useRouter()` hook on buttons and cards."*

### Screen Connection Map
```text
[app/index.tsx] 
       │ (Auto-redirect)
       ▼
[app/login.tsx] ────────── router.replace("/(tabs)") ──────────► [app/(tabs)/_layout.tsx]
                                                                        │
                 ┌──────────────────────────────────────────────────────┼───────────────────────────────┐
                 ▼                                                      ▼                               ▼
      [app/(tabs)/index.tsx] (Home)                         [app/(tabs)/explore.tsx]        [app/(tabs)/profile.tsx]
        │                     │                                         │                                │
        │ router.push         │ router.push                             │ router.push                    │ router.replace
        │ ("/cart")           │ (`/product/${id}`)                      │ ("/add")                       │ ("/login")
        ▼                     ▼                                         ▼                                ▼
  [app/cart.tsx]     [app/product/[id].tsx]                       [app/add.tsx]                   [app/login.tsx]
                              │
                              │ router.push(`/edit/${id}`)
                              ▼
                     [app/edit/[id].tsx]
```

### Table 2.1: Exact Screen-to-Screen Connections
| From Screen | Action / Trigger | Code Executed | Destination Screen |
|---|---|---|---|
| **Entry (`index.tsx`)** | App launch | `<Redirect href="/login" />` | `app/login.tsx` |
| **Login (`login.tsx`)** | Tap "Sign In" button | `router.replace("/(tabs)")` | `app/(tabs)/index.tsx` (Home) |
| **Home (`index.tsx`)** | Tap Product Card | `router.push('/product/' + item.id)` | `app/product/[id].tsx` |
| **Home (`index.tsx`)** | Tap Cart Header Icon | `router.push("/cart")` | `app/cart.tsx` |
| **Explore (`explore.tsx`)** | Tap `+` Floating Button | `router.push("/add")` | `app/add.tsx` |
| **Explore (`explore.tsx`)** | Tap Product row | `router.push('/product/' + item.id)` | `app/product/[id].tsx` |
| **Product Details (`[id].tsx`)** | Tap "Edit Product" | `router.push('/edit/' + product.id)` | `app/edit/[id].tsx` |
| **Product Details (`[id].tsx`)** | Tap "Delete Product" | `router.replace("/(tabs)")` | `app/(tabs)/index.tsx` |
| **Add Form (`add.tsx`)** | Submit valid product | `router.replace("/(tabs)")` | `app/(tabs)/index.tsx` |
| **Edit Form (`edit/[id].tsx`)** | Save valid updates | `router.back()` | `app/product/[id].tsx` |
| **Profile (`profile.tsx`)** | Tap "Sign Out" | `router.replace("/login")` | `app/login.tsx` |

---

# SECTION 3: Teacher's 5 Core Instructions & Exact Code Mapping

### 1️⃣ React Native Components
*All required components + bonus UX components implemented:*

| Component | File & Line Range | Purpose in the App |
|---|---|---|
| **`View`** | `src/components/ProductCard.tsx:30–53`<br>`app/(tabs)/index.tsx:80–248` | Container layout & Flexbox alignment |
| **`Text`** | `src/components/ProductCard.tsx:56–63`<br>`app/(tabs)/index.tsx:95, 109` | Typography, product names, badges, prices |
| **`TextInput`** | `src/components/FormField.tsx:26–39`<br>`app/login.tsx:60–82`<br>`app/(tabs)/index.tsx:129–137` | User text entry (Name, Price, Search, Email, Password) |
| **`Pressable`** | `src/components/ProductCard.tsx:22–72`<br>`app/add.tsx:279–292`<br>`app/login.tsx:91–93` | Touch button interactions & press styling |
| **`Image`** | `src/components/ProductCard.tsx:32–37`<br>`app/product/[id].tsx:138–143`<br>`app/cart.tsx:21` | Product image display with `onError` fallback placeholder |
| **`ScrollView`** | `app/add.tsx:136–293`<br>`app/login.tsx:45–95`<br>`app/product/[id].tsx:135–259` | Scrollable container for forms and long product descriptions |
| **`FlatList`** | `app/(tabs)/index.tsx:234–246` (2-Col Grid)<br>`app/(tabs)/index.tsx:183–216` (Horiz Categories)<br>`app/cart.tsx:69–74` (Cart List) | High-performance virtualized 2-column grid and cart list |
| **`SafeAreaView`** | `app/login.tsx:26–97`<br>`app/add.tsx:135–294`<br>`app/cart.tsx:49–87` | Protects UI layout from phone notches and home bars |
| **`ActivityIndicator`** | `app/(tabs)/index.tsx:221`<br>`app/add.tsx:285` | Circular loading spinner during async saves and data loads |
| **`Modal`** | `app/product/[id].tsx:262–340` (Order Summary)<br>`app/product/[id].tsx:342–368` (Success Dialog)<br>`app/(tabs)/profile.tsx:234–306` (Order History) | Pop-up overlay dialogs controlled by boolean state |
| **`Alert`** | `app/product/[id].tsx:85–101` (Delete Confirm)<br>`app/add.tsx:70, 103` (Validation Alert)<br>`app/login.tsx:18–19` (Blank Field Error) | Native confirmation dialogs and validation errors |
| **`Switch`** *(Extra)* | `app/(tabs)/profile.tsx:187–193` | Dark Mode / Light Mode toggle switch |
| **`KeyboardAvoidingView`** *(Extra)* | `app/login.tsx:41–96` | Auto-lifts form fields above the mobile keyboard |

---

### 2️⃣ Navigation (React Navigation / Expo Router)
*Implemented **both Stack and Tab Navigation** with **8 screens** (exceeds 4 minimum):*

1. **Stack Navigation:** Configured in `app/_layout.tsx:15–103` (Master hierarchy & header bars).
2. **Bottom Tab Navigation:** Configured in `app/(tabs)/_layout.tsx:11–71` (Persistent tabs: Home, Explore, Profile).

---

### 3️⃣ Passing Data Between Screens (Navigation Parameters)
* **Passing the Parameter:**
  * From Home to Details: `app/(tabs)/index.tsx:243` -> `router.push('/product/' + item.id)`
  * From Explore to Details: `app/(tabs)/explore.tsx:43` -> `router.push('/product/' + item.id)`
  * From Details to Edit: `app/product/[id].tsx:205` -> `router.push('/edit/' + product.id)`
* **Receiving the Parameter:**
  * In Product Details: `app/product/[id].tsx:15` -> `const { id } = useLocalSearchParams<{ id: string }>()`
  * In Edit Product: `app/edit/[id].tsx:23` -> `const { id } = useLocalSearchParams<{ id: string }>()`

---

### 4️⃣ User Input and State Management
* **Local Component State (`useState`):**
  * `app/add.tsx:18–27` -> Manages `form` inputs for Name, Price, Stock, Category, Description, Image.
  * `app/(tabs)/index.tsx:16` -> Manages live `search` text and active `category`.
  * `app/login.tsx:12–14` -> Manages `email`, `password`, and `showPassword` visibility toggle.
* **Global State Management (4 React Contexts):**
  * `src/context/ProductContext.tsx:21–108` -> CRUD operations (`addProduct`, `updateProduct`, `deleteProduct`).
  * `src/context/CartContext.tsx:16–84` -> Cart items, item count badge, and grand total calculation.
  * `src/context/OrderContext.tsx` -> Saved order history receipts.
  * `src/context/ThemeContext.tsx:11–32` -> Dark / Light mode toggle state.

---

### 5️⃣ Form Validation
* **Validation Rules Engine:** `src/utils/validateProduct.ts:3–43`
  * **Name**: Required, minimum 3 characters.
  * **Description**: Required, minimum 10 characters.
  * **Price**: Required, positive number > 0.
  * **Stock**: Required, whole integer >= 0.
  * **Category & Image**: Mandatory selection/upload.
* **Validation Enforcement Code (`app/add.tsx:98–105`):**
  ```tsx
  const validationErrors = validateProduct(form);
  setErrors(validationErrors);
  if (!isFormValid(validationErrors)) {
    Alert.alert("Check the form", "Please fix the highlighted fields.");
    return; // STOPS execution; does not save invalid data
  }
  await addProduct(...); // ONLY runs if 100% valid
  ```

---

# SECTION 4: Elements vs. Components Explained

### ❓ Question: "What is the difference between an Element and a Component in React?"
* **Answer:** *"A **Component** is the factory function (the blueprint) that accepts props and manages state. A React **Element** is the virtual object produced by JSX (like `<View>` or `<Text>`) describing what should appear on screen."*

### Table 4.1: Component vs. Element Comparison
| Characteristic | React Component | React Element |
|---|---|---|
| **What It Is** | A reusable function or class. | A lightweight JavaScript object describing UI. |
| **The Analogy** | The **Blueprint / Recipe**. | The **Actual Building / Meal**. |
| **Can Have State?** | **YES** (`useState`, hooks, lifecycle). | **NO** (Immutable object). |
| **Code Example** | `const ProductCard: React.FC<Props> = (...) => { ... }` | `<ProductCard product={item} />` or `<Text>Hello</Text>` |

---

### Table 4.2: Built-in Core Components vs. Custom Components

#### A. Core Built-In Components (Provided by React Native)
| React Native Core Component | HTML/Web Equivalent | Purpose in This Project | Where Used in Code |
|---|---|---|---|
| **`<View>`** | `<div>` | Container box for layout and Flexbox positioning | `src/components/ProductCard.tsx:30` |
| **`<Text>`** | `<p>`, `<span>`, `<h1>` | Displays typography, prices, names, and titles | `app/login.tsx:50` |
| **`<TextInput>`** | `<input type="text">` | Controlled input box for text, email, password, and numbers | `src/components/FormField.tsx:26` |
| **`<Pressable>`** | `<button>` | Modern clickable surface with pressed feedback | `app/login.tsx:91` |
| **`<Image>`** | `<img>` | Renders product photos with `onError` fallback handling | `src/components/ProductCard.tsx:32` |
| **`<FlatList>`** | Virtualized `<ul>`/`<li>` | High-performance 2-column product grid and category list | `app/(tabs)/index.tsx:234` |
| **`<ScrollView>`** | Overflow scroll container | Enables scrolling for forms and product detail pages | `app/add.tsx:136` |
| **`<SafeAreaView>`** | Viewport boundary wrapper | Protects screen from device notches, punches, and home bars | `app/login.tsx:26` |
| **`<ActivityIndicator>`** | Spinner loader | Circular loading indicator while async actions execute | `app/add.tsx:285` |
| **`<Modal>`** | Pop-up `<dialog>` | Pop-up overlay for Order Summary and Success receipts | `app/product/[id].tsx:262` |
| **`<Switch>`** | Checkbox toggle switch | Interactive Dark / Light mode toggle switch | `app/(tabs)/profile.tsx:187` |
| **`<KeyboardAvoidingView>`** | Form view lifter | Lifts text inputs above the on-screen mobile keyboard | `app/login.tsx:41` |

#### B. Custom Reusable Components (Created in `src/components/`)
| Custom Component | Props Received | Encapsulated Logic & Visual Features | Where Defined |
|---|---|---|---|
| **`<ProductCard />`** | `product`, `onPress` | Image fallback handling, Out-of-Stock badge, formatted price (`toLocaleString()`), and star rating pill | `src/components/ProductCard.tsx` |
| **`<FormField />`** | `label`, `value`, `onChangeText`, `placeholder`, `error`, `keyboardType` | Label header, styled input box with red error borders, and inline red error text | `src/components/FormField.tsx` |
| **`<QuantityStepper />`** | `quantity`, `onIncrement`, `onDecrement`, `min`, `max` | Minus button, live count text, and Plus button bounded by safety limits (min 1, max stock) | `src/components/QuantityStepper.tsx` |

---

# SECTION 5: Screen-by-Screen Code Breakdown

### 1. `app/login.tsx` (Login Screen)
* **State Hooks (`lines 12–14`):** `email`, `password`, `showPassword` for credential input and password mask toggle.
* **`handleLogin` (`lines 16–23`):** Validates non-empty fields, then executes `router.replace("/(tabs)")`.
* **Visual Components:** Logo icon box, Email input, Password input with eye toggle, orange "Sign In" button.

### 2. `app/(tabs)/index.tsx` (Home Screen)
* **Hooks (`lines 23–29`):** Listens to `useProducts()` and `useCart()`; holds `search` and `category` state.
* **Real-time Filter (`useMemo` lines 46–54):** Instantly filters catalog as the user types or taps categories.
* **Search Highlighting (`lines 65–87`):** Regex splits matched search terms and highlights them in orange bold text.
* **Visual Components:** Brand title, Cart button with dynamic badge counter, Search bar, Category bar, 2-column `<FlatList>`.

### 3. `app/(tabs)/explore.tsx` (Explore Screen)
* **Sorting State (`lines 10–23`):** `sortKey` remembers whether sorting by Featured, Cheapest, Expensive, or Top Rated.
* **Sorting Algorithm (`useMemo` lines 25–37):** Clones product list and mathematically sorts by price/rating.
* **Visual Components:** Filter pill buttons, 1-column list of products with star ratings, floating orange `+` FAB button to Add Product.

### 4. `app/(tabs)/profile.tsx` (Profile Screen)
* **Context Hooks (`lines 20–25`):** `useTheme()` for Dark Mode, `useOrders()` for order receipts.
* **Stats Calculations (`lines 35–40`):** Sums up total spent across all orders and counts total orders.
* **Visual Components:** Avatar card, Total Spent & Total Orders stat boxes, Dark Mode `<Switch>`, "My Order History" `<Modal>`, and "Sign Out" button (`router.replace("/login")`).

### 5. `app/product/[id].tsx` (Product Details Screen)
* **Route Lookup (`lines 15–25`):** Reads `[id]` from URL, retrieves product from `ProductContext`, tracks `quantity`.
* **Action Handlers (`lines 57–102`):** `addToCart()`, `addOrder()` (Buy Now checkout), `deleteProduct()`.
* **Visual Components:** Full-width hero image with error fallback, price/stock info, `<QuantityStepper>`, "Add to Cart", "Buy Now", "Edit", "Delete" buttons, and Order Summary & Success Modals.

### 6. `app/add.tsx` (Add Product Screen)
* **Form State (`lines 18–27`):** Holds `name`, `description`, `price`, `category`, `stock`, `image`, and `errors`.
* **`handlePickImage` (`lines 48–92`):** Opens device photo gallery and saves image URI.
* **`handleSubmit` (`lines 98–132`):** Validates all fields; if valid, calls `addProduct()` and redirects to Home.
* **Visual Components:** Image picker box, `<FormField>` inputs with inline red error messages, category selector chips, Submit button with `<ActivityIndicator>`.

### 7. `app/edit/[id].tsx` (Edit Product Screen)
* **Pre-fill State (`lines 23–36`):** Initializes form with existing product values for easy modification.
* **`handleUpdate` (`lines 97–125`):** Validates changes, calls `updateProduct(id, ...)`, and runs `router.back()`.

### 8. `app/cart.tsx` (Shopping Cart Screen)
* **Cart Hook (`line 13`):** Accesses `cart`, `removeFromCart`, `updateQuantity`, and `totalAmount`.
* **Visual Components:** Empty cart placeholder or `<FlatList>` of items with quantity steppers and trash delete icons; sticky bottom checkout footer with calculated total (₱).

---

# SECTION 6: Difference Between `router.push()` and `router.replace()`

### 🎙️ The 1-Sentence Answer
> *"**`router.push()`** adds a new screen to the top of the history stack so the user can press Back, while **`router.replace()`** replaces and clears the current screen from history so the user cannot go back."*

### Table 6.1: Comparison Matrix
| Characteristic | `router.push()` | `router.replace()` |
|---|---|---|
| **History Stack Effect** | Pushes a new screen on TOP. | Overwrites/swaps the current screen. |
| **Back Button Works?** | **YES** (Returns to previous screen). | **NO** (Cannot return to previous screen). |
| **Where Used in App** | • Home -> Product Details<br>• Details -> Edit Product<br>• Home -> Cart | • Login -> Home (`handleLogin`)<br>• Profile -> Login (*Sign Out*)<br>• After Deleting a Product -> Home |
| **Why Used There** | User needs to go back to browse more. | Prevents user from pressing Back into Login or deleted items. |

---

# SECTION 7: Master UI & "CSS" Styling Index

> **How React Native Styles Work:** React Native does NOT use external `.css` files. Instead, every visual element in JSX is connected to a `StyleSheet.create()` object located at the bottom of the file using camelCase CSS properties.

---

### 1. 📱 Screens & Base Containers
| UI Component | Where in JSX | Style Object in `styles` | Key Style Properties |
|---|---|---|---|
| **Screen Root Container** | `SafeAreaView` in all screens | `styles.container`<br>`styles.darkContainer` | `flex: 1, backgroundColor: "#F8F9FA"` (Light) vs `"#151718"` (Dark) |
| **Scrollable Body** | `ScrollView` in Add, Details, Profile | `styles.scrollContent` | `padding: 18, paddingBottom: 40, flexGrow: 1` |
| **Header Bar** | Top of Details & Profile screens | `styles.header`<br>`styles.darkHeader` | `flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1` |
| **Bottom Tab Bar** | `app/(tabs)/_layout.tsx` | `tabBarStyle` in `Tabs` | `backgroundColor: isDarkMode ? "#202426" : "#FFFFFF", borderTopColor: "#E9ECEF"` |

---

### 2. 🛍️ Product Cards & Images
| UI Component | Where in JSX | Style Object in `styles` | Key Style Properties |
|---|---|---|---|
| **2-Column Product Card** | `src/components/ProductCard.tsx:22` | `styles.card`<br>`styles.darkCard` | `width: "47%", borderRadius: 14, backgroundColor: "#FFFFFF", elevation: 2, shadowOpacity: 0.08` |
| **Product Card Image Box** | `src/components/ProductCard.tsx:30` | `styles.imageBox`<br>`styles.image` | `width: "100%", height: 130, resizeMode: "cover", overflow: "hidden"` |
| **Catalog Row (Explore)** | `app/(tabs)/explore.tsx:88` | `styles.row`<br>`styles.darkRow` | `flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 14, marginBottom: 10` |
| **Row Thumbnail Photo** | `app/(tabs)/explore.tsx:90` | `styles.rowImage` | `width: 56, height: 56, borderRadius: 10` |
| **Hero Image (Details)** | `app/product/[id].tsx:136` | `styles.imageWrapper`<br>`styles.image` | `width: "100%", height: 280, alignItems: "center", justifyContent: "center"` |
| **Image Upload Box (Add)** | `app/add.tsx:145` | `styles.imagePicker`<br>`styles.darkImagePicker` | `width: "100%", height: 160, borderRadius: 14, borderStyle: "dashed", borderWidth: 1` |

---

### 3. 🔘 Buttons & Interactive Steppers
| UI Component | Where in JSX | Style Object in `styles` | Key Style Properties |
|---|---|---|---|
| **Sign In Button** | `app/login.tsx:91` | `styles.loginButton`<br>`styles.loginButtonText` | `backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, alignItems: "center", color: "#FFFFFF", fontWeight: "700"` |
| **Submit / Save Button** | `app/add.tsx:279`<br>`app/edit/[id].tsx:199` | `styles.submitButton`<br>`styles.submitButtonText` | `backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center"` |
| **Buy Now Button** | `app/product/[id].tsx:244` | `styles.buyNowButton`<br>`styles.buyNowText` | `backgroundColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, flex: 1, alignItems: "center"` |
| **Add to Cart (Outline)** | `app/product/[id].tsx:238` | `styles.addToCartOutlineButton` | `borderWidth: 1.5, borderColor: "#FF6B35", borderRadius: 12, paddingVertical: 14, flex: 1` |
| **Floating Action Button (`+`)** | `app/(tabs)/explore.tsx:120` | `styles.fab` | `position: "absolute", right: 20, bottom: 24, width: 54, height: 54, borderRadius: 27, backgroundColor: "#FF6B35", elevation: 4` |
| **Delete Button (Red)** | `app/product/[id].tsx:210` | `styles.deleteButton`<br>`styles.deleteButtonText` | `backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FFC9C9", borderRadius: 12, color: "#E03131", fontWeight: "700"` |
| **Quantity Stepper `[-] 1 [+]`** | `src/components/QuantityStepper.tsx:24` | `styles.container`<br>`styles.button`<br>`styles.quantity` | `flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#DEE2E6", borderRadius: 10, paddingHorizontal: 12` |

---

### 4. 📝 Form Inputs & Text Fields
| UI Component | Where in JSX | Style Object in `styles` | Key Style Properties |
|---|---|---|---|
| **Standard Form Field** | `src/components/FormField.tsx:26` | `styles.input`<br>`styles.inputError` | `borderWidth: 1, borderColor: "#DEE2E6", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14` |
| **Search Bar Input** | `app/(tabs)/index.tsx:129` | `styles.searchWrapper`<br>`styles.searchInput` | `flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, paddingHorizontal: 12` |
| **Search Autocomplete Box** | `app/(tabs)/index.tsx:143` | `styles.suggestionsDropdown` | `position: "absolute", top: 50, left: 16, right: 16, backgroundColor: "#FFFFFF", borderRadius: 12, elevation: 4` |
| **Category Filter Chips** | `app/(tabs)/index.tsx:191` | `styles.chip`<br>`styles.chipActive` | `paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "#E9ECEF", backgroundColor: "#FF6B35" (Active)` |
| **Red Error Text** | `src/components/FormField.tsx:40` | `styles.errorText` | `color: "#E03131", fontSize: 12, marginTop: 4` |

---

### 5. ⭐ Icons & Badges (Ionicons & Overlays)
| UI Component | Where in JSX | Style Object in `styles` | Key Style Properties |
|---|---|---|---|
| **Out of Stock Badge** | `src/components/ProductCard.tsx:49` | `styles.outOfStockBadge`<br>`styles.outOfStockText` | `position: "absolute", top: 8, left: 8, backgroundColor: "#212529", borderRadius: 8, color: "#FFFFFF", fontSize: 10` |
| **Header Cart Counter Badge** | `app/(tabs)/index.tsx:112` | `styles.cartBadge`<br>`styles.cartBadgeText` | `position: "absolute", top: -2, right: -2, backgroundColor: "#FF6B35", minWidth: 18, height: 18, borderRadius: 10, color: "#FFFFFF"` |
| **Star Rating Badge** | `app/product/[id].tsx:149` | `styles.ratingBadge`<br>`styles.ratingText` | `flexDirection: "row", alignItems: "center", backgroundColor: "#FFF9DB", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8` |
| **Password Eye Toggle Icon** | `app/login.tsx:83` | `<Ionicons name={show ? ...} />` | `name="eye-outline" / "eye-off-outline", size={20}, color="#868E96"` |
| **Trash Can Delete Icon** | `app/cart.tsx:43` | `styles.deleteButton` | `<Ionicons name="trash-outline" size={20} color="#E03131" />` |
| **Camera Badge on Avatar** | `app/(tabs)/profile.tsx:210` | `styles.avatarCameraBadge` | `position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: "#FF6B35", borderWidth: 2` |

---

### 6. 🪟 Modals & Popups
| UI Component | Where in JSX | Style Object in `styles` | Key Style Properties |
|---|---|---|---|
| **Darkened Backdrop Overlay** | `app/product/[id].tsx:263` | `styles.modalOverlay` | `flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end"` |
| **Slide-Up Bottom Sheet** | `app/product/[id].tsx:264` | `styles.modalContent`<br>`styles.darkModalContent` | `backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20` |
| **Centered Success Dialog** | `app/product/[id].tsx:343` | `styles.modalOverlayCenter`<br>`styles.successCard` | `backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, alignItems: "center", width: "100%"` |
| **Order Receipt Card** | `app/(tabs)/profile.tsx:254` | `styles.orderItemCard` | `backgroundColor: "#F8F9FA", borderRadius: 12, padding: 14, marginBottom: 10` |

---

# SECTION 8: Rapid-Fire Defense Q&A Cheat Sheet

### Part A: Components & UI
1. **Q: Why use `FlatList` instead of `ScrollView` for product lists?**
   * *A: "`FlatList` uses virtualization to render only items currently visible on the screen, saving memory and preventing lag. `ScrollView` renders every item at once."*
2. **Q: How do you handle broken image URLs?**
   * *A: "We use the `onError` prop on `<Image>` to toggle a state and render a fallback placeholder icon (`ProductCard.tsx:36`)."*
3. **Q: How does Dark Mode work in your styles?**
   * *A: "We read `isDarkMode` from `useTheme()` and use ternary operators like `backgroundColor: isDarkMode ? '#202426' : '#FFFFFF'`."*

### Part B: Navigation & Parameters
4. **Q: How many screens are in your app?**
   * *A: "8 screens: Login, Home, Explore, Profile, Product Details, Add Product, Edit Product, and Cart."*
5. **Q: How do dynamic routes (`[id].tsx`) work?**
   * *A: "The `[id].tsx` filename creates a parameterized URL. We read the parameter using `useLocalSearchParams<{ id: string }>()` in `product/[id].tsx:15`."*
6. **Q: What happens if a user navigates to an invalid product ID?**
   * *A: "`getProductById(id)` returns `undefined`, and the screen gracefully displays a 'Product not found' message with a 'Go Back' button."*

### Part C: State Management & Context
7. **Q: Why use React Context instead of local component state?**
   * *A: "To avoid 'prop drilling' and share live updates (like Cart item counts and newly added products) across completely independent screens."*
8. **Q: What Contexts did you build?**
   * *A: "4 Contexts: `ProductContext` (CRUD), `CartContext` (Cart totals & items), `OrderContext` (Receipts), and `ThemeContext` (Dark/Light mode)."*
9. **Q: How is the grand total calculated in Cart?**
   * *A: "Using `cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)` in `CartContext.tsx`."*

### Part D: Form Validation
10. **Q: Where is form validation located?**
    * *A: "In `src/utils/validateProduct.ts` inside the `validateProduct()` function."*
11. **Q: How do you stop invalid form submissions?**
    * *A: "In `app/add.tsx:98–105`, we run `validateProduct(form)`. If errors exist, we trigger an `Alert` popup and return early before calling `addProduct()`."*

---

# SECTION 9: Live Demo Step-by-Step Presentation Script

Follow this exact flow during your live demonstration:

1. **Step 1: Sign In (`login.tsx`)**
   * Demonstrate blank field validation error alert.
   * Type email & password, tap eye icon to reveal password, and tap **"Sign In"**.
   * *Say: "This runs `router.replace('/(tabs)')` to enter the main app."*

2. **Step 2: Home Screen (`app/(tabs)/index.tsx`)**
   * Type in the search bar (show real-time autocomplete and bold letter highlighting).
   * Tap category chips (show instant filtering).
   * *Say: "The 2-column grid is built using `<FlatList numColumns={2}>` for high performance."*

3. **Step 3: Product Details (`app/product/[id].tsx`)**
   * Tap a product card to open Details.
   * Adjust the quantity using the stepper.
   * Tap **"Add to Cart"** (show the header badge increment).
   * Tap **"Buy Now"** (show the checkout summary `<Modal>` and success popup).

4. **Step 4: Explore & Add Product (`explore.tsx` & `add.tsx`)**
   * Navigate to the Explore tab.
   * Click sort chips (*Cheapest, Top Rated*).
   * Tap the orange floating `+` button to open Add Product.
   * Try submitting an empty form (show red validation text and Alert).
   * Fill out the form, pick an image, and submit.
   * *Say: "The new product is immediately available in the catalog via `ProductContext`."*

5. **Step 5: Cart & Checkout (`cart.tsx`)**
   * Tap the Cart icon.
   * Adjust quantity or remove an item.
   * Point out the automatically calculated Grand Total.

6. **Step 6: Profile & Dark Mode (`profile.tsx`)**
   * Switch to the Profile tab.
   * Toggle the **Dark Mode `<Switch>`** (show the entire app recoloring instantly).
   * Tap **"My Order History"** to show the saved purchase receipt.
   * Tap **"Sign Out"** (show clean return to Login screen via `router.replace('/login')`).
