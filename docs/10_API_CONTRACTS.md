# 10 — API Contracts

Production base URL: `https://api.pizzaavenue.<domain>/api/v1`

Frontend applications configure this through the public `VITE_API_BASE_URL` environment variable. Local development uses `http://localhost:3000/api/v1`; MSW continues to intercept the same `/api/v1` path shape. Feature components must not hardcode deployment URLs.

## Browser origin and cookie contract

The future cookie-authenticated API permits only explicit HTTPS origins: `https://pizzaavenue.<domain>`, `https://app.pizzaavenue.<domain>`, `https://kds.pizzaavenue.<domain>` and `https://admin.pizzaavenue.<domain>`, with the corresponding staging hosts configured separately. Credentialed responses never use `Access-Control-Allow-Origin: *`.

The intended production session model is a `Secure`, `HttpOnly`, `SameSite=Lax` cookie scoped to `.pizzaavenue.<domain>` when the finalized backend/domain policy requires cross-subdomain session sharing. Cookies remain inaccessible to JavaScript; state-changing requests retain CSRF protection and strict origin validation.

## Standard error
```json
{
  "error": {
    "code": "PICKUP_SLOT_FULL",
    "message": "This pickup slot is no longer available.",
    "details": {}
  }
}
```

## Auth
### POST /auth/otp/request
Request: phone
Rules: normalized phone, generic response, cooldown + per-phone/per-IP rate limit; no OTP in logs or response

### POST /auth/otp/verify
Request: phone, otp
Response: customer summary; sets rotated `Secure`, `HttpOnly` session cookie

Errors include `OTP_INVALID`, `OTP_EXPIRED`, `OTP_RATE_LIMITED` without account enumeration.

### GET /qr/{code}
Validates active source, records `qr_scanned`, and redirects to the official WhatsApp deep link with approved join/source intent. Unknown/inactive codes safely fall back to normal login/campaign-ended UI. The code grants no identity or session.

### POST /webhooks/whatsapp
Provider-facing endpoint. Verify authenticity before processing; persist/deduplicate provider message ID; extract provider-verified sender; pass normalized inbound intent to `WhatsAppAuthService`. Acknowledge duplicates safely. Client applications never call this endpoint as an authentication shortcut.

### POST /auth/magic/consume
Request: one-time token (prefer request body to reduce URL/log leakage after the landing page removes it from browser history)
Response: customer summary; sets rotated `Secure`, `HttpOnly` session cookie

Rules: the WhatsApp continuation lands on `https://app.pizzaavenue.<domain>/auth/magic?token=...`; the landing page removes the token from browser history before this endpoint is called. Perform hash lookup, constant-time comparison where applicable, short expiry, single use, atomic `used_at` + session creation, and return generic `MAGIC_LINK_INVALID_OR_EXPIRED` on invalid/expired/used tokens.

### POST /auth/logout
Revokes the current server-side session and clears its cookie.

Cookie-authenticated state-changing endpoints require the documented CSRF control and production origin/CORS policy.

## Menu
### GET /stores/{store_id}/menu
Returns categories, products, variants, modifier groups, availability.

### GET /products/{id}
Returns builder contract.

## Cart
### POST /carts
Create/recover.

### POST /carts/{id}/items
Errors:
- INVALID_VARIANT
- INVALID_MODIFIER
- ITEM_UNAVAILABLE
- MAX_SELECTION_EXCEEDED

### PATCH /carts/{id}/items/{item_id}
### DELETE /carts/{id}/items/{item_id}

## Quote
### POST /carts/{id}/quote
Returns authoritative totals, eligibility, version.

Possible errors:
- PRICE_CHANGED
- ITEM_UNAVAILABLE
- PROMOTION_INVALID

## Pickup
### GET /stores/{id}/pickup-options
Returns ASAP + slots.

### POST /pickup/reservations
Returns reservation id + expiry.

Errors:
- SLOT_FULL
- STORE_PAUSED

## Payments
### POST /payments
Requires idempotency key and a typed target: `{ type: "ORDER" | "TABLE_BILL", id }`. Server owns amount and validates the selected approved payment method.

### POST /webhooks/payments/{provider}
Signed/verified, deduplicated.

For Pickup `ORDER`, verified success atomically records payment, confirms one order, consumes capacity and inserts the first order outbox event. For Dine-in `TABLE_BILL`, provider/terminal verification or authorized cash acknowledgement marks the finalized bill paid and starts session-close/downstream processing. Client “success” cannot confirm either outcome.

### POST /payments/{id}/refund
RBAC protected.

## Orders
### GET /orders/{id}
Ownership/RBAC.

### GET /orders/me
Customer history.

### POST /orders/{id}/reorder
Returns current-menu cart mapping.

## Kitchen
### GET /kds/orders
Optional `serviceMode=PICKUP|DINE_IN`; default is the unified queue. The server returns only paid-confirmed Pickup or waiter-confirmed Dine-in orders.
### POST /orders/{id}/preparing
### POST /orders/{id}/ready

The KDS New bucket maps to order `CONFIRMED`; there is no separate KDS acceptance state. `ready` becomes `READY_FOR_PICKUP` or `READY_TO_SERVE` from immutable service mode. State-changing calls use conditional transition/version checks.

## Customer Dine-in
### POST /dine-in/table-context/resolve
Request: opaque token. Response: `VALID|INVALID|EXPIRED|REVOKED` plus server-owned table session only when valid.

### GET /dine-in/session
Returns the current joined session without other customers' private identity data.

### GET /dine-in/session/bill
Returns the current estimate/final bill projection. Customer cannot mark it paid.

### POST /dine-in/orders
Requires idempotency key, table-session precondition and current cart/quote reference. Creates `CUSTOMER_SUBMITTED`, never a KDS ticket.

### GET /dine-in/orders/{id}
### POST /dine-in/orders/{id}/cancel
Cancellation is allowed only before waiter confirmation and when policy permits.

### POST /dine-in/bill-request
Idempotently records the request and disables new customer rounds; active orders may finish but block finalization.

### POST /dine-in/service-requests
Supports `CALL_WAITER` and `REQUEST_BILL`; duplicate active requests are coalesced/rejected safely.

## Waiter
All endpoints require staff authentication, store scope and Waiter permission.

### GET /staff/waiter/order-requests
### GET /staff/waiter/orders/{id}
### POST /staff/waiter/orders/{id}/confirm
Idempotently checks table, availability and current state; records waiter/audit and emits exactly one KDS/outbox event.

### POST /staff/waiter/orders/{id}/reject
### POST /staff/waiter/orders/{id}/clarification
Both require a reason and preserve history.

### GET /staff/waiter/tables
### GET /staff/waiter/tables/{sessionId}
### POST /staff/waiter/orders/{id}/served
### GET /staff/waiter/service-requests
### POST /staff/waiter/service-requests/{id}/acknowledge
### POST /staff/waiter/service-requests/{id}/resolve

Waiter endpoints never expose a mutation that records payment or marks a bill paid.

## Admin/Counter billing
All mutations require explicit billing permissions, optimistic version/precondition checks and audit metadata.

### GET /admin/bills
### GET /admin/bills/{billId}
### POST /admin/bills/{billId}/finalize
Requires idempotency key and no unresolved operational order/void work.

### POST /admin/bills/{billId}/discount
### POST /admin/bills/{billId}/reward
### POST /admin/bills/{billId}/payments
Creates a payment targeted to `TABLE_BILL`; cash requires explicit receipt acknowledgement, digital state stays pending until authoritative confirmation.

### GET /admin/payments/{paymentId}
### POST /admin/table-sessions/{sessionId}/close
### POST /admin/bills/{billId}/void
### POST /admin/payments/{paymentId}/refund

## Counter
### GET /counter/ready-orders
### POST /orders/{id}/pickup

## Loyalty
### GET /me/loyalty
### GET /me/rewards
### POST /rewards/{id}/reserve
### DELETE /reward-reservations/{id}

## Passport
### GET /me/passport

## Admin
CRUD:
- menu
- availability
- pickup capacity
- rewards
- promotions
- staff
- QR sources/campaign attribution
- messaging templates when enabled by provider workflow

### PUT /admin/store-state

## API conventions
- OpenAPI
- request IDs
- idempotency for sensitive POSTs
- pagination
- ISO timestamps
- stable error codes
- provider-specific fields hidden behind adapters
- cookie sessions with explicit CSRF and production CORS/origin enforcement
- Zod/shared runtime validation where it reduces client/server contract drift; NestJS DTO/pipes remain server-authoritative
- health endpoints: `GET /health` (process liveness) and `GET /health/ready` (required dependencies/readiness)
- live event payloads include stable event/order versions; clients refetch API state after reconnect or detected gaps

## Retention frontend/mock boundary
The current Customer prototype calls typed `/api/v1` boundaries for `GET /me/loyalty`, `GET /me/loyalty/activity`, `GET /me/rewards`, `POST /rewards/:rewardId/reserve`, `DELETE /reward-reservations/:id`, `GET /me/passport`, `GET /me/missions`, `POST /missions/:missionId/complete`, `GET /me/profile` and `PATCH /me/profile`. MSW supplies deterministic frontend fixtures only. A future NestJS implementation must enforce ownership, ledger idempotency, qualifying completed-order/paid-bill rules and exactly-once reward/XP/progress effects.

## Engagement frontend/mock boundary
The client-review prototype additionally models:

- Saved Baskets: `GET/POST /me/saved-baskets`, `GET/PATCH/DELETE /me/saved-baskets/:id`, `POST /me/saved-baskets/:id/reorder`, `POST /me/saved-baskets/:id/share`
- Household: `GET/POST /me/household`, `PATCH /me/household/:id`
- Occasions: `GET/POST /me/occasions`, `POST /me/occasions/:id/plan`
- Referrals/Taste Card: `GET /me/referrals`, `POST /me/referrals/share`, prototype lifecycle preview, `GET /me/taste-card`, `POST /me/taste-card/share`
- League: `GET /me/league`, `POST /me/league/opt-in`
- Group Ordering: `POST /group-orders`, `GET /group-orders/:id`, join/item/poll mutations and host-only checkout handoff
- Adaptive Home: `GET /me/engagement-summary`

These are typed frontend/MSW contracts, not implemented production APIs. Future backend work must enforce customer ownership, Household privacy, Saved Basket current-menu validation, referral qualification/idempotency, League season/XP truth, group membership/host authority and checkout idempotency. Share endpoints must return privacy-filtered payloads rather than raw customer/profile aggregates.
