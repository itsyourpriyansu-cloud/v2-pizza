# 17 — Changelog

## Template
### YYYY-MM-DD — title

Added:
- ...

Changed:
- ...

Fixed:
- ...

Docs updated:
- ...

Decision:
- DEC-xxx

Risk:
- ...

## 2026-10-07 — Complete Customer engagement prototype

Added:
- Saved Baskets with five seeded use cases, custom creation, editing, sharing, deletion, current-menu revalidation and preserved-item stale recovery
- optional Household members and Important Occasions with privacy/safety guidance and existing-cart planning handoff
- referral lifecycle, privacy-safe Taste Card, opt-in seasonal Avenue League and host-paid Group Ordering with polls
- centralized Customer feature flags, typed engagement contracts/API client, deterministic MSW personas and 14 focused mission tests
- ten responsive Customer screenshot artifacts covering the seven feature areas, adaptive Home, and desktop League/Group views

Changed:
- Home now selects one engagement module below active service, current order and reorder priorities
- Profile and Rewards expose the new routes without changing the frozen five-item bottom navigation
- completed Pickup can show League context while served-but-unpaid Dine-in remains economically pending
- all major engagement routes are lazy-loaded and retain the Pizza Avenue typography, warm palette and shared primitives

Fixed:
- referral progress uses a readable vertical timeline on phone widths instead of compressing seven labels
- Points, Passport, Mission and League progress indicators now expose complete progressbar semantics
- reactivation CTA clicks now emit a distinct privacy-safe analytics event

Docs updated:
- `docs/01_PRODUCT_SCOPE.md`, `docs/02_BUSINESS_RULES.md`, `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/07_COMPONENTS.md`, `docs/10_API_CONTRACTS.md`, `docs/12_ANALYTICS_EVENTS.md`, `docs/13_SEED_DATA.md`, `docs/14_TEST_PLAN.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/18_ACCEPTANCE_CRITERIA.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- DEC-027 — complete the client-review engagement prototype through typed frontend/MSW boundaries before production backend implementation

Risk:
- MSW proves frontend contracts and recovery UX only; production ownership, referral qualification, XP calculation, real-time collaboration, idempotency and persistence remain backend work
- thresholds, reward values, reminder policy and Saved Basket economics remain subject to client/founder UX review

## 2026-10-07 — Customer retention, profile and preliminary mock menu

Added:
- Customer Rewards hub with Points, next-reward progress, reversible reward reservation, activity, Passport and Missions entry points
- Pizza Passport new/progress/one-left/complete/unavailable states and product links preserving `source=PASSPORT`
- separate Personal/Common Missions with non-redeemable Avenue XP and deterministic completion responses
- practical Profile preferences, favourites, notification controls, allergy warning, help/legal information and local logout
- nine focused retention missions plus six responsive screenshot artifacts

Changed:
- Home now renders one adaptive retention action below active Pickup/Table and reorder priorities
- completed Pickup tracking includes a compact retention summary
- the shared preliminary menu now contains the documented 29 mock items across eight categories
- menu cards use fixed media/content alignment and the single favourite card no longer inherits a two-column layout
- Customer retention routes remain lazy-loaded under `/rewards`, `/rewards/passport`, `/rewards/missions` and `/profile`

Fixed:
- reward reservation no longer implies consumption and can be released safely
- served but unpaid Dine-in loyalty is shown as pending; the paid fixture moves it into spendable Points
- Passport sold-out items preserve progress and suppress an invalid Product CTA
- Profile save failures retain the last server response and expose recovery copy

Docs updated:
- `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/07_COMPONENTS.md`, `docs/10_API_CONTRACTS.md`, `docs/12_ANALYTICS_EVENTS.md`, `docs/13_SEED_DATA.md`, `docs/14_TEST_PLAN.md`, `docs/17_CHANGELOG.md`, `docs/18_ACCEPTANCE_CRITERIA.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no architecture decision changed; all balances, progress and final states remain server-authoritative in production

Risk:
- MSW validates frontend boundaries only; production ledger idempotency, paid-bill attribution, permissions and database persistence remain for the NestJS backend
- the 29-item menu, prices, reward costs and earn values remain preliminary pending founder confirmation

## 2026-10-07 — Complete Customer Pickup and Dine-in commerce flows

Added:
- service-mode-isolated Pickup and Dine-in carts with authoritative mock quotes, recovery notices, contextual optional upsells and edit/remove/quantity controls
- phone OTP and verified WhatsApp continuation prototype states that preserve cart and service context
- capacity-aware Pickup selection with ASAP/scheduled slots, reservation countdown, full-slot and expired-hold recovery
- checkout review, payment pending/verified/failure handling, Pickup confirmation and fulfilment tracking
- waiter-gated Dine-in submission, clarification/rejection/accepted/preparing/ready/served states, additional rounds and a read-only current bill
- 15 focused commerce-flow tests and responsive browser evidence for the primary Pickup and Dine-in missions

Changed:
- Customer discovery links and product building now respect the active service mode
- Customer routes use route-level lazy loading; the main entry bundle decreased from 533.25 kB / 164.56 kB gzip to 374.79 kB / 117.18 kB gzip
- the floating cart is limited to discovery routes so it cannot overlap checkout, payment or tracking actions
- the Customer document now declares its theme color and an inline brand favicon, avoiding a stray browser 404
- shared cart, Pickup and analytics types plus API/MSW fixtures now represent the documented commerce recovery states

Fixed:
- Pickup and Dine-in carts no longer share one client cart identity
- Customer-submitted Dine-in rounds cannot visually imply kitchen admission before waiter confirmation
- payment success cannot visually confirm an order before the mock payment response is verified

Docs updated:
- `docs/12_ANALYTICS_EVENTS.md`, `docs/17_CHANGELOG.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no architecture decision changed; these remain production-shaped frontend/MSW flows pending the documented NestJS and provider integrations

Risk:
- MSW proves client flow behavior, not production transaction locking, webhook authenticity, staff RBAC or outbox delivery

## 2026-10-07 — Recover Customer menu from injected outage

Added:
- regression coverage proving the menu can recover from the deterministic `MENU_NETWORK_ERROR` UX scenario
- standard ARIA `role` support on the shared `Surface` primitive used by the in-progress Auth and Checkout states

Changed:
- the Menu retry action now clears only the injected menu-outage scenario, removes its URL flag and refetches through the existing typed API/MSW boundary
- Customer test setup now follows the separate commerce store introduced by CHG-0008 instead of writing removed cart fields into the prototype-scenario store

Fixed:
- a test/review URL containing `?scenario=MENU_NETWORK_ERROR` no longer traps the Customer Menu in a permanent 503 loop when “Try again” is pressed
- current CHG-0008 Customer changes typecheck after the stale test-store fields and missing ARIA prop were corrected

Docs updated:
- `docs/17_CHANGELOG.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no product or architecture decision changed; local UX continues to use MSW because no NestJS backend exists in this repository

Risk:
- `VITE_ENABLE_MOCKS=false` still requires a separately running backend at `VITE_API_BASE_URL`; no service is currently listening on local port 3000

## 2026-10-06 — Customer App UI — UX Implementation V1

Added:
- responsive Customer shell with service-aware context, five-item pickup navigation, loading/error/empty states and transient feedback
- contextual new, returning, loyal and active-order Home states plus busy, paused and closed store messaging
- category Menu, Search states, Product Detail, sold-out alternatives and a continuous Pizza Builder
- deterministic menu/network/availability scenarios and focused Customer route/interaction coverage
- vendor-neutral analytics hook points for discovery and builder events
- self-hosted Phudu 600/700 and Poppins 400/500/600/700 Latin font assets plus consistent Lucide Customer navigation icons
- content-matched seed imagery for the Home hero, Funghi and garlic-bread products, with an explicit fallback for products without approved imagery
- the missing Rahul dual-identity customer/loyalty fixtures and independently selectable Cheese, Toppings and Dips modifier groups

Changed:
- the general entry now preserves the Pickup/Dine-in choice and withholds pickup navigation until a service mode is selected
- menu mocks now represent the first-batch customer categories and products while retaining integer-money and backend-authoritative pricing boundaries
- shared `AppShell` now supports compatible custom-header and footer-navigation slots
- Customer colour, typography, card, category, hero and navigation treatments now apply selected Pizza Wave interaction lessons through the frozen Pizza Avenue palette rather than the legacy Wave palette

Fixed:
- Dine-in routes no longer inherit pickup bottom navigation
- sold-out and unavailable selections remain visible with recovery guidance instead of becoming dead ends
- required/min/max builder rules preserve selections and surface inline validation
- direct Vite startup no longer evaluates non-local production URL requirements before enabling MSW; the default boot now resets to the normal documented seed scenario and registers the worker before rendering
- category links from Home now initialize the matching Menu category instead of always opening the unfiltered list

Docs updated:
- `README.md`, `docs/24_CHANGE_QUEUE.md`, `docs/17_CHANGELOG.md`

Decision:
- no new architecture decision; DEC-026 dual-service boundaries remain unchanged

Risk:
- menu content remains example seed data pending founder validation; only content-matched, user-approved legacy candidate images are wired and their provenance/production optimization still require confirmation
- the production build retains the existing non-failing Customer main-chunk size warning
- CHG-0006 and CHG-0007 remain local and unmerged without Issues or Pull Requests

## 2026-10-06 — Dual Service Operations Foundation

Added:
- typed Service Context, Waiter role, table-session, Dine-in order/bill/service-request and payment-target contracts
- Customer Dine-in, Admin-hosted Waiter, Admin billing and unified KDS route shells
- Customer/Waiter/Admin API-client modules, MSW operations data/handlers and complete Dine-in scenario catalogue
- mode-aware order, KDS admission, bill-finalization, table/session and loyalty-attribution helpers/tests

Changed:
- V1 from Pickup-only to explicit payment-first Pickup plus waiter-confirmed/end-of-session-billed Dine-in
- one Order aggregate now carries immutable service context; KDS ready outcomes are `READY_FOR_PICKUP` and `READY_TO_SERVE`
- payments target either Pickup Order or Dine-in Table Bill
- Dine-in loyalty finalizes after bill payment by each authenticated order owner's eligible spend

Fixed:
- global “payment before kitchen” wording is now mode-specific across active contracts and docs
- customer submission can no longer be mistaken for Dine-in kitchen confirmation
- payer identity can no longer be mistaken for table-wide loyalty ownership

Docs updated:
- `AGENTS.md`, `README.md`, `docs/00`–`docs/21`, `docs/24_CHANGE_QUEUE.md`, `docs/27_DESIGN_SYSTEM_FOUNDATION.md`, `docs/28_UI_VISUAL_DIRECTION.md`

Decision:
- DEC-026

Risk:
- no production backend/schema exists; documented migrations, RBAC, transactions, audit, concurrency and provider verification remain future implementation work
- founder policies for payment methods, service charge/tax, timeouts, discount/void/refund authority and kitchen capacity remain open

## Initial baseline
Added:
- pickup-first architecture
- customer/KDS/counter/founder surfaces
- OTP
- pizza builder
- capacity pickup
- verified payment
- loyalty ledger
- Pizza Passport
- reorder
- analytics
- adapter-ready integration layer

Excluded:
- delivery
- drivers
- direct marketplace integration
- microservices

## 2026-10-06 — Domain Routing Freeze — Root Landing + App Subdomains

Added:
- minimal Landing application shell and a shared public surface/API URL configuration package
- per-app public environment examples for local, staging and production configuration
- Docker Compose, reusable frontend image build and Caddy host-routing configuration for the four implemented static frontend services

Changed:
- root domain responsibility to Landing/Marketing; Customer now belongs to the `app` subdomain
- KDS and Admin internal routes to root-relative paths on their own subdomains
- local frontend ports to Landing `5173`, Customer `5174`, KDS `5175` and Admin `5176`
- WhatsApp magic-link continuation target to the Customer app host

Docs updated:
- `README.md`, `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/10_API_CONTRACTS.md`, `docs/15_BUILD_PLAN.md`, `docs/16_DECISIONS.md`, `docs/21_DEPLOYMENT_ARCHITECTURE.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- DEC-024

Risk:
- API, worker, PostgreSQL and Redis containers remain intentionally absent until their real runtimes exist. Real DNS, session and CORS enforcement remain provider/backend work; no environment was deployed.

## 2026-10-06 — Pizza Avenue Design System Foundation

Added:
- design-system foundation covering colour roles, Phudu/Poppins typography, spacing, layout, radius, imagery, motion, accessibility and responsive principles
- visual-direction guide interpreting the four supplied references without copying their identities or layouts
- preliminary menu inventory of eight categories and 29 items, explicitly pending founder validation
- local documentation copies of the supplied references and six unique Pizza Wave food-image candidates for review only

Changed:
- frontend reading paths now include the current design foundation and visual direction
- legacy Pizza Wave component and asset reuse is documented as selective logic/content evaluation rather than direct visual reuse
- the initial typography proposal was withdrawn; typography now matches the verified primary Pizza Wave application pair: Phudu 600/700 for display and Poppins 400/500/600/700 for body/UI

Fixed:
- logo status is explicit: no mark or legacy identity may be assumed before an approved Pizza Avenue logo is supplied
- palette authority is limited to the seven official Reference 01 colours

Docs updated:
- `AGENTS.md`, `README.md`, `docs/06_DESIGN_SYSTEM.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/20_MASTER_INDEX.md`, `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`, `docs/24_CHANGE_QUEUE.md`, `docs/27_DESIGN_SYSTEM_FOUNDATION.md`, `docs/28_UI_VISUAL_DIRECTION.md`

Decision:
- DEC-025

Risk:
- candidate imagery remains exploratory until founder approval, provenance confirmation, menu-content matching and production optimization
- exact logo, final production photography and preliminary menu details remain open

## 2026-10-05 — Architecture Freeze — Node/NestJS + Hostinger + WhatsApp Magic Login

Added:
- dual passwordless auth: phone OTP plus QR → WhatsApp verified sender → one-time magic link
- shared auth identities, hashed magic tokens, QR sources and secure cookie sessions
- WhatsApp provider/auth boundaries and acquisition analytics funnel
- transactional outbox, Redis/BullMQ jobs and idempotent consumer requirements
- Hostinger KVM 2, Ubuntu 24.04, Docker Compose, Caddy and Cloudflare/R2 topology
- off-server database backup, retention and restore-testing requirements

Changed:
- backend freeze from FastAPI/Python to Node.js LTS, TypeScript, NestJS and Prisma
- production strategy from unspecified/managed-platform assumptions to a consolidated portable VPS
- KDS path to canonical `CONFIRMED → PREPARING → READY`; payment success remains separate
- pickup availability clarified as a calculation, with stored reservations beginning at `HELD`
- loyalty/Passport trigger standardized on idempotent `ORDER_COMPLETED` processing

Fixed:
- client payment success can no longer be read as operational confirmation
- duplicate WhatsApp/payment/outbox events now have explicit database and consumer idempotency rules
- session, CSRF, secret logging, webhook verification and backup boundaries are documented

Docs updated:
- `AGENTS.md`, `README.md` and `docs/00` through `docs/20`

Decision:
- DEC-003, DEC-012 through DEC-022

Risk:
- single-VPS availability remains a conscious V1 tradeoff; off-server backups, monitoring and a portable scaling path reduce but do not remove it
- WhatsApp provider onboarding/templates, precise auth durations and founder policies remain to be confirmed before implementation

## 2026-10-05 — Repository Governance and GitHub Bootstrap

Added:
- root `.gitignore` covering Node/pnpm outputs, environment secrets, private keys, logs, database dumps and local tooling
- mandatory change-queue and Git workflow references in the agent operating manual

Changed:
- master/recommended reading paths now include deployment, Git/GitHub, coding-agent and change-queue governance documents
- documented the one-time empty-remote branch-seeding exception required to establish `main` and `develop`
- future work is explicitly required to use a tracked short-lived branch and Pull Request

Fixed:
- `docs/21` through `docs/25` are now discoverable from the master index and mandatory agent instructions
- coding-agent startup instructions now require the change queue and its agent rules

Docs updated:
- `AGENTS.md`, `README.md`, `docs/17_CHANGELOG.md`, `docs/20_MASTER_INDEX.md`, `docs/22_GIT_GITHUB_WORKFLOW_RULES.md`, `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- No product or application architecture decision changed

Risk:
- branch protection and required reviews remain GitHub repository settings for the owner to enable; this bootstrap does not weaken the documented rule

## 2026-10-05 — Frontend Stage 1 Architecture Foundation

Added:
- pnpm workspace with React 19/Vite/TypeScript Customer, KDS and Admin applications
- route-complete neutral shells for all requested Customer, KDS and Admin paths
- shared domain contracts for identity, store, menu, cart, pickup, order, payment, loyalty, rewards, Passport, promotions, upsells, analytics and errors
- typed `/api/v1` client modules, consistent error normalization and backend-replacement boundary
- MSW handlers, realistic Pizza Avenue fixtures, factories and switchable prototype scenarios
- TanStack Query providers/query keys, client-only Zustand scenario/builder state and React Hook Form/Zod validation foundations
- Vitest/React Testing Library/MSW tests and GitHub Actions validation for lint, typecheck, tests and builds

Changed:
- money contracts now explicitly use integer paise and `INR`
- repository README now documents app commands, validation and mock enablement
- Stage 1 mock endpoints follow the frozen API contracts rather than simplified prompt examples

Fixed:
- route modules no longer depend on page-level mock JSON or direct `fetch()` calls
- mock network interception uses a late-bound fetch implementation so browser and test transports share the same API-client boundary

Docs updated:
- `README.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- DEC-023

Risk:
- fixture menu prices remain examples pending founder-approved production menu truth
- MSW proves frontend boundaries only; future NestJS work must still enforce pricing, permissions, state, transactions and idempotency server-side
