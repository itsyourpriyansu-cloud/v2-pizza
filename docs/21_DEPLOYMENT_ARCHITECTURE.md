# 21 — Deployment Architecture

## Purpose

This document is the single source of truth for how The Pizza Avenue V1 application is deployed, secured, backed up, monitored, and operated in production.

The production deployment is intentionally simple:

- one Hostinger KVM 2 VPS in India
- Ubuntu 24.04 LTS
- Docker + Docker Compose
- Caddy reverse proxy
- React/Vite frontends
- NestJS API
- BullMQ worker
- PostgreSQL
- Redis
- Cloudflare for DNS/proxy/security
- Cloudflare R2 for off-server backups and optional media
- GitHub for source control and CI/CD
- Sentry/PostHog or equivalent for monitoring/product analytics

The application must remain portable so that it can later move to E2E Networks, DigitalOcean, AWS, or another provider without changing the core architecture.

---

# 1. Final Production Topology

```text
                           INTERNET
                              │
                              ▼
                        CLOUDFLARE
                  DNS / Proxy / Security
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
pizzaavenue.<domain>   kds.<domain>       admin.<domain>
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                       HOSTINGER KVM 2
                       Ubuntu 24.04 LTS
                              │
                         ┌────┴────┐
                         │  Caddy  │
                         └────┬────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
 Customer PWA               KDS UI               Admin UI
 React/Vite               React/Vite            React/Vite
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                         NestJS API
                          /api/v1
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
     PostgreSQL             Redis               Worker
   source of truth      temporary state        BullMQ jobs
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
                              ▼
                     Transactional Outbox
                              │
                              ▼
                         Event Processing
                              │
          ┌───────────────────┼─────────────────────┐
          ▼                   ▼                     ▼
       Loyalty           Pizza Passport       Notifications
                                                  │
                                                  ▼
                                             WhatsApp API

External systems:
- payment provider
- WhatsApp Business provider
- Cloudflare R2
- Sentry
- PostHog
```

---

# 2. Hosting Decision

## Primary V1 Host

**Hostinger KVM 2**

Recommended region:
**India**

Recommended operating system:
**Ubuntu 24.04 LTS**

Expected plan profile:
- 2 vCPU
- 8 GB RAM
- 100 GB NVMe
- high monthly transfer allowance
- root access
- provider backup support

Provider pricing must always be verified at purchase time.

Do not hardcode promotional pricing into architecture assumptions.

---

# 3. Why Hostinger KVM 2 Is the V1 Choice

It is selected because Pizza Avenue V1:

- operates from one outlet
- has moderate traffic
- has no delivery fleet
- has no marketplace-scale traffic
- does not need Kubernetes
- does not need autoscaling at launch
- benefits more from low monthly cost and operational simplicity

A single KVM 2 instance can comfortably host:

- customer PWA
- KDS
- founder dashboard
- API
- worker
- PostgreSQL
- Redis
- reverse proxy

for the early-stage workload.

---

# 4. Why E2E Networks Is Not the Initial Default

E2E Networks is a valid alternative and may be superior later when the project needs:

- more cloud-native primitives
- multiple compute nodes
- private networks
- independent scaling
- managed database services
- stronger infrastructure automation
- more granular provisioning

However, for one outlet and one-month V1 development, Hostinger is simpler and cheaper.

This is a product decision, not a permanent vendor lock-in.

---

# 5. Portability Principle

The application must remain infrastructure-portable.

Core dependencies:

- Docker
- Node.js
- PostgreSQL
- Redis
- object storage-compatible backups

Avoid provider-specific infrastructure assumptions inside business logic.

The application should be able to move from:

```text
Hostinger
→ E2E Networks
→ DigitalOcean
→ AWS
```

without rewriting the application domain.

---

# 6. Production DNS Layout

Recommended subdomains:

```text
pizzaavenue.<domain>          Customer PWA
api.pizzaavenue.<domain>      NestJS API
kds.pizzaavenue.<domain>      Kitchen/KDS
admin.pizzaavenue.<domain>    Founder/Admin
```

Optional:

```text
status.pizzaavenue.<domain>   Future status page
```

All public DNS is managed through Cloudflare.

---

# 7. Caddy Reverse Proxy

Caddy is the recommended V1 reverse proxy.

Responsibilities:

- HTTPS
- automatic TLS certificates
- reverse proxy
- host-based routing
- security headers where appropriate
- WebSocket forwarding

Example logical routing:

```text
pizzaavenue.<domain>
→ customer frontend

api.pizzaavenue.<domain>
→ NestJS API

kds.pizzaavenue.<domain>
→ KDS frontend

admin.pizzaavenue.<domain>
→ Admin frontend
```

PostgreSQL and Redis must never be publicly routed.

---

# 8. Docker Compose Services

Recommended production services:

```yaml
services:
  caddy:
  customer:
  kds:
  admin:
  api:
  worker:
  postgres:
  redis:
```

Optional later:

```yaml
  migration:
  backup:
```

All internal services share a private Docker network.

Only Caddy should expose public HTTP/HTTPS ports.

---

# 9. Service Responsibilities

## caddy
- public entry point
- TLS
- routing
- WebSocket proxying

## customer
- customer PWA static build

## kds
- kitchen UI static build

## admin
- founder/admin static build

## api
- NestJS application
- REST API
- WebSocket gateway
- auth
- orders
- menu
- payment
- loyalty
- admin

## worker
- BullMQ worker
- notifications
- outbox processing
- retries
- scheduled cleanup
- analytics forwarding

## postgres
- transactional source of truth

## redis
- BullMQ
- rate limiting
- OTP temporary state if used
- pickup reservation TTL
- temporary locks/cache

---

# 10. Resource Allocation Guidance

Approximate initial resource planning:

```text
Ubuntu/system        0.5–1.0 GB RAM
PostgreSQL           1.0–2.0 GB
Redis                0.2–0.5 GB
NestJS API           0.5–1.0 GB
BullMQ Worker        0.3–0.7 GB
Caddy/frontends      <0.5 GB
Remaining headroom   ~2–4 GB
```

Do not artificially reserve all memory on day one.

Monitor real usage first.

---

# 11. PostgreSQL Production Rules

PostgreSQL is the source of truth for:

- users
- customers
- sessions
- menu
- products
- modifiers
- carts
- orders
- payments
- pickup capacity
- loyalty
- Pizza Passport
- promotions
- audit
- integration events
- outbox events

Production rules:

- never expose port 5432 publicly
- use strong credentials
- version schema with migrations
- backup daily
- test restore periodically
- do not manually edit production tables unless emergency procedure requires it
- use connection pooling if needed

---

# 12. Redis Production Rules

Redis is not the primary database.

Use Redis for:

- BullMQ queues
- OTP TTL
- rate limits
- temporary pickup holds
- short-lived locks
- ephemeral cache

Do not store:

- authoritative order state
- payment truth
- loyalty ledger
- permanent customer profile

Redis loss must not corrupt core business records.

---

# 13. Transactional Outbox

The transactional outbox pattern is mandatory for important asynchronous domain events.

Example:

```text
BEGIN DB TRANSACTION

UPDATE order
SET status = 'COMPLETED'

INSERT INTO outbox_events
(type = 'ORDER_COMPLETED')

COMMIT
```

The worker later processes:

```text
ORDER_COMPLETED
→ loyalty
→ passport
→ notification
→ analytics
```

Outbox fields should include:

- id
- event_type
- aggregate_type
- aggregate_id
- payload
- status
- retry_count
- last_error
- created_at
- processed_at

Statuses:

```text
PENDING
PROCESSING
PROCESSED
FAILED
```

Consumers must be idempotent.

---

# 14. BullMQ Worker

Use BullMQ with Redis.

Suitable job types:

- WhatsApp order notifications
- WhatsApp magic-login response
- retryable API calls
- loyalty event processing
- Pizza Passport processing
- analytics forwarding
- cleanup jobs
- expired magic-token cleanup
- pickup reservation cleanup
- report generation

Do not move payment/order truth outside PostgreSQL.

---

# 15. Real-Time Architecture

Use Socket.IO or WebSocket for KDS and live order status.

Flow:

```text
Verified payment
→ order confirmed
→ DB commit
→ outbox event
→ real-time event
→ KDS receives order
```

Kitchen updates:

```text
CONFIRMED
→ PREPARING
→ READY
```

Customer receives mapped live status.

Important:
WebSocket is transport only.

After refresh/reconnect:

```text
client
→ GET authoritative order state
→ continue real-time subscription
```

Never rely on socket memory as source of truth.

---

# 16. Authentication Deployment

The app supports two customer login flows.

## Normal OTP

```text
Customer
→ phone
→ OTP
→ verify
→ secure session
```

## WhatsApp QR Magic Login

```text
Restaurant QR
→ WhatsApp
→ customer sends message
→ verified inbound webhook
→ backend resolves customer
→ single-use magic token
→ WhatsApp sends Continue link
→ customer opens PWA
→ token consumed
→ secure session
```

Authentication tokens and provider secrets must remain server-side.

---

# 17. Session Strategy

Preferred:
**Secure HttpOnly cookie sessions**

Cookie properties:

- Secure
- HttpOnly
- SameSite appropriate to domain setup
- explicit expiry
- rotation where required

Document and implement CSRF protection where applicable.

Do not store long-lived authentication credentials in localStorage.

---

# 18. WhatsApp Webhook Hosting

Endpoint example:

```text
POST api.pizzaavenue.<domain>/api/v1/webhooks/whatsapp
```

Webhook rules:

- verify provider authenticity
- deduplicate event IDs
- extract verified sender
- never trust QR text as identity
- process idempotently
- log safe metadata
- never log sensitive provider tokens

---

# 19. Payment Webhook Hosting

Endpoint example:

```text
POST api.pizzaavenue.<domain>/api/v1/webhooks/payments/{provider}
```

Rules:

- verify signature
- deduplicate provider event
- lock/update payment atomically
- create exactly one confirmed order
- never trust frontend payment success

---

# 20. Network Security

Public ports:

```text
80
443
```

SSH:
- restrict by firewall where practical
- use SSH keys
- disable password root login where appropriate

Private only:

```text
PostgreSQL
Redis
internal API ports
```

Recommended host firewall:
- allow HTTP/HTTPS
- allow SSH from trusted IPs where possible
- deny other inbound traffic

---

# 21. Cloudflare

Cloudflare responsibilities:

- DNS
- proxy
- basic DDoS protection
- TLS support
- caching of safe static assets
- optional WAF/security features

Do not cache:

- authenticated API responses
- order state
- payment endpoints
- admin API
- WebSocket dynamic traffic incorrectly

---

# 22. Cloudflare R2

Use R2 for:

- off-server database backups
- menu media if chosen
- exported reports
- archived artifacts

Backup objects should use a path convention such as:

```text
backups/
  postgres/
    production/
      2026/
        10/
          pizzaavenue-prod-2026-10-05.sql.gz
```

---

# 23. Database Backup Strategy

Minimum production policy:

## Daily
- `pg_dump`
- compressed
- uploaded off-server

## Retention
Suggested starting point:
- 7 daily
- 4 weekly
- 3 monthly

Exact policy may be adjusted.

## Security
- encrypt if needed
- restrict R2 bucket access
- never expose backups publicly

## Restore test
At least monthly during early operations:
- restore into staging
- verify tables
- verify order/payment/loyalty consistency

A backup that has never been restored is not considered proven.

---

# 24. Provider-Level Backups

If Hostinger includes weekly VPS backups:

use them.

But do not treat them as the only backup.

Need both:

```text
provider backup
+
off-server PostgreSQL backup
```

---

# 25. Environments

Three environments:

## Local
- developer machine
- local Docker
- fake/sandbox providers

## Staging
Recommended host:

```text
staging.pizzaavenue.<domain>
api-staging.pizzaavenue.<domain>
```

Use:
- test data
- payment sandbox
- WhatsApp test environment where possible
- founder review
- staff training

## Production
Real credentials, customers and transactions.

Never share production secrets with staging.

---

# 26. Git Branch Strategy

Recommended simple model:

```text
main
develop
feature/*
fix/*
```

Mapping:

```text
main
→ production

develop
→ staging

feature/*
→ pull request / preview testing
```

If solo development becomes faster with trunk-based development, simplify later.

---

# 27. CI/CD

On pull request:

- install dependencies
- lint
- typecheck
- unit tests
- API/domain tests
- frontend build
- backend build

On merge to develop:

```text
deploy staging
```

On approved merge to main:

```text
deploy production
```

Production deployment must have rollback instructions.

---

# 28. Deployment Flow

Recommended production flow:

```text
git push
→ GitHub
→ CI tests
→ build Docker images
→ push/pull images
→ SSH/deploy to VPS
→ docker compose pull
→ database migration
→ docker compose up -d
→ health check
```

Do not run destructive migration blindly.

Migrations must be reviewed.

---

# 29. Zero-Downtime Expectations

V1 does not require complex orchestration.

However:

- static frontends can redeploy safely
- API restarts should be quick
- migrations should be backward-compatible where possible
- maintenance windows may be acceptable initially

Do not add Kubernetes only to achieve theoretical zero downtime.

---

# 30. Observability

## Structured logs
Use Pino.

Recommended fields:

- request_id
- order_id
- staff_user_id
- role
- event
- duration
- error_code

Never log:

- OTP
- raw magic login token
- session secret
- payment secret
- WhatsApp access token

## Error monitoring
Use Sentry or equivalent.

Monitor:
- frontend exceptions
- backend exceptions
- payment webhook failures
- worker failures

## Health
Endpoints:

```text
GET /health
GET /health/ready
```

---

# 31. Product Analytics

PostHog or equivalent may track:

- QR scans
- login funnel
- product views
- pizza builder
- upsells
- checkout
- reorder
- rewards

But financial truth remains PostgreSQL.

Never derive authoritative GMV from frontend analytics.

---

# 32. Security Checklist

Before launch:

- HTTPS everywhere
- SSH keys
- firewall configured
- database not public
- Redis not public
- secrets only in environment
- production CORS locked down
- OTP rate limits
- session expiry
- CSRF strategy
- RBAC backend checks
- webhook verification
- idempotency
- magic-token hash storage
- magic-token expiry
- one-time token consumption
- dependency audit
- backup verified
- restore tested

---

# 33. Secrets

Examples:

```text
DATABASE_URL
REDIS_URL
SESSION_SECRET
WHATSAPP_ACCESS_TOKEN
WHATSAPP_VERIFY_TOKEN
PAYMENT_PROVIDER_SECRET
R2_ACCESS_KEY
R2_SECRET_KEY
SENTRY_DSN
```

Rules:

- never commit
- never include in Markdown examples as real values
- separate staging/prod
- rotate when exposed

---

# 34. Recommended Docker Data Volumes

Persistent volumes:

```text
postgres_data
redis_data if persistence required
caddy_data
caddy_config
```

Database storage is the most critical.

Volume usage must be monitored.

---

# 35. Logs

Do not allow unbounded Docker logs.

Configure rotation.

Example policy:
- max file size
- max retained files

Long-term logs may later be shipped to a proper log service.

---

# 36. Scheduled Jobs

Potential scheduled jobs:

- backup
- expired magic-token cleanup
- expired pickup reservation cleanup
- stale cart cleanup
- loyalty expiry if enabled
- analytics rollups
- periodic health/report generation

Prefer worker scheduler over OS cron for application logic.

Use OS cron/system scheduler for infrastructure backup only if appropriate.

---

# 37. KDS Reliability

Kitchen cannot depend solely on an active socket.

On KDS load/reload:

```text
GET current operational queue
→ render current truth
→ establish live connection
```

If internet/socket disconnects:

- show disconnected indicator
- attempt reconnect
- recover queue from server
- never invent final status locally

---

# 38. Production Recovery

Document emergency actions for:

## API unavailable
- restart API container
- inspect logs
- health check

## Worker unavailable
- restart worker
- queued jobs remain in Redis
- outbox remains in PostgreSQL

## Redis unavailable
- core order truth remains in PostgreSQL
- background jobs/reservations affected
- restore Redis/restart queue carefully

## PostgreSQL unavailable
- application enters degraded/unavailable mode
- no unsafe order acceptance

## Payment provider outage
- prevent new payment completion
- preserve cart
- show recoverable customer message

---

# 39. Scaling Path

## Stage 1 — V1
Single Hostinger KVM 2:

```text
frontends
api
worker
postgres
redis
```

## Stage 2
Separate managed PostgreSQL.

Trigger examples:
- growing data size
- higher availability requirement
- DB resource contention

## Stage 3
Multiple API and worker nodes:

```text
Load Balancer
├── API 1
├── API 2
├── Worker 1
└── Worker 2
```

Redis/PostgreSQL externalized.

## Stage 4
Multi-outlet + external order adapters.

Do not implement Stage 2–4 prematurely.

---

# 40. Migration to E2E Networks

If moving later:

1. provision E2E node
2. install Docker/Caddy
3. migrate environment configuration
4. replicate/restore PostgreSQL
5. move Redis if necessary
6. deploy containers
7. validate staging
8. reduce DNS TTL
9. switch Cloudflare DNS
10. monitor
11. retire old VPS after safe window

Because the stack is containerized, the application remains portable.

---

# 41. Why Not Vercel/Railway as Primary V1

They are good managed platforms.

However, Pizza Avenue V1 chooses a consolidated VPS because:

- lower predictable infrastructure cost
- enough resources for one outlet
- full control
- easier consolidation of API/worker/DB/Redis
- no need for separate managed services yet

They remain valid future alternatives.

---

# 42. Production Readiness Checklist

Before live traffic:

## Server
- Ubuntu patched
- firewall
- SSH keys
- fail2ban optional
- Docker installed
- Caddy configured
- time synchronization correct

## DNS
- Cloudflare configured
- domains resolve
- HTTPS valid

## Database
- migrations applied
- production user created
- backups running
- restore tested

## Redis
- private
- password/ACL if required
- persistence policy deliberate

## API
- health endpoints
- production CORS
- rate limits
- secrets
- payment webhooks tested
- WhatsApp webhook tested

## Worker
- running
- retry behaviour tested
- outbox processing tested

## Frontends
- customer
- KDS
- admin
- correct API base URL

## Monitoring
- errors visible
- server resource visibility
- disk alerts where possible

## Operational
- staff trained
- founder has admin access
- rollback procedure documented
- emergency contact process agreed

---

# 43. Final Architecture Freeze

Pizza Avenue V1 production deployment is:

```text
Cloudflare
+
Hostinger KVM 2 India
+
Ubuntu 24.04
+
Docker Compose
+
Caddy
+
React/Vite/TypeScript
+
NestJS/TypeScript
+
Prisma
+
PostgreSQL
+
Redis
+
BullMQ
+
WebSocket/Socket.IO
+
Transactional Outbox
+
Cloudflare R2 Off-Server Backups
+
Payment Adapter
+
WhatsApp Adapter
+
Sentry
+
PostHog
```

This architecture is intentionally optimized for:

- one outlet
- low cost
- fast development
- reliable payments
- live KDS
- direct customer identity
- loyalty
- future portability

Do not replace this architecture without an explicit recorded decision.
