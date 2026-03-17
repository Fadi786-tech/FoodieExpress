import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, ShoppingCart, ArrowRight, Utensils, ShoppingBag, Smartphone, Croissant, Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VENDORS } from '../data/mockData';
import { formatPrice } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, toggleFavoriteVendor } = useAuth();
  const categories = [
    { name: 'Food', icon: <Utensils className="h-7 w-7" />, color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-600', count: '150+ Stores', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Grocery', icon: <ShoppingBag className="h-7 w-7" />, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600', count: '80+ Stores', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Electronics', icon: <Smartphone className="h-7 w-7" />, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600', count: '40+ Stores', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80' },
    { name: 'Bakery', icon: <Croissant className="h-7 w-7" />, color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-600', count: '30+ Stores', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:h-[80vh] flex items-center overflow-hidden bg-[#fafafa]">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-2xl space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span>Fastest Delivery in Town</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900">
                Craving? <br />
                <span className="text-orange-500">We Got You.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg font-medium">
                The best local vendors delivered to your door. Food, groceries, tech, and more.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full pl-12 pr-4 py-5 bg-white border-2 border-gray-100 rounded-3xl shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
                />
              </div>
              <Link
                to="/category/Food"
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center group shadow-xl shadow-orange-500/20"
              >
                Find Food
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center space-x-8 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-500">
                <span className="text-gray-900">10k+</span> Happy Customers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Explore Categories</h2>
            <p className="text-gray-500 text-lg font-medium">The best of everything, just a click away.</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-3 rounded-full border-2 border-gray-100 hover:bg-gray-50 transition-colors">
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button className="p-3 rounded-full border-2 border-gray-100 hover:bg-gray-50 transition-colors">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/category/${cat.name}`}
                className="group relative block h-80 rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 space-y-3">
                  <div className={`${cat.lightColor} ${cat.textColor} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{cat.name}</h3>
                    <p className="text-gray-300 text-sm font-bold uppercase tracking-widest">{cat.count}</p>
                  </div>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                  <div className="bg-white text-gray-900 p-3 rounded-2xl shadow-xl">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Top Picks</h2>
            <p className="text-gray-500 text-lg border-l-4 border-orange-500 pl-4 font-medium">Handpicked vendors with exceptional service.</p>
          </div>
          <Link to="/vendors" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-2xl font-bold transition-all flex items-center">
            See All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {VENDORS.slice(0, 3).map((vendor, idx) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
      </section>

      {/* Special Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-orange-500 rounded-[60px] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-orange-500/20">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0">
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80" 
              alt="Food" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
          </div>
          
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="inline-block bg-white text-orange-500 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg">
              Limited Time Offer
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Hungry? <br />
              Save <span className="underline decoration-white underline-offset-8">50%</span> Now.
            </h2>
            <p className="text-orange-50 text-xl font-medium max-w-lg">
              Use code <span className="bg-white text-orange-500 px-3 py-1 rounded-lg font-black mx-1">WELCOME50</span> at checkout. Valid for your first 3 orders.
            </p>
            <div className="pt-4">
              <button className="bg-white text-gray-900 px-12 py-5 rounded-[24px] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-black/10">
                Claim My Discount
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-black/5 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
};

export default Home;
