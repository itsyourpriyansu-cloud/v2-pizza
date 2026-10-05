# 05 — Information Architecture

## Customer entry points
- Normal app/domain: browse first; phone OTP is requested when identity is required.
- In-store QR: placement-attributed redirect opens the official WhatsApp join conversation.
- WhatsApp magic link: consumes a short-lived one-time token, creates the normal web session and lands in the intended PWA context.

After login, the product does not expose “PHONE” versus “WHATSAPP” as separate account types. Profile, orders, loyalty and sessions belong to one customer identity.

## Customer bottom nav
Home / Menu / Orders / Rewards / Profile

Cart is contextual via persistent cart bar.

## Home
- store state + pickup ETA
- Order Again
- favourites
- signature
- bestsellers
- combos
- new/limited
- rewards progress
- passport preview

## Menu
- Signature
- Classics
- Vegetarian
- Sides
- Desserts
- Drinks
- Combos

## Product
Image → title → description → base price → size → crust → cheese → toppings → add-ons → quantity → CTA with current price.

## Cart
Items → edit → subtotal → reward/promo → upsell → pickup CTA.

## Checkout
Identity → pickup option → slot → price summary → reward/promo → payment.

No address.

## Authentication states
- Phone entry / OTP entry / resend cooldown / invalid-or-expired OTP
- WhatsApp continuation while waiting for the message/link
- Magic link consuming / success redirect / expired-or-used recovery
- Session expired: preserve safe cart state and return to the appropriate login path

## Orders
Active / History / Detail / Reorder.

## Rewards
Points / Rewards / Pizza Passport.

## Founder
Overview / Orders / Menu / Availability / Pickup Capacity / Loyalty / Promotions / Customer Growth / QR Sources / Staff / Analytics / Settings / Audit.

Customer Growth contains the QR → WhatsApp → magic-link funnel and reorder/loyalty behavior. Auth Audit is permission-protected and redacts secrets and unnecessary phone data.

## KDS
New / Preparing / Ready.

## Counter
Ready orders / Search / Verify / Handover.

## UX hierarchy
Customer:
Can I order? → what do I want? → price? → ready when? → pay → reward.

Operations:
what needs action? → what is late? → what is blocked? → what is next?

Acquisition:
which placement/campaign was scanned? → was the WhatsApp join sent/received? → was a magic link generated/opened? → was login completed? → did the customer later order/reorder?
