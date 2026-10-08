# Customer Home Architecture

## Purpose

The Customer Home is an ordering surface, not a marketing feed. It must answer three questions in sequence:

1. What can I order right now?
2. What should I probably order?
3. What would complete the meal?

The composition uses salience, progressive disclosure, familiarity, social proof, clear defaults and progress. It does not use fake scarcity, hidden fees, preselected paid additions or misleading discount anchors.

## Universal entry — no service context

1. Restaurant identity and one-sentence service explanation.
2. Pickup as an order-ahead card with current store state, credible ETA and one primary action.
3. Dine-in as a table-QR card explaining waiter confirmation and one scan action.
4. Sainikpuri location and “no delivery address needed” reassurance.

Pickup selection creates only a local service context and emits `service_mode_selected`. Dine-in never accepts a typed table number; `/dine-in/start?t=<opaque_token>` must resolve the table server-side. A direct visit without a token opens a permission-first scanner: the customer explicitly starts the environment-facing camera, scans the QR fixed to the table, sees the verified table and then chooses Start Ordering. Native-camera deep links remain the shortest path. Unsupported/denied camera states explain recovery and keep Pickup available.

## New Pickup customer

| Order | Module | Customer job | UX reason |
| --- | --- | --- | --- |
| 1 | Store context | Confirm availability and ETA | Removes fulfilment uncertainty before appetite decisions. |
| 2 | Proven-favourite hero | Start confidently | Social proof reduces first-order risk without copying another brand. |
| 3 | Craving routes | Narrow the menu | Four recognizable intents reduce choice overload. |
| 4 | Dinner-for-two plan | Build a complete basket | A concrete but fully optional meal structure supports AOV transparently. |
| 5 | Bestsellers | Compare a small set | Four seed-backed products avoid an overwhelming catalog wall. |
| 6 | Taste discovery | Browse by desired outcome | “Cheesy/spicy/vegetarian/herby” matches how people describe cravings. |
| 7 | Meal completers | Add only relevant extras | Sides, dip, dessert and drink remain separate, priced and optional. |
| 8 | Brand reassurance | Resolve final hesitation | Clear local, pickup and table-service promises close the decision loop. |

## Returning Pickup customer

| Order | Module | Customer job | UX reason |
| --- | --- | --- | --- |
| 1 | Store context | Confirm today’s promise | Returning customers still need availability truth. |
| 2 | Usual order | Repeat with minimal effort | Recognition beats rediscovery; Edit remains equally understandable. |
| 3 | Current-price notice | Avoid surprise | Reorder maps history to today’s menu and never reuses stale money. |
| 4 | Dinner-for-two plan | Expand when relevant | Presents a meal idea without automatic additions. |
| 5 | Bestsellers | Offer a safe alternative | Helps when the usual is not wanted or unavailable. |
| 6 | One `Your Avenue` cue | Surface the single best personal next action | Prevents loyalty, missions and occasions becoming competing dashboards. |
| 7 | Taste discovery and completers | Explore or add | Lower priority than the habitual ordering shortcut. |

## Active operational states

### Active Pickup

Store context and live tracking are first. The card names the current state, promised collection time and tracking action. Retention and engagement modules are suppressed until the order is complete; food browsing can remain available for deliberate discovery.

### Active Dine-in

Trusted table context becomes the Home. The order is: session/table identity → Order More → Current Bill → Call Waiter → quick additions → menu search. Pickup modules, historical reorder and retention cues do not appear. Waiter confirmation and bill/payment remain authoritative outside the browser.

## Adaptive `Your Avenue` priority

At most one module is shown and only for a returning Pickup customer without an active order:

1. Saved Basket
2. Upcoming Occasion
3. Available Reward
4. Near-complete Passport
5. Personal Mission
6. Ordinary Passport progress
7. Referral update
8. Common Mission
9. League progress
10. Reactivation
11. Pizza Points progress

## Seed and authority rules

- Visible menu recommendations come from the typed current menu response and its 29-item mock seed, not duplicated Home-only prices.
- Order Again maps purchased product/variant identifiers to the current menu and creates the normal Pickup cart.
- Historical names remain display snapshots; current availability and money are rechecked.
- Store state, ETA, menu availability, prices, table identity, order state, bill and payment are ultimately backend-authoritative in production.

## Review criteria

- A first-time customer can distinguish Pickup from Dine-in without reading fine print.
- A new Pickup customer reaches a confident product choice before encountering loyalty mechanics.
- A returning customer can repeat or edit the usual order in one decision.
- An active customer sees the operational next action before any discovery content.
- No paid extra is selected automatically and no claim implies an unapproved discount.
- At 360, 390, 430, 768 and 1440 pixels there is no horizontal overflow, clipped primary action or inaccessible unlabeled control.

## Measurement

Use the existing events `service_mode_selected`, `product_viewed`, `reorder_clicked`, `upsell_shown`, `upsell_accepted`, `bundle_viewed` and `bundle_added`. Evaluate service-choice completion, Home-to-product rate, reorder completion, items per order, side/drink/dessert attach and checkout conversion. Client events measure interaction only; operational and financial reporting remains server-authoritative.
