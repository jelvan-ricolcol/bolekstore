import { ApparelProduct } from './types';

export const JELVANS_PRODUCTS: ApparelProduct[] = [
  {
    id: 'prod-001',
    name: 'Jelvans Premium Cotton Round-Neck Tee',
    description: '100% premium combed ring-spun cotton. Tight knit knit gauge perfect for ultra-sharp DTF digital prints or vibrant silkscreen layering.',
    category: 'casual',
    basePrice: 350.00,
    image: '👕', // Fallback, we will use modern UI vectors & graphics
    features: ['100% Combed Cotton', 'Pre-shrunk jersey knit', '180 gsm heavy-active', 'Double-needle sleeve and bottom hems'],
    popularSpec: 'Most Popular for Tech events & streetwear brands',
    colors: ['Jet Black', 'Pure White', 'Burgundy red', 'Navy Blue', 'Forest Green', 'Heather Grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabricOptions: ['160gsm Lightweight', '180gsm Medium jersey', '200gsm Heavyweight Cotton', '240gsm Ultra Luxury']
  },
  {
    id: 'prod-002',
    name: 'Classic Signature Honeycomb Corporate Polo',
    description: 'Professional knitted pique polo featuring rich ribbed collars and cuffs. Highly recommended for executive wear and high-density logo embroidery.',
    category: 'corporate',
    basePrice: 580.00,
    image: '👔',
    features: ['65% Polyester 35% Cotton Honeycomb blend', 'Reinforced placket with 3 color-matched buttons', 'Rib-knit collar & cuffs', 'Superior shape retention after laundry'],
    popularSpec: 'No.1 seller for corporate office teams & retail staff',
    colors: ['Navy Blue', 'Charcoal Grey', 'Emerald Green', 'Royal Blue', 'Red Wine', 'Pure White'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    fabricOptions: ['220gsm Standard Knit', '240gsm Heavy honeycomb', '200gsm Dry-fit honeycomb']
  },
  {
    id: 'prod-003',
    name: 'Aeroglide Active Microfiber Sport Jersey',
    description: 'Advanced moisture-wicking interlock mesh. Engineered for high athletic performance and vivid full-surface sublimation colors.',
    category: 'sports',
    basePrice: 450.00,
    image: '🎽',
    features: ['100% Quick-Dry Polyester Interlock', 'Anti-odor & anti-bacterial fibers', 'Excellent elasticity & friction-free seams', 'UV-protection shielding SPF 40+'],
    popularSpec: 'Best choice for football clubs, marathons, and cycling crews',
    colors: ['Neon Yellow', 'Laser Red', 'Electric Blue', 'Jet Black', 'Orange Crush', 'Clean White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabricOptions: ['140gsm Air-flow micro-mesh', '160gsm Smooth interlock', '180gsm Premium Double Knit']
  },
  {
    id: 'prod-004',
    name: 'Executive Tailored F1 Corporate Uniform',
    description: 'Expertly structured dual-contrast corporate shirt with sharp epaulets, modern standing collar, and hidden premium button closures.',
    category: 'corporate',
    basePrice: 850.00,
    image: '👔',
    features: ['Premium TC Drill (Viscose/Polyester blend)', 'Contrast piping & structural side design panels', 'Chest pocket with easy-access pen slot', 'Breathability panels & wrinkle-resistant finish'],
    popularSpec: 'Strict Government & Corporate Executive specifications',
    colors: ['Navy & White Contrast', 'Royal Blue & Yellow', 'Red & Black Accent', 'Grey & Orange Corporate'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    fabricOptions: ['Premium Viscose TC Drill (Heavy)', 'Super-soft Peach finish Viscose']
  },
  {
    id: 'prod-005',
    name: 'Urban Core Heavyweight Fleece Hoodie',
    description: 'Ultra-luxurious heavyweight fleece hoodie. Double-lined hoodie hood, thick matching flat laces, and deep spacious pouch pockets.',
    category: 'premium',
    basePrice: 1200.00,
    image: '🧥',
    features: ['70% Premium Cotton, 30% Polyester Blend', 'Super soft brushed-fleece internal lining', 'Double knit reinforced hood', 'Ribbed waist side panels & heavy cuffs'],
    popularSpec: 'Streetwear startups and official premium merchandise',
    colors: ['Sand Beige', 'Sage Green', 'Dusty Lavender', 'Pitch Black', 'Heather Grey', 'Chocolate Brown'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabricOptions: ['280gsm Classic Fleece', '320gsm Heavy Luxury Fleece', '380gsm Supreme Oversized Cotton Fleece']
  },
  {
    id: 'prod-006',
    name: 'Reinforced 12oz Canvas Utility Tote Bag',
    description: 'Durable, long-lasting heavy canvas tote bag with deep bottom gussets and double-stitched web handles. Ideal for ecofriendly packaging.',
    category: 'premium',
    basePrice: 180.00,
    image: '👜',
    features: ['Highly durable 100% Cotton 12oz Canvas', 'Overlocked interior seams for heavy duty loads', '3-inch wide bottom gusset', '22-inch long handles with cross-stitch reinforcement'],
    popularSpec: 'Ideal for conferences, design studios & premium giveaways',
    colors: ['Natural Unbleached Cream', 'Jet Black', 'Navy Blue', 'Forest Amber'],
    sizes: ['Standard (38cm x 42cm)'],
    fabricOptions: ['10oz Basic Cotton Canvas', '12oz Heavy Duty Canvas', '16oz Ultra-thick Canvas Canvas']
  }
];

export const PRINT_METHODS = [
  { id: 'embroidery', name: 'Premium Embroidery', price: 120.00, desc: 'Classic thread stitching. Excellent durability and luxury texture. Best for corporate uniforms and polo jerseys.' },
  { id: 'dtf', name: 'Digital DTF (Direct to Film)', price: 80.00, desc: 'High-resolution full-color printing. Perfect for photo-realistic graphics and multi-color gradients on cotton.' },
  { id: 'silkscreen', name: 'Vibrant Silkscreen', price: 50.00, desc: 'Industrial ink squeeze. Highly affordable for larger production volumes. Rich solid colors and heavy durability.' },
  { id: 'sublimation', name: 'Full HD Sublimation', price: 150.00, desc: 'Dye is embedded straight into microfiber pores. Zero edge feeling, will never peel or crack. Standard on all premium sports jerseys.' }
];

export const PRINT_PLACEMENTS = [
  { id: 'front_center', name: 'Full Chest Center (A4 Size)', modifier: 1.0 },
  { id: 'front_chest', name: 'Left Chest Pocket Size', modifier: 0.8 },
  { id: 'back', name: 'Full Back Center (A3 Size)', modifier: 1.3 },
  { id: 'sleeve', name: 'Left/Right Sleeve Pocket Size', modifier: 0.7 }
];

// Tier-based discount calculation matching PrintExpert Bulk Advantage
export function calculateItemPrice(
  basePrice: number,
  qty: number,
  printMethodId: string,
  printPlacementId: string,
  weightTag: string
): { unitPrice: number; discountPercent: number; additions: number; subtotal: number } {
  
  // 1. Calculate print and fabric additions
  let additions = 0;
  
  // Fabric weight cost modifiers
  if (weightTag.includes('180gsm') || weightTag.includes('160gsm Smooth')) {
    additions += 30.00;
  } else if (weightTag.includes('200gsm') || weightTag.includes('180gsm Premium')) {
    additions += 60.00;
  } else if (weightTag.includes('240gsm') || weightTag.includes('Heavy honeycomb') || weightTag.includes('320gsm')) {
    additions += 110.00;
  } else if (weightTag.includes('380gsm') || weightTag.includes('16oz')) {
    additions += 170.00;
  }

  // Print method base addition
  const printMethod = PRINT_METHODS.find(m => m.id === printMethodId);
  const printMethodPrice = printMethod ? printMethod.price : 0;

  // Placement modifier
  const placement = PRINT_PLACEMENTS.find(p => p.id === printPlacementId);
  const placementMod = placement ? placement.modifier : 1.0;

  const printAdditions = printMethodPrice * placementMod;
  additions += printAdditions;

  const rawUnitPrice = basePrice + additions;

  // 2. Compute bulk discount tiers based on Printexpert volume economics
  let discountPercent = 0;
  if (qty >= 300) {
    discountPercent = 40; // 40% discount for orders above 300
  } else if (qty >= 100) {
    discountPercent = 30; // 30% discount
  } else if (qty >= 50) {
    discountPercent = 20; // 20% discount
  } else if (qty >= 20) {
    discountPercent = 12; // 12% discount
  } else if (qty >= 10) {
    discountPercent = 5;  // 5% discount
  }

  const finalUnitPrice = Math.round(rawUnitPrice * (1 - discountPercent / 100) * 100) / 100;
  const subtotal = Math.round(finalUnitPrice * qty * 100) / 100;

  return {
    unitPrice: finalUnitPrice,
    discountPercent,
    additions: Math.round(additions * 100) / 100,
    subtotal
  };
}
