import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Heart, Package, ChevronDown, Settings } from 'lucide-react';
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
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                        <p className="text-sm font-black text-gray-900 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <User className="h-4 w-4 mr-3" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <Package className="h-4 w-4 mr-3" /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <Heart className="h-4 w-4 mr-3" /> Wishlist
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <Settings className="h-4 w-4 mr-3" /> Settings
                      </Link>
                      <hr className="my-2 border-gray-50" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" /> Logout
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <span className="text-xl font-black text-gray-900 tracking-tighter">
                  Foodie<span className="text-orange-500">Express</span>
                </span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-6 px-4 space-y-2">
                <div className="pb-6 mb-6 border-b border-gray-50">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search anything..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                <Link to="/category/Food" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                  </div>
                  Food Delivery
                </Link>
                <Link to="/category/Grocery" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  Groceries
                </Link>
                <Link to="/category/Electronics" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  Electronics
                </Link>
                <Link to="/category/Bakery" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-2xl transition-all">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                  </div>
                  Bakery
                </Link>

                <div className="pt-6 mt-6 border-t border-gray-50">
                  <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account</p>
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-gray-700 hover:bg-gray-50 rounded-2xl transition-all">
                        <User className="h-5 w-5 mr-4 text-gray-400" /> Profile
                      </Link>
                      <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-gray-700 hover:bg-gray-50 rounded-2xl transition-all">
                        <Package className="h-5 w-5 mr-4 text-gray-400" /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-4 text-base font-black text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                        <LogOut className="h-5 w-5 mr-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-4 text-base font-black text-orange-600 hover:bg-orange-50 rounded-2xl transition-all">
                      <User className="h-5 w-5 mr-4" /> Login / Register
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-50">
                <button className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/20">
                  Download App
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
