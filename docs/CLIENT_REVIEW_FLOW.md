# Pizza Avenue Customer V1 — Client Review Flow

## Purpose

This is the restaurant-owner walkthrough for the complete Customer V1 prototype. It is designed to collect business decisions before a correction pass and UX freeze. The reviewer should judge whether each concept is useful, understandable and operationally realistic; the review is not a production launch approval.

## Facilitator setup

1. From the repository root, start the Customer app with `corepack pnpm dev:customer`. This avoids relying on a globally installed `pnpm` command.
2. Open `http://localhost:5174` in a browser.
3. Use the review links below. The restaurant owner only needs the browser; they do not need a terminal, Git, developer tools, source edits or database access.
4. Open or refresh a review link before each scenario. A full reload restores the seed data and applies the requested persona.
5. Keep this document and `CLIENT_REVIEW_SCORECARD.md` beside the browser. Record decisions, not implementation ideas.

The `?review=` parameter works only in a Vite development session. Production builds ignore both `?review=` and the lower-level `?scenario=` selector.

## Deterministic review personas

| Persona | Review link | Expected review state |
|---|---|---|
| `NEW_CUSTOMER` | `http://localhost:5174/?review=NEW_CUSTOMER` | No service selected; first-visit service choice |
| `NEW_PICKUP` | `http://localhost:5174/?review=NEW_PICKUP` | First-time Pickup Home after service selection |
| `RETURNING_CUSTOMER` | `http://localhost:5174/?review=RETURNING_CUSTOMER` | Pickup context with current-menu usual order and one adaptive prompt |
| `ACTIVE_PICKUP` | `http://localhost:5174/?review=ACTIVE_PICKUP` | Active Pickup status dominates Home |
| `ACTIVE_DINE_IN` | `http://localhost:5174/?review=ACTIVE_DINE_IN` | Verified Table 12 context dominates Home |
| `REWARD_AVAILABLE` | `http://localhost:5174/?review=REWARD_AVAILABLE` | Reward-ready Home prompt without higher-priority engagement prompts |
| `PASSPORT_ONE_LEFT` | `http://localhost:5174/?review=PASSPORT_ONE_LEFT` | Passport one-left Home prompt and five-of-six Passport |
| `PERSONAL_MISSION_ACTIVE` | `http://localhost:5174/rewards/missions?review=PERSONAL_MISSION_ACTIVE` | Personal mission only |
| `COMMON_MISSION_ACTIVE` | `http://localhost:5174/rewards/missions?review=COMMON_MISSION_ACTIVE` | Common mission only |
| `FAMILY_CUSTOMER` | `http://localhost:5174/profile/family?review=FAMILY_CUSTOMER` | Seed household members and privacy guidance |
| `OCCASION_UPCOMING` | `http://localhost:5174/?review=OCCASION_UPCOMING` | Upcoming occasion is the single Home prompt |
| `SAVED_BASKET_READY` | `http://localhost:5174/?review=SAVED_BASKET_READY` | Saved Basket is the single Home prompt |
| `REFERRAL_PENDING` | `http://localhost:5174/rewards/invite?review=REFERRAL_PENDING` | Invite awaiting a qualifying first order |
| `LEAGUE_ACTIVE` | `http://localhost:5174/rewards/league?review=LEAGUE_ACTIVE` | Opted-in monthly League state |
| `GROUP_ORDER_HOST` | `http://localhost:5174/group-order/group-friday-team?review=GROUP_ORDER_HOST` | Host view with participants, poll and host checkout |
| `REACTIVATION_CUSTOMER` | `http://localhost:5174/?review=REACTIVATION_CUSTOMER` | Contextual welcome-back prompt without a generic discount |

## Numbered walkthrough

Use the final two columns during the meeting. Choose one of **Keep / Change / Remove / Later**; do not leave a feature implicitly approved.

| # | Screen / route | What customer does | What client should look at | Business question | Keep / Change / Remove / Later | Client notes |
|---:|---|---|---|---|---|---|
| 01 | Service selection — `/?review=NEW_CUSTOMER` | Chooses Pickup or starts the table-QR path. | Whether the two service modes are immediately distinct and whether the time promise is credible. | Should every new visit begin with this explicit choice? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 02 | New-customer Pickup — `/?review=NEW_PICKUP` | Enters Pickup Home and browses the first-time discovery content. | First impression, food emphasis, Sainikpuri context and clarity of the primary menu CTA. | Does this explain direct Pickup strongly enough to reduce marketplace/manual ordering? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 03 | Menu discovery — `/menu?review=RETURNING_CUSTOMER` | Searches, scrolls categories and opens an item. | Category names, product order, dietary badges, seed photos, descriptions and starting prices. | Does the preliminary menu match how Pizza Avenue actually sells and groups food? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 04 | Product customization — `/menu/pizza-margherita/customize?review=RETURNING_CUSTOMER` | Selects size, required crust and optional cheese/toppings, then adds to Pickup cart. | Modifier language, required/optional rules, provisional total and one-handed usability. | Are the real modifier groups, limits and price deltas correct? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 05 | Cart — `/cart` after step 04 | Changes quantity, edits/removes an item and reviews a current quote. | Recovery copy, current-price confirmation, upsell restraint and Pickup/Dine-in isolation. | Which add-ons are operationally useful without harming checkout completion? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 06 | Pickup scheduling — `/checkout/pickup` after step 05 | Selects ASAP or a scheduled time and holds it. | Lead time, slot labels, nearly-full/full states, hold countdown and cart preservation. | What lead time, interval, capacity and late-order policy can the kitchen honor? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 07 | Auth — `/auth?returnTo=%2Fcheckout` | Uses phone OTP or reviews the verified WhatsApp continuation concept. | Whether sign-in happens late enough, cart/slot preservation and recovery from invalid/expired codes. | Which passwordless methods launch in V1 and what consent/help language is required? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 08 | Checkout — `/checkout` after a held slot and demo sign-in | Reviews food, Pickup time, contact and total. | Final-review hierarchy and whether anything important is missing before payment. | What tax, packaging, discount and cancellation disclosures must appear here? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 09 | Payment — `/payment` from checkout | Chooses UPI/Card and observes checking, success or failure recovery. | “Do not pay again” guidance and the rule that the kitchen receives only verified Pickup payment. | Which methods, provider language, retry and refund policies should launch? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 10 | Pickup tracking — `/orders/order-pa-1001?scenario=PICKUP_PREPARING` | Tracks confirmed → preparing → ready → picked up → completed. | Status wording, ETA/delay recovery, pickup code and collection instructions. | What status promises can staff and kitchen update reliably? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 11 | Dine-in QR — `/dine-in/start?scenario=DINE_IN_VALID_QR` | Scans/resolves a signed table QR and confirms the returned table. | Trust, wrong/expired-table recovery and prohibition on typed table authentication. | Where will table QRs be placed and who replaces/rotates them? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 12 | Waiter confirmation — `/dine-in/orders/dine-order-1?scenario=DINE_IN_WAITING_WAITER` | Sends a round to the waiter and waits for confirm/clarify/reject. | The distinction between “sent to waiter” and “sent to kitchen,” plus preserved-order recovery. | Can waiters consistently review every Dine-in round before kitchen admission? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 13 | Order More — `/dine-in/order-more?review=ACTIVE_DINE_IN` | Starts another round within the same table session. | Persistent table context, round separation and no accidental Pickup cart crossover. | When should new rounds be blocked—for example after bill request or table close? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 14 | Current Bill / Request Bill — `/dine-in/bill?review=ACTIVE_DINE_IN` | Reviews a read-only estimate and requests the bill. | Staff-owned finalization/payment, taxes/service charge visibility and pause-after-request wording. | What is the real bill-request, service-charge, payment and close-session policy? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 15 | Rewards — `/rewards?review=REWARD_AVAILABLE` | Reads Pizza Points, reserves a reward and can release it before use. | Clear distinction between money, Pizza Points and reservation versus consumption. | What earning, redemption, expiry, reversal and reward-catalog rules are viable? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 16 | Pizza Passport — `/rewards/passport?review=PASSPORT_ONE_LEFT` | Reviews five of six discoveries and opens the remaining eligible pizza. | Discovery framing, completion benefit and sold-out handling. | Which pizzas qualify and is the completion benefit worth the operational cost? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 17 | Personal Missions — `/rewards/missions?review=PERSONAL_MISSION_ACTIVE` | Reviews personalized actions and Avenue XP progress. | Whether the objective feels helpful rather than manipulative; XP is non-redeemable. | Which launch missions are genuinely useful and how are they assigned? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 18 | Common Missions — `/rewards/missions?review=COMMON_MISSION_ACTIVE` | Reviews challenges available to every customer. | Difference from Personal Missions and whether there is too much gamification. | Should common campaigns launch now, and for what duration/XP? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 19 | Profile — `/profile?review=RETURNING_CUSTOMER` | Updates food preferences and notification choices; opens account shortcuts. | Privacy, progressive data collection, allergy warning and shortcut density. | Which profile data is genuinely needed and which notifications require explicit consent? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 20 | Saved Baskets — `/profile/saved-baskets/basket-family-friday?review=SAVED_BASKET_READY` | Reviews, shares, edits or reorders a saved combination after current-menu revalidation. | Difference from a single past-order reorder, stale-item recovery and today’s prices. | Which named basket concepts are understandable and worth supporting? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 21 | Family / Household — `/profile/family?review=FAMILY_CUSTOMER` | Adds/edits optional household preferences. | Whether stored details are appropriate, minimal and clearly private. | Does Pizza Avenue want this data at all, and which fields are permitted? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 22 | Occasions — `/profile/occasions?review=OCCASION_UPCOMING` | Creates an occasion, links a basket and plans the order. | Reminder usefulness, consent, date handling and the relationship to Saved Baskets. | Which occasions, channels and reminder timings should exist? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 23 | Referral — `/rewards/invite?review=REFERRAL_PENDING` | Shares an invite and reads progress to a qualifying completed order. | Qualification transparency, abuse risk and privacy-safe display. | What do both people receive and exactly when does it qualify? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 24 | Taste Card — `/profile/taste-card?review=RETURNING_CUSTOMER` | Previews and shares selected public picks. | Whether this is useful, brand-right and private enough; no account data is shared. | Does a shareable taste identity create acquisition value or only novelty? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 25 | Avenue League — `/rewards/league?review=LEAGUE_ACTIVE` | Reviews opt-in tier/rank/nearby customers and season progress. | Optionality, display-name privacy, pressure and distinction from Pizza Points. | Should competitive ranking launch at all? If yes, what tiers, season and ranking logic? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 26 | Group Ordering — `/group-order/group-friday-team?review=GROUP_ORDER_HOST` | Shares a group, adds participants/items, votes and hands one basket to the host checkout. | Host authority, participant privacy, failure recovery and single-payer rule. | Is this operationally valuable now, and what limits/expiry/host rules apply? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |
| 27 | Returning Customer Home — `/?review=SAVED_BASKET_READY`, then other Home personas | Reviews one contextual prompt at a time across active order, saved basket, occasion, reward, Passport, mission, referral, League and reactivation. | Priority, duplication, relevance and whether Home still feels like ordering—not a dashboard. | Is the priority order right, and which engagement prompt should never appear on Home? | ☐ Keep ☐ Change ☐ Remove ☐ Later | |

## Recovery-state appendix

Use lower-level development scenarios only when the client wants to inspect a failure state: `MENU_NETWORK_ERROR`, `PRODUCT_SOLD_OUT`, `MODIFIER_UNAVAILABLE`, `PICKUP_NEAR_FULL`, `PICKUP_FULL`, `PICKUP_SLOT_FULL`, `PICKUP_HOLD_EXPIRED`, `OTP_INVALID`, `OTP_EXPIRED`, `PAYMENT_FAILURE`, `PICKUP_PAYMENT_TIMEOUT`, `PICKUP_DELAYED`, `PICKUP_STATUS_UNAVAILABLE`, `DINE_IN_NEEDS_CLARIFICATION`, `DINE_IN_REJECTED`, `REWARDS_NETWORK_ERROR`, `PASSPORT_ITEM_UNAVAILABLE`, `MISSIONS_NETWORK_ERROR`, `SAVED_BASKET_STALE`, `FAMILY_NETWORK_ERROR`, `OCCASION_NETWORK_ERROR`, `LEAGUE_NETWORK_ERROR`, `GROUP_ITEM_UNAVAILABLE`, `GROUP_BASKET_CHANGED` and `GROUP_ORDER_NETWORK_ERROR`.

These links are review aids, not production controls or proof of backend behavior.

## Curated screenshot pack

Use these 23 current images when live review is unavailable. They are deliberately representative rather than an exhaustive state library. The `customer-home-*-v2-*` images are the current Home and entry review set.

1. `docs/assets/screenshots/customer-home-service-entry-v2-mobile.png`
2. `docs/assets/screenshots/customer-home-new-v2-mobile.png`
3. `docs/assets/screenshots/customer-home-new-v2-desktop.png`
4. `docs/assets/screenshots/customer-home-returning-v2-mobile.png`
5. `docs/assets/screenshots/customer-home-returning-v2-desktop.png`
6. `docs/assets/screenshots/customer-home-active-pickup-v2-mobile.png`
7. `docs/assets/screenshots/customer-home-active-dine-in-v2-mobile.png`
8. `docs/assets/screenshots/customer-home-dine-in-scan-v2-mobile.png`
9. `docs/assets/screenshots/customer-review-menu-mobile.png`
10. `docs/assets/screenshots/customer-review-builder-mobile.png`
11. `docs/assets/screenshots/customer-commerce-pickup-review-mobile.png`
12. `docs/assets/screenshots/customer-commerce-pickup-tracking-desktop.png`
13. `docs/assets/screenshots/customer-commerce-dine-in-waiter-mobile.png`
14. `docs/assets/screenshots/customer-rewards-mobile.png`
15. `docs/assets/screenshots/customer-passport-mobile.png`
16. `docs/assets/screenshots/customer-missions-mobile.png`
17. `docs/assets/screenshots/customer-saved-basket-mobile.png`
18. `docs/assets/screenshots/customer-family-mobile.png`
19. `docs/assets/screenshots/customer-occasion-mobile.png`
20. `docs/assets/screenshots/customer-referral-mobile.png`
21. `docs/assets/screenshots/customer-league-desktop.png`
22. `docs/assets/screenshots/customer-group-order-desktop.png`
23. `docs/assets/screenshots/customer-profile-mobile.png`
