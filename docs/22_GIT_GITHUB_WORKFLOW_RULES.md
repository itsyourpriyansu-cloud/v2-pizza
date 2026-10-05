# Pizza Avenue — Git & GitHub Development Workflow Rules

> **Status:** Mandatory team workflow
> **Applies to:** All human developers and coding agents
> **Team size:** 2 developers
> **Project:** The Pizza Avenue V1
> **Production branch:** `main`
> **Staging branch:** `develop`

---

# 1. Purpose

This document defines the mandatory Git, GitHub, branching, testing, review, release, deployment, rollback, database-migration, documentation, and production-hotfix practices for The Pizza Avenue.

The goals are:

1. Keep `main` production-safe at all times.
2. Keep `develop` usable as the staging/integration branch.
3. Prevent two developers from overwriting each other's work.
4. Keep feature branches short-lived.
5. Require review and automated validation before merge.
6. Prevent database and environment mistakes.
7. Make production changes auditable.
8. Ensure documentation evolves with code.
9. Make emergency production fixes safe.
10. Keep the workflow simple enough for a two-person team.

---

# 2. Permanent Branches

Only two long-lived branches are allowed:

```text
main
develop
```

## `main`

Represents:

**Current production-ready application.**

Rules:

- Never develop directly on `main`.
- Never push directly to `main`.
- Never force-push `main`.
- Never delete `main`.
- Every change enters through a Pull Request.
- Production deployment happens only from `main`.
- Prefer deploying tagged commits/releases.
- `main` must remain releasable.

## `develop`

Represents:

**Next integrated release / staging environment.**

Rules:

- All normal feature work merges into `develop`.
- `develop` automatically or manually deploys to staging.
- Never use production secrets on `develop`.
- Never point `develop` to the production database.
- Never force-push `develop`.
- Every meaningful change should enter through PR.

---

# 3. Short-Lived Branch Types

Allowed patterns:

```text
feature/*
fix/*
hotfix/*
chore/*
docs/*
refactor/*
test/*
```

Examples:

```text
feature/whatsapp-magic-login
feature/pizza-builder
feature/pickup-capacity
feature/kds-live-orders
feature/pizza-passport

fix/cart-total-rounding
fix/kds-reconnect
fix/reward-double-credit

hotfix/payment-webhook-idempotency

docs/update-auth-architecture
refactor/payment-provider-adapter
test/payment-webhook-replay
```

Do not use vague branches such as:

```text
priyansu
dev2
new
latest
final
final2
test123
changes
```

---

# 4. Standard Development Flow

Normal work follows:

```text
GitHub Issue
    ↓
develop
    ↓
feature/fix branch
    ↓
local development
    ↓
tests + docs
    ↓
Pull Request
    ↓
CI
    ↓
peer review
    ↓
develop
    ↓
staging deployment
    ↓
QA / founder verification
    ↓
release PR
    ↓
main
    ↓
production
    ↓
release tag
```

---

# 5. Starting Any New Task

Before starting:

```bash
git checkout develop
git pull origin develop
```

Create branch:

```bash
git checkout -b feature/<short-descriptive-name>
```

Example:

```bash
git checkout -b feature/whatsapp-magic-login
```

Before coding:

1. Read `AGENTS.md`.
2. Read task-relevant `/docs/*.md`.
3. Read the GitHub Issue.
4. Inspect existing implementation.
5. Check whether another developer is changing the same domain.
6. Identify possible database changes.
7. Identify environment-variable changes.
8. Identify documentation changes.
9. Identify acceptance criteria.

## Empty Repository Bootstrap Exception

The permanent branch rules require an existing PR target. When—and only when—the GitHub remote has no refs at all, one documented bootstrap may seed identical initial commits to `main` and `develop` so subsequent work can use Pull Requests.

Bootstrap requirements:

- confirm the remote is empty with a read-only check,
- create a change-queue entry,
- scan the baseline for secrets and add `.gitignore`,
- use a clear Conventional Commit,
- make `main` and `develop` point to the same reviewed baseline,
- do not deploy or claim staging/production merely because branches were created,
- record the exceptional direct branch creation in the queue,
- after seeding, all normal work follows the short-lived branch and PR rules without exception.

This exception cannot be used for an existing repository or for later updates.

---

# 6. Branch Lifetime

Target branch lifetime:

**1–3 working days.**

If a branch is expected to last much longer:

- split the feature,
- merge safe foundations first,
- avoid giant integration branches.

Avoid 2–3 week feature branches.

Long-lived branches create:

- difficult conflicts,
- stale assumptions,
- large PRs,
- harder rollback,
- hidden integration problems.

---

# 7. Pull Request Size

Prefer:

**One logical feature or fix per PR.**

Good:

```text
PR #31 — Add menu API
PR #32 — Add pizza builder modifiers
PR #33 — Add pickup slot reservation
```

Bad:

```text
PR #31 — Entire customer app + backend + KDS + loyalty
```

A PR should be understandable by the other developer without hours of archaeology.

---

# 8. Pull Request Template

Every PR should include:

```md
## What changed

Describe the implementation.

## Why

Explain the business/product reason.

## GitHub Issue

Closes #XX

## Affected modules

- Auth
- Orders
- Payment
- KDS
- etc.

## Database changes

- None
or
- migration details

## Environment changes

- None
or
- new variables

## API changes

- None
or
- endpoints/contracts changed

## Tests performed

- unit
- integration
- E2E
- manual

## Edge cases tested

List important failure states.

## Documentation updated

List relevant `/docs` files.

## Screenshots

Required for meaningful UI changes.

## Risks / known limitations

Describe anything reviewers should know.

## Rollback

Explain how this change can be reverted if needed.
```

---

# 9. Review Rules

## Into `develop`

Normal expectation:

- 1 approval from the other developer.
- CI must pass.
- conversations resolved.
- database migration reviewed where applicable.
- documentation updated.

## Into `main`

Requirements:

- staging tested,
- CI green,
- no unresolved blocker,
- both developers aware of release,
- founder/business verification when feature affects money or operations.

---

# 10. GitHub Branch Protection

## `main`

Enable:

- Require pull request.
- Require at least 1 approval.
- Require status checks.
- Require branch to be up to date if practical.
- Block force pushes.
- Block deletion.
- Prevent direct pushes.
- Require conversation resolution.

Recommended additional rule:

- Restrict production deployment environment to approved branch/ref.

## `develop`

Enable:

- Require PR.
- Require CI checks.
- Block force pushes.
- Block deletion.

---

# 11. Commit Convention

Use Conventional Commits.

Allowed common prefixes:

```text
feat:
fix:
refactor:
docs:
test:
chore:
perf:
build:
ci:
```

Examples:

```text
feat: add whatsapp magic login
feat: add pizza modifier applicability
fix: prevent duplicate reward credit
fix: release expired pickup reservation
refactor: extract payment provider adapter
docs: update deployment architecture
test: add payment webhook replay coverage
chore: update dependencies
```

Avoid:

```text
update
changes
fixed
final
more changes
```

---

# 12. Merge Strategy

Recommended:

**Squash Merge** for normal PRs.

Why:

- clean history,
- one logical commit per feature,
- easy rollback,
- fewer noisy commits.

Before final PR:

```bash
git fetch origin
git rebase origin/develop
```

or otherwise synchronize safely with the current target branch.

Do not rewrite already shared protected branch history.

---

# 13. Two-Developer Ownership Model

Avoid permanent developer-specific branches.

Recommended primary ownership:

## Developer A
Primary areas:
- Customer PWA
- UX/UI
- shared UI
- design system
- customer analytics instrumentation

## Developer B
Primary areas:
- NestJS backend
- PostgreSQL/Prisma
- KDS
- integrations
- deployment

Shared:
- Founder/Admin
- architecture
- testing
- release decisions

Ownership means:

**primary responsibility, not exclusive access.**

Both developers should understand and review critical domains.

---

# 14. Environment Mapping

```text
feature/*
→ local development / optional preview

develop
→ staging

main
→ production
```

Never mix these.

---

# 15. Database Separation

Use separate databases/environments:

```text
pizza_avenue_dev
pizza_avenue_staging
pizza_avenue_prod
```

Rules:

- Local development must not use production DB.
- Staging must not use production DB.
- Automated tests must not use production DB.
- Production credentials must never exist in `.env.example`.

---

# 16. Redis Separation

Use separate Redis namespaces/instances/configuration for:

- local,
- staging,
- production.

Never let staging BullMQ workers consume production queues.

---

# 17. Payment Environments

## Local/Staging
Use:

- sandbox credentials,
- test webhooks,
- test payment flows.

## Production
Use:

- live provider credentials.

Staging must never accidentally charge a real customer.

---

# 18. WhatsApp Environments

Use test/sandbox recipients or controlled staging setup.

Production uses the official Pizza Avenue WhatsApp Business account.

Do not allow staging automation to message production customers.

---

# 19. Environment Variables

Commit:

```text
.env.example
```

Never commit:

```text
.env
.env.local
.env.production
.env.staging
```

Example only:

```text
DATABASE_URL=
REDIS_URL=
SESSION_SECRET=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_VERIFY_TOKEN=
PAYMENT_PROVIDER_SECRET=
R2_ACCESS_KEY=
R2_SECRET_KEY=
SENTRY_DSN=
```

Never put real secrets in docs, issues, PR descriptions, or screenshots.

---

# 20. Database Migration Rules

All PostgreSQL schema changes must use Prisma migrations.

Development example:

```bash
npx prisma migrate dev --name add_magic_login
```

Production:

```bash
npx prisma migrate deploy
```

Rules:

- migration files are committed,
- no manual production schema edits,
- migration reviewed in PR,
- migration tested on staging,
- destructive changes require explicit review.

---

# 21. Safe Database Evolution

Prefer expand-and-contract migrations.

Bad:

```text
DROP old_column immediately
```

Safer:

### Release A
Add new column and support both.

### Release B
Backfill/migrate data.

### Release C
Stop using old column.

### Release D
Remove old column.

This makes rollback much safer.

---

# 22. Migration Conflict Prevention

If both developers are touching Prisma schema:

1. communicate first,
2. pull latest `develop`,
3. keep migrations small,
4. sync before PR merge,
5. verify generated migration order.

Do not casually regenerate/delete another developer's migration.

---

# 23. CI Required Checks

Every PR should run at minimum:

```text
install
lint
typecheck
unit tests
backend/domain tests
frontend build
backend build
```

Recommended commands:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Add E2E tests for critical flows as project matures.

If required CI fails:

**do not merge.**

---

# 24. Critical Tests Before Main

Before release, validate at least:

- customer authentication,
- WhatsApp magic login,
- menu,
- pizza builder,
- backend price validation,
- pickup capacity,
- payment success,
- payment failure,
- duplicate payment webhook,
- KDS update,
- ready-to-pickup,
- duplicate handover prevention,
- loyalty credit,
- Pizza Passport,
- refund if implemented.

---

# 25. Documentation Rule

Code and documentation move together.

If a change affects:

- business rule,
- permission,
- state,
- API,
- DB,
- integration,
- analytics,
- deployment,

update the relevant docs in the **same PR**.

Examples:

Payment change may require:

```text
02_BUSINESS_RULES.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
14_TEST_PLAN.md
17_CHANGELOG.md
18_ACCEPTANCE_CRITERIA.md
```

Architecture decision:

also update:

```text
16_DECISIONS.md
```

Deployment change:

also update:

```text
21_DEPLOYMENT_ARCHITECTURE.md
```

---

# 26. Changelog Rule

Every merged meaningful feature/fix should add an entry to:

```text
docs/17_CHANGELOG.md
```

Include:

- added,
- changed,
- fixed,
- docs affected,
- decision reference if relevant,
- known risk.

---

# 27. GitHub Issues

Every meaningful task should have an Issue.

Examples:

```text
#21 WhatsApp Magic Login
#22 Pickup Capacity
#23 Payment Idempotency
#24 KDS Reconnect
```

PR should reference:

```text
Closes #21
```

This gives traceability:

```text
business request
→ issue
→ branch
→ PR
→ commit
→ release
```

---

# 28. GitHub Project Board

Recommended statuses:

```text
BACKLOG
READY
IN PROGRESS
IN REVIEW
STAGING TEST
DONE
```

Avoid adding complex project-management tooling until needed.

---

# 29. Recommended Labels

```text
frontend
backend
database
auth
payment
kds
admin
loyalty
analytics
security
bug
production
documentation
priority-high
blocked
```

---

# 30. Feature Flags

Use selectively for features that need integration before production activation.

Examples:

```text
FEATURE_WHATSAPP_LOGIN
FEATURE_PIZZA_PASSPORT
FEATURE_REFERRALS
FEATURE_SCHEDULED_PICKUP
```

Do not create a flag for every tiny feature.

Flag behavior must be documented and tested.

---

# 31. Staging Validation

After merge to `develop`:

1. deploy staging,
2. run affected flow,
3. test failure state,
4. test role permissions,
5. inspect API/log errors,
6. verify DB migration,
7. verify analytics if applicable,
8. check mobile UI if customer-facing.

Only after staging is stable should a release go to `main`.

---

# 32. Release Flow

When a release batch is ready:

```text
develop
    ↓
Release PR
    ↓
main
    ↓
Production
    ↓
Tag
```

Examples:

```text
v0.1.0
v0.2.0
v1.0.0
v1.0.1
v1.1.0
```

Use semantic versioning.

### PATCH
Bug fix:
`1.0.1`

### MINOR
Backward-compatible feature:
`1.1.0`

### MAJOR
Intentional breaking release:
`2.0.0`

---

# 33. Production Hotfix Workflow

If production has an urgent issue:

```text
main
 ↓
hotfix/<issue>
 ↓
PR
 ↓
main
 ↓
production
```

Example:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/payment-webhook-idempotency
```

After production fix:

**merge/reconcile the fix back into `develop`.**

Required flow:

```text
hotfix
├── main
└── develop
```

Otherwise the next normal release may reintroduce the bug.

---

# 34. Hotfix Rules

A production hotfix should:

- fix only the urgent problem,
- avoid unrelated refactoring,
- include targeted tests,
- update changelog,
- document root cause,
- be reviewed even if expedited.

After incident:

create a follow-up Issue for deeper cleanup if needed.

---

# 35. Rollback

Every production release should have a rollback plan.

Application rollback may restore previous image/tag.

Database rollback requires extra care.

Therefore:

- prefer backward-compatible migrations,
- do not rely blindly on reverse migrations,
- backup before risky schema/data operation.

---

# 36. Production Deployment Rule

Production deploys from:

```text
main
```

preferably:

```text
tagged main commit
```

Never deploy a random feature branch directly to production.

Never treat staging as production.

---

# 37. Release Checklist

Before production:

- [ ] CI green
- [ ] staging tested
- [ ] DB migration reviewed
- [ ] payment tested if touched
- [ ] auth tested if touched
- [ ] KDS tested if touched
- [ ] environment variables configured
- [ ] docs updated
- [ ] changelog updated
- [ ] monitoring available
- [ ] rollback understood
- [ ] both developers aware
- [ ] founder approval if business-critical

---

# 38. Code Review Priorities

Review in this order:

1. correctness,
2. security,
3. money/payment implications,
4. state-machine validity,
5. data integrity,
6. permission checks,
7. failure/retry behavior,
8. tests,
9. maintainability,
10. formatting/style.

Do not spend more time debating naming than payment correctness.

---

# 39. High-Risk Code

Changes touching these require extra review:

- payment
- refunds
- authentication
- sessions
- WhatsApp identity
- RBAC
- pricing
- loyalty ledger
- pickup capacity
- order state machine
- DB migrations
- production deployment
- secrets
- backup/recovery

---

# 40. Never Do These

Never:

- push directly to `main`,
- develop long-term on `main`,
- use production DB for testing,
- commit secrets,
- bypass payment verification,
- bypass state machine,
- bypass backend authorization,
- manually modify production schema casually,
- merge failing CI,
- force-push protected branches,
- deploy unreviewed migrations,
- allow staging worker to process production jobs,
- leave docs intentionally inconsistent.

---

# 41. Daily Developer Routine

Each developer should:

```text
1. Check assigned Issue
2. Sync develop
3. Create short branch
4. Read relevant docs
5. Build/test locally
6. Update docs
7. Push
8. Open PR
9. Peer review
10. Merge to develop
11. Test staging
```

---

# 42. Final Branch Model

```text
                         main
                      PRODUCTION
                           ▲
                           │
                       release PR
                           │
                        develop
                        STAGING
                    ▲       ▲       ▲
                    │       │       │
              feature/*   fix/*   docs/*
```

Emergency:

```text
main
 ↓
hotfix/*
 ├──→ main
 └──→ develop
```

---

# 43. Golden Rule

**`main` must always be trustworthy.**

**`develop` must always be testable.**

**Feature branches must always be temporary.**

**Documentation must always follow code.**
