import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, MapPin, Package, Truck, ArrowLeft, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../lib/utils';

const TrackOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useAuth();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId);

  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = [
    { label: 'Confirmed', icon: <CheckCircle2 className="h-6 w-6" />, time: '12:30 PM' },
    { label: 'Preparing', icon: <Clock className="h-6 w-6" />, time: '12:35 PM' },
    { label: 'On the way', icon: <Truck className="h-6 w-6" />, time: '12:50 PM' },
    { label: 'Delivered', icon: <Package className="h-6 w-6" />, time: '1:05 PM' },
  ];

  useEffect(() => {
    if (!order) return;
    
    // Simulate order progress
    const timer = setInterval(() => {
      setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 5000);

    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h2>
        <Link to="/orders" className="text-orange-500 font-bold mt-4 inline-block">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-12">
        <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Track Order</h1>
          <p className="text-gray-500 dark:text-gray-400">Order ID: {order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tracking Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-10">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800 z-0" />
              <div 
                className="absolute left-8 top-0 w-0.5 bg-orange-500 z-0 transition-all duration-1000" 
                style={{ height: `${(statusIndex / (statuses.length - 1)) * 100}%` }}
              />

              <div className="space-y-12 relative z-10">
                {statuses.map((status, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      idx <= statusIndex ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/20' : 'bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700'
                    }`}>
                      {status.icon}
                    </div>
                    <div className="ml-6 pt-2">
                      <h3 className={`text-lg font-bold ${idx <= statusIndex ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-700'}`}>
                        {status.label}
                      </h3>
                      <p className={`text-sm ${idx <= statusIndex ? 'text-gray-500 dark:text-gray-400' : 'text-gray-200 dark:text-gray-800'}`}>
                        {idx <= statusIndex ? `Order ${status.label.toLowerCase()} at ${status.time}` : 'Pending'}
                      </p>
                    </div>
                    {idx === statusIndex && idx < statuses.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-1 rounded-full text-xs font-bold animate-pulse"
                      >
                        In Progress
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Details</h3>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-gray-400 dark:text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Delivery Address</p>
                <p className="text-gray-900 dark:text-white font-medium">{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Total Paid</span>
              <span className="text-xl font-bold text-orange-500">{formatPrice(order.totalAmount)}</span>
            </div>
            {statusIndex === statuses.length - 1 && (
              <button 
                onClick={() => navigate(`/vendor/${order.items[0].vendorId}?tab=reviews`)}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all mt-6"
              >
                Review Vendor
              </button>
            )}
          </div>

          {/* Courier Info */}
          <div className="bg-gray-900 dark:bg-orange-500 p-8 rounded-[40px] text-white space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-800 dark:bg-orange-600">
                <img src="https://picsum.photos/seed/courier/100/100" alt="Courier" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold">Ahmed Khan</h4>
                <p className="text-gray-400 dark:text-orange-100 text-sm">Your Delivery Hero</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-center transition-all">
                <Phone className="h-5 w-5" />
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-center transition-all">
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
