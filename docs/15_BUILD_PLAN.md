# 15 — One-Month Build Plan

## Pre-sprint founder freeze
Confirm:
- menu
- modifiers
- prices
- pickup capacity
- refund/cancellation
- payment
- loyalty
- rewards
- scope
- WhatsApp Business number/provider/templates/consent copy
- QR placements, prefilled message and incentive
- session and magic-token durations

## Week 1 — foundation + prototype
Product:
- IA
- user flows
- low-fi
- hi-fi core

Engineering:
- pnpm workspace/monorepo: `apps/customer`, `apps/kds`, `apps/admin`, shared packages and `server`
- Node.js LTS, TypeScript, NestJS, Prisma/PostgreSQL and OpenAPI baseline
- development/staging/production environments and Pino request logging
- auth foundation: identities, secure sessions, OTP, QR sources and WhatsApp magic-login adapter
- menu
- seed data
- API skeleton

Exit:
critical prototype journey + staging skeleton.

## Week 2 — commerce
- menu
- builder
- cart
- pricing
- pickup
- order model
- payment initiation
- KDS base
- payment/provider idempotency and transactional outbox foundation

## Week 3 — operations + retention
- payment webhook
- KDS live status
- handover
- loyalty
- rewards
- passport
- reorder
- upsells
- notifications
- founder control
- Redis/BullMQ worker, idempotent outbox consumers and failure visibility
- QR/WhatsApp funnel analytics and admin QR-source control

## Week 4 — QA + store trial
- E2E
- devices
- rush simulation
- staff training
- analytics validation
- backup/recovery
- security
- founder UAT
- WhatsApp webhook/signature/outage rehearsal
- isolated backup restore rehearsal

No scope expansion.

## Launch month
Week 1 soft launch
Week 2 existing customers
Week 3 Passport/referral activation
Week 4 measure/iterate

## Feature done means
frontend + backend + RBAC + edge cases + analytics + tests + docs.

## V1 production infrastructure
Provision Hostinger KVM 2 in the India region with Ubuntu 24.04 LTS. Verify current provider pricing/specification before purchase; promotional pricing is not an architecture guarantee.

Docker Compose services:
- `caddy`
- `customer`
- `kds`
- `admin`
- `api`
- `worker`
- `postgres`
- `redis`

Caddy terminates HTTPS and routes the customer domain plus `api`, `kds` and `admin` subdomains. Only required HTTP/HTTPS ports are public. API, worker, PostgreSQL and Redis communicate on private Docker networks; PostgreSQL and Redis publish no internet-facing port. Cloudflare manages DNS and may provide proxy/security/caching where appropriate.

The Counter/Handover surface is a separately permissioned route within the KDS operational frontend for V1, so the four product surfaces still fit the three documented frontend services. Split it only if measured device/deployment needs justify another app.

CI/CD builds/tests immutable images, runs reviewed Prisma migrations, deploys with health checks and retains a documented rollback path. Secrets remain outside images/repository.

Security gates include HTTPS, strict production CORS/origin policy, CSRF controls for cookie-authenticated mutations, Zod/NestJS input validation, Prisma parameterized access, rate limiting, webhook signatures, RBAC/resource ownership, audit logging, dependency/secret scanning and log redaction. Never log OTPs, raw magic/session credentials, payment secrets or WhatsApp access tokens.

## Backup and operations
Nightly `pg_dump` → compression → encryption where applicable → Cloudflare R2 off-server storage. Define daily retention tiers, monitor upload success, document restore steps, and perform periodic isolated restore tests. Provider-level VPS backup is additional protection, not a replacement. Menu media/exported reports may also use R2. Add Pino structured logs (`request_id`, appropriate order/customer/staff identifiers, role, event, duration, error code), Sentry or equivalent, and `/health` plus `/health/ready` monitoring.

## Hosting decision and portability
Hostinger KVM 2 is selected for consolidated, low-cost one-outlet V1 capacity (currently described as 2 vCPU, 8 GB RAM, 100 GB NVMe, India region and large bandwidth; verify before purchase). Docker, Node.js, PostgreSQL and Redis keep the system portable.

Alternatives retained for future review:
- E2E Networks: stronger cloud primitives/scaling and Chennai/Delhi availability, generally more costly for comparable V1 resources.
- DigitalOcean: excellent developer experience at higher resource cost.
- AWS Lightsail: mature platform with higher cost/AWS operational overhead.
- Vercel + Railway + Neon + Upstash: strong managed option, not the primary V1 architecture because Pizza Avenue chose one consolidated VPS.

Scaling path, only when measured need justifies it: single VPS → separate managed PostgreSQL → multiple API/worker nodes and load balancer → integration/multi-outlet scaling. Do not prebuild later stages.
