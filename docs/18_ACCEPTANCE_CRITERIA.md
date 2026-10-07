# 18 — Acceptance Criteria

## Auth
- OTP request/verify works with cooldown, attempt and per-phone/IP rate limits
- invalid, expired or replayed OTP is rejected without account enumeration
- active QR redirects to official WhatsApp with attributable source/campaign; inactive/unknown QR grants no session
- only authenticity-verified WhatsApp webhook sender resolves identity
- duplicate inbound provider ID creates no duplicate customer or auth outcome
- existing PHONE/WHATSAPP identities can resolve to one user; new verified sender creates one user idempotently
- raw magic token is never stored/logged; stored hash, short expiry and single-use are enforced
- invalid, expired, used or concurrently consumed magic link creates no session and offers safe recovery
- OTP and WhatsApp paths create the same server-revocable session model
- session cookie is `Secure`, `HttpOnly`, uses approved `SameSite`; CSRF and production origin/CORS checks pass
- login/privilege change rotates session; logout, expiry, account/staff revocation invalidate it
- no long-lived auth credential is stored in localStorage

## Menu
- only active/available shown
- variants/modifiers valid
- invalid config blocked

## Builder
- required groups enforced
- min/max enforced
- price deltas clear
- backend validation
- edit works

## Cart
- items persist
- edit/remove
- backend quote
- unavailable conflict handled

## Pickup
- ASAP
- scheduled slots
- full slot unavailable
- backend capacity validation
- reservation expires
- successful order consumes capacity

## Payment
- server creates attempt
- client cannot set price
- signature verified
- duplicates safe
- one order only
- Pickup failure never reaches KDS
- retry works
- database uniqueness covers provider event, provider transaction where available and payment idempotency key
- verified Pickup success atomically records payment, confirms one order, consumes capacity and inserts one outbox event
- payment target is explicitly one `ORDER` or `TABLE_BILL`; a Dine-in retry never creates another bill
- only authorized Admin/Counter can settle Dine-in; Waiter cannot mark paid

## Order
- legal state transitions
- event history
- customer mapping
- Pickup KDS visibility after paid; Dine-in KDS visibility only after waiter confirmation
- payment `SUCCESS` is not treated as an order state; first KDS-visible state is `CONFIRMED`

## KDS
- paid Pickup and waiter-confirmed Dine-in only
- readable modifiers
- pickup target
- valid actions
- live update
- refresh recovers truth
- reconnect/gap fetches API/database truth; socket events cannot permanently diverge state
- unified All/Pickup/Dine-in queue and deterministic mode-aware priority
- Ready for Pickup and Ready to Serve are distinct

## Dine-in Customer
- general entry offers Pickup/Dine-in; a valid table QR bypasses the selector
- only an opaque server-resolved token establishes table context; wrong/expired/revoked flows recover safely
- visible table/status/next action persists across Dine-in screens
- customer submit creates `CUSTOMER_SUBMITTED` and clearly waits for Waiter; it does not enter KDS
- clarification/rejection preserves selections and reason; additional rounds repeat the gate
- customer views bill estimate, calls waiter and requests bill but cannot pay/mark paid

## Waiter
- role-protected Admin-hosted routes show requests, active tables, Ready-to-Serve, service and bill requests
- confirmation is idempotent and enqueues one KDS ticket; rejection/clarification require reason/history
- waiter marks Served but cannot settle payment, apply unrestricted discount/refund or edit loyalty

## Table session and billing
- multiple devices/customers can share one session without private-account leakage
- one open bill aggregates accepted/served rounds with immutable references/snapshots
- bill request disables new customer rounds; pre-finalization reopen is permissioned
- unresolved order/void work blocks finalization
- cash acknowledgement or authoritative digital confirmation marks Paid; close occurs once and releases table

## Counter
- ready search
- verification
- duplicate pickup block
- audit

## Loyalty
- ledger-based
- one credit/order
- duplicate safe
- refund adjustment
- correct derived balance
- Dine-in confirmation/Served alone awards nothing; paid table bill triggers once
- each authenticated order owner receives only their eligible spend; guest receives none and payer receives no automatic table-wide credit

## Rewards
- backend eligibility
- availability
- reservation safety
- failed payment releases

## Passport
- progress once
- milestone unlock
- duplicate-safe

## Reorder
- current menu mapping
- discontinued handling
- current price
- changes visible

## Upsell
- contextual
- explicit
- tracked
- accepted incremental cart value comes from authoritative quote data

## Founder
- live orders
- menu/availability
- protected sensitive actions
- core analytics
- permission-protected QR source management, auth audit and QR/WhatsApp funnel

## Outbox and worker
- critical domain mutation and outbox row commit together
- events support `PENDING`, `PROCESSING`, `PROCESSED`, `FAILED`, retry count, last error and processed timestamp
- stale processing is recoverable and exhausted failures are operator-visible
- replay/retry yields one loyalty, Passport, notification intent and analytics outcome per idempotency rule
- Redis/BullMQ outage does not erase PostgreSQL domain/outbox truth

## Production readiness
- staging
- production separation
- secrets out of repo
- migrations
- backups
- restore procedure
- health checks
- error tracking
- rollback path
- Hostinger KVM 2 India/Ubuntu 24.04 deployment is documented and current pricing/specs are verified before purchase
- Docker Compose includes Caddy, customer, KDS, Admin, API, worker, PostgreSQL and Redis
- only required HTTP/HTTPS ports are public; PostgreSQL/Redis are not internet-exposed
- Caddy HTTPS and customer/API/KDS/Admin host routing pass
- Cloudflare DNS/proxy policy and secret ownership are documented
- nightly compressed/encrypted-as-applicable dump reaches off-server R2 with monitored retention
- isolated restore test succeeds on the recorded cadence
- `/health` and `/health/ready`, structured logs, exception monitoring and redaction are verified

## Customer retention frontend V1
- Rewards presents Points, next reward, usable state labels, reversible reservation and activity
- Passport progress is unique, completion-aware and links unavailable-safe items to current products
- Personal and Common Missions are separated; Avenue XP is explicitly non-redeemable
- Home renders no more than one retention prompt beneath active order/table and reorder priorities
- Profile preferences save through the typed API boundary and retain prior values on failure
- mock menu contains the documented 29 preliminary items across eight categories with aligned cards
- retention routes are lazy-loaded and pass responsive, accessibility, console/network and commerce-regression checks
