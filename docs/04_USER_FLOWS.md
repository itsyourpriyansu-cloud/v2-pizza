# 04 — User Flows

## A. Normal app → phone OTP
Open → choose Pickup → browse → product → customise → add cart → upsell → checkout → enter phone → request OTP → verify OTP → resolve/create PHONE identity → rotate/create secure HttpOnly session → backend quote → pickup slot → payment → verified provider webhook → CONFIRMED/KDS → Preparing → Ready for Pickup → pickup → Completed → points.

Failure: invalid, expired or attempt-limited OTP does not create a session; resend follows cooldown and generic responses prevent account enumeration.

## B. In-store QR → WhatsApp → magic login
1. Customer scans an active placement-specific QR labelled around ordering/points, not merely “Login”.
2. `GET /qr/{code}` records source attribution and redirects to the official WhatsApp deep link with the approved join text/source reference.
3. Customer sends the message. WhatsApp delivers an inbound webhook.
4. Backend verifies provider authenticity, stores/deduplicates the provider message ID and extracts the verified sender phone.
5. `WhatsAppAuthService` idempotently resolves/creates the WHATSAPP identity, generates a random short-lived token and stores only its hash.
6. `WhatsAppProvider` replies with “Continue to Pizza Avenue” and the one-time Customer-app link: `https://app.pizzaavenue.<domain>/auth/magic?token=...`.
7. Customer opens the link. Backend hashes and verifies the token, atomically marks it used, creates/rotates the same session model used by OTP and redirects into the PWA.

Failure paths: an invalid webhook is rejected; a duplicate inbound message reuses/avoids duplicating the logical outcome; an expired, used or invalid token creates no session and shows `MagicLinkExpired` with a safe restart through WhatsApp or phone OTP. A provider outage records retryable delivery failure without trusting client input as identity.

## C. Returning reorder
Open → last order → Reorder → map old config to current menu → show changes → current price → pickup → pay.

Target: simple repeat purchase under ~60 seconds.

## D. Pizza Builder
Product → variant → required modifier groups → optional groups → live provisional price → validate → cart.

## E. Pickup
ASAP:
backend returns first capacity-supported promise.

Scheduled:
backend returns slots → user chooses → hold/revalidate → payment → consume capacity.

## F. Payment failure
Payment fails → no KDS → cart preserved → capacity released/expired → retry possible.

## G. KDS
Pickup: verified payment webhook → payment `SUCCESS` + order `CONFIRMED` + outbox event in one transaction → KDS New → `PREPARING` → `READY_FOR_PICKUP`.

Dine-in: customer submission remains outside KDS → waiter confirmation atomically creates order `CONFIRMED` + one KDS admission/outbox event → `PREPARING` → `READY_TO_SERVE`. WebSocket delivery is fast-path only; reload/reconnect fetches authoritative API state.

## H. Sold-out conflict
Item changes availability while in cart → checkout blocks affected item → user edits → remaining cart survives.

## I. Handover
READY_FOR_PICKUP → customer code → counter verifies → PICKED_UP → server completion workflow → COMPLETED + outbox event → loyalty/Passport idempotent consumers. Duplicate handover is blocked and audited.

## O. Dine-in table session
Opaque table QR → server resolves active table/store/session → customer confirms visible table context → Dine-in menu/cart/review → optional verified identity attach → `CUSTOMER_SUBMITTED` → waiter review → `CONFIRMED` → KDS → `PREPARING` → `READY_TO_SERVE` → Waiter marks `SERVED`.

Clarification preserves the request; rejection includes a reason. Each additional round repeats the waiter gate and joins one table bill. Customer bill request disables new rounds unless reopened before finalization. Admin/Counter finalizes only after unresolved orders/voids clear, records verified Cash/UPI/Card/approved payment, closes the paid session, and emits idempotent loyalty/Passport/mission work per authenticated order owner.

## J. Loyalty redemption
Choose reward → server validates points/availability/stacking → reserve → checkout → complete → consume.

## K. Passport
Completed qualifying order → progress once → milestone unlock → reward.

## L. Refund
Authorized actor → eligibility → request → pending → provider confirm → loyalty adjustment → audit.

## M. Busy
BUSY → increased ETA/reduced capacity → customer informed.

## N. Pause
PAUSED → browsing remains → checkout disabled → existing orders continue.

## Prototype-critical flows
- first order
- reorder
- builder
- cart/upsell
- pickup slot
- payment success/failure
- tracking
- rewards/passport
- KDS
- founder dashboard
- both authentication paths, including expired/reused magic links
- live-update reconnect recovery and duplicate provider-event handling

## Customer retention flow (V1 frontend contract)
Returning customer → one adaptive Home retention prompt → Rewards hub → reserve/release reward, open Passport or open Missions. Passport items link to current Product Detail with `source=PASSPORT`. Completed Pickup may show a compact progress summary. Served Dine-in remains pending until `TABLE_BILL_PAID`; operational order/table actions always outrank retention.
