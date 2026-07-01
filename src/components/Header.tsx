import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Search, FileText, BadgeCheck, ClipboardList, 
  User as UserIcon, Coins, Palette, LogOut, ShieldAlert, LogIn, LayoutGrid, X,
  Phone, Mail, Crown, Sparkles
} from 'lucide-react';
import { CartItem, User, Currency, ThemeConfig } from '../types';

interface HeaderProps {
  cart: CartItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  
  // Auth, currency & theme props
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  currencies: Currency[];
  selectedCurrencyCode: string;
  onSelectCurrency: (code: string) => void;
  themes: ThemeConfig[];
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export default function Header({
  cart,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  searchTerm,
  currentUser,
  onLogin,
  onLogout,
  currencies,
  selectedCurrencyCode,
  onSelectCurrency,
  themes,
  selectedThemeId,
  onSelectTheme
}: HeaderProps) {
  const cartCount = cart.reduce((acc, item) => acc + item.config.quantity, 0);
  
  // UI States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const activeCurrencyInfo = currencies.find(c => c.code === selectedCurrencyCode) || currencies[0];

  const handleDemoSignIn = (role: 'customer' | 'seller') => {
    if (role === 'customer') {
      onLogin({
        email: 'clara.santos@meralco.com.ph',
        name: 'Maria Clara Santos',
        role: 'customer',
        phone: '+63 917 123 4567',
        address: 'Meralco Plaza, Ortigas Avenue, Pasig City, Metro Manila 1605'
      });
    } else {
      onLogin({
        email: 'seller@jelvans.ph',
        name: 'Rjelvan (Production Lead)',
        role: 'seller',
        phone: '+63 912 323 1152'
      });
    }
    setShowAuthModal(false);
    setLoginError('');
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setLoginError('Email address is required');
      return;
    }
    if (loginEmail.includes('seller') || loginEmail.includes('admin')) {
      handleDemoSignIn('seller');
    } else {
      const generatedName = loginEmail.split('@')[0].toUpperCase();
      onLogin({
        email: loginEmail,
        name: generatedName,
        role: 'customer',
        phone: '+60 12-455 9011',
        address: 'Direct Delivery Address'
      });
      setShowAuthModal(false);
      setLoginError('');
    }
  };

  return (
    <header className="w-full bg-white text-slate-850 font-sans selection:bg-red-650 selection:text-white">
      {/* Top Banner Ticker with Active Settings Controls */}
      <div className="w-full bg-slate-900 text-white text-[11px] py-2 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-center">
          <div className="flex items-center space-x-3 tracking-wide text-slate-300">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-red-500" /> +63 912 323 1152</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-red-500" /> sales@jelvans.ph</span>
            {currentUser && (
              <>
                <span className="hidden md:inline text-slate-600">|</span>
                <span className="text-yellow-405 text-yellow-400 font-bold flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {currentUser.role === 'seller' ? (
                    <>
                      <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>Seller Mode</span>
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-3 h-3 text-yellow-450 text-yellow-400" />
                      <span>Customer Account</span>
                    </>
                  )}
                  <span className="text-white ml-1">{currentUser.name}</span>
                </span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 select-none">
            {/* Theme Picker Dropdown */}
            <div className="flex items-center space-x-1 border border-slate-700 rounded px-1.5 py-0.5 bg-slate-800">
              <Palette className="w-3 h-3 text-red-400" />
              <select 
                value={selectedThemeId}
                onChange={(e) => onSelectTheme(e.target.value)}
                className="bg-transparent text-white text-[10px] outline-none cursor-pointer font-bold border-none py-0 pr-1"
                title="Select Shop Theme"
              >
                {themes.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-800 text-slate-900 font-sans font-semibold">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Picker Dropdown */}
            <div className="flex items-center space-x-1 border border-slate-700 rounded px-1.5 py-0.5 bg-slate-800">
              <Coins className="w-3 h-3 text-green-400" />
              <select 
                value={selectedCurrencyCode}
                onChange={(e) => onSelectCurrency(e.target.value)}
                className="bg-transparent text-white text-[10px] outline-none cursor-pointer font-bold border-none py-0 pr-1"
                title="Select Shop Currency"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code} className="bg-slate-800 text-slate-900 font-sans font-semibold">
                    {c.symbol} {c.code} (Rate: {c.rate})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-500 hidden md:inline">|</span>

            {/* User Session Controller */}
            {currentUser ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase font-bold text-[10px] tracking-wider"
              >
                <LogOut className="w-3 h-3 text-red-500" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1 hover:bg-red-750 text-white transition-colors uppercase font-black text-[10px] tracking-wider bg-red-600 px-3 py-1 rounded"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Corporate Header */}
      <div className="w-full border-b border-gray-100 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab('store'); setSelectedCategory('all'); }}>
            <div className="text-2xl font-black text-red-600 tracking-tighter uppercase">
              JELVANS<span className="text-slate-900 font-black">CLOTHING</span>
            </div>
            <div className="hidden lg:flex flex-col border-l border-gray-200 pl-3">
              <h1 className="text-[10px] font-extrabold tracking-tight text-slate-800 leading-none">
                CUSTOMIZER STUDIO
              </h1>
              <p className="text-[9px] text-red-600 font-mono tracking-widest font-semibold uppercase leading-none mt-0.5">
                Pagudpud HQ
              </p>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full max-w-sm md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-xs text-slate-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-2 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Quick Action Navigation & Cart */}
          <div className="flex items-center space-x-2 md:space-x-3 mt-1 md:mt-0 font-medium">
            <button
              onClick={() => setActiveTab('quote')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-md transition-all duration-150 font-bold ${
                activeTab === 'quote'
                  ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                  : 'hover:bg-gray-50 text-slate-700 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk RFQ Quote</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-md transition-all duration-150 font-bold ${
                activeTab === 'orders'
                  ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                  : 'hover:bg-gray-50 text-slate-700 border border-transparent'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Track Print Jobs</span>
            </button>

            {/* Custom Seller Dashboard Access Link */}
            {currentUser?.role === 'seller' && (
              <button
                onClick={() => setActiveTab('seller')}
                className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-md transition-all duration-150 font-black border uppercase tracking-wider ${
                  activeTab === 'seller'
                    ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-xs'
                    : 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-300 text-amber-800'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-700" />
                <span>Seller Desk</span>
              </button>
            )}

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* Micro-animated Shopping Cart Badge */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-red-600 text-slate-700 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 text-red-600" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.3 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-mono shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Tab Options */}
        <div className="w-full border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex space-x-2 md:space-x-8 overflow-x-auto scrollbar-hide text-[11px] font-bold text-slate-800 uppercase tracking-wider items-center">
            <button
              onClick={() => { setActiveTab('store'); setSelectedCategory('all'); }}
              className={`pb-1 px-1 transition-all shrink-0 ${
                activeTab === 'store' && selectedCategory === 'all'
                  ? 'text-red-600 border-b-2 border-red-600 pb-2.5 -mb-4'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => { setActiveTab('store'); setSelectedCategory('corporate'); }}
              className={`pb-1 px-1 transition-all shrink-0 ${
                activeTab === 'store' && selectedCategory === 'corporate'
                  ? 'text-red-600 border-b-2 border-red-600 pb-2.5 -mb-4'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Corporate Uniforms
            </button>
            <button
              onClick={() => { setActiveTab('store'); setSelectedCategory('casual'); }}
              className={`pb-1 px-1 transition-all shrink-0 ${
                activeTab === 'store' && selectedCategory === 'casual'
                  ? 'text-red-600 border-b-2 border-red-600 pb-2.5 -mb-4'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Custom Casualwear
            </button>
            <button
              onClick={() => { setActiveTab('store'); setSelectedCategory('sports'); }}
              className={`pb-1 px-1 transition-all shrink-0 ${
                activeTab === 'store' && selectedCategory === 'sports'
                  ? 'text-red-600 border-b-2 border-red-600 pb-2.5 -mb-4'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Sportswear
            </button>
            <button
              onClick={() => { setActiveTab('store'); setSelectedCategory('premium'); }}
              className={`pb-1 px-1 transition-all shrink-0 ${
                activeTab === 'store' && selectedCategory === 'premium'
                  ? 'text-red-600 border-b-2 border-red-600 pb-2.5 -mb-4'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Hoodies & Caps
            </button>
            <div className="flex-grow"></div>
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-red-650 bg-red-50 border border-red-100 px-3 py-1 rounded-full font-mono font-medium lowercase first-letter:uppercase">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>e-Invoicing Active ({activeCurrencyInfo.code})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modular Interactive Auth/Sign-in Dialog screen */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 overflow-hidden shadow-2xl relative text-left"
            >
              <button
                onClick={() => { setShowAuthModal(false); setLoginError(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-5 border-b border-gray-100">
                <div className="bg-red-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-xl font-black mb-3 shadow">
                  J
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight font-sans">Jelvans Workshop Central Auth</h3>
                <p className="text-xs text-slate-500 mt-1">Configure user accounts and unlock custom manager toolkits.</p>
              </div>

              {loginError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Predefined Instant demo credentials triggers */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>Instant Developer Roles:</span>
                </span>
                
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('customer')}
                  className="w-full p-3 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-lg text-left flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-indigo-905 text-indigo-900 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Client Customer Dashboard</span>
                    </span>
                    <span className="text-[10px] text-indigo-700 block mt-0.5">Logged as TNB Procurement (Ahmad Hafiz)</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-indigo-650 text-indigo-600 group-hover:translate-x-0.5 transition-transform">Instant Open &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoSignIn('seller')}
                  className="w-full p-3 border border-yellow-300 bg-amber-50/50 hover:bg-amber-50 rounded-lg text-left flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-105 fill-amber-100" />
                      <span>Seller Lead / Production Manager</span>
                    </span>
                    <span className="text-[10px] text-amber-700 block mt-0.5">Products editor, Invoicing rules, live queue triage</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-amber-700 group-hover:translate-x-0.5 transition-transform">Instant Open &rarr;</span>
                </button>
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-3">or Custom Standard Login</span>
                </div>
              </div>

              {/* Standard email input flow */}
              <form onSubmit={handleCustomFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded text-xs p-2.5 outline-none font-semibold text-slate-800 focus:border-red-600"
                  />
                  <p className="text-[9px] text-slate-400 font-medium">Entering email containing word "seller" automatically unlocks Admin role.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Credentials / Password</label>
                  <input
                    type="password"
                    placeholder="Enter password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded text-xs p-2.5 outline-none font-semibold text-slate-800 focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Authenticate Session</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
