# 12 — Analytics Events

## Acquisition
app_opened
source_detected
qr_scanned
social_deeplink_opened
whatsapp_join_sent
whatsapp_webhook_received
magic_link_generated
magic_link_opened
whatsapp_login_completed
otp_requested
otp_verified
login_completed

Required acquisition dimensions where relevant: `auth_method` (`PHONE_OTP` or `WHATSAPP_QR_MAGIC_LINK`), `qr_source`, `store_id`, `campaign`, session identifier and anonymous-to-customer attribution identifier. Do not send phone numbers, OTPs, raw magic tokens or WhatsApp provider payloads to analytics.

`whatsapp_webhook_received` measures verified transport receipt; `whatsapp_join_sent` is emitted only after a verified inbound join intent is normalized, not from an assumed client tap. `magic_link_generated`, `magic_link_opened` and `whatsapp_login_completed` are distinct funnel steps. PostHog or an equivalent product-analytics tool may receive these privacy-filtered events, but PostgreSQL remains operational/reporting truth.

## Discovery
menu_viewed
category_viewed
product_viewed
search_used
favourite_added

## Builder
builder_started
variant_selected
modifier_selected
builder_completed

## AOV
upsell_shown
upsell_accepted
bundle_viewed
bundle_added

`upsell_accepted` includes rule/placement and an `incremental_cart_value` measured from backend-authoritative quote data, not a client-estimated total.

## Checkout
cart_viewed
checkout_started
pickup_options_viewed
pickup_slot_selected
quote_generated

## Payment
payment_started
payment_success
payment_failed
payment_abandoned

## Operations
order_confirmed
preparing
ready
picked_up
order_completed
outbox_retry_scheduled
outbox_failed

## Loyalty
points_earned
reward_viewed
reward_unlocked
reward_reserved
reward_redeemed
passport_progress
passport_completed

## Retention
reorder_clicked
reorder_completed
favourite_reordered

## Primary KPIs
- GMV
- orders
- AOV
- items/order
- side attach rate
- drink attach rate
- dessert attach rate
- checkout conversion
- payment failure
- repeat purchase rate
- days between orders
- reward redemption
- post-reward repeat rate
- average prep time
- ready-time accuracy
- customer wait after READY
- QR scan → WhatsApp join rate
- webhook → magic-link generation rate
- magic-link open/completion rate
- OTP completion rate
- auth method conversion and later direct-order/reorder rate

## Event rules
- consistent names
- documented properties
- no unnecessary PII
- session/order identifiers
- analytics never becomes source of operational truth
- server emits authoritative payment, order, loyalty and outbox outcome events; client events describe UX steps only
- PostgreSQL reports remain source of truth for revenue, orders, payments, loyalty and operational reporting
- provider webhook receipt and successful processing are separate events/statuses to expose outages without inflating completed-login counts
