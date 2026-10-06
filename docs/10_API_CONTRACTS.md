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
Requires idempotency key.
Server owns amount.

### POST /webhooks/payments/{provider}
Signed/verified, deduplicated.

On verified success, one transaction records payment success, confirms one order, consumes capacity and inserts the first order outbox event. Client “success” cannot confirm an operational order.

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
### POST /orders/{id}/preparing
### POST /orders/{id}/ready

The KDS New bucket maps to order `CONFIRMED`; there is no separate acceptance state. State-changing calls use conditional transition/version checks.

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
