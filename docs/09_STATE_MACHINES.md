# 09 — State Machines

## Pickup Order
`DRAFT → PAYMENT_PENDING → CONFIRMED → PREPARING → READY_FOR_PICKUP → PICKED_UP → COMPLETED`.

`PAYMENT_PENDING → PAYMENT_FAILED → PAYMENT_PENDING` supports retry. Draft/payment states may cancel; post-confirmation cancellation follows restricted policy. Verified payment and Pickup `CONFIRMED` commit atomically. Only paid `CONFIRMED`/`PREPARING`/`READY_FOR_PICKUP` orders are KDS-eligible.

## Dine-in Order
`DRAFT → CUSTOMER_SUBMITTED → WAITER_REVIEW → CONFIRMED → PREPARING → READY_TO_SERVE → SERVED → COMPLETED`.

Branches:
- `CUSTOMER_SUBMITTED` or `WAITER_REVIEW → CANCELLED` when policy permits.
- `WAITER_REVIEW → NEEDS_CLARIFICATION → CUSTOMER_SUBMITTED` after resolution.
- `WAITER_REVIEW/NEEDS_CLARIFICATION → REJECTED` with reason.
- post-confirmation cancellation is restricted and audited.

Customer submission is never KDS admission. Waiter confirmation idempotently records `waiter_confirmed_at`, moves to `CONFIRMED` and emits exactly one KDS/outbox event without prior payment.

## Payment
CREATED
→ PENDING
→ SUCCESS | FAILED | EXPIRED

SUCCESS
→ REFUND_PENDING
→ PARTIALLY_REFUNDED | REFUNDED | REFUND_FAILED

The payment target is either one Pickup `ORDER` or one Dine-in `TABLE_BILL`. A failed Dine-in digital attempt leaves the same finalized bill unpaid and retryable.

## Table session
`OPEN → ACTIVE → BILL_REQUESTED → PAYMENT_PENDING → PAID → CLOSED`.

Before bill finalization, `BILL_REQUESTED → ACTIVE` may reopen for another round. `OPEN/ACTIVE → EXPIRED/CANCELLED` applies only under policy. Paid closes exactly once and releases the table.

## Dine-in bill
`OPEN → BILL_REQUESTED → FINALIZED → PAYMENT_PENDING → PAID`.

Cash may move `FINALIZED → PAID` only after authorized receipt acknowledgement. Digital/terminal uses `FINALIZED → PAYMENT_PENDING → PAID`; failure returns/stays retryable without creating another bill. `OPEN/BILL_REQUESTED → VOID` is permissioned and audited. Finalization is blocked while waiter review, preparation, Ready-to-Serve or unresolved void work remains.

## Service request
`OPEN → ACKNOWLEDGED → RESOLVED`, with `OPEN/ACKNOWLEDGED → CANCELLED` when permitted.

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
