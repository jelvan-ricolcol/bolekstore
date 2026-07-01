/**
 * Types and interfaces for Jelvans Online Clothing (Printexpert Inspired)
 */

export type ApparelCategory = 'all' | 'corporate' | 'casual' | 'sports' | 'premium';

export interface ApparelProduct {
  id: string;
  name: string;
  description: string;
  category: ApparelCategory;
  basePrice: number;
  image: string;
  features: string[];
  popularSpec?: string;
  colors: string[];
  sizes: string[];
  fabricOptions: string[];
}

export type PrintMethod = ' embroidery' | 'dtf' | 'silkscreen' | 'sublimation';
export type PrintPlacement = 'front_center' | 'front_chest' | 'back' | 'sleeve';

export interface ApparelConfig {
  productId: string;
  productName: string;
  color: string;
  size: string;
  fabricWeight: string; // e.g. "160gsm", "180gsm", "220gsm Premium"
  printMethod: string;
  printPlacement: string;
  quantity: number;
  logoFile?: string; // string representation of uploaded logo
  logoFileName?: string;
  specialNotes?: string;
}

export interface CartItem {
  id: string;
  product: ApparelProduct;
  config: ApparelConfig;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderMessage {
  id: string;
  sender: 'customer' | 'seller';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    deliveryMethod: 'pickup' | 'delivery';
  };
  status: 'Received' | 'Designing' | 'Printing' | 'Ready' | 'Completed';
  paymentCompleted: boolean;
  messages?: OrderMessage[];
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  apparelType: string;
  estimatedQty: number;
  description: string;
  urgency: 'routine' | 'urgent' | 'super_urgent';
  createdAt: string;
  status: 'Pending' | 'Responded';
  sellerResponse?: string;
}

export interface User {
  email: string;
  name: string;
  role: 'customer' | 'seller';
  phone: string;
  address?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // exchange rate compared to 1 PHP (e.g. USD = 0.017, PHP = 1.0)
}

export interface CompanySettings {
  name: string;
  sstNo: string;
  regNo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  taxRate: number; // e.g. 0.12 (12% VAT)
}

export interface ThemeConfig {
  id: string;
  name: string;
  accentCode: string;
  hoverCode: string;
  lightCode: string;
  borderCode: string;
  textDarkCode: string;
}

