# 16 — Product & Architecture Decisions

## DEC-001 Modular Monolith
One backend, strong module boundaries.
Microservices rejected for V1.

## DEC-002 Pickup-Only
No delivery in V1.

## DEC-003 Dual Passwordless Customer Authentication
Customer auth supports normal phone OTP and in-store QR → WhatsApp verified sender → one-time magic link. Both resolve the same user/identity/session model; customers have no password in V1.

## DEC-004 Paid Before Kitchen
Only verified paid order becomes operational.

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
Payment success is a Payment state, not an Order state. A verified provider event atomically produces order `CONFIRMED`, the first KDS-visible/New state. The operational path is `CONFIRMED → PREPARING → READY → PICKED_UP → COMPLETED`; loyalty and Passport normally consume `ORDER_COMPLETED` idempotently.

## DEC-023 Integer-Paise Money Contracts
All frontend/backend JSON money contracts represent `amount` as a safe integer count of paise with `currency: 'INR'`. For example, ₹349.00 is `{ "amount": 34900, "currency": "INR" }`. UI formatting may render rupees, but client arithmetic and provisional display values never become authoritative pricing; the backend remains responsible for validation and final totals.

## DEC-024 Domain Routing Freeze
The root `pizzaavenue.<domain>` host serves only the public Landing/Marketing surface. Customer PWA, KDS, Founder/Admin and NestJS API are independently hosted at `app.pizzaavenue.<domain>`, `kds.pizzaavenue.<domain>`, `admin.pizzaavenue.<domain>` and `api.pizzaavenue.<domain>/api/v1`. KDS and Admin routes are root-relative within their own hosts, avoiding redundant `/kds` and `/admin` URL prefixes. This separation keeps marketing/SEO, customer ordering, operations and API security boundaries clear while retaining one VPS/Caddy deployment topology.

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
