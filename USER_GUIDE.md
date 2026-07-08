# ShopHub — User Guide

This guide explains how to use the ShopHub ecommerce website as a **customer** or **administrator**.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Browsing & Shopping](#browsing--shopping)
3. [Cart & Checkout](#cart--checkout)
4. [Your Account](#your-account)
5. [Admin Panel](#admin-panel)
6. [Demo Accounts & Coupons](#demo-accounts--coupons)
7. [Tips & Notes](#tips--notes)

---

## Getting Started

### Run the application

From the project root folder:

```bash
npm run install:all   # First time only
npm run dev
```

Open in your browser:

| Service | URL |
|---------|-----|
| **Storefront** | http://localhost:5173 |
| **API** | http://localhost:3001 |

You can browse products, search, and add items to cart **without signing in**. Checkout, wishlist, and account features require login.

---

## Browsing & Shopping

### Home page (`/`)

- **Hero carousel** — promotional banners with quick links
- **Shop by Category** — 5 categories: Electronics, Clothing, Home & Kitchen, Sports & Outdoors, Beauty
- **Featured Products** — hand-picked items
- **New Arrivals** — recently added products

### Product listing (`/products`)

| Feature | How to use |
|---------|------------|
| **Search** | Type in the search bar; results filter automatically (debounced) |
| **Category filter** | Use the sidebar (desktop) or Filters button (mobile) |
| **Price range** | Set min/max price in the filter panel |
| **Rating** | Filter by minimum star rating |
| **In stock only** | Check the checkbox in filters |
| **Sort** | Choose from price, newest, popularity, or rating |
| **View mode** | Toggle grid or list view |
| **Pagination** | Use page numbers at the bottom |

Quick links from the header/footer:
- `/products?featured=true` — Featured only
- `/products?isNew=true` — New arrivals only
- `/products?category=electronics` — Specific category

### Product detail (`/products/:slug`)

- **Image gallery** — click thumbnails to switch images; click the main image to zoom
- **Variants** — select size and/or color where available
- **Quantity** — use +/- buttons
- **Add to Cart** — adds item and shows a toast notification
- **Buy Now** — adds to cart and opens the cart page
- **Wishlist heart** — save item (requires login)
- **Tabs** — Description, Specifications, Reviews

---

## Cart & Checkout

### Shopping cart (`/cart`)

- View all items with images, variants, and prices
- **Update quantity** with +/- buttons
- **Remove** items with the trash icon
- **Promo codes** — enter a code and click Apply

| Code | Discount | Minimum order |
|------|----------|---------------|
| `SAVE10` | $10 off | $50 |
| `WELCOME15` | 15% off | $30 |
| `FLAT20` | $20 off | $100 |

**Price breakdown:**
- Subtotal
- Discount (if coupon applied)
- Shipping — **Free** on orders over **$75**, otherwise $5.99
- Tax — 8%
- **Total**

Cart data is saved in your browser (localStorage) and persists after refresh.

### Checkout (`/checkout`) — login required

Three-step flow:

#### Step 1 — Shipping
Fill in your delivery address. If you have saved addresses, the form pre-fills from your account.

#### Step 2 — Payment (mock)
Choose a payment method:

| Method | Description |
|--------|-------------|
| **Credit / Debit Card** | Enter mock card details (any 16-digit number works) |
| **Cash on Delivery** | Pay when the order arrives |
| **Digital Wallet** | Simulated wallet payment |

> No real charges are made. This is a demo environment.

Optional: check **Simulate payment failure** to test error handling (card payments only).

#### Step 3 — Review
Confirm items, address, payment method, and totals. Click **Place Order**.

### Order confirmation

After a successful order you are redirected to a confirmation page with your **order number**. You can view the order later under **Account → Orders**.

---

## Your Account

Sign in at `/login` or create an account at `/signup`.

### Profile (`/account`)

- Edit your **first name**, **last name**, and **phone**
- Email cannot be changed in this demo

### Orders (`/account/orders`)

- View all your orders with status badges:
  - **Processing** — order received
  - **Shipped** — on the way
  - **Delivered** — completed
  - **Cancelled** — cancelled
- Click an order for full details (items, address, payment, totals)

### Addresses (`/account/addresses`)

- **Add** new shipping addresses
- **Edit** or **delete** existing ones
- Mark one address as **default** (used to pre-fill checkout)

### Wishlist (`/wishlist`)

- View products you saved with the heart icon
- Remove items from the wishlist page or toggle the heart on any product page

### Forgot password (`/forgot-password`)

Enter your email to see a mock reset confirmation. No real email is sent in this demo.

---

## Admin Panel

Access: http://localhost:5173/admin

**Requires admin login.** Only users with the `admin` role can access this area. Non-admins are redirected to the homepage.

Sign in with:

| Email | Password |
|-------|----------|
| `admin@store.com` | `password123` |

An **Admin** link appears in the header when logged in as admin.

### Dashboard (`/admin`)

Overview cards:
- Total revenue (excludes cancelled orders)
- Total orders
- Total products
- Low-stock count (≤ 5 units)

Also shows:
- Orders by status chart
- Low-stock product alerts
- Recent orders table

### Products (`/admin/products`)

| Action | How |
|--------|-----|
| **View all** | Table with name, category, price, stock, flags |
| **Add product** | Click **Add Product** → fill form → **Create Product** |
| **Edit** | Click the pencil icon on any row |
| **Delete** | Click the trash icon → confirm |

Product form fields: name, descriptions, price, discount price, stock, category, image URL, rating, featured/new flags.

Changes are saved to the mock JSON database (`server/src/data/products.json`).

### Orders (`/admin/orders`)

- View all customer orders across all users
- Change order status using the dropdown on each row
- Status updates save immediately

---

## Demo Accounts & Coupons

### Customer accounts

| Email | Password | Notes |
|-------|----------|-------|
| `john@example.com` | `password123` | Has orders & addresses |
| `jane@example.com` | `password123` | Has orders |
| `mike@example.com` | `password123` | No saved addresses |
| `sarah@example.com` | `password123` | Has wishlist items |

### Admin account

| Email | Password |
|-------|----------|
| `admin@store.com` | `password123` |

### Promo codes

| Code | Type | Value | Min order |
|------|------|-------|-----------|
| `SAVE10` | Fixed | $10 | $50 |
| `WELCOME15` | Percentage | 15% | $30 |
| `FLAT20` | Fixed | $20 | $100 |
| `EXPIRED` | — | — | Inactive (test invalid code) |

---

## Tips & Notes

### Keyboard & accessibility

- Press **Tab** to navigate interactive elements
- A **Skip to main content** link appears when tabbing from the top of the page
- All form fields have labels; product images have alt text

### Mobile

- The site is fully responsive
- On mobile, filters open via the **Filters** button on the product listing page
- Account and admin navigation use horizontal scroll tabs on small screens

### Data persistence

| Data | Stored in |
|------|-----------|
| Cart | Browser localStorage |
| Login session | Browser localStorage (JWT token) |
| Products, orders, users | Server JSON files |

Restarting the server does not clear data unless you re-run the seed script.

### What is NOT real in this demo

- Payment processing (Stripe/PayPal not connected)
- Email sending (password reset, order confirmations)
- Real product images (uses placeholder URLs from picsum.photos)

Extension points for production are marked with `// EXTENSION:` comments in the codebase.

---

## Quick Reference — All Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/products` | Public | Product catalog |
| `/products/:slug` | Public | Product detail |
| `/cart` | Public | Shopping cart |
| `/login` | Guest only | Sign in |
| `/signup` | Guest only | Create account |
| `/forgot-password` | Guest only | Password reset (mock) |
| `/checkout` | Login required | Checkout flow |
| `/order-confirmation/:id` | Public | Order success page |
| `/account` | Login required | Profile |
| `/account/orders` | Login required | Order history |
| `/account/orders/:id` | Login required | Order detail |
| `/account/addresses` | Login required | Address book |
| `/wishlist` | Login required | Saved products |
| `/admin` | Admin only | Dashboard |
| `/admin/products` | Admin only | Manage products |
| `/admin/products/new` | Admin only | Add product |
| `/admin/products/:id/edit` | Admin only | Edit product |
| `/admin/orders` | Admin only | Manage orders |

---

*For developer setup, architecture, and extension points, see [README.md](./README.md).*
