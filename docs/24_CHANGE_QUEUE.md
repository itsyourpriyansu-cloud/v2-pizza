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
Next Change ID: CHG-0020

Open:
19

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

Landing handoff (2026-10-09): CHG-0005 through CHG-0019 are bundled on `feature/landing-initial-ui` in Pull Request #13 against `develop`. Their `IN_REVIEW` status means code review is pending; no staging deployment or production release is claimed. Current local validation passed lint, typecheck, 44 tests across 6 files and all four frontend builds. Earlier test counts within individual entries record their historical runs. The pickup-only V1 rules conflict with dine-in work in the separate customer PR chain; resolve that product decision before combining the branches.

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

## CHG-0005 — Build initial Pizza Avenue landing experience

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-06
- **Last Updated:** 2026-10-09

### Business Reason

Turn the root-domain Landing shell into a clear, appetising direct-order entry point that explains what Pizza Avenue offers, where pickup happens and how a customer starts an order, while preserving the separate Customer PWA boundary.

### Requested Outcome

Implement the first approved Landing batch: utility strip, responsive header, editorial hero, compact proof strip and a signature-pizza section. Use the frozen Pizza Avenue palette and Phudu/Poppins typography plus the curated Pizza Wave food candidates, without inventing a logo or treating exploratory menu content as production truth. Harden every assembled Landing section for narrow mobile, tablet and desktop layouts without changing product content or Customer-app destinations.

### Scope

Included:
- utility strip with Sainikpuri and pickup context,
- responsive header with functional navigation and one primary ordering action,
- food-led hero with configured Customer-app CTAs,
- compact proof strip,
- four-item signature pizza selection aligned to available curated imagery,
- responsive and reduced-motion behaviour,
- responsive hardening for the Story, Highlights, Customer Flow, menu, best sellers, promotional, combo, catering, reviews, FAQ, app-download and footer sections,
- focused component and link tests,
- documentation and handoff updates.

Excluded:
- backend-connected final release content,
- an invented or legacy Pizza Wave logo,
- backend, database, real authentication, WhatsApp, payment or analytics-provider integration,
- production deployment,
- founder approval of final menu prices, imagery provenance or final product photography.

### GitHub Tracking

Issue:
- #12

Branch:
- `feature/landing-initial-ui`

Pull Request:
- #13 — open against `develop`

### Affected Surfaces

- Landing / Marketing
- Customer PWA entry links only

### Affected Modules

- `apps/landing`
- `packages/config` local loopback detection

### Files / Areas Changed

- Landing React composition, content model and styles
- Hero viewport-height and pickup-note adjustment
- Landing-wide responsive containment, adaptive grids and narrow-device sizing safeguards
- Landing public food assets copied from the curated Pizza Wave candidates
- Landing tests and metadata
- dependency lockfile for approved Fontsource packages
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

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

- None; the Landing remains public and does not implement authentication.

### Analytics Impact

- No analytics provider is connected. Existing discovery and ordering event names remain unchanged for later implementation.

### Environment / Secret Impact

New env vars:
- None

Changed secrets:
- None

The Landing continues to resolve the Customer app through `VITE_CUSTOMER_APP_URL` and local safe defaults.

### Documentation Updated

- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Landing component and destination-link tests — 4 passed after the hero viewport-height and pickup-note adjustment
- [x] Responsive visual check at 390×844 mobile and 1440×900 desktop
- [x] Keyboard/focus and reduced-motion implementation review
- [x] Repository lint — passed
- [x] Repository typecheck — passed
- [x] Repository tests — 6 files, 40 tests passed
- [x] Repository builds — Landing, Customer, KDS and Admin passed
- [x] Responsive layout audit — no horizontal overflow at 320×900, 360×900, 390×900, 480×900, 768×900, 1024×900 and 1440×900; mobile visual check at 390×844
- [x] Current repository verification — ESLint passed, workspace typecheck passed, Vitest passed (6 files, 54 tests) and all four frontend production builds passed
- [x] GitHub Actions `frontend-foundation` for Pull Request #13 — passed
- [ ] Staging smoke test — not part of this task unless staging is deployed
- [ ] Production smoke test — not released

### Edge Cases

- production/staging Customer URLs must remain environment-configured rather than hardcoded,
- navigation must not expose dead links to deferred Landing sections,
- provisional menu prices must be visibly qualified and must not become authoritative checkout values,
- food candidates must be matched honestly to visible product names and remain pending provenance/founder review,
- mobile must recompose rather than shrink the desktop layout,
- narrow phones, tablets and desktops must not gain a horizontal scroll from section cards, the phone mockup, footer artwork or header actions,
- the supplied Pizza Avenue logo must remain the only logo used in this Landing work.

### Security Review

- Auth implications: none.
- RBAC implications: none.
- Secret/PII implications: none; public non-secret URL configuration only.
- Replay/idempotency implications: none.

### Staging Result

Status:
- Not Tested

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- Candidate Pizza Wave imagery remains prototype-only until provenance, usage rights and founder approval are confirmed.
- Menu names, descriptions and photographed prices remain exploratory until founder validation.
- The local landing branch now includes the supplied Pizza Avenue logo; its provenance and production usage still require founder confirmation.

### Follow-Up

- [ ] Obtain founder confirmation for image provenance and production use.
- [ ] Replace provisional menu details with backend-authoritative menu data when available.
- [ ] Continue later Landing chapters only through a separate tracked task after this batch is audited.

### Final Result

Implementation remains on `feature/landing-initial-ui` under GitHub Issue #12 and Pull Request #13. The follow-up hero adjustments are complete: the hero section fills 100vh/100dvh viewport height across mobile and tablet with balanced spacing, the hero title explicitly splits into two lines ("CRAVE IT." on line 1 and "TAP IT. PICK IT UP." on line 2), an accessible collapsible mobile menu bar with animated hamburger toggle is implemented, hero actions maintain row flex-direction across both mobile and desktop, and category cards remain fully visible above the fold without clipping. The 2026-10-08 responsiveness pass adds grid/flex containment across every Landing chapter; removes the Brand Highlights tablet/narrow-phone overflow; makes the phone mockup and footer display artwork shrink safely; and tightens the smallest header. Local browser inspection confirms document-width parity with no horizontal scroll from 320×900 through 1440×900, including 390×844 mobile. On 2026-10-09, local verification passed: ESLint, workspace typecheck, Vitest (6 files, 44 tests), and all four frontend production builds. Earlier test totals above are historical snapshots, not the current suite count. No staging or production deployment has been performed.

### Related Changes

- CHG-0003
- CHG-0004

---

## CHG-0006 — Integrate Faq05 component and Radix accordion into Landing and components/ui

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Provide answers to high-frequency customer questions regarding Sainikpuri store pickup, 72h sourdough dough, pizza customization and the Pizza Passport loyalty program directly on the marketing landing page, reducing customer hesitation before ordering.

### Requested Outcome

Integrate the `faq-05.tsx` component and `@radix-ui/react-accordion` primitive into `components/ui`, adapt `Faq05` to accept external questions via props with single-collapsible state, render it as the last section of the landing page with dedicated styling matching the Pizza Avenue brand palette, and provide automated test coverage.

### Scope

Included:
- copy `accordion.tsx`, `faq-05.tsx` and `demo.tsx` into `components/ui` and `apps/landing/src/components/ui`,
- install `@radix-ui/react-accordion` and `lucide-react`,
- adapt `Faq05` to accept `items` as external props with single-collapsible mode,
- provide brand-specific FAQ data for Sainikpuri pickup, dough, customization, loyalty and kitchen hygiene,
- style the accordion expand/collapse transitions using vanilla CSS tokens,
- add `Faq05` as the final content section in `LandingPage.tsx` with navigation anchor,
- add automated test in `app.test.tsx`,
- update documentation in `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- backend FAQ CMS or dynamic API endpoints,
- changes to customer ordering flow or cart state machines.

### Affected Surfaces

- Landing Page (`apps/landing`)
- UI Primitives (`components/ui`)

### Files / Areas Changed

- `components/ui/accordion.tsx`
- `components/ui/faq-05.tsx`
- `components/ui/demo.tsx`
- `apps/landing/src/components/ui/accordion.tsx`
- `apps/landing/src/components/ui/faq-05.tsx`
- `apps/landing/src/components/ui/demo.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/landing-content.ts`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `apps/landing/package.json`
- `lib/utils.ts`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — 11 packages clean with 0 errors
- [x] Workspace test suite — 6 files, 42 tests passed
- [x] Single-collapsible behavior verified in tests

### Staging Result

Status:
- Not Tested

### Production Result

Status:
- Not Released

### Final Result

`Faq05` and `@radix-ui/react-accordion` primitive successfully integrated. `Faq05` accepts external props, enforces single-collapsible mode, and renders brand-specific Sainikpuri pickup FAQs as the final section of `LandingPage.tsx`. All 42 vitest tests pass.

### Related Changes

- CHG-0005

---

## CHG-0007 — Implement brand footer using project styling and color palette

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Provide a complete, premium, brand-aligned footer on the Pizza Avenue landing page that delivers store location context, opening hours, contact details, map navigation to the Sainikpuri counter, newsletter subscription, quick links to customer app ordering & policies, app download badges, and an impactful display wordmark.

### Requested Outcome

Recreate the reference footer design within the Pizza Avenue design system using only the official 7-color project palette (`Cream`, `Sand Beige`, `Maroon`, `Italian Brown`, `Olive Green`, `Sage Green`, `Espresso`), with responsive layout, accessible forms and links, clean Sainikpuri map preview card, and a bold Phudu "PIZZA AVENUE" display banner.

### Scope

Included:
- Create `Footer.tsx` (or `SiteFooter.tsx`) component with:
  - Quick Links (Menu, Our Pizzas, Pizza Passport, FAQs)
  - Legal links (Privacy Policy, Terms of Service, Refund Policy)
  - Get the App store buttons (App Store and Google Play badges)
  - Deal subscription newsletter form with email input and Subscribe CTA
  - Sainikpuri store map preview card with interactive Open in Maps link
  - Contact section ("COME SAY HI") with Sainikpuri address, phone number, opening hours (11 AM - 11 PM) and social links
  - Giant full-width "PIZZA AVENUE" display typography banner with centered warm circle graphic
- Add comprehensive CSS styles in `styles.css` adhering strictly to project tokens
- Integrate into `LandingPage.tsx`
- Add automated tests in `app.test.tsx`
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`

Excluded:
- Real email marketing newsletter backend ingestion or third-party CRM webhook
- Real App Store / Play Store binary submissions

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/components/Footer.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `components/ui/faq-05.tsx`
- `apps/landing/src/components/ui/faq-05.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — 11 packages pass cleanly with 0 errors
- [x] Landing component and footer tests — all 7 landing tests pass
- [x] Workspace test suite — 6 files, 43 tests passed
- [x] Workspace production build — all 4 applications build with 0 errors
- [x] Workspace ESLint — 0 errors, 0 warnings
- [x] Visual inspection across desktop and mobile in browser subagent

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

Footer faithfully recreates the reference design using only the official 7-color Pizza Avenue palette: `--maroon` canvas, `--sand` headings/borders, `--brown` interactive elements/badges/central disc, and `--cream` primary typography. Includes Quick Links, Legal, App Store/Google Play badges, interactive newsletter subscribe form, Sainikpuri vector map preview with pulsating pin and "OPEN IN MAPS" button, "COME SAY HI" contact section with 42 Sainikpuri address, phone number, opening hours (11AM–11PM), social buttons, and full-width "PIZZA AVENUE" display banner with unclipped circular dome. All 43 workspace tests, typecheck, lint, and production builds pass.

### Related Changes

- CHG-0005
- CHG-0006

---

## CHG-0008 — Integrate InfiniteMovingCards Google Reviews marquee above FAQ

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Showcase genuine local customer praise and high Google Maps rating (4.9★) for The Pizza Avenue in Sainikpuri directly on the landing page, boosting social proof, trust, and pickup order conversion before users reach FAQs and the footer.

### Requested Outcome

Integrate the `InfiniteMovingCards` component on `LandingPage.tsx` directly above the FAQ section. The marquee must animate right-to-left at normal speed, pause on hover, link directly to the Sainikpuri Google Maps page (`https://maps.app.goo.gl/dMzrGhS9LBqQVNx3A`), and adhere strictly to the project's official 7-color palette.

### Scope

Included:
- Add Google Reviews customer testimonial data to `landing-content.ts` with authentic Sainikpuri references, ratings, and tags.
- Integrate `InfiniteMovingCards` into `LandingPage.tsx` above the FAQ section.
- Add Google Maps 4.9★ rating badge with direct link to `https://maps.app.goo.gl/dMzrGhS9LBqQVNx3A`.
- Add responsive CSS styles in `styles.css` using only official project color tokens (`Cream`, `Sand Beige`, `Maroon`, `Italian Brown`, `Olive Green`, `Sage Green`, `Espresso`).
- Add automated test coverage in `app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Live dynamic Google Places API polling (V1 static curated authentic reviews avoids unnecessary billing/API complexity).

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/landing-content.ts`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 packages pass cleanly with 0 errors
- [x] Landing tests — 8 of 8 tests pass including reviews marquee and Google Maps link
- [x] Vitest workspace suite — 44 of 44 tests pass across all 6 test files
- [x] Production build — all 4 applications build successfully
- [x] ESLint — 0 warnings, 0 errors
- [x] Browser visual verification — marquee motion, pause on hover, Google Maps button, and color tokens confirmed

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

Integrated `InfiniteMovingCards` Google Reviews marquee directly above the FAQ section on `LandingPage.tsx`. The marquee animates smoothly right-to-left at normal speed with `pauseOnHover` enabled. Features high-res pizza imagery, 5-star ratings, tags, reviewer names, and local community testimonials from Sainikpuri customers. Includes direct link badge to The Pizza Avenue Sainikpuri on Google Maps (`https://maps.app.goo.gl/dMzrGhS9LBqQVNx3A`) with 4.9★ rating badge. Fixed image height constraints and flex track layout across the Vanilla CSS system; implemented responsive mobile breakpoints ensuring cards scale to viewport width without horizontal page overflow, and the Google Maps pill badge aligns cleanly. Styled strictly using the project's official 7-color palette (`Cream`, `Sand Beige`, `Maroon`, `Italian Brown`, `Olive Green`, `Sage Green`, `Espresso`). All 44 unit and integration tests, TypeScript typechecks across all 11 packages, ESLint checks, and production builds pass cleanly.

### Related Changes

- CHG-0005
- CHG-0006
- CHG-0007

---

## CHG-0009 — Customer Flow Process section added after the story section

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Provide clear, customer-friendly 3-step ordering education ("BROWSE THEN ORDER") directly after the brand story section on the landing page, illustrating the seamless journey from browsing to ordering and enjoying craft pizza.

### Requested Outcome

Add the customer flow process section directly after the brand story scroll reveal section on `LandingPage.tsx` using project styling and color palette (`Phudu`, `Poppins`, `Cream`, `Maroon`, `Espresso`). It features a "Process" pill badge, display heading "BROWSE THEN ORDER", subtitle "Scroll through everything we've got cooking.", and three photographic lifestyle cards with step pills ("STEP 1", "STEP 2", "STEP 3"), bold headlines ("PICK WHAT HITS", "WAIT FOR THE KNOCK", "EAT LIKE YOU MEAN IT"), descriptions, and large action links ("BROWSE", "ORDER", "ENJOY").

### Scope

Included:
- Add `CustomerFlowStep` and `customerFlowSteps` dataset to `apps/landing/src/landing-content.ts`.
- Create component `apps/landing/src/components/CustomerFlow.tsx`.
- Add lifestyle photography assets in `apps/landing/public/assets/customer-flow/`.
- Insert `<CustomerFlow customerAppUrl={customerAppUrl} />` into `LandingPage.tsx` immediately after the story section.
- Add CSS styles in `styles.css` matching project typography and color system, with smooth hover interactions and responsive layout.
- Add automated unit test in `apps/landing/src/app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Dynamic step state persistence (static marketing flow).

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/landing-content.ts`
- `apps/landing/src/components/CustomerFlow.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `apps/landing/public/assets/customer-flow/step-1-browse.jpg`
- `apps/landing/public/assets/customer-flow/step-2-order.jpg`
- `apps/landing/public/assets/customer-flow/step-3-enjoy.jpg`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 packages pass cleanly with 0 errors
- [x] Landing tests — 10 of 10 tests pass including customer flow process section
- [x] Vitest workspace suite — 46 of 46 tests pass across all 6 test files
- [x] Production build — `@pizza-avenue/landing` builds cleanly in 2.29s

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

Created `CustomerFlow.tsx` component and integrated it directly after the story reveal section on `LandingPage.tsx`. Styled using the project's font hierarchy (`Phudu` for display titles and action keywords, `Poppins` for body text and pills) and color tokens. Configured high-resolution photography assets depicting browsing on phone, opening pizza box, and eating fresh artisan pizza. All 46 tests across the repository pass, workspace typechecks pass cleanly, and the production bundle compiles with 0 errors.

### Related Changes

- CHG-0005
- CHG-0007
- CHG-0008

---

## CHG-0010 — Fix Category Best Sellers section and make it 100vh

- **Status:** IN_REVIEW
- **Type:** FIX, UX, DESIGN
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Ensure the Category Best Sellers section seamlessly fills the full desktop viewport height (100vh / 100dvh) without overflowing or clipping the cards and descriptions, providing a high-impact, cohesive visual showcase of crowd favourites directly between the Customer Flow process section and the signatures grid.

### Requested Outcome

Fix `.bestsellers-section` by making it full viewport height (`min-height: 100vh; min-height: 100dvh`) with flex column centering, fixing the oversized container/shell aspect-ratio and heights that caused viewport overflow on laptops (e.g. 1536x730), fixing the left-side chip vertical reel alignment and equal-width centering, fixing the right-side stage and card aspect-ratio sizing so cards and captions never clip, and ensuring responsive mobile/tablet behaviour.

### Scope

Included:
- Update `.bestsellers-section`, `.bestsellers-header`, `.feature-carousel-container`, `.feature-carousel-shell`, `.feature-carousel-left`, `.feature-carousel-reel`, `.feature-carousel-right`, `.feature-carousel-stage`, `.feature-carousel-card`, `.feature-carousel-caption` in `apps/landing/src/styles.css`.
- Update carousel reel sizing constants (`ITEM_HEIGHT`, `ITEM_GAP`, `REEL_HEIGHT`, `CENTER_Y`) and shortest circular click delta logic in `apps/landing/src/components/ui/feature-carousel.tsx` and `components/ui/feature-carousel.tsx`.
- Add responsive media queries for screens `<= 1023px` and `<= 480px`.
- Verify full test suite and typechecks pass.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Modifications to ordering or payment workflows.

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/styles.css`
- `apps/landing/src/components/ui/feature-carousel.tsx`
- `components/ui/feature-carousel.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all packages pass cleanly with 0 errors
- [x] Landing tests — 10 of 10 tests pass
- [x] Vitest workspace suite — 46 of 46 tests pass across all 6 test files
- [x] Production build verification — `@pizza-avenue/landing` builds cleanly in 1.71s

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Made `.bestsellers-section` full viewport height (`min-height: 100vh; min-height: 100dvh;`) with flex column centering and compact header spacing.
- Replaced rigid desktop `aspect-ratio: 16 / 9; min-height: 600px;` on `.feature-carousel-shell` with adaptive height `clamp(430px, 58vh, 560px)` to fit comfortably within 100vh on desktop/laptop screens without overflowing.
- Fixed `.feature-carousel-left` centering by removing asymmetric `padding-left` and `align-items: flex-start`, ensuring equal-width pill chips are centered.
- Coordinated reel constants (`REEL_HEIGHT = 380`, `ITEM_HEIGHT = 54`, `ITEM_GAP = 12`, `CENTER_Y = 163`) and implemented shortest angular delta click stepping.
- Fixed `.feature-carousel-stage` to auto-fit container height (`height: 100%; aspect-ratio: 4 / 5; max-width: 380px;`) so the 3D cards and captions never clip.
- Added responsive media queries for mobile/tablet (`<= 1023px` and `<= 480px`).
- All 46 tests pass and production build succeeds.

### Related Changes

- CHG-0008
- CHG-0009

---

## CHG-0011 — Build Pick Your Craving 100vh Menu section with authentic category filters and carousel after the story section

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, DESIGN, TEST
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Enable customers to quickly explore Pizza Avenue's authentic culinary offerings—Veggie Haven, Non-Veg Paradise, Pastas, Breads & Sides, and Desserts & Dips—right after the brand story on the landing page, driving direct pickup orders with prominent prices, mouth-watering imagery, and direct add-to-order actions.

### Requested Outcome

Create a dedicated "PICK YOUR CRAVING" section positioned directly after the story section (`story-reveal-container`) that fills the full desktop viewport height (100vh / 100dvh). Follow the design mockup precisely:
- Centered "Menu" pill badge
- Prominent display headline "PICK YOUR CRAVING" in brand typography (`Phudu`)
- Subtitle: "Every bite hits different. Choose your category and feast."
- Interactive category filter pills row (HOT SELLING, VEG PIZZAS, NON-VEG PIZZAS, PASTAS, BREADS & SIDES, DESSERT & DIPS)
- Smooth horizontal 3-card carousel showcasing dishes from the authentic Pizza Avenue menu card
- Bold prices, crisp descriptions, and dark circular plus buttons linking to the Customer App ordering menu
- Centered bottom navigation arrows (`←` / `→`) to paginate cards smoothly
- Adherence to project 7-color palette and typography rules
- Responsive layout for tablet and mobile screens

### Scope

Included:
- Add craving menu data and types to `apps/landing/src/landing-content.ts` reflecting items from the uploaded Pizza Avenue menu card.
- Provide curated food photography assets in `apps/landing/public/assets/menu/`.
- Build `CravingMenu.tsx` component with category filter state, horizontal carousel sliding, and responsive layout.
- Add CSS styles to `apps/landing/src/styles.css` adhering strictly to 100vh viewport height constraints (`min-height: 100vh; min-height: 100dvh`).
- Integrate into `LandingPage.tsx` directly after `story-reveal-container`.
- Add comprehensive automated tests in `app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Modifications to authoritative backend pricing or checkout calculations.

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/landing-content.ts`
- `apps/landing/src/components/CravingMenu.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `apps/landing/src/components/ui/feature-carousel.tsx`
- `components/ui/feature-carousel.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Database Impact

- None

### API Impact

- None

### State Machine Impact

- None

### Permission Impact

- None

### Analytics Impact

- None

### Environment / Secret Impact

- None

### Tests Required

- [x] Workspace typecheck — all 11 packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 11 tests pass
- [x] Vitest workspace suite — all 47 tests pass across 6 test files
- [x] Workspace ESLint — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully
- [x] Browser visual verification — verified in browser subagent on desktop (1440x900, 1920x1080) and mobile (390x844)

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Created `CravingMenu.tsx` and placed it directly after the story section on `LandingPage.tsx`.
- Built the section to fill 100vh (`min-height: 100vh; min-height: 100dvh;`) with flex column centering, balanced padding, and zero viewport overflow on desktop.
- Implemented category filter tabs (`HOT SELLING`, `VEG PIZZAS`, `NON-VEG PIZZAS`, `PASTAS`, `BREADS & SIDES`, `DESSERT & DIPS`) with items, prices, and descriptions matching Pizza Avenue's uploaded menu card.
- Implemented smooth horizontal carousel sliding with `←` and `→` navigation buttons, active boundary detection, and responsive touch-swipe support.
- Configured authentic food photography in `apps/landing/public/assets/menu/`.
- All tests, typechecks, lint, and production builds pass cleanly.

---

## CHG-0012 — Remove redundant legacy Signatures section from landing page

- **Status:** IN_REVIEW
- **Type:** REFACTOR, UX, CLEANUP
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

With the new, complete "PICK YOUR CRAVING" interactive 100vh menu section now live showcasing all authentic categories and dishes, the legacy prototype-only static 4-item "Start with the favourites" signatures grid (`.signatures`) is redundant. Removing it declutters the landing experience and streamlines the customer journey directly from browsing cravings to best sellers and reviews.

### Requested Outcome

Remove `<section className="signatures" ...>` from `LandingPage.tsx`, update navigation links and Hero CTA to point to `#menu` instead of `#signatures`, adjust test suite to reflect removal, and verify full workspace suite passes.

### Scope

Included:
- Remove `<section className="signatures" ...>` in `LandingPage.tsx`.
- Update Hero secondary button target to `#menu` (`href="#menu"`).
- Update navigation links in `LandingPage.tsx` and `Footer.tsx` from `#signatures` to `#menu`.
- Update tests in `app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Deleting `signaturePizzas` content dataset in case it is reused for other mockups.

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/components/Footer.tsx`
- `apps/landing/src/components/CravingMenu.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 12 tests pass
- [x] Vitest workspace suite — all 48 tests pass across 6 test files
- [x] Workspace ESLint — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Removed legacy `<section className="signatures" ...>` from `LandingPage.tsx`.
- Updated header navigation and Hero secondary button to point to `#menu` ("Explore the menu" / "Our Menu").
- Updated footer navigation link from `#signatures` to `#menu` ("DEALS").
- Added prototype pricing qualification note in `CravingMenu.tsx` to maintain checkout transparency rule.
- All 48 vitest tests, typechecks, lint, and production builds pass cleanly.

---

## CHG-0013 — Add Combo Madness promotional banner strip after Customer Flow section

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, MARKETING
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Drive pickup combo conversions and average order value (AOV) by showcasing a bold, high-impact promotional strip banner ("COMBO MADNESS — Save up to 30% on meal combos") strategically situated between the 3-step customer flow and category best sellers, visually highlighting signature pizzas, sides, and craft creations.

### Requested Outcome

Generate a dedicated promotional strip component placed directly after `<CustomerFlow />` and before `<FeatureCarousel />` (Category Best Sellers), utilizing authentic project assets (`/assets/pizza-wave/*`), adhering to Pizza Avenue brand aesthetics and typography, fully responsive across desktop and mobile, with automated test coverage and documentation updates.

### Scope

Included:
- Create `apps/landing/src/components/ComboStrip.tsx`.
- Add dedicated CSS styles in `apps/landing/src/styles.css` for the strip layout, typography, responsive scaling, and floating imagery.
- Integrate `ComboStrip` into `LandingPage.tsx` directly after `CustomerFlow`.
- Add unit tests in `apps/landing/src/app.test.tsx` verifying render, headline, subtitle, image presence, and customer app menu link.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Modifying backend pricing or checkout calculations (pure frontend landing marketing strip).

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/components/ComboStrip.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 13 tests pass
- [x] Full Vitest workspace suite — all 49 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Built `ComboStrip.tsx` component placed immediately after `<CustomerFlow />` and before `<FeatureCarousel />` on the landing page.
- Rendered bold, punchy display headline "COMBO MADNESS" in `Phudu` (900 weight, deep espresso) and subtitle "Save up to 30% on meal combos".
- Integrated 5 authentic project cutout dishes (`paneer-cheese-pizza.png`, `chicken-tikka-pizza.png`, `cheesy-garlic-bread.png`, `chocolate-brownie.png`, and `hero-main-pizza.png`) echoing the composition and framing of the reference mockup.
- Wrapped in an interactive accessible link to the customer app menu with hover micro-animations and drop-shadow depth.
- Verified responsive layout and fallbacks for tablet and mobile screens.
- All 49 vitest tests, typechecks, lint, and production builds pass cleanly.

---

## CHG-0014 — Replicate Combos Section with brand styling and reorder sections after menu and combo banner

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, MARKETING
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Drive combo sales and basket size by introducing an appetizing 4-card deals showcase ("COMBOS THAT MAKE SENSE") directly following the combo promotional strip and menu, giving customers curated, clear savings packages (Feast Combo, Pizza Party Deal, Wrap & Wings Bundle, Date Night Special) with straightforward pricing and immediate pickup actions.

### Requested Outcome

Replicate the uploaded reference mockup using Pizza Avenue design system foundation (`Phudu` headlines, `Poppins` body/badges, warm project colors, ₹ pricing), place Best Sellers after the Menu and Combo Banner, and preserve seamless landing narrative flow.

### Scope

Included:
- Create `apps/landing/src/components/CombosSection.tsx` with 4 vibrant combo deal cards, save badges, bulleted item lists, strikethrough/deal prices, and CTA buttons.
- Create assets in `apps/landing/public/assets/combos/` (`the-feast-combo.jpg`, `pizza-party-deal.jpg`, `wrap-wings-bundle.jpg`, `date-night-special.jpg`).
- Define `ComboOffer` and `comboOffers` in `apps/landing/src/landing-content.ts`.
- Reorder landing page sections: Story -> Customer Flow -> Menu -> Combo Banner -> Combos Deals Section -> Category Best Sellers.
- Add CSS in `apps/landing/src/styles.css` for 2x2 grid, card styles, and mobile responsiveness.
- Add unit test coverage in `apps/landing/src/app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Backend cart calculation modifications (marketing landing prototype).

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/components/CombosSection.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/landing-content.ts`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `apps/landing/public/assets/combos/*`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 workspace packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 14 tests pass
- [x] Full Vitest workspace suite — all 50 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Built `CombosSection.tsx` component faithfully replicating the reference layout with Pizza Avenue branding.
- Configured 4 cards in a 2x2 responsive grid: The Feast Combo (coral), Pizza Party Deal (golden yellow), Wrap & Wings Bundle (cyan), and Date Night Special (pastel rose pink).
- Included prominent save badges, bullet item lists, strikethrough original prices, bold bright white discounted prices, and "GRAB DEAL" pill buttons.
- Reordered landing page so that Category Best Sellers is situated after the Menu and Combo Banner, preceded directly by the new Combos section.
---

## CHG-0015 — Add Mobile App Showcase section before footer with brand styling

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, MARKETING
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Drive mobile app adoption and repeat pickup orders by introducing a high-converting, realistic mobile app showcase section directly above the footer, demonstrating the 3-tap checkout speed, instant cart review, and store download incentives with Pizza Avenue brand styling.

### Requested Outcome

Replicate the uploaded application mockup reference in a dedicated section (`AppDownloadSection`) situated before the footer on the landing page, adhering to Pizza Avenue design tokens (`Phudu`, `Poppins`, `--cream`, `--espresso`, `--maroon`, brand orange accent), featuring a responsive smartphone frame with cart items and sticky checkout, clear call-to-action app download buttons, and trust metrics.

### Scope

Included:
- Create `apps/landing/src/components/AppDownloadSection.tsx`.
- Add styling in `apps/landing/src/styles.css` for the phone chassis, dynamic island, cart list, sticky checkout pill, bottom navigation, display typography, store buttons, and trust badges.
- Insert `AppDownloadSection` into `LandingPage.tsx` directly before the `<Footer />`.
- Add unit tests in `apps/landing/src/app.test.tsx` verifying render, headline, highlight span, badges, store download buttons, and trust metrics.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Native iOS/Android app binaries (targets web app / PWA pickup URL).

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/components/AppDownloadSection.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 workspace packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 15 tests pass
- [x] Full Vitest workspace suite — all 51 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Built `AppDownloadSection.tsx` component situated directly before the footer section on the landing page, faithfully reproducing the reference mobile mockup design with Pizza Avenue branding.
- Created a realistic smartphone frame on the left featuring metallic copper/orange titanium chassis, Dynamic Island with camera lens, status bar, in-app cart items list with dish images (`paneer-cheese-pizza.png`, `chicken-tikka-pizza.png`, `cheesy-garlic-bread.png`, `chocolate-brownie.png`), stepper controls, sticky checkout summary pill, and bottom navigation tabs.
- Rendered display typography on the right with "Download the App" badge, uppercase headline "ORDER IN 3 TAPS. SERIOUSLY." with "3 TAPS." in brand flame orange, marketing subtitle, and Apple App Store + Google Play pill buttons.
- Integrated trust metrics with matching orange icons (★ 4.9 Rating, 📥 500K+ Downloads, ⚡ Under 3s Load).
- All 51 vitest tests, typecheck, lint, and production builds pass cleanly.

---

## CHG-0016 — Add Feed the Crowd Catering & Events Section after Combos Section with brand styling

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, MARKETING
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Expand average order value and attract group, corporate, and event orders by introducing a dedicated "FEED THE CROWD" catering and group package section placed directly after the Combos section, presenting curated packages (Office Party, Game Night Feast, Wedding Rehearsal) and a custom event catering builder callout with Pizza Avenue brand styling.

### Requested Outcome

Faithfully replicate the uploaded Catering & Events reference mockup directly after the Combos section on the landing page, using Pizza Avenue design system foundation (`Phudu` headlines, `Poppins` typography, rich brand color palette, warm background, responsive 3-column card layout, interactive deal buttons, and custom event catering banner).

### Scope

Included:
- Define `cateringPackages` in `apps/landing/src/landing-content.ts`.
- Create `apps/landing/src/components/CateringSection.tsx` component with:
  - Header pill badge ("Catering & Events"), display headline ("FEED THE CROWD."), and descriptive subtitle.
  - 3 group package cards (Office Party in coral orange, Game Night Feast in warm golden yellow, Wedding Rehearsal in dusty rose with "PREMIUM" badge).
  - High-res generated authentic food/gathering imagery in `apps/landing/public/assets/catering/`.
  - Servings indicator, included item tag pills, bold prices, and dark burgundy "GRAB DEAL" pill buttons.
  - Wide "CUSTOM EVENT CATERING" banner below cards with subtitle and "BUILD CUSTOM ORDER" button.
- Insert `<CateringSection customerAppUrl={customerAppUrl} />` into `LandingPage.tsx` immediately after `<CombosSection customerAppUrl={customerAppUrl} />`.
- Add comprehensive styling and responsive layout rules in `apps/landing/src/styles.css`.
- Add test coverage in `apps/landing/src/app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Backend multi-tier enterprise contract billing systems.

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/components/CateringSection.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/landing-content.ts`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `apps/landing/public/assets/catering/*`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 workspace packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 16 tests pass
- [x] Full Vitest workspace suite — all 52 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Built `CateringSection.tsx` component situated directly after the `<CombosSection />` on the landing page, replicating the reference Catering & Events design with Pizza Avenue branding.
- Created section header with "Catering & Events" pill badge, bold display headline "FEED THE CROWD." in `Phudu` (900 weight, deep espresso `#2D1208`), and subtitle "Stack your favorites and save big. Limited time offers that actually matter."
- Constructed 3 group catering cards in a responsive grid featuring authentic high-resolution gathering and dining photography:
  - **OFFICE PARTY**: Warm terracotta card body (`#EB5E28`), "Serves 10-15 people", tags (`10 Burgers`, `5 Large Pizzas`, `20 Wings`, `Dips & Sides`), price `$149`, and dark burgundy pill `GRAB DEAL`.
  - **GAME NIGHT FEAST**: Golden yellow card body (`#F5BA31`), "Serves 6-8 people", tags (`8 Burgers`, `3 Large Pizzas`, `12 Wings`, `Loaded Fries`), price `$99`, and dark burgundy pill `GRAB DEAL`.
  - **WEDDING REHEARSAL**: Rose pink card body (`#E57399`), "PREMIUM" dark pill badge, "Serves 25-30 people", tags (`25 Burgers`, `8 Large Pizzas`, `40 Wings`, `Salad Bowls`, `Desserts`), price `$299`, and dark burgundy pill `GRAB DEAL`.
- Created wide "CUSTOM EVENT CATERING" banner below the cards with title, descriptive subtitle ("Birthdays, corporate lunches, graduations, we build it your way."), and vibrant orange pill button ("BUILD CUSTOM ORDER").
- All 52 Vitest tests, workspace typecheck, lint, and production builds pass cleanly.

---

## CHG-0017 — Add Brand Highlights & Proof Cards Section after Story Section with brand styling

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, MARKETING
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Replicate the uploaded design reference directly after the brand story scroll-reveal section to boost social proof, highlight quality metrics (50K+ Happy Foodies, 0 Artificial Additives, FRESH Hot in minutes, 100% Certified safe), and showcase authentic, mouth-watering sourdough pizza enjoyment photography with Pizza Avenue brand styling and typography.

### Requested Outcome

Faithfully replicate the uploaded section layout:
- 4 top vibrant, rounded stat cards in a responsive grid (`50K+ Happy Foodies`, `0 Artificial Additives`, `FRESH Hot in minutes`, `100% Certified safe`) using brand color harmony (terracotta/coral orange, sky blue, warm yellow, soft rose pink) and espresso display typography.
- 2 bottom high-impact lifestyle photo cards (`FLAVORS MADE FOR YOU`, `HOT, FRESH, PERFECT`) featuring authentic, unbranded pizza enjoyment photography, dark gradient overlays, and bold `Phudu` typography.
- Positioned immediately after the Story section (`.story-reveal-container`) and before the Customer Flow section (`<CustomerFlow />`).

### Scope

Included:
- Add `brandStatCards` and `brandPhotoCards` datasets in `apps/landing/src/landing-content.ts`.
- Create `apps/landing/src/components/BrandHighlights.tsx` component.
- Generate and place high-resolution photography assets in `apps/landing/public/assets/highlights/`.
- Add responsive styling rules in `apps/landing/src/styles.css`.
- Insert `<BrandHighlights />` into `LandingPage.tsx` directly after the Story section.
- Add unit/integration tests in `apps/landing/src/app.test.tsx`.
- Update `17_CHANGELOG.md` and `24_CHANGE_QUEUE.md`.

Excluded:
- Modifying backend APIs or database schemas.

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/src/components/BrandHighlights.tsx`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/landing-content.ts`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `apps/landing/public/assets/highlights/*`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 workspace packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 17 tests pass
- [x] Full Vitest workspace suite — all 53 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — all 4 applications build successfully

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Built `BrandHighlights.tsx` component placed immediately after the story section (`.story-reveal-container`) and before the customer flow section (`<CustomerFlow />`) on the landing page, replicating the reference design layout with Pizza Avenue branding.
- Created top 4 rounded metric cards in a responsive grid using the brand palette (`#FF6E40`, `#7BD5F5`, `#F9C74F`, `#F7A8D8`) with bold espresso typography in `Phudu` and `Poppins` (`50K+ Happy Foodies`, `0 Artificial Additives`, `FRESH Hot in minutes`, `100% Certified safe`).
- Created bottom 2 high-impact photo cards in a responsive grid featuring high-resolution photography assets (`flavors-made-for-you.jpg` and `hot-fresh-perfect.jpg`) with dark bottom gradient overlays and bold white uppercase headlines (`FLAVORS MADE FOR YOU` and `HOT, FRESH, PERFECT`).
- Added responsive styling rules and media queries in `apps/landing/src/styles.css`.
---

## CHG-0018 — Integrate authentic Pizza Avenue brand logo across landing page surfaces

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, BRANDING
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Incorporate the authentic, newly added circular Pizza Avenue brand logo badge into all key landing page surfaces (browser tab icon, header navigation wordmark, footer brand lockup, footer rising display disc, and mobile app mockup) to establish consistent, high-trust brand identity across customer touchpoints.

### Requested Outcome

- Add browser tab favicon and Apple touch icon references in `index.html`.
- Add the circular brand badge in the site header navigation wordmark (`.wordmark`) with responsive scaling and hover micro-interaction.
- Add a dedicated brand lockup (`.footer-brand-lockup`) in the footer top section featuring the logo, title, and tagline ("The Only Route to Real Flavor · Sainikpuri").
- Embed the authentic brand badge inside the giant rising footer display circle (`.footer-banner-disc-img`).
- Add the logo badge inside the smartphone mockup cart header and the right-column "Download the App" badge in the Mobile App Showcase section.
- Clip the logo image cleanly (`border-radius: 50%`, `object-fit: cover`) to highlight the circular seal and dough art.

### Scope

Included:
- Update `apps/landing/index.html` with favicon and apple-touch-icon links.
- Update `apps/landing/src/LandingPage.tsx` header wordmark.
- Update `apps/landing/src/components/Footer.tsx` with brand lockup and banner disc image.
- Update `apps/landing/src/components/AppDownloadSection.tsx` with app header and download badge icons.
- Add responsive styling in `apps/landing/src/styles.css`.
- Add integration tests in `apps/landing/src/app.test.tsx`.
- Update `docs/17_CHANGELOG.md` and `docs/24_CHANGE_QUEUE.md`.

Excluded:
- Backend or database modifications.

### Affected Surfaces

- Landing Page (`apps/landing`)

### Files / Areas Changed

- `apps/landing/index.html`
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/components/Footer.tsx`
- `apps/landing/src/components/AppDownloadSection.tsx`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 workspace packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 18 tests pass
- [x] Full Vitest workspace suite — all 54 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — `@pizza-avenue/landing` builds successfully in 2.15s

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Brand logo integrated seamlessly in HTML favicon, header wordmark, footer brand block, footer rising circle disc, and mobile app mockup.
- Full test suite, lint, typecheck, and production builds pass cleanly.

---

## CHG-0019 — Replicate Reference Hero Carousel Layout Structure & Responsive Device Scaling

- **Status:** IN_REVIEW
- **Type:** FEATURE, UI, RESPONSIVE
- **Priority:** P2
- **Owner:** Antigravity / Priyansu
- **Created:** 2026-10-08
- **Last Updated:** 2026-10-09
- **Pull Request:** #13 against `develop` (shared Landing branch; staging and production not deployed)

### Business Reason

Replicate the exact design structure and responsive layout shown in the user's reference mockup images (Stack n Snack hero reference) on Pizza Avenue's hero carousel:
1. Card structure: Each card features an outer solid colored container matching the category theme, an inset photo with rounded corners and uniform framing padding, and bold, centered uppercase display typography directly on the card background.
2. Category colors: Palette aligned with reference (Crimson Red for PIZZAS, Sky Cyan for PANEER CRAFT, Terracotta Orange for CHICKEN TIKKA, Basil Green for TRUFFLE MUSHROOM, Golden Yellow for GARLIC BREAD, Rose Pink for SWEET BITES).
3. Buttons: Fully rounded pill buttons (`border-radius: 9999px`) for both primary and secondary hero CTAs.
4. Responsive viewports:
   - Mobile: 1 prominent centered card (~74vw) with left and right adjacent cards peeking in (~13vw) at the viewport edges, replicating Reference Image 1.
   - Desktop: 5 cards visible across the screen (4 centered full cards + left/right edge peeks), replicating Reference Image 2.
   - Monotonic scaling across all device viewports.

### Requested Outcome

- Outer solid colored card container with `border-radius: 1.45rem - 1.65rem` and inset square photo (`border-radius: 1rem - 1.2rem`).
- Bold uppercase display labels (`Phudu`, 800 weight) centered in the bottom color band.
- Fully rounded pill buttons (`border-radius: 9999px`) for hero CTAs.
- Seamless 4K marquee scroll with 24 cards (4x clones) and accessible ARIA hiding on clone cards.

### Scope

Included:
- `apps/landing/src/LandingPage.tsx`
- `apps/landing/src/landing-content.ts`
- `apps/landing/src/styles.css`
- `apps/landing/src/app.test.tsx`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Tests Required

- [x] Workspace typecheck — all 11 workspace packages pass cleanly with 0 errors
- [x] Landing unit and integration tests — all 19 tests pass
- [x] Full Vitest workspace suite — all 55 tests pass across 6 test files
- [x] Workspace ESLint check — 0 errors, 0 warnings
- [x] Production build — `@pizza-avenue/landing` builds successfully in 1.63s
- [x] Responsive layout audit verifying mobile 1-card centered peek and desktop 5-card layout

### Staging Result

- Not Tested

### Production Result

- Not Released

### Final Result

- Hero section and carousel fully replicated to match the supplied reference structure across desktop and mobile.
- The recorded 55-test run was an earlier snapshot. The current 2026-10-09 run passed 44/44 workspace tests, typecheck, ESLint and all four frontend production builds.

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
