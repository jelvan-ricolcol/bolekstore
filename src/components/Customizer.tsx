import React, { useState, useEffect, useRef } from 'react';
import { ApparelProduct, ApparelConfig, Currency } from '../types';
import { Upload, ChevronLeft, Layers, ShieldCheck, BadgeCheck, DollarSign, Sparkles, Sliders, Info, FileText, Eye, Palette, Ruler, Settings, Target, Shield, Zap } from 'lucide-react';

interface CustomizerProps {
  product: ApparelProduct;
  onBack: () => void;
  onAddToCart: (config: ApparelConfig, unitPrice: number, totalPrice: number) => void;
  activeCurrency: Currency;
  printMethods: any[];
  printPlacements: any[];
}

export default function Customizer({ 
  product, 
  onBack, 
  onAddToCart,
  activeCurrency,
  printMethods,
  printPlacements
}: CustomizerProps) {
  // Config state
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[2] || 'M'); // default M if exists
  const [fabricWeight, setFabricWeight] = useState(product.fabricOptions[0]);
  const [printMethod, setPrintMethod] = useState(printMethods[0]?.id || 'silkscreen');
  const [printPlacement, setPrintPlacement] = useState(printPlacements[0]?.id || 'front_center');
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  // File Upload states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed prices dynamically based on customized admin matrices
  let additions = 0;
  
  if (fabricWeight.includes('180gsm') || fabricWeight.includes('160gsm Smooth')) {
    additions += 1.50;
  } else if (fabricWeight.includes('200gsm') || fabricWeight.includes('180gsm Premium')) {
    additions += 3.00;
  } else if (fabricWeight.includes('240gsm') || fabricWeight.includes('Heavy honeycomb') || fabricWeight.includes('320gsm')) {
    additions += 5.50;
  } else if (fabricWeight.includes('380gsm') || fabricWeight.includes('16oz')) {
    additions += 8.50;
  }

  // Print method base addition
  const activeMethodObj = printMethods.find(m => m.id === printMethod);
  const printMethodPrice = activeMethodObj ? activeMethodObj.price : 0;

  // Placement modifier
  const activePlacementObj = printPlacements.find(p => p.id === printPlacement);
  const placementMod = activePlacementObj ? activePlacementObj.modifier : 1.0;

  const printAdditions = printMethodPrice * placementMod;
  additions += printAdditions;

  const rawUnitPrice = product.basePrice + additions;

  // Compute bulk discount tiers based on volume economics
  let discountPercent = 0;
  if (quantity >= 300) {
    discountPercent = 40; 
  } else if (quantity >= 100) {
    discountPercent = 30; 
  } else if (quantity >= 50) {
    discountPercent = 20; 
  } else if (quantity >= 20) {
    discountPercent = 12; 
  } else if (quantity >= 10) {
    discountPercent = 5;  
  }

  const finalUnitPrice = Math.round(rawUnitPrice * (1 - discountPercent / 100) * 100) / 100;
  const subtotal = Math.round(finalUnitPrice * quantity * 100) / 100;

  const priceStats = {
    unitPrice: finalUnitPrice,
    discountPercent,
    additions: Math.round(additions * 100) / 100,
    subtotal
  };


  // Set file preview when file is uploaded
  useEffect(() => {
    if (uploadedFile) {
      if (uploadedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        setFilePreview(null);
      }
    }
  }, [uploadedFile]);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
  };

  // CSS swatches lookup
  const getSwatches = (colorName: string) => {
    switch (colorName) {
      case 'Jet Black': case 'Pitch Black': return 'bg-slate-900 border-slate-755 border-slate-800';
      case 'Pure White': case 'Clean White': return 'bg-white border-gray-300';
      case 'Burgundy red': case 'Red Wine': case 'Laser Red': return 'bg-red-700 border-red-900';
      case 'Navy Blue': return 'bg-indigo-950 border-neutral-800';
      case 'Forest Green': case 'Emerald Green': case 'Sage Green': return 'bg-emerald-850 border-emerald-950';
      case 'Heather Grey': case 'Charcoal Grey': return 'bg-neutral-500 border-neutral-600';
      case 'Royal Blue': case 'Electric Blue': return 'bg-blue-600 border-blue-800';
      case 'Neon Yellow': return 'bg-yellow-300 border-yellow-500';
      case 'Orange Crush': return 'bg-orange-500 border-orange-600';
      case 'Sand Beige': return 'bg-[#e5d3b3] border-[#c0af94]';
      case 'Dusty Lavender': return 'bg-purple-300 border-purple-400';
      case 'Chocolate Brown': return 'bg-amber-900 border-amber-950';
      default: return 'bg-amber-500 border-amber-600';
    }
  };

  // Convert Color to color text class for vector
  const getVectorColorClass = (colorName: string) => {
    switch (colorName) {
      case 'Jet Black': case 'Pitch Black': return 'text-slate-900';
      case 'Pure White': case 'Clean White': return 'text-white border-gray-300';
      case 'Burgundy red': case 'Red Wine': case 'Laser Red': return 'text-red-700';
      case 'Navy Blue': return 'text-opacity-95 text-indigo-900';
      case 'Forest Green': case 'Emerald Green': case 'Sage Green': return 'text-emerald-800';
      case 'Heather Grey': case 'Charcoal Grey': return 'text-slate-400';
      case 'Royal Blue': case 'Electric Blue': return 'text-blue-600';
      case 'Neon Yellow': return 'text-yellow-400';
      case 'Orange Crush': return 'text-orange-500';
      case 'Sand Beige': return 'text-[#d6c4a8]';
      case 'Dusty Lavender': return 'text-purple-300';
      case 'Chocolate Brown': return 'text-amber-900';
      default: return 'text-amber-505 text-amber-500';
    }
  };

  // Dynamic placement highlight box coordinates based on selected printPlacement ID
  const getPlacementOverlay = () => {
    switch (printPlacement) {
      case 'front_center':
        return { style: 'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-16 border-2 border-dashed border-red-600 bg-red-600/5 flex items-center justify-center text-[8px] font-bold text-red-605 text-red-600', label: 'FULL A4' };
      case 'front_chest':
        return { style: 'absolute top-[28%] left-[38%] w-6 h-6 border bg-red-600/5 border-dashed border-red-605 border-red-600 text-[6px] text-red-600 flex items-center justify-center', label: 'POCKET' };
      case 'back':
        return { style: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-20 border-2 border-dashed border-red-600 bg-red-600/5 flex items-center justify-center text-[8px] font-bold text-red-600', label: 'A3 BACK' };
      case 'sleeve':
        return { style: 'absolute top-[32%] left-[16%] w-6 h-5 border bg-red-600/5 border-dashed border-red-600 text-[6px] text-red-600 flex items-center justify-center', label: 'SLEEVE' };
      default:
        return { style: 'hidden', label: '' };
    }
  };

  const placementSpec = getPlacementOverlay();

  // Render SVG representation based on product id
  const renderInteractiveVector = () => {
    const colorClass = getVectorColorClass(color);
    switch (product.id) {
      case 'prod-001': // Tee
      case 'prod-002': // Polo
      case 'prod-003': // Jersey
      case 'prod-004': // F1 corporate
      case 'prod-005': // Hoodie
        return (
          <div className="relative w-72 h-72 flex items-center justify-center bg-slate-100 rounded-xl border border-gray-200 p-6 shadow-inner">
            {/* Base SVG */}
            <svg className={`w-64 h-64 transition-all duration-300 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
              {product.id === 'prod-002' && (
                <path d="M40 15 L50 25 L60 15 L50 35 Z" fill="#000" opacity="0.15" />
              )}
              {product.id === 'prod-005' && (
                <path d="M38 27 C38 12, 62 12, 62 27 Z" fill="#000" opacity="0.1" />
              )}
            </svg>
            {/* Image Overlay placement */}
            <div className={placementSpec.style}>
              {filePreview ? (
                <img src={filePreview} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                <span className="text-[7px] font-extrabold text-center select-none leading-none">{placementSpec.label}</span>
              )}
            </div>
            {/* Color Indicator */}
            <span className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-700 bg-white border border-gray-250 border-gray-200 px-2.5 py-0.5 rounded uppercase shadow-sm flex items-center gap-1">
              <Palette className="w-3 h-3 text-red-600" />
              <span>{color}</span>
            </span>
          </div>
        );
      default: // Tote/Bag
        return (
          <div className="relative w-72 h-72 flex items-center justify-center bg-slate-100 rounded-xl border border-gray-200 p-6 shadow-inner">
            <svg className={`w-64 h-64 transition-colors duration-300 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
              <rect x="25" y="40" width="50" height="42" rx="4" />
              <path d="M35 40 C35 22, 45 22, 45 40" fill="none" stroke="currentColor" strokeWidth="6" />
              <path d="M55 40 C55 22, 65 22, 65 40" fill="none" stroke="currentColor" strokeWidth="6" />
            </svg>
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border bg-red-600/5 border-dashed border-red-600 flex items-center justify-center text-red-650">
              {filePreview ? (
                <img src={filePreview} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                <span className="text-[7px] font-bold text-red-600">BAG PRINT</span>
              )}
            </div>
          </div>
        );
    }
  };

  const handleSubscribedOrder = () => {
    // Construct order payload
    const payload: ApparelConfig = {
      productId: product.id,
      productName: product.name,
      color,
      size,
      fabricWeight,
      printMethod,
      printPlacement,
      quantity,
      logoFileName: uploadedFile ? uploadedFile.name : undefined,
      logoFile: filePreview || undefined,
      specialNotes
    };

    onAddToCart(payload, priceStats.unitPrice, priceStats.subtotal);
  };

  return (
    <div id="tailoring-studio-wizard" className="w-full text-slate-900 font-sans selection:bg-red-600 selection:text-white py-8">
      
      {/* Back to Browse row */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors uppercase font-bold tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Render Canvas view & File Uploader */}
        <div className="lg:col-span-12 xl:col-span-5 lg:w-full space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow-sm">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-4 border-b border-gray-100 pb-2.5 w-full text-left flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-red-600" />
              <span>Virtual Print Layout Visualizer</span>
            </h3>
            {renderInteractiveVector()}
            <p className="text-[11px] text-slate-550 text-slate-500 mt-4 text-center leading-relaxed font-medium">
              Box outlines placement zone (A4 / A3 / Pocket size). Upload standard graphic vectors (PNG/PDF/AI) below to see previews.
            </p>
          </div>

          {/* Usability Patterns: File Upload drag and drop */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-4 text-left flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-red-600" />
              <span>Upload Logo or Graphic Design (.PNG / .PDF / .AI)</span>
            </h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 ${
                dragActive
                  ? 'border-red-600 bg-red-50'
                  : uploadedFile
                  ? 'border-green-500/50 bg-green-50/50'
                  : 'border-gray-250 border-gray-200 hover:border-red-600/50 bg-slate-50/40'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf,.ai"
                onChange={handleFileChange}
              />
              
              {uploadedFile ? (
                <div className="space-y-2">
                  <div className="text-3xl text-green-600">✓</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight font-mono">{uploadedFile.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearUploadedFile(); }}
                    className="text-xs text-red-600 hover:text-red-700 font-bold underline underline-offset-2 hover:no-underline"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-red-600 mx-auto" />
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-tight">Drag & drop print vector here</p>
                    <p className="text-xs text-slate-500 mt-1">or Click to search inside local folders</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold font-mono leading-none">Supports PDF, high-res PNG, AI vectors up to 25MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Config selectors wizard and Pricing board */}
        <div className="lg:col-span-12 xl:col-span-7 lg:w-full space-y-6 text-left">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
            
            {/* Segment Header */}
            <div>
              <span className="text-[10px] bg-red-550 bg-red-601 bg-red-50 text-red-600 px-2.5 py-1 rounded border border-red-100 font-bold uppercase tracking-wider">
                Tailoring Configurator
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2">{product.name}</h2>
              <p className="text-xs text-slate-500 leading-normal font-semibold mt-0.5">{product.description}</p>
            </div>

            {/* Config parameters form split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              
              {/* Garment Color */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-red-600" />
                  <span>Apparel Garment Color</span>
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setColor(col)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-bold cursor-pointer transition-all ${
                        color === col
                          ? 'border-red-650 border-red-600 text-red-605 text-red-600 bg-red-50 shadow-sm'
                          : 'border-gray-200 text-slate-700 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full border ${getSwatches(col)} inline-block`} />
                      <span>{col}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Size */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-red-600" />
                  <span>Standard Size</span>
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSize(sz)}
                      className={`w-9 h-9 rounded border text-xs font-black flex items-center justify-center cursor-pointer transition-all ${
                        size === sz
                          ? 'border-red-600 text-red-600 bg-red-50 shadow-sm'
                          : 'border-gray-200 text-slate-500 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric weight / quality selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-red-600" />
                  <span>Fabric Weight & Grade</span>
                </label>
                <select
                  value={fabricWeight}
                  onChange={(e) => setFabricWeight(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-slate-800 outline-none focus:border-red-600 py-2.5 px-3 rounded text-xs select-none font-semibold"
                >
                  {product.fabricOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt} {idx > 0 ? '(Premium Grade Upgrade)' : '(Standard included)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Placement Zone */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-red-600" />
                  <span>Print Placement Zone</span>
                </label>
                <select
                  value={printPlacement}
                  onChange={(e) => setPrintPlacement(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-slate-800 outline-none focus:border-red-600 py-2.5 px-3 rounded text-xs select-none font-semibold"
                >
                  {printPlacements.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} {zone.modifier !== 1.0 ? `(Mod: x${zone.modifier})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Print Method (Fully Illustrated Cards with select toggles) */}
            <div className="space-y-2.5 border-t border-gray-100 pt-6">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>Printing Method Select</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {printMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPrintMethod(method.id)}
                    className={`p-3.5 rounded border text-left cursor-pointer transition-all duration-150 relative ${
                      printMethod === method.id
                        ? 'border-red-600 bg-red-50/40 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-black ${printMethod === method.id ? 'text-red-600' : 'text-slate-800'}`}>
                        {method.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-650 bg-slate-100 px-1.5 py-0.5 rounded border border-gray-200">
                        +{activeCurrency.symbol}{(method.price * activeCurrency.rate).toFixed(2)}/u
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-550 text-slate-500 mt-1 lines-clamp-2 leading-tight font-medium">
                      {method.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Order Quantity controller with direct slider */}
            <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                    <span>Enter Order Quantity</span>
                  </label>
                  <span className="text-[10px] text-slate-405 text-slate-400 block font-medium">Order above 10 units for progressive bulk savings!</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded border border-gray-300 bg-white flex items-center justify-center font-bold hover:bg-slate-100 select-none text-slate-705"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-8 text-center bg-white border border-gray-300 rounded text-xs font-black focus:border-red-600 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded border border-gray-300 bg-white flex items-center justify-center font-bold hover:bg-slate-100 select-none text-slate-705"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic slider */}
              <input
                type="range"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-red-655 accent-red-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />

              {/* Live wholesale tier indicator blocks */}
              <div className="grid grid-cols-6 gap-1.5 text-center text-[9px] font-bold pt-1">
                {[
                  { label: 'Single', qty: '1-9', dsc: 'No Disc', active: quantity < 10 },
                  { label: 'Bronze', qty: '10-19', dsc: '-5%', active: quantity >= 10 && quantity < 20 },
                  { label: 'Silver', qty: '20-49', dsc: '-12%', active: quantity >= 20 && quantity < 50 },
                  { label: 'Gold', qty: '50-99', dsc: '-20%', active: quantity >= 50 && quantity < 100 },
                  { label: 'Platinum', qty: '100-299', dsc: '-30%', active: quantity >= 100 && quantity < 300 },
                  { label: 'VIP Corp', qty: '300+', dsc: '-40%', active: quantity >= 300 }
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`rounded p-2 border flex flex-col justify-between transition-all ${
                      tier.active
                        ? 'border-red-600 bg-red-50 text-slate-900 shadow-sm'
                        : 'border-gray-200 bg-white text-slate-400'
                    }`}
                  >
                    <span className={`block pb-0.5 text-[8.5px] ${tier.active ? 'text-red-600 font-extrabold' : 'text-slate-400'}`}>
                      {tier.label}
                    </span>
                    <span className="block text-slate-700 text-[9.5px] leading-tight font-black">{tier.qty}</span>
                    <span className={`block text-[10px] font-extrabold ${tier.active ? 'text-green-600' : 'text-slate-400'}`}>
                      {tier.dsc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions Field */}
            <div className="space-y-1.5 border-t border-gray-100 pt-5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>Special Printing Instructions / Thread Colors</span>
              </label>
              <textarea
                placeholder="e.g. Please embroider logo only on left breast, and print 'COMMITTEE' in Helvetica white thread on the right sleeve pocket..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                rows={3}
                className="w-full bg-white border border-gray-300 text-xs text-slate-800 placeholder-gray-400 outline-none focus:border-red-600 rounded p-3 resize-none font-semibold"
              />
            </div>

            {/* Big Live Calculation & Add To Cart Summary Sheet */}
            <div className="bg-slate-50 border border-red-650 border-red-600/20 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 border-gray-200 pb-3">
                <span className="text-xs font-bold text-slate-500">Live Item Cost Calculations:</span>
                <span className="text-xs text-green-600 font-extrabold flex items-center gap-1">
                  {priceStats.discountPercent > 0 ? (
                    <>
                      <Zap className="w-3.5 h-3.5 text-green-600 fill-green-600 inline" />
                      <span>BULK ADVANTAGE -{priceStats.discountPercent}% APPLIED</span>
                    </>
                  ) : (
                    'Standard wholesale tier'
                  )}
                </span>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-505 text-slate-500 font-semibold">
                <span>Fabric / Garment Base:</span>
                <span className="text-right text-slate-800">{activeCurrency.code} {(product.basePrice * activeCurrency.rate).toFixed(2)}/pcs</span>

                <span>Upgrade Additions:</span>
                <span className="text-right text-slate-800">+{activeCurrency.code} {(priceStats.additions * activeCurrency.rate).toFixed(2)}/pcs</span>

                <span className="text-slate-900 font-extrabold">Bulk Calculated Unit Net:</span>
                <span className="text-right text-red-656 text-red-600 font-extrabold">{activeCurrency.code} {(priceStats.unitPrice * activeCurrency.rate).toFixed(2)}/pcs</span>

                <span className="text-slate-400">Order Quantity:</span>
                <span className="text-right text-slate-700">x {quantity} units</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase leading-tight">ESTIMATED NET TOTAL</span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-xs text-slate-450 font-bold">{activeCurrency.code}</span>
                    <span className="text-2xl font-black text-red-605 text-red-600 leading-none">
                      {(priceStats.subtotal * activeCurrency.rate).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleInteractiveCustomizer}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-transform duration-100 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Secure Custom Cart</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  function handleInteractiveCustomizer() {
    handleSubscribedOrder();
  }
}
