# 20 — Master Index

## Product definition
00 Project Context
01 Product Scope
02 Business Rules

## People / flow
03 Roles & Permissions
04 User Flows
05 Information Architecture

## UX
06 Design System
07 Components

## Engineering
08 Data Model
09 State Machines
10 API Contracts
11 Integrations

Backend stack and deployment decisions are frozen in 16; execution/topology lives in 15.

## Measurement / QA
12 Analytics
13 Seed Data
14 Test Plan

## Execution
15 Build Plan
16 Decisions
17 Changelog
18 Acceptance Criteria
19 Founder Workshop

## Deployment and engineering governance
21 Deployment Architecture
22 Git & GitHub Development Workflow Rules
23 Coding Agent Prompting Guide
24 Pizza Avenue Change Queue
25 Change Queue Agent Rules & Default Coding Prompt

Documents 22–25 are mandatory process controls, not optional reading. Every meaningful implementation must have a truthful queue entry and follow the documented branch/PR workflow.

## Prototype reading sequence
AGENTS → 20 → 22 → 23 → 24 → 25 → 00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 13.

## Backend reading sequence
AGENTS → 20 → 22 → 23 → 24 → 25 → 02 → 03 → 08 → 09 → 10 → 11 → 14 → 18.

## Authentication reading sequence
AGENTS → 01 scope → 02 identity/session rules → 04 OTP and QR/WhatsApp flows → 05 entry/state IA → 08 auth data → 09 token states → 10 auth/webhook contracts → 11 provider boundaries → 12 funnel analytics → 14 security/E2E → 16 decisions → 18 acceptance.

## WhatsApp / QR reading sequence
00 acquisition context → 04 end-to-end flow → 06 signage/continuation UX → 07 auth/admin components → 08 identities/tokens/QR sources → 10 QR/webhook/consume endpoints → 11 WhatsAppProvider/WhatsAppAuthService → 12 funnel → 19 founder questions.

## Deployment reading sequence
AGENTS/README summary → 20 → 22 → 23 → 24 → 25 → 15 Hostinger/Docker/Caddy/backups/portability → 16 DEC-013 through DEC-017 and DEC-021 → 21 deployment source of truth → 14 reliability tests → 18 production acceptance.

## Backend architecture reading sequence
AGENTS → 02 transactional rules → 08 Prisma/PostgreSQL model → 09 canonical states/outbox → 10 REST/WebSocket recovery contracts → 11 adapters/BullMQ → 15 monorepo/deployment → 16 decisions.

## Founder meeting sequence
00 → 01 → 02 → 19 → 16.

## Every coding task sequence
AGENTS → 20 Master Index → 22 Git/GitHub Workflow → 23 Coding Agent Guide → 24 existing queue state → 25 queue rules → task-relevant product/engineering docs → current code.
