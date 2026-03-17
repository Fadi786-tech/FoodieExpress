import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, MapPin, CreditCard, Bell, Shield, LogOut, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Personal Info', icon: <UserIcon className="h-5 w-5" /> },
            { id: 'addresses', label: 'Addresses', icon: <MapPin className="h-5 w-5" /> },
            { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="h-5 w-5" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
            { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                item.id === 'profile'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-12"
          >
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-[40px] overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                      <UserIcon className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-3 rounded-2xl shadow-lg hover:bg-orange-600 transition-all">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Member since March 2026</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
