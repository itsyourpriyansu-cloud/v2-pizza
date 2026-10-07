# 13 — Seed Data

Seed data should make prototype and QA realistic.

## Store
The Pizza Avenue
Sainikpuri, Hyderabad
State: OPEN

Exact hours to be founder-confirmed.

## Customers
### Arjun Rao
Returning
5 orders
840 points
Favourite: Diavola
Thin crust
Passport 4/6

### Aisha Khan
New
0 orders
0 points
New QR customer whose verified WhatsApp sender will create the WHATSAPP identity.

### Rahul Mehta
Returning
2 orders
260 points
Favourite: Margherita
Has PHONE and WHATSAPP identities linked to one user; WhatsApp flow must not create a duplicate customer.

### Neha Reddy
High-AOV
7 orders
1420 points
Passport completed

## Example pizzas
Margherita — ₹349 example
Diavola — ₹449
Funghi — ₹429
Quattro Formaggi — ₹499
Avenue Signature — ₹549

Actual menu/prices must replace these.

## Modifier groups
Size: required single
Crust: required single
Cheese: optional
Toppings: optional controlled max
Dips: optional

## Sides
Garlic Bread
Loaded Garlic Bread

## Drinks
Coke
Sprite

## Dessert
Tiramisu example

## Upsell rules
1. Pizza + no drink → drink.
2. 2 pizzas + no side → garlic bread.
3. cart > threshold + no dessert → dessert.
4. near loyalty milestone → progress reminder.

## Orders
PA-1001 CONFIRMED
PA-1002 PREPARING
PA-1003 READY_FOR_PICKUP
PA-1004 PAYMENT_FAILED
PA-1005 COMPLETED

PA-2001 DINE_IN / TABLE 12 / ROUND 1 / CUSTOMER_SUBMITTED
PA-2002 DINE_IN / TABLE 12 / ROUND 2 / READY_TO_SERVE

## Dine-in operations
- active opaque token `table-12-valid`; invalid/revoked/expired token fixtures
- Table 12 session with assigned waiter Rahul, two authenticated customers and one guest order
- one open consolidated bill with per-order line snapshots and per-owner eligible-spend summary
- open `CALL_WAITER` and `REQUEST_BILL` service requests
- finalized/payment-pending/failed/paid bill variants
- simultaneous valid Pickup and Dine-in KDS tickets

## Edge cases
- sold-out product
- sold-out topping
- full slot
- duplicate payment webhook
- payment retry
- duplicate Ready transition and duplicate waiter confirmation
- duplicate pickup
- reward reserved + payment fail
- reorder discontinued topping
- active QR source: `SAINIKPURI_COUNTER`
- inactive QR source: `SAINIKPURI_TABLE_01`
- new verified WhatsApp sender/customer
- existing WhatsApp identity matched to the existing user
- expired magic token (hash stored, never raw reusable fixture in shared logs)
- already-used magic token
- duplicate WhatsApp webhook/provider message ID
- invalid WhatsApp signature
- WhatsApp outbound reply outage/retry
- stale PROCESSING and exhausted FAILED outbox events
- customer submit replay, wrong table, expired session, waiter clarification/rejection and unavailable-before-confirmation
- bill request during active preparation, duplicate finalization/payment/session close
- payer differs from two authenticated order owners; guest earns no loyalty

## Infrastructure seed safety
Development seed values are fictional and environment-scoped. Never seed production provider credentials, session secrets, real customer phone numbers, raw OTPs or reusable magic tokens. Payment and webhook fixtures must be clearly fake.
