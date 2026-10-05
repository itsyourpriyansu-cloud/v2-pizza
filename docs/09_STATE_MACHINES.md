# 09 — State Machines

## Order
DRAFT
→ PAYMENT_PENDING
→ CONFIRMED
→ PREPARING
→ READY
→ PICKED_UP
→ COMPLETED

Permitted exceptions:
- DRAFT → CANCELLED
- PAYMENT_PENDING → PAYMENT_FAILED / CANCELLED
- CONFIRMED → CANCELLED according to policy
- PREPARING → CANCELLED only restricted

Payment `SUCCESS` and order `CONFIRMED` are committed together after a verified provider event. `CONFIRMED` is the first KDS-visible/New state; payment status remains a separate state machine. `PICKED_UP` records handover, then the server completion workflow reaches `COMPLETED` and emits the event used for loyalty and Passport. Refund state belongs to Payment/Refund rather than creating an ambiguous order state.

No arbitrary skipping.

## Payment
CREATED
→ PENDING
→ SUCCESS | FAILED | EXPIRED

SUCCESS
→ REFUND_PENDING
→ PARTIALLY_REFUNDED | REFUNDED | REFUND_FAILED

## Pickup reservation
HELD
→ CONSUMED

HELD
→ RELEASED / EXPIRED

`AVAILABLE` is a capacity calculation, not a persisted reservation state. Payment success consumes the hold atomically with order confirmation; payment failure/expiry releases it.

## Magic login token
ISSUED → USED

ISSUED → EXPIRED

`USED` and `EXPIRED` are terminal. Invalid, replaced or revoked tokens are treated as unusable and create no session. Consuming a token and creating/rotating the session are atomic.

## Outbox event
PENDING → PROCESSING → PROCESSED

PROCESSING → FAILED → PENDING when retry policy allows

`PROCESSED` is terminal. `FAILED` retains retry count and last error; exhausted failures require operator/dead-letter visibility. A crashed/stale `PROCESSING` lease may be safely reclaimed. Every consumer is idempotent.

## Reward
AVAILABLE
→ RESERVED
→ APPLIED
→ CONSUMED

RESERVED
→ RELEASED

Payment failure must not permanently consume reward.

## Promotion
ELIGIBLE
→ RESERVED
→ REDEEMED

RESERVED
→ RELEASED / EXPIRED

## Store
OPEN ↔ BUSY
OPEN/BUSY → PAUSED
PAUSED → OPEN/CLOSED
schedule may drive CLOSED.

## Transition enforcement
Every transition validates:
1. current state
2. actor permission
3. business prerequisites
4. atomic DB write
5. event history
6. domain event

For critical changes, step 6 means inserting the outbox event in the same PostgreSQL transaction, not publishing directly before commit.

## Concurrency
Use conditional state update or version/optimistic locking. Stale staff action returns conflict instead of overwriting.
