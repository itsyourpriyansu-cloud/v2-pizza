# 01 — Product Scope

## Customer V1
### Service entry
- choose Pickup or Dine-in when no service context exists
- enter Dine-in only through a server-resolved opaque table QR token
- keep Pickup and Dine-in carts separate when switching context

### Authentication
- browse without login
- normal app entry: phone OTP with resend cooldown and brute-force protection
- in-store entry: placement-attributed QR → WhatsApp → verified inbound webhook → one-time magic link
- both methods resolve one customer identity and create the same secure HttpOnly cookie session
- magic tokens are hashed at rest, short-lived, single-use and never accepted from an unverified phone parameter
- session persistence, rotation, logout and revocation
- no customer password and no long-lived credential in localStorage

### Home
- store state
- current pickup estimate
- Order Again
- favourites
- signature pizzas
- bestsellers
- combos
- rewards progress
- Pizza Passport preview

### Menu
- categories
- search
- availability
- dietary/bestseller filters
- starting price

### Pizza Builder
- size
- crust
- cheese
- toppings
- sauces/add-ons
- required/optional groups
- min/max selection
- variant-specific applicability
- clear price deltas

### Cart
- edit/remove/quantity
- contextual upsells
- rewards/promotion state
- backend re-quote

### Pickup
- ASAP
- scheduled slots
- capacity-aware availability
- pickup instructions

### Payment
- server-created payment attempt
- verified callback
- failure/retry
- Pickup only: no kitchen order before verified success
- Dine-in payment is handled by authorized Admin/Counter at table-session end

### Order tracking
- Confirmed
- Preparing
- Ready for Pickup / Picked Up
- Waiting for Waiter / Ready to Serve / Served for Dine-in

### Dine-in
- submit each round to a waiter for confirmation
- order more within one active table session
- view current table bill estimate, call waiter and request bill
- no customer-side payment in V1

### Retention
- history
- reorder
- favourites
- points
- rewards
- Pizza Passport

## KDS V1
- Pickup after verified payment; Dine-in after waiter confirmation
- order number
- pickup promise
- elapsed time
- modifier detail
- New → Preparing → Ready for Pickup / Ready to Serve
- sold-out controls
- overload/busy indicator

## Counter V1
- ready queue
- search
- code verification
- mark picked up
- duplicate handover protection
- authorized table-bill finalization/payment controls

## Waiter V1
- role-protected routes inside the Admin frontend
- submitted-order review, confirmation, clarification and rejection
- active-table and round visibility
- Ready-to-Serve, service-request and bill-request queues
- mark Served; never settle payment or adjust loyalty directly

## Founder V1
- overview KPIs
- orders
- menu/pricing
- modifier rules
- availability
- pickup capacity
- refunds
- loyalty
- promotions
- staff roles
- audit visibility
- analytics
- QR source/campaign management and acquisition funnel analytics
- auth audit visibility
- messaging template management only if the selected WhatsApp provider requires an approved operational workflow
- live tables, open bills, authorized discount/reward/void controls and table-session payment/close operations

## Explicit Dine-in exclusions
- split or partial bills
- seat-level ordering and customer pay-at-table
- tips, reservations and course firing
- advanced floor plans, complex table merge/split and dynamic seat assignment

## Platform and operations V1
- Node.js/TypeScript/NestJS modular monolith with Prisma and PostgreSQL
- Redis/BullMQ for retryable background jobs; PostgreSQL retains critical state
- transactional outbox and idempotent consumers
- live KDS/customer updates over Socket.IO or native WebSocket with API recovery after reconnect
- Hostinger KVM 2 India deployment using Ubuntu 24.04, Docker Compose and Caddy
- off-server encrypted database backups to Cloudflare R2 with retention and restore testing

## Phase 1.1
- stronger referrals
- advanced bundles
- customer segmentation
- limited drops
- campaign insights
- richer feedback

## Phase 2
- POS
- Swiggy
- Zomato
- District
- unified external-order dashboard
- delivery
- multi-outlet
- advanced inventory
- AI recommendations

Future order sources may include POS, Swiggy, Zomato, District and WhatsApp-assisted ordering. V1 stores source/external identifiers but does not build those adapters.

## Scope freeze
Anything changing money, permission, state, pickup promise, rewards or integration dependency requires an explicit recorded decision.
