# 03 — Roles & Permissions

## Roles
Customer, Kitchen, Counter, Manager, Founder.

| Capability | Customer | Kitchen | Counter | Manager | Founder |
|---|---|---|---|---|---|
| Browse | Yes | Optional | Optional | Yes | Yes |
| Create own order | Yes | No | Assist | Yes | Yes |
| View own order | Yes | No | No | All | All |
| View KDS | No | Yes | Limited | Yes | Yes |
| Mark preparing | No | Yes | No | Yes | Yes |
| Mark ready | No | Yes | No | Yes | Yes |
| Mark pickup | No | Optional | Yes | Yes | Yes |
| Mark sold out | No | Yes | No | Yes | Yes |
| Edit menu | No | No | No | Policy | Yes |
| Edit price | No | No | No | Policy | Yes |
| Change capacity | No | No | No | Yes | Yes |
| Refund | No | No | No | Policy | Yes |
| Promotions | No | No | No | Policy | Yes |
| Loyalty config | No | No | No | Policy | Yes |
| Staff management | No | No | No | Limited | Yes |
| Analytics | Own history | Ops only | No | Yes | Yes |
| Audit log | No | No | No | Limited | Yes |
| View auth audit | Own session activity only | No | No | Policy | Yes |
| Manage QR sources | No | No | No | Policy | Yes |
| View QR acquisition analytics | No | No | No | Yes | Yes |
| Manage messaging templates | No | No | No | Policy | Yes |

## Sensitive permissions
Keep separate:
- refund_order
- change_price
- manage_promotions
- manage_loyalty
- manage_staff
- change_store_state
- view_auth_audit
- manage_qr_sources
- view_qr_acquisition_analytics
- manage_messaging_templates

## Rules
- UI hiding is not authorization.
- Customer can only access own records.
- Store scope is enforced.
- Staff deactivation revokes session.
- Sensitive actions are audited.
- Auth audit views must minimize phone/PII exposure and never reveal OTPs, raw magic tokens, session secrets or WhatsApp access tokens.
- Managing a QR source changes attribution/availability only; it cannot create an authenticated identity.
- Provider template approval and provider credentials remain separate concerns; no dashboard role receives raw production secrets.
