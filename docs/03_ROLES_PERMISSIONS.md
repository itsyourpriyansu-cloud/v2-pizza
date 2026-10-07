# 03 — Roles & Permissions

## Roles
Customer, Waiter, Kitchen, Counter/Admin, Manager, Founder.

| Capability | Customer | Waiter | Kitchen | Counter/Admin | Manager | Founder |
|---|---|---|---|---|---|---|
| Browse | Yes | Optional | Optional | Optional | Yes | Yes |
| Create own order | Yes | Assist Dine-in | No | Assist | Yes | Yes |
| View own order | Yes | Assigned tables | No | All | All | All |
| View KDS | No | Ready-to-Serve only | Yes | Limited | Yes | Yes |
| Mark preparing | No | No | Yes | No | Yes | Yes |
| Mark ready | No | No | Yes | No | Yes | Yes |
| Mark fulfilment | No | Served only | Optional | Pickup | Yes | Yes |
| Confirm Dine-in request | No | Yes | No | Policy | Yes | Yes |
| Finalize/settle table bill | No | No | No | Yes | Yes | Yes |
| Mark sold out | No | No | Yes | No | Yes | Yes |
| Edit menu | No | No | No | No | Policy | Yes |
| Edit price | No | No | No | No | Policy | Yes |
| Change capacity | No | No | No | No | Yes | Yes |
| Refund | No | No | No | Policy | Policy | Yes |
| Promotions | No | No | No | No | Policy | Yes |
| Loyalty config | No | No | No | No | Policy | Yes |
| Staff management | No | No | No | No | Limited | Yes |
| Analytics | Own history | Assigned ops | Ops only | Billing ops | Yes | Yes |
| Audit log | No | Own actions | No | Billing actions | Limited | Yes |
| View auth audit | Own session activity only | No | No | No | Policy | Yes |
| Manage QR sources | No | No | No | No | Policy | Yes |
| View QR acquisition analytics | No | No | No | No | Yes | Yes |
| Manage messaging templates | No | No | No | No | Policy | Yes |

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
- confirm_dine_in_order
- mark_dine_in_served
- finalize_table_bill
- record_table_payment
- close_table_session

## Rules
- UI hiding is not authorization.
- Customer can only access own records.
- Store scope is enforced.
- Staff deactivation revokes session.
- Sensitive actions are audited.
- Auth audit views must minimize phone/PII exposure and never reveal OTPs, raw magic tokens, session secrets or WhatsApp access tokens.
- Managing a QR source changes attribution/availability only; it cannot create an authenticated identity.
- Provider template approval and provider credentials remain separate concerns; no dashboard role receives raw production secrets.
- Waiter can confirm/reject/clarify assigned Dine-in requests and mark Served, but cannot record payment, mark a bill paid, grant unrestricted discounts/refunds or alter loyalty.
- Multiple customers may share table-session operations, never private account data. Loyalty identity requires an existing authenticated session, OTP or verified WhatsApp identity.
