# 08 — Data Model

The database models business truth, not screens.

## Identity
### users
- id
- status
- created_at

The user is the stable account. Provider identifiers are stored separately so PHONE and WHATSAPP can resolve to the same user.

### auth_identities
- id
- user_id
- provider (`PHONE`, `WHATSAPP`)
- provider_identifier (normalized phone/provider sender identifier)
- verified_at
- created_at

Unique `(provider, provider_identifier)`. Identity resolution is idempotent and never trusts a client-supplied WhatsApp phone.

### customer_profiles
- user_id
- name
- preference metadata

### staff_users
- user_id
- store_id
- active

### sessions
- id
- user_id
- session_token_hash or opaque server-side identifier
- auth_method (`PHONE_OTP`, `WHATSAPP_QR_MAGIC_LINK`, staff method)
- created_at / last_seen_at
- expires_at
- revoked_at
- rotated_from_id nullable

The browser receives only a `Secure`, `HttpOnly` cookie. Raw session secrets are not logged or stored in localStorage.

### magic_login_tokens
- id
- user_id
- token_hash
- source (`WHATSAPP_QR_MAGIC_LINK`)
- qr_source_id nullable
- expires_at
- used_at nullable
- created_at

Only the hash is stored. `used_at` and expiry enforce one-time, short-lived use.

### otp_challenges
- id
- normalized destination / identity reference
- otp_hash
- expires_at
- attempt_count / resend_after
- consumed_at

Raw OTP is never persisted or logged.

### roles / permissions / user_roles / role_permissions
RBAC foundation.

## Store
### stores
- id
- name
- timezone
- state
- pickup_ordering_enabled
- dine_in_ordering_enabled

### store_hours
- weekday
- open
- close

### store_overrides
- date/time range
- state
- reason

### pickup_capacity_rules
- store
- weekday/time window
- interval minutes
- max pizzas / capacity units

### pickup_reservations
- session/cart/order
- slot
- reserved units
- expires_at
- status

Status: `HELD`, `CONSUMED`, `RELEASED`, `EXPIRED`. Capacity availability is calculated; it is not a permanently stored reservation state.

## Menu
### categories
name, display_order, active

### products
category, name, description, image, flags, active

### product_variants
product, name, base_price, active

### modifier_groups
name, required, selection_type (`SINGLE`/`MULTIPLE`), min_select, max_select, display_order

### modifiers
group, name, price_delta, active

### modifier_applicability
product/variant/group/modifier mapping to prevent impossible combinations

### availability_overrides
entity_type, entity_id, unavailable_until, reason

Optional `scope`: `GLOBAL`, `PICKUP`, `DINE_IN`. One catalog remains authoritative.

## Cart
### carts
customer/session, store, status, expiry

### cart_items
product, variant, quantity

### cart_item_modifiers
modifier, quantity

## Orders
### orders
- internal id
- public order number
- customer
- store
- service_mode (`PICKUP`, `DINE_IN`)
- order_source (`PWA_PICKUP`, `TABLE_QR`, `WAITER_ASSISTED`, `COUNTER`; reserved future values: `POS`, `SWIGGY`, `ZOMATO`, `DISTRICT`, `WHATSAPP_ASSISTED`)
- state
- customer nullable for guest Dine-in
- pickup type / promised_ready_at nullable outside Pickup
- table_session_id / table_id / round_number nullable outside Dine-in
- waiter_confirmed_at / served_at nullable
- subtotal
- discount
- tax
- total
- payment status
- external_provider nullable
- external_order_id nullable
- external_store_id nullable

Use a uniqueness constraint across the applicable external provider/order identity. Reserved future source values do not imply V1 integrations.

### order_items
Snapshot:
- product name
- variant
- unit price
- quantity
- line total

### order_item_modifiers
Snapshot name + price delta

### order_events
Append-only state history.

## Payments
### payment_attempts
provider, reference, amount, status, method, payment_target_type (`ORDER`, `TABLE_BILL`), payment_target_id, idempotency_key (unique within operation/provider scope)

### payment_transactions
verified provider transaction; `provider_transaction_id` unique where supplied

### refunds
amount, reason, actor, status

### webhook_events
provider, provider_event_id, event type, authenticity result, payload reference/redacted metadata, processing status, timestamps. Unique `(provider, provider_event_id)` prevents replay effects.

## Pickup
### handover_events
order, staff, verification method, timestamp

## Dine-in

### restaurant_tables
store, display label, operational status, active_session_id nullable. Table labels are display data; trusted context comes from an opaque active QR token.

### table_qr_tokens
hashed/opaque token identity, store, table, active/revoked/expiry metadata. Never trust a plain `table=12` query.

### table_sessions
store, table, status, primary_customer nullable, assigned_waiter nullable, opened/last_activity/bill_requested/finalized/paid/closed/expiry timestamps, optimistic version. Multiple devices/customers may join one session without sharing account data.

Statuses: `OPEN`, `ACTIVE`, `BILL_REQUESTED`, `PAYMENT_PENDING`, `PAID`, `CLOSED`, `EXPIRED`, `CANCELLED`.

### dine_in_bills
One open bill per table session. Status, integer-paise subtotal/tax/service charge/discount/reward/grand total, finalization/payment/close timestamps, optimistic version.

Statuses: `OPEN`, `BILL_REQUESTED`, `FINALIZED`, `PAYMENT_PENDING`, `PAID`, `VOID`.

### dine_in_bill_lines
Reference order/order item plus immutable name, quantity, unit-price, modifier, tax, line-total and void snapshots. This is a settlement projection, not a second unrelated commerce truth.

### service_requests
table session, type (`CALL_WAITER`, `REQUEST_BILL`), status (`OPEN`, `ACKNOWLEDGED`, `RESOLVED`, `CANCELLED`), timestamps. Enforce one active equivalent request to prevent spam.

## Loyalty
### loyalty_accounts
customer, status

### loyalty_transactions
points_delta, type, source, source_id

### rewards
name, threshold/cost, eligibility, active

### reward_redemptions
customer, reward, order, status

### passport_programs
active program

### passport_items
qualifying product

### customer_passport_progress
customer, passport item, qualifying order

## Growth
### promotions
### promotion_rules
### promotion_redemptions
### referral_codes
### referral_events
### upsell_rules

### qr_sources
- id
- code (unique, opaque enough to avoid accidental collisions)
- store_id
- placement_type
- placement_label
- campaign nullable
- active
- created_at

Examples: `SAINIKPURI_COUNTER`, `SAINIKPURI_DOOR`, `SAINIKPURI_BILL`, `SAINIKPURI_BOX`, `SAINIKPURI_TABLE_01`. This is attribution metadata, not proof of identity.

## Messaging
### notification_preferences
transactional, offers, loyalty, WhatsApp opt-in

### notifications
channel, template, related entity, status

### notification_attempts
provider ref, attempt, state

## Platform
### audit_events
actor, action, entity, before/after summary

### integration_events
provider, external id, processing state

### outbox_events
- id
- event_type
- aggregate_type / aggregate_id
- payload / schema_version
- state (`PENDING`, `PROCESSING`, `PROCESSED`, `FAILED`)
- idempotency_key or unique domain-event key
- available_at / processing_started_at
- retry_count / last_error
- processed_at / created_at

The domain update and outbox insert share one PostgreSQL transaction. Consumers record their own deduplication/processed key so BullMQ retries cannot duplicate loyalty, Passport, notification or analytics effects.

### analytics_events
event, user/session/order, properties, timestamp

## Non-negotiable rules
1. No float money.
2. Order line snapshots are immutable.
3. Loyalty is ledger-based.
4. Order changes create events.
5. External IDs are separate.
6. UTC storage, local rendering.
7. Migrations versioned.
8. PII access role-limited.
9. Idempotency reinforced by DB uniqueness.
10. Business-critical deletes are archival/soft where appropriate.
11. Prisma migrations and database constraints enforce identity, provider-event, transaction, outbox-consumer and Passport idempotency.
12. Provider payloads stay in integration boundaries and are redacted/encrypted according to retention policy; core models receive normalized fields only.
13. PostgreSQL is the source of truth. Redis/BullMQ holds short-lived queue/rate-limit state, never the sole copy of critical commerce state.

## Migration requirement

When the real NestJS/Prisma backend is introduced, a reviewed migration must add tables, opaque table-token mapping, table sessions, Dine-in bills/lines, service requests, mode-specific order fields and normalized payment targets. Required constraints include one open session per table, one open bill per session, unique idempotency/domain-event keys and conditional uniqueness for external/payment references. No migration is generated in the frontend-only repository because no backend schema/runtime exists yet.
