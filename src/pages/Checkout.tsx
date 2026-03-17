import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, CreditCard, ChevronRight, CheckCircle2, Package, Truck, ArrowLeft, Plus } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const Checkout: React.FC = () => {
  const { items, total, subtotal, deliveryFee, tax, clearCart } = useCart();
  const { user, addAddress, setDefaultAddress, placeOrder } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '' });

  const selectedAddress = user?.addresses.find(a => a.isDefault) || user?.addresses[0];

  const handlePlaceOrder = () => {
    if (!selectedAddress || !user) {
      alert('Please select a delivery address');
      return;
    }
    setIsOrdering(true);
    // Simulate API call
    setTimeout(() => {
      const order = placeOrder({
        userId: user.id,
        items: [...items],
        totalAmount: total,
        deliveryAddress: selectedAddress,
        paymentMethod: 'Credit Card',
      });
      setConfirmedOrder(order);
      setIsOrdering(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.label && newAddress.street && newAddress.city) {
      addAddress({ ...newAddress, isDefault: user?.addresses.length === 0 });
      setNewAddress({ label: '', street: '', city: '' });
      setShowAddressModal(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-100 dark:bg-green-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Order Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Thank you for your order. Your food is being prepared and will be with you shortly.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm text-left space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400">Order ID</span>
            <span className="font-bold text-gray-900 dark:text-white">{confirmedOrder?.id}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400">Estimated Delivery</span>
            <span className="font-bold text-orange-500">30-45 Minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Delivery Address</span>
            <span className="font-bold text-gray-900 dark:text-white text-right">
              {confirmedOrder?.deliveryAddress.street}, {confirmedOrder?.deliveryAddress.city}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`/track-order/${confirmedOrder?.id}`)}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center"
          >
            <Package className="mr-2 h-5 w-5" />
            Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-12">
        <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Address */}
          <div className={`bg-white dark:bg-gray-900 p-8 rounded-[32px] border transition-all ${step === 1 ? 'border-orange-500 shadow-xl' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Delivery Address
              </h3>
              {step > 1 && (
                <button onClick={() => setStep(1)} className="text-orange-500 font-bold text-sm hover:underline">
                  Change
                </button>
              )}
            </div>
            
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.addresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => setDefaultAddress(addr.id)}
                      className={`p-5 border-2 rounded-3xl relative cursor-pointer transition-all ${
                        addr.isDefault ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900'
                      }`}
                    >
                      {addr.isDefault && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex items-center space-x-3 mb-2">
                        <MapPin className={`h-5 w-5 ${addr.isDefault ? 'text-orange-500' : 'text-gray-400'}`} />
                        <h4 className="font-bold text-gray-900 dark:text-white">{addr.label}</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{addr.street}, {addr.city}</p>
                    </div>
                  ))}
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="p-5 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 transition-colors">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-sm">Add New Address</span>
                  </button>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedAddress}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all disabled:opacity-50 shadow-lg shadow-orange-200"
                >
                  Deliver to this Address
                </button>
              </div>
            )}
            
            {step > 1 && selectedAddress && (
              <p className="text-gray-600 dark:text-gray-400">{selectedAddress.street}, {selectedAddress.city}</p>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`bg-white dark:bg-gray-900 p-8 rounded-[32px] border transition-all ${step === 2 ? 'border-orange-500 shadow-xl' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Payment Method
              </h3>
              {step > 2 && (
                <button onClick={() => setStep(2)} className="text-orange-500 font-bold text-sm hover:underline">
                  Change
                </button>
              )}
            </div>

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded-2xl cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-orange-500 focus:ring-orange-500" />
                    <div className="ml-4 flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-bold text-gray-900 dark:text-white">Credit / Debit Card</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl cursor-pointer hover:border-orange-200 dark:hover:border-orange-900 transition-all">
                    <input type="radio" name="payment" className="h-4 w-4 text-orange-500 focus:ring-orange-500" />
                    <div className="ml-4 flex items-center">
                      <Truck className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-bold text-gray-900 dark:text-white">Cash on Delivery</span>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step > 2 && (
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" /> Card ending in 4242
              </p>
            )}
          </div>

          {/* Step 3: Review */}
          <div className={`bg-white dark:bg-gray-900 p-8 rounded-[32px] border transition-all ${step === 3 ? 'border-orange-500 shadow-xl' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Review Order
            </h3>

            {step === 3 && (
              <div className="space-y-6">
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                  {items.map(item => (
                    <div key={item.cartId} className="py-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden mr-4">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                            {item.selectedOptions && Object.values(item.selectedOptions).map((opt: any) => (
                              <span key={opt.id} className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                {opt.name}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrdering ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                      />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ${formatPrice(total)}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatPrice(tax)}</span>
              </div>
              <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-orange-500">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30">
              <p className="text-xs text-orange-800 dark:text-orange-400 font-medium text-center">
                You're saving PKR 150 on delivery with this order!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[40px] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Address</h2>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Label (e.g. Home, Office)</label>
                  <input
                    type="text"
                    required
                    value={newAddress.label}
                    onChange={e => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Home"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={e => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Lahore"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
