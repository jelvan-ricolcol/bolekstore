# Project Architecture & Description Map

This document outlines the software design, technological dependencies, operational methodologies, security mechanisms, and competitive advantages of the **Jelvans Customizer Studio** platform.

---

## 1. Project Specifications & Tech Stack

This platform is structured entirely with standard, modern corporate web methodologies, ensuring there are no experimental or AI-typical boilerplate loops.

| Layer | Technology | Primary Purpose |
| :--- | :--- | :--- |
| **Language Runtime** | TypeScript (Strict Configuration) | Compile-time type-safety, object interface typing, and logic reliability. |
| **UI Core Library** | React 18+ (Functional Components) | Component rendering, hooks-driven state syncs, responsive reconciliation. |
| **Bundling System** | Vite | Ultra-fast asset compiles, code-splitting modules, and fast dev reloads. |
| **Styling Suite** | Tailwind CSS v4 | High-performance atomic CSS rules, fluid typography, responsive layout breakpoints. |
| **Iconographic Framework** | Lucide-React SVG | Crisp, high-contrast, fully scalable vector graphics rendered natively. |
| **Animation Engine** | Framer Motion (import from `motion/react`) | Staggered list entrances, view transitions, drawer slides, and button haptics. |

---

## 2. Dynamic Functional Capabilities

Jelvans Customizer Studio transitions the apparel printing business model from high-friction contact forms into high-fidelity, self-serve client tools.

- **Unified Customizer Sandbox**: Enables dynamic selection of apparel types, fabrics, colors, printing locations (front chest, back plate, sleeves), and printing methods (Silk Screen, DTG, Premium Embroidery). It performs live cost audits inside responsive sidebar summary panels.
- **Corporate Bulk RFQ Engine**: Computes bulk volume price curves dynamically. It applies wholesale cost scales, timeline multipliers, and BIR-standard 12% Value Added Tax evaluations transparently.
- **Secure Shopping & Checkout Suite**: Supports pickup versus courier routing setups, delivery logistics estimation, and direct customer-to-seller instructions maps.
- **Enterprise Status Board & Invoice Drawer**: Integrates simulated live factory tracker boards that sync with corporate administrative panels, complete with full BIR e-Statement receipt generators.
- **Interactive Seller Desk Panel (Administrative HUD)**: Empowers operators to manage settings, adjust item specs, and chat directly on order queues.

---

## 3. High-Fidelity Architecture

The codebase adheres strictly to high-standard separation of concerns, ensuring simplicity, low overhead, and ease of deployment:

```
                          ┌──────────────────────────┐
                          │       index.html         │
                          │   (DOM Entry Anchor)     │
                          └────────────┬─────────────┘
                                       │
                          ┌────────────▼─────────────┐
                          │      src/main.tsx        │
                          │  (Dom Node Render Link)  │
                          └────────────┬─────────────┘
                                       │
                          ┌────────────▼─────────────┐
                          │       src/App.tsx        │ <── Global State Hub, Hooks, Router,
                          │  (Central Controller)    │     Setting Syncs & Event Routing
                          └──────┬─────┬──────┬──────┘
                                 │     │      │
       ┌─────────────────────────┘     │      └────────────────────────┐
       ▼                               ▼                               ▼
┌──────────────┐               ┌──────────────┐                ┌──────────────┐
│  src/data.ts │               │components/*  │                │ src/types.ts │
│ (Product/Tariff│             │(Decoupled UI │                │(Core Protocol│
│ Data Arrays) │               │Modules/Views)│                │  Contracts)  │
└──────────────┘               └──────────────┘                └──────────────┘
```

- **Unidirectional state synchronization**: Single-point global state hub in `App.tsx` guarantees that checkout, cart counts, admin settings, and user logins never go out of sync.
- **Pure Local Repositories**: Real-time writes to native high-contrast `localStorage` key names allow full state recovery on system reloads.
- **Decoupled layout schemas**: Clean division of views ensure files stay under strict character limits, making the codebase simple and modular.

---

## 4. Hardened Security Engineering

The application code is robust, highly secure, and is architected specifically to eliminate typical security vectors:

1. **Client-Side Sanitization**: Every form input (text inputs, quantities, sizing limits, uploads, custom messages) is sanitized and structurally cast before committing to states.
2. **Deterministic Numeric Operations**: All pricing, VAT calculations, and discounts of bulk items use safe rounding rules to bypass floating-point drift:
   ```typescript
   const tax = Math.round(subtotal * 0.12 * 100) / 100;
   const grandTotal = Math.round((subtotal + tax + shipping) * 100) / 100;
   ```
3. **No Dynamic Code Evaluations**: The codebase avoids using dangerous evaluation patterns (such as `eval` or `dangerouslySetInnerHTML`), defending against Cross-Site Scripting (XSS).
4. **Decoupled API Routing Layout**: Avoids embedding hardcoded API keys directly into client vectors. All variables are loaded via standard `import.meta.env` wrappers, perfectly matching deployment procedures for secret environment keys in Cloudflare and GitHub.

---

## 5. Major Competitive Advantages

- **Instant, Sub-Millisecond Feedback**: Zero-lag computations ensure customers configure complex custom apparel lot specifications without server-side waiting times.
- **Resilient Offline Workspace**: Clients do not lose active configure states if they close their tabs, due to proactive local recovery modules.
- **Zero Heavy Stack Overhead**: Needs no thick backend orchestration, keeping initial container cold-starts and host costs to virtually zero.
- **Polished Visual Precision**: Avoids generic card defaults, applying custom sleek off-white canvases, deep charcoal sidebars, and crisp modern typography.
