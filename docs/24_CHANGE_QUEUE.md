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
Next Change ID: CHG-0009 (CHG-0005 is reserved on the parallel Landing branch)

Open:
7

In Progress:
1

In Review:
3

Staging:
3

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

- **Status:** STAGING
- **Type:** FEATURE, REFACTOR, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-05
- **Last Updated:** 2026-10-06

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
- Not Tested — merged into `develop` through PR #6 on 2026-10-06; no staging environment or deployment evidence is available.

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

- [x] Merge Pull Request #6 into `develop` after required CI passed.
- [ ] Deploy and validate staging when that environment exists.
- [ ] Define the design system and implement the high-fidelity Customer PWA in the next task only.

### Final Result

Merged into `develop` through PR #6 at `fef19a37c1e080fb46e2722b2b00b2bbf7ecec67`. The three applications boot, all requested routes resolve, frontend modules consume typed HTTP contracts through TanStack Query and the shared API client, and MSW provides realistic fixtures/scenarios without page-level data coupling. Lint, typecheck, 27 tests, three production builds and local HTTP smoke checks passed before merge. No backend, database, provider, real authentication, deployment or final design system was created. No staging or production deployment occurred.

### Related Changes

- CHG-0001

---

## CHG-0003 — Domain Routing Freeze — Root Landing + App Subdomains

- **Status:** STAGING
- **Type:** INFRA, REFACTOR, DOCUMENTATION, DECISION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-06
- **Last Updated:** 2026-10-06

### Business Reason

Separate the public marketing surface from customer and operational applications so the root domain can serve landing/SEO needs while Customer, KDS, Admin and API have clear deployment, security and routing boundaries.

### Requested Outcome

Reserve `pizzaavenue.<domain>` for a minimal landing surface; move Customer, KDS, Admin and API to `app`, `kds`, `admin` and `api` subdomains respectively; remove redundant KDS/Admin internal path namespaces; and document future cookie, CORS, QR/magic-link, DNS and SPA-routing behavior.

### Scope

Included:
- minimal Landing application shell and local-development configuration,
- shared environment-derived surface/API URL configuration,
- KDS/Admin root-relative routing and route-test updates,
- per-app environment examples and local port documentation,
- deployment/domain, CORS, cookie, DNS, magic-link and SPA fallback documentation.

Excluded:
- final landing-page design or content,
- backend, session, CORS, DNS, Cloudflare, Docker or Caddy deployment implementation,
- real WhatsApp, payment or authentication integration,
- staging or production deployment.

### GitHub Tracking

Issue:
- #7 — Domain Routing Freeze — Root Landing + App Subdomains

Branch:
- `feature/domain-routing-freeze`

Pull Request:
- #8 — merged into `develop` after Pull Request #6

### Affected Surfaces

- Landing
- Customer PWA
- Kitchen/KDS
- Founder/Admin
- Infrastructure documentation

### Affected Modules

- `apps/landing`
- `apps/customer`
- `apps/kds`
- `apps/admin`
- `packages/config`
- deployment and routing documentation

### Files / Areas Changed

- `apps/landing` minimal React/Vite architecture shell and local environment example.
- `apps/customer`, `apps/kds` and `apps/admin` environment examples, URL bootstrap configuration and Vite port configuration.
- KDS and Admin React Router paths/tests.
- `packages/config` shared public surface/API URL resolver.
- `compose.yaml`, `Dockerfile.frontend`, `.dockerignore` and `infra/caddy`/`infra/docker` deployment configuration for existing frontend services.
- root workspace scripts, lockfile and local-environment guidance.
- `README.md`, `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/10_API_CONTRACTS.md`, `docs/15_BUILD_PLAN.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/21_DEPLOYMENT_ARCHITECTURE.md` and this queue entry.

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New endpoints:
- None

Changed endpoints:
- None; frontend API base configuration remains `/api/v1`-compatible.

Breaking change:
- No production API exists. KDS/Admin browser route prefixes change before public launch.

### State Machine Impact

- None.

### Permission Impact

- No permission implementation change. Documentation will preserve future cookie-session, CSRF and credentialed CORS requirements.

### Analytics Impact

- None in this routing shell. Landing acquisition instrumentation remains future work.

### Environment / Secret Impact

New public, non-secret Vite configuration may include:
- `VITE_API_BASE_URL`
- `VITE_LANDING_URL`
- `VITE_CUSTOMER_APP_URL`
- `VITE_KDS_URL`
- `VITE_ADMIN_URL`

### Documentation Updated

- `README.md`
- `docs/04_USER_FLOWS.md`
- `docs/05_INFORMATION_ARCHITECTURE.md`
- `docs/10_API_CONTRACTS.md`
- `docs/15_BUILD_PLAN.md`
- `docs/16_DECISIONS.md` (DEC-024)
- `docs/17_CHANGELOG.md`
- `docs/21_DEPLOYMENT_ARCHITECTURE.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Unit/component route tests — Landing CTA and root-relative KDS/Admin route matching; 37 tests pass in 6 files.
- [x] Workspace lint — passed with zero warnings.
- [x] Workspace typecheck — passed across all 11 workspace projects.
- [x] Workspace test suite — 6 files, 37 tests passed.
- [x] Workspace production builds — Landing, Customer, KDS and Admin passed.
- [x] Manual local route smoke checks — HTTP 200 for Landing `/`; Customer `/`, `/menu`, `/cart`, `/orders/example`; KDS `/`, `/orders`; Admin `/`, `/menu`.
- [x] Docker Compose configuration — `docker compose --env-file infra/docker/.env.example config` passed.
- [ ] Docker image build — not run because Docker Desktop's Linux daemon is unavailable on this machine.
- [x] GitHub Actions `frontend-foundation` for PR #8 — passed.
- [ ] Staging — not deployed
- [ ] Production smoke test — not released

### Edge Cases

- Direct SPA navigation/reload for nested Customer, KDS and Admin routes.
- MSW must intercept the configured cross-origin or same-origin `/api/v1` API base.
- Future credentialed API calls must not rely on wildcard CORS.
- QR/WhatsApp magic links must target Customer, never the marketing root domain.

### Security Review

- Auth implications: no session is implemented; document the intended parent-domain, `Secure`, `HttpOnly`, `SameSite=Lax` model for a future backend.
- RBAC implications: none; route relocation is not authorization.
- Secret/PII implications: Vite files contain public URLs only, never session or provider secrets.
- Replay/idempotency implications: none.

### Staging Result

Status:
- Not Tested — merged into `develop`; no staging environment or deployment evidence is available.

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- API, worker, PostgreSQL and Redis are intentionally absent from the current Compose file until their real runtimes exist.
- Docker Desktop's Linux daemon is currently unavailable, so image construction and Caddy runtime validation remain pending.

### Follow-Up

- [x] Create GitHub Issue #7.
- [x] Push branch and open stacked Pull Request #8 against `feature/frontend-stage-1-foundation`.
- [x] Rebase and retarget Pull Request #8 to `develop` after PR #6 merged, with no conflicts.
- [ ] Deploy and validate staging when that environment exists.
- [ ] Build and run the frontend Compose stack on a host with Docker's Linux daemon, then validate Caddy routes and TLS.
- [ ] Configure Cloudflare DNS, TLS Full (strict), secrets and credentialed CORS only during infrastructure rollout.

### Final Result

Merged into `develop` through PR #8 after its dependency, PR #6, merged first. The root domain is reserved by a neutral Landing shell; Customer, KDS and Admin receive dedicated local ports and production/staging URL configuration; KDS/Admin no longer include their subdomain namespaces in browser routes. Compose/Caddy configuration is present for the existing static frontend services, while API/backend runtime services remain intentionally absent. No DNS, Cloudflare, staging or production action occurred.

### Related Changes

- CHG-0002

---

## CHG-0004 — Design System Foundation — Pizza Avenue

- **Status:** STAGING
- **Type:** DOCUMENTATION, UX, DECISION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-06
- **Last Updated:** 2026-10-06

### Business Reason

Give the future Landing, Customer, KDS and Admin interfaces one coherent Pizza Avenue brand language without prematurely forcing them into identical layouts or implementing polished UI before the visual direction is approved.

### Requested Outcome

Document a flexible design-system foundation and visual direction using the supplied references, the official seven-colour palette, the verified Pizza Wave typography pair Phudu and Poppins, the current Stage 1 frontend architecture, and a careful audit of reusable Pizza Wave assets and interaction logic. Preserve suitable non-logo image candidates for later implementation without wiring them into an application in this documentation-only task.

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
- #10 — merged into `develop` at `85e106f73d6c346084157713cdfce38f23d94b38` after synchronization with Pull Requests #6 and #8

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
- [x] Phudu/Poppins direction scan — verified against `pizza_wave_v1/src/main.tsx` and `src/styles/tokens.css`
- [x] Logo-assumption scan
- [x] Preliminary-menu disclaimer scan
- [x] Asset filename/hash inventory — six unique Pizza Wave candidates
- [x] Repository lint — passed
- [x] Repository typecheck — passed
- [x] Repository tests — 6 files, 37 tests passed after synchronization with `develop`
- [x] Repository builds — Landing, Customer, KDS and Admin passed after synchronization with `develop`
- [x] GitHub Actions `frontend-foundation` for Pull Request #10 — passed before merge
- [ ] Staging — not deployed
- [ ] Production smoke test — not released

### Edge Cases

- legacy Pizza Wave colours, delivery/Puri assumptions and unrelated bakery-experiment typography must not leak into Pizza Avenue V2; only the explicitly approved Phudu/Poppins pair is retained,
- duplicate legacy images must not be copied repeatedly,
- legacy logo and loyalty artwork must not be treated as the Pizza Avenue logo,
- image colours must not become brand tokens,
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

### Follow-Up

- [ ] Obtain founder/design review of the design-system foundation.
- [ ] After approval, create the first high-fidelity Landing Hero + Header exploration as a separate task.
- [ ] Decide final logo asset, photography provenance and production image pipeline before release.

### Final Result

Merged into `develop` through Pull Request #10 at `85e106f73d6c346084157713cdfce38f23d94b38`. The design-system foundation, visual direction, curated reference assets and Phudu/Poppins correction are complete. The merge preserves the other developer's CHG-0003 / DEC-024 domain-routing work and records this design work as CHG-0004 / DEC-025. No UI implementation, staging deployment or production release occurred.

### Related Changes

- CHG-0002
- CHG-0003

---

## CHG-0006 — Dual Service Operations — Dine-In Waiter Confirmation + Admin Billing

- **Status:** IN_REVIEW
- **Type:** FEATURE, API, UX, DECISION, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-06
- **Last Updated:** 2026-10-07

### Business Reason

Support restaurant table ordering without weakening Pickup payment safety or duplicating the commerce, kitchen, payment and loyalty architecture.

### Requested Outcome

Keep Pickup payment-first; add opaque table-QR context, customer-to-waiter order submission, waiter-confirmed KDS entry, multiple Dine-in rounds, one table-session bill, Admin/Counter settlement, and post-payment per-order-owner loyalty. Complete frontend-first contracts, mocks, routes, tests and active documentation before Customer UI implementation resumes.

### Scope

Included:
- unified `PICKUP` / `DINE_IN` order architecture and mode-specific kitchen gates,
- table sessions, Dine-in bills, service requests and payment targets,
- Customer Dine-in, Admin-hosted Waiter, Admin billing and unified KDS route shells,
- typed API-client modules, MSW handlers/scenarios and state-machine helpers,
- RBAC, analytics, seed, acceptance and migration specifications,
- formal superseding decision and repository-wide contradiction audit.

Excluded:
- real backend/database/provider connections,
- polished or final branded UI,
- customer-side Dine-in payment, split/partial bills, seat-level billing, tips, reservations, course firing, advanced floor plans, table merge/split and delivery.

### GitHub Tracking

Issue:
- [#16 — Dual service operations foundation](https://github.com/itsyourpriyansu-cloud/v2-pizza/issues/16)

Branch:
- `feature/dual-service-operations`

Pull Request:
- [#18 — feat: add dual service operations foundation](https://github.com/itsyourpriyansu-cloud/v2-pizza/pull/18) → `develop`

### Affected Surfaces

- Customer PWA service-mode and Dine-in flows
- Waiter workspace inside Admin
- Admin/Counter billing and table operations
- Kitchen/KDS unified workload
- Shared domain, API, mock and state-machine packages

### Database Impact

Migration required:
- Yes, when the real backend exists: tables, table sessions, Dine-in bills/lines, service requests, order service fields and polymorphic/normalized payment targets.

Migration implemented now:
- No. This repository has no backend schema/runtime; fabricating one is explicitly excluded.

### API Impact

New contract groups:
- `/dine-in/*`
- `/staff/waiter/*`
- `/admin/bills/*`, `/admin/payments/*`, `/admin/table-sessions/*`

Changed contracts:
- `/payments` accepts an `ORDER` or `TABLE_BILL` target.
- `/kds/orders` supports service-mode filtering and enforces mode-specific eligibility.
- `/orders/{id}/ready` resolves to Ready for Pickup or Ready to Serve by service mode.

Breaking change:
- Yes for the future backend contract; no production backend currently exists.

### State Machine Impact

- Pickup Order: payment-gated `CONFIRMED → PREPARING → READY_FOR_PICKUP → PICKED_UP → COMPLETED`.
- Dine-in Order: `CUSTOMER_SUBMITTED → WAITER_REVIEW → CONFIRMED → PREPARING → READY_TO_SERVE → SERVED`, with clarification/rejection/cancellation branches.
- Table Session, Dine-in Bill and Service Request state machines added.

### Permission Impact

- Add Waiter role and permissions.
- Restrict Dine-in settlement/payment to Admin/Counter/Manager policy.
- Waiter cannot record payment, mark paid, grant unrestricted discounts or edit loyalty.

### Test Plan

- mode-aware order transition and KDS admission unit tests,
- bill-finalization and per-customer loyalty attribution unit tests,
- opaque QR, waiter confirmation and table-bill payment API/MSW tests,
- Customer, Waiter/Admin and KDS route-resolution tests,
- full lint, typecheck, test and build validation.

### Tests Required

- [x] Lint — passed
- [x] Typecheck — passed across all workspace projects
- [x] Unit/component/route tests — 7 files, 86 tests passed
- [x] API-client/MSW integration boundary — passed within the suite
- [x] Production builds — Landing, Customer, KDS and Admin passed
- [ ] Browser E2E/store dry-run — deferred until real UI/backend integration exists

### Documentation Impact

- `AGENTS.md`, `README.md`, active product/architecture docs `00`–`21`, `docs/24_CHANGE_QUEUE.md`, and relevant design-direction wording.

### Known Risks

- Real concurrency, RBAC, pricing, audit, transaction and idempotency enforcement remain future NestJS/PostgreSQL work.
- Founder policy is still required for service charge/tax, supported payment methods, cancellation/timeout, table-session expiry, discounts/voids/refunds, capacity calibration and waiter assignment.
- Customer production build reports a non-failing ~502 kB JavaScript chunk warning; route-level code splitting should be addressed during real UI implementation.

### Current Result

Frontend-first operating contracts, neutral route shells, mocks, tests and active documentation are complete and published on `feature/dual-service-operations`. Issue #16 and PR #18 are open; the latest combined validation passes lint, workspace typecheck, 103 tests and all implemented frontend builds. The change is `IN_REVIEW`; nothing has been merged, staged or deployed.
---

## CHG-0007 — Customer App UI — UX Implementation V1

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-06
- **Last Updated:** 2026-10-07

### Business Reason

Turn the neutral Customer architecture shell into a complete, responsive and UX-testable first ordering batch while keeping the temporary visual skin replaceable and preserving the newly frozen Pickup/Dine-in service boundary.

### Requested Outcome

Implement the production-shaped Customer shell, five-item bottom navigation, contextual Home states, Menu, Search, Product Detail and continuous Pizza Builder through the typed API client, TanStack Query and MSW. Preserve Dine-in service entry and routes from CHG-0006 without expanding later commerce screens.

### Scope

Included:
- Customer app shell, responsive page container, top-bar variants, bottom navigation, loading/error boundaries and feedback primitives,
- service-aware Home with new, returning, active-order, busy, paused and closed states,
- Menu categories, search states and reusable product cards,
- Product Detail, sold-out alternatives and continuous Pizza Builder with required, optional, min/max, unavailable and price-delta behavior,
- customer analytics hooks without a vendor dependency,
- focused component/flow tests and mobile/desktop browser verification,
- Customer tokens and component styles isolated from domain/query/state logic,
- Pizza Wave-derived Phudu/Poppins typography and reusable interaction/component treatments mapped onto the frozen Pizza Avenue seven-color palette,
- content-matched seed imagery plus reliable local MSW bootstrap so the documented seed menu is the default development experience.

Excluded:
- Cart, Pickup, Authentication, Checkout/Payment, Orders/Tracking, Rewards/Passport and Profile implementation batches,
- Dine-in ordering/billing/waiter workflow expansion,
- backend, database, provider, deployment or production integration,
- final brand composition, approved production imagery, final typography scale, radius, shadow or animation language.

### GitHub Tracking

Issue:
- [#17 — Customer app UI and ordering discovery V1](https://github.com/itsyourpriyansu-cloud/v2-pizza/issues/17)

Branch:
- `feature/customer-ui-ux-v1`

Pull Request:
- [#19 — feat: build customer ordering discovery experience](https://github.com/itsyourpriyansu-cloud/v2-pizza/pull/19) → stacked on `feature/dual-service-operations`

### Affected Surfaces

- Customer PWA only
- Shared API/MSW contracts only where required by Customer states

### Affected Modules

- `apps/customer` shell, Home, Menu, Search, Product and Builder
- `packages/mocks` Customer scenario behavior
- existing `packages/api-client`, `packages/types`, `packages/utils` contracts reused where possible

### Files / Areas Changed

- `apps/customer/src/app`: service-aware shell/router/providers and first-batch route tests
- `apps/customer/src/features/home`: service gate and contextual Home variants
- `apps/customer/src/features/menu`: category filtering and reusable product/category components
- `apps/customer/src/features/search`: empty, recent, results, no-result and error states
- `apps/customer/src/features/product`: product detail, sold-out alternatives and continuous builder
- `apps/customer/src/shared`: analytics, feedback, scenario and UI primitives
- `apps/customer/src/styles`: isolated tokens, primitives and responsive Customer composition
- `apps/customer/src/main.tsx`, `package.json`, `public/assets/seed`: self-hosted approved font weights, Lucide icons and content-matched seed imagery
- `docs/assets/screenshots/customer-service-selector-desktop.png`: current desktop review evidence for the service-entry experience
- `packages/mocks/src`: expanded menu inventory and deterministic Customer scenarios
- `packages/ui/src`: backward-compatible shell header/footer composition slots

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New backend endpoints:
- None

Changed backend endpoints:
- None

Frontend behavior continues to use documented `GET /stores/{store_id}/menu`, `GET /products/{id}`, `GET /orders/me`, `GET /me/loyalty` and `GET /me/passport` mock contracts where relevant.

### State Machine Impact

- None. Builder selection is transient client state and final validation/pricing remains backend-authoritative.
- CHG-0006 Pickup/Dine-in order-state and KDS-admission rules remain unchanged.

### Permission Impact

- None. Browsing, search and customization remain public Customer actions; protected operations remain server-authoritative.

### Analytics Impact

Client UX hook points:
- `menu_viewed`
- `category_viewed`
- `product_viewed`
- `search_used`
- `builder_started`
- `variant_selected`
- `modifier_selected`
- `builder_completed`

No analytics vendor or authoritative reporting path is added.

### Environment / Secret Impact

New env vars:
- None

Changed secrets:
- None

### Figma Source

- `https://www.figma.com/design/JqbufOxXUwO6lz2FVDmY5s/TEST-01-UG`
- Reviewed sections: `HF 02 — Home`, `HF 03 — Menu & Search`, `HF 04 — Product & Builder`.
- Figma defines flow, hierarchy, CTA priority and recovery behavior; grayscale visual styling is not production authority.

### Tests Required

- [x] Workspace lint
- [x] Workspace typecheck
- [x] Customer unit/component tests
- [x] New Customer: Home → Menu → Product → Customize
- [x] Returning Customer: Home → Reorder entry
- [x] Busy/Paused/Closed store messaging
- [x] Sold-out Product → alternative
- [x] Builder required choice, max modifier, price update and unavailable modifier
- [x] Customer production build
- [x] Responsive browser checks at 360px, 390px, 430px and desktop
- [x] Keyboard/focus/accessibility smoke review

Validation result:
- workspace lint passed after the visual/startup refinement,
- workspace typecheck passed sequentially across all 10 packages/apps plus tool configuration,
- 103 workspace tests passed after the first-batch and seed/modifier refinements,
- Landing, Customer, KDS and Admin production builds passed,
- the refined Customer production build passed with bundled Latin subsets for the approved Phudu/Poppins weights,
- direct no-`pnpm` Vite startup was browser-verified at `127.0.0.1:5174`: service selection, seeded returning Home and all 14 menu items loaded with no runtime warning/error,
- Customer browser QA passed at 360 × 800, 390 × 844, 430 × 932 and 1440 × 900 with no horizontal overflow,
- GitHub `frontend-foundation` CI passed on PR #19,
- the existing non-failing Customer bundle-size warning remains (main chunk slightly above 500 kB).

### Edge Cases

- no service context must preserve the new Pickup/Dine-in selector,
- Dine-in deep links and table-context routes must remain intact,
- active Pickup order outranks discovery content,
- paused/closed store allows browsing but disables order-start actions,
- search empty query, recent searches, no results and network failure recover clearly,
- sold-out products offer alternatives rather than a dead end,
- builder required/min/max and unavailable choices preserve valid selections and explain recovery,
- route components must not import mock fixtures directly,
- provisional frontend prices must never be described as authoritative.

### Security Review

- Auth implications: none; no auth/session/token implementation is added.
- RBAC implications: none.
- Secret/PII implications: no real customer data, OTPs, tokens or provider payloads.
- Replay/idempotency implications: no payment/order mutation is implemented in this batch.

### Known Risks

- Current menu names/prices remain example seed data until founder validation.
- Only content-matched Pizza Wave candidate imagery is wired; provenance confirmation, responsive derivatives and production optimization remain required before release.
- An approved Pizza Avenue logo and complete production photography are still unavailable, so text-only identity and intentional image fallbacks remain.
- Browser Figma inspection is available, but the Figma MCP API is rate-limited on the connected Starter plan.
- CHG-0006 remains an unmerged dependency; this branch is intentionally based on its committed frontend-first foundation.

### Follow-Up

- [x] Complete agent visual and functional review of the first Customer UI batch.
- [x] Complete CI validation in PR #19.
- [ ] Complete peer review in PR #19.
- [ ] Supply final visual references before the remaining commerce screens are implemented.
- [x] Push CHG-0006 and CHG-0007 branches and open their linked Issues/PRs.

### Current Result

The first Customer UI batch and requested visual/startup refinement are implemented and published on `feature/customer-ui-ux-v1`: the dual-service entry remains authoritative; Pickup discovery includes contextual Home states; Menu, Search, Product Detail and continuous Builder are responsive and mock-backed; Phudu/Poppins, Lucide navigation and selected Pizza Wave component/image treatments render through the frozen Pizza Avenue palette. Direct Vite startup defaults deterministically to the documented seed menu without requiring `pnpm.ps1` or a local `.env`. Issue #17 and stacked PR #19 are open, PR #18 is the prerequisite, and GitHub CI is green. The item is `IN_REVIEW`; peer approval is still required and nothing has been merged, staged or deployed.

### Related Changes

- CHG-0002
- CHG-0004
- CHG-0006

---

## CHG-0008 — Customer Commerce Flow Completion

- **Status:** IN_PROGRESS
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Complete the customer ordering journey after discovery so Pickup customers can move safely from a configured basket through authentication, capacity-aware pickup, mock payment verification and fulfilment tracking, while Dine-in customers can submit waiter-gated rounds and understand their current table bill.

### Requested Outcome

Deliver production-shaped, mock-backed Customer commerce flows for Pickup and Dine-in using the existing React, TanStack Query, typed API-client and MSW boundaries. Preserve backend-authoritative prices, payment verification, service-specific kitchen admission and separate carts for each service mode.

### Scope

Included:
- service-mode-isolated Cart with edit, remove, quantity, quote, unavailable-item recovery and contextual upsells,
- phone OTP and WhatsApp magic-link prototype states without real credentials or insecure identity shortcuts,
- ASAP/scheduled Pickup selection, full-slot recovery and expiring reservation feedback,
- checkout review plus mock payment pending, verified success, failure and retry states,
- Pickup confirmation and tracking through Ready for Pickup,
- Dine-in review, waiter confirmation/clarification/rejection, preparing/Ready-to-Serve/Served states, additional rounds and current bill estimate,
- documented analytics hooks, focused flow tests, route-level lazy-loading evaluation and browser evidence.

Excluded:
- real NestJS, Prisma, PostgreSQL, Redis, BullMQ, OTP, WhatsApp, payment-provider or WebSocket integration,
- Rewards, Pizza Passport, Missions or Profile redesign,
- customer-side Dine-in payment, delivery, split bills, tips or other V1 exclusions,
- any weakening of backend pricing, state, permission, idempotency or transactional-outbox requirements.

### GitHub Tracking

Issue:
- #20 — Customer App: complete Pickup and Dine-in commerce flows

Branch:
- `feature/customer-commerce-flow` stacked from `feature/customer-ui-ux-v1` while prerequisite PRs #18 and #19 remain open and clean

Pull Request:
- Pending; must not target `develop` until prerequisite PRs are merged

### Affected Surfaces

- Customer PWA
- Shared frontend API/type/mock boundaries where the documented Customer flows require them
- Documentation and test evidence

### Affected Modules

- Customer cart and commerce session state
- Customer authentication UI
- Pickup reservation and checkout
- Mock payment and order tracking
- Customer Dine-in ordering and current bill
- Shared API client, types, mocks, analytics and query keys

### Files / Areas Changed

- Implemented: Customer cart, Auth, Pickup checkout, payment, order tracking and Dine-in feature routes, shared commerce state, shell, design-system-aligned styles and focused tests
- Implemented: typed cart/pickup/analytics contracts, API-client service-mode cart creation and deterministic MSW auth/cart/pickup/payment/order/Dine-in scenarios
- Implemented: route-level lazy loading, analytics documentation, changelog/queue truth and browser evidence under `docs/assets/screenshots/`
- Preserved: Customer Menu outage recovery, focused regression coverage, commerce/prototype test-state alignment and shared `Surface` ARIA-role typing from the diagnostic pass

### Database Impact

Migration required:
- No. This is frontend/MSW implementation against documented future backend contracts.

Data migration required:
- No

### API Impact

New production endpoints:
- None planned

Changed production endpoints:
- None planned; complete use of the documented Cart, Quote, Pickup, Payment, Orders and Customer Dine-in contracts.

Breaking change:
- No

### State Machine Impact

- No product-state decision changes. The prototype must render the existing Pickup payment gate, reservation lifecycle and Dine-in waiter gate without claiming client authority.

### Permission Impact

- No new permissions. Customer Dine-in remains read/request-only for bill and service actions; payment settlement stays Admin/Counter-only.

### Analytics Impact

Client UX hooks planned for documented events including `cart_viewed`, `checkout_started`, `pickup_options_viewed`, `pickup_slot_selected`, `quote_generated`, `payment_started`, `payment_success`, `payment_failed`, `dine_in_order_submitted`, waiter/status milestones, `order_more_clicked` and `bill_requested`. Client events remain non-authoritative and contain no OTP, phone, raw token or provider payload.

### Environment / Secret Impact

New env vars:
- None

Changed secrets:
- None

### Tests Required

- [x] Customer unit/component tests
- [x] API-client/MSW integration tests
- [x] Menu data loads through local MSW and injected outage recovers through “Try again”
- [x] Pickup happy path
- [x] Payment failure and retry
- [x] Full pickup slot and expired hold recovery
- [x] Unavailable cart item recovery
- [x] OTP invalid/expired/cooldown states
- [x] Magic-link invalid/expired/used recovery states
- [x] Dine-in waiter confirmation, clarification and rejection states
- [x] Dine-in additional round and current bill states
- [x] Workspace lint, typecheck, tests and builds
- [x] Responsive browser missions and screenshots
- [x] Secret/dependency scan

### Edge Cases

- Pickup and Dine-in carts must not merge when context changes.
- A cart/quote is provisional and must survive recoverable auth/payment failures.
- Payment success UI must wait for mocked authoritative verification before showing `CONFIRMED`.
- A full or expired pickup hold must release cleanly and offer valid alternatives.
- Customer-submitted Dine-in orders must remain outside KDS until waiter confirmation.
- Clarification/rejection must preserve the customer selection and explain the next action.
- Current table bill is view-only and must never expose payment settlement controls.
- A `MENU_NETWORK_ERROR` review URL must show the intended failure state but allow Retry to return to the normal menu without leaving the failure scenario active.

### Security Review

- Auth implications: prototype UI only; no raw OTP/token persistence, no account enumeration, and no client value establishes WhatsApp identity.
- RBAC implications: no staff authority is added to Customer routes.
- Secret/PII implications: fictional seed data only; analytics and screenshots exclude phone, OTP, raw magic token, cookie or provider payload.
- Replay/idempotency implications: mock-sensitive submissions use stable idempotency intent and must demonstrate one logical order/payment outcome.

### Staging Result

Status:
- Not Tested — branch is stacked and has not merged or deployed

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- Prerequisite PRs #18 and #19 remain unmerged; this branch is intentionally stacked from their exact reviewed Customer head.
- MSW can validate frontend behavior and contract use but cannot prove future server transactions, webhook verification, RBAC, capacity locking or idempotency.
- Founder-approved production menu, payment provider, slot policy and final imagery remain pending.

### Follow-Up

- [x] Implement and validate the scoped Customer commerce batch.
- [ ] Open a tracked Issue and correctly based PR after validation.
- [ ] Retarget to `develop` only after prerequisite PRs merge.

### Current Result

Implementation and local validation are complete on the stacked Customer commerce branch. Pickup and Dine-in missions pass through typed API-client/MSW boundaries; all 120 tests pass, workspace lint and all TypeScript project checks pass, all four production app builds pass, and `pnpm audit --prod` reports no known vulnerabilities. Browser walkthroughs pass at 360, 390, 430, 768 and 1440 px without horizontal overflow; saved evidence covers cart, Pickup review/tracking and the Dine-in waiter gate. The Customer entry bundle is 374.79 kB / 117.18 kB gzip versus the 533.25 kB / 164.56 kB gzip baseline. The only browser 404 is an absent `favicon.ico`, not an application/API request. Production backend/provider behavior remains intentionally unproved by this MSW batch.

### Related Changes

- CHG-0002
- CHG-0006
- CHG-0007

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
