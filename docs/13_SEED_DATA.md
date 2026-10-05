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
PA-1003 READY
PA-1004 PAYMENT_FAILED
PA-1005 COMPLETED

## Edge cases
- sold-out product
- sold-out topping
- full slot
- duplicate payment webhook
- payment retry
- double READY
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

## Infrastructure seed safety
Development seed values are fictional and environment-scoped. Never seed production provider credentials, session secrets, real customer phone numbers, raw OTPs or reusable magic tokens. Payment and webhook fixtures must be clearly fake.
