export type Category = 'Food' | 'Grocery' | 'Electronics' | 'Bakery';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  favoriteProductIds: string[];
  favoriteVendorIds: string[];
}

export interface Address {
  id: string;
  label: string; // Home, Office, etc.
  street: string;
  city: string;
  isDefault: boolean;
}

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g. Size, Crust, Color
  options: VariationOption[];
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  category: Category;
  rating: number;
  reviewCount: number;
  minOrder: number;
  deliveryTime: string;
  deliveryFee: number;
  address: string;
  isOpen: boolean;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string; // Sub-category within the store
  rating: number;
  isAvailable: boolean;
  isPopular?: boolean;
  variations?: ProductVariation[];
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for cart item (product + variations)
  quantity: number;
  vendorName: string;
  selectedOptions?: Record<string, VariationOption>;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled';
  createdAt: string;
  deliveryAddress: Address;
  paymentMethod: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}
