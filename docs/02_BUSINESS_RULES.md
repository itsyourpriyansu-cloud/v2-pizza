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
5. Pickup order confirmed
6. Pickup KDS visibility begins

The signed provider webhook, not client success UI, is authoritative. `provider_event_id`, applicable `provider_transaction_id` and request idempotency keys are unique. One duplicate or replayed callback must still yield one payment, one order, one first KDS event, one capacity consumption and one downstream loyalty outcome. This payment-first gate applies to Pickup. Dine-in uses the waiter gate and settles one table bill after service.

## Dine-in order and table rules

- A valid opaque table QR resolves server-side to a store/table and joins or opens one active table session. A plain table number is never trusted.
- Customer submission creates `CUSTOMER_SUBMITTED`; it is not kitchen confirmation.
- Waiter confirmation creates operational `CONFIRMED` and one KDS admission without prior payment.
- Clarification preserves the request snapshot; rejection includes a reason; waiter edits require reason, audit and customer acknowledgement where appropriate.
- Every additional round repeats the waiter gate and remains attached to the same open table session and bill.
- Multiple devices/customers may share the table session without sharing private account details.
- One open bill exists per table session. A bill request may be recorded while work remains, but finalization is blocked until waiter-review, preparation, Ready-to-Serve and void work is resolved.
- After `BILL_REQUESTED`, new customer rounds stop unless Waiter/Admin reopens before finalization.
- Only authorized Admin/Counter/Manager policy can finalize, settle, mark paid, close, void or refund. Waiter cannot record payment.
- No split/partial bills, seat-level billing or customer pay-at-table in V1.

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

For Dine-in, waiter confirmation and Served do not finalize economic benefits. `TABLE_BILL_PAID` evaluates eligible served orders idempotently. Each authenticated ordering customer receives credit only for their own eligible spend; guest orders receive none, and the payer does not inherit the table's full loyalty.

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

## Saved Baskets and Occasions
- A Saved Basket stores customer intent, including items, modifier configuration and optional people count; it is never a frozen authoritative cart.
- Every reorder or Occasion plan revalidates current products, variants, modifiers, price, availability and service-mode eligibility before producing a cart.
- Recoverable differences preserve all valid items and explain unavailable products, price changes and changed modifier choices.
- Family Basket is a named Saved Basket use case, not a separate basket engine.
- Household profiles and Occasions are optional progressive-profile data and are never onboarding requirements.
- Avoid-ingredient preferences are convenience signals, not allergy-safety guarantees.

## Referrals and public sharing
- Referral reward qualification requires verified identity plus a qualifying completed/paid first order. Share, click or registration alone never earns a reward.
- Referral and reward transitions must be idempotent in production.
- Taste Cards may contain a selected display name, selected public favourites/preferences and public Passport progress only.
- Public/share payloads exclude phone, email, birthday, Points, order history, Household data and private preferences.

## Avenue League
- Avenue League is optional, seasonal and based on Avenue XP, not direct spend.
- A low-engagement customer is not shown a discouraging rank before opt-in or meaningful participation.
- Leaderboards expose only selected display names or first name plus initial, Top 3 and nearby positions.
- Dine-in Served does not finalize XP or League contribution; authoritative paid table-bill processing may do so idempotently.

## Group Ordering
- One host creates and shares a group, participants contribute food choices and optional poll votes, and the host remains final decision-maker.
- V1 uses one host and one final checkout. Split bills, participant payment and wallet splitting are excluded.
- Participants see display names, contributions and poll choices only; phone, Points, profile, order history and Household data remain private.
- The combined group basket enters the existing cart/quote/checkout flow and is revalidated before payment.

## Notifications
Transactional notifications must not block order success.
Marketing/reward communication follows preferences/consent.

## Future external orders
All provider payloads normalize into internal order schema.
V1 order sources are `PWA_PICKUP`, `TABLE_QR`, `WAITER_ASSISTED` and `COUNTER`. `POS`, `SWIGGY`, `ZOMATO`, `DISTRICT` and `WHATSAPP_ASSISTED` are reserved future values with nullable external identifiers; their integrations are not implemented in V1.

## Transactional events and background work
- A critical domain change and its `outbox_event` are written in one PostgreSQL transaction.
- BullMQ may schedule retryable work, but PostgreSQL remains the source of order, payment, capacity, loyalty and outbox truth.
- Consumers are idempotent. Outbox events progress through `PENDING`, `PROCESSING`, `PROCESSED` or `FAILED`, retain retry/error metadata and can be safely retried.
- Notification, analytics or WhatsApp delivery failure does not roll back a successful order; it becomes visible and retryable.
