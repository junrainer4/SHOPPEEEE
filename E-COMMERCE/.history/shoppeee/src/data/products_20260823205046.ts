import { Product } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.",
    price: 2499,
    category: "Electronics",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Toxxel_Wireless_Headphones.jpg",
    stock: 24,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Running Shoes",
    description:
      "Lightweight breathable running shoes with responsive cushioning, built for daily training and long-distance comfort.",
    price: 1899,
    category: "Footwear",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Running_shoes.jpg",
    stock: 40,
    rating: 4.2,
  },
  {
    id: "3",
    name: "Smart Watch",
    description:
      "Fitness tracking smartwatch with heart-rate monitor, sleep tracking, and a vivid always-on AMOLED display.",
    price: 3599,
    category: "Electronics",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Smartwatch.jpg",
    stock: 15,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Canvas Backpack",
    description:
      "Durable water-resistant canvas backpack with padded laptop sleeve, perfect for school, work, or travel.",
    price: 1299,
    category: "Accessories",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/HighKey_Backpack.png",
    stock: 32,
    rating: 4.3,
  },
  {
    id: "5",
    name: "Stainless Water Bottle",
    description:
      "Vacuum-insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 599,
    category: "Accessories",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Stainless_Steel_Water_Bottle.jpg",
    stock: 60,
    rating: 4.6,
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    description:
      "Compact 75% mechanical keyboard with hot-swappable switches and per-key RGB backlighting.",
    price: 2899,
    category: "Electronics",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mechanical_Keyboard.jpg",
    stock: 18,
    rating: 4.4,
  },
  {
    id: "7",
    name: "Denim Jacket",
    description:
      "Classic fit denim jacket made from soft washed cotton, a versatile layer for any season.",
    price: 1699,
    category: "Clothing",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Denim_Jacket_(51079649933).jpg",
    stock: 22,
    rating: 4.1,
  },
  {
    id: "8",
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe, 350ml capacity each.",
    price: 799,
    category: "Home",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ceramic_mug.jpg",
    stock: 50,
    rating: 4.8,
  },
];

export const CATEGORIES = [
  "All",
  "Electronics",
  "Footwear",
  "Accessories",
  "Clothing",
  "Home",
];