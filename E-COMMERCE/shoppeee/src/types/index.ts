export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  image: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  image?: string;
}
