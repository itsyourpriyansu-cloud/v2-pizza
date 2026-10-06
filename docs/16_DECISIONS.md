# 16 — Product & Architecture Decisions

## DEC-001 Modular Monolith
One backend, strong module boundaries.
Microservices rejected for V1.

## DEC-002 Pickup-Only
No delivery in V1.

**Superseded in part by DEC-026:** V1 now includes restaurant Dine-in while delivery remains excluded.

## DEC-003 Dual Passwordless Customer Authentication
Customer auth supports normal phone OTP and in-store QR → WhatsApp verified sender → one-time magic link. Both resolve the same user/identity/session model; customers have no password in V1.

## DEC-004 Paid Before Kitchen
Only verified paid order becomes operational.

**Superseded by DEC-026:** this remains true for Pickup only. Dine-in kitchen entry is waiter-confirmed and paid at table-session end.

## DEC-005 Backend Pricing
Server owns authoritative price.

## DEC-006 Loyalty Ledger
Points use transactions.

## DEC-007 Capacity-Aware Pickup
Pickup promise is governed by capacity.

## DEC-008 External Order Readiness
Store source/external IDs now; build integrations later.

## DEC-009 Loyalty Protects Margin
Prefer controlled-cost rewards over heavy cashback.

## DEC-010 Pizza Passport
Strategic retention feature, included in prototype and targeted for V1 if timeline permits.

## DEC-011 Documentation Priority
Business/state docs override UI assumptions.

## DEC-012 Node.js/NestJS Backend
Use Node.js LTS, TypeScript, NestJS and Prisma for the V1 modular monolith instead of the earlier FastAPI/Python proposal. Python is outside the core application and may only be considered later for isolated analytics/AI work.

## DEC-013 Hostinger KVM 2 V1 Hosting
Primary production is one Hostinger KVM 2 server in the India region on Ubuntu 24.04 LTS. It consolidates customer, KDS, Admin, API, worker, PostgreSQL and Redis for one-outlet economics. Verify current specifications and pricing before purchase.

## DEC-014 Docker Compose Deployment
Run Caddy, customer, KDS, Admin, NestJS API, BullMQ worker, PostgreSQL and Redis as Docker Compose services. Only HTTP/HTTPS is internet-facing; database and Redis stay on private Docker networks. Docker portability preserves a later move to E2E, DigitalOcean, AWS or managed data services.

## DEC-015 Caddy Edge
Use Caddy rather than Nginx for V1 automatic HTTPS and simple host routing. Cloudflare provides DNS and optional proxy/security/caching.

## DEC-016 Same-VPS PostgreSQL and Redis
For V1, PostgreSQL and Redis may run on the KVM 2 server. PostgreSQL remains business truth; Redis supports BullMQ, rate limits and short-lived state and must not become the only copy of critical state.

## DEC-017 Mandatory Off-Server Backups
Perform nightly compressed database dumps, encrypt where applicable, copy them to Cloudflare R2, apply retention, monitor success and periodically restore-test in isolation. Provider VPS backups are supplemental.

## DEC-018 Secure Cookie Sessions
Both customer auth paths create a server-revocable `Secure`, `HttpOnly` cookie session with explicit `SameSite`, CSRF, expiry, rotation and logout/revocation policy. Long-lived auth credentials are not stored in localStorage; staff deactivation revokes sessions.

## DEC-019 Verified WhatsApp Identity and Magic Tokens
Only an authenticity-verified WhatsApp webhook sender may establish WHATSAPP identity. QR/message/URL phone data is untrusted. Magic tokens are cryptographically random, stored as hashes, short-lived, single-use and consumed atomically with session creation. `WhatsAppAuthService` is separate from `NotificationService` behind `MessagingProvider`/`WhatsAppProvider`.

## DEC-020 Transactional Outbox
Critical domain writes and their outbox events share one PostgreSQL transaction. Events use `PENDING`, `PROCESSING`, `PROCESSED`, `FAILED`, retry/error metadata and idempotent consumers. Live sockets and analytics are downstream views, never sources of truth.

## DEC-021 BullMQ Worker
Use Redis/BullMQ for retryable provider calls, notifications, asynchronous loyalty/Passport processing, analytics forwarding, reports and cleanup. PostgreSQL retains critical domain/outbox state so queue loss can be recovered.

## DEC-022 Canonical Operational Order States
Payment success is a Payment state, not an Order state. For Pickup, a verified provider event atomically produces order `CONFIRMED`, the first KDS-visible/New state; the path is `CONFIRMED → PREPARING → READY_FOR_PICKUP → PICKED_UP → COMPLETED`. DEC-026 adds the Dine-in mode-specific gate/path. Loyalty and Passport consume mode-appropriate paid/completed events idempotently.

## DEC-023 Integer-Paise Money Contracts
All frontend/backend JSON money contracts represent `amount` as a safe integer count of paise with `currency: 'INR'`. For example, ₹349.00 is `{ "amount": 34900, "currency": "INR" }`. UI formatting may render rupees, but client arithmetic and provisional display values never become authoritative pricing; the backend remains responsible for validation and final totals.

## DEC-024 Domain Routing Freeze
The root `pizzaavenue.<domain>` host serves only the public Landing/Marketing surface. Customer PWA, KDS, Founder/Admin and NestJS API are independently hosted at `app.pizzaavenue.<domain>`, `kds.pizzaavenue.<domain>`, `admin.pizzaavenue.<domain>` and `api.pizzaavenue.<domain>/api/v1`. KDS and Admin routes are root-relative within their own hosts, avoiding redundant `/kds` and `/admin` URL prefixes. This separation keeps marketing/SEO, customer ordering, operations and API security boundaries clear while retaining one VPS/Caddy deployment topology.

## DEC-025 Pizza Avenue Brand Foundation
The official brand palette is Cream `#FDF6E9`, Sand Beige `#EADCC8`, Maroon `#6B1F1F`, Italian Brown `#8C4A2F`, Olive Green `#556B2F`, Sage Green `#A7B58B` and Espresso `#3B2F2A`. Phudu is the display/heading family and Poppins is the body/functional UI family, matching the verified primary Pizza Wave application typography. The unrelated bakery experiment's Lilita One/Outfit pair is not adopted. The visual identity is warm craft, modern neighbourhood pizzeria and confident food-led digital convenience. Landing and application compositions stay separate while sharing foundations and neutral primitives. No logo, mark or legacy Pizza Wave identity may be assumed until an approved Pizza Avenue logo is supplied.

## DEC-026 Dual Service Operations — Waiter-Gated Dine-In and End-of-Session Billing

Pizza Avenue V1 supports `PICKUP` and `DINE_IN` without duplicating the order, kitchen, payment or loyalty systems.

- Pickup remains payment-first: verified payment gates `CONFIRMED` and KDS entry.
- Dine-in starts only from a server-resolved opaque table QR/session. Customer submission creates a waiter request, not a kitchen ticket.
- Waiter confirmation idempotently gates Dine-in `CONFIRMED` and KDS entry without prior payment.
- Multiple accepted rounds belong to one table session and one open bill. Ready means `READY_FOR_PICKUP` or `READY_TO_SERVE` by immutable service mode.
- Only authorized Admin/Counter controls finalize and settle the Dine-in bill. Waiter cannot mark payment paid.
- Payments target either a Pickup `ORDER` or Dine-in `TABLE_BILL` through one infrastructure.
- Dine-in loyalty/Passport/missions finalize only after `TABLE_BILL_PAID`, attributed to each authenticated ordering customer's own eligible served orders; guests receive none and the payer does not inherit table-wide credit.
- Waiter routes live in the existing Admin frontend. No new staff application is introduced.
- Split/partial bills, seat-level ordering, customer pay-at-table, tips, reservations, course firing, advanced floor plans/table merge-split and delivery remain excluded.

## Pending founder decisions
- exact hours
- cancellation cutoff
- refund rules
- payment provider
- earn ratio
- point expiry
- reward catalogue
- passport catalogue
- stacking
- pickup interval
- max pizzas/slot
- manager permissions
- customer/staff session durations and magic-link expiry
- WhatsApp Business number/provider and template owner
- QR placements, prefilled message, incentive and consent wording
- QR first-login reward, if any
- backup retention periods and restore-test cadence
- production domains and Cloudflare proxy policy
- approved Pizza Avenue logo asset and usage rules
- production photography provenance and image pipeline
- Dine-in cancellation/confirmation timeout and table-session expiry policies
- supported table payment methods, service-charge/GST policy and cash reconciliation
- discount/reward/void/refund authority thresholds
- waiter assignment/transfer policy and shared-kitchen capacity calibration
