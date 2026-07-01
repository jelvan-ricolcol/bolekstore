import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import Customizer from './components/Customizer';
import CartView from './components/CartView';
import OrdersTracker from './components/OrdersTracker';
import QuoteBuilder from './components/QuoteBuilder';
import { JELVANS_PRODUCTS, PRINT_METHODS, PRINT_PLACEMENTS, calculateItemPrice } from './data';
import { CartItem, Order, ApparelConfig, QuoteRequest, User, Currency, ThemeConfig, CompanySettings, ApparelProduct } from './types';
import { BadgeCheck, Sparkles, AlertCircle, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SellerDesk from './components/SellerDesk';

// Starter orders to display in the live tracking pane from day one
const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: 'INV-55250481',
    date: '28/05/2026',
    items: [
      {
        id: 'job-p01',
        product: JELVANS_PRODUCTS[1], // Honeycomb polo
        config: {
          productId: 'prod-002',
          productName: JELVANS_PRODUCTS[1].name,
          color: 'Navy Blue',
          size: 'L',
          fabricWeight: '240gsm Heavy honeycomb',
          printMethod: 'embroidery',
          printPlacement: 'front_chest',
          quantity: 25,
          logoFileName: 'Meralco_Energy_Logo.png'
        },
        unitPrice: 518.00,
        totalPrice: 12950.00
      },
      {
        id: 'job-p02',
        product: JELVANS_PRODUCTS[2], // Microfiber jersey
        config: {
          productId: 'prod-003',
          productName: JELVANS_PRODUCTS[2].name,
          color: 'Electric Blue',
          size: 'XL',
          fabricWeight: '160gsm Smooth interlock',
          printMethod: 'sublimation',
          printPlacement: 'front_center',
          quantity: 25,
          logoFileName: 'Meralco_Corporate_Grid.ai'
        },
        unitPrice: 420.00,
        totalPrice: 10500.00
      }
    ],
    subtotal: 23450.00,
    tax: 2814.00, // 12% PH VAT
    shipping: 0.00,
    total: 26264.00,
    customerDetails: {
      name: 'Maria Clara Santos',
      email: 'clara.santos@meralco.com.ph',
      phone: '+63 917 123 4567',
      address: 'Meralco Plaza, Ortigas Avenue, Pasig City, Metro Manila 1605',
      deliveryMethod: 'delivery'
    },
    status: 'Printing', // Active stage
    paymentCompleted: true
  },
  {
    id: 'INV-81203014',
    date: '15/05/2026',
    items: [
      {
        id: 'job-p03',
        product: JELVANS_PRODUCTS[0], // Cotton Round neck
        config: {
          productId: 'prod-001',
          productName: JELVANS_PRODUCTS[0].name,
          color: 'Jet Black',
          size: 'M',
          fabricWeight: '200gsm Heavyweight Cotton',
          printMethod: 'dtf',
          printPlacement: 'front_center',
          quantity: 12,
          logoFileName: 'Jelvans_Core_Banner.png'
        },
        unitPrice: 465.50,
        totalPrice: 5586.00
      }
    ],
    subtotal: 5586.00,
    tax: 670.32,
    shipping: 250.00,
    total: 6256.32,
    customerDetails: {
      name: 'Rjelvan Baloaloa',
      email: 'rjelvanbaloaloa@gmail.com',
      phone: '+63 912 323 1152',
      address: 'Bulalo Siubec Pagudpud, Ilocos Norte 2919',
      deliveryMethod: 'delivery'
    },
    status: 'Completed', // Finished stage
    paymentCompleted: true
  }
];

const INITIAL_CURRENCIES: Currency[] = [
  { code: 'PHP', symbol: '₱', rate: 1.0 },
  { code: 'USD', symbol: '$', rate: 0.017 },
  { code: 'SGD', symbol: 'S$', rate: 0.023 },
  { code: 'EUR', symbol: '€', rate: 0.016 },
  { code: 'GBP', symbol: '£', rate: 0.013 },
  { code: 'MYR', symbol: 'RM', rate: 0.081 }
];

const INITIAL_THEMES: ThemeConfig[] = [
  { id: 'sleek', name: 'Sleek Interface', accentCode: '#dc2626', hoverCode: '#b91c1c', lightCode: '#fef2f2', borderCode: '#fca5a5', textDarkCode: '#991b1b' },
  { id: 'classic', name: 'Classic Blue', accentCode: '#2563eb', hoverCode: '#1d4ed8', lightCode: '#eff6ff', borderCode: '#bfdbfe', textDarkCode: '#1e40af' },
  { id: 'forest', name: 'Forest Gold', accentCode: '#15803d', hoverCode: '#166534', lightCode: '#f0fdf4', borderCode: '#bbf7d0', textDarkCode: '#166534' },
  { id: 'cosmic', name: 'Cosmic Slate', accentCode: '#0f172a', hoverCode: '#1e293b', lightCode: '#f8fafc', borderCode: '#cbd5e1', textDarkCode: '#0f172a' }
];

const INITIAL_SETTINGS: CompanySettings = {
  name: 'Jelvans Clothing Group PH',
  sstNo: 'SEC-REG-202611893-T',
  regNo: '202603124567-PH',
  contactEmail: 'support@jelvansclothing.ph',
  contactPhone: '+63 912 323 1152',
  address: 'Bulalo Siubec Pagudpud, Ilocos Norte 2919',
  taxRate: 0.12
};

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jelvans_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Currencies state
  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    const saved = localStorage.getItem('jelvans_currencies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Currency[];
        const php = parsed.find(c => c.code === 'PHP');
        if (php && php.rate === 1.0) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_CURRENCIES;
  });

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(() => {
    return localStorage.getItem('jelvans_currency_code') || 'PHP';
  });

  // Themes state
  const [themes, setThemes] = useState<ThemeConfig[]>((() => {
    const saved = localStorage.getItem('jelvans_themes');
    return saved ? JSON.parse(saved) : INITIAL_THEMES;
  }));
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('jelvans_theme_id') || 'sleek';
  });

  // Products state to support seller product additions/deletions/renamings
  const [products, setProducts] = useState<ApparelProduct[]>(() => {
    const saved = localStorage.getItem('jelvans_products');
    return saved ? JSON.parse(saved) : JELVANS_PRODUCTS;
  });

  // Print Services Cost matrix state
  const [printMethods, setPrintMethods] = useState<any[]>(() => {
    const saved = localStorage.getItem('jelvans_print_methods');
    return saved ? JSON.parse(saved) : PRINT_METHODS;
  });

  const [printPlacements, setPrintPlacements] = useState<any[]>(() => {
    const saved = localStorage.getItem('jelvans_print_placements');
    return saved ? JSON.parse(saved) : PRINT_PLACEMENTS;
  });

  // Global settings state
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('jelvans_company_settings');
    let parsed = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    if (parsed.address && (parsed.address.includes('Shah Alam') || parsed.address.includes('Selangor') || parsed.address.includes('Malaysia'))) {
      parsed.address = 'Bulalo Siubec Pagudpud, Ilocos Norte 2919';
      parsed.companyName = 'Jelvans Clothing Group PH';
    }
    return parsed;
  });

  // Bulk quote requests state
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('jelvans_quotes');
    return saved ? JSON.parse(saved) : [];
  });

  // State variables synchronized with standard browser localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jelvans_cart_cache');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jelvans_orders_cache');
    let parsed = saved ? JSON.parse(saved) : MOCK_INITIAL_ORDERS;
    return parsed.map((o: Order) => {
      if (o.customerDetails.email === 'rjelvanbaloaloa@gmail.com' && o.customerDetails.address.includes('Warehouse')) {
        return {
          ...o,
          customerDetails: {
            ...o.customerDetails,
            address: 'Bulalo Siubec Pagudpud, Ilocos Norte 2919',
            deliveryMethod: 'delivery'
          }
        };
      }
      return o;
    });
  });

  const [activeTab, setActiveTab] = useState<string>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Custom interactive micro notification toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const activeCurrency = currencies.find(c => c.code === selectedCurrencyCode) || currencies[0];
  const activeTheme = themes.find(t => t.id === selectedThemeId) || themes[0];

  // Synchronize dynamic state lists with storage cache
  useEffect(() => {
    localStorage.setItem('jelvans_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('jelvans_currencies', JSON.stringify(currencies));
  }, [currencies]);

  useEffect(() => {
    localStorage.setItem('jelvans_currency_code', selectedCurrencyCode);
  }, [selectedCurrencyCode]);

  useEffect(() => {
    localStorage.setItem('jelvans_themes', JSON.stringify(themes));
  }, [themes]);

  useEffect(() => {
    localStorage.setItem('jelvans_theme_id', selectedThemeId);
  }, [selectedThemeId]);

  useEffect(() => {
    localStorage.setItem('jelvans_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jelvans_print_methods', JSON.stringify(printMethods));
  }, [printMethods]);

  useEffect(() => {
    localStorage.setItem('jelvans_print_placements', JSON.stringify(printPlacements));
  }, [printPlacements]);

  useEffect(() => {
    localStorage.setItem('jelvans_company_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('jelvans_quotes', JSON.stringify(quoteRequests));
  }, [quoteRequests]);

  useEffect(() => {
    localStorage.setItem('jelvans_cart_cache', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jelvans_orders_cache', JSON.stringify(orders));
  }, [orders]);

  // Flash a luxury aesthetic visual notification
  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add customized specs object to queue
  const handleAddToCart = (config: ApparelConfig, unitPrice: number, totalPrice: number) => {
    const targetProduct = products.find(p => p.id === config.productId);
    if (!targetProduct) return;

    const newCartItem: CartItem = {
      id: `cart-job-${Date.now().toString().slice(-6)}`,
      product: targetProduct,
      config,
      unitPrice,
      totalPrice
    };

    setCart(prev => [...prev, newCartItem]);
    setSelectedProductId(null);
    triggerToast(`Added custom ${config.productName} (x${config.quantity} units) to print wagon!`, 'success');
    setActiveTab('cart'); // slide open checkout summary automatically
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        // Recalculate based on our data.ts bulk algorithm!
        const { unitPrice, subtotal } = calculateItemPrice(
          item.product.basePrice,
          newQty,
          item.config.printMethod,
          item.config.printPlacement,
          item.config.fabricWeight
        );

        return {
          ...item,
          config: { ...item.config, quantity: newQty },
          unitPrice,
          totalPrice: subtotal
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    triggerToast('Removed print spec from current workspace.', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
    triggerToast('Cart queue purged.', 'info');
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    triggerToast(`Success! Invoice ${newOrder.id} logged. Standard offset sequence starting.`, 'success');
  };

  const handleSendOrderMessage = (orderId: string, text: string, sender: 'customer' | 'seller', senderName: string) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-MY', { day: '2-digit', month: '2-digit' })
    };

    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            messages: [...(o.messages || []), newMessage]
          };
        }
        return o;
      });
      localStorage.setItem('jelvans_orders_cache', JSON.stringify(updated));
      return updated;
    });

    triggerToast(`Message sent to ${sender === 'customer' ? 'Seller Desk' : 'Client Profile'}`, 'success');
  };

  // Launch standard browser-optimized tax receipt printing frames
  const handleDownloadInvoiceDetails = (orderId: string) => {
    // Open standard native download sequences or print window layouts
    triggerToast(`Compiling invoice PDF layout for ${orderId}...`, 'success');
    setTimeout(() => {
      window.print();
    }, 450);
  };

  const handleSubmissionGlobalQuote = (req: QuoteRequest) => {
    triggerToast(`Bespoke quote ${req.id} transmitted to our Pagudpud sales office!`, 'success');
  };

  // Filter products by category and input terms
  const filteredCatalog = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans selection:bg-red-600 selection:text-white">
      
      {/* Dynamic inline styles to skin the interface to match activeTheme.accentCode and print views */}
      <style>{`
        :root {
          --theme-accent: ${activeTheme.accentCode};
          --theme-hover: ${activeTheme.hoverCode};
          --theme-light: ${activeTheme.lightCode};
          --theme-border: ${activeTheme.borderCode};
          --theme-text-dark: ${activeTheme.textDarkCode};
        }
        
        /* Dynamic CSS Skin */
        .bg-red-600 {
          background-color: var(--theme-accent) !important;
        }
        .hover\\:bg-red-700:hover, .hover\\:bg-red-800:hover {
          background-color: var(--theme-hover) !important;
        }
        .text-red-600 {
          color: var(--theme-accent) !important;
        }
        .border-red-100 {
          border-color: var(--theme-border) !important;
        }
        .border-red-200 {
          border-color: var(--theme-border) !important;
        }
        .border-red-600 {
          border-color: var(--theme-accent) !important;
        }
        .bg-red-50 {
          background-color: var(--theme-light) !important;
        }
        .text-red-650 {
          color: var(--theme-text-dark) !important;
        }
        .selection\\:bg-red-600::selection {
          background-color: var(--theme-accent) !important;
        }
        input:focus {
          border-color: var(--theme-accent) !important;
        }
        .focus\\:border-red-600:focus {
          border-color: var(--theme-accent) !important;
        }
        .focus\\:ring-red-600:focus {
          --tw-ring-color: var(--theme-accent) !important;
        }
        .hover\\:border-red-600\\/40:hover {
          border-color: color-mix(in srgb, var(--theme-accent) 40%, transparent) !important;
        }
        .group:hover .group-hover\\:text-red-600 {
          color: var(--theme-accent) !important;
        }

        @media print {
          header, footer, button, .no-print, #tailoring-studio-wizard {
            display: none !important;
          }
          body, .max-w-7xl, .lg:col-span-8 {
            background-color: white !important;
            color: black !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .bg-neutral-900, .bg-neutral-950, .bg-slate-50 {
            background-color: transparent !important;
            color: black !important;
            border: none !important;
          }
          .text-white, .text-slate-900 {
            color: black !important;
          }
          .text-red-600 {
            color: #dc2626 !important;
          }
        }
      `}</style>

      {/* Main Structural Navbar Header */}
      <Header
        cart={cart}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('store');
        }}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        currentUser={currentUser}
        onLogin={setCurrentUser}
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab('store');
        }}
        currencies={currencies}
        selectedCurrencyCode={selectedCurrencyCode}
        onSelectCurrency={setSelectedCurrencyCode}
        themes={themes}
        selectedThemeId={selectedThemeId}
        onSelectTheme={setSelectedThemeId}
      />

      {/* Floating micro notification banners */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className={`fixed top-24 right-4 md:right-8 z-50 p-4 rounded-xl border shadow-xl flex items-center space-x-3 max-w-sm text-left ${
              toastType === 'success'
                ? 'bg-white border-green-500/30 text-slate-800'
                : 'bg-white border-red-500/30 text-slate-800'
            }`}
          >
            {toastType === 'success' ? (
              <BadgeCheck className="w-5 h-5 text-green-600 flex-shrink-0 animate-pulse" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p className="text-xs font-semibold leading-relaxed">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Frame content block */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'store' && !selectedProductId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              {/* Marketing banner */}
              <HeroBanner
                onStartCustomizing={() => {
                  setSelectedProductId(JELVANS_PRODUCTS[0].id);
                  setActiveTab('customizer');
                }}
                onGoQuotes={() => setActiveTab('quote')}
                activeCurrency={activeCurrency}
              />

              {/* Dynamic products segment */}
              <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 text-left">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                    <Sparkles className="w-5 h-5 text-red-600" />
                    <span>Configure Premium Base Apparel</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-normal font-medium">
                    Select a core clothing class below to open our advanced design workspace. High-density embroidery or offset inks configured instantly.
                  </p>
                </div>

                {filteredCatalog.length === 0 ? (
                  <div className="bg-slate-50 py-12 text-center rounded-xl border border-gray-200">
                    <p className="text-sm font-semibold text-slate-500">No apparel designs matched your search options.</p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                      className="text-xs font-bold text-red-600 mt-2 underline"
                    >
                      Reset Category Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
                    {filteredCatalog.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onSelect={(prodId) => {
                          setSelectedProductId(prodId);
                          setActiveTab('customizer');
                        }}
                        activeCurrency={activeCurrency}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Core configurator route */}
          {activeTab === 'customizer' && selectedProductId && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {(() => {
                const target = products.find(p => p.id === selectedProductId);
                return target ? (
                  <Customizer
                    product={target}
                    onBack={() => {
                      setSelectedProductId(null);
                      setActiveTab('store');
                    }}
                    onAddToCart={handleAddToCart}
                    activeCurrency={activeCurrency}
                    printMethods={printMethods}
                    printPlacements={printPlacements}
                  />
                ) : null;
              })()}
            </motion.div>
          )}

          {/* Cart routing */}
          {activeTab === 'cart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CartView
                cart={cart}
                onUpdateQty={handleUpdateCartQty}
                onRemoveItem={handleRemoveCartItem}
                onPlaceOrder={handlePlaceOrder}
                onClearCart={handleClearCart}
                setActiveTab={setActiveTab}
                activeCurrency={activeCurrency}
              />
            </motion.div>
          )}

          {/* Invoice checking & tracking */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OrdersTracker
                orders={orders}
                onDownloadInvoice={handleDownloadInvoiceDetails}
                activeCurrency={activeCurrency}
                onSendOrderMessage={handleSendOrderMessage}
              />
            </motion.div>
          )}

          {/* Enterprise RFQ Quotes Route */}
          {activeTab === 'quote' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuoteBuilder
                onSubmitQuote={(req) => {
                  setQuoteRequests(prev => [req, ...prev]);
                  handleSubmissionGlobalQuote(req);
                }}
                activeCurrency={activeCurrency}
              />
            </motion.div>
          )}

          {/* Seller Dashboard admin area */}
          {activeTab === 'seller' && currentUser?.role === 'seller' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SellerDesk
                products={products}
                onAddProduct={(p) => {
                  setProducts(prev => [p, ...prev]);
                  triggerToast(`Apparel ${p.name} added successfully!`, 'success');
                }}
                onUpdateProduct={(p) => {
                  setProducts(prev => prev.map(item => item.id === p.id ? p : item));
                  triggerToast(`Apparel spec ${p.name} updated.`, 'success');
                }}
                onDeleteProduct={(id) => {
                  setProducts(prev => prev.filter(item => item.id !== id));
                  triggerToast(`Apparel removed from base catalog.`, 'info');
                }}
                orders={orders}
                onUpdateOrderStatus={(orderId, status) => {
                  setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
                  triggerToast(`Order status updated to ${status}.`, 'success');
                }}
                onUpdateOrderPayment={(orderId, completed) => {
                  setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentCompleted: completed } : o));
                  triggerToast(`Payment status secured: ${completed ? 'PAID' : 'UNPAID'}`, 'success');
                }}
                quoteRequests={quoteRequests}
                onRespondQuote={(quoteId, text) => {
                  setQuoteRequests(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'Responded', sellerResponse: text } : q));
                  triggerToast(`RFQ answer message updated.`, 'success');
                }}
                companySettings={companySettings}
                onUpdateCompanySettings={(settings) => {
                  setCompanySettings(settings);
                  triggerToast('Official SST corporate settings updated.', 'success');
                }}
                currencies={currencies}
                onUpdateCurrencyRate={(code, rate) => {
                  setCurrencies(prev => prev.map(c => c.code === code ? { ...c, rate } : c));
                  triggerToast(`Exchange index rate for ${code} set to ${rate}.`, 'success');
                }}
                activeCurrency={activeCurrency}
                printMethods={printMethods}
                onUpdatePrintMethodPrice={(id, price) => {
                  setPrintMethods(prev => prev.map(pm => pm.id === id ? { ...pm, price } : pm));
                  triggerToast(`Print method base price updated.`, 'success');
                }}
                printPlacements={printPlacements}
                onUpdatePrintPlacementModifier={(id, modifier) => {
                  setPrintPlacements(prev => prev.map(pp => pp.id === id ? { ...pp, modifier } : pp));
                  triggerToast(`Placement multiplier modifier updated.`, 'success');
                }}
                onSendOrderMessage={handleSendOrderMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Brand Footer information panel */}
      <Footer />
    </div>
  );
}

/* 
 * ----------------------------------------------------------------------------------
 * SHOWCASE & PORTFOLIO LICENSE DECLARATION
 * ----------------------------------------------------------------------------------
 * This application is developed as a showcase / portfolio / project application 
 * sample for clients. Released under the MIT License.
 * Copyright (c) 2026 Jelvans Online Clothing Group. All Rights Reserved.
 * ----------------------------------------------------------------------------------
 */
