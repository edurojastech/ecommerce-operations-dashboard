# E-commerce Operations Dashboard

A small internal-tool-style dashboard that turns a public API's data into operational metrics for an e-commerce team.

## Objective

This project was built as a technical challenge. The goal is not a visually elaborate product, but a demonstration of how raw API data can be transformed into **operational, measurable information** — the kind of read-only tool an operations team would open every morning to check order volume and completion health.

It focuses on:

- fetching and mapping external data into a domain model (`Order`);
- deriving business metrics from that data reactively (never hardcoded);
- structuring state, data-fetching and presentation as separate, well-typed layers;
- handling every real UI state (loading, error, empty, success) explicitly.

## Tech Stack

- **Nuxt 3** — application framework, file-based routing, auto-imports, build tooling.
- **Vue 3** (`<script setup>`, Composition API) — component logic and reactivity.
- **TypeScript** — explicit types across composables, store and components; no `any`.
- **Pinia** — single source of truth for order state (`orders`, `loading`, `error`).
- **SCSS** — small, hand-written stylesheet (global tokens + scoped component styles). No UI framework.
- **`$fetch`** (Nuxt's built-in fetch, powered by `ofetch`) — the only HTTP client used.

## Data Source

Orders are simulated using the public [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) `/todos` endpoint. No backend was created and the API itself is never modified — only interpreted.

Each `todo` is mapped to an `Order`:

| JSONPlaceholder field | Meaning in this dashboard |
| ---------------------- | -------------------------- |
| `id`                    | Order ID                   |
| `userId`                | Customer ID                |
| `title`                 | Product / order description |
| `completed`             | Order status (`Completed` / `Pending`) |

This mapping lives in one place: `types/order.ts` defines the shape, `utils/status.ts` turns `completed` into a display status/label.

## Metrics

All metrics are derived — nothing is hardcoded. They live in `composables/useOrderMetrics.ts`, implemented with Vue's `computed`, and recalculate automatically whenever the store's `orders` array changes (initial load or refresh):

- **Total Orders** — `orders.length`
- **Completed Orders** — count of orders where `completed === true`
- **Pending Orders** — `total - completed`
- **Completion Rate** — `(completed / total) * 100`, guarded against division by zero when there are no orders

## Architecture

```text
composables/
  useOrders.ts         # data-fetching layer: talks to the API via $fetch, returns Order[]
  useOrderMetrics.ts    # derives Total/Completed/Pending/Completion Rate via computed()

stores/
  orders.ts             # Pinia store: single source of truth for orders/loading/error,
                         # exposes fetchOrders()/refreshOrders()

types/
  order.ts              # Order, OrderStatus, OrderMetrics — the only shapes in the app

utils/
  status.ts             # completed -> 'completed' | 'pending' + display label

components/dashboard/
  DashboardHeader.vue    # title, subtitle, Refresh data button (emits "refresh")
  MetricCard.vue         # presentational metric tile (label + value)
  OrdersTable.vue        # orders table with status badges, scrolls horizontally on mobile

pages/
  index.vue              # the only page: wires store + composable to the components,
                          # owns the loading/error/empty/success branching
```

**Responsibility split** (how a reviewer can trace the app):

1. **How data is fetched** — `composables/useOrders.ts`. A thin wrapper around `$fetch` against JSONPlaceholder. It knows nothing about Pinia or the UI.
2. **Where state is stored** — `stores/orders.ts`. The Pinia store owns `orders`, `loading`, `error` and the two actions (`fetchOrders`, `refreshOrders`, the latter simply delegating to the former). Components never keep their own copy of this state.
3. **How metrics are calculated** — `composables/useOrderMetrics.ts`. Takes a reactive `orders` reference and returns `computed` metrics, kept separate from the store so the calculation can be reasoned about independently of fetching/storage.
4. **How components receive data** — `pages/index.vue` reads the store and the metrics composable, then passes plain props down to `DashboardHeader`, `MetricCard` and `OrdersTable`. Components are presentational and receive everything via props/emits — no component reaches into the store directly.
5. **How errors are handled** — `orders.ts` catches fetch failures and sets a user-friendly `error` message; `pages/index.vue` renders an error panel with a **Try again** button that re-invokes `store.fetchOrders()`. Loading and empty states are handled the same way, as explicit branches in the page template (no spinner libraries, no skeleton UI beyond a simple text state).

## Running Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview   # serves the production build locally for a final check
```

## Deploying to Vercel

The project uses Nuxt's default Nitro `node-server` preset, which Vercel auto-detects for Nuxt projects — no extra configuration or `vercel.json` is required.

1. Push the repository to GitHub (or another Git provider connected to Vercel).
2. In Vercel, **Add New Project** and import the repository.
3. Framework preset: **Nuxt.js** (auto-detected). Build command `npm run build`, output handled automatically by Nitro.
4. Deploy. No environment variables are required — the app calls JSONPlaceholder directly from the client.

No custom domain is configured as part of this challenge.

## Production Improvements

This dashboard intentionally does the minimum needed to demonstrate the underlying reasoning. For a real DTC (direct-to-consumer) e-commerce operation, the natural next steps would be:

- **Revenue & Average Order Value** — requires real order line items with prices; would extend `Order` with monetary fields and add corresponding metric cards.
- **Conversion Rate** — needs session/visit data from an analytics source, not just order records.
- **Date filtering** — filter orders/metrics by a date range, once orders carry real timestamps (JSONPlaceholder's `/todos` has none).
- **Customer segmentation** — group/filter by customer cohorts, order frequency, or LTV.
- **Real-time order tracking** — replace polling/manual refresh with WebSockets or SSE for live updates.
- **Analytics** — trend charts over time (orders/day, completion rate over time), likely backed by a proper metrics/warehouse layer rather than a single REST call.
- **Authentication** — real login (e.g. OAuth or a session-based provider) instead of an open dashboard.
- **Role-based access** — restrict who can view financial vs. operational data.
- **Monitoring** — track API latency/error rates for the orders source itself.
- **Automated alerts** — notify the ops team when completion rate drops below a threshold or pending orders spike.
- **Integration with real e-commerce platforms** — replace JSONPlaceholder with a real orders API (Shopify, custom backend, etc.), including pagination, auth, and rate limiting instead of fetching everything in one call.

None of the above is implemented here — they are documented as the natural evolution path, not built, to keep this challenge's scope small and focused.
