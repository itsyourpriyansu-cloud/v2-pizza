# 05 — Information Architecture

## Surface domains
- `pizzaavenue.<domain>` is Landing/Marketing only. It may later link to menu previews, campaigns and store information, but never hosts the logged-in Customer application.
- `app.pizzaavenue.<domain>` is the Customer PWA. Customer routes such as `/menu`, `/orders` and `/rewards` are relative to this host, not nested beneath `/app` on the landing domain.
- `kds.pizzaavenue.<domain>` is the Kitchen/KDS surface; its internal routes are `/`, `/login`, `/orders` and `/orders/:orderId`.
- `admin.pizzaavenue.<domain>` is the Founder/Admin surface; its internal routes are relative to that host.

## Customer entry points
- Normal Customer app: browse first; phone OTP is requested when identity is required.
- In-store QR: placement-attributed redirect opens the official WhatsApp join conversation.
- Table QR: `/dine-in/start?t=<opaque_token>` resolves a trusted table session and bypasses the service-mode selector; it is not an identity credential.
- WhatsApp magic link: `https://app.pizzaavenue.<domain>/auth/magic` consumes a short-lived one-time token, creates the normal web session and lands in the intended PWA context. The Landing host is never an authentication callback.

After login, the product does not expose “PHONE” versus “WHATSAPP” as separate account types. Profile, orders, loyalty and sessions belong to one customer identity.

## Customer bottom nav
Home / Menu / Orders / Rewards / Profile

Cart is contextual via persistent cart bar.

## Customer service and Dine-in routes
- `/` service-mode selector when no context exists
- `/dine-in/start`, `/dine-in/table`, `/dine-in`
- `/dine-in/menu`, `/dine-in/menu/:productId`, `/dine-in/cart`, `/dine-in/review`
- `/dine-in/orders/:orderId` plus clarification/rejected/accepted/preparing/ready-to-serve/served states
- `/dine-in/order-more`, `/dine-in/bill`, `/dine-in/bill/request`, `/dine-in/service`
- `/dine-in/session-complete`, `/dine-in/expired`, `/dine-in/wrong-table`

## Home
Home answers three questions in order: what can I order now, what should I probably order, and what would complete the meal. The service/operational context always precedes discovery or retention.

- No service context: store identity and state → Pickup card with current ETA → Dine-in table-QR path → location and no-delivery assurance.
- New Pickup customer: store context → proven-favourite hero → four craving routes → transparent meal plan → bestsellers → taste-led discovery → optional sides/drinks/dessert → brand reassurance.
- Returning Pickup customer: store context → current-menu revalidated usual order → transparent meal plan → bestsellers → one adaptive `Your Avenue` action → taste-led discovery → optional sides/drinks/dessert → brand reassurance.
- Active Pickup: store context → live order state and tracking CTA → food discovery only. Retention and engagement prompts are suppressed until the operational task is complete.
- Active Dine-in: trusted table/session context → Order More / Current Bill / Call Waiter → quick additions → menu search. Pickup and retention modules are suppressed.

Only one adaptive Home module may appear. Its priority remains Saved Basket → upcoming Occasion → available Reward → near-complete Passport → Personal Mission → ordinary Passport progress → Referral → Common Mission → League → reactivation → Points progress. It appears only when no active Pickup or Dine-in operation requires attention.

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

## Founder/Admin
Overview / Orders / Menu / Availability / Pickup Capacity / Loyalty / Promotions / Customer Growth / QR Sources / Staff / Analytics / Settings / Audit / Tables / Billing / Payments.

Waiter uses role-protected, root-relative Admin-host routes: `/staff/waiter`, `/staff/waiter/requests`, `/staff/waiter/tables`, `/staff/waiter/ready`, `/staff/waiter/service-requests`, `/staff/waiter/bill-requests` and `/staff/waiter/assisted-order`. Billing uses `/billing`, `/billing/open`, `/billing/:billId`, `/billing/:billId/finalize`, `/billing/:billId/payment`, `/payments` and `/tables`. There is no separate Waiter app.

Customer Growth contains the QR → WhatsApp → magic-link funnel and reorder/loyalty behavior. Auth Audit is permission-protected and redacts secrets and unnecessary phone data.

## KDS
Unified All / Pickup / Dine-in queue; New / Preparing / Ready for Pickup / Ready to Serve. Routes include `/orders`, `/orders/pickup`, `/orders/dine-in` and `/orders/:orderId`.

## Counter
Ready orders / Search / Verify / Handover.

## UX hierarchy
Customer:
Which mode/table? → can I order? → what do I want? → price? → what confirms it? → fulfilment → mode-appropriate payment → reward.

Operations:
what needs action? → what is late? → what is blocked? → what is next?

Acquisition:
which placement/campaign was scanned? → was the WhatsApp join sent/received? → was a magic link generated/opened? → was login completed? → did the customer later order/reorder?

## Customer retention routes
- `/rewards` — Points, next reward, reward catalog, Passport/Missions entry points and activity
- `/rewards/passport` — Passport progress and item-to-product navigation
- `/rewards/missions` — visually separate Personal and Common Missions with Avenue XP
- `/profile` — identity, preferences, favourites, notifications, help/legal and logout

The legacy `/passport` path redirects to `/rewards/passport`. Passport and Missions remain inside the Rewards hierarchy and are not bottom-navigation destinations.

## Customer engagement routes
- `/profile/saved-baskets`, `/profile/saved-baskets/:basketId`
- `/profile/family`
- `/profile/occasions`
- `/profile/taste-card`
- `/rewards/invite`
- `/rewards/league`
- `/group-order`, `/group-order/:groupId`

Bottom navigation remains frozen at Home / Menu / Orders / Rewards / Profile. Family, Occasions, Passport, Missions, referrals, League and Group Order are nested contextual destinations only.
