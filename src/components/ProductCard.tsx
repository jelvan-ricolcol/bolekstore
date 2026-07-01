import React from 'react';
import { ApparelProduct, Currency } from '../types';
import { BadgeAlert, Palette, Layers, HelpCircle, Sparkles, Check, Flame } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: ApparelProduct;
  onSelect: (productId: string) => void;
  activeCurrency: Currency;
}

export default function ProductCard({ product, onSelect, activeCurrency }: ProductCardProps) {
  // Category colors modifier
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'corporate':
        return { label: 'Corporate Uniform', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
      case 'casual':
        return { label: 'Casual Wear', bg: 'bg-slate-105 bg-slate-100 text-slate-800 border-slate-200' };
      case 'sports':
        return { label: 'High Performance', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
      case 'premium':
        return { label: 'Premium Apparel', bg: 'bg-red-50 text-red-600 border-red-200' };
      default:
        return { label: 'Printed Gear', bg: 'bg-slate-50 text-slate-650 border-slate-100' };
    }
  };

  const theme = getCategoryTheme(product.category);

  // Return realistic clothing mock representations dynamically
  const getClothingVector = (id: string, colorClass: string) => {
    // Generate simple custom stylized SVG layout representing shirts/hoodies or bags
    switch (id) {
      case 'prod-001': // Tee
        return (
          <svg className={`w-32 h-32 transition-colors duration-200 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
            <path d="M40 15 A10 10 0 0 0 60 15 Z" fill="#000000" opacity="0.1" />
          </svg>
        );
      case 'prod-002': // Polo
        return (
          <svg className={`w-32 h-32 transition-colors duration-200 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
            {/* Polo collar and placket */}
            <path d="M40 15 L50 25 L60 15 L50 35 Z" fill="#000" opacity="0.15" />
            <circle cx="50" cy="27" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="31" r="1.5" fill="#ffffff" />
          </svg>
        );
      case 'prod-003': // Sport Jersey
        return (
          <svg className={`w-32 h-32 transition-colors duration-200 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 15 L25 19 L19 33 L28 39 L28 85 L72 85 L72 39 L81 39 L75 19 Z" />
            {/* Athletic Stripe */}
            <path d="M42 16 L35 85 h6 L49 16 Z" fill="#000" opacity="0.1" />
            <path d="M58 16 L65 85 h-6 L51 16 Z" fill="#000" opacity="0.1" />
          </svg>
        );
      case 'prod-004': // Corporate F1 Uniform
        return (
          <svg className={`w-32 h-32 transition-colors duration-200 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 14 L25 20 L15 34 L26 41 L28 34 L32 34 L32 85 L68 85 L68 34 L72 34 L74 41 L85 34 L75 20 Z" />
            {/* Epaulets and dual contrast panel */}
            <path d="M32 34 L40 18 H43 L32 40 Z" fill="#dc2626" opacity="0.35" />
            <path d="M68 34 L60 18 H57 L68 40 Z" fill="#dc2626" opacity="0.35" />
            <path d="M49 18 V85 H51 V18 Z" fill="#000" opacity="0.15" />
          </svg>
        );
      case 'prod-005': // Hoodie
        return (
          <svg className={`w-32 h-32 transition-colors duration-200 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 25 L25 27 L15 39 L25 45 L28 38 L31 38 L31 82 L69 82 L69 38 L72 38 L75 45 L85 39 L75 27 Z" />
            {/* Hood dome structure */}
            <path d="M38 27 C38 12, 62 12, 62 27 Z" />
            <path d="M42 27 C42 16, 58 16, 58 27 Z" fill="#000" opacity="0.15" />
            {/* Pouch */}
            <path d="M40 62 H60 L57 78 H43 Z" fill="#000" opacity="0.1" />
          </svg>
        );
      default: // Tote bag
        return (
          <svg className={`w-32 h-32 transition-colors duration-200 ${colorClass}`} viewBox="0 0 100 100" fill="currentColor">
            <rect x="25" y="40" width="50" height="42" rx="4" />
            {/* Straps */}
            <path d="M35 40 C35 22, 45 22, 45 40" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M55 40 C55 22, 65 22, 65 40" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
        );
    }
  };

  // Convert friendly color name to actual CSS background classes
  const getSwatches = (color: string) => {
    switch (color) {
      case 'Jet Black': case 'Pitch Black': return 'bg-slate-900 border-slate-750';
      case 'Pure White': case 'Clean White': return 'bg-white border-gray-300';
      case 'Burgundy red': case 'Red Wine': case 'Laser Red': return 'bg-red-700 border-red-900';
      case 'Navy Blue': return 'bg-indigo-950 border-neutral-800';
      case 'Forest Green': case 'Emerald Green': case 'Sage Green': return 'bg-emerald-800 border-emerald-950';
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

  return (
    <div id={`product-card-${product.id}`} className="bg-white border border-gray-200 hover:border-red-600/40 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-350 hover:-translate-y-1 relative group select-none">
      {/* Absolute popular sticker */}
      {product.popularSpec && (
        <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase z-20 flex items-center gap-1">
          <Flame className="w-3 h-3 text-white fill-white" />
          <span>TRENDING SPEC</span>
        </span>
      )}

      {/* Visual Canvas garment render container */}
      <div className="bg-slate-50 h-56 flex items-center justify-center p-6 border-b border-gray-100 relative">
        <div className="absolute inset-x-0 bottom-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PREVIEW STANDARD FIT</span>
        </div>
        {getClothingVector(product.id, 'text-slate-800 group-hover:scale-105 duration-300 group-hover:text-red-600')}
      </div>

      {/* Text Details Area */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4 text-left">
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${theme.bg}`}>
              {theme.label}
            </span>
            <span className="text-[10px] text-slate-450 text-slate-400 font-semibold font-mono">ID: {product.id}</span>
          </div>

          <h3 className="text-slate-900 font-extrabold text-base md:text-md tracking-tight leading-snug group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 leading-normal line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Feature Checklists list */}
        <div className="space-y-1.5 border-t border-gray-100 pt-3">
          {product.features.slice(0, 3).map((feat, i) => (
            <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Check className="w-3.5 h-3.5 text-red-650 text-red-600 stroke-[3]" />
              <span className="truncate leading-tight font-medium">{feat}</span>
            </div>
          ))}
        </div>

        {/* Size chips & dynamic color swatches row */}
        <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-gray-100">
          {/* Colors Swatches */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">GARMENT COLORS</span>
            <div className="flex items-center space-x-1">
              {product.colors.slice(0, 4).map((col, idx) => (
                <span
                  key={idx}
                  title={col}
                  className={`w-3.5 h-3.5 rounded-full border ${getSwatches(col)} inline-block`}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] font-semibold text-slate-400 pl-0.5 font-bold">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>

          {/* Sizing Chips */}
          <div className="text-right space-y-1">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">SIZES SUPPORTED</span>
            <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-gray-200">
              {product.sizes[0]} - {product.sizes[product.sizes.length - 1]}
            </span>
          </div>
        </div>

        {/* Price and Action Button footer */}
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[9px] font-bold text-slate-450 text-slate-400 block leading-tight uppercase">BULK PRICE FROM</span>
            <div className="flex items-baseline space-x-0.5 mt-0.5">
              <span className="text-[11px] text-slate-500 font-bold">{activeCurrency.code}</span>
              <span className="text-lg font-black text-red-650 text-red-600 leading-none">
                {(product.basePrice * activeCurrency.rate).toFixed(2)}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 pl-0.5">/unit</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(product.id)}
            className="px-4.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-sm transition-all duration-150 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <span>Configure</span>
            <span className="text-sm font-light">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
