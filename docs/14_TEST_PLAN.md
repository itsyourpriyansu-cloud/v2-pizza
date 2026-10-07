# 14 — Test Plan

## Layers
1. unit
2. domain
3. API integration
4. component
5. end-to-end
6. UAT
7. store dry-run

## Critical E2E
### Normal OTP authentication
Request → cooldown/rate limit → verify → same customer identity → secure cookie session → logout/revoke. Invalid/expired/replayed OTP and enumeration attempts create no session.

### QR and WhatsApp magic authentication
Placement QR → redirect to official WhatsApp deep link → authentic inbound webhook → verified sender resolution → hashed one-time token → outbound reply → consume → secure cookie session. Assert source/campaign attribution and the same customer model as OTP.

Test invalid QR, inactive QR, invalid webhook signature, duplicate provider message, existing identity match, new user creation, short token expiry, token reuse, concurrent token consume, safe error copy, session rotation and no raw secret in logs/analytics. Simulate WhatsApp provider outage and confirm retry visibility without insecure fallback.

### Happy path
Browse → build → cart → pickup → pay → KDS → ready → pickup → loyalty.

### Dine-in happy path
Opaque table QR → table confirmation → guest/authenticated browse → customer submit → no KDS yet → waiter confirms once → unified KDS → Ready to Serve → Served → second round → bill request → Admin finalizes/settles → session closes → loyalty finalizes by authenticated order owner.

### Duplicate payment callback
Expect one payment, one order, one KDS ticket/event, one capacity consumption, one loyalty credit and one Passport outcome.

### Failed payment
Pickup: no KDS, cart survives, retry possible. Dine-in: same finalized bill remains unpaid/retryable and the session stays open; never create another bill.

### Mode-specific KDS gates
- unpaid Pickup is absent; verified-paid Pickup appears once
- customer-submitted Dine-in is absent; waiter-confirmed Dine-in appears once
- unified queue/filter and priority preserve Pickup promises and Dine-in elapsed service time
- ready diverges to `READY_FOR_PICKUP` and `READY_TO_SERVE`

### Dine-in roles and billing
- wrong/invalid/revoked/expired QR cannot establish table context
- cancellation/clarification/rejection preserves correct snapshots and audit intent
- bill request may coexist with active work, but finalization is blocked until resolved
- Waiter cannot settle payment; Admin/Counter permission is enforced server-side
- cash receipt, digital pending/failure/retry, duplicate callback/finalization/close are idempotent
- two authenticated customers earn on their own eligible served orders only after bill paid; guest/payer rules hold

### Full slot
Reject selected slot and offer alternatives.

### Sold out
Block affected item, preserve rest of cart.

### Reorder outdated item
Map what is valid, explain changes, use current price.

### Reward reservation
Failure must release.

### Duplicate handover
Block and audit.

## RBAC
Kitchen cannot price/refund.
Counter cannot loyalty edit.
Customer cannot access another order.
Manager permissions policy-driven.

## Security
- OTP brute-force
- expired OTP
- revoked session
- invalid webhook signature
- replayed webhook
- price tampering
- illegal state transition
- cookie `Secure`/`HttpOnly`/`SameSite` behavior
- CSRF rejection on state-changing cookie-auth requests
- production CORS/origin restrictions
- magic-token hashing and absence from logs
- WhatsApp verified sender cannot be replaced by message/URL input
- dependency/secret scanning

## UX tests
- 5-second comprehension
- customise task
- reorder task
- pickup understanding
- reward understanding
- failure recovery

Observe time, errors, hesitation, backtracking.

## Store dry-run
Simulate 20–30 orders, rush, sold-out, delayed payment, pickup queue, staff role changes, QR placements and WhatsApp reply delay.

## Reliability and deployment
- kill/restart worker between domain commit and processing; outbox event remains recoverable
- retry a failed consumer; idempotency prevents duplicate loyalty/Passport/notification effects
- reclaim stale `PROCESSING`; exhausted failures appear in operator/dead-letter workflow
- disconnect/reconnect KDS socket; API refresh recovers authoritative state without missing/duplicating tickets
- verify PostgreSQL/Redis have no public host ports and only HTTP/HTTPS is internet-facing
- perform encrypted off-server dump, retention expiry and documented restore into an isolated environment
- test `/health`, `/health/ready`, migration/rollback and production log redaction

## Go-live blockers
- duplicate orders
- wrong price
- unauthorized refund
- unpaid Pickup KDS order or unconfirmed Dine-in KDS order
- overbooked pickup
- corrupted rewards
- paid but missing order
- unrecoverable KDS
- unverified WhatsApp sender authentication
- reusable/leaked magic token
- outbox event loss or non-idempotent worker effect
- no successful off-server restore test
- duplicate/incorrect table bill, unauthorized payment settlement or loyalty credited before Dine-in bill payment
