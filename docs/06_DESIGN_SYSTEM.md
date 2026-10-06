# 06 — Design System

> **Current design sources:** This document remains the high-level interaction baseline. Read `27_DESIGN_SYSTEM_FOUNDATION.md` for the approved brand foundation and component-layering rules, and `28_UI_VISUAL_DIRECTION.md` for reference interpretation, imagery, Landing rhythm and preliminary visual direction. Where visual guidance differs, Documents 27–28 are current; product and architecture source-of-truth priority remains unchanged.

## Interaction principles
- Food first
- Pickup timing visible
- No hidden modifier pricing
- One obvious primary CTA
- Reorder is privileged
- Rewards contextual, not intrusive
- Errors must be recoverable
- Mobile first
- Authentication should feel continuous across QR, WhatsApp and PWA without suggesting that QR text itself is secure.
- Dine-in screens keep the server-resolved table label, current state and next action visible.
- Customer copy uses “Send Order to Waiter”, “Waiting for waiter confirmation” and “Ready to be served”; internal enum labels stay in staff surfaces.
- Pickup and Dine-in share foundations, but cart, service and fulfilment context is never hidden or silently converted.

## Spacing
Use a consistent 4/8pt scale.
Default mobile horizontal padding: ~16px.

## Semantic color tokens
bg-primary, bg-surface, text-primary, text-secondary, brand-primary, success, warning, danger, info, disabled.

Order state must never rely on color alone.

## Typography roles
Display / H1 / H2 / H3 / Body / Small / Caption / Price / Metadata.

## Component families
Buttons, inputs, OTP, search, stepper, radio, checkbox, cards, sheets, tabs, badges, price blocks, skeletons, status, timers.

## Motion
Use for:
- state continuity
- cart confirmation
- reward unlock
- subtle transitions

Avoid blocking intro animation.

## Error design
Every error answers:
1. what happened
2. what can I do now

Examples:
payment failed → retry
slot full → choose next
item unavailable → edit
store paused → browse/try later
magic link expired/used → restart in WhatsApp or use phone OTP
WhatsApp unavailable → keep the QR context where safe and offer normal phone login

## QR signage
- Lead with customer value: “Scan to Order & Earn Pizza Points” or founder-approved copy, not “Login”.
- Identify The Pizza Avenue and the official WhatsApp destination clearly before the scan.
- Use a large, high-contrast QR with quiet zone, short supporting text and a phone-camera test at intended distance/lighting.
- Give each physical placement its own source code; never print a long-lived credential or customer phone in the QR.
- Include a short privacy/consent cue and a visible non-QR fallback URL or ordering instruction.

## WhatsApp continuation states
`AuthContinueCard` explains: send the prefilled message → wait for the official reply → tap “Continue to Pizza Avenue”. Loading states must not claim login before the token is consumed. Expired/used links use neutral language, do not reveal account existence and keep phone OTP available as fallback.

## Accessibility
- touch target
- keyboard support admin
- contrast
- focus states
- semantic labels
- no color-only state

## Performance UX
- lazy images
- menu skeletons
- preserve cart
- no optimistic payment/order success
- socket disconnects show a quiet reconnect state and refresh authoritative order data before rendering a recovered status
