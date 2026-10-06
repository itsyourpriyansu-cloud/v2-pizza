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
- Workspace: pnpm monorepo with customer, KDS and admin apps plus shared packages; Turborepo is optional

The backend is a modular monolith with `auth`, `customers`, `stores`, `menu`, `cart`, `pricing`, `pickup`, `orders`, `payments`, `kitchen`, `loyalty`, `passport`, `promotions`, `referrals`, `notifications`, `analytics`, `audit` and `integrations` modules. Each module keeps controller/API, application service, domain rules and Prisma repository/data responsibilities separate.

The four product surfaces use three frontend deployments in V1: Customer is `apps/customer`, Kitchen and the role-gated Counter/Handover view are `apps/kds`, and Founder/Admin is `apps/admin`. This preserves the required Counter workflow without adding an unnecessary fourth deployment.

## Stage 1 frontend foundation

The pnpm workspace currently provides architecture-only React applications and shared packages:

```text
apps/customer      Customer route and feature foundation
apps/kds           Kitchen route foundation
apps/admin         Founder/Admin route foundation
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
pnpm dev:customer  # http://localhost:5173
pnpm dev:kds       # http://localhost:5174/kds
pnpm dev:admin     # http://localhost:5175/admin
```

Mocks are enabled unless `VITE_ENABLE_MOCKS=false`. Copy `.env.example` to a local ignored environment file when overrides are required. A future NestJS backend replaces MSW behind `packages/api-client`; route and feature modules should not change their data-access boundary.

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
V1 targets one Hostinger KVM 2 server in India running Ubuntu 24.04 LTS, Docker Compose and Caddy. Customer, KDS, Admin, NestJS API, BullMQ worker, PostgreSQL and Redis run as separate services; only HTTP/HTTPS is public. Cloudflare provides DNS and optional edge protection, while encrypted database dumps are copied off-server to R2 and periodically restore-tested.

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
