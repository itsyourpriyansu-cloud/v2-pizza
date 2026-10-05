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
Next Change ID: CHG-0002

Open:
1

In Progress:
1

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

- **Status:** IN_PROGRESS
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
- Pending

Branch:
- `docs/repository-bootstrap`

Pull Request:
- Pending

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
- [ ] GitHub Issue/PR verification where available
- [ ] Staging — not applicable/not deployed
- [ ] Production smoke test — not applicable/not deployed

### Edge Cases

- Empty remote has no base branch for the first PR.
- Initial branch seeding must not be misreported as staging or production deployment.
- Later work must not reuse the bootstrap exception.
- No local secret or backup artifact may enter the initial commit.

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
- Not Released

Release:
- Not Released

Deployment date:
- Not applicable

### Known Risks

- The empty remote requires one exceptional branch-seeding operation before PR targets exist.
- Branch protection and required approvals remain owner-managed GitHub settings and are not changed by this task.
- GitHub Issue/PR creation depends on an authenticated browser because GitHub CLI is unavailable.

### Follow-Up

- [ ] Record actual Issue and Pull Request references.
- [ ] Obtain peer review before merging the baseline PR.
- [ ] Enable the documented branch-protection rules through repository-owner action.

### Final Result

In progress. Governance consistency work and staged-content security checks passed. The empty remote was seeded with identical bootstrap refs for `main` and `develop`, and commit `5c31c46` containing the complete documentation baseline was pushed to `docs/repository-bootstrap`. GitHub Issue and Pull Request creation remain pending because the available browser requires the repository owner to sign in; no staging or production deployment occurred.

### Related Changes

- None

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
