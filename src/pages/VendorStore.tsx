import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { VENDORS, PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Product, VariationOption } from '../types';
import { Star, Clock, ShoppingCart, Info, MapPin, Phone, Plus, Minus, Check, Heart } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const VendorStore: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const vendor = VENDORS.find(v => v.id === vendorId);
  const vendorProducts = PRODUCTS.filter(p => p.vendorId === vendorId);
  const { addToCart } = useCart();
  const { user, toggleFavoriteProduct, toggleFavoriteVendor } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, VariationOption>>({});

  if (!vendor) return <div>Vendor not found</div>;

  const categories = ['All', ...new Set(vendorProducts.map(p => p.category))];
  const filteredProducts = activeCategory === 'All' 
    ? vendorProducts 
    : vendorProducts.filter(p => p.category === activeCategory);

  const handleProductClick = (product: Product) => {
    if (product.variations && product.variations.length > 0) {
      setSelectedProduct(product);
      // Set default options
      const defaults: Record<string, VariationOption> = {};
      product.variations.forEach(v => {
        defaults[v.id] = v.options[0];
      });
      setSelectedOptions(defaults);
    } else {
      handleAddToCart(product);
    }
  };

  const handleAddToCart = (product: Product, options?: Record<string, VariationOption>) => {
    addToCart(product, vendor, options);
    setShowToast(true);
    setSelectedProduct(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    const modifiers = (Object.values(selectedOptions) as VariationOption[]).reduce((sum, opt) => sum + opt.priceModifier, 0);
    return selectedProduct.price + modifiers;
  };

  return (
    <div className="pb-20">
      {/* Store Header */}
      <div className="relative h-64 md:h-80">
        <img
          src={vendor.coverImage}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6 text-white">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl overflow-hidden border-4 border-white shadow-xl shrink-0">
              <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">{vendor.name}</h1>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFavoriteVendor(vendor.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full backdrop-blur-md transition-all border shadow-lg ${
                    user?.favoriteVendorIds.includes(vendor.id) 
                      ? 'bg-red-500 border-red-400 text-white shadow-red-500/30' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`h-4 w-4 transition-transform duration-300 ${user?.favoriteVendorIds.includes(vendor.id) ? 'fill-current scale-110' : ''}`} />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {user?.favoriteVendorIds.includes(vendor.id) ? 'Saved' : 'Save'}
                  </span>
                </motion.button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  {vendor.rating} ({vendor.reviewCount} reviews)
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-1" />
                  {vendor.deliveryTime}
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Min. {formatPrice(vendor.minOrder)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Info className="h-5 w-5 mr-2 text-orange-500" />
                Store Information
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{vendor.description}</p>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{vendor.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600">+92 (300) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 shrink-0" />
                  <span className="text-green-600 font-medium">Open Now (09:00 - 22:00)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-100 hover:border-orange-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavoriteProduct(product.id);
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                            user?.favoriteProductIds.includes(product.id) 
                              ? 'text-red-500 bg-red-50' 
                              : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${user?.favoriteProductIds.includes(product.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-orange-500">{formatPrice(product.price)}</span>
                      <button
                        onClick={() => handleProductClick(product)}
                        className="bg-orange-100 text-orange-600 p-2 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Variation Selection Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="h-48 relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-gray-500 mt-1">{selectedProduct.description}</p>
                </div>

                <div className="space-y-6">
                  {selectedProduct.variations?.map(variation => (
                    <div key={variation.id} className="space-y-3">
                      <h4 className="font-bold text-gray-900">{variation.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {variation.options.map(option => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [variation.id]: option }))}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              selectedOptions[variation.id]?.id === option.id
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {option.name}
                            {option.priceModifier > 0 && ` (+${formatPrice(option.priceModifier)})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500 block">Total Price</span>
                    <span className="text-2xl font-bold text-orange-500">{formatPrice(calculateTotalPrice())}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(selectedProduct, selectedOptions)}
                    className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3"
          >
            <div className="bg-green-500 rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
            <span className="font-medium">Added to cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorStore;
