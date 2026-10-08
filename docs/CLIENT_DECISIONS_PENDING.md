# Pizza Avenue Customer V1 — Client Decisions Pending

## How to use this register

These are owner decisions required before UX freeze or production implementation. The prototype values are examples, not silent approvals. Record one decision owner and a dated answer for every row; use **Keep / Change / Remove / Later** where the feature itself remains optional.

## Menu

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| MENU-01 | Confirm the final sellable product list and exact display names. | 29 preliminary seed items; not production menu truth. | |
| MENU-02 | Confirm categories, ordering and whether any item belongs in multiple discovery groups. | Eight discovery categories. | |
| MENU-03 | Confirm every variant price in INR, inclusive/exclusive tax treatment and effective date. | Integer-paise sample prices. | |
| MENU-04 | Confirm real sizes, crusts, cheeses, toppings, dips and per-option price deltas. | Example modifier groups and limits. | |
| MENU-05 | Confirm required/min/max rules, incompatible combinations and free-versus-paid substitutions. | Required crust; bounded optional extras. | |
| MENU-06 | Confirm add-on/upsell catalog and which cart contexts may show it. | Restrained contextual sample add-ons. | |
| MENU-07 | Define sold-out duration, who controls it, whether alternatives are suggested and when an item disappears. | Unavailable items remain visible with recovery. | |
| MENU-08 | Approve final descriptions, dietary claims, allergen wording and photography for each item. | Seed copy and three candidate photos only. | |

## Pickup

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| PICKUP-01 | Launch ASAP, scheduled Pickup or both? | Both shown. | |
| PICKUP-02 | Minimum/maximum lead time by daypart and busy state. | Example 25–30 minutes; busy examples are longer. | |
| PICKUP-03 | Scheduled slot interval, opening horizon and same-day cutoff. | Example same-day slots. | |
| PICKUP-04 | Capacity units per order/item and who may pause/reopen ordering. | Demonstration states only. | |
| PICKUP-05 | Slot-hold duration and what happens when the hold expires. | Cart is preserved and customer reselects. | |
| PICKUP-06 | Customer cancellation window, refund eligibility and staff authority. | Not decided. | |
| PICKUP-07 | Late customer/late kitchen treatment, revised ETA channel and abandonment rule. | Delayed tracking copy only. | |
| PICKUP-08 | Pickup-code handover and identity check at counter. | Four-digit sample code. | |

## Dine-in

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| DINE-01 | Confirm mandatory waiter review for every round and expected response time. | Required before KDS admission. | |
| DINE-02 | Define allowed rejection and clarification reasons and customer recovery. | Unavailable-item example with preserved round. | |
| DINE-03 | Define customer/staff cancellation and void authority before and after waiter confirmation. | Not decided. | |
| DINE-04 | Decide whether ordering pauses immediately after “Request Bill” and who may reopen it. | Prototype pauses unless staff reopens. | |
| DINE-05 | Decide service-charge percentage/rule, tax display and rounding. | Sample bill supports both; values are not approved. | |
| DINE-06 | Decide accepted end-of-service payment methods and split-payment policy. | Staff-recorded table-bill payment; no customer split flow. | |
| DINE-07 | Define table-session timeout, transfer, merge and close rules. | One signed QR resolves one table session. | |
| DINE-08 | Define QR placement, replacement, expiry and wrong-table support process. | Signed/verified QR concept only. | |

## Loyalty and rewards

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| LOY-01 | Pizza Points earning formula, eligible spend and rounding. | Sample ledger values. | |
| LOY-02 | Redemption ratio and whether Pizza Points may cover all/part of an order. | Catalog-cost model. | |
| LOY-03 | Launch reward catalog, eligibility, stock limits and service-mode restrictions. | Free-dip/sample rewards. | |
| LOY-04 | Pizza Point cost for every reward and maximum concurrent reservations. | Sample costs. | |
| LOY-05 | Point and reward expiry, customer notice and grace policy. | Not decided. | |
| LOY-06 | Refund, cancellation, void and chargeback reversal rules. | Must be ledger-based; values/policy undecided. | |
| LOY-07 | Decide whether Dine-in Points remain pending until the table bill is paid. | Yes in the prototype and frozen business rules. | |
| LOY-08 | Define reward reservation timeout and when a reward becomes consumed. | Reservation is reversible; consumption is not implied. | |

## Pizza Passport

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| PASS-01 | Select qualifying pizzas and whether repeat purchases count more than once. | Six-item discovery program; one stamp per eligible item. | |
| PASS-02 | Define completion benefit, stock/cost ceiling and expiry. | “Completion reward unlocked” without approved economics. | |
| PASS-03 | Define behavior when a qualifying item is permanently removed or temporarily sold out. | Progress preserved; sold-out CTA suppressed. | |
| PASS-04 | Decide whether Passport launches with V1 or later. | Implemented for review, not launch-approved. | |

## Missions and Avenue XP

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| MISS-01 | Select launch Personal Missions and eligibility/assignment rules. | Example veggie/reorder missions. | |
| MISS-02 | Select launch Common Missions and campaign audience. | Example shared campaigns. | |
| MISS-03 | Approve Avenue XP per action and confirm XP is never redeemable money. | Sample XP; explicitly progression only. | |
| MISS-04 | Define campaign duration, expiry, replacement and completed-state retention. | Example dates/statuses. | |
| MISS-05 | Decide whether Personal and Common Missions both launch or one is deferred. | Both implemented for comparison. | |

## Family / household

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| FAM-01 | Does Pizza Avenue want optional household profiles at all? | Implemented for explicit Keep/Remove/Later review. | |
| FAM-02 | Approve permitted fields: display name, relationship, day/month birthday, preference, favourites, avoid list. | No phone/email/full birth year stored in prototype. | |
| FAM-03 | Define retention/deletion/export rules and staff visibility. | Private-to-account statement only. | |
| FAM-04 | Approve allergy disclaimer and escalation wording. | Preference-only warning; not a safety guarantee. | |

## Occasions

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| OCC-01 | Approve occasion types and whether free-text/custom is allowed. | Seven example types. | |
| OCC-02 | Approve reminder timings. | None, one day, three days or one week. | |
| OCC-03 | Approve reminder channels and consent/opt-out behavior. | Not integrated; UI preference only. | |
| OCC-04 | Decide whether a Saved Basket link is required to plan an occasion. | Optional until “Plan order.” | |
| OCC-05 | Decide whether Occasions launch now or after core ordering proves repeat use. | Implemented for review. | |

## Referrals and Taste Card

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| REF-01 | Define referrer benefit, value, expiry and inventory restrictions. | Free Garlic Knots example. | |
| REF-02 | Define referred-customer benefit. | Not approved. | |
| REF-03 | Define qualification: verified identity, eligible paid first order, completion, minimum spend and refund reversal. | Verified + qualifying completed paid first order. | |
| REF-04 | Define abuse/duplicate-household/self-referral controls and support policy. | Not implemented. | |
| REF-05 | Decide whether Taste Card supports acquisition enough to keep. | Public selected picks + Passport count only. | |
| REF-06 | Approve Taste Card fields, share copy and channels. | Explicitly excludes phone, email, birthday, Points, orders and household data. | |

## Avenue League

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| LEAGUE-01 | Launch decision: Yes / No / Later. | Optional opt-in prototype. | |
| LEAGUE-02 | Approve tier names and thresholds. | Starter, Bronze, Silver, Gold, Avenue Club examples. | |
| LEAGUE-03 | Define ranking logic and eligible Avenue XP events. | Sample XP ranking, not direct spend. | |
| LEAGUE-04 | Define season length, reset, ties, prizes and previous-season display. | Monthly example. | |
| LEAGUE-05 | Approve opt-in, display-name, low-rank hiding, deletion and privacy rules. | Rank hidden until opt-in + meaningful participation. | |
| LEAGUE-06 | Decide whether any prize is offered and how gaming/fraud is handled. | No approved prize. | |

## Group ordering

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| GROUP-01 | Launch now or later. | Implemented for review; not launch-approved. | |
| GROUP-02 | Define host authority: invite, remove, edit, close and final basket ownership. | Host finalizes one Pickup checkout. | |
| GROUP-03 | Participant limit, group expiry, inactivity and host-left behavior. | Example states; no approved limits. | |
| GROUP-04 | Decide whether guest participants must sign in. | Display-name prototype only. | |
| GROUP-05 | Confirm single host payment and no split billing for V1. | Single host payment. | |
| GROUP-06 | Decide whether polls are useful or unnecessary scope. | Optional single-choice poll example. | |

## Brand and content

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| BRAND-01 | Supply/approve the final Pizza Avenue logo and wordmark usage. | Text wordmark only; no invented logo. | |
| BRAND-02 | Supply/approve production food photography and provenance. | Three local candidate seed images; fallbacks for other items. | |
| BRAND-03 | Approve final visual tone: warm, editorial, confident and food-led. | Current Pizza Wave-informed Pizza Avenue system. | |
| BRAND-04 | Approve Phudu display + Poppins body typography and font licensing/provenance. | Self-hosted current pair. | |
| BRAND-05 | Approve the final palette and contrast adjustments. | Official seven reference colors mapped to semantic roles. | |
| BRAND-06 | Approve capitalization, “Dine-in/Dine In,” “Pickup,” “Pizza Points” and “Avenue XP” voice rules. | Current customer-facing vocabulary. | |

## Legal, privacy and consent

| ID | Owner decision required | Current prototype position | Decision / owner / date |
|---|---|---|---|
| LEGAL-01 | Approve Privacy Policy content, controller/contact and retention/deletion requests. | Placeholder/help surface only. | |
| LEGAL-02 | Approve Terms, ordering contract, cancellation/refund and dispute wording. | Not production-ready. | |
| LEGAL-03 | Approve allergen/cross-contamination wording and staff escalation. | Preference-only warning. | |
| LEGAL-04 | Define transactional versus marketing notification consent, channel and opt-out. | Separate toggles, no provider integration. | |
| LEGAL-05 | Approve loyalty/referral/League terms, expiry and fraud clauses. | Not production-ready. | |
| LEGAL-06 | Define age/minor policy for household data, referrals and competitions. | Not decided. | |
| LEGAL-07 | Approve cookies/session/analytics notice and data-sharing disclosures. | No production notice approved. | |

## Freeze gate

UX freeze must not be declared until the owner has resolved or explicitly deferred all P0/P1 decisions, approved the final menu/brand/legal inputs, and signed the relevant rows in `CLIENT_REVIEW_SCORECARD.md`.
