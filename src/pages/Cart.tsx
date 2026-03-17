import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, tax, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-50 dark:bg-gray-900 w-32 h-32 rounded-full flex items-center justify-center mx-auto"
        >
          <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-700" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our categories and find something delicious!
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-6"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-orange-500 font-medium">{item.vendorName}</p>
                    {item.selectedOptions && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.values(item.selectedOptions).map((opt: any) => (
                          <span key={opt.id} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {opt.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors dark:text-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors dark:text-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl sticky top-24 space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(tax)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-orange-500">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/20 flex items-center justify-center group"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center space-x-4 text-gray-400">
              <CreditCard className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
