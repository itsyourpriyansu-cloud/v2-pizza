# 11 — Integration Architecture

## Adapter boundary
NestJS domain modules depend on internal interfaces, never provider SDK types or raw webhook payloads. Provider adapters verify/normalize at the edge and return stable domain results. Provider credentials live in environment/secret management and are never exposed to frontend apps or stored in audit payloads.

## PaymentProvider interface
Internal methods:
- `createPayment`
- `verifyWebhook`
- `getStatus`
- `refund`

Core order domain must not understand provider-specific payloads.

The payment webhook is authoritative for integrated methods. After signature verification and `provider_event_id` deduplication, a Pickup-target transaction records success, confirms one order, consumes the pickup hold and inserts one outbox event. A Dine-in table-bill target records the finalized bill paid and inserts session-close/downstream events; it does not create another order. Unique provider transaction/idempotency keys prevent duplicate operational effects.

## MessagingProvider interface
- `sendTransactional`
- `sendTemplate`
- `getDeliveryStatus`

Notification failure does not roll back order.

## WhatsAppProvider implementation
`WhatsAppProvider` owns provider authentication, outbound API calls, approved-template identifiers and delivery-status normalization. It does not decide customer identity or order state.

Inbound processing:
1. verify WhatsApp/provider authenticity before trusting content
2. persist provider message/event ID and deduplicate
3. extract verified sender identity
4. normalize the join intent and QR-source reference
5. invoke the application service idempotently
6. audit a redacted outcome and enqueue retryable outbound reply

## WhatsAppAuthService versus NotificationService
`WhatsAppAuthService` resolves/creates the WHATSAPP `auth_identity`, issues a hashed one-time magic token and requests the login reply. `NotificationService` sends order, ready and loyalty messages according to template/consent rules. They may share `MessagingProvider`, but login identity and transactional messaging remain separate responsibilities.

Invalid signatures are rejected before sender extraction. Duplicate inbound IDs return a safe acknowledgement without creating a second customer/token outcome. Provider outage leaves a retryable BullMQ job; it never falls back to trusting QR text, URL phone data or client claims.

## Future External Order Adapter
Methods:
- normalize_order
- acknowledge
- map_status
- map_items
- sync_availability if supported

Future:
- Swiggy
- Zomato
- District
- POS

Internal normalized fields:
- provider
- external order id
- source
- customer display info
- items/modifiers
- amount
- promised time
- normalized state

## Webhook handling
1. authenticate/signature verify
2. store external event ID
3. deduplicate
4. idempotent process
5. record processing result
6. retry safe failures
7. manual/dead-letter handling where necessary

Store raw payloads only when necessary and allowed, with access control, redaction and retention. Never copy provider-specific payloads into core order/customer models.

## Transactional outbox and jobs
Domain writes and outbox inserts are atomic in PostgreSQL. An event processor publishes retryable work to BullMQ for WhatsApp/provider calls, loyalty/Passport consumers, analytics forwarding, reports, magic-token cleanup and abandoned-reservation cleanup. Redis queue data accelerates work but PostgreSQL outbox/domain records remain recoverable truth. Consumers use event/aggregate uniqueness to make retries harmless.

Dine-in uses the same pattern. Waiter confirmation emits one kitchen-admission event; `TABLE_BILL_PAID` and `TABLE_SESSION_CLOSED` drive per-order-owner loyalty, Passport, missions, XP, analytics, receipt and notifications. A payer identity is never substituted for each order's authenticated owner.

## Secrets
- no secrets in source
- staging/prod separated
- least privilege
- never log OTPs, raw magic/session tokens, payment secrets or WhatsApp access tokens
- production webhook URLs require HTTPS, signature verification, rate limits and strict routing

## V1
YES:
- payment
- WhatsApp authentication adapter
- transactional messaging

NO:
- marketplace integrations
- delivery

But interfaces remain future-ready.
