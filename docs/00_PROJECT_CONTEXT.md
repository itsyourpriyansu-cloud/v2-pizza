# 00 — Project Context

## Business context
The Pizza Avenue is an Italian-inspired pizzeria in Sainikpuri, Hyderabad. The brand's core advantage is product quality and handcrafted pizza rather than marketplace convenience.

## Product opportunity
The application should convert an existing food business into a direct digital habit:
social/store discovery → direct Pickup or Dine-in order → fulfilment → reward → reorder.

The in-store acquisition loop is equally important:
walk-in customer → placement-attributed QR → WhatsApp message → verified customer identity → secure magic link → customer PWA → loyalty → future direct reorder.

The QR is a growth mechanism, not merely a login shortcut. Signage should communicate “Scan to Order & Earn Pizza Points” or a founder-approved equivalent, while the backend attributes the scan to placements such as the counter, door, bill, box or table.

Table-service QR is a separate trusted-context flow: opaque table token → server-resolved active table session → customer request → waiter confirmation → kitchen → staff-settled table bill. A table QR does not authenticate a person.

## Problems to solve
- customers repeatedly ask the same ordering questions
- customisation can be unclear
- pickup time may be inconsistent
- the business lacks a structured repeat-order loop
- loyalty often becomes discounting
- upsells are manual/inconsistent
- operations and customer experience are disconnected
- direct-order analytics are weak

## Product vision
Create the fastest way to order Pizza Avenue for Pickup or at a table while making returning customers feel recognised and rewarded.

## Product principles
1. Speed over browsing complexity.
2. Clear prices for every modifier.
3. Reliable pickup promise.
4. Loyalty should create habit, not margin destruction.
5. Backend is the source of truth.
6. Returning users get shortcuts.
7. Operational truth beats marketing promises.
8. Customer identity is earned from verified providers, never untrusted QR or URL data.
9. A live socket improves speed but never replaces database truth.
10. V1 infrastructure stays portable through Docker, Node.js, PostgreSQL and Redis.

## Personas
### New customer
Needs confidence, bestsellers, easy customisation, pickup estimate.

### Returning customer
Needs reorder, favourites, rewards, fast checkout.

### Waiter
Needs trusted table context, clear order requests, Ready-to-Serve work and bill/service queues without payment authority.

### Kitchen
Needs eligible orders, readable modifiers, service-mode context, timers and clear shared priority.

### Counter
Needs ready-order lookup and secure handover.

### Founder
Needs orders, GMV, AOV, availability, staff control, refunds, repeat and attach-rate analytics.

## V1 proof
The product is successful if:
- a customer can order a customised pizza end-to-end
- price cannot be tampered with
- Pickup reaches KDS once after verified payment
- Dine-in reaches KDS once after waiter confirmation and accumulates into one table-session bill

## Frozen service model

- `PICKUP`: customer pays first; verified payment admits the order to KDS.
- `DINE_IN`: customer submits a table-bound request; waiter confirmation admits it to KDS; accepted rounds accumulate into one table-session bill settled by Admin/Counter after service.
- Both modes use one menu, one order aggregate, one kitchen workload, one payment infrastructure and one customer loyalty system.
- pickup capacity prevents overload
- rewards are credited correctly
- reordering is fast
- upsells measurably increase basket value
- both OTP and WhatsApp QR acquisition create the same durable customer/session model
- duplicate provider events cannot duplicate payment, order, KDS, loyalty or Passport outcomes
- production data can be restored from an off-server backup

## Product and future boundary
V1 operates one Sainikpuri outlet and supports pickup only. The data model may record store and external-source identifiers for later POS, Swiggy, Zomato or District adapters, but V1 does not implement marketplace ingestion, delivery, drivers, addresses, multi-brand operation or microservices.
