import { Product } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80",
    stock: 18,
    rating: 4.4,
  },
  {
    id: "7",
    name: "Denim Jacket",
    description:
      "Classic fit denim jacket made from soft washed cotton, a versatile layer for any season.",
    price: 1699,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80",
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
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=80",
    stock: 50,
    rating: 4.8,
  },
];

export const CATEGORIES = [
  "All",
  "Electronics",
  "Footwear",
  "Accessories",
  "Apparel",
  "Home",
];
