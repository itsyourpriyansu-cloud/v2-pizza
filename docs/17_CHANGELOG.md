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
