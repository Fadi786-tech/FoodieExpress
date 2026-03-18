import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ChevronRight, Clock, MapPin, RefreshCw, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice, formatDate } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const { orders } = useAuth();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Order History</h1>
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-bold">
          {orders.length} Orders
        </div>
      </div>

      <div className="space-y-8">
        {orders.map((order, idx) => {
          const isExpanded = expandedOrders[order.id];
          const displayItems = isExpanded ? order.items : order.items.slice(0, 2);
          const hasMore = order.items.length > 2;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 shrink-0 flex items-center justify-center">
                      {order.items[0]?.image ? (
                        <img src={order.items[0].image} alt="Order" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-8 w-8 text-gray-300 dark:text-gray-700" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {order.items[0]?.vendorName || 'Foodie Express Order'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order {order.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-sm">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* Items Summary Section */}
                <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Ordered Items</p>
                    {hasMore && (
                      <button 
                        onClick={() => toggleOrder(order.id)}
                        className="text-orange-500 text-xs font-bold flex items-center hover:text-orange-600 transition-colors"
                      >
                        {isExpanded ? 'Show Less' : `+${order.items.length - 2} More`}
                        {isExpanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {displayItems.map((item, i) => (
                        <motion.div 
                          key={`${order.id}-${item.cartId}-${i}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                              {item.selectedOptions && Object.values(item.selectedOptions).length > 0 && (
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                  {Object.values(item.selectedOptions).map((opt: any) => opt.name).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">x{item.quantity}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Total Amount</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="flex items-center md:justify-end space-x-3">
                    <button 
                      onClick={() => navigate(`/track-order/${order.id}`)}
                      className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center"
                    >
                      Track Order
                    </button>
                    {order.status === 'Delivered' && (
                      <button 
                        onClick={() => navigate(`/vendor/${order.items[0].vendorId}?tab=reviews`)}
                        className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all flex items-center"
                      >
                        Review Vendor
                      </button>
                    )}
                    <Link 
                      to={`/track-order/${order.id}`}
                      className="p-3 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[40px]">
            <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No orders yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">When you place an order, it will appear here.</p>
            <Link to="/" className="inline-block mt-6 bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
