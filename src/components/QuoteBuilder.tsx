import React, { useState } from 'react';
import { QuoteRequest, Currency } from '../types';
import { FileText, BadgeCheck, Phone, Zap, Clock, Calculator, ClipboardList, Send, MapPin, Palette } from 'lucide-react';

interface QuoteBuilderProps {
  onSubmitQuote: (request: QuoteRequest) => void;
  activeCurrency: Currency;
}

export default function QuoteBuilder({ onSubmitQuote, activeCurrency }: QuoteBuilderProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [org, setOrg] = useState('');
  const [apparelType, setApparelType] = useState('Jelvans Premium Cotton T-Shirt');
  const [estimatedQty, setEstimatedQty] = useState(100);
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'super_urgent'>('routine');
  const [description, setDescription] = useState('');
  
  const [submittedRequest, setSubmittedRequest] = useState<QuoteRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Auto Pricing projection algorithm for bulk deals
  const calculateBulkEstimate = () => {
    let baseRate = 18.00;
    if (apparelType.includes('Polo')) baseRate = 28.00;
    if (apparelType.includes('Sport')) baseRate = 20.00;
    if (apparelType.includes('F1')) baseRate = 45.00;
    if (apparelType.includes('Fleece')) baseRate = 58.00;

    // Apply corporate bulk quantity steep discounts
    let discount = 0;
    if (estimatedQty >= 1000) discount = 0.45; // 45% discount for major offset runs
    else if (estimatedQty >= 500) discount = 0.38; // 38%
    else if (estimatedQty >= 250) discount = 0.30; // 30%
    else if (estimatedQty >= 100) discount = 0.22; // 22%
    else if (estimatedQty >= 50) discount = 0.12;  // 12%

    let netRate = baseRate * (1 - discount);

    // Apply Urgency modifier fees
    if (urgency === 'urgent') netRate += 3.00;
    if (urgency === 'super_urgent') netRate += 6.50;

    const unitPrice = Math.round(netRate * 100) / 100;
    const finalTotal = Math.round(unitPrice * estimatedQty * 100) / 100;

    return {
      baseRate,
      unitPrice,
      discountPercent: Math.round(discount * 100),
      finalTotal
    };
  };

  const projectStats = calculateBulkEstimate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      alert('Please fill out all the mandatory bulk RFQ sections.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const mockRequest: QuoteRequest = {
        id: `RFQ-${Math.floor(100000 + Math.random() * 900000)}`,
        name,
        email,
        phone,
        apparelType,
        estimatedQty,
        description,
        urgency,
        createdAt: new Date().toLocaleDateString('en-GB'),
        status: 'Pending'
      };

      onSubmitQuote(mockRequest);
      setSubmittedRequest(mockRequest);
      setIsSubmitting(false);

      // Reset fields
      setName('');
      setEmail('');
      setPhone('');
      setOrg('');
      setDescription('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-left font-sans selection:bg-red-655 selection:bg-red-600 selection:text-white text-slate-900 animate-[fadeIn_0.2s_ease-out]">
      
      {/* Page Title header */}
      <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 mb-8 border-b border-gray-200 pb-4 uppercase">
        <FileText className="w-6 h-6 text-red-600" />
        <span>Enterprise Bulk RFQ System (Volume 100+ pcs)</span>
      </h2>

      {submittedRequest ? (
        <div className="max-w-2xl mx-auto bg-slate-50 border border-green-200 rounded-xl p-8 space-y-6 shadow-sm text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 text-green-700">
            <BadgeCheck className="w-8 h-8 flex-shrink-0 animate-bounce text-green-600" />
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Bulk Request Logged Successfully!</h3>
              <p className="text-xs font-mono text-slate-500">RFQ reference ID: <strong className="text-green-600">{submittedRequest.id}</strong></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-y-2 text-slate-500">
              <span>Apparel Target:</span>
              <span className="text-right text-slate-800 font-extrabold">{submittedRequest.apparelType}</span>

              <span>Target Lot Quantity:</span>
              <span className="text-right text-slate-800 font-extrabold">{submittedRequest.estimatedQty} units</span>

              <span>Urgency Schedule:</span>
              <span className="text-right text-red-600 font-extrabold uppercase">{submittedRequest.urgency === 'routine' ? 'Standard 7 Days' : submittedRequest.urgency === 'urgent' ? 'Fast-Track 3 Days' : 'SUPER URGENT 24H'}</span>

              <span>Projected Cost Cap:</span>
              <span className="text-right text-green-700 font-extrabold bg-green-50 px-2 py-0.5 rounded ml-auto border border-green-100">
                {activeCurrency.code} {(projectStats.finalTotal * activeCurrency.rate).toFixed(2)} (Estimated)
              </span>
            </div>

            <p className="text-[10.5px] text-slate-505 leading-relaxed text-slate-500 border-t border-gray-150 border-gray-100 pt-3 font-semibold">
              *A dedicated corporate printing consultant from our Pagudpud main office is reviewing your uploaded vector specifications. We will WhatsApp compile official BIR/SEC-registered business pdf brochures within 15-30 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setSubmittedRequest(null)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-xs font-bold border border-gray-300 text-slate-700 uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Configure Another RFQ
            </button>
            <a
              href="tel:+639123231152"
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider text-center rounded transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-white animate-pulse" /> Call Hotline Direct
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RFQ Input Form Fields */}
          <div className="lg:col-span-12 xl:col-span-7 lg:w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-905 text-slate-900 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-2.5 mb-6 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-red-650 text-red-600" />
              <span>Tell Us Your Corporate Apparel Project Specs</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Grid 2x2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nur Farhanah"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Corporate / School Name
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. Tenaga Nasional Berhad"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-red-600" />
                    <span>WhatsApp Connection *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +60 19-283 5511"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. corporate@tnb.com.my"
                    className="w-full bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 rounded p-2.5 font-semibold"
                  />
                </div>
              </div>

              {/* Apparel Type Target selection dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Select Apparel Item Class
                  </label>
                  <select
                    value={apparelType}
                    onChange={(e) => setApparelType(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-slate-805 text-slate-800 focus:border-red-600 py-2.5 px-3 rounded text-xs select-none outline-none font-semibold"
                  >
                    <option value="Jelvans Premium Cotton T-Shirt">Premium Cotton T-Shirt (Casual)</option>
                    <option value="Classic Honeycomb Polo Shirt">Classic Honeycomb Polo (Office Uniform)</option>
                    <option value="Aeroglide Dry-Fit Jersey">Aeroglide Dry-Fit Jersey (Sports)</option>
                    <option value="Executive Tailored F1 Shirt">Executive Tailored F1 Uniform (Formal)</option>
                    <option value="Urban Core Fleece Hoodie">Urban Core Fleece Hoodie (Premium Hoods)</option>
                    <option value="Canvas Utility Tote Bag">12oz Canvas Utility Tote Bag</option>
                  </select>
                </div>

                {/* Urgency SLA Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Timeline Production SLA
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 text-slate-805 text-slate-800 focus:border-red-600 py-2.5 px-3 rounded text-xs select-none outline-none font-semibold"
                  >
                    <option value="routine">Routine Standard (7-10 Working Days)</option>
                    <option value="urgent">Express Queue (3-5 Working Days)</option>
                    <option value="super_urgent">Super Urgent Printing (24-48 Hours)</option>
                  </select>
                </div>
              </div>

              {/* Estimate Qty Custom input */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">
                    LOT VOLUME (UNITS):
                  </label>
                  <span className="text-red-600 font-extrabold">{estimatedQty} pcs</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={estimatedQty}
                  onChange={(e) => setEstimatedQty(parseInt(e.target.value))}
                  className="w-full accent-red-600 h-1 bg-gray-251 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8.5px] font-bold text-slate-450 text-slate-400">
                  <span>Min: Lot 50</span>
                  <span>100 pcs (-22%)</span>
                  <span>500 pcs (-38%)</span>
                  <span>Max Limit: Lot 5000 (-45%)</span>
                </div>
              </div>

              {/* Specification Descriptions */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-red-650 text-red-600" />
                  <span>Custom Fabrics, Piping Accents & Embroidery Placements</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: We need 250 jerseys for corporate charity tournament. Need contrast gold side accents. Our emblem logo is embroidery size 3 inches x 3 inches, to stitch centered on left breast. Standard black crew collars requested..."
                  className="w-full bg-white border border-gray-300 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-red-600 rounded p-3 resize-none font-semibold"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1 font-sans">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Transmitting Lot Specs...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-white" />
                    <span>Submit Quote To Pagudpud Desk</span>
                  </div>
                )}
              </button>

            </form>
          </div>

          {/* Right Live pricing Calculator Board */}
          <div className="lg:col-span-12 xl:col-span-5 lg:w-full bg-white border border-gray-200 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm">
            
            <div className="space-y-5 text-left">
              <h3 className="text-slate-905 text-slate-900 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-2.5 flex items-center gap-1.5 select-none">
                <Calculator className="w-4.5 h-4.5 text-red-600" />
                <span>Bulk Quote Projection Matrix</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-gray-100 font-semibold">
                <div className="flex justify-between">
                  <span>Selected Garment base:</span>
                  <span className="text-slate-800 font-bold">{activeCurrency.code} {(projectStats.baseRate * activeCurrency.rate).toFixed(2)}/pcs</span>
                </div>

                <div className="flex justify-between">
                  <span>Wholesale volume discount:</span>
                  <span className="text-green-600 font-extrabold">-{projectStats.discountPercent}% OFF Lot</span>
                </div>

                <div className="flex justify-between">
                  <span>Timeline Modifiers:</span>
                  <span className="text-slate-805 text-slate-850 text-slate-800 font-bold">
                    {urgency === 'routine' ? `+${activeCurrency.code} 0.00` : urgency === 'urgent' ? `+${activeCurrency.code} ${(3.00 * activeCurrency.rate).toFixed(2)}/pcs` : `+${activeCurrency.code} ${(6.50 * activeCurrency.rate).toFixed(2)}/pcs`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2.5 flex justify-between text-slate-900 font-bold">
                  <span>Estimated Net Unit Rate:</span>
                  <span className="text-red-600 font-black">{activeCurrency.code} {(projectStats.unitPrice * activeCurrency.rate).toFixed(2)}/pcs</span>
                </div>
              </div>

              {/* Total Sheet display */}
              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-2 text-center shadow-inner">
                <span className="text-[9px] text-slate-405 text-slate-400 uppercase font-black tracking-wider">PROJECTED CONTRACT Lot VALUE</span>
                <div className="flex justify-center items-baseline space-x-1">
                  <span className="text-xs text-slate-500 font-bold">{activeCurrency.code}</span>
                  <span className="text-3xl font-black text-red-600 tracking-tight">{(projectStats.finalTotal * activeCurrency.rate).toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold text-center leading-none mt-1">
                  *Excludes standard VAT 12% service tax.
                </p>
              </div>

              {/* Visual guarantees grids */}
              <div className="space-y-2 pt-3">
                <span className="text-[9px] text-slate-450 text-slate-400 font-extrabold block uppercase pb-1 tracking-widest">JELVANS ASSURED CORNERSTONES:</span>
                {[
                  '100% Free WhatsApp Visual proofing mocks before printing starts',
                  'ISO 9001:2015 Approved Double-lock stitched clothing seams',
                  'Philippine BIR Standard corporate receipting compliance'
                ].map((text, i) => (
                  <div key={i} className="flex items-start space-x-1.5 text-[10px] font-semibold text-slate-650 text-slate-600">
                    <span className="text-green-605 text-green-600 font-bold">✔</span>
                    <span className="leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-center text-slate-500 pt-6 border-t border-gray-100 mt-6 select-none font-semibold">
              Questions? Chat with Pagudpud Branch Desk <br />
              <span className="text-red-600 font-bold mt-1 inline-block">Tel: +63 912 323 1152</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
