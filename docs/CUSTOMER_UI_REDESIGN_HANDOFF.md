# Pizza Avenue Customer UI Redesign Handoff

## Current state

- **Change queue:** `CHG-0029`
- **Branch:** `feature/customer-reference-home-ui`
- **Status:** `IN_PROGRESS`
- **Last updated:** 2026-10-10
- **Current milestone:** Phase-one implementation and local validation complete; commit/push/PR pending
- **Pull request:** Pending
- **Last completed step:** Code, focused/full tests, TypeScript, four builds, audit/diff checks and responsive Chrome/CDP review completed.

This document is the resumable source of truth for the Customer-only visual redesign. Update it whenever implementation status, test truth, screenshots, risks or the next action changes.

## Locked decisions

- Match the supplied case study's structure, density, cards, food-image treatment and floating navigation; retain Pizza Avenue's governed identity.
- Keep the official Cream, Sand, Maroon, Italian Brown, Olive, Sage and Espresso palette.
- Keep Phudu for expressive display type and Poppins for functional UI.
- Convert the onboarding visual language into the existing Pickup/Dine-in service choice; do not add onboarding slides.
- Use direct one-tap service cards.
- Keep all five destinations: Home, Menu, Orders, Rewards and Profile.
- Use the floating dock on eligible Pickup/customer routes; keep the reference-style compact header local to entry/Home in this phase.
- Redesign every existing Home state: new, returning, active Pickup, active Dine-in, busy, paused and closed.
- Treat 430px portrait as the canonical fidelity target; also verify 360, 390, 768 and 1440px.
- Use only current Customer-owned local imagery. No remote or generated assets.
- Preserve all backend-authoritative money, availability, service, payment and state boundaries.

## Reference extraction map

| Reference | Adopt now | Defer | Reject |
| --- | --- | --- | --- |
| 1 | 430px target, 20px gutters, four-column grid, 24px rhythm | — | Device-frame decoration |
| 2 | Photo-led service entry, image-to-content gradient, pill actions | — | Delivery onboarding, third-party photography/copy |
| 3 | Compact context header, craving headline, search pill, category rail, featured food cards | Marketplace filtering | Delivery address, restaurants, calorie/weight claims |
| 4 | Floating dark dock, strong active state, lower-page card rhythm | — | Four-item information architecture |
| 5 | Search and compact list lessons | Menu/Search redesign | Restaurant marketplace and delivery filters |
| 6 | Large food crops and two-column food-card rhythm | Product/Menu redesign | Temperature, nutrition and unsupported offers |
| 7 | Clear cart hierarchy | Cart redesign | Current phase implementation |
| 8 | Grouped settings surfaces | Profile redesign | Current phase implementation |
| 9 | Circular icon anchors and outlined modular cards | — | Diagram content as app UI |
| 10 | Food-led contrast and modular composition | Wider brand campaign work | Orange/black/white identity and reference logo |

## Screen and state matrix

| Screen/state | 430 | 360 | 390 | 768 | 1440 | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Service entry / open | Verified | Verified | Verified | Verified | Verified | `VERIFIED` |
| Busy / paused / closed Pickup | Verified | Responsive rules shared | Responsive rules shared | Responsive rules shared | Responsive rules shared | `VERIFIED` at 430 |
| New Pickup Home | Verified | Verified | Verified | Verified | Verified | `VERIFIED` |
| Returning Pickup Home | Verified | Responsive rules shared | Responsive rules shared | Responsive rules shared | Responsive rules shared | `VERIFIED` at 430 |
| Active Pickup Home | Verified | Responsive rules shared | Responsive rules shared | Responsive rules shared | Responsive rules shared | `VERIFIED` at 430 |
| Active Dine-in Home | Verified | Responsive rules shared | Responsive rules shared | Responsive rules shared | Responsive rules shared | `VERIFIED` at 430 |
| Loading / recoverable failure | Verified | Responsive rules shared | Responsive rules shared | Responsive rules shared | Responsive rules shared | `VERIFIED` at 430 |

## Component map

| Component | Responsibility | Status |
| --- | --- | --- |
| `CustomerHomeHeader` | Root-only brand/store/service/cart header | `VERIFIED` |
| `ServiceEntry` | Photo-led service choice with direct semantic actions | `VERIFIED` |
| `HomeSearchRow` | Craving headline, labelled search and menu discovery action | `VERIFIED` |
| `HomeCategoryRail` | Four pizzeria-specific discovery routes | `VERIFIED` |
| `FeaturedFoodRail` | Image-led, typed-menu featured products | `VERIFIED` |
| `HomeProductCard` | Compact product presentation and safe product navigation | `VERIFIED` |
| `UsualOrderFeature` | Returning-customer current-menu reorder/edit card | `VERIFIED` |
| `OperationalStatusCard` | Capacity and active service priority state | `VERIFIED` |
| `CustomerDock` | Five labelled Phosphor destinations in a safe-area floating dock | `VERIFIED` |

## Token contract

- Mobile outer gutter: `20px`.
- Canonical mobile columns: four equal columns.
- Canonical grid/major rhythm: `24px`.
- Minimum important touch target: `44px`.
- Card radii: `16–20px`; image/hero radius may be larger; controls and dock use pill radii.
- Canvas/surface: Cream and Sand; dark controls: Espresso; active/primary: Maroon; operational success only: Olive/Sage.
- Motion: transform/opacity only, 140–220ms, reduced-motion equivalent required.

## Icon and asset inventory

- Icon library for this phase: `@phosphor-icons/react` only.
- Existing local images:
  - `/assets/seed/hero-main-pizza.png`
  - `/assets/seed/mushroom-cheese-pizza.png`
  - `/assets/seed/cheesy-garlic-bread.png`
- No cross-app asset imports.
- Missing product photography uses the designed Phosphor pizza fallback; it never borrows unrelated imagery.

## Implementation checklist

- [x] `VERIFIED` — reference, product rules, current code and existing screenshots audited.
- [x] `VERIFIED` — structure-first fidelity, direct service actions, five-item dock, all Home states and responsive strategy approved.
- [x] `VERIFIED` — baseline Customer TypeScript check passed.
- [x] `VERIFIED` — baseline focused Customer suite passed: 67 tests.
- [x] `VERIFIED` — update service entry and root-specific shell/header behavior.
- [x] `VERIFIED` — implement Home search/category/featured-product hierarchy.
- [x] `VERIFIED` — refactor returning and active operational presentations.
- [x] `VERIFIED` — apply the floating dock to every eligible Pickup route and suppress it before selection/Dine-in.
- [x] `VERIFIED` — extend component and behavior tests.
- [x] `VERIFIED` — repository lint, typecheck, tests, builds, audit, secret scan and diff checks.
- [x] `VERIFIED` — capture and review responsive screenshots.
- [x] `VERIFIED` — update changelog, visual-direction docs and queue result.

## Validation log

| Date | Command/check | Result |
| --- | --- | --- |
| 2026-10-10 | `pnpm --filter @pizza-avenue/customer typecheck` | Passed |
| 2026-10-10 | `pnpm exec vitest run apps/customer/src/app/customer-ui.test.tsx apps/customer/src/app/app.test.tsx --maxWorkers=1 --reporter=verbose` | 2 files, 67 tests passed |
| 2026-10-10 | same focused suite after refinement | 2 files, 70 tests passed |
| 2026-10-10 | changed-file `eslint` command | Passed, zero warnings |
| 2026-10-10 | `pnpm exec eslint . --ignore-pattern ".claude/**" --max-warnings=0` | Passed, zero warnings |
| 2026-10-10 | first `pnpm lint` run | Found 128 CommonJS/global errors in an ignored local `.claude/skills/security-audit/` directory |
| 2026-10-10 | final `pnpm lint` after mirroring the existing `.claude/**` ignore in ESLint | Passed, zero warnings |
| 2026-10-10 | `pnpm typecheck` | Passed across the repository |
| 2026-10-10 | `pnpm test --maxWorkers=1` | 15 files, 188 tests passed |
| 2026-10-10 | `pnpm build` | Landing, Customer, KDS and Admin passed |
| 2026-10-10 | `pnpm audit --prod` | No known vulnerabilities |
| 2026-10-10 | high-confidence secret-pattern scan of text diff | Passed |
| 2026-10-10 | `git diff --check` | Passed |

## Screenshot evidence

Chrome/CDP checks reported no document overflow, visible broken images or unlabeled controls for the successful routes below. The intentional horizontal rails expose continuation without increasing document width. The menu-failure persona produces the expected mocked HTTP 503 console entry and renders the recovery UI.

| Scenario | Viewport | Artifact |
| --- | --- | --- |
| Service entry | 360×800 | `docs/assets/screenshots/customer-entry-reference-360.png` |
| Service entry | 390×844 | `docs/assets/screenshots/customer-entry-reference-390.png` |
| Service entry | 430×932 | `docs/assets/screenshots/customer-entry-reference-430.png` |
| Service entry | 768×1024 | `docs/assets/screenshots/customer-entry-reference-768.png` |
| Service entry | 1440×1000 | `docs/assets/screenshots/customer-entry-reference-1440.png` |
| New Pickup Home | 360×800 | `docs/assets/screenshots/customer-home-new-reference-360.png` |
| New Pickup Home | 390×844 | `docs/assets/screenshots/customer-home-new-reference-390.png` |
| New Pickup Home | 430×932 | `docs/assets/screenshots/customer-home-new-reference-430.png` |
| New Pickup Home | 768×1024 | `docs/assets/screenshots/customer-home-new-reference-768.png` |
| New Pickup Home | 1440×1000 | `docs/assets/screenshots/customer-home-new-reference-1440.png` |
| New Pickup Home, landscape + reduced motion | 844×390 | `docs/assets/screenshots/customer-home-new-reference-landscape.png` |
| Returning Pickup | 430×932 | `docs/assets/screenshots/customer-home-returning-reference-430.png` |
| Active Pickup | 430×932 | `docs/assets/screenshots/customer-home-active-pickup-reference-430.png` |
| Active Dine-in | 430×932 | `docs/assets/screenshots/customer-home-active-dine-in-reference-430.png` |
| Busy Pickup | 430×932 | `docs/assets/screenshots/customer-home-busy-reference-430.png` |
| Paused Pickup | 430×932 | `docs/assets/screenshots/customer-home-paused-reference-430.png` |
| Closed Pickup | 430×932 | `docs/assets/screenshots/customer-home-closed-reference-430.png` |
| Recoverable menu failure | 430×932 | `docs/assets/screenshots/customer-home-failure-reference-430.png` |

## Known risks

- Final food photography, logo approval and asset provenance remain owner decisions.
- Only three Customer-owned food images are available, so designed fallbacks remain necessary.
- The reference's orange/black/white identity cannot replace the frozen Pizza Avenue palette.
- Real-device iOS Safari and Android Chrome camera/safe-area review remains necessary after browser validation.
- GitHub CLI is unavailable in this environment, so Issue/PR creation requires the app/browser or a later environment with GitHub tooling.
- Unrelated local `.dockerignore`, `.gitignore` and `docs/assets/brag/` changes must remain untouched.

## Next action

Commit only the CHG-0029 files, push `feature/customer-reference-home-ui`, and create/update the required Pull Request. Keep the unrelated `.dockerignore`, `.gitignore` and `docs/assets/brag/` work out of the commit.

## Continuation prompt

> Continue Pizza Avenue `CHG-0029` on branch `feature/customer-reference-home-ui`. Read `AGENTS.md`, the mandatory frontend documents, and `docs/CUSTOMER_UI_REDESIGN_HANDOFF.md`. Preserve unrelated `.dockerignore`, `.gitignore` and `docs/assets/brag/` changes. Phase-one code, screenshots and local validation are complete. Commit only the recorded CHG-0029 files, push the feature branch, create/update the required Pull Request, record its URL/status here and in the queue, and keep all backend-authoritative behavior unchanged.
