import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Heart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="text-2xl font-black text-gray-900 hidden sm:block tracking-tighter">
              Foodie<span className="text-orange-500">Express</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-12">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-6 py-3.5 border-2 border-gray-50 rounded-2xl bg-gray-50 text-sm font-bold placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-orange-500/30 focus:bg-white transition-all shadow-sm"
                placeholder="Search for food, groceries, tech..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative p-3 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-2xl transition-all">
              <ShoppingCart className="h-7 w-7" />
              {totalItems > 0 && (
                <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-50 border-2 border-transparent hover:border-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <span className="text-sm font-black text-gray-900 hidden lg:block tracking-tight">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                    >
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4 mr-2" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Package className="h-4 w-4 mr-2" /> Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Heart className="h-4 w-4 mr-2" /> Wishlist
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-orange-500 transition-all shadow-xl shadow-black/10"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-orange-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <div className="py-3">
                <input
                  type="text"
                  className="block w-full px-4 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm"
                  placeholder="Search..."
                />
              </div>
              <Link to="/category/Food" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Food</Link>
              <Link to="/category/Grocery" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Grocery</Link>
              <Link to="/category/Electronics" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Electronics</Link>
              <Link to="/category/Bakery" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Bakery</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
