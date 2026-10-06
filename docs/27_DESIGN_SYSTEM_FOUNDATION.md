# 27 — Design System Foundation

> **Status:** Design foundation for review. Brand palette, typography families, identity direction and surface separation are frozen; implementation details remain recommended or exploratory as labelled.
>
> **Scope:** Documentation only. This document does not create production tokens, components, layouts, motion or a logo.

## 1. Purpose

This document defines a shared Pizza Avenue design language for four distinct product surfaces:

- Landing / Marketing,
- Customer ordering PWA,
- Kitchen/KDS,
- Founder/Admin.

The system should make those surfaces feel related without making them structurally identical. Brand consistency comes from colour roles, typography, imagery principles, primitive behaviour, spacing logic and a restrained shape language. Composition remains specific to each surface.

`docs/06_DESIGN_SYSTEM.md` remains the high-level interaction baseline. This document is the current source for brand foundations, semantic visual guidance and component-layering rules. `docs/28_UI_VISUAL_DIRECTION.md` owns mood, references, Landing rhythm, imagery direction and preliminary content.

## 2. Brand Personality

Pizza Avenue combines:

**Italian editorial + modern neighbourhood pizzeria + warm craft + digital convenience.**

Target qualities:

- warm,
- earthy,
- cultured,
- handcrafted,
- bold,
- edible,
- welcoming,
- slightly nostalgic,
- modern,
- confident,
- non-corporate.

The experience is premium-casual rather than luxury-stiff. Food leads. Technology supports ordering clarity and operational confidence without looking like generic SaaS software.

## 3. Frozen vs Recommended vs Exploratory

### FROZEN

- The official brand palette is exactly the seven colours in Reference 01.
- Phudu is the primary display/heading typeface.
- Poppins is the secondary body/functional UI typeface.
- The identity direction is Italian editorial, warm craft and modern neighbourhood pizzeria.
- Landing and application composition layers remain separate.
- Customer, KDS and Admin share primitives and tokens without being forced into identical cards or layouts.
- No logo or logo mark is assumed until an actual approved logo asset is supplied.
- Reference screenshots guide principles; they are not screens to reproduce.

### RECOMMENDED

- Semantic colour roles and distribution.
- Type-role ranges and responsive scaling.
- Spacing scale and density modes.
- Subtle-to-medium radii.
- Warm borders, tonal separation and controlled elevation.
- Lucide-style clear functional iconography, subject to implementation review.
- Editorial Landing rhythm and restrained motion philosophy.
- The layered component strategy in this document.

### EXPLORATORY

- Exact Landing section order.
- Hero composition and crop.
- Decorative line art, stamps, paper texture and handwritten accents.
- Exact type sizes, line heights and tracking.
- Exact image aspect ratios and responsive art direction.
- Exact card compositions and surface proportions.
- Motion choreography.
- Whether a future `ui-brand` package is needed in addition to the existing neutral `packages/ui`.

## 4. Official Colour Palette

Reference 01 is the only source of brand colours. Other references must not contribute new brand colours.

| Colour | Hex | Intended role |
|---|---:|---|
| Cream | `#FDF6E9` | Dominant canvas; warm, clean background |
| Sand Beige | `#EADCC8` | Secondary surface, section background, soft card |
| Maroon | `#6B1F1F` | Primary brand emphasis, primary action, important heading |
| Italian Brown | `#8C4A2F` | Supporting warm editorial/food accent |
| Olive Green | `#556B2F` | Natural accent, vegetarian/fresh cue, controlled secondary action |
| Sage Green | `#A7B58B` | Muted natural surface, subtle label/background |
| Espresso | `#3B2F2A` | Primary text, high-contrast dark surface, premium grounding |

Colour hierarchy:

`Cream → Espresso → Maroon → Sand Beige → Olive → Italian Brown → Sage`

This hierarchy prevents the interface from looking like a seven-colour dashboard. Sage, Olive and Brown are accents, not competing primary colours.

Status colours required for errors, warnings or success are semantic utilities, not additions to the brand palette. Define them later through an accessibility review and keep them restrained.

## 5. Semantic Colour Mapping

Semantic names control usage. Raw palette names should not become an unrestricted colour picker.

| Semantic token recommendation | Palette mapping | Usage guidance |
|---|---|---|
| `background.canvas` | Cream | Default Landing and Customer canvas |
| `background.soft` | Sand Beige | Alternating sections, secondary cards, form grouping |
| `background.natural` | Sage Green | Quiet natural highlight; avoid dense text |
| `background.dark` | Espresso | Dark editorial panels, footer, high-contrast operational framing |
| `text.primary` | Espresso | Default text |
| `text.secondary` | Espresso at reduced emphasis | Prefer opacity/tone handling over inventing grey brand colours |
| `text.inverse` | Cream | Text on Espresso, Maroon or Olive where contrast passes |
| `text.brand` | Maroon | Short emphasis and selected editorial headings |
| `brand.primary` | Maroon | Primary identity and action |
| `brand.secondary` | Italian Brown | Warm secondary emphasis |
| `brand.natural` | Olive Green | Natural/vegetarian/fresh cue |
| `border.soft` | Espresso with low opacity | Warm quiet dividers |
| `border.strong` | Espresso | Focused separation and operational boundaries |
| `action.primary` | Maroon with Cream text | Main CTA |
| `action.secondary` | Olive with Cream text, or Cream with Olive border | Controlled secondary action |
| `action.ghost` | Transparent with Espresso text | Low-priority action |
| `focus.ring` | Espresso or Maroon with adequate offset | Visible keyboard focus |

Measured contrast examples:

- Espresso on Cream: approximately `12.01:1`.
- Maroon on Cream: approximately `10.61:1`.
- Italian Brown on Cream: approximately `6.23:1`.
- Olive on Cream: approximately `5.53:1`.
- Espresso on Sand Beige: approximately `9.58:1`.
- Maroon on Sand Beige: approximately `8.46:1`.
- Espresso on Sage: approximately `5.92:1`.

Olive on Sand Beige is approximately `4.41:1`, so it should not be the default small-text pairing. Italian Brown on Sage is approximately `3.07:1` and is suitable only for large display treatment when otherwise verified. Change usage, weight or background rather than changing the official palette.

## 6. Typography

### Phudu — display/heading

Use Phudu for:

- Landing hero headlines,
- major display headings,
- strong editorial section headings,
- short brand statements,
- selected product storytelling,
- editorial quotes,
- large promotional numbers or phrases when appropriate.

Phudu carries the bold, condensed and recognisable display character already established in the primary Pizza Wave application. Use its verified 600 and 700 weights. It is not the default for paragraphs, form help, dense labels or long operational copy.

### Poppins — body/functional UI

Use Poppins for:

- navigation,
- body copy,
- prices,
- buttons,
- labels,
- forms,
- cart and checkout information,
- metadata,
- Customer operational UI,
- nearly all KDS and Admin content.

Poppins provides friendly geometric clarity across commerce and operational interfaces. Use the verified 400, 500, 600 and 700 weights.

The source audit is `pizza_wave_v1/src/main.tsx` plus `src/styles/tokens.css`: `@fontsource/phudu` at 600/700 and `@fontsource/poppins` at 400/500/600/700, exposed as `--font-display` and `--font-body`. The bakery experiment's Lilita One/Outfit pair is unrelated and must not be adopted. Package versions, subset selection, preloading and fallback metrics remain implementation decisions. Avoid layout shifts and do not load unused weights.

## 7. Typography Roles

Ranges are guidance, not fixed production tokens.

| Role | Family | Recommended responsive direction | Typical use |
|---|---|---|---|
| Display XL | Phudu 700 | roughly 48–72px mobile; 72–112px desktop | Landing hero only; usually 2–3 lines maximum |
| Display L | Phudu 700 | roughly 40–56px mobile; 56–80px desktop | Major Landing chapter |
| Heading 1 | Phudu 700 | roughly 34–48px | Page or feature title |
| Heading 2 | Phudu 600/700 | roughly 28–40px | Section title |
| Heading 3 | Phudu 600 or Poppins 700 by density | roughly 22–30px | Card group or product story |
| Editorial Quote | Phudu 600 | roughly 28–56px | Short social proof or brand statement |
| Product Title | Phudu 600 or Poppins 700 by density | roughly 18–28px | Product card/detail |
| Body L | Poppins 400/500 | roughly 17–20px | Introductory copy |
| Body | Poppins 400 | roughly 15–18px | Default copy |
| Body S | Poppins 400/500 | roughly 13–15px | Supporting copy |
| Price L | Phudu 700 or Poppins 700 by context | roughly 24–36px | Product detail or totals |
| Price | Poppins 700 | roughly 15–20px | Product card and cart |
| Label | Poppins 500/600 | roughly 12–14px | Forms and metadata |
| Navigation | Poppins 600 | roughly 13–16px | Header and app navigation |
| Button | Poppins 600/700 | roughly 14–17px | Actions |
| Caption | Poppins 400/500 | roughly 11–13px | Low-emphasis metadata |
| Overline | Poppins 600/700, restrained tracking | roughly 11–13px | Short category/editorial cue only |

Principles:

- Keep major Landing headlines wide and concise; avoid narrow six-line text walls.
- Mobile layouts recompose and reduce scale rather than clipping or merely shrinking desktop composition.
- Prices and modifiers prioritize legibility over editorial expression.
- KDS uses large, high-contrast Poppins with selective Phudu numbers/headings where scanning improves.
- Admin uses a consistent Poppins hierarchy with selective Phudu metrics and compact but accessible density.
- Avoid fake section labels such as “SECTION 01” when they add no customer meaning.

## 8. Spacing Philosophy

Recommended base scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

Guidance:

- Customer mobile horizontal padding generally begins around 16px and may grow on larger breakpoints.
- Landing chapters use generous vertical space and distinct pacing.
- KDS uses larger control spacing and touch targets without wasting ticket density.
- Admin uses compact grouping, consistent table rhythm and clear separation between controls and results.
- Related controls sit closer together than unrelated sections.
- Avoid making every content block a detached padded card.

## 9. Layout and Grid Philosophy

### Landing

- Wide editorial canvas with controlled asymmetry.
- Food imagery may crop into or enter from viewport edges.
- Alternate high-intensity and quiet sections.
- Use a responsive grid as structure, not as a visible dashboard.
- Product grids may be regular; story and gallery sections should vary composition.

### Customer

- Mobile-first and action-first.
- Predictable bottom navigation and checkout progression.
- Persistent cart/action affordances only where they reduce friction.
- Content width and hierarchy should make product, price, pickup promise and action obvious.

### KDS

- Tablet/desktop-first.
- Large actions, elapsed/promise timing and modifiers must scan at distance.
- Operational columns may be dense but cannot sacrifice state clarity.

### Admin

- Desktop/tablet-first.
- Stable navigation, filters, tables and side panels.
- Data density is deliberate; use whitespace to group rather than decorate.

## 10. Radius Philosophy

The brand should not look like a generic bubbly SaaS application.

Recommended ranges:

- 4–8px: editorial frames, menus, table surfaces and sharp image blocks.
- 8–14px: inputs, compact cards and operational controls.
- 12–20px: Customer commerce cards and sheets where softness helps touch UI.
- 20–28px: rare expressive feature cards after visual exploration.
- Full pills: only chips, tags, compact status or genuinely pill-shaped controls.

Buttons should not default to extreme pills. Radius should communicate hierarchy and context rather than apply one silhouette everywhere.

## 11. Borders and Elevation

Prefer:

- thin warm borders,
- Espresso-tinted dividers at low opacity,
- surface contrast,
- restrained short shadows,
- occasional image overlap in editorial compositions.

Avoid:

- heavy floating dashboard shadows,
- glow,
- glass blur,
- translucent card stacks,
- elevation on every card.

Operational surfaces should rely more on border, state and layout than shadow.

## 12. Iconography

Functional icons should be simple, consistent and immediately readable. The existing repository direction names Lucide; it is not installed in the Stage 1 workspace yet, so dependency adoption remains an implementation decision.

Guidance:

- use icons to reinforce, not replace, important labels,
- use one family per surface,
- keep stroke weight consistent,
- give KDS actions unmistakable labels and large hit areas,
- avoid decorative icon clouds,
- reserve custom branded pictograms until the logo/illustration language is approved.

No current Pizza Wave logo or “wave” loyalty icon is part of the Pizza Avenue identity.

## 13. Imagery

Food photography is a primary design element.

Recommended principles:

- high resolution,
- warm directional lighting,
- visible crust, cheese and ingredient texture,
- believable ingredients and portions,
- strong editorial crops,
- controlled edge cropping,
- warm neutral surfaces,
- no baked-in text, labels or watermarks,
- no other restaurant’s packaging or signage,
- avoid synthetic gloss and impossible AI-perfect food.

Candidate ratios remain flexible:

- product grid: near-square or 4:3,
- hero: large landscape/editorial crop with mobile art direction,
- product detail: large feature image,
- gallery: mixed editorial grid.

The curated Pizza Wave candidates under `docs/assets/pizza-wave-candidates` are design-source material only. They require founder approval, provenance confirmation, content matching, responsive derivatives and production optimization before application use.

## 14. Decorative Graphics

Exploratory secondary devices:

- thin ingredient or food line art,
- restrained stamp/circular motifs,
- subtle paper/menu texture,
- olive branch or ingredient references,
- editorial labels,
- very limited handwritten accents,
- small Maroon/Olive/Cream Italian references.

These devices must support food, never compete with it. They cannot invent a logo.

## 15. Motion

Motion is documented here but not implemented in this task.

### Landing

- controlled editorial text reveals,
- deliberate food-image entrance,
- subtle image parallax,
- restrained marquee/micro movement,
- scroll-led transitions only when they preserve reading and reduced-motion support.

### Customer

- fast selection feedback,
- add-to-cart confirmation,
- quantity and bottom-sheet transitions,
- reward unlock,
- order-state continuity.

### KDS/Admin

- functional state feedback,
- no ambient motion,
- no animation that hides or delays an operational action.

Avoid constant motion, excessive bounce, cursor gimmicks, scroll hijacking and anything that slows ordering. Reduced-motion behaviour is mandatory.

## 16. Accessibility

Minimum expectations:

- WCAG contrast verified for actual text size/weight,
- visible keyboard focus,
- at least 44px touch targets for Customer and large KDS controls,
- semantic labels and landmarks,
- no colour-only status,
- price deltas and required modifiers expressed in text,
- error messages explain what happened and what to do next,
- keyboard-friendly Admin UI,
- responsive zoom and text resizing,
- reduced-motion support,
- meaningful image alt text; decorative imagery uses empty alt text,
- charts/tables expose equivalent text and status.

When a palette pairing fails, change its usage rather than altering the official colour.

## 17. Responsive Principles

- Landing desktop may be expressive, asymmetric and editorial.
- Landing mobile must recompose; it must not simply shrink the desktop poster.
- Customer is mobile-first with progressive enhancement for larger screens.
- KDS is tablet/desktop-first and optimized for distance and touch.
- Admin is desktop/tablet-first with sensible narrow-screen fallback.
- Headline measure, image crop, navigation and CTA placement require breakpoint-specific decisions.
- Maintain safe areas for mobile bottom navigation and sticky actions.

## 18. Core Shared Primitives

Potentially shared behaviour-level primitives:

- Button,
- IconButton,
- TextInput,
- OTPInput,
- Checkbox,
- Radio,
- Switch,
- Badge,
- Divider,
- Surface,
- Modal,
- Sheet,
- Toast,
- Skeleton,
- Image,
- Price,
- StatusDot,
- QuantityStepper.

The current `packages/ui` remains the neutral core. Do not create `ui-core` beside it merely to match a conceptual diagram. A future `ui-brand` layer is justified only when multiple apps need the same branded primitive and the split avoids, rather than creates, duplication.

## 19. Landing Components

Landing-specific compositions may include:

- `HeroComposition`,
- `EditorialSectionHeader`,
- `SignaturePizzaFeature`,
- `StoryBlock`,
- `GalleryGrid`,
- `StoreVisitBlock`,
- `EditorialQuote`,
- `PromoMarquee`,
- `LargeCTA`,
- `BrandFooter`.

These belong to the `apps/landing` composition layer frozen by DEC-024. A Landing Hero must not become a Customer, KDS or Admin shared component.

## 20. Customer App Components

Customer-specific compositions may include:

- `ProductCard`,
- `CategoryTabs`,
- `PizzaBuilder`,
- `ModifierGroup`,
- `CartItem`,
- `QuantityStepper`,
- `PickupSlot`,
- `OrderTimeline`,
- `RewardCard`,
- `PassportProgress`,
- `BottomNavigation`,
- `FloatingCartAction`.

These prioritize price, availability, modifier clarity, pickup promise and a single obvious next action.

## 21. KDS/Admin Differences

### KDS

- primarily Poppins, with Phudu limited to large ticket numbers, timers or headings,
- large controls and numbers,
- high information contrast,
- mode-eligible operational truth only: paid Pickup or waiter-confirmed Dine-in,
- no decorative imagery in the primary queue,
- state and time never rely on colour alone.

### Admin

- primarily Poppins, with Phudu limited to major headings or KPI values,
- compact but readable data layouts,
- permission-aware actions,
- explicit destructive confirmation,
- audit visibility,
- restrained brand expression.

KDS tickets and Admin KPI cards should not dictate Customer or Landing card design.

## 22. Component Reuse Rules

Layering model:

```text
Official brand foundation
├── colour roles
├── Phudu + Poppins
├── imagery principles
└── neutral interaction primitives
    ├── Landing compositions
    ├── Customer commerce compositions
    ├── KDS operational compositions
    └── Admin management compositions
```

Rules:

1. Share stable interaction behaviour before sharing visual composition.
2. Keep domain behaviour in feature/domain modules, not visual packages.
3. Allow surface-specific variants only when the behaviour remains clear.
4. Do not import app-specific compositions across applications.
5. Do not duplicate an existing primitive without documenting why extension is unsafe.
6. Do not port legacy component code until its domain assumptions match V1 rules.

## 23. Existing App Reuse Strategy

The current repository and legacy `pizza_wave_v1` implementation were audited. “Reusable” means a later implementation should evaluate and adapt the logic; it does not authorize copying obsolete domain rules or styles.

| Component/pattern | Current location | Reusable logic? | Reusable visual style? | Future action |
|---|---|---:|---:|---|
| `AppShell` | `packages/ui/src/index.tsx` | Yes | Partial | Keep neutral shell; extend deliberately |
| `RoutePending` / `RouteError` | `packages/ui/src/index.tsx` | Yes | No | Keep semantics; redesign presentation later |
| Buttons / `IconButton` | legacy `src/shared/components/index.tsx` | Yes | No | Reuse prop/semantic approach; apply new brand |
| `QuantityStepper` | legacy shared components | Yes | Partial | Reuse accessible labelled behaviour; restyle |
| `TextInput` / `OTPInput` | legacy shared components | Yes | No | Reuse label/id/input behaviour after auth review |
| `SegmentedControl`, `RadioCard`, `CheckboxRow`, `Switch` | legacy shared components | Yes | No | Port selectively with keyboard/focus verification |
| `BottomSheet`, `CenterDialog`, `Drawer` | legacy shared components | Partial | No | Reuse native-dialog direction; harden focus/inert/scroll behaviour |
| Skeleton/empty/error states | legacy shared components | Yes | No | Keep state model; replace “Wave” styling/copy |
| Floating cart action | legacy shared components | Partial | No | Reuse visibility/feedback logic after Customer IA review |
| `ProductCard` | legacy `features/product/components` | Partial | No | Reuse add/stepper/customize state logic; map to new contracts |
| `ModifierGroupControl` | legacy product feature | Yes | No | Reuse selection semantics after matching current types/rules |
| Customer bottom navigation | legacy Customer layout | Partial | No | Reuse navigation behaviour only; remove delivery/Puri/Wave assumptions |
| Fulfilment sheet | legacy Customer components | Partial | No | Reuse sheet/radio pattern only; remove delivery completely for V1 |
| KDS queue/ticket/action patterns | legacy KDS pages | Partial | No | Reuse scanning/action lessons; align to `CONFIRMED → PREPARING → READY_FOR_PICKUP/READY_TO_SERVE` |
| KDS temporary availability pattern | legacy KDS availability page | Partial | No | Reuse search/duration interaction after permission/API review |
| Checkout progress | legacy Customer checkout | Partial | No | Reuse step clarity; remove delivery/address/PhonePe assumptions |
| Pizza Wave food images | legacy `public/assets` | Partial | Partial | Use curated candidates only; validate content/provenance and optimize |
| Pizza Wave typography variables/imports | legacy `src/main.tsx`, `src/styles/tokens.css` | Yes | Yes | Retain Phudu 600/700 and Poppins 400/500/600/700; do not copy legacy colours |
| Pizza Wave logo/loyalty art | legacy `public/assets/brand`, `loyalty` | No | No | Explicitly reject; not Pizza Avenue identity |

Legacy code must not be copied wholesale. It contains delivery, Puri/Grand Road, Wave loyalty, PhonePe, FastAPI-era and old-brand assumptions that conflict with the current repository.

## 24. Anti-Patterns

Avoid:

- seven colours competing on one screen,
- generic red/yellow fast-food styling,
- bright blue, purple, cyan or neon accents,
- SaaS gradients and glassmorphism,
- giant rounded dashboard containers,
- pills for ordinary buttons/cards,
- identical card grids in every Landing section,
- heavy shadows and glowing effects,
- narrow multi-line hero walls,
- decorative motifs over food readability,
- hidden modifier prices,
- optimistic payment/order success,
- logo invention,
- using Reference 02/04 colours,
- copying the old Pizza Wave palette, layout or brand system beyond the explicitly approved typography and curated image candidates,
- carrying delivery or Puri assumptions into Pickup/Dine-in Sainikpuri V1.

## 25. Open Design Questions

- What is the approved Pizza Avenue logo/wordmark asset?
- Should production self-host the verified Fontsource files, and which script subsets/preload strategy will minimize layout shift?
- Which Pizza Wave candidate images have acceptable provenance and founder approval?
- Which menu items and prices from Reference 03 are accurate production truth?
- What real store photography, staff photography and Sainikpuri exterior/interior imagery is available?
- Which semantic utility colours will represent success, warning, danger and information while preserving accessibility?
- How much handwritten accent or line art survives the first high-fidelity exploration?
- Which Landing sections are essential for the first release versus later content?
- Does a separate `ui-brand` package reduce duplication after the first two branded surfaces exist?
- What image CDN/derivative pipeline will generate AVIF/WebP and responsive sizes?

The next design task should answer these questions through a limited high-fidelity exploration rather than freezing them abstractly.
