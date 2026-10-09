# 28 — UI Visual Direction

> **Status:** Implemented visual direction. The integrated Landing is the canonical brand expression; this document governs how its language adapts across Customer, KDS and Admin. Logo and image provenance approvals remain separate.
>
> **Scope:** Landing and product-surface art direction, preliminary content extraction, and legacy-asset reuse guidance. Component and token foundations live in `docs/27_DESIGN_SYSTEM_FOUNDATION.md`.

## 1. Target Feeling

Pizza Avenue should feel like an Italian editorial menu translated into a modern neighbourhood ordering experience: warm, food-led, crafted, confident and easy to use.

The visual balance is:

- premium-casual, not luxury-stiff,
- appetising and expressive, not noisy,
- nostalgic in material cues, not retro-themed,
- contemporary in interaction, not generic SaaS,
- distinctly Pizza Avenue, not a copy of a reference brand.

## 2. Reference Breakdown

| Reference | Primary lesson | Secondary lesson | Authority | Must not be copied |
|---|---|---|---|---|
| 01 — Brand palette | Exact seven-colour palette | Editorial Italian warmth and food-forward material cues | **FROZEN** for colour only | Illustrated identity, wordmark, composition or implied logo |
| 02 — Landing hero | Immediate product focus and bold headline scale | Cropped food at frame edges and one clear action | **RECOMMENDED** principle | Brand, wording, navigation, colours, fonts and page geometry |
| 03 — Preliminary menu | Initial category/item inventory | Concise item descriptions and add-on grouping | **EXPLORATORY** until founder validation | Prices as authoritative data or photographed menu styling |
| 04 — Section rhythm | Alternating dense and quiet chapters | Product grids, editorial moments and varied image scale | **RECOMMENDED** principle | Bakery identity, orange/black palette, typography, card styling or exact section order |
| 05 — Food ordering mobile case study | Four-column mobile rhythm, appetite-led hierarchy, search/category discovery, compact product comparison and floating navigation | Clear offer and checkout emphasis | **RECOMMENDED** for Customer composition only | Cravk identity, orange/black/white palette, proprietary art/copy, delivery/map/address flows or exact screen geometry |

Local reference copies are stored under `docs/assets/design-references/` so future design work can trace the decisions to the supplied material.

## 3. Reference 01 — Take

- Use only these official brand colours: Cream `#FDF6E9`, Sand Beige `#EADCC8`, Maroon `#6B1F1F`, Italian Brown `#8C4A2F`, Olive Green `#556B2F`, Sage Green `#A7B58B` and Espresso `#3B2F2A`.
- Carry forward the warm editorial atmosphere, natural ingredient associations and premium-casual balance.
- Let Cream, food photography and Espresso establish the base; use Maroon and natural greens deliberately.
- Use Phudu for bold display expression and Poppins for functional clarity, matching the verified primary Pizza Wave application typography and the frozen direction in Document 27.

## 4. Reference 02 — Take

- Make the food proposition understandable above the fold.
- Use a short, wide headline with confident scale.
- Allow strong food photography to enter from or crop against the viewport edge.
- Keep the first action obvious and limit competing header actions.
- Preserve breathing room around the headline even when the hero is energetic.

## 5. Reference 03 — Take

- Treat the photographed menu as preliminary content research, not a production database.
- Preserve the clear category structure, short product naming and concise descriptions.
- Model add-ons independently from core products so future variants and modifier groups remain backend-contract-ready.
- Verify every name, ingredient, dietary classification, price, tax rule and availability with the founder before seed-data adoption.

## 6. Reference 04 — Take

- Alternate high-energy imagery/product sections with quieter editorial chapters.
- Vary composition while maintaining a consistent content grid and spacing logic.
- Use category discovery, product highlights, social proof, visit information and a closing action as distinct chapters.
- Let photography change scale across the page instead of repeating one card template throughout.

## 7. Explicitly Do Not Copy

- No reference logo, wordmark, stamp or monogram.
- No “Slice Life,” “Loafly,” “Wave,” or other third-party identity.
- No reference copy, slogans, category labels or navigation wording unless independently approved for Pizza Avenue.
- No orange/black bakery palette, pink canvas or palette additions from References 02–04.
- No exact hero, card, header, footer or page layout.
- No other restaurant's packaging, storefront signage or baked-in branding.
- No delivery, Puri, Grand Road, PhonePe or obsolete Pizza Wave assumptions.
- No logo placeholder that could be mistaken for an approved Pizza Avenue identity.

## 8. Landing Visual Language

The Landing surface should be the most expressive part of the system. Use an editorial grid, confident Phudu headlines, generous Cream space, bold food crops and a small number of Maroon actions. Sections may shift between Cream, Sand and occasional Espresso framing while maintaining strong text contrast.

Recommended character:

- concise story-led copy,
- full-bleed or edge-cropped food moments,
- controlled asymmetry,
- thin warm dividers,
- occasional menu-paper or ingredient-line references,
- a clear transition from desire to ordering or store visit.

The Landing page must still load quickly, remain keyboard accessible and recompose deliberately on mobile.

The current Landing implementation—not an external reference—is a visual reference for colour balance, Phudu/Poppins pairing, warm dividers, controlled elevation and confident action styling. Other surfaces may adapt these ingredients through their own tokens and assets; they do not import the Landing stylesheet, variables or public files.

## 9. Customer App Visual Language

The Customer application should feel related but more direct:

- Cream/Sand surfaces with Espresso information hierarchy,
- Poppins for scanning, prices, controls and checkout,
- Phudu reserved for strong category, product or story moments,
- visible price, availability, service-mode context, Pickup promise or Dine-in table/status, and next action,
- restrained product cards rather than decorative card stacks,
- consistent modifiers, quantities, validation and order-state feedback,
- mobile-first navigation with safe areas and accessible touch targets.

The application must never present client-calculated pricing or state as authoritative.

### Service entry and Home adaptation

The Customer entry and Home implementation applies Reference 05 as a composition study, not a visual clone:

- 20px mobile outer gutters, a four-column mental grid and a 24px major spacing cadence,
- one image-led appetite moment, followed by quiet decision surfaces and compact category discovery,
- strong Espresso framing and floating Home navigation translated through Pizza Avenue tokens,
- the reference orange role mapped to Maroon/Italian Brown, black mapped to Espresso, white mapped to Cream and pale grey mapped to Sand,
- existing Phudu/Poppins typography, current typed menu data and current service/operational priority retained,
- Phosphor iconography used consistently on the affected Customer layers.

Pickup/Dine-in selection remains explicit. A Dine-in choice still leads to the permission-first trusted table scanner; no map, delivery address, typed table number or unverified QR shortcut is introduced.

## 9A. KDS and Admin Adaptation

KDS uses an Espresso environment with Cream tickets, 48px-or-larger primary targets, Poppins-first metadata and tabular timers/order identifiers. Brand expression must never slow kitchen scanning.

Admin uses its own Cream/Espresso-oriented foundation with a responsive navigation rail, compact surfaces and explicit action hierarchy. Phudu is limited to page-level headings; forms, tables, permissions and audit data remain Poppins-first.

KDS and Admin follow the same accessibility principles for focus, status and motion, but implement them through `--kds-*` and `--admin-*` tokens. Their palettes are independently owned even when approved values currently match Customer.

## 9B. Runtime and asset separation

- Landing variables use `--landing-*`; Customer uses `--customer-*`; Admin uses `--admin-*`; KDS uses `--kds-*`.
- App source imports only its own design-system files.
- Every app serves images, logos and other static media only from its own `public/assets/` directory.
- Visual alignment is maintained through this document and review, not through global CSS aliases or cross-app asset URLs.

## 10. Image Direction

Food imagery should be warm, tactile and credible. Prioritise crust, cheese, char, sauce and ingredient texture. Product imagery should accurately match the named menu item; lifestyle imagery should show a plausible neighbourhood-pizzeria experience without unrelated brand marks.

Six unique Pizza Wave food images were copied into `docs/assets/pizza-wave-candidates/` for design evaluation only:

| Candidate | Potential use | Review required |
|---|---|---|
| `hero-main-pizza.png` | Hero or signature product crop | Confirm product accuracy, provenance and responsive crop |
| `mushroom-cheese-pizza.png` | Vegetarian product/editorial feature | Confirm corresponding menu item and ingredients |
| `paneer-cheese-pizza.png` | Paneer product/editorial feature | Confirm corresponding menu item and ingredients |
| `chicken-tikka-pizza.png` | Non-vegetarian product/editorial feature | Confirm corresponding menu item and ingredients |
| `cheesy-garlic-bread.png` | Sides/add-on feature | Confirm product accuracy |
| `chocolate-brownie.png` | Dessert feature | Confirm whether the product is sold in V1 |

They are **EXPLORATORY**, are not wired into any application and require founder approval, provenance/usage-rights confirmation, content matching, alt-text definition, compression and responsive derivatives before production use.

Rejected from reuse: Pizza Wave logos and loyalty graphics; duplicated image variants; delivery/location/PhonePe graphics; lifestyle imagery carrying “ARTISAN PIZZA CO” branding; images that imply an unapproved Pizza Avenue storefront or identity.

## 11. Typography Behaviour

- Phudu leads the expressive hierarchy: hero, chapter headline, selected quote, product story and selective operational metrics.
- Poppins carries navigation, body copy, product data, prices, buttons, forms, cart, checkout and most KDS/Admin content.
- Use the audited Pizza Wave weights only: Phudu 600/700 and Poppins 400/500/600/700.
- Do not adopt Lilita One/Outfit from the unrelated bakery experiment.
- Landing headlines should remain short and broad, generally no more than three lines.
- Mobile headlines should recompose and resize; do not force desktop line breaks.
- Dense operational surfaces should not use decorative type for atmosphere.
- Do not add handwriting or display fonts until a later approved exploration proves a specific need.

## 12. Colour Distribution

The following distribution is **RECOMMENDED**, not a production token rule:

- Cream: approximately 55–70% of expressive/customer surfaces,
- Sand Beige: approximately 10–20%,
- Espresso: approximately 10–20%, including text and occasional dark panels,
- Maroon: approximately 5–10%, focused on identity and primary action,
- Olive, Sage and Italian Brown: together approximately 5–15%, used as controlled supporting accents.

KDS and Admin may use a more utilitarian distribution while staying within the official palette and maintaining contrast. Operational status colours are semantic accessibility utilities and require a separate review; they must not redefine the brand palette.

## 13. Section Rhythm

A strong page rhythm alternates intensity:

```text
Expressive hero
→ quiet proof/promise
→ structured menu discovery
→ editorial food story
→ product/action grid
→ quiet trust or visit chapter
→ strong closing action
```

Avoid consecutive sections with the same card grid, background, heading scale and image ratio. Variation should come from composition and content priority, not arbitrary decoration.

## 14. Preliminary Landing Architecture

The following order is **EXPLORATORY** and may change after copy and content validation:

1. Utility notice, only when genuinely useful.
2. Header with location/store context and one primary ordering action.
3. Hero: short promise, signature food image and `Order pickup` action.
4. Immediate proof: direct Pickup/Dine-in convenience, fresh preparation and direct-order value.
5. Menu/category discovery.
6. Signature pizza feature.
7. Sides or add-on feature supporting AOV.
8. Brand/food craft story.
9. Curated product grid.
10. Loyalty/Pizza Passport introduction.
11. Social proof, when real customer evidence exists.
12. Store visit and pickup information.
13. Final ordering action.
14. Footer with operational links and contact information.

This is information architecture, not approval to build a final Landing page.

## 15. Preliminary Menu Content

Reference 03 yields eight preliminary categories and 29 items. Spelling has been normalised cautiously. All item data and prices remain **EXPLORATORY** until founder validation.

| Category | Items | Count |
|---|---|---:|
| Veggie Haven | Classic Margherita Pizza; Mushroom Alfredo Pizza; Pesto Pizza; Paneer Makhani Pizza; Farmhouse Pizza; Corn Pizza | 6 |
| Non-Veg Paradise | Chicken Pepperoni Pizza; Chicken Alfredo Pizza; Chicken Makhani Pizza; Meat Lovers Pizza | 4 |
| Pasta — Tossed & Sauced | Alfredo Pasta; Pesto Pasta; Arrabbiata Pasta; Spaghetti Aglio-e-Olio | 4 |
| Breads & Sides | Focaccia; Garlic Knots; Garlic Bread; Pepperoni Garlic Bread | 4 |
| Dunk & Dip | Viva Rosso; Pesto | 2 |
| Top It Off | Fresh Mozzarella; Burrata | 2 |
| Dessert | Tiramisu | 1 |
| Canned Classics | Coke; Sprite; Thums Up; Diet Coke; Water Bottle 1 L; Water Bottle 500 ml | 6 |
| **Total** |  | **29** |

Visible prices in the photograph are preliminary evidence only. Before data entry, confirm every base price, pasta variant price, modifier price, size/variant, tax treatment and availability. The final domain structure should remain `Category → Product → Variant → Modifier Group → Modifier`, aligned with the documented API and backend-authoritative pricing rules.

## 16. Mood Keywords

Warm. Editorial. Italian. Handcrafted. Neighbourhood. Appetising. Cultured. Earthy. Confident. Welcoming. Tactile. Direct. Modern. Unhurried in storytelling; fast in ordering.

## 17. Exploratory Opportunities

- A hero study comparing a full-bleed crop with a split editorial composition.
- Signature pizza storytelling built around real preparation or ingredient photography.
- A restrained paper-menu texture that passes readability and performance review.
- Ingredient line art derived from actual menu ingredients.
- Mobile art direction for edge-cropped food photography.
- A compact Phudu category treatment within the otherwise functional Poppins Customer app.
- Motion studies for hero entrance, cart confirmation and loyalty unlock with reduced-motion equivalents.
- A future brand-asset audit after the approved logo is supplied.

No opportunity above is approved implementation. The first recommended design step is a high-fidelity Landing Hero + Header exploration based on Documents 27 and 28.
