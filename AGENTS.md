# Pizza Avenue — Agent Operating Manual

## Mission
Pizza Avenue V1 is a single-brand Pickup and Dine-in ordering, service, loyalty and repeat-customer system for The Pizza Avenue, Sainikpuri, Hyderabad.

Primary outcomes:
- increase direct pickup orders
- increase AOV
- increase repeat frequency
- reduce manual ordering friction
- protect kitchen capacity
- create reliable owner analytics

## Mandatory reading before every task
1. docs/20_MASTER_INDEX.md
2. docs/22_GIT_GITHUB_WORKFLOW_RULES.md
3. docs/23_CODING_AGENT_PROMPTING_GUIDE.md
4. docs/24_CHANGE_QUEUE.md
5. docs/25_CHANGE_QUEUE_AGENT_RULES.md
6. docs/00_PROJECT_CONTEXT.md
7. docs/01_PRODUCT_SCOPE.md
8. docs/02_BUSINESS_RULES.md
9. docs/03_ROLES_PERMISSIONS.md
10. docs/04_USER_FLOWS.md
11. docs/16_DECISIONS.md
12. docs/17_CHANGELOG.md

Frontend tasks additionally read:
- 05_INFORMATION_ARCHITECTURE.md
- 06_DESIGN_SYSTEM.md
- 07_COMPONENTS.md
- 27_DESIGN_SYSTEM_FOUNDATION.md
- 28_UI_VISUAL_DIRECTION.md
- 10_API_CONTRACTS.md
- 12_ANALYTICS_EVENTS.md
- 18_ACCEPTANCE_CRITERIA.md

Backend tasks additionally read:
- 08_DATA_MODEL.md
- 09_STATE_MACHINES.md
- 10_API_CONTRACTS.md
- 11_INTEGRATIONS.md
- 14_TEST_PLAN.md

Deployment/infrastructure tasks additionally read:
- 15_BUILD_PLAN.md
- 21_DEPLOYMENT_ARCHITECTURE.md

## Source-of-truth priority
1. 16_DECISIONS.md
2. 02_BUSINESS_RULES.md
3. 01_PRODUCT_SCOPE.md
4. 09_STATE_MACHINES.md
5. 08_DATA_MODEL.md
6. 10_API_CONTRACTS.md
7. 03_ROLES_PERMISSIONS.md
8. 21_DEPLOYMENT_ARCHITECTURE.md
9. design docs
10. existing code

Never silently resolve conflicts. Report the conflict first.

## Frozen V1 shape
Surfaces:
- Customer PWA
- Kitchen/KDS
- Counter/Handover
- Waiter workspace inside Founder/Admin
- Founder/Admin and Counter billing

Architecture:
- modular monolith
- React 19/Vite/TypeScript PWA plus separate KDS and Admin apps
- Node.js LTS + TypeScript + NestJS `/api/v1`
- Prisma ORM
- PostgreSQL
- Redis for short-lived state, queues and rate limits
- BullMQ workers and a transactional PostgreSQL outbox
- REST + JSON + OpenAPI
- Socket.IO or native WebSocket for live status; API/database recovery remains authoritative
- webhook-based async integrations
- dual customer auth: phone OTP and verified WhatsApp QR magic login
- secure HttpOnly cookie-based web sessions
- RBAC for staff/founder
- backend-authoritative pricing/payment/state

Production deployment:
- Hostinger KVM 2 in India
- Ubuntu 24.04 LTS
- Docker Compose with Caddy
- PostgreSQL and Redis on the private Docker network
- Cloudflare DNS/security and R2 for off-server encrypted backups/media where appropriate

## Explicit V1 exclusions
Do not build unless approved:
- delivery
- drivers
- customer addresses
- delivery zones
- Swiggy/Zomato/District direct integrations
- microservices
- AI recommendation engine
- full support ticketing
- native mobile apps
- marketplace/multi-brand architecture

## Non-negotiable engineering rules
- frontend never owns authoritative money/state
- Pickup reaches KDS only after verified payment; Dine-in reaches KDS only after waiter confirmation
- Dine-in payment is recorded against the table bill by authorized Admin/Counter controls after service
- payment/refund/loyalty actions must be idempotent
- purchased order lines keep snapshots
- important admin actions must be auditable
- every protected API enforces permission server-side
- no floating-point money
- no provider payloads leaking into core domain models
- never authenticate from QR text, `?phone=` or any unverified client value
- WhatsApp identity comes only from an authentic provider webhook; magic tokens are hashed, short-lived and single-use
- no long-lived auth credentials in localStorage
- critical state and its outbox event are committed in the same PostgreSQL transaction
- PostgreSQL and Redis are never publicly exposed; database backups must leave the VPS and be restore-tested

## Architecture-sensitive changes
Before modifying authentication, payment, order state machines, loyalty, pickup capacity or deployment architecture, read the associated business rules, data model, state machine, API, integration, test, decision and acceptance-criteria documents. Record any new architectural decision before implementation.

## Before coding
1. Find or create the matching entry in `docs/24_CHANGE_QUEUE.md`; never duplicate a task.
2. Set its truthful status and scope before implementation.
3. Identify affected domain.
4. Read rules/state/API docs.
5. Identify user role.
6. Check edge cases.
7. Check analytics.
8. Inspect current code.
9. Propose implementation plan for large changes.

## After coding
- run tests
- verify acceptance criteria
- update relevant docs
- update CHANGELOG.md
- update the same change-queue entry with implementation and test truth
- record important decisions
- report files changed and unresolved risks

## Git workflow
- `main` is production-ready; `develop` is staging/integration.
- Work on short-lived `feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*` or production-only `hotfix/*` branches.
- Do not develop or push normal work directly on `main` or `develop`; use Pull Requests and required validation/review.
- Never force-push protected branches or commit secrets.
- Follow `docs/22_GIT_GITHUB_WORKFLOW_RULES.md` and keep `docs/24_CHANGE_QUEUE.md` synchronized with the real branch, Issue, PR, test and release state.

## Core principle
Use enterprise-grade boundaries without enterprise-grade infrastructure.
