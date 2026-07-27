# 🤖 AGENTS.md — Global Context & Project Rules

## 1. Project Overview & Scope

- **Domain:** Restaurant Web Application (Menu, Order Management, Table Reservations, Admin Dashboard)
- **Primary Goal:** High performance, seamless user experience, fast real-time/cached updates for menu items, orders, and reservations.

---

## 2. Tech Stack Definition

- **Framework:** Next.js (App Router, React Server Components & Cache Components)
- **Styling:** Tailwind CSS v4
- **Database & ORM:** PostgreSQL (Neon Cloud) + Prisma ORM
- **Authentication:** Better Auth
- **State Management:** Zustand
- **Validation:** Zod
- **Timezone:** Europe/Skopje

---

## 3. Framework & Caching Rules (Next.js 16+)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

### Caching Architecture:

- **Cache Components Paradigm:**
  - Use modern framework-level caching with `'use cache'`.
  - Apply `cacheLife()` (e.g., `cacheLife('days')`, `cacheLife('hours')`) and explicit tags with `cacheTag()` (e.g., `cacheTag('menu-items')`, `cacheTag(\`order-${id}\`)`).
  - Use native `updateTag` for revalidation instead of legacy/deprecated methods where applicable.
- **Server Components (RSC):**
  - Default to Server Components for data fetching, menu displays, and static layouts.
  - Use `'use client'` strictly for dynamic UI components (cart drawer, reservation picker, live order notifications).

---

## 4. Styling Rules (Tailwind CSS v4)

- **Zero Config File:** Do NOT create or edit `tailwind.config.js` or `tailwind.config.ts`.
- **Global Theme Directives:** All theme extensions, custom CSS variables, fonts, and custom utilities MUST be configured inside `app/globals.css` using the `@theme` directive.
- **Responsive Layout:** Prioritize mobile-first design, as most restaurant customers access menus and make orders from mobile devices.

---

## 5. Database, ORM & Authentication

- **Prisma & Neon PostgreSQL:**
  - Maintain clean Prisma schemas with explicit relations for `User`, `MenuItem`, `Category`, `Order`, `OrderItem`, and `Reservation`.
  - Handle connection pooling correctly for Neon database instances (distinguish between direct connection strings for migrations and pooled connections for app runtime).
- **Authentication (Better Auth):**
  - Secure all `/admin/*` and kitchen management routes using Better Auth session/role verification.
  - Restrict unauthorized guest access to administrative actions via route-level middleware and server action guards.

---

## 6. State Management & Form Handling

- **Client State (Zustand):**
  - Use Zustand for interactive client state such as cart management, active order filters, or temporary UI state.
  - Persist client cart state safely using middleware (e.g., `persist` to `localStorage`).
- **Data Validation (Zod):**
  - Validate every incoming Server Action payload, form submission, and API request body using Zod schemas.
  - Never trust client-submitted calculations (e.g., compute final order price on the server, not the client).

---

## 7. Restaurant Business Logic & Standards

- **Currency & Pricing:**
  - Standardize price displays using a dedicated utility function (e.g., `formatPrice(amount)`).
  - Compute total amounts, discounts, and taxes strictly on the server side.
- **Timezones & Dates:**
  - Always handle dates and reservation time slots explicitly considering the `Europe/Skopje` timezone to prevent UTC displacement errors on table bookings.
- **Real-time Order Status:**
  - Orders must support clear lifecycle states: `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `DELIVERED` / `CANCELLED`.
