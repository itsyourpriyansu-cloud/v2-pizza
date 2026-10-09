# 06 — Design System

> **Current design sources:** The implemented Landing is the canonical visual reference. `packages/ui/src/foundation.css` is the cross-application token and primitive contract. Read `27_DESIGN_SYSTEM_FOUNDATION.md` for exact implementation rules and `28_UI_VISUAL_DIRECTION.md` for surface adaptation, imagery and composition. Product and architecture source-of-truth priority remains unchanged.

## Foundation contract

- The official palette is Cream `#FDF6E9`, Sand `#EADCC8`, Maroon `#6B1F1F`, Italian Brown `#8C4A2F`, Olive `#556B2F`, Sage `#A7B58B` and Espresso `#3B2F2A`.
- Phudu 600/700 is the display face. Poppins 400/500/600/700 is the body and functional face.
- Applications consume shared semantic tokens from `@pizza-avenue/ui/foundation.css`; they do not duplicate brand hex values or create surface-local brand palettes.
- Landing is expressive, Customer is direct and food-led, KDS is high-contrast and glanceable, and Admin is dense and calm. Shared identity does not mean identical composition.
- The official logo asset may be used only from the governed Landing asset set; do not redraw, approximate or invent a mark.

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
Use the shared 4px base scale (`--space-1` through `--space-16`). Default mobile horizontal padding is 16px; operational layouts may increase density without reducing tap targets.

## Semantic color tokens
Use `--color-canvas`, `--color-surface`, `--color-surface-strong`, `--color-ink`, `--color-muted`, `--color-brand`, `--color-success`, `--color-warning`, `--color-danger`, `--color-border` and `--color-focus`. Raw palette tokens are available only when a deliberate brand composition needs them.

Order state must never rely on color alone.

## Typography roles
Display / H1 / H2 / H3 use Phudu selectively. Body / Small / Caption / Price / Metadata / form and navigation text use Poppins. Prices, timers and operational identifiers use tabular numerals.

## Customer discovery profile

The service-entry and Home surfaces use a reference-adapted mobile composition while retaining the frozen Pizza Avenue foundation:

- a four-column mental grid with 20px mobile gutters and 24px major rhythm,
- image-led appetite moments followed by quiet Cream/Sand decision surfaces,
- one dominant operational or ordering action before lower-priority discovery,
- compact horizontal category discovery, two-column food cards and no hidden paid additions,
- Espresso for high-contrast framing, Maroon/Italian Brown for primary warmth, and Cream/Sand for the light layers; no external orange/black/white palette is introduced,
- Phosphor icons on Customer entry, Home and its navigation chrome, with one weight family per visual layer and text labels retained for navigation.

The supplied reference contributes hierarchy and interaction patterns only. Delivery, maps, addresses, marketplace branding, proprietary copy and artwork are excluded.

## Component families
Buttons, inputs, OTP, search, stepper, radio, checkbox, cards, sheets, tabs, badges, price blocks, skeletons, status, timers.

## Motion
Use for:
- state continuity
- cart confirmation
- reward unlock
- subtle transitions

Avoid blocking intro animation.

Interaction feedback should complete in roughly 140–220ms. Motion must stop or collapse under `prefers-reduced-motion`; no critical state may depend on animation.

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
- 44px minimum interaction target; KDS primary actions should be larger where practical
- full keyboard support on every surface
- visible 3px focus treatment with separation from the component edge
- WCAG AA text and state contrast
- semantic landmarks and labels
- no hover-only action and no color-only state
- horizontal scrolling only for intentional rails or narrow navigation, never the document

## Performance UX
- lazy images
- menu skeletons
- preserve cart
- no optimistic payment/order success
- socket disconnects show a quiet reconnect state and refresh authoritative order data before rendering a recovered status
