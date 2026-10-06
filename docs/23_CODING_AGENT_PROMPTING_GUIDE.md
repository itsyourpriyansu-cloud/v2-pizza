# Pizza Avenue — Coding Agent Prompting Guide

> **Purpose:** Standard prompt framework for Codex, Claude, or any coding agent working on Pizza Avenue.
> **Rule:** Every implementation prompt should instruct the agent to read the repository documentation before touching code.

---

# 1. Why This Guide Exists

AI coding agents can produce code quickly, but they can also:

- invent business rules,
- break existing architecture,
- create duplicate components,
- bypass state machines,
- ignore permissions,
- introduce new dependencies,
- forget tests,
- forget documentation,
- accidentally modify production-oriented configuration.

This guide creates one mandatory operating pattern.

Every coding prompt must make the agent:

```text
READ
↓
UNDERSTAND
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
VERIFY
↓
DOCUMENT
↓
REPORT
```

---

# 2. Mandatory First Instruction

Every substantial coding prompt should begin with:

```text
Before making any code change:

1. Read /AGENTS.md completely.
2. Read /docs/20_MASTER_INDEX.md.
3. Read /docs/22_GIT_GITHUB_WORKFLOW_RULES.md.
4. Read /docs/23_CODING_AGENT_PROMPTING_GUIDE.md.
5. Read /docs/24_CHANGE_QUEUE.md and find/reuse or create the matching CHG item.
6. Read /docs/25_CHANGE_QUEUE_AGENT_RULES.md.
7. Read /docs/16_DECISIONS.md.
8. Read /docs/17_CHANGELOG.md.
9. Read all task-relevant documentation.
10. Inspect the current implementation before proposing changes.

Do not assume the prompt overrides repository architecture.

If the request conflicts with a higher-priority documented rule, stop and report the conflict before implementation.
```

---

# 3. Documentation Selection by Task

## Authentication task

Read:

```text
00_PROJECT_CONTEXT.md
01_PRODUCT_SCOPE.md
02_BUSINESS_RULES.md
03_ROLES_PERMISSIONS.md
04_USER_FLOWS.md
08_DATA_MODEL.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
11_INTEGRATIONS.md
14_TEST_PLAN.md
16_DECISIONS.md
18_ACCEPTANCE_CRITERIA.md
21_DEPLOYMENT_ARCHITECTURE.md
```

---

## Payment task

Read:

```text
02_BUSINESS_RULES.md
03_ROLES_PERMISSIONS.md
08_DATA_MODEL.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
11_INTEGRATIONS.md
14_TEST_PLAN.md
16_DECISIONS.md
18_ACCEPTANCE_CRITERIA.md
```

---

## Menu / Pizza Builder

Read:

```text
01_PRODUCT_SCOPE.md
02_BUSINESS_RULES.md
04_USER_FLOWS.md
05_INFORMATION_ARCHITECTURE.md
06_DESIGN_SYSTEM.md
27_DESIGN_SYSTEM_FOUNDATION.md
28_UI_VISUAL_DIRECTION.md
07_COMPONENTS.md
08_DATA_MODEL.md
10_API_CONTRACTS.md
12_ANALYTICS_EVENTS.md
13_SEED_DATA.md
18_ACCEPTANCE_CRITERIA.md
```

---

## Pickup Capacity

Read:

```text
02_BUSINESS_RULES.md
04_USER_FLOWS.md
08_DATA_MODEL.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
12_ANALYTICS_EVENTS.md
14_TEST_PLAN.md
18_ACCEPTANCE_CRITERIA.md
```

---

## KDS

Read:

```text
01_PRODUCT_SCOPE.md
03_ROLES_PERMISSIONS.md
04_USER_FLOWS.md
05_INFORMATION_ARCHITECTURE.md
07_COMPONENTS.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
14_TEST_PLAN.md
18_ACCEPTANCE_CRITERIA.md
21_DEPLOYMENT_ARCHITECTURE.md
```

---

## Loyalty / Pizza Passport

Read:

```text
02_BUSINESS_RULES.md
04_USER_FLOWS.md
08_DATA_MODEL.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
12_ANALYTICS_EVENTS.md
14_TEST_PLAN.md
18_ACCEPTANCE_CRITERIA.md
```

---

## Founder/Admin

Read:

```text
01_PRODUCT_SCOPE.md
03_ROLES_PERMISSIONS.md
05_INFORMATION_ARCHITECTURE.md
06_DESIGN_SYSTEM.md
27_DESIGN_SYSTEM_FOUNDATION.md
28_UI_VISUAL_DIRECTION.md
07_COMPONENTS.md
08_DATA_MODEL.md
10_API_CONTRACTS.md
12_ANALYTICS_EVENTS.md
18_ACCEPTANCE_CRITERIA.md
```

---

## Deployment / Infrastructure

Read:

```text
AGENTS.md
15_BUILD_PLAN.md
16_DECISIONS.md
21_DEPLOYMENT_ARCHITECTURE.md
```

---

# 4. Agent Source-of-Truth Order

Prompt the agent to respect:

```text
1. docs/16_DECISIONS.md
2. docs/02_BUSINESS_RULES.md
3. docs/01_PRODUCT_SCOPE.md
4. docs/09_STATE_MACHINES.md
5. docs/08_DATA_MODEL.md
6. docs/10_API_CONTRACTS.md
7. docs/03_ROLES_PERMISSIONS.md
8. docs/21_DEPLOYMENT_ARCHITECTURE.md
9. design documents
10. existing code
```

If existing code conflicts with a documented frozen rule:

the agent must report it.

It must not silently make the documentation match a bug.

---

# 5. Mandatory Planning Phase

Before implementation, require the agent to output a short plan containing:

```text
Affected modules:
Affected user roles:
Affected data entities:
Affected APIs:
Affected states:
Affected analytics events:
Affected documentation:
Potential failure cases:
Potential security implications:
Database migration required: yes/no
Environment variable changes: yes/no
```

For a small trivial change, this can be concise.

For authentication/payment/order logic, it should be detailed.

---

# 6. Do Not Let the Agent Immediately Rewrite Code

Use this rule:

```text
First inspect the current implementation.

Prefer modifying existing modules/components over creating parallel replacements.

Before adding a new:
- component
- service
- repository
- utility
- dependency
- database table

search the codebase for an existing equivalent.
```

This prevents duplicate architectures.

---

# 7. Scope Control Instruction

Include:

```text
Implement only the requested scope.

Do not pull Phase 2 features into V1.

Do not add:
- delivery
- driver infrastructure
- external marketplace integration
- microservices
- AI recommendations
- native mobile application

unless explicitly requested and approved.
```

---

# 8. Architecture Guardrails

The agent must preserve:

```text
React/Vite/TypeScript
NestJS/Node.js/TypeScript
Prisma/PostgreSQL
Redis/BullMQ
Socket.IO/WebSocket
Docker Compose
Caddy
Hostinger KVM 2
Cloudflare
Transactional Outbox
```

Do not allow an agent to suddenly introduce:

```text
Firebase
MongoDB
Supabase as new source of truth
Kafka
Kubernetes
GraphQL
Next.js
FastAPI
microservices
```

without explicit architectural approval.

---

# 9. Authentication Guardrail

For customer auth:

```text
Normal:
Phone → OTP → secure session

In-store:
QR → WhatsApp → verified webhook sender → one-time magic token → secure session
```

Never allow:

```text
?phone=123 → authenticated
```

Magic token must be:

- random,
- short-lived,
- stored hashed,
- single use.

---

# 10. Payment Guardrail

Always state:

```text
Frontend payment success is NOT authoritative.

Operational order becomes valid only after server-side payment verification.

Duplicate callbacks must remain idempotent.
```

Any agent changing payment must test:

- success,
- failure,
- timeout,
- duplicate callback,
- replay,
- retry.

---

# 11. Order State Guardrail

Agent must read the state machine before changing order behavior.

No illegal shortcuts.

Example forbidden:

```text
DRAFT → READY
```

State updates must verify:

- current state,
- permission,
- business precondition,
- atomic persistence,
- event history.

---

# 12. Pricing Guardrail

Frontend totals are provisional.

Backend owns:

- price,
- modifier pricing,
- discounts,
- tax,
- rewards,
- final amount.

Never trust client-supplied final totals.

---

# 13. Database Guardrail

Every schema change:

1. Update Prisma schema.
2. Create migration.
3. Review migration.
4. Update `08_DATA_MODEL.md`.
5. Add/modify tests.
6. Mention migration in PR report.

No casual direct production schema changes.

---

# 14. Analytics Guardrail

If a user-visible business interaction changes, check:

`12_ANALYTICS_EVENTS.md`.

Add or adjust event instrumentation only when meaningful.

Do not create random inconsistent event names.

---

# 15. Documentation Guardrail

After implementation, the agent must identify whether these need changes:

```text
02_BUSINESS_RULES.md
03_ROLES_PERMISSIONS.md
04_USER_FLOWS.md
05_INFORMATION_ARCHITECTURE.md
07_COMPONENTS.md
08_DATA_MODEL.md
09_STATE_MACHINES.md
10_API_CONTRACTS.md
11_INTEGRATIONS.md
12_ANALYTICS_EVENTS.md
14_TEST_PLAN.md
16_DECISIONS.md
17_CHANGELOG.md
18_ACCEPTANCE_CRITERIA.md
21_DEPLOYMENT_ARCHITECTURE.md
```

Only update relevant documents.

Do not rewrite unrelated docs.

---

# 16. Mandatory Changelog Rule

Every meaningful implementation must append to:

```text
docs/17_CHANGELOG.md
```

Include:

- Added
- Changed
- Fixed
- Docs updated
- Decision reference
- Risk if any

---

# 17. Decision Logging Rule

Update `16_DECISIONS.md` only when the implementation introduces or changes an architectural/product decision.

Do not fill it with ordinary implementation details.

---

# 18. Testing Instruction

Every coding prompt should end with:

```text
After implementation:

1. Run lint.
2. Run typecheck.
3. Run affected unit tests.
4. Run affected integration tests.
5. Run the relevant build.
6. Run E2E tests where available.
7. Verify acceptance criteria.
8. Report any test that could not be run and why.
```

Never allow:

> "Should work."

Require actual verification.

---

# 19. Failure-Case Instruction

Prompt the agent to test failure behavior explicitly.

Examples:

### Auth
- expired OTP
- reused magic link
- invalid webhook
- duplicate WhatsApp message

### Payment
- failure
- duplicate webhook
- delayed callback
- invalid signature

### Pickup
- slot becomes full
- reservation expires

### Cart
- item sold out
- price changed

### KDS
- WebSocket disconnect
- stale state action

### Loyalty
- duplicate completion event
- refund reversal

---

# 20. Security Review Instruction

For security-sensitive work require:

```text
Review:
- authentication
- authorization
- ownership checks
- rate limits
- secrets
- input validation
- replay/idempotency
- logs
- PII handling
```

Never log:

- OTP
- raw magic token
- access/session secret
- WhatsApp access token
- payment secret.

---

# 21. Git Workflow Instruction for Agents

Include this:

```text
Do not commit directly to main or develop.

Assume work belongs on a task branch based on latest develop.

Recommended branch:
feature/<name>
fix/<name>
hotfix/<name> only for production emergency.

Do not force push protected branches.

Do not change unrelated files.
```

If the agent has GitHub access, it should follow repository protection policies.

---

# 22. Required Final Implementation Report

Every substantial implementation should conclude with:

```text
## Implementation Summary

### Completed
...

### Files Changed
...

### Database Changes
...

### API Changes
...

### Tests Run
...

### Acceptance Criteria Verified
...

### Documentation Updated
...

### Risks / Remaining Issues
...

### Suggested Next Step
...
```

This makes agent output auditable.

---

# 23. Master Feature Prompt Template

Use this template for normal work:

```text
You are implementing a feature in The Pizza Avenue V1 repository.

BEFORE CODING:

1. Read AGENTS.md.
2. Read docs/20_MASTER_INDEX.md.
3. Read docs/16_DECISIONS.md.
4. Read docs/17_CHANGELOG.md.
5. Read the Git/GitHub workflow document.
6. Read all documentation relevant to this task.
7. Inspect the existing implementation.

SOURCE OF TRUTH:

16_DECISIONS
→ 02_BUSINESS_RULES
→ 01_PRODUCT_SCOPE
→ 09_STATE_MACHINES
→ 08_DATA_MODEL
→ 10_API_CONTRACTS
→ 03_ROLES_PERMISSIONS
→ 21_DEPLOYMENT_ARCHITECTURE
→ design docs
→ existing code

TASK:

[Describe the feature precisely.]

BUSINESS OBJECTIVE:

[Why it exists.]

AFFECTED USERS:

[Customer/Kitchen/Counter/Manager/Founder]

REQUIREMENTS:

[Detailed requirements.]

DO NOT:

- introduce unrelated architecture
- duplicate existing components/services
- add Phase 2 features
- weaken backend validation
- bypass permissions
- trust frontend money/state
- silently change documented business rules

BEFORE IMPLEMENTATION:

Provide a concise plan identifying:
- modules
- roles
- entities
- APIs
- states
- analytics
- tests
- documentation
- migration/environment impact

Then implement.

AFTER IMPLEMENTATION:

- run lint
- run typecheck
- run relevant tests
- run builds
- verify acceptance criteria
- update relevant documentation
- update docs/17_CHANGELOG.md
- update docs/16_DECISIONS.md only if an architectural/product decision changed

Return:
1. summary
2. files changed
3. DB/API changes
4. tests run
5. acceptance criteria
6. docs updated
7. remaining risks
8. recommended next task
```

---

# 24. Bug-Fix Prompt Template

```text
You are fixing a bug in Pizza Avenue.

First read:
- AGENTS.md
- Git workflow rules
- relevant docs
- existing tests
- affected code

BUG:

[Exact behavior.]

EXPECTED:

[Correct behavior.]

REPRODUCTION:

[Steps.]

Before changing code:
1. Identify root cause.
2. Identify whether bug violates documented rule.
3. Add or update a failing regression test where practical.
4. Avoid unrelated refactoring.

After fix:
- run regression test
- run surrounding test suite
- update docs if behavior changed
- update CHANGELOG
- report root cause and fix
```

---

# 25. Production Hotfix Prompt Template

```text
This is a PRODUCTION HOTFIX.

Base branch:
main

Hotfix branch:
hotfix/<name>

Do not introduce unrelated changes.

Before implementation:
- read AGENTS.md
- read Git workflow rules
- read affected architecture/business docs
- identify production impact
- identify rollback

Requirements:
1. Minimal safe fix.
2. Targeted regression test.
3. CI/build validation.
4. CHANGELOG entry.
5. Production deployment notes.
6. Reconcile the hotfix into develop after main is fixed.

Return:
- root cause
- patch summary
- tests
- deployment risk
- rollback
- develop reconciliation required
```

---

# 26. Database Migration Prompt Template

```text
This task modifies the PostgreSQL schema.

Before implementation:
- read AGENTS.md
- read 08_DATA_MODEL.md
- read 16_DECISIONS.md
- inspect existing Prisma schema and migrations

Rules:
- use Prisma migration
- avoid destructive changes where possible
- prefer expand-and-contract
- preserve existing production data
- do not manually edit production DB
- document migration behavior
- update 08_DATA_MODEL.md
- update tests
- update CHANGELOG

Return:
- schema diff
- migration generated
- data migration requirement
- rollback implications
- staging test instructions
```

---

# 27. UI/UX Implementation Prompt Template

```text
Before coding UI:

Read:
- AGENTS.md
- 01_PRODUCT_SCOPE
- 04_USER_FLOWS
- 05_INFORMATION_ARCHITECTURE
- 06_DESIGN_SYSTEM
- 07_COMPONENTS
- 13_SEED_DATA
- 18_ACCEPTANCE_CRITERIA

Inspect existing reusable components first.

Do not invent a parallel design system.

TASK:
[screen/component]

Ensure:
- responsive behavior
- loading
- empty
- error
- disabled
- unavailable
- mobile touch targets
- accessible labeling
- analytics where documented

Use existing shared UI package where possible.

After implementation:
- run frontend build/typecheck
- provide screenshots if workflow permits
- update docs only where behavior changed
```

---

# 28. Backend Feature Prompt Template

```text
Before backend implementation:

Read:
- AGENTS.md
- 02_BUSINESS_RULES
- 03_ROLES_PERMISSIONS
- 08_DATA_MODEL
- 09_STATE_MACHINES
- 10_API_CONTRACTS
- 11_INTEGRATIONS
- 14_TEST_PLAN
- 18_ACCEPTANCE_CRITERIA

Inspect existing:
- NestJS module
- service
- repository
- Prisma schema
- DTO/validation
- tests

Implement through existing modular-monolith boundaries.

Never put large business logic directly in controllers.

Enforce:
- validation
- RBAC
- ownership
- state preconditions
- idempotency where needed
- transaction boundaries

After implementation:
- unit tests
- integration tests
- Swagger/OpenAPI consistency
- docs updates
```

---

# 29. Deployment Prompt Template

```text
Before infrastructure changes:

Read:
- AGENTS.md
- 15_BUILD_PLAN.md
- 16_DECISIONS.md
- 21_DEPLOYMENT_ARCHITECTURE.md
- Git workflow rules

Frozen production baseline:
Hostinger KVM 2
Ubuntu 24.04
Docker Compose
Caddy
NestJS
PostgreSQL
Redis
BullMQ
Cloudflare
R2 backup

Do not introduce a second deployment stack without explicit approval.

TASK:
[deployment change]

Report:
- changed infrastructure
- required secrets
- required DNS changes
- downtime risk
- migration steps
- rollback
- monitoring verification
```

---

# 30. Review Prompt Template

Use an agent as reviewer:

```text
Review this PR against the Pizza Avenue documentation.

Read:
- AGENTS.md
- Git workflow rules
- relevant docs
- PR diff

Prioritize:

1. incorrect business behavior
2. payment/security risk
3. illegal state transition
4. authorization failure
5. data corruption risk
6. migration risk
7. idempotency/retry bugs
8. missing tests
9. documentation drift
10. maintainability

Do not focus primarily on cosmetic style.

Return findings by severity:

BLOCKER
HIGH
MEDIUM
LOW

For each:
- file
- problem
- why it matters
- recommended correction
```

---

# 31. Documentation-Only Prompt Template

```text
This task updates documentation only.

Read the full affected docs before editing.

Do not change architecture casually.

Preserve the documented source-of-truth hierarchy.

If the requested documentation change represents a new product/architecture decision:
- update 16_DECISIONS.md
- update 17_CHANGELOG.md

Search repository for contradictory old references after editing.

Return:
- docs modified
- contradictions removed
- pending decisions
```

---

# 32. Prompt Rule for Large Features

For features spanning multiple domains, do not prompt:

> Build everything.

Use staged prompts:

```text
1. Architecture/data/contracts
2. Backend foundation
3. UI
4. integration
5. analytics
6. test hardening
7. documentation audit
```

This reduces agent drift.

---

# 33. Prompt Rule for Unclear Requirements

Tell the agent:

```text
If an unresolved question affects:
- money
- payment
- permission
- order state
- customer identity
- pickup promise
- reward value
- production data

do not guess.

Report the decision required.
```

For minor implementation details, choose the simplest option consistent with existing architecture.

---

# 34. Definition of Agent Completion

A coding agent is not finished when:

> code was written.

It is finished when:

```text
code
+
tests
+
validation
+
documentation
+
changelog
+
clear implementation report
```

are complete.

---

# 35. Final Prompting Rule

Every future Pizza Avenue development prompt should enforce this sequence:

```text
READ DOCUMENTATION
        ↓
INSPECT CURRENT CODE
        ↓
IDENTIFY IMPACT
        ↓
PLAN
        ↓
IMPLEMENT WITHIN EXISTING ARCHITECTURE
        ↓
TEST SUCCESS + FAILURE
        ↓
VERIFY ACCEPTANCE CRITERIA
        ↓
UPDATE DOCUMENTATION
        ↓
UPDATE CHANGELOG
        ↓
REPORT PRECISELY
```

Do not let an agent skip directly from prompt to code on business-critical features.
