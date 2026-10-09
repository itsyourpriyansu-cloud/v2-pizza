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
Next Change ID: CHG-0030

Open:
29

In Progress:
1

In Review:
25

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

Integration note (2026-10-09): Pull Request #13 originally reused CHG-0006 through CHG-0019, which were already assigned independently on the Customer branch. CHG-0005 remains the Landing parent; its child entries are migrated to CHG-0013 through CHG-0026 and retain their legacy PR #13 IDs in each entry. CHG-0027 tracks this integration. The pickup-only sentence in `docs/00_PROJECT_CONTEXT.md` conflicts with DEC-026 and the active dual-service documents; both implementations are preserved pending the owner decision recorded below and in `docs/CLIENT_DECISIONS_PENDING.md`.

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
- **Integration:** Source commit `7870848bb7015e72c3a612765d00e0bd35fa3f5b` is merged into `feature/customer-home-experience-v1` for review; validation and the final `develop` PR remain pending.

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

Implementation remains on `feature/landing-initial-ui` under GitHub Issue #12 and Pull Request #13. The follow-up hero adjustments are complete: the hero section fills 100vh/100dvh viewport height across mobile and tablet with balanced spacing, the hero title explicitly splits into two lines ("CRAVE IT." on line 1 and "TAP IT. PICK IT UP." on line 2), an accessible collapsible mobile menu bar with animated hamburger toggle is implemented, hero actions maintain row flex-direction across both mobile and desktop, and category cards remain fully visible above the fold without clipping. The 2026-10-08 responsiveness pass adds grid/flex containment across every Landing chapter; removes the Brand Highlights tablet/narrow-phone overflow; makes the phone mockup and footer display artwork shrink safely; and tightens the smallest header. Local browser inspection confirms document-width parity with no horizontal scroll from 320×900 through 1440×900, including 390×844 mobile. On 2026-10-09, local verification passed: ESLint, workspace typecheck, Vitest (6 files, 44 tests), and all four frontend production builds. Earlier test totals above are historical snapshots, not the current suite count. Source commit `7870848bb7015e72c3a612765d00e0bd35fa3f5b` is now also integrated into `feature/customer-home-experience-v1` under CHG-0027, where the combined branch passed lint, typecheck, 175 tests and all four builds. No staging or production deployment has been performed.

### Related Changes

- CHG-0003
- CHG-0004

---

## CHG-0013 — Integrate Faq05 component and Radix accordion into Landing and components/ui

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0006 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0014 — Implement brand footer using project styling and color palette

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0007 (renumbered during integration because the ID was already assigned on the customer branch)
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
- CHG-0013

---

## CHG-0015 — Integrate InfiniteMovingCards Google Reviews marquee above FAQ

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0008 (renumbered during integration because the ID was already assigned on the customer branch)
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
- CHG-0013
- CHG-0014

---

## CHG-0016 — Customer Flow Process section added after the story section

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0009 (renumbered during integration because the ID was already assigned on the customer branch)
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
- CHG-0014
- CHG-0015

---

## CHG-0017 — Fix Category Best Sellers section and make it 100vh

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0010 (renumbered during integration because the ID was already assigned on the customer branch)
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

- CHG-0015
- CHG-0016

---

## CHG-0018 — Build Pick Your Craving 100vh Menu section with authentic category filters and carousel after the story section

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0011 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0019 — Remove redundant legacy Signatures section from landing page

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0012 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0020 — Add Combo Madness promotional banner strip after Customer Flow section

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0013 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0021 — Replicate Combos Section with brand styling and reorder sections after menu and combo banner

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0014 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0022 — Add Mobile App Showcase section before footer with brand styling

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0015 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0023 — Add Feed the Crowd Catering & Events Section after Combos Section with brand styling

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0016 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0024 — Add Brand Highlights & Proof Cards Section after Story Section with brand styling

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0017 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0025 — Integrate authentic Pizza Avenue brand logo across landing page surfaces

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0018 (renumbered during integration because the ID was already assigned on the customer branch)
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

## CHG-0026 — Replicate Reference Hero Carousel Layout Structure & Responsive Device Scaling

- **Status:** IN_REVIEW
- **Legacy PR #13 ID:** CHG-0019 (renumbered during integration because the ID was already assigned on the customer branch)
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

- **Status:** IN_REVIEW
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
- #21 — targets `feature/customer-ui-ux-v1` while prerequisite PRs #18 and #19 remain open; must not target `develop` until they merge
- GitHub Actions `frontend-foundation` validation passed before the final queue-only synchronization commit

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
- CI Passed — GitHub Actions `frontend-foundation`; branch remains stacked and is not deployed

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
- [x] Open a tracked Issue and correctly based PR after validation.
- [ ] Retarget to `develop` only after prerequisite PRs merge.

### Current Result

Implementation and local validation are complete on the stacked Customer commerce branch. Pickup and Dine-in missions pass through typed API-client/MSW boundaries; all 121 tests pass, workspace lint and all TypeScript project checks pass, all four production app builds pass, and `pnpm audit --prod` reports no known vulnerabilities. Browser walkthroughs pass at 360, 390, 430, 768 and 1440 px without horizontal overflow; saved evidence covers cart, Pickup review/tracking and the Dine-in waiter gate. Browser console and network error checks are clean after adding the Customer favicon. The Customer entry bundle is 374.79 kB / 117.18 kB gzip versus the 533.25 kB / 164.56 kB gzip baseline. Production backend/provider behavior remains intentionally unproved by this MSW batch.

### Related Changes

- CHG-0002
- CHG-0006
- CHG-0007

---

## CHG-0009 — Customer Retention & Profile V1

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, RETENTION, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Complete the first Customer retention loop after ordering so one verified customer account can understand Pizza Points, safely reserve rewards, explore the Pizza Passport, complete Personal and Common Missions, maintain practical preferences and return to the live menu without retention ever blocking ordering.

### Requested Outcome

Deliver production-shaped, deterministic mock-backed Rewards, Passport, Missions, Home retention and Profile experiences through the existing React → TanStack Query → typed API client → MSW boundary. Align the current menu presentation and replace incomplete placeholder catalog content with the documented preliminary Pizza Avenue mock menu while keeping all prices and production truth explicitly provisional.

### Scope

Included:
- Pizza Points balance, next-reward progress, pending Dine-in explanation and human-readable activity,
- reward locked/available/reserved/applied/consumed/unavailable states with reservation and release recovery,
- Pizza Passport new/progress/one-left/complete/unavailable states linked to current Product Detail routes,
- visibly separated Personal and Common Missions with exact progress and subtle Avenue XP,
- one adaptive Home retention module subordinate to active order/table/reorder priorities,
- practical Profile identity, verified-phone, preferences, favourites, notifications, legal/help/logout and typed save recovery,
- deterministic mock personas/scenarios, retention analytics, lazy routes, focused mission/regression tests and responsive browser evidence,
- menu grid/content alignment using documented mock-only catalog names and current shared product contracts.

Excluded:
- full Avenue League or public ranking,
- household/family/DOB/occasion automation,
- advanced referral or collaborative/group baskets,
- real loyalty/reward/mission backend, persistence, notifications, database or Admin tooling,
- changes to payment, order admission or Dine-in billing authority.

### GitHub Tracking

Issue:
- [#22 — Customer Retention & Profile V1](https://github.com/itsyourpriyansu-cloud/v2-pizza/issues/22)

Branch:
- `feature/customer-retention-v1`, stacked from exact commerce head `72697aab048dae4e7f6662b9f51534d1827c4112` while PRs #18, #19 and #21 remain open

Pull Request:
- [#23 — Customer Retention & Profile V1](https://github.com/itsyourpriyansu-cloud/v2-pizza/pull/23), targeting `feature/customer-commerce-flow` while PR #21 remains unmerged; `frontend-foundation` CI passed and GitHub reports the PR mergeable/clean

### Affected Surfaces

- Customer PWA
- Shared frontend API/type/mock boundaries
- Customer seed menu and documentation/test evidence

### Affected Modules

- Rewards and loyalty activity
- Pizza Passport and Product Detail attribution
- Personal/Common Missions and Avenue XP presentation
- Home adaptive retention module
- Customer Profile/preferences
- Menu catalog fixtures and product layout alignment
- Shared API client, types, mocks, analytics and route splitting

### Files / Areas Changed

- `apps/customer/src/features/loyalty`, Passport, Missions, Home, Orders, Profile and shared retention components
- `apps/customer/src/app/router.tsx`, focused retention/regression tests and Customer styles
- `packages/types`, `packages/api-client`, `packages/mocks` and `packages/utils` retention/menu contracts, handlers and query keys
- six responsive screenshot artifacts and the task-relevant product/engineering documentation

### Database Impact

Migration required:
- No. Frontend/MSW implementation only; documented future PostgreSQL ledger and progress models remain authoritative.

Data migration required:
- No

### API Impact

New production endpoints:
- None implemented. Typed frontend contracts may represent the already documented loyalty/rewards/passport endpoints plus mock-only missions/profile endpoints for future backend alignment.

Breaking change:
- No

### State Machine Impact

- Renders the existing reward `AVAILABLE → RESERVED → APPLIED → CONSUMED` and `RESERVED → RELEASED` lifecycle without allowing client authority.
- Loyalty/Passport/Missions remain finalized only by qualifying completed Pickup or paid Dine-in events.

### Permission Impact

- Customer can read/update only their own mock profile and retention state.
- No staff/admin loyalty authority is added.

### Analytics Impact

- Add privacy-safe client journey hooks for rewards, Points, Passport, Personal/Common Missions, Profile, Home retention and post-order retention summary interactions.
- No analytics vendor or authoritative economic mutation is introduced.

### Environment / Secret Impact

New env vars:
- None planned

Changed secrets:
- None

### Tests Required

- [x] reward mapping, reservation, release and conflict recovery
- [x] Passport progression, uniqueness, unavailable recommendation and Product navigation
- [x] Personal/Common Mission progress and exactly-once XP presentation
- [x] unpaid Dine-in Points pending versus paid loyalty state
- [x] Profile load/save success/failure and validation
- [x] Home operational-priority matrix
- [x] menu mock catalog and responsive alignment
- [x] commerce regression suite
- [x] workspace lint, typecheck, 131 tests, builds and production dependency audit
- [x] 360/390/430/768/1440 browser verification and screenshots
- [x] console/network and privacy/security scan

### Edge Cases

- Retention never blocks order, track, reorder or active table actions.
- Reward reserve does not consume; abandoned/released reservation restores availability.
- Passport completion and XP presentation are duplicate-safe in the mock state model.
- Sold-out Passport recommendations fall forward without resetting progress.
- Served but unpaid Dine-in items show pending copy and never increase spendable Points.
- Profile preference failures retain the last saved profile and explain recovery.
- Menu data remains explicitly mock/preliminary pending founder confirmation.

### Security Review

- No arbitrary Points/XP mutation from UI inputs.
- No raw private profile data in logs, analytics or screenshots.
- No DOB/household collection or medical/allergen guarantee.
- Reward/loyalty finalization remains backend-authoritative in documented production architecture.

### Staging Result

Status:
- Local validation and PR CI complete; not deployed to staging

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- PRs #18, #19 and #21 remain unmerged; this branch is intentionally stacked.
- Founder-confirmed earn ratio, reward costs, expiry policy and production menu prices remain pending; mocks must not be represented as production truth.
- MSW cannot prove server ledger idempotency, ownership enforcement or paid-bill loyalty attribution.

### Follow-Up

- [x] Implement and validate the scoped Customer retention batch.
- [x] Open the tracked Issue and correctly based stacked PR.
- [ ] Retarget only after the prerequisite chain merges.

### Current Result

Implementation and local validation are complete on stacked PR #23. The Customer build exposes separate lazy Rewards (7.07 kB), Passport (1.88 kB), Missions (1.75 kB) and Profile (7.37 kB) chunks; initial Customer entry is 272.80 kB (84.45 kB gzip). Browser evidence reports no horizontal overflow at 360/390/430/768/1440, zero unnamed buttons/unlabelled inputs on reviewed retention routes, zero console/network errors, 29 menu products, eight categories and zero measured card-height spread. GitHub CI passed and the PR is mergeable/clean; it remains intentionally unmerged.

### Related Changes

- CHG-0002
- CHG-0006
- CHG-0007
- CHG-0008

---

## CHG-0010 — Customer Engagement Complete V1

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-07

### Business Reason

Complete the final major Customer-facing prototype layer before client review so Pizza Avenue can demonstrate practical repeat-order, family, occasion, referral, social, League and group-ordering concepts without weakening the core ordering hierarchy or starting the production backend.

### Requested Outcome

Deliver deterministic Saved Baskets, Household, Occasions, reactivation, advanced referrals, privacy-safe Taste Card, seasonal Avenue League and host-paid Group Ordering experiences through the existing React → TanStack Query → typed API client → MSW boundary. Integrate the new concepts into Home and Profile without adding bottom-navigation destinations or allowing game/social content to outrank active Pickup or Dine-in operations.

### Scope

Included:
- Saved Baskets including the Family Basket use case, current-menu revalidation and recoverable stale differences,
- optional Household members with minimal useful profile fields and safety/privacy guidance,
- important Occasions linked to Household members and Saved Baskets,
- contextual reactivation without automatic discounting,
- referral progress from shared through rewarded using qualifying paid/completed first-order semantics,
- privacy-safe Taste Card sharing,
- opt-in seasonal Avenue League based on Avenue XP with top-three and nearby-rank views,
- frontend-only host-led Group Ordering, group basket, lightweight poll and checkout handoff,
- one adaptive Home engagement module beneath operational/reorder priorities,
- Profile subsections, centralized feature flags, deterministic scenarios, lazy routes, tests, responsive/browser evidence and affected documentation.

Excluded:
- NestJS, Prisma, PostgreSQL, Redis, BullMQ or database migrations,
- real authentication, payments, referrals, League calculation, notifications or collaborative WebSocket synchronization,
- split bills, participant payments, wallet splitting or POS replacement,
- changes to the frozen five-item bottom navigation,
- delivery, marketplace, multi-brand or other explicit V1 exclusions.

### GitHub Tracking

Issue:
- [#24 — Customer Engagement Complete V1](https://github.com/itsyourpriyansu-cloud/v2-pizza/issues/24)

Branch:
- `feature/customer-engagement-complete-v1`, stacked from current `feature/customer-retention-v1` head `a114c93241876e4a0ceced9f698e1585013c342f` while PR #23 remains open

Pull Request:
- [#25 — feat(customer): complete engagement prototype](https://github.com/itsyourpriyansu-cloud/v2-pizza/pull/25), stacked into `feature/customer-retention-v1`

### Affected Surfaces

- Customer PWA
- Shared frontend contracts/API client/MSW fixtures
- Customer documentation and browser evidence

### Affected Modules

- Saved Baskets and cart handoff
- Household and Occasions
- referrals and Taste Card
- Avenue League and Avenue XP presentation
- Group Ordering and poll
- Home adaptive engagement
- Profile navigation
- analytics, feature flags, route splitting and tests

### Files / Areas Changed

- Implemented: `apps/customer/src/features`, router, Customer tests and styles
- Implemented: `packages/types`, `packages/api-client`, `packages/mocks`, `packages/utils`
- Updated: affected product, flow, design-contract, analytics, seed, test, decision, changelog, acceptance and queue documents
- Captured: ten required artifacts under `docs/assets/screenshots/`

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New production endpoints:
- None implemented; typed frontend prototype contracts and MSW handlers only

Changed production endpoints:
- None

Breaking change:
- No

### State Machine Impact

- No production state machine is implemented or changed.
- Referral, League and group states are deterministic frontend fixtures only.
- Dine-in `SERVED` remains economically pending; only future authoritative `TABLE_BILL_PAID` processing may finalize loyalty, Missions, XP or League contribution.

### Permission Impact

- Customers manipulate only their own prototype Saved Baskets, Household, Occasions, referrals, Taste Card, League opt-in and hosted Group Order.
- Participant views expose only display names, contributions and poll choices.
- No staff/admin authority is added.

### Analytics Impact

Implemented privacy-safe client event names and instrumentation for Saved Basket, Household, Occasion, Referral, Taste Card, League, Group Order, poll, checkout-handoff and reactivation interactions listed in `docs/12_ANALYTICS_EVENTS.md`. Existing source attribution is preserved and no analytics event becomes operational truth.

### Environment / Secret Impact

New env vars:
- None

Changed secrets:
- None

### Tests Required

- [x] 14 focused end-to-end Customer engagement missions
- [x] existing commerce regression
- [x] existing retention regression
- [x] workspace lint, typecheck, 145 tests and all app builds
- [x] production dependency audit, secret scan and `git diff --check`
- [x] browser validation at 360/390/430/768/1440
- [x] forms, progress, leaderboard, sharing, polls, focus, keyboard, touch-target and semantic accessibility checks
- [x] browser console/network inspection and ten required screenshots

### Edge Cases

- A Saved Basket is always revalidated and preserves valid items when an item, price or modifier changes.
- Household private data never enters public Taste Card, League, referral or group payloads; avoid-ingredient copy is not an allergy guarantee.
- Referral rewards require verified identity plus a qualifying completed/paid first order, never a share, click or registration alone.
- Low-engagement customers are not shown discouraging ranks before opt-in/meaningful participation.
- Group host remains final decision-maker and sole checkout payer; participant privacy is preserved across expired, closed, unavailable and network-failure states.
- Active Dine-in and Pickup remain dominant over every engagement module.
- Served but unpaid Dine-in does not finalize Points, Passport, Missions, XP or League contribution.

### Security Review

- Auth/RBAC: no real authentication or expanded staff authority; future server ownership enforcement remains mandatory.
- PII: public/share surfaces exclude phone, email, birthdays, family data, Points, order history and private preferences.
- Money/state: all prices are provisional integer paise and revalidated; clients do not award referral/League value or finalize economic outcomes.
- Replay/idempotency: mock transitions remain deterministic; future backend must enforce referral qualification, XP/League contribution and group checkout idempotency.

### Staging Result

Status:
- Local validation complete; staging deployment is not authorized in this task

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- PRs #18, #19, #21 and #23 remain open; this work is intentionally stacked.
- Prototype policies, tiers, thresholds, referral reward values, reminders and Saved Basket economics require client/founder review.
- MSW cannot prove production ownership, transactionality, collaboration, idempotency or delivery.
- The requested scope is a large client-review batch and must remain route-split to protect the initial Customer bundle.

### Follow-Up

- [x] Implement and validate the complete Customer engagement prototype.
- [x] Open a stacked PR against `feature/customer-retention-v1`.
- [x] PR #25 `frontend-foundation` CI passed on commit `01d00da`.
- [ ] Conduct client UX review and correction pass before backend implementation.

### Current Result

The Customer engagement prototype is complete locally through the existing typed frontend/MSW boundary. All 14 new missions and 131 existing tests pass, all apps build, dependency audit is clean, and the 35-route responsive browser matrix reports no console, network, overflow, labeling, progress, heading, keyboard or 44 px control-target failures. Stacked PR #25 is open against `feature/customer-retention-v1`; `frontend-foundation` CI passed on commit `01d00da`, and client review remains pending.

### Related Changes

- CHG-0008
- CHG-0009

---

## CHG-0011 — Customer V1 Client Review and Pre-Freeze Audit

- **Status:** IN_REVIEW
- **Type:** DOCUMENTATION, UX, TEST
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-07
- **Last Updated:** 2026-10-08

### Business Reason

Prepare the complete Customer V1 prototype for structured restaurant-owner review, feedback and an eventual UX freeze without requiring the reviewer to use Git, a terminal, developer tools, source edits or database access.

### Requested Outcome

Provide a repeatable, business-focused walkthrough of the complete Customer product; a deterministic development-only review-state mechanism; a comprehensive owner decision register; a contrarian feature and UX audit; a client scorecard; representative evidence; and truthful final validation. Only P0, clear P1, broken-link, contradiction, overflow, accessibility, state-presentation or review-scenario fixes are permitted before client decisions.

### Scope

Included:
- numbered review flow from service selection through Returning Customer Home,
- pending owner decision register across menu, Pickup, Dine-in, loyalty, retention, engagement, brand and legal policy,
- deterministic review-persona/scenario verification and facilitator-friendly documentation,
- Home priority, language, money/Points/XP and hardcoded-price audits,
- contrarian feature assessment and P0–P3 pre-freeze UX register,
- global UX-state, accessibility, responsive, console/network and regression validation,
- concise representative screenshot pack using current artifacts where valid,
- only safe pre-review fixes meeting the task's explicit severity rule.

Excluded:
- new Customer features or redesign,
- the post-review correction pass or UX freeze itself,
- NestJS, Prisma, PostgreSQL, Redis, BullMQ, POS, inventory, production billing, real payments/authentication, capacity engine, offline edge or Petpooja migration,
- changes to production business values that require owner approval,
- merge, staging or production deployment.

### GitHub Tracking

Issue:
- [#26 — Customer V1 — Client Review & Pre-Freeze Audit](https://github.com/itsyourpriyansu-cloud/v2-pizza/issues/26)

Branch:
- `feature/customer-ux-review-prep`, stacked from `feature/customer-engagement-complete-v1` commit `184d2ed843fb6c5c690d1dad98aedba5ed23e761`

Pull Request:
- [#27 — Customer V1 — Client Review & Pre-Freeze Audit](https://github.com/itsyourpriyansu-cloud/v2-pizza/pull/27), open against `feature/customer-engagement-complete-v1`; do not merge in this task

### Affected Surfaces

- Complete Customer PWA review surface
- Customer frontend/MSW review scenarios
- Client-review documentation and screenshot evidence

### Affected Modules

- Customer router/shell and review-state entry only if a reproducibility defect is found
- existing scenario catalog and browser review paths
- Home prioritization, customer-facing copy, pricing displays and UX states under audit
- `docs/CLIENT_REVIEW_FLOW.md`
- `docs/CLIENT_DECISIONS_PENDING.md`
- `docs/CLIENT_REVIEW_SCORECARD.md`
- `docs/UX_AUDIT_PRE_FREEZE.md`

### Files / Areas Changed

- four client-review/pre-freeze documents, queue/changelog/index truth and a 17-image curated pack using 13 current screenshots plus four new captures
- development-only review-persona state, URL hook, focused tests and Chrome/CDP audit helper
- Home priority/deduplication, customer-language normalization and Pizza Points naming
- Saved Basket/current-menu price alignment and Passport progress scenario correction

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New production endpoints:
- None

Changed production endpoints:
- None

Breaking change:
- No

### State Machine Impact

- None planned. Existing Pickup payment gate, Dine-in waiter gate, billing and retention finalization rules remain unchanged.

### Permission Impact

- None. Development-only scenarios do not grant production authority and must not become customer-visible controls.

### Analytics Impact

- No new events planned. Audit existing event/copy alignment only.

### Environment / Secret Impact

New env vars:
- None planned

Changed secrets:
- None

### Tests Required

- [x] verify all 15 named review personas and reproducible scenario URLs
- [x] audit all Customer routes for internal/developer language and concept clarity
- [x] audit hardcoded rupee values, integer-paise formatting and duplicated price calculation
- [x] audit Home priority and single contextual module
- [x] validate loading, skeleton, empty, network error, offline, session-expired, disabled, conflict, retry and success states; offline/global session expiry remain documented P2 production gaps
- [x] accessibility review for headings, labels, focus, keyboard, touch targets, progress, polls and announcements; no formal WCAG claim
- [x] visual review at 390 and 1440 px plus 360/430/768 spot checks
- [x] complete existing regression, lint, typecheck, all tests and all builds
- [x] production dependency audit, secret-pattern scan and `git diff --check`
- [x] browser smoke plus console/network review
- [x] verify representative review screenshot pack

### Edge Cases

- Review scenarios remain development-only and cannot leak controls or assumptions into production Customer UI.
- Existing screenshots must be rejected when stale rather than presented as current evidence.
- No client-dependent price, policy, reward, League, family, referral, legal or brand choice may be silently decided.
- Safe fixes must preserve the current stacked branch and existing commerce/retention behavior.
- Home must render only one engagement prompt and keep active Dine-in/Pickup dominant.

### Security Review

- Auth/RBAC: audit prototype copy/states only; do not implement or weaken authentication or permissions.
- PII: documents/screenshots must use fictional fixtures and avoid phone, OTP, token, provider payload and private Household details.
- Money/state: audit clarity only; backend-authoritative price/payment/state rules remain frozen.
- Replay/idempotency: no production mutation is introduced; existing mock scenarios remain deterministic.

### Staging Result

Status:
- Not Tested — review preparation has just started and no deployment is authorized

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- The Customer stack remains intentionally unmerged through PR #25 and this task depends on that reviewable head.
- Founder decisions may require a correction pass after review; this branch must not pre-empt those choices.
- MSW/browser evidence cannot prove future production backend security, persistence, provider or concurrency behavior.
- Final logo, production photography and several policy/economic values remain unavailable.

### Follow-Up

- [ ] Complete the review pack and truthful P0–P3 audit.
- [ ] Open a stacked PR against `feature/customer-engagement-complete-v1` and wait for CI.
- [ ] Stop at client-review readiness; do not start the correction pass or backend.

### Current Result

The complete client-review pack, deterministic development-only personas, safe P1 fixes and representative screenshots are implemented. Lint and typecheck pass; all 149 tests pass across 12 files; all four applications build; the production dependency audit reports no known vulnerabilities; the tracked-file secret scan and `git diff --check` pass. Chrome rendered the requested route matrix at 390/1440 plus 360/430/768 with no document overflow, in-viewport broken images, unlabeled controls, console errors or failed requests. A production preview confirmed `?review=` is ignored. Native in-app browser initialization failed because its kernel asset path was unavailable; installed Chrome/CDP supplied the browser evidence. The branch is pushed; stacked PR #27 is open, mergeable and green on `frontend-foundation`; no merge is authorized.

### Related Changes

- CHG-0007
- CHG-0008
- CHG-0009
- CHG-0010

---

## CHG-0012 — Customer Home Ordering Architecture and Service-Entry UX

- **Status:** IN_REVIEW
- **Type:** FEATURE, UX, TEST, DOCUMENTATION
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-08
- **Last Updated:** 2026-10-08

### Business Reason

Make the Customer entry and Home experience the fastest, clearest path from service context and appetite to a confident food choice, larger but appropriate basket and repeat-order habit without copying another brand or allowing loyalty/game systems to compete with ordering.

### Requested Outcome

Deliver a reviewable service-entry screen plus distinct new-customer, returning-customer, active-Pickup and active-Dine-in Home compositions. The hierarchy must answer what can be ordered now, reduce choice, and introduce relevant meal completion while preserving operational priority and at most one adaptive retention module.

### Scope

Included:
- improve the no-context Pickup/Dine-in entry while keeping Dine-in table-QR-only,
- add an explicit-permission in-app QR camera path with safe unsupported, denied and retry recovery,
- compose a new-customer Home around favourites, build-your-own, bestsellers and guided discovery,
- compose a returning-customer Home around the usual order, current-menu review, meal completion and one adaptive Your Avenue cue,
- preserve active Pickup tracking and active Dine-in table operations as the dominant Home state,
- reuse the current typed queries, preliminary 29-item seed menu and Pizza Avenue design system,
- add focused logic/UI tests, responsive browser review and current screenshot evidence.

Excluded:
- backend, database, production pricing, authentication, payment, capacity-engine or state-machine changes,
- automatic paid add-ons, fake scarcity, hidden fees or other dark patterns,
- delivery, marketplace, multi-brand or other V1 exclusions,
- merge, staging, production deployment or UX freeze.

### GitHub Tracking

Issue:
- Pending — GitHub CLI is unavailable in the local environment

Branch:
- `feature/customer-home-experience-v1`, stacked from `feature/customer-ux-review-prep` commit `7905909eb73f1b4065978fdfbb6acc0b5e29606a`

Pull Request:
- Pending creation: `https://github.com/itsyourpriyansu-cloud/v2-pizza/pull/new/feature/customer-reference-home-ui`

### Affected Surfaces

- Customer PWA service entry
- Customer Home for new, returning, active Pickup and active Dine-in states
- Customer review personas, tests and screenshot evidence

### Affected Modules

- `apps/customer/src/features/home`
- `apps/customer/src/features/dine-in/TableQrScanner.tsx`
- Customer responsive styles and shell context presentation
- development-only review personas/tests
- client-review documentation and screenshot index

### Database Impact

Migration required:
- No

Data migration required:
- No

### API Impact

New production endpoints:
- None

Changed production endpoints:
- None

Breaking change:
- No

### State Machine Impact

- None. Pickup remains payment-first; Dine-in remains table-QR and waiter-gated. Home renders existing state without creating authority.

### Permission Impact

- None. Customer actions remain within existing public/customer routes and server-authoritative boundaries.

### Analytics Impact

- Reuse documented discovery, builder, reorder, bundle/upsell and engagement events. `table_qr_scanned` records `IN_APP_CAMERA` versus `DIRECT_LINK` only after a token is present; no camera frame or raw QR payload enters analytics.

### Environment / Secret Impact

New env vars:
- None

Changed secrets:
- None

### Tests Required

  - [x] new-customer entry and Home hierarchy
  - [x] returning-customer usual-order and adaptive-module hierarchy
  - [x] active Pickup and active Dine-in dominance
  - [x] busy, paused, closed, no-order and unavailable-product recovery
  - [x] one adaptive retention module maximum
  - [x] workspace lint, typecheck, tests and builds
  - [x] 360/390/430/768/1440 responsive browser review
  - [x] labels, headings, touch-target sizing, overflow, console and network review
  - [x] current review screenshots
  - [x] in-app scanner permission, successful decode, invalid QR, cancellation and cleanup coverage

### Edge Cases

- Dine-in cannot be chosen by trusting a typed table number; the table QR remains the only entry.
- Paused/closed store state allows browsing but must not promise that an order can be started.
- A missing previous order falls back to guided discovery rather than an empty returning state.
- Sold-out or unavailable seed products must not become dead-end Home actions.
- Saved Basket revalidation and historical order price rules remain unchanged.

### Security Review

- Auth/RBAC: no authentication or permission path changes.
- Money/state: all displayed prices remain provisional typed integer-paise values; current-menu/order APIs remain authoritative.
- Secret/PII: no new collection, logging or analytics payload.
- Replay/idempotency: no production mutation is introduced.

### Staging Result

Status:
- Not Tested — local review work only

### Production Result

Status:
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- Final menu, bundle economics, restaurant hours, production photography and logo remain founder/client decisions.
- MSW browser evidence cannot prove production availability, pricing, persistence, capacity or order authority.
- A final real-device pass is still required for iOS Safari and Android Chrome camera permission, focus and low-light behavior against the printed production QR.
- The branch carries separate uncommitted local mock-startup changes that are outside this task and must not be included in its commits.

### Follow-Up

- [x] Complete implementation and review evidence.
- [ ] Obtain client review before starting the broader Home → Menu → Product → Builder → Cart correction pass.

### Current Result

The client-requested scanner correction is complete locally. Dine-in now has a permission-first in-app camera, local QR decoding, unrelated-code guidance, denied/unsupported recovery, internal token handoff, visible Table 12 confirmation and the existing server-owned resolver/waiter gate. Workspace lint, typecheck, 168 tests, all production builds and the production dependency audit pass. Mobile browser review confirms 47 px actions, no horizontal overflow, no console warnings/errors and a complete confirmed-table → Dine-in Home handoff. One full-suite test initially timed out while lint, typecheck, build and audit were competing in parallel; that test and the entire suite passed when rerun normally. A physical-device camera/printed-QR pass remains pending. GitHub Issue/PR creation remains pending because the GitHub CLI is unavailable. Not merged, staged or released.

### Related Changes

- CHG-0007
- CHG-0008
- CHG-0009
- CHG-0010
- CHG-0011

---

## CHG-0027 — Integrate reviewed Landing PR #13 into the Customer feature stack

- **Status:** IN_REVIEW
- **Type:** FEATURE, DOCUMENTATION, TEST
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-09
- **Last Updated:** 2026-10-09

### Business Reason

Bring the verified Landing source commit from Pull Request #13 into the current Customer feature branch without losing either branch's committed work, local work, assets, dependencies, tests or governance history.

### Requested Outcome

Merge source commit `7870848bb7015e72c3a612765d00e0bd35fa3f5b` into `feature/customer-home-experience-v1`, resolve every conflict by preserving intended behavior from both branches, run the complete frontend validation set, and keep the result behind required Pull Request review before `develop`.

### Scope

Included:
- Landing components, content, responsive styles, assets, dependencies, lockfile and tests from PR #13,
- existing Customer Pickup and Dine-in work on the current branch,
- collision-free migration of the Landing branch's reused queue IDs with legacy-ID traceability,
- preservation and restoration of pre-integration uncommitted local work,
- lint, typecheck, test and build verification,
- reviewable branch push and Pull Request handoff.

Excluded:
- changing the authoritative service-mode decision,
- staging or production deployment,
- bypassing CI or required review,
- declaring prototype pricing, reviews, metrics or imagery production-approved.

### Product Decision Required

`docs/00_PROJECT_CONTEXT.md` still says V1 is pickup-only, while higher-priority DEC-026 and the active scope/business-flow docs define Pickup plus Dine-in. This integration preserves the pickup-first Landing and the Dine-in Customer implementation. The product owner must decide whether to amend the stale project-context sentence or supersede DEC-026; this task does neither silently.

### GitHub Tracking

Source:
- Pull Request #13, `feature/landing-initial-ui` at verified commit `7870848bb7015e72c3a612765d00e0bd35fa3f5b`

Integration branch:
- `feature/customer-home-experience-v1`

Integration Pull Request:
- Pending creation/update after branch push

### Tests Required

- [x] repository lint — passed
- [x] repository typecheck — passed across all workspace packages and tools configuration
- [x] repository tests — 14 files and 175 tests passed in an isolated rerun
- [x] all frontend production builds — Landing, Customer, KDS and Admin passed
- [x] final diff and conflict-marker audit — passed locally
- [ ] Pull Request CI and required review

### Staging Result

- Not Tested

### Production Result

- Not Released

### Known Risks

- final service-mode scope decision is unresolved,
- Landing content includes provisional product data, testimonials, metrics and imagery pending owner/provenance approval,
- the first test attempt was run concurrently with lint, typecheck and four builds and exhausted Vitest worker startup; it executed no tests. The isolated full-suite rerun passed all 175 tests,
- final merge to `develop` must wait for green CI and required review.

### Final Result

The verified PR #13 source commit is integrated with the complete Customer branch history. Conflicts in the changelog, change queue, Vitest setup and lockfile were resolved by retaining both implementations and regenerating the combined lockfile. All 27 Landing image assets decode successfully, the frozen dependency install passes supply-chain verification, lint/typecheck/build pass, and the isolated test suite passes 175/175. The result remains unmerged and unreleased pending branch push, Pull Request CI and required review.

### Related Changes

- CHG-0005
- CHG-0012
- CHG-0013 through CHG-0026 (renumbered Landing child entries)

---

## CHG-0028 — Unify all application surfaces with the Landing visual language

- **Status:** IN_REVIEW
- **Type:** UX, REFACTOR, DOCUMENTATION, TEST
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-09
- **Last Updated:** 2026-10-09

### Business Reason

The integrated Landing experience now expresses the approved Pizza Avenue character, but the Customer, KDS and Admin surfaces still use partially duplicated or generic foundations. A single governed system is required so every surface feels like one product without reducing operational readability or changing domain behavior.

### Requested Outcome

Extract the Landing's approved palette, typography, spacing, shape, motion and accessibility rules into a reusable application foundation; apply that foundation to Customer, KDS and Admin with surface-specific density; and update the design-system documentation so the implemented contract is clear and testable.

### Scope

Included:
- shared brand and semantic design tokens,
- shared application shell and common route/state primitives,
- Customer token/primitives migration without flow or state changes,
- responsive, touch-safe Admin and KDS visual treatments,
- active navigation, focus, reduced-motion and status presentation,
- design-system documentation, changelog and automated verification.

Excluded:
- changes to ordering, pricing, payment, loyalty, authentication or service-mode rules,
- new product scope, API contracts or backend state,
- declaring provisional Landing copy, prices, reviews, metrics or imagery production-approved,
- staging, production deployment or bypassing required review.

### GitHub Tracking

Issue:
- Pending

Branch:
- `feature/unified-landing-design-system`

Pull Request:
- Pending creation; review branch pushed to `origin/feature/unified-landing-design-system`

### Affected Surfaces

- Landing (canonical visual reference; no flow changes)
- Customer
- KDS
- Admin / Counter / Waiter workspace

### Affected Modules

- `packages/ui`
- frontend application shells and styles
- governed design-system documentation

### Files / Areas Changed

- `packages/ui/src/*`
- `apps/customer/src/styles/*`
- `apps/admin/src/*`
- `apps/kds/src/*`
- `docs/06_DESIGN_SYSTEM.md`
- `docs/07_COMPONENTS.md`
- `docs/27_DESIGN_SYSTEM_FOUNDATION.md`
- `docs/28_UI_VISUAL_DIRECTION.md`
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

### Database / API / State / Permission Impact

- None. This change is visual and presentational only.

### Analytics Impact

- No event names or payloads change.

### Tests Required

- [x] repository lint — passed
- [x] repository typecheck — passed
- [x] repository test suite — 14 files, 175 tests passed with one worker
- [x] Landing, Customer, KDS and Admin production builds — passed
- [x] responsive visual smoke tests for Customer, KDS and Admin — passed at 390px and 1440px
- [x] keyboard focus, touch target and reduced-motion audit — shared contract verified; Customer/Admin 44px and KDS 48px navigation targets

### Staging Result

- Not Tested

### Production Result

- Not Released

### Known Risks

- Landing imagery and content remain provisional until their existing approvals are complete.
- Operational surfaces must share brand tokens without inheriting decorative Landing composition that would reduce scan speed.
- Existing uncommitted user tooling files are preserved separately and are outside this change.
- The first default multi-worker test run passed 171 tests but four cases exceeded their 10-second timeout under local resource pressure; all four passed in focused reruns and the full suite passed 175/175 with one worker.

### Follow-Up

- [ ] Obtain client visual review after local verification.
- [ ] Create/update the review Pull Request after validation.

### Current Result

The Landing palette, typography and interaction language now form a shared application foundation. Customer consumes the shared tokens and primitives without changing flows; Admin has a responsive operations rail; KDS has a high-contrast, large-target kitchen shell. Lint, typecheck, all 175 tests and all four production builds pass. Browser review confirms correct fonts, active navigation, touch targets and no document overflow or console errors at the tested mobile and desktop sizes. Implementation commit `748432eb0a295d766aa700930fad11d89364d0dd` is pushed to `origin/feature/unified-landing-design-system`; the change remains unmerged/unreleased pending Pull Request creation and required review.

### Related Changes

- CHG-0004
- CHG-0005
- CHG-0027

---

## CHG-0029 — Refine Customer service entry and Home from the approved reference study

- **Status:** IN_PROGRESS
- **Type:** UX, REFACTOR, DOCUMENTATION, TEST
- **Priority:** P1
- **Owner:** Codex / Priyansu
- **Created:** 2026-10-09
- **Last Updated:** 2026-10-09

### Business Reason

The service-entry and Home screens need a more decisive, image-led mobile hierarchy while retaining Pizza Avenue's governed identity, deterministic seed menu and dual-service operating rules.

### Requested Outcome

Study the supplied food-ordering case study, combine its strongest mobile composition patterns with the existing Pizza Avenue foundation, and implement the resulting system only on the service selector and Home experience.

### Scope

Included:
- Pickup/Dine-in service selector composition and responsive behavior,
- Pickup Home states and shared Home modules,
- active Dine-in and active Pickup Home priority states,
- Phosphor icons on the affected screens and navigation chrome,
- tokenized grid, surface, image, motion and icon rules,
- deterministic seed-data rendering, tests and visual verification.

Excluded:
- delivery, address, map or marketplace behavior from the reference,
- pricing, payment, order, loyalty, authentication or API changes,
- copying the reference brand, copy or proprietary artwork,
- redesigning routes beyond the service selector and Home.

### GitHub Tracking

Issue:
- Pending

Branch:
- `feature/customer-reference-home-ui`

Pull Request:
- Pending

### Database / API / State / Permission Impact

- None. Existing typed API boundaries, state priority and service-mode rules remain unchanged.

### Analytics Impact

- Existing `service_mode_selected`, discovery, reorder and engagement events remain unchanged.

### Tests Required

- [x] Customer component/flow tests — 2 files, 67 tests passed
- [x] repository typecheck — passed
- [x] repository lint excluding local ignored `.claude/**` tooling — passed with zero warnings
- [x] repository test suite — 14 files, 175 tests passed with one worker
- [x] all four frontend production builds — passed
- [x] mobile visual review at 375px and 390px — passed
- [x] desktop at 1440px and phone landscape — passed without document overflow
- [x] keyboard/focus, reduced-motion, contrast, touch-target and console checks — token and browser audit passed; no console warnings/errors

### Known Risks

- The reference uses an orange/black/white palette that conflicts with the frozen Pizza Avenue palette; visual roles are mapped to Maroon/Italian Brown, Espresso and Cream/Sand instead of introducing raw reference colors.
- Product imagery remains the current provisional Landing/seed asset set until the owner supplies production-approved photography.

### Current Result

The service selector and every existing Home priority state now use the combined Pizza Avenue/reference composition. The affected layers use pinned Phosphor icons, current typed seed menu data and the existing analytics and operational flows. Active Dine-in no longer exposes Pickup-oriented bottom navigation. Customer tests, repository typecheck, the full 175-test suite and all four builds pass; responsive browser review passes at phone, landscape and desktop sizes with no console errors. The default repository lint command remains affected only by unrelated local `.claude/security-audit` tooling; the complete tracked source tree passes when that ignored directory is excluded. Implementation commit `a920bc0` is pushed to `origin/feature/customer-reference-home-ui`; required Pull Request review is still pending.

### Related Changes

- CHG-0007
- CHG-0012
- CHG-0028

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
