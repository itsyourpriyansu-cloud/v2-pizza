# 24 — Pizza Avenue Change Queue

> **Purpose:** Chronological operational history of all meaningful changes in the Pizza Avenue codebase.
> **Rule:** Every meaningful feature, fix, refactor, migration, deployment, incident, rollback, documentation update, or architecture decision must be recorded here.

This file is not a replacement for Git history, GitHub Issues, Pull Requests, `17_CHANGELOG.md`, or `16_DECISIONS.md`.

It is the **human-readable execution queue** that makes it easy to understand:

- what changed,
- why it changed,
- where it changed,
- who changed it,
- what is pending,
- what must be tested,
- whether it reached staging,
- whether it reached production,
- whether follow-up work remains.

---

# 1. Queue Rules

Every meaningful task creates one queue item.

Each queue item gets a unique ID:

```text
CHG-0001
CHG-0002
CHG-0003
```

Never reuse an ID.

Do not delete completed queue items.

If a change is reverted:
- keep original entry,
- add a new rollback/revert entry,
- link both.

---

# 2. Allowed Status Values

Use only:

```text
PLANNED
IN_PROGRESS
IN_REVIEW
STAGING
BLOCKED
READY_FOR_RELEASE
PRODUCTION
ROLLED_BACK
CANCELLED
```

---

# 3. Change Types

Use one:

```text
FEATURE
FIX
HOTFIX
REFACTOR
DATABASE
API
UX
SECURITY
INFRA
DEPLOYMENT
DOCUMENTATION
DECISION
TEST
ROLLBACK
```

A change may list more than one if needed.

---

# 4. Priority

Use:

```text
P0 — Production critical
P1 — High priority
P2 — Normal
P3 — Low priority
```

---

# 5. Queue Summary

Keep this section updated.

```text
Next Change ID: CHG-0004

Open:
3

In Progress:
0

Blocked:
0

Ready for Release:
0

Production:
0
```

---

# 6. Active Queue

> Keep only non-final items here.

Final statuses are:
- PRODUCTION
- ROLLED_BACK
- CANCELLED

When an item reaches a final state, move it to **Completed History** below.

## CHG-0001 — Publish governed documentation baseline to GitHub

- **Status:** IN_REVIEW
- **Type:** DOCUMENTATION, INFRA
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-05
- **Last Updated:** 2026-10-05

### Business Reason

Establish the authoritative Pizza Avenue documentation in the empty GitHub repository and make the documented branch, review and change-queue workflow enforceable for every later coding task.

### Requested Outcome

The complete documentation baseline is safely published without secrets; `main` and `develop` exist for production/staging workflow; the actual baseline is proposed from a short-lived documentation branch; future agents can discover and must follow documents 21–25.

### Scope

Included:
- verify the destination remote is empty,
- add a repository-safe `.gitignore`,
- connect `AGENTS.md`, README and the master index to governance docs 21–25,
- document the one-time empty-repository bootstrap exception,
- initialize Git and publish the documentation baseline,
- create GitHub Issue/PR where available.

Excluded:
- application/prototype code,
- GitHub branch-protection or account settings,
- staging or production deployment,
- product/business-rule changes.

### GitHub Tracking

Issue:
- #1

Branch:
- `docs/repository-bootstrap`

Pull Request:
- #3 — merged into `develop`; no staging deployment was performed
- #2 — merged into `main` before the prescribed `develop` review path; recorded as a workflow deviation, not a deployment

### Affected Surfaces

- Documentation
- Repository workflow
- Infrastructure governance

### Affected Modules

- None; no application modules exist or change.

### Files / Areas Changed

- `.gitignore`
- `AGENTS.md`
- `README.md`
- `docs/17_CHANGELOG.md`
- `docs/20_MASTER_INDEX.md`
- `docs/22_GIT_GITHUB_WORKFLOW_RULES.md`
- `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`
- `docs/24_CHANGE_QUEUE.md`
- initial Git metadata and remote branch publication

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New endpoints:
- None

Changed endpoints:
- None

Breaking change:
- No

### State Machine Impact

- None

### Permission Impact

- No application permission change. GitHub repository settings are intentionally not modified.

### Analytics Impact

- None

### Environment / Secret Impact

New env vars:
- None

Changed env vars:
- None

`.gitignore` prevents local environment files, private keys, logs, database dumps and backups from being committed.

### Documentation Updated

- `AGENTS.md`
- `README.md`
- `docs/17_CHANGELOG.md`
- `docs/20_MASTER_INDEX.md`
- `docs/22_GIT_GITHUB_WORKFLOW_RULES.md`
- `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Markdown structure/required-reference validation
- [x] Secret-name and staged-content scan
- [x] Git branch/remotes/status verification
- [x] Remote refs verification after push
- [x] GitHub Issue/PR verification where available
- [ ] Staging — not applicable/not deployed
- [ ] Production smoke test — not applicable/not deployed

### Edge Cases

- Empty remote has no base branch for the first PR.
- Initial branch seeding must not be misreported as staging or production deployment.
- Later work must not reuse the bootstrap exception.
- No local secret or backup artifact may enter the initial commit.
- A separate PR from the bootstrap branch was merged into `main` while the governed `develop` PR remained open.

### Security Review

- Auth implications: Git transport uses the developer's configured credential helper; credentials are not printed or committed.
- RBAC implications: none in the application; repository settings remain owner-controlled.
- Secret/PII implications: scan staged files and exclude environment/private-key/database-backup artifacts.
- Replay/idempotency implications: pushes are non-force and remote refs are verified before and after.

### Staging Result

Status:
- Not Tested — no staging deployment performed

### Production Result

Status:
- Not Released — a documentation merge exists on `main`, but no production deployment or smoke-test evidence exists

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- The empty remote requires one exceptional branch-seeding operation before PR targets exist.
- Branch protection and required approvals remain owner-managed GitHub settings and are not changed by this task.
- The governed Pull Request #3 remains unmerged until peer review and validation are complete.
- Pull Request #2 bypassed the documented `develop`-first release flow by merging the baseline into `main`; this must not be treated as staging or production deployment.

### Follow-Up

- [x] Record the actual Pull Request reference: #3.
- [ ] Obtain peer review before merging the baseline PR.
- [ ] Decide whether Pull Request #2's premature `main` merge should be retained as a documented bootstrap exception or reverted through a new reviewed PR.

### Final Result

In review. Governance consistency work and staged-content security checks passed. The empty remote was seeded with identical bootstrap refs for `main` and `develop`, and the complete documentation baseline was pushed to `docs/repository-bootstrap`. GitHub Issue #1 records the work, and Pull Request #3 is open against `develop` for peer review. Pull Request #2 was separately merged into `main` by `gitg2k3` before the required `develop` review flow completed; no attempt was made to hide, overwrite or revert that event. No staging or production deployment occurred.

### Related Changes

- None

---

## CHG-0002 — Frontend Stage 1 Architecture Foundation

- **Status:** IN_REVIEW
- **Type:** FEATURE, REFACTOR, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-05
- **Last Updated:** 2026-10-05

### Business Reason

Create a production-shaped frontend operating foundation so Customer, KDS and Admin work can proceed in parallel and later replace mocked HTTP responses with the frozen NestJS `/api/v1` backend without rewriting route or feature architecture.

### Requested Outcome

A buildable, type-safe, route-complete, mock-powered and testable pnpm workspace using React 19, Vite, TypeScript, React Router, TanStack Query, Zustand, React Hook Form, Zod, MSW, Vitest and React Testing Library. The result must remain visually neutral and contain no backend, database, provider or real-auth implementation.

### Scope

Included:
- create `apps/customer`, `apps/kds` and `apps/admin`,
- create shared `types`, `api-client`, `mocks`, `utils` and neutral `ui` packages,
- define documented domain/state contracts and integer-paise `Money`,
- model documented `/api/v1` HTTP contracts through a typed API client,
- provide realistic seed fixtures, factories and programmatically switchable mock scenarios,
- configure TanStack Query for server state and Zustand only for transient prototype state,
- provide React Hook Form/Zod schema foundations,
- add representative architecture tests, workspace lint/typecheck/test/build commands and CI validation,
- document developer commands, the paise contract decision and actual verification results.

Excluded:
- polished or high-fidelity UI,
- final brand/design tokens or component styling,
- NestJS services/controllers, Prisma, PostgreSQL, Redis or BullMQ,
- real OTP, WhatsApp, payment, session or WebSocket integration,
- marketplace/delivery features,
- deployment and GitHub repository settings.

### GitHub Tracking

Issue:
- #4

Branch:
- `feature/frontend-stage-1-foundation`

Pull Request:
- #6 — open against `develop`

### Affected Surfaces

- Customer PWA foundation
- Kitchen/KDS foundation
- Founder/Admin foundation
- Shared frontend packages

### Affected Modules

- `apps/customer`
- `apps/kds`
- `apps/admin`
- `packages/types`
- `packages/api-client`
- `packages/mocks`
- `packages/utils`
- `packages/ui`

### Files / Areas Changed

- root pnpm, TypeScript, ESLint, Vitest, environment and CI configuration
- `apps/customer` route/feature/query/form/scenario foundation
- `apps/kds` route/query foundation
- `apps/admin` route/query foundation
- `packages/types` shared domain contracts
- `packages/api-client` typed HTTP modules and error normalization
- `packages/mocks` MSW handlers, realistic fixtures, factories and scenarios
- `packages/utils` query keys, integer-paise money helpers and order-transition validation
- `packages/ui` neutral structural primitives only
- generated MSW browser workers for the three applications

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New backend endpoints:
- None

Frontend contract impact:
- typed client functions and MSW handlers mirror the existing frozen `/api/v1` contracts

Breaking change:
- No production API exists or changes in this stage

### State Machine Impact

- No production state transitions are implemented.
- Shared types use the documented order, payment, pickup, reward and store values.
- A pure test helper validates the documented order transition graph and rejects illegal shortcuts.

### Permission Impact

- No real authentication or authorization is implemented.
- KDS/Admin route shells do not grant access; future protected APIs remain server-authoritative.

### Analytics Impact

- Shared event names/types mirror `12_ANALYTICS_EVENTS.md` for contract readiness.
- No analytics provider or authoritative financial reporting is implemented.

### Environment / Secret Impact

New placeholder variables:
- `VITE_API_BASE_URL`
- `VITE_APP_ENV`
- `VITE_ENABLE_MOCKS`

Changed secrets:
- None

### Documentation Updated

- `README.md`
- `docs/16_DECISIONS.md`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace lint
- [x] Workspace typecheck
- [x] Unit/component tests — 27 passed
- [x] App boot tests — Customer, KDS and Admin
- [x] Customer route resolution tests
- [x] Mocked menu API-client test
- [x] TanStack Query rendering test
- [x] Payment-failure scenario test
- [x] Pickup-full scenario test
- [x] Valid and invalid order-state transition tests
- [x] Customer/KDS/Admin production builds
- [x] Local dev-server HTTP smoke checks — ports 5173, 5174 and 5175 returned HTTP 200
- [ ] Staging — not performed in this task
- [ ] Production smoke test — not performed in this task

### Edge Cases

- page and feature modules must not import mock fixtures directly,
- mocks must use documented HTTP contracts rather than simplified prompt examples,
- provisional client prices must never appear authoritative,
- future order-source values must not create marketplace integrations,
- invalid mock order-state transitions must be rejected,
- scenario changes must remain deterministic between tests,
- MSW must be disabled safely when a real backend is introduced.

### Security Review

- Auth implications: modeled states only; no real OTP, magic token, cookie or credential storage.
- RBAC implications: route placeholders are not authorization; protected APIs remain future server responsibilities.
- Secret/PII implications: only fictional data and empty environment placeholders; no real phone, OTP, token or provider payload.
- Replay/idempotency implications: contracts expose idempotency boundaries, but no provider processing is implemented.

### Staging Result

Status:
- Not Tested — no staging deployment performed

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- Menu names/prices are realistic documentation fixtures, not founder-approved production menu truth.
- MSW validates frontend architecture only and cannot prove future backend enforcement, transactions, idempotency or permissions.
- Stage 1 intentionally leaves visual design and high-fidelity interaction decisions open.
- Browser MSW is development-only and is removed from the live data path by setting `VITE_ENABLE_MOCKS=false` when a backend is available.

### Follow-Up

- [x] Open Pull Request #6 into `develop` after all required checks passed.
- [ ] Obtain review before merge.
- [ ] Define the design system and implement the high-fidelity Customer PWA in the next task only.

### Final Result

In review in Pull Request #6. The three applications boot, all requested routes resolve, frontend modules consume typed HTTP contracts through TanStack Query and the shared API client, and MSW provides realistic fixtures/scenarios without page-level data coupling. Lint, typecheck, 27 tests, three production builds and local HTTP smoke checks pass. No backend, database, provider, real authentication, deployment or final design system was created. No staging or production deployment occurred.

### Related Changes

- CHG-0001

---

## CHG-0003 — Design System Foundation — Pizza Avenue

- **Status:** IN_REVIEW
- **Type:** DOCUMENTATION, UX
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-06
- **Last Updated:** 2026-10-06

### Business Reason

Give the future Landing, Customer, KDS and Admin interfaces one coherent Pizza Avenue brand language without prematurely forcing them into identical layouts or implementing polished UI before the visual direction is approved.

### Requested Outcome

Document a flexible design-system foundation and visual direction using the supplied references, the official seven-colour palette, Cardo and Inter, the current Stage 1 frontend architecture, and a careful audit of reusable Pizza Wave assets and interaction logic. Preserve suitable non-logo image candidates for later implementation without wiring them into an application in this documentation-only task.

### Scope

Included:
- create `docs/27_DESIGN_SYSTEM_FOUNDATION.md`,
- create `docs/28_UI_VISUAL_DIRECTION.md`,
- distinguish frozen, recommended and exploratory decisions,
- define semantic colour, typography, spacing, radius, elevation, imagery, motion, accessibility and responsive guidance,
- document Landing/Customer/KDS/Admin component separation,
- audit current V2 components and the legacy `pizza_wave_v1` component/asset library,
- preserve supplied references and approved non-logo Pizza Wave image candidates as documentation assets,
- extract the photographed menu as preliminary founder-validation content only,
- update design-system discovery, changelog and queue documentation.

Excluded:
- final Landing or app UI,
- production CSS/design-token implementation,
- React component implementation or restyling,
- animation implementation,
- logo creation or adoption,
- backend, database, provider or deployment work,
- treating preliminary menu prices or legacy imagery as production truth.

### GitHub Tracking

Issue:
- #9

Branch:
- `docs/design-system-foundation`

Pull Request:
- #10 — open against `feature/frontend-stage-1-foundation`; retarget to `develop` after Pull Request #6 merges

### Affected Surfaces

- Landing / Marketing direction
- Customer PWA direction
- Kitchen/KDS direction
- Founder/Admin direction
- Shared UI and brand foundations
- Documentation asset library

### Affected Modules

- `docs/06_DESIGN_SYSTEM.md`
- `docs/20_MASTER_INDEX.md`
- `docs/27_DESIGN_SYSTEM_FOUNDATION.md`
- `docs/28_UI_VISUAL_DIRECTION.md`
- `docs/assets/design-references`
- `packages/ui` audit only; no implementation change
- legacy `pizza_wave_v1` audit only; no source mutation

### Files / Areas Changed

- `AGENTS.md`
- `README.md`
- `docs/06_DESIGN_SYSTEM.md`
- `docs/16_DECISIONS.md`
- `docs/17_CHANGELOG.md`
- `docs/20_MASTER_INDEX.md`
- `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`
- `docs/24_CHANGE_QUEUE.md`
- `docs/27_DESIGN_SYSTEM_FOUNDATION.md`
- `docs/28_UI_VISUAL_DIRECTION.md`
- `docs/assets/design-references/*`
- `docs/assets/pizza-wave-candidates/*`

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New endpoints:
- None

Changed endpoints:
- None

Breaking change:
- No

### State Machine Impact

- None

### Permission Impact

- None

### Analytics Impact

- No event implementation or contract change; later UI work must use the existing documented analytics events.

### Environment / Secret Impact

New env vars:
- None

Changed secrets:
- None

### Documentation Updated

- `AGENTS.md`, `README.md`, `docs/06_DESIGN_SYSTEM.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/20_MASTER_INDEX.md`, `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`, `docs/24_CHANGE_QUEUE.md`, `docs/27_DESIGN_SYSTEM_FOUNDATION.md`, `docs/28_UI_VISUAL_DIRECTION.md`

### Tests Required

- [x] Markdown/reference validation
- [x] Official palette value scan
- [x] Cardo/Inter direction scan
- [x] Logo-assumption scan
- [x] Preliminary-menu disclaimer scan
- [x] Asset filename/hash inventory — six unique Pizza Wave candidates
- [x] Repository lint — passed
- [x] Repository typecheck — passed
- [x] Repository tests — 5 files, 27 tests passed
- [x] Repository builds — Customer, KDS and Admin passed
- [ ] Staging — not part of this task
- [ ] Production smoke test — not part of this task

### Edge Cases

- legacy Pizza Wave colors, typography and delivery/Puri assumptions must not leak into Pizza Avenue V2,
- duplicate legacy images must not be copied repeatedly,
- legacy logo and loyalty artwork must not be treated as the Pizza Avenue logo,
- image colors must not become brand tokens,
- supplied website screenshots are references, not layouts to reproduce,
- preliminary menu text/prices must not become authoritative seed or commerce data,
- design guidance must remain usable across expressive and operational surfaces without tightly coupling their composition layers.

### Security Review

- Auth implications: none.
- RBAC implications: none.
- Secret/PII implications: reference and legacy image candidates contain no credentials or customer data; branded third-party imagery must be rejected.
- Replay/idempotency implications: none.

### Staging Result

Status:
- Not Tested — documentation-only work has not been deployed

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- The supplied palette/typography direction is frozen, but exact logo, production photography and some founder menu decisions remain unavailable.
- Legacy prototype imagery may be useful for exploration but still requires founder approval, provenance review and production optimization before customer-facing release.
- CHG-0002 and Pull Request #6 must reach `develop` before this stacked documentation change can be cleanly retargeted there.

### Follow-Up

- [ ] Obtain founder/design review of the design-system foundation.
- [ ] After approval, create the first high-fidelity Landing Hero + Header exploration as a separate task.
- [ ] Decide final logo asset, photography provenance and production image pipeline before release.

### Final Result

Documentation and asset curation are complete and validated. No UI implementation has started. Pull Request #10 is in review and remains stacked on CHG-0002 / Pull Request #6.

### Related Changes

- CHG-0002

---

## Template — Active Change

```md
## CHG-0001 — Short descriptive title

- **Status:** IN_PROGRESS
- **Type:** FEATURE
- **Priority:** P2
- **Owner:** Developer A
- **Created:** YYYY-MM-DD
- **Last Updated:** YYYY-MM-DD

### Business Reason

Why this change exists.

### Requested Outcome

What must be true when this is finished.

### Scope

Included:
- ...

Excluded:
- ...

### GitHub Tracking

Issue:
- #XX

Branch:
- `feature/example`

Pull Request:
- #XX

### Affected Surfaces

- Customer
- KDS
- Counter
- Admin
- Backend
- Database
- Infrastructure

### Affected Modules

- auth
- orders
- payments
- etc.

### Files / Areas Changed

- `apps/customer/...`
- `server/src/...`
- `docs/...`

### Database Impact

Migration required:
- Yes / No

Migration:
- `migration_name`

Data migration required:
- Yes / No

### API Impact

New endpoints:
- ...

Changed endpoints:
- ...

Breaking change:
- Yes / No

### State Machine Impact

- None
or
- describe exact transition changes

### Permission Impact

- None
or
- affected role/permission

### Analytics Impact

Events added/changed:
- ...

### Environment / Secret Impact

New env vars:
- ...

Changed env vars:
- ...

### Documentation Updated

- `02_BUSINESS_RULES.md`
- `08_DATA_MODEL.md`
- etc.

### Tests Required

- [ ] Unit
- [ ] Integration
- [ ] API
- [ ] UI
- [ ] E2E
- [ ] Manual
- [ ] Staging
- [ ] Production smoke test

### Edge Cases

- ...
- ...

### Security Review

- Auth implications:
- RBAC implications:
- Secret/PII implications:
- Replay/idempotency implications:

### Staging Result

Status:
- Not Tested / Passed / Failed

Notes:
- ...

### Production Result

Status:
- Not Released / Released / Rolled Back

Release:
- `vX.Y.Z`

Deployment date:
- ...

### Known Risks

- ...

### Follow-Up

- [ ] ...
- [ ] ...

### Final Result

What ultimately happened.

### Related Changes

- CHG-XXXX
```

---

# 7. Completed History

> Move items here only after a final status.

---

## Example

## CHG-0000 — Establish Change Queue Process

- **Status:** PRODUCTION
- **Type:** DOCUMENTATION
- **Priority:** P2
- **Owner:** Team
- **Created:** YYYY-MM-DD
- **Last Updated:** YYYY-MM-DD

### Business Reason

Create a single operational timeline for tracking every meaningful Pizza Avenue codebase change.

### Requested Outcome

Every developer and coding agent records meaningful work in one easy-to-read queue.

### Scope

Included:
- queue structure,
- status tracking,
- GitHub references,
- testing,
- docs,
- production result,
- follow-up tracking.

Excluded:
- replacing GitHub Issues,
- replacing Git history,
- replacing release changelog.

### Documentation Updated

- `24_CHANGE_QUEUE.md`
- `25_CHANGE_QUEUE_AGENT_RULES.md`

### Final Result

Change queue process established.

---

# 8. Queue Lifecycle

Each change should normally move through:

```text
PLANNED
↓
IN_PROGRESS
↓
IN_REVIEW
↓
STAGING
↓
READY_FOR_RELEASE
↓
PRODUCTION
```

Possible alternative paths:

```text
IN_PROGRESS
→ BLOCKED
→ IN_PROGRESS
```

```text
STAGING
→ IN_PROGRESS
```

```text
PRODUCTION
→ ROLLED_BACK
```

```text
PLANNED
→ CANCELLED
```

---

# 9. When to Create a Queue Entry

Create an entry for:

- new feature,
- bug fix,
- production hotfix,
- database migration,
- API contract change,
- auth change,
- payment change,
- order-state change,
- loyalty rule change,
- KDS change,
- security fix,
- dependency upgrade with impact,
- deployment change,
- backup/recovery change,
- architecture decision,
- important UX flow change,
- rollback,
- production incident.

Do not create an entry for:

- typo only,
- formatting only,
- comment cleanup,
- trivial non-functional rename,

unless it is part of a larger tracked change.

---

# 10. Queue Update Timing

Update the queue:

## Before coding
Create or confirm entry.

Set:

```text
Status: IN_PROGRESS
```

## PR opened

Set:

```text
Status: IN_REVIEW
```

Add PR number.

## Merged to develop / deployed to staging

Set:

```text
Status: STAGING
```

Record staging result.

## Staging approved

Set:

```text
Status: READY_FOR_RELEASE
```

## Production released

Set:

```text
Status: PRODUCTION
```

Record:
- release tag,
- deployment date,
- smoke-test result.

## Rollback

Do not edit old history to pretend it never happened.

Set original item as appropriate and create:

```text
Type: ROLLBACK
```

new entry linked to original.

---

# 11. Relationship to Other Docs

## `17_CHANGELOG.md`

Changelog answers:

> What changed in product/releases?

Change Queue answers:

> What happened operationally from task start to production?

## `16_DECISIONS.md`

Decisions answers:

> What permanent product/architecture choice was made?

Queue answers:

> When and through which task was that decision implemented?

## GitHub Issue

Issue answers:

> What work was requested?

Queue answers:

> What actually happened?

## Pull Request

PR answers:

> What code diff was reviewed?

Queue answers:

> What is the current lifecycle state and final outcome?

---

# 12. Naming Convention

Titles should describe outcome.

Good:

```text
CHG-0041 — Add WhatsApp magic login
CHG-0042 — Prevent duplicate payment confirmation
CHG-0043 — Add pickup slot capacity locking
CHG-0044 — Harden KDS reconnect recovery
```

Bad:

```text
CHG-0041 — Update
CHG-0042 — Changes
CHG-0043 — Fix issue
```

---

# 13. Production Incident Linking

For a production incident:

```text
CHG-0101 — Fix duplicate order on payment replay
```

Then link:

```text
Related Incident:
INC-0003
```

If no incident file exists yet, record the issue/PR references here.

---

# 14. Developer Handoff Rule

Before handing a task to the other developer, update:

- current status,
- what is complete,
- what is not complete,
- branch,
- blockers,
- test status,
- next step.

The receiving developer should be able to continue by reading the queue entry plus linked issue/PR.

---

# 15. Agent Handoff Rule

Every coding agent must read this file before changing code.

The agent must:

1. Find whether a queue item already exists.
2. Reuse it if the task is the same.
3. Create a new queue item if the work is distinct.
4. Update the item before implementation.
5. Update it after implementation.
6. Update it after tests.
7. Update it after staging/production if the agent performs those actions.

The agent must not create duplicate entries for the same task.

---

# 16. Final Rule

Every meaningful Pizza Avenue change must leave behind a clear trail:

```text
Why
↓
Issue
↓
Queue Entry
↓
Branch
↓
Code
↓
Tests
↓
PR
↓
Staging
↓
Production
↓
Final Result
```

If someone cannot understand what happened six months later by reading the queue, the process was not followed correctly.
