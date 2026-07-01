import React from 'react';
import { Mail, Clock, MapPin, ShieldCheck, CreditCard, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-gray-200 text-slate-600 font-sans selection:bg-red-600 selection:text-white">
      {/* Three Column Trust Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-white border border-gray-200 text-red-600 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-1 uppercase tracking-wider text-xs">Certified Philippine Print Standard</h4>
            <p className="text-xs text-slate-500">ISO 9001:2015 Printing & Sew Management. High-durability inks guaranteed to withstand 100+ machine washes without cracking.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-white border border-gray-200 text-red-600 shadow-sm">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-1 uppercase tracking-wider text-xs">BIR & SEC Invoice Compliant</h4>
            <p className="text-xs text-slate-500">Corporate invoices generated instantly with local tax TIN and SEC registration numbers automatically compiled.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-white border border-gray-200 text-red-600 shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-1 uppercase tracking-wider text-xs">Corporate VIP Pricing</h4>
            <p className="text-xs text-slate-500">Volume quotes above 500 units receive customized fabrics, direct offset scheduling, and complimentary design support.</p>
          </div>
        </div>
      </div>

      {/* Main Corporate Information Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 text-white font-black text-sm px-2 py-1 rounded">
              JELVANS
            </div>
            <span className="text-slate-900 font-bold tracking-tight text-md">Online Printing Group</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Reimaging premium custom clothing printing for sports, startups, and Philippine corporate and community partners. Heavily inspired by high-quality and volume speed.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <span className="text-xs font-bold text-red-600 uppercase">SEC Reg:</span>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded text-slate-600 border border-gray-200">202611893-T-PH</span>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h4 className="text-slate-900 font-bold text-sm tracking-wide uppercase border-l-2 border-red-600 pl-2">
            Operation Hours
          </h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex justify-between">
               <span>Monday – Friday:</span>
               <span className="text-slate-800 font-medium">9:00 AM – 9:00 PM</span>
            </li>
            <li className="flex justify-between">
               <span>Saturday:</span>
               <span className="text-slate-800 font-medium">9:00 AM – 6:00 PM</span>
            </li>
            <li className="flex justify-between">
               <span>Sunday / Holiday:</span>
               <span className="text-red-600 font-semibold">Closed For Production</span>
            </li>
          </ul>
          <p className="text-[11px] text-slate-400 leading-tight">
            *Online configuration and checkout engine 100% active 24/7. Offset printing presses run overnight.
          </p>
        </div>

        {/* Our Philippines Branches */}
        <div className="space-y-4 lg:col-span-2">
          <h4 className="text-slate-900 font-bold text-sm tracking-wide uppercase border-l-2 border-red-600 pl-2">
            Our Outlets & Delivery Network
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-red-650 font-bold block mb-1 text-red-600">1. PAGUDPUD HEADQUARTERS</span>
              <p className="text-slate-500 text-[11px]">No. 20, Barangay Bulalo, Bulalo Siubec Pagudpud, Ilocos Norte 2919.</p>
              <span className="text-slate-400 block mt-1">Tel: +63 912 323 1152</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-red-650 font-bold block mb-1 text-red-600">2. ORTIGAS HUB & STUDIO</span>
              <p className="text-slate-500 text-[11px]">Ground Floor, Ortigas Center, Pasig City, Metro Manila 1605.</p>
              <span className="text-slate-400 block mt-1">Tel: +63 2 8631 1102</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-red-650 font-bold block mb-1 text-red-600">3. CEBU IT PARK BRANCH</span>
              <p className="text-slate-500 text-[11px]">Level 2, Cebu IT Park, Lahug, Cebu City 6000.</p>
              <span className="text-slate-400 block mt-1">Tel: +63 32 230 4599</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-red-650 font-bold block mb-1 text-red-600">4. DAVAO ECO-ZONE WORKSHOP</span>
              <p className="text-slate-500 text-[11px]">Block 4, Lanang Industrial Estate, Davao City 8000.</p>
              <span className="text-slate-400 block mt-1">Tel: +63 82 299 8122</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Badges & Copyright footer */}
      <div className="bg-slate-900 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <p className="text-slate-400">
              © {new Date().getFullYear()} Jelvans Online Clothing. Powered by Jelvans Print Expert. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-widest font-bold mr-2 text-slate-500">PAY SECURELY:</span>
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[11px]">GCash</span>
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[11px]">Maya</span>
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[11px]">PayMongo API</span>
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[11px]">Visa / Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
