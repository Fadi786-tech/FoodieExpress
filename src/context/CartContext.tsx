import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Vendor, VariationOption } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, vendor: Vendor, selectedOptions?: Record<string, VariationOption>, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('foodie_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('foodie_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, vendor: Vendor, selectedOptions?: Record<string, VariationOption>, quantity: number = 1) => {
    setItems(prevItems => {
      // Create a unique cartId based on product ID and selected options
      const optionsKey = selectedOptions 
        ? Object.values(selectedOptions).map(o => o.id).sort().join('-')
        : '';
      const cartId = optionsKey ? `${product.id}-${optionsKey}` : product.id;

      const existingItem = prevItems.find(item => item.cartId === cartId);
      
      // Calculate item price including modifiers
      const modifiers = selectedOptions 
        ? Object.values(selectedOptions).reduce((sum, opt) => sum + opt.priceModifier, 0)
        : 0;
      const finalPrice = product.price + modifiers;

      if (existingItem) {
        return prevItems.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { 
        ...product, 
        cartId,
        price: finalPrice, // Store the final price in the cart item
        quantity, 
        vendorName: vendor.name,
        selectedOptions 
      }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Simplified delivery fee: flat rate in PKR if items exist
  const deliveryFee = items.length > 0 ? 150 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      deliveryFee,
      tax,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
