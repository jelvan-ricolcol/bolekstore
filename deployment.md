# Cloudflare Deployment Guide

This document contains step-by-step technical instructions for compiling, previewing, and deploying the **Jelvans Customizer Studio** application to the Cloudflare platform suite (specifically **Cloudflare Pages**, **Workers**, and **D1 DB**).

This application is built with a decoupled, modular design using **Vite**, **React**, and **Tailwind CSS**, making it perfectly optimized for Cloudflare's global edge network.

---

## Architecture Blueprint

```
                     ┌────────────────────────┐
                     │   Cloudflare Pages     │ <── Host for compiled static front-end
                     │   (React SPA App)      │     (Optimized gzip/brotli delivery)
                     └────────────────────────┘
                                 │
                        HTTPS API Call (LBC/J&T/Payment Gateways)
                                 ▼
                     ┌────────────────────────┐
                     │   Cloudflare Workers   │ <── Serverless API Edge Gateway
                     │    (Microservices)     │
                     └────────────────────────┘
                                 │
             Fast SQL Reads      ▼
              & Writes   ┌────────────────────────┐
                         │      Cloudflare D1     │ <── Edge Relational SQL Database
                         │       (SQLite-based)   │
                         └────────────────────────┘
```

---

## 1. Quick Deploy: Cloudflare Pages (Frontend SPA)

Since this is a Vite-based single-page application (SPA), the simplest and fastest way to go live is using **Cloudflare Pages** which is free, includes unlimited bandwidth, automatically handles DDoS protection, and deploys directly from GitHub.

### Option A: Deploy with GitHub Auto-Sync (Recommended)
1. **Push your code to a GitHub repository** (public or private).
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Pages** > **Create a project** > **Connect to Git**.
3. Select your GitHub repository.
4. Set the following **Build Settings**:
   - **Framework Preset**: `Vite` (or select `None` and override)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Environment variables (advanced)**, define any required client parameters prefixed with `VITE_` (e.g. `VITE_GEO_KEY` or `VITE_PAYMONGO_PUBLIC_KEY`).
6. Click **Save and Deploy**. Cloudflare will compile and distribute your app globally in under 60 seconds!

### Option B: Deploy manually via Wrangler CLI
If you prefer deploying directly from your local console without connecting to Git:
1. Install Wrangler globally:
   ```bash
   npm install -g wrangler
   ```
2. Log in to your Cloudflare account:
   ```bash
   wrangler login
   ```
3. Compile your production bundle locally:
   ```bash
   npm run build
   ```
4. Deploy the `dist` directory to Cloudflare Pages:
   ```bash
   wrangler pages deploy dist --project-name=jelvans-applet
   ```

---

## 2. Advanced Full-Stack Architecture (Workers + D1 SQLite)

To transition from client-side state (`localStorage`) to permanent cloud databases using Cloudflare's serverless edge technologies, leverage **Cloudflare Worker Core** and **D1 Database**.

### Step 1: Microservice Endpoint Setup
Create a subfolder `./functions` at the root of the project. Cloudflare Pages uses this folder to automatically compile edge microservices (Pages Functions):

Create `functions/api/orders.ts` to host edge server operations:
```typescript
interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body: any = await request.json();

    // Insert order metadata into D1 Edge database
    const { success } = await env.DB.prepare(
      "INSERT INTO orders (id, date, customer_name, customer_email, total, status) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(body.id, body.date, body.customerDetails.name, body.customerDetails.email, body.total, 'Received')
    .run();

    if (!success) {
      return new Response(JSON.stringify({ error: "Failed to save order" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Order processed successfully", id: body.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 505 });
  }
};
```

---

### Step 2: Provision Cloudflare D1 Relational DB
1. Run Wrangler to create your SQL database in Cloudflare's global edge network:
   ```bash
   wrangler d1 create jelvans-db
   ```
2. Copy the output configuration into a local `wrangler.toml` file:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "jelvans-db"
   database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
   ```
3. Initialize the SQL schema (orders, items products, settings). Create a `schema.sql` file and execute:
   ```bash
   wrangler d1 execute jelvans-db --file=./schema.sql
   ```

---

## 3. Custom Domain Configuration & SEO SSL
Cloudflare Pages provides automated wildcard `*.pages.dev` URLs. To configure custom branded landing endpoints:
1. Navigate to **Workers & Pages** > **Pages** > **[Your Project]** > **Custom Domains**.
2. Click **Set up a custom domain**.
3. Input your purchased domain (e.g., `jelvansclothing.ph` or `customs.jelvans.ph`).
4. Click **Continue**. Cloudflare will automatically provision a global SSL/TLS certificate, handle reverse proxies, update your DNS zones, and configure server fallback routing securely.

---

## 4. SPA Fallback (Routing Config)

Because React uses client-side routing, visiting sub-paths (e.g. `/tracker` or `/quote`) directly will trigger a server 404. 

We resolve this by adding a headers/redirect map for Cloudflare. Create a `_redirects` file in the `public/` directory (which copies to `dist/` on build) containing the following rewrite instruction:
```text
/*    /index.html   200
```
This forces Cloudflare's edge proxy to route all arbitrary paths to index.html, allowing React router to handle nested SPA navigation flows natively!
