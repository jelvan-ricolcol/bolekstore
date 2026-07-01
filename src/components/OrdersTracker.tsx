import React, { useState } from 'react';
import { Order, Currency } from '../types';
import { ClipboardList, Printer, Phone, MapPin, BadgeCheck, FileText, Download, Calendar, Search, MessageSquare, Send, Package } from 'lucide-react';

interface OrdersTrackerProps {
  orders: Order[];
  onDownloadInvoice: (orderId: string) => void;
  activeCurrency: Currency;
  onSendOrderMessage?: (orderId: string, text: string, sender: 'customer' | 'seller', senderName: string) => void;
}

export default function OrdersTracker({ orders, onDownloadInvoice, activeCurrency, onSendOrderMessage }: OrdersTrackerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [chatInput, setChatInput] = useState('');

  const currentOrder = orders.find(o => o.id === selectedOrder?.id) || selectedOrder;

  // Handle setting default if state shifts
  React.useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(invoiceSearch.toLowerCase()) || 
    o.customerDetails.name.toLowerCase().includes(invoiceSearch.toLowerCase())
  );

  const getStatusStepClass = (currentStatus: string, stepLabel: string) => {
    const stepsOrder = ['Received', 'Designing', 'Printing', 'Ready', 'Completed'];
    const currentIdx = stepsOrder.indexOf(currentStatus);
    const targetIdx = stepsOrder.indexOf(stepLabel);

    if (currentIdx > targetIdx) {
      return 'bg-green-600 border-green-600 text-white'; // Completed standard
    } else if (currentIdx === targetIdx) {
      return 'bg-red-650 bg-red-600 border-red-600 text-white font-extrabold shadow-sm'; // Current active
    } else {
      return 'bg-slate-50 border-gray-251 border-gray-200 text-slate-400'; // Upcoming state
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'Received': return 'Order successfully paid. Our creative design team is awaiting digital approval of vectors.';
      case 'Designing': return 'Artworks of logo are being adjusted for embroidery punch programs and Screen direct plates layout.';
      case 'Printing': return 'Your clothing is being hand sewed and printed at our Pagudpud industrial workshops.';
      case 'Ready': return 'QC inspection completed. Ready in-bag for pickup at main desk or dispatch courier.';
      default: return 'Job completed. Thank you for print shopping with Jelvans Online Clothing Group.';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-left font-sans selection:bg-red-600 selection:text-white text-slate-900 animate-[fadeIn_0.2s_ease-out]">
      
      {/* Title */}
      <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 mb-8 border-b border-gray-200 pb-4 uppercase">
        <ClipboardList className="w-6 h-6 text-red-600" />
        <span>Jelvans Live Print Job Tracker</span>
      </h2>

      {orders.length === 0 ? (
        <div className="bg-slate-50 border border-gray-200 rounded-xl py-16 px-4 text-center max-w-xl mx-auto space-y-4">
          <Package className="w-16 h-16 text-slate-300 mx-auto" strokeWidth={1.5} />
          <div>
            <h3 className="text-slate-850 font-extrabold text-lg leading-snug">No active print jobs found</h3>
            <p className="text-slate-500 text-xs mt-1 font-medium leading-normal">You have not finalized any clothing print items. Go to the Catalog to configure custom layouts.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Jobs Side navigation list */}
          <div className="lg:col-span-12 xl:col-span-4 lg:w-full space-y-4">
            
            {/* Search filter */}
            <div className="relative">
              <input
                type="text"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Search Invoice # or Name..."
                className="w-full bg-white border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-xs text-slate-800 placeholder-slate-400 rounded py-2.5 pl-3 pr-8 outline-none font-semibold"
              />
              <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3" />
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded border text-left cursor-pointer transition-all duration-150 shadow-xs ${
                    selectedOrder?.id === ord.id
                      ? 'border-red-600 bg-red-50/40'
                      : 'border-gray-208 border-gray-200 bg-white hover:border-gray-350'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold text-slate-800 block">{ord.id}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{ord.date}</span>
                  </div>

                  <span className="text-xs text-slate-700 font-extrabold block mt-2 truncate">
                    {ord.customerDetails.name}
                  </span>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-red-600 font-bold font-mono">{activeCurrency.code} {(ord.total * activeCurrency.rate).toFixed(2)}</span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      ord.status === 'Received' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      ord.status === 'Designing' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      ord.status === 'Printing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Status tracker and Corporate BIR Tax Invoice details view */}
          {currentOrder && (
            <div className="lg:col-span-12 xl:col-span-8 lg:w-full space-y-6">
              
              {/* Stepper dashboard card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
                <div>
                  <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded border border-red-100 uppercase font-black tracking-widest">
                    Live Workshop Queue
                  </span>
                  <p className="text-xs text-slate-500 mt-2 font-semibold">Real-time status tracking of your custom apparel package.</p>
                </div>

                {/* 5-step horizontal graphical stepper */}
                <div className="grid grid-cols-5 gap-2 relative pt-2">
                  <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 -z-0" />
                  
                  {[
                    { step: 'Approved', val: 'Received' },
                    { step: 'Proofing', val: 'Designing' },
                    { step: 'Sewing', val: 'Printing' },
                    { step: 'QC Ready', val: 'Ready' },
                    { step: 'Dispatched', val: 'Completed' }
                  ].map((st, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center relative z-10 select-none">
                      <div className={`w-8 h-8 rounded-full border-2 text-[10px] font-bold flex items-center justify-center transition-all ${getStatusStepClass(currentOrder.status, st.val)}`}>
                        {idx + 1}
                      </div>
                      <span className="text-[9.5px] font-bold mt-1.5 text-slate-500 block truncate w-full">
                        {st.step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Production updates block description */}
                <div className="bg-slate-50 p-4 rounded border border-gray-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">STATUS UPDATE BRIEFING:</span>
                  <p className="text-xs text-slate-800 font-extrabold mt-1.5 leading-relaxed">{getStatusDescription(currentOrder.status)}</p>
                  <p className="text-[10px] text-slate-450 mt-1.5 leading-relaxed font-semibold">
                    Expected collection timeframe: 48-72 Hours. Delivery orders will be allocated standard parcel trackers.
                  </p>
                </div>
              </div>

              {/* Secure Customer-Seller Chat Workspace */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm text-left animate-[fadeIn_0.2s_ease-out]">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded border border-red-100 uppercase font-bold tracking-wider">
                      Seller Dispatch Desk Communication
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-2 flex items-center gap-1.5 uppercase tracking-tight">
                      <span>Message Workshop Desk</span>
                      <span className="bg-red-650 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold select-none">
                        {currentOrder.messages?.length || 0}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Messages Thread Container */}
                <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                  {!currentOrder.messages || currentOrder.messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
                      <p className="text-xs font-semibold">No active chat notes yet for this invoice. Write a message below to coordinate print details!</p>
                    </div>
                  ) : (
                    currentOrder.messages.map((msg) => {
                      const isCustomer = msg.sender === 'customer';
                      return (
                        <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} animate-[fadeIn_0.15s_ease-out]`}>
                          <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-bold mb-1">
                            <span className={isCustomer ? 'text-red-600 font-extrabold' : 'text-slate-600 font-extrabold'}>{msg.senderName}</span>
                            <span>&bull;</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs max-w-sm font-medium leading-relaxed shadow-sm ${
                            isCustomer 
                              ? 'bg-red-600 text-white rounded-tr-none' 
                              : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Quick Assistance presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Expedite design request',
                      'Confirm sleeve print coordinates',
                      'Enquire shipping label status',
                      'Correction in apparel sizing'
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!currentOrder) return;
                          if (onSendOrderMessage) {
                            onSendOrderMessage(currentOrder.id, preset, 'customer', currentOrder.customerDetails.name || 'Customer');
                          }
                        }}
                        className="text-[10px] bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 p-1.5 rounded text-slate-600 font-bold transition-all cursor-pointer hover:border-red-200"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Submission Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!chatInput.trim() || !currentOrder) return;
                    if (onSendOrderMessage) {
                      onSendOrderMessage(currentOrder.id, chatInput.trim(), 'customer', currentOrder.customerDetails.name || 'Customer');
                    }
                    setChatInput('');
                  }} 
                  className="flex gap-2 pt-3 border-t border-gray-100"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message or instruction for the workshop desk..."
                    className="flex-grow bg-white border border-gray-300 text-xs text-slate-800 outline-none focus:border-red-600 p-2.5 rounded font-semibold focus:border-red-650 focus:ring-1 focus:ring-red-600"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-xs font-bold uppercase rounded cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

              {/* High-fidelity BIR e-Statement/Tax Invoice card view */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 relative shadow-sm">
                
                {/* Floating Invoice PDF action button */}
                <div className="absolute top-6 right-6 flex items-center space-x-2">
                  <button
                    onClick={() => onDownloadInvoice(currentOrder.id)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 border border-gray-300 rounded text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider shadow-sm"
                    title="Export certified BIR statement receipt invoice"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-705" />
                    <span>Print Invoice</span>
                  </button>
                </div>

                {/* Simulated Invoice Header */}
                <div className="border-b border-dashed border-gray-251 border-gray-300 pb-5 text-left" id={`invoice-print-panel-${currentOrder.id}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-red-650 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded leading-none uppercase">
                      JELVANS
                    </div>
                    <span className="text-slate-905 text-slate-900 text-xs font-bold tracking-wider uppercase">TAX INVOICE / BIR STATEMENT</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500 pt-3">
                    <div>
                      <p className="font-extrabold text-slate-805 text-slate-800 mb-0.5">Jelvans Clothing Group PH</p>
                      <p className="text-[10px] leading-tight">SEC Reg No: <strong>202611893-T-PH</strong></p>
                      <p className="text-[10px] leading-tight mt-0.5">Company Registration No: 202603124567-PH</p>
                      <p className="text-[10px] leading-tight mt-0.5">Contact General: support@jelvansclothing.ph</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-800 font-bold">INVOICE NO: <span className="text-red-605 text-red-600">{currentOrder.id}</span></p>
                      <p className="text-[11px] mt-0.5">DATE COMPILED: {currentOrder.date}</p>
                      <p className="text-[11px] text-green-700 font-extrabold select-none mt-1">● STATUS SECURED: BIR TAX-PAID</p>
                    </div>
                  </div>
                </div>

                {/* Customer / Consignee details */}
                <div className="py-4 border-b border-dashed border-gray-300 grid grid-cols-2 gap-4 text-xs font-mono text-slate-500 text-left">
                  <div>
                    <span className="text-[10px] text-slate-450 text-slate-400 font-bold block uppercase pb-1">BILL / CONSIGNEE CLIENT:</span>
                    <p className="text-slate-805 text-slate-800 font-extrabold leading-none">{currentOrder.customerDetails.name}</p>
                    <p className="text-[11px] mt-1">E: {currentOrder.customerDetails.email}</p>
                    <p className="text-[11px] mt-0.5">P: {currentOrder.customerDetails.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 text-slate-400 font-bold block uppercase pb-1">DELIVERY ADDRESS / GATE:</span>
                    <p className="leading-relaxed text-[11px] text-slate-700 max-w-xs">{currentOrder.customerDetails.address}</p>
                  </div>
                </div>

                {/* Invoice Items Table list */}
                <div className="py-4 text-xs font-mono">
                  <div className="grid grid-cols-12 gap-2 text-slate-500 font-bold border-b border-gray-200 pb-2 text-left select-none bg-slate-50 p-2 rounded">
                    <span className="col-span-6 uppercase text-[9.5px]">Garment Configuration Details</span>
                    <span className="col-span-2 text-center uppercase text-[9.5px]">QTY</span>
                    <span className="col-span-2 text-right uppercase text-[9.5px]">UNIT DR</span>
                    <span className="col-span-2 text-right uppercase text-[9.5px]">TOTAL</span>
                  </div>

                  <div className="divide-y divide-gray-100 font-mono">
                    {currentOrder.items.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 py-3.5 text-slate-705 text-slate-700 text-left items-center">
                        <div className="col-span-6 space-y-1">
                          <p className="text-slate-900 font-bold leading-snug">{it.product.name}</p>
                          <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-450 leading-none">
                            <span>Col: <strong>{it.config.color}</strong></span>
                            <span>Sz: <strong>{it.config.size}</strong></span>
                            <span>Fabric: <strong>{it.config.fabricWeight}</strong></span>
                          </div>
                          <div className="text-[9.5px] text-red-655 text-red-650 text-red-600 leading-none">
                            Method: <span>{it.config.printMethod}</span> | Zone: <span>{it.config.printPlacement}</span>
                          </div>
                        </div>
                        <span className="col-span-2 text-center font-bold text-slate-800">{it.config.quantity}</span>
                        <span className="col-span-2 text-right text-slate-500">{activeCurrency.code} {(it.unitPrice * activeCurrency.rate).toFixed(2)}</span>
                        <span className="col-span-2 text-right font-bold text-red-600">{activeCurrency.code} {(it.totalPrice * activeCurrency.rate).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing subtotals breakdown block */}
                <div className="border-t border-dashed border-gray-300 pt-4 flex justify-end">
                  <div className="w-full max-w-xs space-y-1.5 text-xs font-mono text-slate-500 text-right">
                    <div className="flex justify-between">
                      <span>Invoice subtotal:</span>
                      <span className="text-slate-850 text-slate-800 font-bold">{activeCurrency.code} {(currentOrder.subtotal * activeCurrency.rate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 justify-end">SST Tax (6% Service Rate):</span>
                      <span className="text-slate-850 text-slate-800 font-bold">{activeCurrency.code} {(currentOrder.tax * activeCurrency.rate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logistics delivery rate:</span>
                      <span className="text-slate-850 text-slate-800 font-bold">{activeCurrency.code} {(currentOrder.shipping * activeCurrency.rate).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2.5 flex justify-between font-bold text-slate-800 text-sm">
                      <span className="text-red-100 text-red-650 text-red-600 font-black">GRAND SUMMARY CHARGE:</span>
                      <span className="text-red-105 text-red-650 text-red-600 font-black">{activeCurrency.code} {(currentOrder.total * activeCurrency.rate).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
