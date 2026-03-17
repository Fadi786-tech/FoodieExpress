import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowRight, Store, Utensils } from 'lucide-react';
import { PRODUCTS, VENDORS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const { addToCart } = useCart();
  const { user, toggleFavoriteProduct, toggleFavoriteVendor } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'vendors'>('products');

  const favoriteProducts = PRODUCTS.filter(p => user?.favoriteProductIds.includes(p.id));
  const favoriteVendors = VENDORS.filter(v => user?.favoriteVendorIds.includes(v.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">My Favorites</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Items and shops you've saved for later</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center ${
              activeTab === 'products'
                ? 'bg-white dark:bg-gray-900 text-orange-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Utensils className="h-4 w-4 mr-2" />
            Products ({favoriteProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center ${
              activeTab === 'vendors'
                ? 'bg-white dark:bg-gray-900 text-orange-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Store className="h-4 w-4 mr-2" />
            Shops ({favoriteVendors.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.div
            key="products-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteProducts.map((product, idx) => {
                  const vendor = VENDORS.find(v => v.id === product.vendorId);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                    >
                      <div className="relative h-56 md:h-64 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleFavoriteProduct(product.id)}
                          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300 border bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/40"
                        >
                          <Heart className="h-5 w-5 fill-current scale-110" />
                        </motion.button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                          <p className="text-sm text-orange-500 font-medium">{vendor?.name}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                          <button
                            onClick={() => vendor && addToCart(product, vendor)}
                            className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <EmptyState 
                icon={<Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />}
                title="No favorite products yet"
                description="Save items you love to find them later."
                linkText="Explore Products"
                linkTo="/"
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="vendors-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {favoriteVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteVendors.map((vendor, idx) => (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden rounded-[32px]"
                  >
                    <Link to={`/vendor/${vendor.id}`} className="block relative h-48 md:h-56 overflow-hidden">
                      <img src={vendor.coverImage} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavoriteVendor(vendor.id);
                        }}
                        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300 border bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/40"
                      >
                        <Heart className="h-5 w-5 fill-current scale-110" />
                      </motion.button>
                    </Link>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{vendor.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{vendor.description}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
                          <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <Link
                        to={`/vendor/${vendor.id}`}
                        className="w-full bg-gray-900 dark:bg-gray-800 text-white py-3 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
                      >
                        Visit Store <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />}
                title="No favorite shops yet"
                description="Follow your favorite stores to get updates."
                linkText="Explore Shops"
                linkTo="/"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyState: React.FC<{ icon: React.ReactNode, title: string, description: string, linkText: string, linkTo: string }> = ({ icon, title, description, linkText, linkTo }) => (
  <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[40px]">
    {icon}
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mt-2">{description}</p>
    <Link to={linkTo} className="inline-block mt-8 bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all">
      {linkText}
    </Link>
  </div>
);

export default Wishlist;
