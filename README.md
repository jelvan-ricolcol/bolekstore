# Jelvans Customizer Studio — Digital Apparel Configurator & Order Hub

An enterprise-grade, client-facing interactive web application designed for custom corporate apparel configuration, real-time volume pricing calculations, tax-compliant invoice generation, and seamless seller order management.

Designed and engineered with a modern, high-contrast, Swiss-inspired aesthetic, the system provides zero-latency client sandboxes, responsive vector graphics previews, and comprehensive operator dashboards.

---

## 1. System & Codebase Architecture

The platform is designed as an optimized Single Page Application (SPA) utilizing a modern component-driven system architecture. All components and business logic are strictly modularized and typed to guarantee maximum scalability and type-safety.

```
                      ┌────────────────────────────────────────┐
                      │             index.html                 │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │            src/main.tsx                │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │             src/App.tsx                │
                      │       (Central State & Routing)        │
                      └────┬─────────────┬──────────────┬──────┘
                           │             │              │
        ┌──────────────────┴──┐   ┌──────┴──────────┐   ┴─────────────────────┐
        ▼                     ▼   ▼                 ▼   ▼                     ▼
  ┌───────────┐         ┌───────────┐         ┌───────────┐         ┌───────────┐
  │  Header   │         │  Catalog  │         │Cart / Cost│         │SellerDesk │
  │ & Currs   │         │ Sandbox   │         │ Calc View │         │  Control  │
  └───────────┘         └───────────┘         └───────────┘         └───────────┘
```

### Core Architecture Components:

*   **Global State Orchestrator (`src/App.tsx`)**: Manages real-time application states, including selected active catalog filters, shopping cart items, verified bulk quotation requests, orders tracking databases, currency rates, and the active session mode (Customer Sandbox vs. Operator Desk).
*   **Static Data Layer (`src/data.ts`)**: Defines base material weights (GSM classes), catalog products, print method metrics, corporate branch directories, and localized billing details.
*   **Modular Component Views (`src/components/`)**:
    *   `Header.tsx` / `Footer.tsx`: Unified header-footer brand frames featuring instant multi-currency converters (PHP, USD, EUR, SGD), branch networks, and authentication drawers.
    *   `Customizer.tsx`: Interactive garment canvas enabling custom vector placements, fabric colors, and real-time live mockup generations.
    *   `CartView.tsx`: Client checkout hub calculating shipping carriers, delivery speeds, tax rates, and full visual mockup popups.
    *   `QuoteBuilder.tsx`: Dynamic bulk RFQ estimator processing tiered wholesale pricing, size distribution maps, and instant invoice simulations.
    *   `OrdersTracker.tsx`: Secure client dashboard listing historical orders with built-in instant BIR tax invoice generators.
    *   `SellerDesk.tsx`: Production command center empowering sellers to fulfill order statuses, adjust base prices, customize branch fields, and discuss adjustments.

---

## 2. Frontend & UI Design System

The application uses an objective, high-contrast visual design system. Every visual detail reinforces the user's intent.

### Visual Foundations:
*   **Typography**: Leverages **Inter** for standard, highly readable interface elements, paired with **Space Grotesk** display headings and **JetBrains Mono** for pricing metrics, currency tallies, and serial numbers.
*   **Color Palette**: Styled with clean slate/zinc backdrops, structured off-white container panels, and vivid corporate crimson accents to focus interactions.
*   **Iconography**: Powered by **Lucide React** for uniform vector-based interface navigation.
*   **Animations**: Employs **Framer Motion** for state-driven transitions, slide-over admin panels, and spring-loaded full-screen garment visualization popups.
*   **Interactive Garment Mockups**: Built with highly responsive SVG vectors mapped to CSS properties. Changing fabric colors or print placements triggers instant SVG coordinate shifts and custom mockup image overlays.

---

## 3. Data Flow & Persistence Architecture

The software is engineered with a decoupled data flow to facilitate transitions from serverless local states to persistent cloud-hosted environments:

*   **Local-First Persistence**: Leverages fully-typed, structured local databases backed by browser `localStorage`. System configurations, custom products, shopping carts, and past messages persist through browser reloads.
*   **Pure Offline Reliability**: All mathematical quotation algorithms, tax simulations, and currency conversions occur directly on the client thread with microsecond responsiveness.
*   **Transitioning to Real APIs**: The backend data layer is strictly abstract. Local database queries are structured around standard async models. Replacing local storage with Cloud Run endpoints or Cloudflare Workers is as simple as updating helper models without modifying UI layouts.

---

## 4. Professional Deployment Guide

The platform compiles into highly optimized static assets, making it exceptionally fast to host on edge content delivery networks (CDNs).

### A. How to Download the Source Code
1. Open the settings menu in the application preview interface.
2. Select **Export to ZIP** to download the complete, self-contained, offline-compilable source code directory.

### B. Uploading to a GitHub Repository
1. Initialize Git in your unzipped source directory:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Jelvans Customizer Studio"
   ```
2. Create a new repository on your personal or corporate [GitHub account](https://github.com).
3. Associate your local directory with GitHub and push to the master branch:
   ```bash
   git remote add origin https://github.com/your-username/jelvans-customizer-studio.git
   git branch -M main
   git push -u origin main
   ```

### C. Deploying to Cloudflare Pages (Frontend SPA)
Cloudflare Pages hosts global Single Page Applications on its edge network with extreme low latency and automatic SSL generation.

1. Navigate to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** > **Pages** > **Connect to Git**.
2. Authenticate your GitHub account and select your `jelvans-customizer-studio` repository.
3. Configure the **Build Settings**:
   *   **Framework Preset**: Select `Vite` (or `None`).
   *   **Build Command**: `npm run build`
   *   **Build Output Directory**: `dist`
4. Under **Environment Variables**, define any production keys (e.g., `GEMINI_API_KEY`) if using server-side configurations.
5. Click **Save and Deploy**. Cloudflare will build and deploy the app to a custom sub-domain in less than 60 seconds.

#### SPA Path Resolution Rule:
Because Single Page Applications handle page routing on the client, visiting direct paths like `/tracker` directly from the URL bar will trigger a Cloudflare 404 error. To prevent this, create a file named `_redirects` inside the `/public/` directory with the following content:
```text
/*    /index.html   200
```
This forces the Cloudflare proxy server to direct all sub-paths back to the primary HTML entry point, where React Router can load the appropriate views natively.

### D. Extending with Cloudflare Workers & D1 Database (Backend API)
To scale this into a full-stack corporate setup with real edge databases:

1. Create a `schema.sql` defining your tables:
   ```sql
   CREATE TABLE IF NOT EXISTS orders (
     id TEXT PRIMARY KEY,
     date TEXT,
     customer_name TEXT,
     customer_email TEXT,
     total REAL,
     status TEXT
   );
   ```
2. Provision a Cloudflare D1 SQL database:
   ```bash
   npx wrangler d1 create jelvans-db
   ```
3. Initialize the SQL database schema:
   ```bash
   npx wrangler d1 execute jelvans-db --file=./schema.sql
   ```
4. Define a custom Cloudflare Pages Worker inside `/functions/api/orders.ts` to query the D1 edge database directly from edge routers:
   ```typescript
   interface Env {
     DB: D1Database;
   }

   export const onRequestPost: PagesFunction<Env> = async (context) => {
     const { request, env } = context;
     const body = await request.json();
     
     await env.DB.prepare(
       "INSERT INTO orders (id, date, customer_name, customer_email, total, status) VALUES (?, ?, ?, ?, ?, ?)"
     )
     .bind(body.id, body.date, body.customerName, body.customerEmail, body.total, 'Received')
     .run();

     return new Response(JSON.stringify({ success: true }));
   };
   ```

---

## 5. Security & Privacy Safeguards

The architecture adheres strictly to client privacy regulations and state-level business calculations:

*   **Payment Security Shielding**: Credit card credentials and digital wallets are never stored. The payment triggers route entirely through validated mock protocols, keeping mock transactions safe.
*   **User Identity Protection**: Customer files, vector artwork, phone numbers, and delivery physical addresses are processed within local client contexts.
*   **National Tax Calculations (SST/VAT)**: Taxes are compiled in strict adherence to localized e-Invoicing guidelines, applying clean 12% Value Added Tax structures to invoice calculations.

---

## 6. Project Layout Map

```
├── .env.example          # Environment variables example template
├── .gitignore            # Files excluded from git
├── index.html            # Main SPA DOM viewport
├── LICENSE.md            # Software License Details (MIT)
├── metadata.json         # Platform application metadata and capabilities
├── package.json          # Dependency tree & build runtime scripts
├── tsconfig.json         # TypeScript rules configurations
├── vite.config.ts        # Vite compiler rules & proxy environments
├── src/
│   ├── main.tsx          # Initial runtime bootstrapping script
│   ├── index.css         # Global Tailwind directives & theme configuration
│   ├── types.ts          # Strictly typed system data interfaces
│   ├── data.ts           # Preloaded catalog metadata & pricing rules
│   ├── App.tsx           # Global state engine, routing, and layout controller
│   └── components/       # Component Library
│       ├── Header.tsx    # Branded navigation & session controller
│       ├── Footer.tsx    # Operating guidelines & branch networks
│       ├── HeroBanner.tsx# Client engagement display
│       ├── ProductCard.tsx# Interactive catalog list cells
│       ├── Customizer.tsx# Visual garment color & design engine
│       ├── CartView.tsx  # Dynamic checkout, shipping, & print preview modal
│       ├── QuoteBuilder.tsx# Advanced wholesale cost breakdown and RFQ form
│       ├── OrdersTracker.tsx# Customer tracking terminal with tax PDF generator
│       └── SellerDesk.tsx# Administrator control deck with live settings
```
