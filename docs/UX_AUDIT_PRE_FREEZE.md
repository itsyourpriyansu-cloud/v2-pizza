# Pizza Avenue Customer V1 — Pre-Freeze UX Audit

## Audit status

- Audit date: 2026-10-08
- Scope: complete Customer PWA prototype on `feature/customer-ux-review-prep`
- Baseline: `feature/customer-engagement-complete-v1` at `184d2ed843fb6c5c690d1dad98aedba5ed23e761`
- Method: code/contract inspection, complete automated regression, deterministic MSW scenarios, Chrome-rendered route matrix, 390/1440 review, 360/430/768 spot checks, DOM overflow/control/image checks, console/network capture and representative screenshots
- Constraint: this is a prototype audit, not formal WCAG certification, penetration testing, production backend verification or legal approval.

## Executive assessment

The Customer prototype is suitable for a structured restaurant-owner review after the safe fixes on this branch. Core ordering remains visually dominant, Pickup and Dine-in authority boundaries are understandable, and no P0 or unresolved P1 UX blocker was found. UX freeze is not yet appropriate: menu/brand/legal/economic decisions and the P2 production-hardening items below remain open.

## Severity register

### P0 — transaction-breaking, privacy or critical workflow

No P0 issue found in the prototype review scope.

### P1 — major confusion or important broken journey

All identified P1 review blockers were resolved on this branch:

| Finding | Resolution |
|---|---|
| A single `?scenario=` changed only one mock domain, so Home personas were contaminated by higher-priority default states and Active Dine-in lacked table context. | Added development-only, complete `?review=` personas that reset all scenario domains and apply Pickup/Dine-in context deterministically. |
| Returning Home showed both generic “Order again” and a Saved Basket prompt, creating duplicate repeat-order CTAs. | Generic reorder now appears only when no contextual engagement module is selected. |
| Home omitted ordinary Passport progress from the required priority between Personal Mission and Referral. | Added the bounded Passport-in-progress card at the documented priority. |
| Saved Basket stale recovery claimed Garlic Knots were ₹229 while the live menu was ₹169 and carried the historical price into cart. | Current menu seed now determines the revalidated cart unit price and recovery message; estimated-current totals were corrected. |
| Customer screens exposed internal/mock terminology and raw state labels in payment, auth, orders, rewards and Dine-in. | Replaced with customer-facing status/copy while preserving explicit “prototype/demo” disclosure where required. |

### P2 — important before production

| Area | Finding | Recommended correction-pass or production action |
|---|---|---|
| Menu truth | Products, categories, prices, modifiers and availability rules are preliminary. | Replace only after owner signs `CLIENT_DECISIONS_PENDING.md`; validate imported money in integer paise. |
| Brand assets | Most products intentionally use a designed fallback because approved, content-matched photography is unavailable. | Supply licensed production images and final logo; recapture visual sign-off. |
| Offline | Network failures have recovery, but there is no global offline detector/banner or queued mutation strategy. | Define production offline scope; at minimum add clear connection status and safe retry. Do not imply offline ordering. |
| Session expiry | OTP/magic-link expiry is covered, but a production-wide expired-session/401 recovery cannot be proved without the backend/session implementation. | Add centralized production session-expiry handling later, preserving cart and service mode where safe. |
| Page titles | Browser document title is currently the generic “Pizza Avenue” across routes. | Add route-specific titles before production for orientation and accessibility. |
| Focus management | Visible focus styles exist, but route-change focus restoration and dialog/confirmation behavior are not centrally managed. | Perform a manual keyboard/screen-reader pass and add route focus management if needed. |
| Destructive actions | Saved Basket deletion is immediate and has no confirmation/undo. | Add an accessible confirmation or reversible undo during the correction pass if the client keeps Saved Baskets. |
| Form validation | Occasion dates and household birthdays use basic browser bounds but do not prove full calendar/business validation. | Enforce valid dates and business rules in both frontend and future backend. |
| Legal copy | Privacy, terms, allergen, loyalty, referral and competition language is directionally safe but not counsel-approved. | Obtain owner/legal approval before freeze or launch. |
| Production accessibility | Contrast and assistive-technology behavior were reviewed structurally/visually, not measured/certified. | Run formal contrast and screen-reader checks after final brand assets/tokens. |
| Commerce proof | MSW verifies client behavior, not real payment idempotency, capacity locking, webhook authenticity, RBAC or persistence. | Keep outside UX freeze claim; validate in the future backend phase. |

### P3 — visual polish or optimization

- The long Profile and Referral pages are dense on small phones; consider progressive disclosure only if client testing confirms fatigue.
- Horizontal category rails intentionally reveal a partial next chip on desktop/mobile; confirm the client prefers this discoverability cue.
- Some engagement detail pages leave generous desktop whitespace because content width is intentionally bounded; tune after final content, not before.
- Normalize title casing for all client-approved menu/category content during the data-correction pass.
- Replace remaining fallback imagery and recapture the screenshot pack after final photography.

## Home audit

### Verified priority

1. Active Dine-in — early-return table workspace; no engagement cards.
2. Active Pickup — tracking hero first.
3. Reorder / Saved Basket — contextual Saved Basket wins; generic reorder appears only if no contextual module exists.
4. Upcoming Occasion.
5. Reward available.
6. Passport one-left.
7. Personal Mission.
8. Ordinary Passport progress.
9. Referral.
10. Common Mission.
11. Avenue League.
12. Reactivation; otherwise generic discovery.

The Home selects a single contextual engagement module. Active service/order status may coexist above one secondary module, but the primary operational action remains dominant. The review found no duplicate progress bars, repeated message or competing engagement CTA after the fixes.

### Client questions

- Is Saved Basket truly more useful than Occasion/Reward for most returning customers?
- Should active Pickup suppress the secondary engagement module entirely?
- Should Referral or League ever appear on Home, or only inside Rewards/Profile?
- Is the favourite product card useful when imagery is not yet approved?

## Navigation and information hierarchy

- The five-item bottom navigation remains frozen: Home, Menu, Orders, Rewards, Profile.
- Dine-in routes intentionally remove Pickup navigation and retain table context.
- Secondary features remain within Rewards/Profile so engagement scope does not expand the primary navigation.
- Every audited route exposes one H1 and an understandable first viewport.
- Product cards align consistently; category selection is horizontally scrollable without document overflow.
- No broken route or dead-end was found in the regression set. Error states point to retry, preserved data, a safe parent route or staff help.

## Primary and secondary CTAs

- Ordering routes maintain one visually dominant filled CTA; secondary/back actions use outline or text styles.
- Sticky actions remain above the mobile navigation in audited flows.
- Host checkout, waiter submit, bill request, reward use and profile save state their authority and consequence.
- Group polls use real buttons with selected state; the host, not participants, owns checkout.
- P2: destructive Saved Basket delete needs confirmation/undo if the feature survives review.

## Copy and language

- Payment, Pickup and Dine-in now use customer phrases such as “We’re checking your payment,” “Waiting for waiter confirmation,” “Ready for pickup” and “Reward available.”
- Raw enum formatting was replaced on core statuses; internal terms such as “mock server,” `ITEM_UNAVAILABLE`, “server state” and “service context” were removed from customer copy.
- Prototype-only disclosure remains plain language: “Payment preview,” “Demo mode,” and “For this prototype, use 123456.”
- Pizza Points, Avenue XP, Passport and Missions are named consistently enough for review; client terminology approval remains open.

## Money, Pizza Points, Avenue XP and progress

- INR is formatted from integer paise using the shared `formatMoney` utility.
- Product Builder calculation is explicitly “Provisional total”; cart/checkout explain later verification.
- Saved Basket history and current revalidation are distinct; current menu values now populate the handoff cart.
- Pizza Points are redeemable reward value and are now labeled “Pizza Points” on the primary Rewards surfaces.
- Avenue XP is repeatedly described as non-redeemable progression and drives Missions/optional League only.
- Passport uses discovery counts/stamps, not currency language.
- Missions describe actions/goals and award Avenue XP.
- League is opt-in competition powered by Avenue XP, not spend or Pizza Points.

## Price audit

Search scope covered Customer UI, types, utilities and MSW fixtures/handlers.

- No customer component owns authoritative production totals.
- Money contracts use safe integer paise; no floating-point monetary storage was found.
- Builder adds integer base price and modifier deltas only for provisional display.
- Cart quote/payment/bill totals come through typed API-client responses.
- Direct `₹` literals remain only in tests and explanatory type documentation after the Saved Basket fix.
- Mock Pickup price-change copy uses a bounded fixture adjustment; production remains backend-authoritative.
- Group/Saved Basket pseudo-carts remain prototypes and must be replaced by authoritative production validation.
- All menu prices remain owner-pending; this audit certifies consistency, not correctness of the commercial values.

## Forms

- Visible labels or label-wrapped controls exist for auth, builder, Pickup slots, profile, family, occasions, payment and group inputs.
- Builder min/max/required rules preserve selections and announce inline errors.
- Failed mutations preserve the customer’s prior data/input in the audited flows.
- Disabled/unavailable options remain visible with an explanation rather than disappearing.
- P2: date/business validation and server-side enforcement remain future work.

## Progress indicators

- Pizza Points, Passport, Missions and League progress bars expose `role="progressbar"`, label, min/max and current value.
- Pickup and Dine-in timelines include visible current state and non-color symbols.
- Hold countdown uses a polite live region.
- The audited Home contains at most one contextual progress concept.

## Global UX states

| State | Result | Evidence / limitation |
|---|---|---|
| Loading | Pass | Shared labeled skeleton plus route suspense pending state. |
| Skeleton | Pass | Menu/order/rewards/profile/engagement query pages use `PageSkeleton`. |
| Empty | Pass | Search, cart, rewards, missions, saved baskets, family and occasions include recovery/action. |
| Network error | Pass for prototype | Deterministic menu/rewards/passport/missions/profile/engagement error scenarios expose retry or safe parent action. |
| Offline | Partial / P2 | Errors preserve state; no global browser-offline indicator or production queue. |
| Session expired | Partial / P2 | OTP/magic expiry works; future production-wide cookie-session recovery is not implemented. |
| Disabled | Pass | Sold-out items, unavailable modifiers, full slots and pending mutations remain visible and explained. |
| Conflict | Pass | Price/item/modifier/service-mode/group changes preserve recoverable work in tests. |
| Retry | Pass | Menu outage, quote/status errors and most query states expose retry without destructive reset. |
| Success | Pass | Status cards, navigation and polite toast/live regions confirm successful actions. |

## Responsive visual review

### Evidence

- 390 × 844 and 1440 × 1000: Home, Menu, Product, Builder, Rewards, Passport, Missions, Profile, Saved Basket, Family, Occasion, Referral, Taste Card, League and Group Order.
- Existing current screenshots cover Cart, Pickup checkout, Pickup tracking and the Dine-in waiter gate.
- Spot checks: Home at 360 × 800, 430 × 900 and 768 × 900.

### Result

- No document-level horizontal overflow at any audited width.
- No in-viewport broken images, unlabeled interactive controls, console warning/error or failed network request in the Chrome matrix.
- Mobile first view communicates route purpose and primary CTA in roughly three seconds.
- Desktop uses intentional max-width grids/sticky summaries rather than stretched mobile cards.
- Mobile controls meet the current 44px-equivalent target through 2.75rem minimum heights; navigation items are larger.
- Food is visually dominant on the Home hero and approved menu photography; fallback cards are intentionally visible pending asset approval.
- Category rails and the fixed mobile navigation behave as intended; no CTA was hidden by the navigation in reviewed states.

## Accessibility review

- Semantic headings: one H1 per audited route; section headings/labels are present.
- Forms: visible labels or enclosing labels; fieldsets/legends for related choices.
- Focus: global high-contrast `:focus-visible` outline exists.
- Keyboard: native links, buttons, radios, checkboxes, selects and inputs dominate; poll choices are buttons.
- Touch targets: primary controls use at least 2.75rem minimum height; slots and navigation exceed it.
- Progress: ARIA progress semantics on Points, Passport, Missions and League.
- Errors: mutation/validation failures generally use `role="alert"` and preserve input.
- Status: availability/table/hold/toast states use `role="status"` or polite live regions.
- Images: meaningful approved images have alt text; decorative icons are hidden from assistive technology.
- Contrast: visually reviewed against current tokens, but formal contrast measurement awaits final palette/assets.

No formal WCAG conformance claim is made.

## Contrarian product audit

The “Client choice” column is intentionally blank. The audit frames the tradeoff; the restaurant owner decides.

| Feature | Why it exists / customer problem | Business metric | Why it could fail | Added complexity | Outcome if removed | Client choice |
|---|---|---|---|---|---|---|
| Rewards | Gives a concrete reason to order direct and makes earned value visible. | Direct-order repeat rate, 30/60-day retention, redemption and margin. | Economics may be confusing, too costly or too slow to feel valuable. | Ledger, eligibility, reservation/consumption, expiry, reversals, fraud and support. | Simpler checkout/profile; weaker explicit direct-order incentive. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Passport | Turns menu exploration into a finite, understandable collection goal. | Category breadth, signature-pizza trial, repeat frequency. | Customers may not care, eligible items may be unavailable, completion reward may cost too much. | Program/versioning, duplicate prevention, product retirement and completion benefit. | Less gamification and maintenance; fewer prompts to try unfamiliar pizzas. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Missions | Gives time-bounded next actions without using blanket discounts. | Targeted repeat, category trial, campaign completion. | Can feel manipulative, repetitive or irrelevant; poor assignment creates noise. | Eligibility, progress, expiry, idempotent award, campaign tooling and copy. | Cleaner Rewards; fewer targeted behavior experiments. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Avenue XP | Separates non-cash progression from redeemable Pizza Points. | Mission participation and optional League engagement. | A second number may confuse customers or have no perceived value. | Separate balance/events, explanation, thresholds and support. | Missions can use badges only and League likely disappears; much simpler mental model. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Family | Speeds repeat group ordering by remembering lightweight preferences. | Family-order frequency, larger basket size, saved-basket use. | Data may feel intrusive or rarely be maintained; allergy expectations create risk. | Sensitive-data governance, consent, edit/delete, retention and safety copy. | Less privacy burden; family use relies on Saved Baskets/free-form memory. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Occasions | Helps customers remember and prepare larger planned orders. | Advance orders, occasion conversion, AOV, reminder conversion. | Reminders may annoy, dates go stale and value depends on Saved Baskets. | Calendar rules, consent/channels, reminders, timezone and deletion. | Simpler Profile; loses a planned-order trigger. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Saved Baskets | Rebuilds common multi-item orders using today’s menu, price and availability. | Reorder conversion, time to checkout, repeat AOV. | Customers may confuse it with order history; stale combinations need careful recovery. | CRUD, snapshots, revalidation, item mapping, share/delete and conflict UX. | Generic past-order reorder remains; complex family/office repeats take more effort. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Referrals | Creates attributable direct acquisition from existing customers. | Qualified referred customers, CAC, first-to-second-order conversion. | Abuse, opaque qualification and weak two-sided value can destroy trust. | Attribution, identity, qualification, reversals, expiry, fraud and terms. | Acquisition relies on organic/paid channels; lower fraud/support burden. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Taste Card | Makes preferences shareable without exposing account/private data. | Shares, referral starts and assisted discovery. | May be novelty with no conversion, or feel off-brand. | Public-safe data projection, share channels, moderation/copy and privacy review. | No ordering loss; social acquisition becomes simpler and less distinctive. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| League | Adds opt-in seasonal competition for highly engaged customers. | Opt-in, repeat frequency, mission participation and seasonal return. | Low ranks discourage, competition can reward spend, and participation may be too small. | Ranking, ties, seasons, display privacy, fraud, resets, prizes and support. | Rewards/Missions remain intact; substantially lower complexity and reputational risk. | ☐ Keep ☐ Change ☐ Remove ☐ Later |
| Group Ordering | Coordinates multiple food choices while preserving one host checkout. | Group-order conversion, AOV, office/friend acquisition. | Real-time conflicts, host abandonment and participant confusion may outweigh demand. | Invitations, roles, expiry, concurrency, polls, item conflicts, privacy and host handoff. | Large orders use Saved Baskets/manual chat; simpler commerce architecture. | ☐ Keep ☐ Change ☐ Remove ☐ Later |

## Freeze recommendation

Proceed to **client review**, not UX freeze. After the owner completes the walkthrough, scorecard and decision register, create a bounded correction task. Do not start the correction pass or backend from this audit branch.
