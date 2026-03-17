import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address, Order } from '../types';

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  setDefaultAddress: (addressId: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  toggleFavoriteProduct: (productId: string) => void;
  toggleFavoriteVendor: (vendorId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('foodie_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure favorites exist for legacy stored users
      if (!parsedUser.favoriteProductIds) parsedUser.favoriteProductIds = [];
      if (!parsedUser.favoriteVendorIds) parsedUser.favoriteVendorIds = [];
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    const storedOrders = localStorage.getItem('foodie_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodie_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('foodie_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (email: string, name: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      addresses: [],
      favoriteProductIds: [],
      favoriteVendorIds: [],
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    setIsAuthenticated(false);
    localStorage.removeItem('foodie_user');
    localStorage.removeItem('foodie_orders');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: Math.random().toString(36).substr(2, 9),
      };
      setUser({
        ...user,
        addresses: [...user.addresses, newAddress],
      });
    }
  };

  const setDefaultAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      setUser({
        ...user,
        addresses: updatedAddresses,
      });
    }
  };

  const toggleFavoriteProduct = (productId: string) => {
    if (!user) return;
    const isFavorite = user.favoriteProductIds.includes(productId);
    const updatedFavorites = isFavorite
      ? user.favoriteProductIds.filter(id => id !== productId)
      : [...user.favoriteProductIds, productId];
    
    setUser({
      ...user,
      favoriteProductIds: updatedFavorites
    });
  };

  const toggleFavoriteVendor = (vendorId: string) => {
    if (!user) return;
    const isFavorite = user.favoriteVendorIds.includes(vendorId);
    const updatedFavorites = isFavorite
      ? user.favoriteVendorIds.filter(id => id !== vendorId)
      : [...user.favoriteVendorIds, vendorId];
    
    setUser({
      ...user,
      favoriteVendorIds: updatedFavorites
    });
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `FE-${Math.floor(Math.random() * 1000000)}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      orders,
      login, 
      logout, 
      updateProfile, 
      addAddress, 
      setDefaultAddress, 
      placeOrder,
      toggleFavoriteProduct,
      toggleFavoriteVendor,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
