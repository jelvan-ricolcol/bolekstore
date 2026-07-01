import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Settings, Plus, Edit2, Trash2, Check, RefreshCw, 
  Layers, Package, FileText, Send, Tag, Ban, Save, Percent, 
  TrendingUp, Coins, Palette, Users, ChevronRight, CheckCircle, Info,
  MessageSquare, Crown, CreditCard, AlertTriangle, Sparkles, Zap
} from 'lucide-react';
import { 
  ApparelProduct, ApparelCategory, Order, QuoteRequest, 
  CompanySettings, Currency, ThemeConfig 
} from '../types';

interface SellerDeskProps {
  products: ApparelProduct[];
  onAddProduct: (p: ApparelProduct) => void;
  onUpdateProduct: (p: ApparelProduct) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateOrderPayment: (orderId: string, completed: boolean) => void;
  quoteRequests: QuoteRequest[];
  onRespondQuote: (quoteId: string, text: string) => void;
  companySettings: CompanySettings;
  onUpdateCompanySettings: (settings: CompanySettings) => void;
  currencies: Currency[];
  onUpdateCurrencyRate: (code: string, newRate: number) => void;
  activeCurrency: Currency;
  
  // Custom print services cost matrix props
  printMethods: any[];
  onUpdatePrintMethodPrice: (id: string, price: number) => void;
  printPlacements: any[];
  onUpdatePrintPlacementModifier: (id: string, modifier: number) => void;
  onSendOrderMessage?: (orderId: string, text: string, sender: 'customer' | 'seller', senderName: string) => void;
}

const getClothingVectorSmall = (id: string, colorClass: string = "text-slate-700") => {
  // Simple stylized helper for thumbnails
  if (id.includes('prod-005') || id.includes('hoodie')) { // Hoodie
    return (
      <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 25 L25 27 L15 39 L25 45 L28 38 L31 38 L31 82 L69 82 L69 38 L72 38 L75 45 L85 39 L75 27 Z" />
        <path d="M38 27 C38 12, 62 12, 62 27 Z" fill="#000" opacity="0.15" />
      </svg>
    );
  }
  if (id.includes('prod-003') || id.includes('jersey') || id.includes('sport')) { // Jersey
    return (
      <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 15 L25 19 L19 33 L28 39 L28 85 L72 85 L72 39 L81 39 L75 19 Z" />
      </svg>
    );
  }
  if (id.includes('prod-006') || id.includes('bag') || id.includes('tote')) { // Tote bag
    return (
      <svg className={`w-8 h-8 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
        <rect x="25" y="40" width="50" height="42" rx="4" />
        <path d="M35 40 C35 22, 45 22, 45 40" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M55 40 C55 22, 65 22, 65 40" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }
  if (id.includes('prod-002') || id.includes('prod-004') || id.includes('polo') || id.includes('uniform')) { // Polo / F1 Shirt
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

export default function SellerDesk({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onUpdateOrderPayment,
  quoteRequests,
  onRespondQuote,
  companySettings,
  onUpdateCompanySettings,
  currencies,
  onUpdateCurrencyRate,
  activeCurrency,
  printMethods,
  onUpdatePrintMethodPrice,
  printPlacements,
  onUpdatePrintPlacementModifier,
  onSendOrderMessage
}: SellerDeskProps) {
  const [activePane, setActivePane] = useState<'products' | 'orders' | 'quotes' | 'invoicing' | 'services' | 'currencies'>('products');
  const [orderChatInputs, setOrderChatInputs] = useState<Record<string, string>>({});
  
  // Product Edit/Add Modal States
  const [editingProduct, setEditingProduct] = useState<ApparelProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState<ApparelCategory>('casual');
  const [prodPrice, setProdPrice] = useState(10.0);
  const [prodFeatures, setProdFeatures] = useState('');
  const [prodPopularSpec, setProdPopularSpec] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodFabrics, setProdFabrics] = useState('');
  const [prodImage, setProdImage] = useState('👕');

  // Quote answer response
  const [quoteAnswerText, setQuoteAnswerText] = useState<{ [id: string]: string }>({});

  // Helper formatting for dynamic currency calculation
  const formatPrice = (priceInPHP: number) => {
    const finalVal = priceInPHP * activeCurrency.rate;
    return `${activeCurrency.symbol}${finalVal.toFixed(2)}`;
  };

  // Populate product form for editing
  const openEditProduct = (prod: ApparelProduct) => {
    setEditingProduct(prod);
    setIsNewProduct(false);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdCategory(prod.category);
    setProdPrice(prod.basePrice);
    setProdFeatures(prod.features.join('\n'));
    setProdPopularSpec(prod.popularSpec || '');
    setProdColors(prod.colors.join(', '));
    setProdSizes(prod.sizes.join(', '));
    setProdFabrics(prod.fabricOptions.join(', '));
    setProdImage(prod.image);
    setShowProductModal(true);
  };

  // Populate form for creating a new product
  const openCreateProduct = () => {
    setEditingProduct(null);
    setIsNewProduct(true);
    setProdName('');
    setProdDesc('');
    setProdCategory('casual');
    setProdPrice(15.0);
    setProdFeatures('Premium finish\nPre-shrunk fibers');
    setProdPopularSpec('Perfect branding baseline shirt');
    setProdColors('Jet Black, Pure White, Royal Blue');
    setProdSizes('S, M, L, XL, 2XL');
    setProdFabrics('180gsm Cotton, 200gsm Heavyweight');
    setProdImage('👕');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc) return;

    const parsedProduct: ApparelProduct = {
      id: isNewProduct ? `prod-${Date.now().toString().slice(-4)}` : (editingProduct?.id || ''),
      name: prodName,
      description: prodDesc,
      category: prodCategory,
      basePrice: Number(prodPrice),
      image: prodImage || '👕',
      features: prodFeatures.split('\n').filter(f => f.trim()),
      popularSpec: prodPopularSpec || undefined,
      colors: prodColors.split(',').map(c => c.trim()).filter(c => c),
      sizes: prodSizes.split(',').map(s => s.trim()).filter(s => s),
      fabricOptions: prodFabrics.split(',').map(f => f.trim()).filter(f => f)
    };

    if (isNewProduct) {
      onAddProduct(parsedProduct);
    } else {
      onUpdateProduct(parsedProduct);
    }
    setShowProductModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-left font-sans selection:bg-red-650 selection:text-white">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 font-mono">
            <span className="p-1 rounded bg-amber-100 text-amber-800 font-bold">Admin Portal</span>
            <span>&bull;</span>
            <span>Jelvans Workshop Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2 font-display">
            <Crown className="w-6 h-6 text-amber-500 fill-amber-100" />
            <span>Production Command Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Configuring base products catalog, multi-currency values, live SST e-invoices, and print method rates.</p>
        </div>

        {/* Global overview stats */}
        <div className="flex gap-4 scrollbar-hide overflow-x-auto py-1">
          <div className="bg-slate-50 border border-gray-200 p-3 rounded-lg text-left shadow-2xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Orders</span>
            <span className="text-lg font-black text-slate-900 leading-tight">{orders.length} Logged</span>
          </div>
          <div className="bg-slate-50 border border-gray-200 p-3 rounded-lg text-left shadow-2xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Active Tickets</span>
            <span className="text-lg font-black text-slate-900 leading-tight">
              {orders.filter(o => o.status !== 'Completed').length} Pending
            </span>
          </div>
          <div className="bg-slate-50 border border-gray-200 p-3 rounded-lg text-left shadow-2xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Bespoke RFQs</span>
            <span className="text-lg font-black text-slate-900 leading-tight">
              {quoteRequests.filter(q => q.status === 'Pending').length} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-2.5 block">Menu Sections:</span>
          
          <button
            onClick={() => setActivePane('products')}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors ${
              activePane === 'products'
                ? 'bg-red-50 text-red-650 text-red-600 border border-red-100'
                : 'hover:bg-gray-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-red-600" />
              <span>Base Apparel Catalog</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-slate-500 rounded font-bold">{products.length}</span>
          </button>

          <button
            onClick={() => setActivePane('orders')}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors ${
              activePane === 'orders'
                ? 'bg-red-50 text-red-650 text-red-600 border border-red-100'
                : 'hover:bg-gray-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              <span>Orders Triage Center</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-slate-500 rounded font-bold">{orders.length}</span>
          </button>

          <button
            onClick={() => setActivePane('quotes')}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors ${
              activePane === 'quotes'
                ? 'bg-red-50 text-red-650 text-red-650 text-red-600 border border-red-100'
                : 'hover:bg-gray-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-red-600" />
              <span>Bespoke RFQ Quotes</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-slate-500 rounded font-bold">{quoteRequests.length}</span>
          </button>

          <div className="h-px bg-gray-200 my-3"></div>
          
          <button
            onClick={() => setActivePane('currencies')}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors ${
              activePane === 'currencies'
                ? 'bg-red-50 text-red-655 text-red-600 border border-red-100'
                : 'hover:bg-gray-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-red-600" />
              <span>Live Currency Values</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Rate Settings</span>
          </button>

          <button
            onClick={() => setActivePane('invoicing')}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors ${
              activePane === 'invoicing'
                ? 'bg-red-50 text-red-655 text-red-600 border border-red-100'
                : 'hover:bg-gray-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-red-600" />
              <span>e-Invoicing Parameters</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium font-sans">Entity Tax</span>
          </button>

          <button
            onClick={() => setActivePane('services')}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors ${
              activePane === 'services'
                ? 'bg-red-50 text-red-655 text-red-600 border border-red-100'
                : 'hover:bg-gray-50 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-red-600" />
              <span>Print Methods Pricing</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Cost Matrix</span>
          </button>
        </div>

        {/* Action Pane Content area */}
        <div className="lg:col-span-9 bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-2xs">
          
          {/* BASE PRODUCTS CATALOG MANAGER */}
          {activePane === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-tight">Apparel Custom Base Models</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Edit or append clothing baselines. Customers instantly configure color/sizing options live in customization step.</p>
                </div>
                <button
                  onClick={openCreateProduct}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Apparel Model</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(prod => (
                  <div key={prod.id} className="p-4 border border-gray-200 rounded-xl flex items-start gap-4 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-colors relative">
                    <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200 shadow-3xs flex-shrink-0">
                      {getClothingVectorSmall(prod.id, "text-red-600")}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-red-650 text-red-600 tracking-wider bg-red-50 border border-red-100 px-1.5 py-0.5 rounded leading-none">
                          {prod.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">{prod.id}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{prod.description}</p>
                      
                      <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-extrabold text-slate-800">Base Cost: {formatPrice(prod.basePrice)}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">{prod.colors.length} Colors</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">{prod.sizes.length} Sizes</span>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => openEditProduct(prod)}
                        className="p-1.5 bg-white text-slate-600 hover:text-indigo-650 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded shadow-3xs transition-all cursor-pointer"
                        title="Edit Apparel Model Info"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to completely purge and remove the apparel ${prod.name}?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 bg-white text-slate-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded shadow-3xs transition-all cursor-pointer"
                        title="Purge Apparel Model"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS TRIAGE WORKSPACE */}
          {activePane === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-tight">Active Client Invoices & Job Triage</h3>
                <p className="text-xs text-slate-500 mt-0.5">Toggle job stages block, trace payment compliancy parameters, and print legal offsets invoice specs.</p>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-12 bg-slate-50 border border-gray-150 text-center rounded-xl p-4 text-xs font-semibold text-slate-500">
                    No checkout invoices registered in workspace yet. Let standard users checkouts compile orders.
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-xs transition-shadow">
                      <div className="bg-slate-50 border-b border-gray-100 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold font-mono text-slate-900 text-xs sm:text-sm">{order.id}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{order.date}</span>
                          </div>
                          <span className="text-[11px] text-slate-505 text-slate-500 font-medium block mt-0.5">{order.customerDetails.name} &bull; {order.customerDetails.email}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 select-none">
                          {/* Payment badge status */}
                          <button
                            onClick={() => onUpdateOrderPayment(order.id, !order.paymentCompleted)}
                            className={`p-1.5 rounded text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
                              order.paymentCompleted
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-600'
                            }`}
                            title="Toggle Invoice Paid Tally"
                          >
                            {order.paymentCompleted ? (
                              <>
                                <CreditCard className="w-3 h-3 text-green-700" />
                                <span>Paid SST</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 text-red-650" />
                                <span>Overdue</span>
                              </>
                            )}
                          </button>

                          {/* Order Status Select */}
                          <div className="flex items-center border border-gray-350 rounded bg-white">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                              className="text-[11px] bg-transparent text-slate-900 outline-none p-1.5 font-bold cursor-pointer pr-1"
                            >
                              <option value="Received">Received</option>
                              <option value="Designing">Designing</option>
                              <option value="Printing">Printing</option>
                              <option value="Ready">Ready</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Order Custom apparel spec configurations list */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ordered Items specs:</span>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-100 rounded bg-slate-50/50 hover:bg-white text-xs gap-2">
                              <div>
                                <span className="font-bold text-slate-800 leading-normal block">{item.product.name}</span>
                                <span className="text-[10px] text-slate-500 leading-relaxed block mt-0.5">
                                  Size: <b className="text-slate-850">{item.config.size}</b> &bull; 
                                  Color: <b className="text-slate-850">{item.config.color}</b> &bull; 
                                  Fabric: <b className="text-slate-850">{item.config.fabricWeight}</b> &bull; 
                                  Print: <b className="text-slate-850 font-mono text-[10px] bg-white border border-gray-150 px-1 rounded">{item.config.printMethod}</b> &bull; 
                                  Placement: <b className="text-slate-850 uppercase text-[9px] font-bold font-mono">{item.config.printPlacement}</b>
                                </span>
                                {item.config.specialNotes && (
                                  <span className="text-[10px] text-red-600 block italic mt-1 font-medium bg-red-50/50 p-1 rounded border border-red-50">
                                    Notes: {item.config.specialNotes}
                                  </span>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-bold block text-slate-805 text-slate-800">x{item.config.quantity} units</span>
                                <span className="text-[10px] text-slate-400 font-semibold block">Total: {formatPrice(item.totalPrice)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Invoice Financial summary footer */}
                        <div className="border-t border-gray-100 pt-3 flex flex-wrap justify-between items-center gap-3 text-xs">
                          <div className="text-slate-500 space-x-2">
                            <span>Subtotal: {formatPrice(order.subtotal)}</span>
                            <span>&bull;</span>
                            <span>Tax: {formatPrice(order.tax)}</span>
                            <span>&bull;</span>
                            <span className="font-bold text-slate-800">Grand Total: {formatPrice(order.total)}</span>
                          </div>

                          <span className="text-[11px] text-slate-500 italic block">
                            Invoicing Address: <b className="text-slate-800 not-italic">{order.customerDetails.address}</b>
                          </span>
                        </div>

                        {/* Customer Messaging Desk section */}
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Client Chat Logs & Workshop Instructions:</span>
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                              {order.messages?.length || 0} messages
                            </span>
                          </div>

                          {/* Render current message logs inside a neat bubble stream */}
                          {order.messages && order.messages.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-50 border border-gray-150 rounded p-2.5">
                              {order.messages.map((msg) => {
                                const isCustomer = msg.sender === 'customer';
                                return (
                                  <div key={msg.id} className="text-xs">
                                    <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-bold mb-0.5">
                                      <span className={isCustomer ? 'text-red-600 font-extrabold' : 'text-slate-600 font-extrabold'}>{msg.senderName}</span>
                                      <span>&bull;</span>
                                      <span>{msg.timestamp}</span>
                                    </div>
                                    <p className={`p-2 rounded font-semibold leading-relaxed ${isCustomer ? 'bg-red-50 text-slate-850 border border-red-100 shadow-3xs' : 'bg-slate-200/50 text-slate-800'}`}>
                                      {msg.text}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-slate-50 border border-gray-100 rounded text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>No live messages yet. Choose a preset update below or draft an instruction!</span>
                            </div>
                          )}

                          {/* Quick Response Presets */}
                          <div className="pt-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Quick Presets:</span>
                            <div className="flex flex-wrap gap-1">
                              {[
                                'Order approved. Beginning proofing stage.',
                                'Sizing & specs verified. Queueing for CNC production.',
                                'Print process completed. Ready for local collection.',
                                'Dispatch notification: Parcel tracking info updated.'
                              ].map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    if (onSendOrderMessage) {
                                      onSendOrderMessage(order.id, preset, 'seller', 'Jelvans Workshop');
                                    }
                                  }}
                                  className="text-[9.5px] bg-white hover:bg-slate-55 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-gray-200 px-2 py-1 rounded text-slate-705 font-bold transition-all cursor-pointer hover:border-red-200"
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Send input */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const txt = orderChatInputs[order.id];
                              if (!txt || !txt.trim()) return;
                              if (onSendOrderMessage) {
                                onSendOrderMessage(order.id, txt.trim(), 'seller', 'Jelvans Workshop');
                              }
                              setOrderChatInputs(prev => ({ ...prev, [order.id]: '' }));
                            }}
                            className="flex gap-2 pt-1"
                          >
                            <input
                              type="text"
                              value={orderChatInputs[order.id] || ''}
                              onChange={(e) => setOrderChatInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                              placeholder="Draft dispatch updates or response to candidate specifications..."
                              className="flex-grow bg-white border border-gray-300 text-xs px-2.5 py-1.5 rounded outline-none focus:border-red-600 font-semibold"
                            />
                            <button
                              type="submit"
                              className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer"
                            >
                              Send
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* BESPOKE ENTERPRISE RFQ QUOTE REGISTRY */}
          {activePane === 'quotes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-tight">Enterprise RFQ Bid Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">Log custom volume discount estimations and send immediate admin answers to bulk queries.</p>
              </div>

              <div className="space-y-4">
                {quoteRequests.length === 0 ? (
                  <div className="py-12 bg-slate-50 border border-gray-150 text-center rounded-xl p-4 text-xs font-semibold text-slate-500">
                    No custom quote request registered yet. Enterprise RFQ form compiles custom bids instantly.
                  </div>
                ) : (
                  quoteRequests.map(quote => (
                    <div key={quote.id} className="p-4 border border-gray-200 rounded-xl space-y-3 hover:shadow-xs transition-shadow">
                      <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-2 flex-col sm:flex-row">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black font-mono text-slate-900">{quote.id}</span>
                            <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 border rounded-full flex items-center gap-1 ${
                              quote.urgency === 'super_urgent'
                                ? 'bg-red-50 border-red-150 text-red-600'
                                : quote.urgency === 'urgent'
                                ? 'bg-amber-50 border-amber-150 text-amber-800'
                                : 'bg-gray-50 border-gray-150 text-slate-600'
                            }`}>
                              <Zap className="w-2.5 h-2.5 fill-current shrink-0" />
                              <span>{quote.urgency.replace('_', ' ')}</span>
                            </span>
                            
                            <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded ${
                              quote.status === 'Responded'
                                ? 'bg-green-50 border border-green-150 text-green-700'
                                : 'bg-yellow-50 border border-yellow-150 text-yellow-800'
                            }`}>
                              {quote.status}
                            </span>
                          </div>
                          
                          <div className="text-[11px] text-slate-500 mt-1">
                            Submitted on {quote.createdAt} &bull; <b>{quote.name}</b> ({quote.email} &bull; {quote.phone})
                          </div>
                        </div>

                        <span className="text-xs bg-slate-100 border border-gray-200 p-1.5 rounded font-black font-mono">
                          Est. Quantity: {quote.estimatedQty} units
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <span className="font-bold text-slate-700">Client Requirement Description:</span>
                        <p className="bg-slate-50 p-2.5 rounded border border-gray-150 text-slate-600 font-medium leading-relaxed">
                          {quote.description}
                        </p>
                      </div>

                      {/* Previous responsive comments */}
                      {quote.sellerResponse && (
                        <div className="text-xs bg-green-50 border border-green-100 p-3 rounded space-y-1">
                          <span className="font-black text-green-900 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Submitted Seller Bid Solution:</span>
                          </span>
                          <p className="text-green-700 font-medium whitespace-pre-line leading-relaxed">{quote.sellerResponse}</p>
                        </div>
                      )}

                      {/* Live text area reply answer ticket */}
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const answerText = quoteAnswerText[quote.id];
                        if (!answerText) return;
                        onRespondQuote(quote.id, answerText);
                        // clear state
                        setQuoteAnswerText(prev => ({ ...prev, [quote.id]: '' }));
                      }} className="space-y-2 pt-2 text-xs">
                        <label className="font-bold text-slate-700 block">Draft Corporate Solution/Response Pricing:</label>
                        <textarea
                          rows={2}
                          value={quoteAnswerText[quote.id] || ''}
                          onChange={(e) => setQuoteAnswerText(prev => ({ ...prev, [quote.id]: e.target.value }))}
                          placeholder="e.g., We can offer this for PHP 250.00 per unit. Complimentary setup for embroidery included with complimentary courier shipment to your office within 3 working days."
                          className="w-full text-xs p-2.5 border border-gray-200 hover:border-gray-300 outline-none rounded font-sans leading-relaxed"
                        ></textarea>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-white" />
                            <span>Confirm Answer Bid</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* LIVE EXCHANGE RATE VALUES MANAGER */}
          {activePane === 'currencies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-tight">Active Currency Exchange Parameters</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure live conversion multipliers relative to baseline (1 PHP = Rate unit). All catalog entries transform dynamically.</p>
              </div>

              <div className="border border-gray-250 rounded-xl overflow-hidden shadow-3xs max-w-lg">
                <table className="min-w-full text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-gray-250">
                    <tr>
                      <th className="px-4 py-3 text-left">Currency Ticker</th>
                      <th className="px-4 py-3 text-left">Represent Symbol</th>
                      <th className="px-4 py-3 text-left">Baseline Exchange multiplier</th>
                      <th className="px-3 py-3 text-right">Raw Multiplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {currencies.map(cur => (
                      <tr key={cur.code} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{cur.code}</td>
                        <td className="px-4 py-3 font-semibold text-slate-500 font-sans">{cur.symbol}</td>
                        <td className="px-4 py-3 text-slate-500">
                          1.00 PHP = {cur.symbol}{cur.rate.toFixed(4)} {cur.code}
                        </td>
                        <td className="px-3 py-3.5 text-right w-36">
                          {cur.code === 'PHP' ? (
                            <span className="text-slate-400 pr-3 font-bold">1.0 (Fixed)</span>
                          ) : (
                            <input
                              type="number"
                              step="0.0001"
                              value={cur.rate}
                              onChange={(e) => onUpdateCurrencyRate(cur.code, Number(e.target.value))}
                              className="w-full text-right bg-slate-50 hover:bg-white border hover:border-gray-300 rounded font-bold p-1 outline-none font-mono"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-xs font-medium text-orange-850 flex items-start gap-2 max-w-lg">
                <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-orange-900">Exchange Compliance Information:</h4>
                  <p className="mt-0.5 leading-relaxed text-orange-700">Updating rates affects catalogs, customization calculations, cart unit lines, custom corporate requests, and final downloadable tax compliant PDF prints live.</p>
                </div>
              </div>
            </div>
          )}

          {/* e-INVOICING SST PARAMETERS */}
          {activePane === 'invoicing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-tight">Legal Entities & Invoicing Parameters</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize corporate registries, SST taxing ratios, and registered factory warehouse headers. Synchronizes directly to client invoices.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Invoicing credentials saved successfully.');
              }} className="space-y-4 max-w-xl text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">Registered Legal Corporation Entity Name</label>
                    <input
                      type="text"
                      value={companySettings.name}
                      onChange={(e) => onUpdateCompanySettings({ ...companySettings, name: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">B2B Sales SST registration Number</label>
                    <input
                      type="text"
                      value={companySettings.sstNo}
                      onChange={(e) => onUpdateCompanySettings({ ...companySettings, sstNo: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">SSM Company registration Tally ID</label>
                    <input
                      type="text"
                      value={companySettings.regNo}
                      onChange={(e) => onUpdateCompanySettings({ ...companySettings, regNo: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">Standard Billing SST tax Rate Ratio</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={companySettings.taxRate}
                        onChange={(e) => onUpdateCompanySettings({ ...companySettings, taxRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-bold text-slate-805 text-slate-800 pl-10"
                      />
                      <Percent className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">Hotline Telephone Customer Support</label>
                    <input
                      type="text"
                      value={companySettings.contactPhone}
                      onChange={(e) => onUpdateCompanySettings({ ...companySettings, contactPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">Primary Corporate billing email Address</label>
                    <input
                      type="email"
                      value={companySettings.contactEmail}
                      onChange={(e) => onUpdateCompanySettings({ ...companySettings, contactEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-505 text-slate-500 font-bold">Factory Warehouse Registered HQ Office Address</label>
                  <textarea
                    rows={2}
                    value={companySettings.address}
                    onChange={(e) => onUpdateCompanySettings({ ...companySettings, address: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-300 rounded p-2.5 outline-none font-semibold text-slate-800 font-sans"
                  ></textarea>
                </div>

                <div className="bg-green-50 border border-green-150 p-3 rounded-lg text-[11px] font-medium text-green-800">
                  BIR & SEC compliance is maintained dynamically. Adjusting these registries alters dynamic invoices on client checkout tracking logs without re-rendering compiling systems.
                </div>
              </form>
            </div>
          )}

          {/* SERVICES COST MATRIX */}
          {activePane === 'services' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-tight">Printing Services Custom Price Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify the base cost calculations for specific print methodologies. Tailoring equations adapt instantly in direct builder widgets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
                {/* Print Methods list */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-450 text-slate-400 uppercase tracking-widest block">Core Printing Options:</span>
                  {printMethods.map(m => (
                    <div key={m.id} className="p-3 border border-gray-200 rounded-xl bg-slate-50/50 hover:bg-white transition-colors space-y-1.5 text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-900 block">{m.name}</span>
                        <div className="w-24 flex items-center border border-gray-350 bg-white rounded">
                          <span className="pl-2.5 font-bold text-slate-400">PHP</span>
                          <input
                            type="number"
                            step="0.10"
                            value={m.price}
                            onChange={(e) => onUpdatePrintMethodPrice(m.id, Number(e.target.value))}
                            className="w-full text-right p-1.5 font-mono font-bold outline-none border-none text-slate-800"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal font-sans pr-4">{m.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Print placements multipliers */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-450 text-slate-400 uppercase tracking-widest block">Placement Multipliers:</span>
                  {printPlacements.map(p => (
                    <div key={p.id} className="p-3 border border-gray-200 rounded-xl bg-slate-50/50 hover:bg-white transition-colors flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-slate-900 block leading-none">{p.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono uppercase">{p.id} modifier</span>
                      </div>
                      <div className="w-24 flex items-center border border-gray-350 bg-white rounded-md overflow-hidden flex-shrink-0">
                        <input
                          type="number"
                          step="0.05"
                          value={p.modifier}
                          onChange={(e) => onUpdatePrintPlacementModifier(p.id, Number(e.target.value))}
                          className="w-full text-right p-1.5 font-mono font-bold outline-none border-none text-slate-800"
                        />
                        <span className="pr-2 text-[10px] text-slate-350 font-bold">x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* APPAREL MODEL EDIT / CREATE MODAL */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-250 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative text-left text-xs font-sans"
            >
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-gray-50 border p-1 rounded cursor-pointer"
              >
                <Ban className="w-4 h-4" />
              </button>

              <div className="border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-md font-black text-slate-900 uppercase">
                  {isNewProduct ? 'Add Apparel Baseline Class' : `Modify Baseline Specs: ${editingProduct?.id}`}
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Introduce name, customizable base pricing index points, material descriptors, and sizes coordinates.</p>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Baseline Clothing Label Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Comfymax Active Premium Singlet"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2 focus:border-red-650 outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-505 text-slate-500 font-bold">Base Cost index (PHP Rate)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="Pricing..."
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2 focus:border-red-656 focus:border-red-600 outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Catalog Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2 font-bold focus:border-red-600"
                    >
                      <option value="corporate">Corporate Uniform</option>
                      <option value="casual">Casualwear</option>
                      <option value="sports">Sportswear</option>
                      <option value="premium">Hoodies / Caps</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Base Design Layout Model</label>
                    <select
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2 font-bold focus:border-red-600"
                    >
                      <option value="👕">Classic Crew Roundneck</option>
                      <option value="👔">Collared Honeycomb Polo</option>
                      <option value="🧥">Heavyweight Pullover Hoodie</option>
                      <option value="🎽">Quickdry Micro mesh Jersey</option>
                      <option value="👜">Organic Heavy Denim Tote</option>
                      <option value="🧢">Cotton Sandwich Cap</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Popular Specification Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Best choice for retail staff"
                      value={prodPopularSpec}
                      onChange={(e) => setProdPopularSpec(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2 outline-none focus:border-red-600 font-semibold text-slate-755"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Interactive Narrative Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Provide detailing properties..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded p-2 outline-none focus:border-red-650 font-medium"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Supported Colors (comma-separated)</label>
                    <input
                      type="text"
                      required
                      placeholder="Jet Black, Pure White"
                      value={prodColors}
                      onChange={(e) => setProdColors(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-254 border-gray-300 rounded p-2 focus:border-red-600 outline-none leading-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-505 text-slate-505 text-slate-505 text-slate-505 text-slate-500 font-bold">Supported Sizes (comma-separated)</label>
                    <input
                      type="text"
                      required
                      placeholder="S, M, L, XL"
                      value={prodSizes}
                      onChange={(e) => setProdSizes(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded p-2 focus:border-red-600 outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-555 text-slate-500 font-bold">Fabric Thickness weights option</label>
                    <input
                      type="text"
                      required
                      placeholder="180gsm Cotton, 220gsm Heavy Honeycomb"
                      value={prodFabrics}
                      onChange={(e) => setProdFabrics(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-354 border-gray-300 rounded p-2 focus:border-red-600 outline-none font-bold text-slate-805"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Bullet Features Highlight (line-separated)</label>
                  <textarea
                    rows={2.5}
                    placeholder="Enter highlights, one per line..."
                    value={prodFeatures}
                    onChange={(e) => setProdFeatures(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded p-2 outline-none focus:border-red-650 font-bold leading-normal"
                  ></textarea>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 border bg-white hover:bg-gray-50 rounded text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>Save Baseline Specs</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
