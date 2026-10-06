# The Pizza Avenue — V1 Repository

This repository contains the working specification and implementation foundation for the first Pizza Avenue production prototype.

## Project
The Pizza Avenue, Sainikpuri, Hyderabad

## Product
Pickup-first direct ordering + loyalty + repeat-customer platform.

## Core surfaces
- Customer PWA
- Kitchen/KDS
- Counter/Handover
- Founder/Admin

## Frozen V1 technology
- Frontend: React 19, Vite, TypeScript, React Router, TanStack Query, Zustand, React Hook Form, Zod, Tailwind CSS, Framer Motion and Lucide
- Backend: Node.js LTS, TypeScript, NestJS, Prisma, PostgreSQL, Redis and BullMQ
- Interfaces: REST/JSON/OpenAPI plus Socket.IO or native WebSocket for live operational updates
- Reliability: transactional outbox, idempotent consumers, signed and deduplicated provider webhooks, Pino structured logs
- Workspace: pnpm monorepo with Landing, Customer, KDS and Admin apps plus shared packages; Turborepo is optional

The backend is a modular monolith with `auth`, `customers`, `stores`, `menu`, `cart`, `pricing`, `pickup`, `orders`, `payments`, `kitchen`, `loyalty`, `passport`, `promotions`, `referrals`, `notifications`, `analytics`, `audit` and `integrations` modules. Each module keeps controller/API, application service, domain rules and Prisma repository/data responsibilities separate.

The product uses four frontend deployments in V1: root-domain Landing is `apps/landing`, Customer is `apps/customer`, Kitchen and the role-gated Counter/Handover view are `apps/kds`, and Founder/Admin is `apps/admin`. This preserves the required Counter workflow without adding an unnecessary fifth operational deployment.

## Stage 1 frontend foundation

The pnpm workspace currently provides architecture-only React applications and shared packages:

```text
apps/landing       Root-domain landing architecture shell
apps/customer      Customer route and feature foundation
apps/kds           Kitchen route foundation
apps/admin         Founder/Admin route foundation
packages/config    Public environment-derived surface/API URLs
packages/types     Shared domain and API contract types
packages/api-client Typed HTTP boundary for `/api/v1`
packages/mocks     MSW handlers, fixtures, factories and scenarios
packages/utils     Query keys, money helpers and state helpers
packages/ui        Neutral structural primitives only
```

Stage 1 deliberately contains no final visual design system, backend service, database connection, provider integration, real payment flow or real authentication.

## Local development

Requirements: Node.js 24 LTS and pnpm 11.

```bash
pnpm install
pnpm dev
```

Individual apps:

```bash
pnpm dev:landing   # http://localhost:5173
pnpm dev:customer  # http://localhost:5174
pnpm dev:kds       # http://localhost:5175
pnpm dev:admin     # http://localhost:5176
```

Each Vite app owns an `.env.example`; copy the relevant file to an ignored local `.env` file for overrides. Public URLs are resolved once through `packages/config`: local defaults use the ports above, while staging/production must explicitly provide `VITE_LANDING_URL`, `VITE_CUSTOMER_APP_URL`, `VITE_KDS_URL`, `VITE_ADMIN_URL` and `VITE_API_BASE_URL`. Mocks are enabled unless `VITE_ENABLE_MOCKS=false`. A future NestJS backend replaces MSW behind `packages/api-client`; route and feature modules should not change their data-access boundary.

## Frontend host routing

`compose.yaml`, [Dockerfile.frontend](Dockerfile.frontend) and `infra/caddy/` package the four existing frontend services behind Caddy. Copy `infra/docker/.env.example` to the ignored `infra/docker/.env`, replace the placeholder domains, then validate with:

```bash
docker compose --env-file infra/docker/.env config
```

The current Compose file intentionally excludes API, worker, PostgreSQL and Redis until those services exist. Its Caddyfile already reserves `api.pizzaavenue.<domain>` for the future API, rather than faking an application container.

Validation:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Authentication
Customers can sign in with phone OTP or enter through the in-store QR → WhatsApp → one-time magic-link flow. Both paths resolve the same customer identity and create the same secure HttpOnly cookie session. The WhatsApp path trusts only the verified webhook sender, never QR text or a phone number in a URL.

## Production deployment
V1 targets one Hostinger KVM 2 server in India running Ubuntu 24.04 LTS, Docker Compose and Caddy. `pizzaavenue.<domain>` serves Landing, while `app`, `kds`, `admin` and `api` subdomains serve Customer, KDS, Admin and NestJS `/api/v1`. Cloudflare provides DNS and optional edge protection, while encrypted database dumps are copied off-server to R2 and periodically restore-tested.

## Recommended reading order
AGENTS.md → Master Index → Git/GitHub Workflow → Coding Agent Guide → Change Queue and Agent Rules → Project Context → Product Scope → Business Rules → Roles → User Flows → IA → Design System → Design System Foundation → UI Visual Direction → Components → Data Model → State Machines → API Contracts → Integrations → Analytics → Seed Data → Test Plan → Build Plan → Decisions → Deployment Architecture → Acceptance Criteria.

Every meaningful change must use a short-lived task branch, a matching entry in `docs/24_CHANGE_QUEUE.md`, validation, relevant documentation and a Pull Request. `main` represents production-ready work and `develop` represents staging/integration.

## V1 success metrics
- checkout conversion
- AOV
- side/drink/dessert attach rate
- repeat rate
- days between orders
- ready-time accuracy
- pickup wait
- reward usage
- payment failure rate

The project is intentionally single-brand, single-outlet operationally and pickup-only. Future external-order integrations are prepared through adapters and source fields but are not implemented in V1. Application development must follow the recorded decisions and cannot begin from outdated FastAPI or managed-platform assumptions.
