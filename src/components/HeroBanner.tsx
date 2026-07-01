import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, Users } from 'lucide-react';

interface HeroBannerProps {
  onStartCustomizing: () => void;
  onGoQuotes: () => void;
  activeCurrency: {
    code: string;
    symbol: string;
    rate: number;
  };
}

export default function HeroBanner({ onStartCustomizing, onGoQuotes, activeCurrency }: HeroBannerProps) {
  return (
    <div className="w-full text-white font-sans overflow-hidden py-20 px-6 border-b border-slate-800 relative bg-slate-950">
      {/* Background Image of the workshop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 select-none pointer-events-none"
        style={{ backgroundImage: `url('https://res.cloudinary.com/durqetaph/image/upload/jelvansprinting.png')` }}
      />
      {/* Gradient overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent pointer-events-none" />
      {/* Fine grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1.5px,transparent_1.5px),linear-gradient(to_bottom,#1e293b_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none opacity-25" />

      <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left copy text block */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Top Banner Tag */}
          <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
            <span>BESTSELLER 2026 APPAREL PLATFORM</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] uppercase font-display">
            Premium Custom Clothing <br />
            <span className="text-red-500">
              Custom Printing Studio
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
            Configure premium hoodies, executive polo jerseys, dry-fit activewear, and corporate uniforms in seconds. High quality DTF and Screen Printing with 24-hour express delivery options.
          </p>

          {/* Browse Catalog and Categories ("below above") */}
          <div className="space-y-2.5 py-1">
            <span className="text-[10px] font-mono font-black tracking-widest text-slate-400 uppercase block select-none">
              Browse Catalog
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Corporate Uniforms', id: 'polo' },
                { label: 'Custom Casualwear', id: 'tee' },
                { label: 'Sportswear', id: 'jersey' },
                { label: 'Hoodies & Caps', id: 'hoodie' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={onStartCustomizing}
                  className="px-3.5 py-1.5 bg-slate-900/90 hover:bg-red-650 hover:bg-red-600 text-white border border-slate-800 hover:border-red-500 text-xs font-extrabold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Value badging row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-200">100% Combed Cotton</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Activity className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Ready in 24 Hours</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center space-x-2.5">
              <Users className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-200">Save up to 40% Bulk</span>
            </div>
          </div>

          {/* Conversion CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
            <button
              onClick={onStartCustomizing}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md hover:shadow-red-600/10 flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer transform md:hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Instant Customizer Tool</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onGoQuotes}
              className="px-6 py-3 text-xs uppercase tracking-wider border border-slate-700 hover:border-slate-600 bg-slate-900 text-slate-100 font-bold rounded flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer"
            >
              <span>Request Custom Quote (Bulk)</span>
            </button>
          </div>
        </div>

        {/* Right graphic board */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden group text-left"
          >
            {/* Red glowing radial light */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/15 transition-all duration-500" />
            
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-400 bg-slate-950/85 px-3 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>FACTORY OUTPUT ACTIVE</span>
              </span>
              <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 border border-red-900/50 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>PRODUCTION SLOTS OK</span>
              </span>
            </div>

            {/* Simulated Live Print Configuration Card list */}
            <div className="space-y-4">
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex items-center space-x-4 hover:border-red-900/40 transition-colors">
                <div className="flex-shrink-0 bg-slate-900 p-2 rounded-lg">
                  <svg className="w-8 h-8 text-red-500" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 15 L25 21 L15 35 L26 42 L28 35 L32 35 L32 85 L68 85 L68 35 L72 35 L74 42 L85 35 L75 21 Z" />
                    <path d="M40 15 L50 25 L60 15 L50 35 Z" fill="#000" opacity="0.3" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-[9px] font-bold text-slate-500 font-mono tracking-wider">01. CORPORATE UNIFORM</h4>
                  <h3 className="text-sm font-extrabold text-white mt-0.5">Premium Honeycomb Polo</h3>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-[9px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-850">Embroidery Ready</span>
                    <span className="text-[9px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-850">Polypique Knit</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono block">UNIT BASE</span>
                  <span className="text-sm font-bold font-mono text-red-400">{activeCurrency.code} {(350 * activeCurrency.rate).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex items-center space-x-4 hover:border-red-900/40 transition-colors">
                <div className="flex-shrink-0 bg-slate-900 p-2 rounded-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 15 L25 19 L19 33 L28 39 L28 85 L72 85 L72 39 L81 39 L75 19 Z" />
                    <path d="M42 16 L35 85 h6 L49 16 Z" fill="#000" opacity="0.3" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-[9px] font-bold text-slate-500 font-mono tracking-wider">02. SPORT/TEAMWEAR</h4>
                  <h3 className="text-sm font-extrabold text-white mt-0.5">Quick-Dry Mesh Jersey</h3>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-[9px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-850">Sublimation Ready</span>
                    <span className="text-[9px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-850">140gsm Airflow</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono block">UNIT BASE</span>
                  <span className="text-sm font-bold font-mono text-red-400">{activeCurrency.code} {(220 * activeCurrency.rate).toFixed(2)}</span>
                </div>
              </div>

              {/* Savings metrics indicators */}
              <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/85">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-slate-300">Wholesale Volume Advantage</span>
                  <span className="text-red-400 font-extrabold text-[10px]">SAVE UP TO 40%</span>
                </div>
                <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-red-600 h-1.5 rounded-full w-[85%]" />
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1.5">
                  <span>LOT: 1-10 (Base)</span>
                  <span>LOT: 100+ (30% Off)</span>
                  <span>LOT: 300+ (40% Off)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
