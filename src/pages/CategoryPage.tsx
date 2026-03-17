import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { VENDORS } from '../data/mockData';
import { Star, Clock, ShoppingCart, Filter, ChevronDown, Heart, ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const vendors = VENDORS.filter(v => v.category === categoryName);
  const { user, toggleFavoriteVendor } = useAuth();

  const categoryThemes: Record<string, { bg: string, text: string, accent: string }> = {
    'Food': { bg: 'bg-orange-500', text: 'text-white', accent: 'bg-orange-400' },
    'Grocery': { bg: 'bg-green-500', text: 'text-white', accent: 'bg-green-400' },
    'Electronics': { bg: 'bg-blue-500', text: 'text-white', accent: 'bg-blue-400' },
    'Bakery': { bg: 'bg-yellow-500', text: 'text-white', accent: 'bg-yellow-400' },
  };

  const theme = categoryThemes[categoryName || 'Food'] || categoryThemes['Food'];

  return (
    <div className="pb-20 space-y-12">
      {/* Category Hero */}
      <section className={`${theme.bg} ${theme.text} pt-20 pb-32 relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-6"
          >
            <Link to="/" className="inline-flex items-center text-sm font-bold uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Back to Home
            </Link>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              {categoryName}
            </h1>
            <p className="text-xl opacity-90 font-medium max-w-lg">
              Discover the finest {categoryName?.toLowerCase()} vendors curated just for you. Quality and speed, guaranteed.
            </p>
          </motion.div>
        </div>

        {/* Decorative Circles */}
        <div className={`absolute top-[-10%] right-[-5%] w-96 h-96 ${theme.accent} rounded-full blur-3xl opacity-50`} />
        <div className={`absolute bottom-[-20%] left-[10%] w-64 h-64 ${theme.accent} rounded-full blur-3xl opacity-30`} />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        {/* Filters & Stats */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-gray-50">
          <div className="flex items-center space-x-6">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Vendors</p>
              <p className="text-3xl font-black text-gray-900">{vendors.length}</p>
            </div>
            <div className="h-10 w-[2px] bg-gray-100" />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Average Rating</p>
              <p className="text-3xl font-black text-gray-900">4.8</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-3 px-8 py-4 bg-gray-50 rounded-2xl text-sm font-black hover:bg-gray-100 transition-all border-2 border-transparent hover:border-gray-200">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button className="flex items-center space-x-3 px-8 py-4 bg-gray-50 rounded-2xl text-sm font-black hover:bg-gray-100 transition-all border-2 border-transparent hover:border-gray-200">
              <span>Sort: Popular</span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {vendors.map((vendor, idx) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <Link to={`/vendor/${vendor.id}`} className="block relative h-64 overflow-hidden">
                <img
                  src={vendor.coverImage}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-xl">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="text-sm font-black text-gray-900">{vendor.rating}</span>
                  </div>
                </div>

                <div className="absolute top-6 right-6">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavoriteVendor(vendor.id);
                    }}
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl backdrop-blur-md transition-all duration-300 border ${
                      user?.favoriteVendorIds.includes(vendor.id) 
                        ? 'bg-red-500 border-red-400 text-white shadow-xl shadow-red-500/40' 
                        : 'bg-white/80 border-white/40 text-gray-700 hover:bg-white shadow-lg'
                    }`}
                  >
                    <Heart className={`h-6 w-6 transition-transform duration-300 ${user?.favoriteVendorIds.includes(vendor.id) ? 'fill-current scale-110' : ''}`} />
                  </motion.button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-orange-500 text-white py-3 rounded-2xl font-black text-center shadow-xl">
                    View Store
                  </div>
                </div>
              </Link>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                      {vendor.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-1">{vendor.description}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm shrink-0">
                    <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center text-sm font-bold text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    {vendor.deliveryTime}
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-600">
                    <ShoppingCart className="h-4 w-4 mr-2 text-orange-500" />
                    Min. {formatPrice(vendor.minOrder)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {vendors.length === 0 && (
          <div className="text-center py-32 bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200">
            <div className="bg-white w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl">
              <ShoppingCart className="h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">No vendors found</h3>
            <p className="text-gray-500 mt-4 text-lg font-medium">We're expanding fast! Check back soon for new stores in this category.</p>
            <Link to="/" className="inline-block mt-10 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-orange-500 transition-all shadow-xl">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
