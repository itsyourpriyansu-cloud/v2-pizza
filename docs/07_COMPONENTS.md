# 07 — Components

## ProductCard
Variants: default, bestseller, unavailable, passport, favourite, previous-order.
Data: image, title, description, price, badge, availability.

## PizzaBuilder
VariantSelector + ModifierGroup + Quantity + StickyPriceCTA.

## ModifierGroup
Required/optional, min/max, options, price delta, validation.

## CartItem
Snapshot, variant, modifiers, quantity, price, edit/remove.

## UpsellCard
Product + incremental price + explicit add.
Never auto-add.

## PickupSlot
Available / selected / nearly full / unavailable.

## OrderStatus
Pickup: Confirmed / Preparing / Ready for Pickup / Picked Up.

Dine-in: Waiting for Waiter / Needs Clarification / Accepted / Preparing / Ready to Serve / Served.

On reconnect, fetch current API state; a socket message alone never becomes the rendered source of truth.

## RewardCard
Locked / unlocked / applied / unavailable.

## LoyaltyProgress
Points + next reward + progress.

## PassportGrid
Required items + completed + milestones.

## KDS OrderTicket
Order no, service mode, promised Pickup time or Dine-in table/round/waiter, elapsed, items, modifiers and state action.

## Dine-in Customer
`ServiceModeSelector`, `TableQrResolver`, `TableContextBanner`, `DineInOrderReview`, `WaiterConfirmationStatus`, `TableRoundList`, `CurrentTableBill`, `BillRequestAction`, `ServiceRequestAction`.

## Waiter
`WaiterDashboard`, `OrderRequestCard`, `OrderRequestDetail`, `ActiveTableCard`, `TableSessionDetail`, `ReadyToServeQueue`, `ServiceRequestQueue`, `BillRequestQueue`.

## Admin Billing
`OpenBillList`, `TableBillDetail`, `LoyaltyAttributionSummary`, `BillFinalizationGuard`, `PaymentMethodControl`, `PaymentOutcome`, `SessionCloseAction`.

## AvailabilityToggle
Product/variant/modifier. Must audit.

## KPI Card
Only actionable KPIs such as GMV, AOV, repeat, attach, prep, pickup delay.

## AuthContinueCard
Explains the QR → WhatsApp handoff, official sender expectation and next action. States: awaiting send, awaiting reply, link ready/opened, provider delay and fallback to phone OTP. It never displays or stores the raw token.

## MagicLinkExpired
Neutral invalid/expired/already-used state with actions to restart through the official WhatsApp flow or use phone OTP. It must not disclose whether a phone number/customer exists.

## LoginMethod
Use only where the UX genuinely offers both paths. It presents phone OTP and “Continue with WhatsApp” as routes into one account, not separate account types.

## QRCodeCampaignCard
Founder/Admin component showing source code, store, placement, campaign, active state and funnel metrics. Activation changes are permission-protected and audited. The component never embeds credentials; export/print uses the server-owned redirect URL.
