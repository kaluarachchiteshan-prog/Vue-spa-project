# 🛒 FreshMart — Premium Grocery SPA

A modern, fully-featured Single Page Application built with **Vue 3**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Pinia**.  
Data is sourced from the [DummyJSON](https://dummyjson.com) public API.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🛍 Product Browsing | Fetches from `/products/category/groceries` (default) |
| 🔍 Live Search | Real-time search via `/products/search?q=` |
| 📂 Category Filter | All categories loaded from `/products/categories` |
| 🔗 Dynamic Routing | `/product/:id` pages via Vue Router |
| 🛒 Shopping Cart | Pinia store, persists across page reloads via `localStorage` |
| 🔐 Auth Simulation | Login with DummyJSON `/auth/login`, JWT stored in `localStorage` |
| 🌙 Dark Mode | Toggle with `class` strategy, preference persisted |
| ⭐ Star Ratings | Custom half-star SVG component |
| 📱 Responsive | Mobile → Tablet → Desktop grid layouts |

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+**
- npm **9+**

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Credentials

Use these credentials to test the **Sign In** feature:

| Field | Value |
|---|---|
| Username | `freshmart` |
| Password | `FreshMart1@` |

A hint button inside the login modal pre-fills these for you.

---

## 🗂 Project Structure

```
src/
├── assets/
│   └── main.css            # Tailwind base directives
├── components/
│   ├── CartDrawer.vue      # Slide-out shopping cart panel
│   ├── FilterBar.vue       # Horizontal scrollable category filter
│   ├── LoadingSpinner.vue  # Reusable animated spinner
│   ├── LoginModal.vue      # Auth modal with DummyJSON integration
│   ├── NavBar.vue          # Sticky top navigation
│   ├── ProductCard.vue     # Product card with add-to-cart
│   └── StarRating.vue      # SVG star rating component
├── composables/
│   ├── useDarkMode.ts      # Dark mode toggle (singleton)
│   ├── useFilters.ts       # Shared search + category state (singleton)
│   └── useProducts.ts      # Product/category fetching logic
├── router/
│   └── index.ts            # Vue Router route definitions
├── stores/
│   ├── authStore.ts        # Pinia auth store (JWT + localStorage)
│   └── cartStore.ts        # Pinia cart store (localStorage persistence)
├── types/
│   └── index.ts            # All TypeScript interfaces (no `any`)
├── views/
│   ├── HomeView.vue        # Product listing page
│   └── ProductView.vue     # Product detail page
├── App.vue                 # Root component
└── main.ts                 # Application entry point
```

---

## 🛠 Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — Strict mode, zero `any` types
- **Vite** — Lightning-fast dev server and bundler
- **Tailwind CSS** — Utility-first styling with dark mode support
- **Pinia** — Type-safe state management
- **Vue Router 4** — Client-side routing

---

## 📡 API Endpoints Used

| Endpoint | Usage |
|---|---|
| `GET /products/categories` | Load all categories for FilterBar |
| `GET /products/category/:slug` | Load products by category |
| `GET /products/search?q=` | Search products |
| `GET /products/:id` | Single product detail |
| `POST /auth/login` | Authenticate user, receive JWT |
