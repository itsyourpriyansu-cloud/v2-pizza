# 25 — Change Queue Agent Rules & Default Coding Prompt

> **Purpose:** Force every coding agent to maintain `24_CHANGE_QUEUE.md` automatically as part of normal work.

This file should be referenced by `AGENTS.md` and the coding-agent prompting guide.

---

# 1. Mandatory Agent Rule

Before every meaningful code change:

1. Read `AGENTS.md`.
2. Read `docs/20_MASTER_INDEX.md`.
3. Read `docs/22_GIT_GITHUB_WORKFLOW_RULES.md`.
4. Read `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`.
5. Read `docs/24_CHANGE_QUEUE.md`.
6. Read task-relevant product/engineering docs.
7. Inspect existing code.
8. Inspect existing queue entries for the same task.

Do not start implementation before confirming the change queue status.

---

# 2. Change Queue Is Mandatory

For every meaningful task:

- find existing queue entry,
- or create one if missing.

Do not create duplicate queue entries for the same feature/fix.

If an existing item is found:
- update that item.

If no item exists:
- allocate the next `CHG-XXXX` ID,
- increment `Next Change ID`,
- create an Active Queue entry.

---

# 3. Before Coding

The agent must write/update:

```text
Status
Type
Priority
Owner
Business Reason
Requested Outcome
Scope
Affected Surfaces
Affected Modules
Database Impact
API Impact
State Machine Impact
Permission Impact
Analytics Impact
Environment Impact
Tests Required
Known Risks
```

Set:

```text
Status: IN_PROGRESS
```

unless the task is still only planned.

---

# 4. After Coding

Update the same queue entry with:

```text
Files / Areas Changed
Database Changes
API Changes
State Changes
Permissions
Analytics
Environment Variables
Documentation Updated
Tests Completed
Edge Cases Verified
Security Review
Known Risks
Follow-Up
```

Do not create a second entry just because implementation is finished.

---

# 5. When Opening a PR

Update:

```text
Status: IN_REVIEW
Pull Request: #XX
Branch: ...
```

If PR cannot be created by the agent:
- leave PR as pending,
- state clearly that human action is required.

---

# 6. After Staging

Update:

```text
Status: STAGING
```

and record:

- staging result,
- failed cases,
- screenshots/notes where relevant.

If staging passes and release is pending:

```text
Status: READY_FOR_RELEASE
```

---

# 7. After Production

Update:

```text
Status: PRODUCTION
```

and record:

- release version,
- production deployment date,
- smoke-test result,
- remaining monitoring risk.

Then move the item from **Active Queue** to **Completed History**.

Do not delete the entry.

---

# 8. Rollback Rule

If a production change is rolled back:

1. Keep original change entry.
2. Update its production result.
3. Create a new queue entry:

```text
Type: ROLLBACK
```

4. Link:

```text
Related Changes:
- CHG-XXXX
```

5. Record:
- reason,
- rollback action,
- data implications,
- follow-up fix required.

---

# 9. Queue Item Must Match Git Work

The queue entry should reference:

```text
GitHub Issue
Branch
Pull Request
Release tag
```

when available.

Do not invent numbers.

If unknown:

```text
Issue: Pending
PR: Pending
Release: Not Released
```

---

# 10. Agent Must Not Fake Deployment State

Never mark:

```text
STAGING
PRODUCTION
```

unless that environment action actually happened.

If the agent only changed local code:

```text
Status: IN_PROGRESS
```

or

```text
Status: IN_REVIEW
```

as appropriate.

---

# 11. Queue Update Is Part of Definition of Done

A task is NOT complete until:

```text
implementation
+
tests
+
relevant documentation
+
CHANGELOG
+
CHANGE QUEUE
```

are updated.

---

# 12. Default Agent Prompt

Use the following prompt at the start of every coding task:

```text
You are working on The Pizza Avenue V1 repository.

MANDATORY BEFORE CODING:

1. Read /AGENTS.md completely.
2. Read /docs/20_MASTER_INDEX.md.
3. Read /docs/22_GIT_GITHUB_WORKFLOW_RULES.md.
4. Read /docs/23_CODING_AGENT_PROMPTING_GUIDE.md.
5. Read /docs/24_CHANGE_QUEUE.md.
6. Read /docs/16_DECISIONS.md.
7. Read /docs/17_CHANGELOG.md.
8. Read all task-relevant documentation.
9. Inspect the current implementation before editing.

CHANGE QUEUE REQUIREMENT:

Before implementation:

- Search `docs/24_CHANGE_QUEUE.md` for an existing entry representing this exact task.
- If one exists, reuse and update it.
- If one does not exist, create the next CHG-XXXX entry using the queue template.
- Update the queue summary.
- Set status appropriately, normally IN_PROGRESS.
- Do not create duplicate queue entries.

The queue entry must state:

- business reason
- requested outcome
- scope
- affected surfaces
- affected modules
- DB impact
- API impact
- state-machine impact
- permission impact
- analytics impact
- environment impact
- planned tests
- known risks

ARCHITECTURE:

Preserve the frozen Pizza Avenue architecture and source-of-truth hierarchy.

Do not introduce unrelated architecture.

Do not add Phase 2 features unless explicitly requested.

Do not bypass:

- backend pricing authority
- RBAC
- state machines
- payment verification
- idempotency
- transactional outbox rules
- documented pickup rules

IMPLEMENTATION:

Before writing code, inspect for existing modules/components/services.

Prefer extending existing architecture over creating parallel replacements.

If the task conflicts with documentation:

STOP.

Report:
- conflicting documents
- exact conflict
- possible resolution

Do not guess when the conflict affects:
- money
- payment
- permissions
- order state
- authentication
- pickup promise
- loyalty/reward value
- production data

AFTER IMPLEMENTATION:

1. Run lint.
2. Run typecheck.
3. Run affected unit tests.
4. Run affected integration tests.
5. Run relevant builds.
6. Run E2E tests where available.
7. Verify acceptance criteria.
8. Update relevant docs.
9. Update `docs/17_CHANGELOG.md`.
10. Update `docs/24_CHANGE_QUEUE.md`.
11. Update `docs/16_DECISIONS.md` only if an actual product/architecture decision changed.

CHANGE QUEUE AFTER IMPLEMENTATION:

Update the same CHG entry with:

- files changed
- DB migration
- API changes
- state changes
- permissions
- analytics
- environment vars
- docs updated
- tests run
- edge cases
- security review
- known risks
- follow-up work

If a PR is opened:

Status = IN_REVIEW

If staging actually occurs:

Status = STAGING

If staging is approved:

Status = READY_FOR_RELEASE

If production actually occurs:

Status = PRODUCTION

Never claim staging or production without evidence.

FINAL RESPONSE:

Return:

## Change Queue
CHG ID:
Final current status:

## Implementation Summary

## Files Changed

## Database Changes

## API Changes

## Tests Run

## Acceptance Criteria Verified

## Documentation Updated

## Queue Updated

## Risks / Follow-Up

## Suggested Next Step
```

---

# 13. Feature Prompt Add-On

Append this to a feature request:

```text
This is a FEATURE.

The change queue entry should use:

Type: FEATURE

If this feature spans multiple tasks, keep one parent change queue entry and clearly list follow-up subtasks unless they become independently deployable changes.
```

---

# 14. Bug Prompt Add-On

```text
This is a BUG FIX.

Before coding:

- reproduce the issue,
- identify root cause,
- add a regression test where practical.

Queue:

Type: FIX

Record:
- observed behavior,
- expected behavior,
- root cause,
- regression coverage.
```

---

# 15. Production Hotfix Add-On

```text
This is a production HOTFIX.

Queue:

Type: HOTFIX
Priority: P0 or P1

Base branch:
main

Required queue fields:

- production impact
- root cause
- minimal fix
- rollback
- regression test
- reconciliation into develop

Do not mix unrelated refactoring into this hotfix.
```

---

# 16. Database Change Add-On

```text
This task changes PostgreSQL schema.

Queue:

Type includes DATABASE

Record:

- migration name
- data migration requirement
- backward compatibility
- staging result
- rollback implications

Update:
- Prisma schema
- migration
- 08_DATA_MODEL.md
- 17_CHANGELOG.md
- 24_CHANGE_QUEUE.md
```

---

# 17. Deployment Change Add-On

```text
This task changes deployment/infrastructure.

Queue:

Type: INFRA or DEPLOYMENT

Read:
- 21_DEPLOYMENT_ARCHITECTURE.md

Record:
- service affected
- secret changes
- DNS changes
- downtime risk
- deployment sequence
- rollback
- monitoring verification
```

---

# 18. Documentation-Only Change

For meaningful docs work:

```text
Type: DOCUMENTATION
```

Still record:
- purpose,
- docs changed,
- contradictions removed,
- architecture implications.

Do not create queue entries for trivial typo-only corrections.

---

# 19. Queue Quality Rule

The agent must not write useless entries like:

```text
Changed some files.
Testing done.
```

Entries should make the task understandable without opening the code.

A good entry should answer:

```text
What?
Why?
Where?
How?
Tested?
Released?
Risk?
Next?
```

---

# 20. Queue Consistency Check

Before finishing any task, the agent should verify:

- queue status matches reality,
- branch/PR references are correct,
- docs list is correct,
- no duplicate CHG entry exists,
- completed items are in correct section,
- open follow-ups are visible.

---

# 21. Handoff Prompt

When handing work to another developer/agent:

```text
Before continuing this task:

Read the linked CHG entry in `docs/24_CHANGE_QUEUE.md`.

Treat it as the current operational state.

Confirm:

- current branch
- completed work
- pending work
- blockers
- tests run
- staging state
- next action

Do not restart or duplicate already-completed work.
```

---

# 22. Review Prompt

For code review:

```text
Read the PR and corresponding CHG entry.

Check whether:

- implementation matches requested outcome,
- queue scope matches code diff,
- DB/API/state changes are documented,
- tests listed were actually added/run,
- risks are accurate,
- relevant docs changed,
- queue status is truthful.

Report any mismatch between code and queue.
```

---

# 23. Final Rule

For Pizza Avenue:

```text
No meaningful code change exists without a queue entry.

No queue entry is complete without implementation truth.

No production change is complete until the queue records the final result.
```
