import React, { useState } from 'react';
import { CartItem, Order, Currency } from '../types';
import { ShoppingCart, Trash2, MapPin, BadgeCheck, FileText, Gift, ArrowRight, Layers, Phone, Eye, X, Palette, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
  setActiveTab: (tab: string) => void;
  activeCurrency: Currency;
}

export default function CartView({
  cart,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
  setActiveTab,
  activeCurrency
}: CartViewProps) {
  // Checkout form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [customerMessage, setCustomerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visual Preview Selected Item
  const [previewItem, setPreviewItem] = useState<CartItem | null>(null);

  const getVectorColorClass = (colorName: string) => {
    switch (colorName) {
      case 'Jet Black': case 'Pitch Black': return 'text-slate-900';
      case 'Pure White': case 'Clean White': return 'text-white border-gray-300';
      case 'Burgundy red': case 'Red Wine': case 'Laser Red': return 'text-red-700';
      case 'Navy Blue': return 'text-indigo-900';
      case 'Forest Green': case 'Emerald Green': case 'Sage Green': return 'text-emerald-800';
      case 'Heather Grey': case 'Charcoal Grey': return 'text-slate-405 text-slate-400';
      case 'Royal Blue': case 'Electric Blue': return 'text-blue-600';
      case 'Neon Yellow': return 'text-yellow-400';
      case 'Orange Crush': return 'text-orange-500';
      case 'Sand Beige': return 'text-[#d6c4a8]';
      case 'Dusty Lavender': return 'text-purple-300';
      case 'Chocolate Brown': return 'text-amber-900';
      default: return 'text-amber-500';
    }
  };

  const getPlacementOverlay = (placementId: string) => {
    switch (placementId) {
      case 'front_center':
        return { style: 'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[35%] border-2 border-dashed border-red-600 bg-red-600/5 flex flex-col items-center justify-center text-[8px] font-bold text-red-600 leading-none', label: 'FULL A4' };
      case 'front_chest':
        return { style: 'absolute top-[28%] left-[38%] w-[15%] h-[15%] border border-dashed border-red-600 bg-red-600/5 text-[7px] text-red-600 flex flex-col items-center justify-center leading-none', label: 'POCKET' };
      case 'back':
        return { style: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[40%] border-2 border-dashed border-red-600 bg-red-600/5 flex flex-col items-center justify-center text-[8px] font-bold text-red-600 leading-none', label: 'A3 BACK' };
      case 'sleeve':
        return { style: 'absolute top-[32%] left-[16%] w-[12%] h-[10%] border border-dashed border-red-600 bg-red-600/5 text-[6px] text-red-600 flex flex-col items-center justify-center leading-none', label: 'SLEEVE' };
      default:
        return { style: 'hidden', label: '' };
    }
  };

  // Compute pricing totals
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const tax = Math.round(subtotal * 0.12 * 100) / 100; // 12% VAT

  // Delivery charge rule: Free courier for orders above PHP 5,000, otherwise flat PHP 250
  const shipping = deliveryMethod === 'pickup' 
    ? 0 
    : (subtotal >= 5000 ? 0 : 250.00);

  const grandTotal = Math.round((subtotal + tax + shipping) * 100) / 100;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!name.trim() || !email.trim() || !phone.trim() || (deliveryMethod === 'delivery' && !address.trim())) {
      alert('Please fill out all the required checkout details.');
      return;
    }

    setIsSubmitting(true);

    // Simulate standard card processing or FPX payment gateway redirect delay
    setTimeout(() => {
      const newOrder: Order = {
        id: `INV-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString('en-GB'),
        items: [...cart],
        subtotal,
        tax,
        shipping,
        total: grandTotal,
        customerDetails: {
          name,
          email,
          phone,
          address: deliveryMethod === 'pickup' ? 'Self-Pickup at Pagudpud Main Warehouse HQ (Barangay Bulalo)' : address,
          deliveryMethod
        },
        status: 'Received',
        paymentCompleted: true,
        messages: customerMessage.trim() ? [
          {
            id: `msg-${Date.now()}`,
            sender: 'customer',
            senderName: name.trim() || 'Customer',
            text: customerMessage.trim(),
            timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-GB')
          }
        ] : []
      };

      onPlaceOrder(newOrder);
      onClearCart();
      setCustomerMessage('');
      setIsSubmitting(false);
      setActiveTab('orders'); // route user automatically to list invoice tracking
    }, 1500);
  };

  const getPlacementName = (placementId: string) => {
    switch (placementId) {
      case 'front_center': return 'Full Chest Center (A4)';
      case 'front_chest': return 'Left Chest Pocket Size';
      case 'back': return 'Full Back Center (A3)';
      case 'sleeve': return 'Left/Right Sleeve Zone';
      default: return placementId;
    }
  };

  const getMethodName = (methodId: string) => {
    switch (methodId) {
      case 'embroidery': return 'Premium Embroidery';
      case 'dtf': return 'Digital DTF (Direct to Film)';
      case 'silkscreen': return 'Vibrant Silkscreen';
      case 'sublimation': return 'Full HD Sublimation';
      default: return methodId;
    }
  };

  const getCategoryVector = (id: string, colorClass: string = "text-slate-700") => {
    if (id.includes('prod-005')) { // Hoodie
      return (
        <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 25 L25 27 L15 39 L25 45 L28 38 L31 38 L31 82 L69 82 L69 38 L72 38 L75 45 L85 39 L75 27 Z" />
          <path d="M38 27 C38 12, 62 12, 62 27 Z" fill="#000" opacity="0.15" />
        </svg>
      );
    }
    if (id.includes('prod-003')) { // Jersey
      return (
        <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 15 L25 19 L19 33 L28 39 L28 85 L72 85 L72 39 L81 39 L75 19 Z" />
        </svg>
      );
    }
    if (id.includes('prod-006')) { // Tote bag
      return (
        <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
          <rect x="25" y="40" width="50" height="42" rx="4" />
          <path d="M35 40 C35 22, 45 22, 45 40" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M55 40 C55 22, 65 22, 65 40" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      );
    }
    if (id.includes('prod-002') || id.includes('prod-004')) { // Polo / F1 Shirt
      return (
        <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
          <path d="M40 15 L50 25 L60 15 L50 35 Z" fill="#000" opacity="0.15" />
        </svg>
      );
    }
    // Default: Roundneck Tee
    return (
      <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-left font-sans selection:bg-red-600 selection:text-white text-slate-900">
      
      {/* Visual Cart Page Title */}
      <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 mb-8 border-b border-gray-200 pb-4 uppercase">
        <ShoppingCart className="w-6 h-6 text-red-600" />
        <span>Your Print Cart ({cart.reduce((acc, item) => acc + item.config.quantity, 0)} units)</span>
        <div className="flex-grow"></div>
        {subtotal >= 250 && deliveryMethod === 'delivery' && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <Gift className="w-3.5 h-3.5 text-green-655 text-green-600" /> FREE DELIVERY APPLIED!
          </div>
        )}
      </h2>

      {cart.length === 0 ? (
        <div className="bg-slate-50 border border-gray-205 border-gray-200 rounded-xl py-16 px-4 text-center max-w-xl mx-auto space-y-5">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto" strokeWidth={1.5} />
          <div>
            <h3 className="text-slate-800 font-extrabold text-lg leading-snug">Your shopping cart is empty</h3>
            <p className="text-slate-500 text-xs mt-1 leading-normal font-medium">There are no custom apparel items pending for tailoring in your current session.</p>
          </div>
          <button
            onClick={() => setActiveTab('store')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Go to Apparel Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-[fadeIn_0.2s_ease-out]">
          
          {/* Cart items list - left panel */}
          <div className="lg:col-span-12 xl:col-span-7 lg:w-full space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative group hover:border-red-600/30 transition-all duration-250 shadow-sm">
                
                {/* Item brief summary and thumbnail */}
                <div className="flex items-start space-x-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="relative cursor-pointer bg-slate-50 hover:bg-slate-100 w-16 h-16 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0 group/thumbnail overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-red-600/20"
                    title="Click for full-screen apparel layout"
                  >
                    {getCategoryVector(item.config.productId, "text-red-600 transition-transform group-hover/thumbnail:scale-110 duration-200")}
                    <div className="absolute inset-0 bg-red-600/70 opacity-0 group-hover/thumbnail:opacity-100 flex flex-col items-center justify-center text-[8px] text-white font-extrabold tracking-wider transition-all duration-200">
                      <Eye className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      <span className="uppercase mt-0.5">PREVIEW</span>
                    </div>
                  </button>

                  <div className="space-y-1 text-left">
                    <h3 className="text-slate-905 text-slate-900 text-sm font-extrabold tracking-tight shrink-0">{item.product.name}</h3>
                    
                    {/* Compact configurations table */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5 text-[11px] font-mono text-slate-500">
                      <span>Color: <strong className="text-red-600 font-bold">{item.config.color}</strong></span>
                      <span>Size: <strong className="text-slate-800 font-bold">{item.config.size}</strong></span>
                      <span>Weight: <strong className="text-slate-800 font-bold">{item.config.fabricWeight}</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-slate-405 text-slate-400 pt-0.5">
                      <span>Method: <strong>{getMethodName(item.config.printMethod)}</strong></span>
                      <span>Placement: <strong>{getPlacementName(item.config.printPlacement)}</strong></span>
                    </div>

                    {item.config.logoFileName && (
                      <p className="text-[10px] text-green-600 font-mono font-medium pt-1 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Vector Design: <span className="font-bold">{item.config.logoFileName}</span>
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-red-600 font-extrabold hover:text-red-700 transition-all cursor-pointer hover:underline group/btn"
                    >
                      <Eye className="w-3 h-3 text-red-600 group-hover/btn:scale-110 transition-transform" />
                      <span>Visual Print Preview</span>
                    </button>
                  </div>
                </div>

                {/* Units, price rates, and deletions column */}
                <div className="flex sm:flex-col justify-between sm:items-end w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                  <div className="flex items-center space-x-1.5 sm:mb-2">
                    <button
                      onClick={() => onUpdateQty(item.id, Math.max(1, item.config.quantity - 1))}
                      className="w-7 h-7 text-xs rounded border border-gray-300 bg-white font-bold text-slate-705 flex items-center justify-center hover:bg-slate-50"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-xs text-slate-800">{item.config.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.config.quantity + 1)}
                      className="w-7 h-7 text-xs rounded border border-gray-300 bg-white font-bold text-slate-705 flex items-center justify-center hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="text-[10px] font-mono text-slate-400">
                      {activeCurrency.code} {(item.unitPrice * activeCurrency.rate).toFixed(2)} /unit
                    </div>
                    <div className="text-sm font-mono font-black text-red-650 text-red-600">
                      {activeCurrency.code} {(item.totalPrice * activeCurrency.rate).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-4 right-4 sm:static text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}

            {/* Clear and back buttons */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('store')}
                className="text-xs text-slate-500 hover:text-red-600 font-bold uppercase transition-colors"
              >
                ← Add more clothes
              </button>
              <button
                className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline"
                onClick={onClearCart}
              >
                Clear Cart Queue
              </button>
            </div>
          </div>

          {/* Checkout billing details - right panel */}
          <div className="lg:col-span-12 xl:col-span-5 lg:w-full">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
              <h3 className="text-slate-905 text-slate-900 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-2.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Job Billing & Courier Options</span>
              </h3>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name (e.g. Ahmad Hafiz)"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. hafiz@corporate.my"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5"
                  />
                </div>

                {/* Phone WhatsApp */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-600" />
                    <span>WhatsApp Contact Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +60 12-345 6789"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5"
                  />
                </div>

                {/* Delivery Option Toggle */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Collection / Delivery Scheme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                          : 'border-gray-200 text-slate-500 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">1. Self Pickup</span>
                      <span className="text-[9px] block mt-0.5 text-slate-400 font-medium">Pagudpud Bulalo HQ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                          : 'border-gray-200 text-slate-500 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">2. Express Courier</span>
                      <span className="text-[9px] block mt-0.5 text-slate-400 font-medium">Luzon / Visayas / Mindanao</span>
                    </button>
                  </div>
                </div>

                {/* Shipping address info */}
                {deliveryMethod === 'delivery' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Full Shipping Address *
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Barangay, City, Postcode (e.g. Barangay Bulalo, Pagudpud, Ilocos Norte 2919)"
                      rows={3}
                      className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5 resize-none font-semibold"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3.5 rounded border border-gray-200 text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                    <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">PAGUDPUD PRODUCTION COMPILER:</span>
                      <span>You can pick up at our Main HQ (Barangay Bulalo, Pagudpud) once our live tracker marks your order status as "Ready".</span>
                    </div>
                  </div>
                )}

                {/* Note / Message to Seller */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Message / Instructions to Seller (Optional)
                  </label>
                  <textarea
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    placeholder="Provide special instructions, custom placement notes, or sizing requests directly to the printing team..."
                    rows={2}
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5 resize-none font-semibold"
                  />
                </div>

                {/* Pricing Summary Sheets */}
                <div className="border-t border-gray-200 pt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                    <span>Apparel Net Subtotal:</span>
                    <span className="text-slate-800 font-bold">{activeCurrency.code} {(subtotal * activeCurrency.rate).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">12% VAT Value-Added Tax:</span>
                    <span className="text-slate-800 font-bold">{activeCurrency.code} {(tax * activeCurrency.rate).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                    <span>Courier / Logistics Fee:</span>
                    {deliveryMethod === 'pickup' ? (
                      <span className="text-green-600 font-bold">{activeCurrency.code} 0.00 (Self Pickup)</span>
                    ) : shipping === 0 ? (
                      <span className="text-green-600 font-bold">{activeCurrency.code} 0.00 (Free Courier)</span>
                    ) : (
                      <span className="text-slate-800 font-bold">{activeCurrency.code} {(shipping * activeCurrency.rate).toFixed(2)}</span>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-xs text-slate-900 font-bold uppercase tracking-wider">Estimated Grand Total (SST inc):</span>
                    <div className="flex items-baseline space-x-0.5">
                      <span className="text-xs text-slate-500 font-bold">{activeCurrency.code}</span>
                      <span className="text-2xl text-red-600 font-black tracking-tight">{(grandTotal * activeCurrency.rate).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-transform duration-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Print Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Secure Checkout & Pay (GCash/Maya)</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* Visual Preview Modal with Elegant Animations */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row text-left font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-slate-700 shadow-md border border-gray-200 flex items-center justify-center p-0 transition-all cursor-pointer hover:scale-105 active:scale-95 animate-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Mockup Preview Canvas */}
              <div className="w-full md:w-1/2 bg-slate-950 flex flex-col items-center justify-center p-8 text-center relative border-b md:border-b-0 md:border-r border-slate-800">
                {/* Visual grid background details */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />

                <div className="relative w-full aspect-square max-w-sm flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-inner overflow-hidden select-none">
                  {/* Decorative alignment lines */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-[calc(100%-32px)] border-l border-dashed border-slate-800 opacity-20 pointer-events-none" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-px w-[calc(100%-32px)] border-t border-dashed border-slate-800 opacity-20 pointer-events-none" />

                  {/* SVG Garment Vector base */}
                  {(() => {
                    const colorClass = getVectorColorClass(previewItem.config.color);
                    const isTote = previewItem.config.productId === 'prod-006';

                    if (isTote) {
                      return (
                        <div className="relative w-72 h-72 flex items-center justify-center">
                          <svg className={`w-60 h-60 transition-colors duration-300 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
                            <rect x="25" y="40" width="50" height="42" rx="4" />
                            <path d="M35 40 C35 22, 45 22, 45 40" fill="none" stroke="currentColor" strokeWidth="6" />
                            <path d="M55 40 C55 22, 65 22, 65 40" fill="none" stroke="currentColor" strokeWidth="6" />
                          </svg>
                          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-dashed border-red-500 bg-red-600/5 flex items-center justify-center text-red-600">
                            {previewItem.config.logoFile ? (
                              <img src={previewItem.config.logoFile} alt="Logo preview" className="w-full h-full object-contain p-1" />
                            ) : (
                              <div className="text-center font-mono">
                                <span className="text-[9px] font-black tracking-wider text-red-600 block">BAG</span>
                                <span className="text-[7px] text-red-400 block font-bold">NO LOGO</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // For hoodies, tee shirts, collared polos, jerseys
                    const placementSpec = getPlacementOverlay(previewItem.config.printPlacement);
                    return (
                      <div className="relative w-72 h-72 flex items-center justify-center">
                        <svg className={`w-64 h-64 transition-all duration-300 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
                          <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
                          {previewItem.config.productId === 'prod-002' && (
                            <path d="M40 15 L50 25 L60 15 L50 35 Z" fill="#000" opacity="0.15" />
                          )}
                          {previewItem.config.productId === 'prod-005' && (
                            <path d="M38 27 C38 12, 62 12, 62 27 Z" fill="#000" opacity="0.1" />
                          )}
                        </svg>
                        
                        <div className={`${placementSpec.style} border-red-500`}>
                          {previewItem.config.logoFile ? (
                            <img src={previewItem.config.logoFile} alt="Uploaded corporate graphic logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <div className="text-center font-mono p-1">
                              <span className="text-[9px] font-extrabold tracking-wider text-red-600 block leading-tight">{placementSpec.label}</span>
                              <span className="text-[7px] text-red-400 block font-bold">NO VECTOR</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Subtitle / badge info overlays */}
                <div className="mt-4 space-y-1 select-none">
                  <p className="text-[11px] font-mono text-slate-405 text-slate-400 font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>APP_VECTOR_MOCKUP</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium max-w-xs">
                    Visualization ratio based on standard bulk-lot sizing models with standard seam lines.
                  </p>
                </div>
              </div>

              {/* Right Side: Print Spec Specifications Sheet */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase bg-red-100 text-red-650 text-red-600 font-extrabold px-2.5 py-1 rounded border border-red-200 select-none">
                      Tailoring Print Specs
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mt-3 font-display">
                      {previewItem.product.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      High-fidelity visualization for factory warehouse dispatch approvals.
                    </p>
                  </div>

                  {/* Specifications grids */}
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-150 pt-5 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Garment Base Fabric</span>
                      <strong className="text-slate-800 text-xs font-semibold block">{previewItem.config.productId.includes('prod-006') ? 'Organic Heavy Cotton Denim' : 'Ultra-Lux Honeycomb/Interlock'}</strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Selected Fabric Color</span>
                      <strong className="text-red-700 text-xs font-extrabold block uppercase flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full border border-gray-200 shrink-0" style={{
                          backgroundColor: previewItem.config.color === 'Jet Black' || previewItem.config.color === 'Pitch Black' ? '#0f172a' :
                                           previewItem.config.color === 'Pure White' || previewItem.config.color === 'Clean White' ? '#ffffff' :
                                           previewItem.config.color === 'Burgundy red' || previewItem.config.color === 'Red Wine' || previewItem.config.color === 'Laser Red' ? '#be123c' :
                                           previewItem.config.color === 'Navy Blue' ? '#1e3a8a' :
                                           previewItem.config.color === 'Forest Green' || previewItem.config.color === 'Emerald Green' || previewItem.config.color === 'Sage Green' ? '#064e3b' :
                                           previewItem.config.color === 'Heather Grey' || previewItem.config.color === 'Charcoal Grey' ? '#94a3b8' :
                                           previewItem.config.color === 'Royal Blue' || previewItem.config.color === 'Electric Blue' ? '#2563eb' :
                                           previewItem.config.color === 'Neon Yellow' ? '#fde047' :
                                           previewItem.config.color === 'Orange Crush' ? '#f97316' : '#d97706'
                        }} />
                        <span>{previewItem.config.color}</span>
                      </strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Print/Embroidery Method</span>
                      <strong className="text-slate-800 text-xs font-extrabold block">{getMethodName(previewItem.config.printMethod)}</strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Selected Printing Zone</span>
                      <strong className="text-slate-800 text-xs font-extrabold block">{getPlacementName(previewItem.config.printPlacement)}</strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Ordered Print Quantity</span>
                      <strong className="text-slate-800 text-xs font-semibold block">{previewItem.config.quantity} Uniform Units</strong>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Size Specification</span>
                      <strong className="text-slate-800 text-xs font-semibold block">{previewItem.config.size} Size Class</strong>
                    </div>
                  </div>

                  {/* Logo info block */}
                  <div className="mt-5 bg-slate-50 border border-gray-150 p-4 rounded-xl space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Attached Production Vector File</span>
                    <p className="text-slate-800 font-mono font-semibold flex items-center gap-1.5 break-all">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span>{previewItem.config.logoFileName || 'No uploaded asset - Using standard placement overlay'}</span>
                    </p>
                  </div>

                  {/* Special notes block */}
                  {previewItem.config.specialNotes && (
                    <div className="mt-4 space-y-1 text-xs text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none font-semibold">Thread & Special Alignment Notes</span>
                      <p className="text-slate-600 bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 italic text-[11px] leading-relaxed font-semibold">
                        "{previewItem.config.specialNotes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-gray-150 flex flex-col gap-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold text-slate-500 select-none">Lot Cost Quote:</span>
                    <strong className="text-lg font-mono text-slate-900">
                      {activeCurrency.code} {(previewItem.totalPrice * activeCurrency.rate).toFixed(2)}
                    </strong>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setPreviewItem(null)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer text-center"
                  >
                    Confirm & Return to Checkout
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
