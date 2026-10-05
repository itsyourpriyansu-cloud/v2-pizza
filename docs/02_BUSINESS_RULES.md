# 02 — Business Rules

## Store state
OPEN: normal ordering.
BUSY: ordering allowed; ETA/capacity may change.
PAUSED: existing orders continue; new checkout disabled.
CLOSED: browse allowed; checkout disabled.

## Availability
Availability may exist at category, product, variant and modifier level.
Checkout always revalidates.

## Pricing
Backend calculates final:
- base
- variant
- modifiers
- bundle
- promotion
- reward
- tax
- payable total

Frontend prices are provisional.

## Pizza Builder
Each modifier group defines:
- required/optional
- min selection
- max selection
- display order
- applicability

Invalid combinations are rejected server-side.

## Cart
Cart is not an order.
Cart can expire.
Cart does not permanently reserve capacity.
Cart is revalidated before payment.

## Customer identity and sessions
1. Phone OTP and WhatsApp QR magic login resolve to the same `user` and provider-specific `auth_identity`; neither creates a parallel customer account model. When the provider-verified normalized WhatsApp phone matches an existing verified PHONE identity, link the new WHATSAPP identity to that user under a concurrency-safe transaction; conflicting/ambiguous links require protected support review rather than silent account merging.
2. OTPs are short-lived, rate-limited, attempt-limited and never logged. Successful verification creates or resolves the PHONE identity.
3. WhatsApp identity is derived only from the sender supplied by an authenticity-verified WhatsApp webhook. QR text, message text and URL phone parameters are not identity evidence.
4. A valid join intent resolves or creates the customer idempotently, then issues a cryptographically random magic token. Only its hash is stored.
5. Magic tokens have a configurable short expiry, are single-use, and are invalid after `used_at`, expiry, replacement or account/session revocation. Exact duration is a founder/security configuration decision.
6. Consuming a valid token marks it used and creates the session atomically; reused or expired tokens show a recoverable restart-login state without revealing whether an account exists.
7. Both auth methods create an opaque, server-revocable session in a `Secure`, `HttpOnly` cookie. Use an explicit `SameSite` policy, CSRF protection for state-changing requests, rotation after authentication/privilege change, bounded expiry and logout/revocation.
8. Long-lived authentication material must not be stored in localStorage. Staff deactivation revokes staff sessions.

## QR attribution
- Each QR uses an active server-known `qr_source` code tied to store, placement and optional campaign.
- The QR redirect records a non-PII `qr_scanned` event and opens the official WhatsApp deep link with the approved intent/source reference.
- An inactive or unknown source must not authenticate; it falls back to a safe normal-login or campaign-ended experience.
- Attribution is analytics metadata and never authorization or identity proof.

## Pickup
Supports ASAP and scheduled pickup.
Capacity should be measured by pizzas/capacity units, not simple order count.
A full slot cannot accept another order.
Rules and reservations are store-scoped. A reservation moves `HELD` → `CONSUMED` only when the verified payment confirms its order; failure, timeout or cancellation moves it to `RELEASED`/`EXPIRED`. Race-safe database checks prevent overbooking.

## Payment
1. backend creates attempt
2. provider flow starts
3. signed/verified callback received
4. success recorded exactly once
5. order confirmed
6. KDS visibility begins

The signed provider webhook, not client success UI, is authoritative. `provider_event_id`, applicable `provider_transaction_id` and request idempotency keys are unique. One duplicate or replayed callback must still yield one payment, one order, one first KDS event, one capacity consumption and one downstream loyalty outcome.

## Cancellation
Recommended baseline:
- before kitchen acceptance: cancellable
- preparing: restricted/manual approval
- ready: no automatic cancellation
- picked up: support/refund only

Founder must approve final policy.

## Refunds
State-based and auditable.
Never show complete until provider confirms.
Refund requests and provider events are idempotent. A confirmed full or partial refund records the financial state and applies the configured, ledger-based loyalty reversal; a provider outage leaves the refund pending for retry and operator visibility.

## Loyalty
Ledger-based.
Points earn once after `COMPLETED`, which follows verified pickup/handover; they never earn on payment success alone. Refund policy may add a reversing ledger transaction rather than mutating history. If the founder later chooses `PICKED_UP` as the trigger, that change must be recorded consistently before implementation.

## Rewards
Prefer high perceived value, controlled food cost:
- free dip
- beverage
- topping
- garlic bread
- upgrade
- exclusive item

Avoid always-on cashback.

## Pizza Passport
Only qualifying completed orders count.
Progress is server calculated.
Duplicate events cannot double-count.
The qualifying order/product pair is unique so retries cannot advance the same requirement twice.

## Upsells
Must be contextual and explicitly accepted.
Never auto-add.
Evaluate current cart context and current availability. Track `upsell_shown`, `upsell_accepted` and `incremental_cart_value`; analytics must not change price or cart state.

## Promotions
May restrict:
- cart value
- product
- time
- segment
- first order
- usage
- stacking

## Reorder
Historical order is intent only.
Current availability and prices always apply.
Map the historical product, variant and modifiers to the current menu, surface omissions/substitutions and require customer confirmation. Historical snapshot prices are never silently reused.

## Notifications
Transactional notifications must not block order success.
Marketing/reward communication follows preferences/consent.

## Future external orders
All provider payloads normalize into internal order schema.
V1 order sources are `PWA` and `COUNTER`. `POS`, `SWIGGY`, `ZOMATO`, `DISTRICT` and `WHATSAPP_ASSISTED` are reserved future values with nullable external identifiers; their integrations are not implemented in V1.

## Transactional events and background work
- A critical domain change and its `outbox_event` are written in one PostgreSQL transaction.
- BullMQ may schedule retryable work, but PostgreSQL remains the source of order, payment, capacity, loyalty and outbox truth.
- Consumers are idempotent. Outbox events progress through `PENDING`, `PROCESSING`, `PROCESSED` or `FAILED`, retain retry/error metadata and can be safely retried.
- Notification, analytics or WhatsApp delivery failure does not roll back a successful order; it becomes visible and retryable.
