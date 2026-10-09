# 07 — Components

## Application-owned foundations

Landing, Customer, Admin and KDS each own their token and CSS foundation inside `apps/<app>/src/design-system/`. Every custom property carries that app's prefix. No application imports design-system CSS or public assets from another application.

`@pizza-avenue/ui` remains a CSS-free structural package. `AppShell` provides the semantic application frame: Pizza Avenue wordmark content, surface label, primary navigation and main landmark. Each app's local foundation owns its presentation. Customer may supply its own compact commerce header and bottom navigation; Admin presents the shell as a desktop sidebar; KDS presents it as a high-contrast kitchen header. Active navigation uses `aria-current="page"`.

`RoutePlaceholder`, `RoutePending` and `RouteError` provide consistent headings and state semantics for incomplete modules. They must not contain domain decisions or mask unavailable backend behavior.

Shared React primitives own stable semantics and interaction structure. App-local foundations own visual behavior. Feature components own pricing, service mode, permissions and state-machine meaning.

## ProductCard
Variants: default, bestseller, unavailable, passport, favourite, previous-order.
Data: image, title, description, price, badge, availability.

## PizzaBuilder
VariantSelector + ModifierGroup + Quantity + StickyPriceCTA.

## ModifierGroup
Required/optional, min/max, options, price delta, validation.

## CartItem
Snapshot, variant, modifiers, quantity, price, edit/remove.

## UpsellCard
Product + incremental price + explicit add.
Never auto-add.

## Customer Home compositions
`ServiceEntry` presents Pickup and Dine-in as distinct service paths inside an image-led entry composition. Its visual chapter establishes appetite; the raised choice surface then shows both service paths, current Pickup state/ETA, the trusted table-QR handoff and location reassurance. It never accepts a typed table number.

`StoreContextBar` keeps the selected store/mode promise visible. `NewCustomerHero`, `CravingRoutes`, `BestSellers` and `TasteDiscovery` reduce first-order choice load through an image-led hero, labelled menu search, compact category rail and current seed-backed products. `UsualOrderCard` revalidates a historical order against the current menu and price before rebuilding the cart. `CompleteMealCard` and `MealCompleters` make optional additions explicit and never preselect paid items.

`ActivePickupHome` and `ActiveDineInHome` are operational compositions. They precede and suppress adaptive retention content. The Dine-in composition exposes only table-relevant actions such as Order More, Current Bill and Call Waiter, and suppresses Pickup-oriented bottom navigation while the trusted table context is active.

## PickupSlot
Available / selected / nearly full / unavailable.

## OrderStatus
Pickup: Confirmed / Preparing / Ready for Pickup / Picked Up.

Dine-in: Waiting for Waiter / Needs Clarification / Accepted / Preparing / Ready to Serve / Served.

On reconnect, fetch current API state; a socket message alone never becomes the rendered source of truth.

## RewardCard
Locked / unlocked / applied / unavailable.

## LoyaltyProgress
Points + next reward + progress.

## PassportGrid
Required items + completed + milestones.

## KDS OrderTicket
Order no, service mode, promised Pickup time or Dine-in table/round/waiter, elapsed, items, modifiers and state action.

## Dine-in Customer
`ServiceModeSelector`, `TableQrScanner`, `TableQrResolver`, `TableContextBanner`, `DineInOrderReview`, `WaiterConfirmationStatus`, `TableRoundList`, `CurrentTableBill`, `BillRequestAction`, `ServiceRequestAction`.

`TableQrScanner` is permission-first and has Idle, Starting, Scanning, Invalid-content and Camera-error states. It requests the environment-facing camera only after an explicit customer action, decodes locally, accepts only a `/dine-in/start?t=<opaque_token>` link shape, never follows the scanned host, stops camera tracks on close/unmount/success and hands the token to `TableQrResolver`. It never accepts a typed table number.

## Waiter
`WaiterDashboard`, `OrderRequestCard`, `OrderRequestDetail`, `ActiveTableCard`, `TableSessionDetail`, `ReadyToServeQueue`, `ServiceRequestQueue`, `BillRequestQueue`.

## Admin Billing
`OpenBillList`, `TableBillDetail`, `LoyaltyAttributionSummary`, `BillFinalizationGuard`, `PaymentMethodControl`, `PaymentOutcome`, `SessionCloseAction`.

## AvailabilityToggle
Product/variant/modifier. Must audit.

## KPI Card
Only actionable KPIs such as GMV, AOV, repeat, attach, prep, pickup delay.

## AuthContinueCard
Explains the QR → WhatsApp handoff, official sender expectation and next action. States: awaiting send, awaiting reply, link ready/opened, provider delay and fallback to phone OTP. It never displays or stores the raw token.

## MagicLinkExpired
Neutral invalid/expired/already-used state with actions to restart through the official WhatsApp flow or use phone OTP. It must not disclose whether a phone number/customer exists.

## LoginMethod
Use only where the UX genuinely offers both paths. It presents phone OTP and “Continue with WhatsApp” as routes into one account, not separate account types.

## QRCodeCampaignCard
Founder/Admin component showing source code, store, placement, campaign, active state and funnel metrics. Activation changes are permission-protected and audited. The component never embeds credentials; export/print uses the server-owned redirect URL.

## Customer retention components
`PointsBalanceCard`, `RewardCard`, `PassportProgressCard`, `MissionCard`, `XPBadge`, `RetentionLinkCard` and `ProfileSection` are shared across the Customer retention routes. They render API-owned balances and states; buttons request typed mutations but never calculate or finalize Points, XP, reward consumption or Passport completion in the browser.

## Customer engagement components
`SavedBasketSummary`, `SavedBasketDetail`, `BasketRevalidationNotice`, `HouseholdMemberForm`, `OccasionCard`, `ReferralProgress`, `TasteCard`, `LeagueProgress`, `Leaderboard`, `GroupParticipantCard`, `GroupPoll` and `HostCheckoutHandoff` are Customer compositions built from existing primitives.

Family Basket reuses the Saved Basket contract. Group checkout and Occasion planning produce the existing typed Cart rather than a second checkout engine. Progress, poll and leaderboard states use text and semantics in addition to colour; public/share surfaces receive privacy-filtered contracts only.
