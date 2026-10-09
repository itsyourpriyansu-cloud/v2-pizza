# 17 — Changelog

## Template
### YYYY-MM-DD — title

Added:
- ...

Changed:
- ...

Fixed:
- ...

Docs updated:
- ...

Decision:
- DEC-xxx

Risk:
- ...

## 2026-10-09 — Unify application design with the Landing visual language

Added:
- a shared `@pizza-avenue/ui/foundation.css` contract for the official palette, Phudu/Poppins typography, spacing, radii, motion, focus and common primitives,
- branded responsive application-shell and route-state primitives,
- dedicated Admin and KDS surface profiles derived from the Landing foundation,
- the governed Landing logo asset as the browser icon for Customer, KDS and Admin.

Changed:
- Customer now consumes the shared foundation instead of maintaining duplicate token and primitive files,
- Admin now uses a responsive Espresso navigation rail on desktop and touch-safe horizontal navigation on smaller screens,
- KDS now uses a high-contrast kitchen surface with larger navigation and glanceable ticket rows,
- design-system documentation now identifies the implemented Landing as the canonical visual reference while preserving surface-specific density.

Unchanged:
- ordering, pricing, payments, loyalty, authentication, service-mode rules, APIs and state machines.

Validation:
- repository lint and typecheck pass,
- all 14 test files and 175 tests pass,
- Landing, Customer, KDS and Admin production builds pass,
- browser smoke checks pass at 390px mobile and 1440px desktop with no document overflow or console errors.

Risk:
- Landing content and imagery retain their existing founder/provenance review requirements; this change does not approve them for production.

## 2026-10-09 — Publish assembled Landing chapters for review

Changed:
- Collected the Landing chapters, UI primitives, styling, image assets, logo, responsive work and test updates tracked by CHG-0005 through CHG-0019 on `feature/landing-initial-ui` for review in Pull Request #13.
- Corrected the change queue to show the existing review state and the current verification result.
- During integration, retained CHG-0005 and migrated the Landing branch's colliding child IDs CHG-0006 through CHG-0019 to CHG-0013 through CHG-0026. The original IDs remain recorded as legacy PR #13 IDs in each queue entry.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

Verification:
- The source branch's recorded `pnpm lint`, `pnpm typecheck`, `pnpm test` (6 files, 44 tests) and `pnpm build` run passed locally.
- After integration, repository lint and typecheck passed; all four frontend production builds passed; and the isolated Vitest rerun passed 14 files and 175 tests.
- An initial test launch run concurrently with lint, typecheck and build exhausted worker startup and executed no tests; the isolated full-suite rerun is the authoritative result.

Risk:
- Image and menu-content approval, staging smoke testing and the pickup-only versus dine-in product decision remain open.

## 2026-10-08 — Responsive scaling and layout structure replication for Hero Carousel cards

Changed:
- Replicated authentic reference layout structure for hero carousel cards: each card now features an outer solid colored container (`badgeBg`) with rounded frame padding (`border-radius: 1.45rem` - `1.65rem`), an inset square food photo (`border-radius: 1rem` - `1.2rem`), and bold uppercase display typography (`Phudu`, 800 weight) centered directly on the card background.
- Aligned category card palette with the reference signature: Crimson Red (`PIZZAS`), Sky Cyan Blue (`PANEER CRAFT`), Terracotta Orange (`CHICKEN TIKKA`), Fresh Herb Green (`TRUFFLE MUSHROOM`), Golden Yellow (`GARLIC BREAD`), and Rose Pink (`SWEET BITES`).
- Replicated hero call-to-action buttons as fully rounded pills (`border-radius: 9999px`) with bold typography and prominent drop shadows matching the reference design.
- Replicated viewport-specific card structures from reference:
  - Mobile (360px - 440px): 1 prominent centered card (~74vw) with left and right cards peeking in (~13vw) at the edges, exactly matching the reference mobile mockup.
  - Desktop (1024px - 1440px+): 5 cards visible across the viewport (left/right peeking, 4 full in center), matching the reference desktop mockup.
- Quadrupled category cards in the hero carousel track (24 cards total) so the first half (12 cards) exceeds even 4K screen widths (3840px), guaranteeing 100% seamless infinite marquee looping with zero whitespace or stutter.
- Preserved keyboard navigation and screen-reader accessibility with `tabIndex={0}` on the primary set and `tabIndex={-1}` plus `aria-hidden="true"` on clones.

Added:
- Unit test in `apps/landing/src/app.test.tsx` verifying hero category carousel rendering, accessible tab order, and screen-reader hidden clone semantics.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0019)

Risk:
- Responsive validation is local only; staging and production have not been deployed or smoke-tested.

## 2026-10-08 — Harden landing responsiveness across every section

Changed:
- Added layout containment to the Landing's shared grid and flex children so sections can shrink within their available tracks.
- Made the Brand Highlights photo grid fluid at tablet widths and replaced its narrow-phone intrinsic-width constraint with a fixed-height single-column treatment.
- Scaled the app showcase phone frame to its container on narrow phones, tightened the smallest header layout, and made the footer display wordmark fit without clipping.
- Removed the Landing's global 20rem minimum page width so a vertical scrollbar cannot create a false horizontal scroll at 320px.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0005)

Risk:
- Responsive validation is local only; staging and production have not been deployed or smoke-tested.

## 2026-10-07 — Integrate authentic Pizza Avenue brand logo across landing page surfaces

Added:
- Favicon and Apple touch icon references in `apps/landing/index.html` pointing to `/assets/logo/pizza%20avenue.jpeg`.
- Circular brand logo badge in header navigation wordmark (`.wordmark__logo`) with responsive sizing, subtle border, warm shadow, and hover micro-interaction.
- Dedicated brand lockup (`.footer-brand-lockup`) in the footer top section with logo, title ("PIZZA AVENUE"), and tagline ("The Only Route to Real Flavor · Sainikpuri").
- Rising circular brand logo seal inside the bottom giant footer banner disc (`.footer-banner-disc-img`).
- Brand logo inside the Mobile App Showcase right-column badge (`.app-download-badge__icon`) and the in-app phone mockup cart header (`.phone-cart-logo`).
- Automated integration test in `apps/landing/src/app.test.tsx` verifying logo rendering across header, footer lockup, banner disc, and app mockup.

Changed:
- `apps/landing/index.html` updated with brand icon links in `<head>`.
- `apps/landing/src/LandingPage.tsx` updated with `<img src="/assets/logo/pizza%20avenue.jpeg" />` inside the header wordmark.
- `apps/landing/src/components/Footer.tsx` updated with brand header lockup and banner disc image.
- `apps/landing/src/components/AppDownloadSection.tsx` updated with download badge and mockup cart header logo icons.
- `apps/landing/src/styles.css` updated with responsive styles for all logo placements.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0018)

## 2026-10-07 — Add Brand Highlights & Proof Cards section after Story section

Added:
- `apps/landing/src/components/BrandHighlights.tsx`:
  - Showcase section placed immediately after the story scroll reveal section (`.story-reveal-container`) and before the Customer Flow section (`<CustomerFlow />`), replicating the reference layout with Pizza Avenue brand styling.
  - 4-card top responsive grid of rounded metric cards with vibrant brand background colors:
    - **50K+ Happy Foodies**: Coral/orange card body (`#FF6E40`), bold display count, and dark espresso typography.
    - **0 Artificial Additives**: Sky blue card body (`#7BD5F5`), zero preservatives/chemicals callout.
    - **FRESH Hot in minutes**: Warm golden crust yellow card body (`#F9C74F`), hot pickup in minutes proof point.
    - **100% Certified safe**: Soft rose pink card body (`#F7A8D8`), dairy mozzarella and food safety standard.
  - 2-card bottom responsive grid of high-impact photography cards:
    - **FLAVORS MADE FOR YOU**: High-resolution photography of customer enjoying freshly baked artisanal sourdough pizza with blistered crust, dark gradient overlay, and bold `Phudu` uppercase typography.
    - **HOT, FRESH, PERFECT**: High-resolution photography of outdoor counter dining enjoying hot craft pizza with stretchy cheese pull and iced tea, dark gradient overlay, and bold `Phudu` uppercase typography.
- `BrandStatCard` and `BrandPhotoCard` interfaces and `brandStatCards`, `brandPhotoCards` datasets in `apps/landing/src/landing-content.ts`.
- High-resolution photography assets in `apps/landing/public/assets/highlights/` (`flavors-made-for-you.jpg`, `hot-fresh-perfect.jpg`).
- Dedicated responsive CSS styles and media queries in `apps/landing/src/styles.css` (`.brand-highlights-section`, `.brand-stats-grid`, `.brand-stat-card`, `.brand-photos-grid`, `.brand-photo-card`).
- Automated unit and integration test in `apps/landing/src/app.test.tsx` verifying render, cards, statistics, headings, and DOM ordering after the story section.

Changed:
- Integrated `<BrandHighlights />` into `LandingPage.tsx` directly after `<section className="story-reveal-container">` and before `<CustomerFlow />`.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0017)

## 2026-10-07 — Add Feed the Crowd Catering and Events section after Combos section

Added:
- `apps/landing/src/components/CateringSection.tsx`:
  - Group catering and events showcase section replicating the reference mockup with Pizza Avenue design foundation.
  - Centered "Catering & Events" pill badge, display headline "FEED THE CROWD." in `Phudu` (900 weight, deep espresso `#2D1208`), and subtitle "Stack your favorites and save big. Limited time offers that actually matter."
  - 3-card responsive grid featuring high-resolution photography assets (`office-party.jpg`, `game-night.jpg`, `wedding-rehearsal.jpg`):
    - **OFFICE PARTY**: Warm terracotta/orange card body (`#EB5E28`), "Serves 10-15 people", tags (`10 Burgers`, `5 Large Pizzas`, `20 Wings`, `Dips & Sides`), price `$149`, dark burgundy pill `GRAB DEAL`.
    - **GAME NIGHT FEAST**: Golden yellow card body (`#F5BA31`), "Serves 6-8 people", tags (`8 Burgers`, `3 Large Pizzas`, `12 Wings`, `Loaded Fries`), price `$99`, dark burgundy pill `GRAB DEAL`.
    - **WEDDING REHEARSAL**: Rose pink card body (`#E57399`), "PREMIUM" dark pill badge over image, "Serves 25-30 people", tags (`25 Burgers`, `8 Large Pizzas`, `40 Wings`, `Salad Bowls`, `Desserts`), price `$299`, dark burgundy pill `GRAB DEAL`.
  - Wide "CUSTOM EVENT CATERING" banner below cards with subtitle "Birthdays, corporate lunches, graduations, we build it your way." and vibrant orange pill button "BUILD CUSTOM ORDER".
- `CateringPackage` interface and `cateringPackages` dataset in `apps/landing/src/landing-content.ts`.
- Dedicated responsive CSS rules in `apps/landing/src/styles.css` (`.catering-section`, `.catering-grid`, `.catering-card`, `.catering-custom-banner`, responsive mobile/tablet breakpoints).
- Unit and integration tests in `apps/landing/src/app.test.tsx` verifying render, badges, headings, cards, tags, servings, and CTA actions.

Changed:
- Integrated `<CateringSection customerAppUrl={customerAppUrl} />` into `LandingPage.tsx` immediately after `<CombosSection customerAppUrl={customerAppUrl} />`.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0016)

## 2026-10-07 — Add Mobile App Showcase section before footer with brand styling

Added:
- `apps/landing/src/components/AppDownloadSection.tsx`:
  - Dedicated mobile app showcase section directly above the footer replicating the reference mockup.
  - Realistic smartphone device chassis featuring metallic orange titanium edges, simulated hardware buttons, Dynamic Island pill cutout, top status bar (time `7:15`, cellular/Wi-Fi/battery indicators), and screen container with warm off-white backdrop.
  - Interactive-styled in-app Cart Items review screen with 4 dish cards (`Peri Peri Pizza`, `Morocco Streaks`, `Chicken Zinger`, and `Chocolate Brownie`) utilizing authentic project image cutouts (`paneer-cheese-pizza.png`, `chicken-tikka-pizza.png`, `cheesy-garlic-bread.png`, `chocolate-brownie.png`), stepper quantities, dark espresso sticky checkout bar with golden checkout CTA pill, and bottom navigation bar.
  - Right column promotional copy: "Download the App" pill badge, high-impact display headline "ORDER IN 3 TAPS. SERIOUSLY." with "3 TAPS." highlighted in flame orange (`#E85D04`), marketing subtitle, and Apple App Store + Google Play store pill buttons linking to the customer app.
  - Trust points row displaying orange star rating ("★ 4.9 Rating"), download counter ("📥 500K+ Downloads"), and performance speed ("⚡ Under 3s Load").
- Dedicated responsive CSS styles in `apps/landing/src/styles.css` (`.app-download-section`, `.mockup-phone`, `.phone-cart-list`, `.app-store-pill-btn`, mobile breakpoints).
- Unit tests in `apps/landing/src/app.test.tsx` verifying render, headline, highlight span, badges, store links, and trust points.

Changed:
- Integrated `<AppDownloadSection customerAppUrl={customerAppUrl} />` into `LandingPage.tsx` directly above the `<Footer />` component.
- Updated `apps/landing/src/app.test.tsx` footer link assertions to use `within(footer)` scoping.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0015)

## 2026-10-07 — Replicate Combos Section with brand styling and reorder sections after menu and combo banner

Added:
- `apps/landing/src/components/CombosSection.tsx`:
  - 4-card combos showcase replicating the reference design with Pizza Avenue branding and typography (`Phudu` and `Poppins`).
  - Centered "Deals" badge, bold display headline "COMBOS THAT MAKE SENSE", and descriptive subtitle "Stack your favorites and save big. Limited time offers that actually matter."
  - 4 distinct vibrant combo cards in 2x2 grid with high-resolution food photography assets (`the-feast-combo.jpg`, `pizza-party-deal.jpg`, `wrap-wings-bundle.jpg`, `date-night-special.jpg`):
    - **THE FEAST COMBO**: Coral card (`#FF6B4A`), yellow save badge (`SAVE ₹150`), itemized list, strikethrough price `₹849`, bright white price `₹699`, espresso pill `GRAB DEAL`.
    - **PIZZA PARTY DEAL**: Sunny gold card (`#FBBF24`), coral save badge (`SAVE ₹250`), itemized list, strikethrough price `₹1,199`, bright white price `₹949`, espresso pill `GRAB DEAL`.
    - **WRAP & WINGS BUNDLE**: Sky cyan card (`#56CFE1`), coral save badge (`SAVE ₹180`), itemized list, strikethrough price `₹799`, bright white price `₹619`, espresso pill `GRAB DEAL`.
    - **DATE NIGHT SPECIAL**: Berry rose card (`#F687B3`), coral save badge (`SAVE ₹220`), itemized list, strikethrough price `₹999`, bright white price `₹779`, espresso pill `GRAB DEAL`.
  - Centered "SEE MORE" pill action linking to the customer app menu.
- `ComboOffer` interface and `comboOffers` dataset in `apps/landing/src/landing-content.ts`.
- Dedicated styles in `apps/landing/src/styles.css` (`.combos-section`, `.combos-grid`, `.combo-card`, responsive mobile breakpoints).
- Automated test coverage in `apps/landing/src/app.test.tsx` verifying cards, badges, headings, bullet items, and links.

Changed:
- Reordered landing page sections in `LandingPage.tsx`:
  - Positioned Customer Flow (`<CustomerFlow />`) after the Story section.
  - Positioned Menu (`<CravingMenu />`) after Customer Flow.
  - Positioned Combo Banner (`<ComboStrip />`) after Menu.
  - Positioned Combos Deals Section (`<CombosSection />`) after Combo Banner.
  - Positioned Category Best Sellers (`<section id="bestsellers">`) after Menu, Combo Banner, and Combos Section.
- Updated header navigation links to include `#combos` alongside `#menu` and `#bestsellers`.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0014)

## 2026-10-07 — Add Combo Madness promotional banner strip after Customer Flow section

Added:
- `apps/landing/src/components/ComboStrip.tsx`:
  - Full-bleed promotional strip banner positioned immediately after the Customer Flow section (`<CustomerFlow />`) and before Category Best Sellers (`<FeatureCarousel />`).
  - High-impact display headline "COMBO MADNESS" in `Phudu` (900 weight, deep espresso) and subtitle "Save up to 30% on meal combos".
  - Dynamic food cutouts utilizing authentic project assets (`paneer-cheese-pizza.png`, `chicken-tikka-pizza.png`, `cheesy-garlic-bread.png`, `chocolate-brownie.png`, and `hero-main-pizza.png`) echoing the user reference mockup.
  - Interactive clickable link pointing to the customer app menu with subtle hover scale micro-animations and drop-shadow depth.
- Promotional banner styles in `apps/landing/src/styles.css`:
  - App-aligned warm vibrant orange gradient (`linear-gradient(90deg, #F46726 0%, #E7530D 50%, #F46726 100%)`).
  - Responsive positioning, graceful mobile fallback, and prefers-reduced-motion support.
- Automated test coverage in `apps/landing/src/app.test.tsx` verifying accessibility, heading, subtitle, and menu navigation link.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0013)

## 2026-10-07 — Remove redundant legacy Signatures section from landing page

Changed:
- Removed legacy `<section className="signatures" ...>` from `LandingPage.tsx`.
- Updated header navigation link from `#signatures` to `#menu` ("Our Menu").
- Updated hero secondary action link from `#signatures` to `#menu` ("Explore the menu").
- Updated footer navigation link from `#signatures` to `#menu` ("DEALS").
- Added prototype pricing qualification note in `CravingMenu.tsx` ensuring transparency without needing the legacy signatures note.
- Updated automated test assertions in `app.test.tsx` to verify absence of the signatures section.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0012)

## 2026-10-07 — Build Pick Your Craving 100vh Menu section with authentic category filters and carousel after the story section

Added:
- `apps/landing/src/components/CravingMenu.tsx`:
  - 100vh interactive category craving menu section positioned directly after the story section
  - Centered "Menu" pill badge, display heading "PICK YOUR CRAVING" in `Phudu` typography, and descriptive subtitle
  - 6 category filter tabs (`HOT SELLING`, `VEG PIZZAS`, `NON-VEG PIZZAS`, `PASTAS`, `BREADS & SIDES`, `DESSERT & DIPS`) mirroring authentic Pizza Avenue menu card categories
  - 3-card desktop carousel with clean ivory cards, high-resolution food cutout imagery, dietary veg/non-veg badges, display titles, 2-line descriptions, prominent warm orange price tags (`₹380`, `₹480`, etc.), and circular add buttons linked to customer app menu
  - Centered bottom navigation arrows (`←` and `→`) with smooth scrolling and boundary state detection
- `CravingMenuItem`, `CravingCategory`, `cravingCategories`, and `cravingMenuItems` dataset in `apps/landing/src/landing-content.ts` with authentic dishes from the uploaded menu card
- High-resolution food photography assets in `apps/landing/public/assets/menu/` (`alfredo-pasta.jpg`, `pesto-pasta.jpg`, `garlic-knots.jpg`, `tiramisu.jpg`, `viva-rosso-dip.jpg`)
- Styles in `apps/landing/src/styles.css` adhering strictly to full viewport height (`min-height: 100vh; min-height: 100dvh;`) with flex column centering, hover micro-animations, and responsive mobile layout
- Automated test coverage in `apps/landing/src/app.test.tsx` verifying headings, categories, interactive tab switching, and navigation buttons

Fixed:
- Removed extraneous exports in `feature-carousel.tsx` satisfying ESLint Fast Refresh (`react-refresh/only-export-components`) rule with 0 warnings.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0011)

## 2026-10-07 — Fix Category Best Sellers section and make it 100vh

Changed:
- Adjusted `.bestsellers-section` to full-screen viewport height (`min-height: 100vh; min-height: 100dvh;`) with flex column centering (`justify-content: center; align-items: center;`) and balanced padding (`clamp(1.25rem, 2.5vh, 2.5rem) 0`).
- Replaced rigid `aspect-ratio: 16 / 9; min-height: 600px;` on desktop `.feature-carousel-shell` with adaptive height (`clamp(430px, 58vh, 560px)`), eliminating viewport height overflow on laptop screens (e.g. 1536x730).
- Fixed `.feature-carousel-left` centering by removing asymmetric `padding-left` and `align-items: flex-start`, properly centering the vertical chip reel.
- Coordinated reel height constants (`REEL_HEIGHT = 380`, `ITEM_HEIGHT = 54`, `ITEM_GAP = 12`, `CENTER_Y = 163`) between CSS and React component, and implemented shortest circular angle delta for smooth chip clicks.
- Updated `.feature-carousel-right`, `.feature-carousel-stage`, and `.feature-carousel-card` to auto-fit container height (`height: 100%; aspect-ratio: 4 / 5; max-width: 380px`), eliminating card and caption clipping.
- Added responsive media queries for tablet/mobile (`<= 1023px` and `<= 480px`) with natural stacked scrolling and proportional card heights.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0010)

## 2026-10-07 — Add Customer Flow (Process) section after the story section

Added:
- `apps/landing/src/components/CustomerFlow.tsx`:
  - 3-step customer flow section with "Process" badge, "BROWSE THEN ORDER" display heading, and descriptive subtitle
  - 3 photographic lifestyle cards depicting browsing the menu on mobile, unboxing hot pizza with friends, and enjoying the first cheesy bite
  - Rounded cards with smooth dark gradient overlays, "STEP 1/2/3" pills, bold titles, descriptions, and high-impact action keywords ("BROWSE", "ORDER", "ENJOY")
  - Action buttons linked directly to customer app menu route
- `CustomerFlowStep` interface and `customerFlowSteps` dataset in `apps/landing/src/landing-content.ts`
- High-resolution photographic assets saved to `apps/landing/public/assets/customer-flow/` (`step-1-browse.jpg`, `step-2-order.jpg`, `step-3-enjoy.jpg`)
- Styling in `apps/landing/src/styles.css` adhering to the 7-color project palette, `Phudu` and `Poppins` typography, hover transforms, and responsive mobile layout
- Automated test coverage in `apps/landing/src/app.test.tsx`

Changed:
- Adjusted `.customer-flow-section` to full-screen viewport height (`min-height: 100vh; min-height: 100dvh;`) with vertical flex centering (`justify-content: center`) and balanced card heights (`clamp(340px, 48vh, 460px)`) ensuring the entire process section fits cleanly within 100vh on desktop.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md` (CHG-0009)

## 2026-10-07 — Integrate Google Reviews InfiniteMovingCards marquee above FAQ

Added:
- `components/ui/infinite-moving-cards.tsx` and `apps/landing/src/components/ui/infinite-moving-cards.tsx`:
  - Infinite marquee rail using `framer-motion` (`useAnimationFrame`, `useMotionValue`, `useReducedMotion`)
  - Configurable `direction`, `speed`, `gap`, `loop`, `pauseOnHover`, and `showGradientMask`
  - Safe SSR / JSDOM execution fallback when `ResizeObserver` is undefined
  - Card layout with dish photography, 5-star ratings, category tags, author avatars, and testimonials
- `components/ui/demo.tsx` and `apps/landing/src/components/ui/demo.tsx` demo previews
- `customerReviews` dataset and `googleMapsReviewsUrl` in `apps/landing/src/landing-content.ts` featuring verified Sainikpuri community feedback
- Google Reviews marquee section on `LandingPage.tsx` placed immediately above the FAQ section
- Google Maps rating badge linking directly to `https://maps.app.goo.gl/dMzrGhS9LBqQVNx3A` (4.9★ on Google Maps)
- Responsive styles in `styles.css` adhering strictly to official 7-color project palette (`Cream`, `Sand Beige`, `Maroon`, `Italian Brown`, `Olive Green`, `Sage Green`, `Espresso`)
- Automated test in `apps/landing/src/app.test.tsx` for marquee rendering and Google Maps link
- JSDOM `ResizeObserver` polyfill in `vitest.setup.ts`

Changed:
- Installed `framer-motion` in `@pizza-avenue/landing` and workspace devDependencies
- Fixed card image height ballooning and flex track layout across Vanilla CSS environment
- Implemented responsive mobile layout for Google Reviews header, pill badge, and card dimensions (adapting to viewport width with zero overflow)

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`
- `docs/CLIENT_DECISIONS_PENDING.md`

## 2026-10-07 — Recreate brand footer using project styling and color palette

Added:
- `apps/landing/src/components/Footer.tsx` matching reference design:
  - 3-column top section with Quick Links, Legal, and App Store / Google Play download badges
  - Interactive "NEVER MISS A DEAL AGAIN" newsletter email subscription form with success state
  - Sainikpuri neighbourhood vector map card with animated radar pin and "OPEN IN MAPS ↗" direct link
  - "COME SAY HI" contact section with 42 Sainikpuri address, phone number, opening hours (11AM – 11PM), and social icon buttons
  - Giant full-width "PIZZA AVENUE" display typography banner in Phudu with smooth circular disc dome centered behind it
- Comprehensive CSS styles in `styles.css` adhering strictly to the official 7-color palette (`Cream`, `Sand Beige`, `Maroon`, `Italian Brown`, `Olive Green`, `Sage Green`, `Espresso`)
- Automated tests in `apps/landing/src/app.test.tsx` for footer layout and content

Changed:
- `LandingPage.tsx` integrates the new `Footer` below the main content
- Unexported internal `DEFAULT_FAQS` in `faq-05.tsx` to ensure zero ESLint fast-refresh warnings

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

## 2026-10-07 — Integrate Faq05 and Accordion into Landing

Added:
- `components/ui/accordion.tsx` using `@radix-ui/react-accordion` and `lucide-react`
- `components/ui/faq-05.tsx` with external prop support (`items`) and single-collapsible state
- `components/ui/demo.tsx` preview block
- Brand-specific pickup, dough and loyalty FAQs in `apps/landing/src/landing-content.ts`
- FAQ section rendered as the last content section on Landing with navigation anchor
- Automated test coverage in `apps/landing/src/app.test.tsx` for the FAQ section

Changed:
- Landing page includes FAQ anchor link in mobile and desktop navigation
- Landing styles include accessible accordion expand/collapse styling matching Pizza Avenue warm palette

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

## 2026-10-06 — Initial Pizza Avenue Landing Experience

Added:
- first approved Landing batch with utility strip, responsive navigation, food-led hero, proof strip and four-product signature selection
- curated Pizza Wave food candidates in the Landing public asset set
- local Phudu 600/700 and Poppins 400/500/600/700 font assets through Fontsource
- Landing tests for offer clarity, Customer-app destinations, loopback development and provisional-pricing disclosure

Changed:
- root-domain Landing from a neutral architecture placeholder into an accessible, responsive direct-pickup entry point
- Landing hero fills the viewport and removes the redundant in-hero pickup note
- local URL detection to support `127.0.0.1` and IPv6 loopback in addition to `localhost`
- production metadata to describe the Sainikpuri pickup proposition

Fixed:
- all ordering, menu and Pizza Passport actions now resolve through the configured Customer app host
- deferred Landing chapters are not exposed as dead navigation links
- prototype prices are explicitly qualified and remain outside authoritative checkout calculations
- hero section updated to fill 100vh/100dvh viewport height across mobile and tablet with balanced spacing, headline split cleanly into two lines, collapsible mobile navigation bar with animated toggle added, and category cards kept fully visible above the fold without clipping

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

Decision:
- Implements the frozen DEC-024 host boundary and DEC-025 visual foundation; no new permanent product or architecture decision

Risk:
- candidate imagery, menu names and photographed prices remain prototype-only until provenance and founder validation are complete
- no approved Pizza Avenue logo exists, so the header uses a text treatment rather than an invented mark

## 2026-10-08 — Recompose Customer Home around ordering intent

Added:
- distinct reviewable service-entry, new-customer Pickup, returning-customer, active-Pickup and active-Dine-in Home compositions
- guided craving routes, current-menu usual-order recovery, transparent meal-planning and optional meal-completion modules using the existing seed catalog
- a deterministic `NEW_PICKUP` review persona and focused hierarchy, reorder and table-entry coverage
- an explicit-permission in-app table-QR scanner with local decoding, environment-camera preference, invalid-code guidance and denied/unsupported recovery

Changed:
- Home now follows service context → immediate order path → familiar/social-proof choices → meal completion → at most one retention cue → discovery/trust
- active Pickup and Dine-in operations suppress retention and engagement prompts; active table sessions expose only table-relevant actions
- the customer shell communicates Pickup ETA or trusted table context instead of a generic location label
- a direct table-entry visit without a token now offers an in-app camera scan; native-camera table links still bypass directly to server resolution and visible table confirmation

Fixed:
- mock Order Again now rebuilds a real cart from current products, variants and prices before opening checkout
- service selection and Home content stay usable across phone, tablet and desktop layouts without introducing delivery or manual table selection
- camera streams stop on scan success, close and unmount; arbitrary scanned URLs are never followed and raw table numbers remain rejected

Docs updated:
- `docs/CUSTOMER_HOME_ARCHITECTURE.md`, `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/07_COMPONENTS.md`, `docs/12_ANALYTICS_EVENTS.md`, `docs/17_CHANGELOG.md`, `docs/18_ACCEPTANCE_CRITERIA.md`, `docs/20_MASTER_INDEX.md`, `docs/24_CHANGE_QUEUE.md`, `docs/CLIENT_REVIEW_FLOW.md`

Decision:
- no product or architecture decision changed; the UI applies documented operational priority and ethical choice architecture through existing typed frontend/MSW boundaries

Risk:
- item names, prices, photography, actual store hours and bundle economics remain mock or pending owner approval; browser evidence does not prove production backend authority

## 2026-10-08 — Prepare Customer V1 for client review

Added:
- structured 27-step restaurant-owner walkthrough, 15 deterministic review personas, pending-decision register, scorecard and pre-freeze UX/contrarian audit
- development-only `?review=` presets that reset all mock domains and apply complete Pickup or Dine-in context without exposing a production selector
- focused regression coverage for persona isolation, ordinary Passport Home priority and single Home engagement presentation
- four current mobile review screenshots for service choice, Returning Home, Menu and Product Builder

Changed:
- Home now shows generic reorder only when no contextual engagement module exists and includes ordinary Passport progress at its documented priority
- customer status, payment, auth and recovery copy uses customer language instead of raw state/mock/server terminology
- primary reward surfaces consistently name redeemable value “Pizza Points,” distinct from non-redeemable Avenue XP
- a reusable Chrome/CDP audit script records rendered headings, overflow, visible image/control checks, console/network results and screenshots

Fixed:
- multi-domain Home and service-context personas can now be reproduced from one development-only URL
- Saved Basket current-price totals, stale-price recovery copy and cart handoff now align with the current menu seed instead of historical or contradictory values
- Returning Home no longer presents competing generic reorder and Saved Basket cards

Docs updated:
- `docs/CLIENT_REVIEW_FLOW.md`, `docs/CLIENT_DECISIONS_PENDING.md`, `docs/CLIENT_REVIEW_SCORECARD.md`, `docs/UX_AUDIT_PRE_FREEZE.md`, `docs/17_CHANGELOG.md`, `docs/20_MASTER_INDEX.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no product or architecture decision changed; unresolved menu, economics, feature, brand, privacy and legal choices are explicitly reserved for the restaurant owner

Risk:
- visual/client readiness is not production readiness; MSW cannot prove future payment, capacity, session, permission, concurrency or persistence behavior
- UX freeze remains blocked on client decisions, final menu/brand assets, legal approval and a later bounded correction pass

## 2026-10-07 — Complete Customer engagement prototype

Added:
- Saved Baskets with five seeded use cases, custom creation, editing, sharing, deletion, current-menu revalidation and preserved-item stale recovery
- optional Household members and Important Occasions with privacy/safety guidance and existing-cart planning handoff
- referral lifecycle, privacy-safe Taste Card, opt-in seasonal Avenue League and host-paid Group Ordering with polls
- centralized Customer feature flags, typed engagement contracts/API client, deterministic MSW personas and 14 focused mission tests
- ten responsive Customer screenshot artifacts covering the seven feature areas, adaptive Home, and desktop League/Group views

Changed:
- Home now selects one engagement module below active service, current order and reorder priorities
- Profile and Rewards expose the new routes without changing the frozen five-item bottom navigation
- completed Pickup can show League context while served-but-unpaid Dine-in remains economically pending
- all major engagement routes are lazy-loaded and retain the Pizza Avenue typography, warm palette and shared primitives

Fixed:
- referral progress uses a readable vertical timeline on phone widths instead of compressing seven labels
- Points, Passport, Mission and League progress indicators now expose complete progressbar semantics
- reactivation CTA clicks now emit a distinct privacy-safe analytics event

Docs updated:
- `docs/01_PRODUCT_SCOPE.md`, `docs/02_BUSINESS_RULES.md`, `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/07_COMPONENTS.md`, `docs/10_API_CONTRACTS.md`, `docs/12_ANALYTICS_EVENTS.md`, `docs/13_SEED_DATA.md`, `docs/14_TEST_PLAN.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/18_ACCEPTANCE_CRITERIA.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- DEC-027 — complete the client-review engagement prototype through typed frontend/MSW boundaries before production backend implementation

Risk:
- MSW proves frontend contracts and recovery UX only; production ownership, referral qualification, XP calculation, real-time collaboration, idempotency and persistence remain backend work
- thresholds, reward values, reminder policy and Saved Basket economics remain subject to client/founder UX review

## 2026-10-07 — Customer retention, profile and preliminary mock menu

Added:
- Customer Rewards hub with Points, next-reward progress, reversible reward reservation, activity, Passport and Missions entry points
- Pizza Passport new/progress/one-left/complete/unavailable states and product links preserving `source=PASSPORT`
- separate Personal/Common Missions with non-redeemable Avenue XP and deterministic completion responses
- practical Profile preferences, favourites, notification controls, allergy warning, help/legal information and local logout
- nine focused retention missions plus six responsive screenshot artifacts

Changed:
- Home now renders one adaptive retention action below active Pickup/Table and reorder priorities
- completed Pickup tracking includes a compact retention summary
- the shared preliminary menu now contains the documented 29 mock items across eight categories
- menu cards use fixed media/content alignment and the single favourite card no longer inherits a two-column layout
- Customer retention routes remain lazy-loaded under `/rewards`, `/rewards/passport`, `/rewards/missions` and `/profile`

Fixed:
- reward reservation no longer implies consumption and can be released safely
- served but unpaid Dine-in loyalty is shown as pending; the paid fixture moves it into spendable Points
- Passport sold-out items preserve progress and suppress an invalid Product CTA
- Profile save failures retain the last server response and expose recovery copy

Docs updated:
- `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/07_COMPONENTS.md`, `docs/10_API_CONTRACTS.md`, `docs/12_ANALYTICS_EVENTS.md`, `docs/13_SEED_DATA.md`, `docs/14_TEST_PLAN.md`, `docs/17_CHANGELOG.md`, `docs/18_ACCEPTANCE_CRITERIA.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no architecture decision changed; all balances, progress and final states remain server-authoritative in production

Risk:
- MSW validates frontend boundaries only; production ledger idempotency, paid-bill attribution, permissions and database persistence remain for the NestJS backend
- the 29-item menu, prices, reward costs and earn values remain preliminary pending founder confirmation

## 2026-10-07 — Complete Customer Pickup and Dine-in commerce flows

Added:
- service-mode-isolated Pickup and Dine-in carts with authoritative mock quotes, recovery notices, contextual optional upsells and edit/remove/quantity controls
- phone OTP and verified WhatsApp continuation prototype states that preserve cart and service context
- capacity-aware Pickup selection with ASAP/scheduled slots, reservation countdown, full-slot and expired-hold recovery
- checkout review, payment pending/verified/failure handling, Pickup confirmation and fulfilment tracking
- waiter-gated Dine-in submission, clarification/rejection/accepted/preparing/ready/served states, additional rounds and a read-only current bill
- 15 focused commerce-flow tests and responsive browser evidence for the primary Pickup and Dine-in missions

Changed:
- Customer discovery links and product building now respect the active service mode
- Customer routes use route-level lazy loading; the main entry bundle decreased from 533.25 kB / 164.56 kB gzip to 374.79 kB / 117.18 kB gzip
- the floating cart is limited to discovery routes so it cannot overlap checkout, payment or tracking actions
- the Customer document now declares its theme color and an inline brand favicon, avoiding a stray browser 404
- shared cart, Pickup and analytics types plus API/MSW fixtures now represent the documented commerce recovery states

Fixed:
- Pickup and Dine-in carts no longer share one client cart identity
- Customer-submitted Dine-in rounds cannot visually imply kitchen admission before waiter confirmation
- payment success cannot visually confirm an order before the mock payment response is verified

Docs updated:
- `docs/12_ANALYTICS_EVENTS.md`, `docs/17_CHANGELOG.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no architecture decision changed; these remain production-shaped frontend/MSW flows pending the documented NestJS and provider integrations

Risk:
- MSW proves client flow behavior, not production transaction locking, webhook authenticity, staff RBAC or outbox delivery

## 2026-10-07 — Recover Customer menu from injected outage

Added:
- regression coverage proving the menu can recover from the deterministic `MENU_NETWORK_ERROR` UX scenario
- standard ARIA `role` support on the shared `Surface` primitive used by the in-progress Auth and Checkout states

Changed:
- the Menu retry action now clears only the injected menu-outage scenario, removes its URL flag and refetches through the existing typed API/MSW boundary
- Customer test setup now follows the separate commerce store introduced by CHG-0008 instead of writing removed cart fields into the prototype-scenario store

Fixed:
- a test/review URL containing `?scenario=MENU_NETWORK_ERROR` no longer traps the Customer Menu in a permanent 503 loop when “Try again” is pressed
- current CHG-0008 Customer changes typecheck after the stale test-store fields and missing ARIA prop were corrected

Docs updated:
- `docs/17_CHANGELOG.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- no product or architecture decision changed; local UX continues to use MSW because no NestJS backend exists in this repository

Risk:
- `VITE_ENABLE_MOCKS=false` still requires a separately running backend at `VITE_API_BASE_URL`; no service is currently listening on local port 3000

## 2026-10-06 — Customer App UI — UX Implementation V1

Added:
- responsive Customer shell with service-aware context, five-item pickup navigation, loading/error/empty states and transient feedback
- contextual new, returning, loyal and active-order Home states plus busy, paused and closed store messaging
- category Menu, Search states, Product Detail, sold-out alternatives and a continuous Pizza Builder
- deterministic menu/network/availability scenarios and focused Customer route/interaction coverage
- vendor-neutral analytics hook points for discovery and builder events
- self-hosted Phudu 600/700 and Poppins 400/500/600/700 Latin font assets plus consistent Lucide Customer navigation icons
- content-matched seed imagery for the Home hero, Funghi and garlic-bread products, with an explicit fallback for products without approved imagery
- the missing Rahul dual-identity customer/loyalty fixtures and independently selectable Cheese, Toppings and Dips modifier groups

Changed:
- the general entry now preserves the Pickup/Dine-in choice and withholds pickup navigation until a service mode is selected
- menu mocks now represent the first-batch customer categories and products while retaining integer-money and backend-authoritative pricing boundaries
- shared `AppShell` now supports compatible custom-header and footer-navigation slots
- Customer colour, typography, card, category, hero and navigation treatments now apply selected Pizza Wave interaction lessons through the frozen Pizza Avenue palette rather than the legacy Wave palette

Fixed:
- Dine-in routes no longer inherit pickup bottom navigation
- sold-out and unavailable selections remain visible with recovery guidance instead of becoming dead ends
- required/min/max builder rules preserve selections and surface inline validation
- direct Vite startup no longer evaluates non-local production URL requirements before enabling MSW; the default boot now resets to the normal documented seed scenario and registers the worker before rendering
- category links from Home now initialize the matching Menu category instead of always opening the unfiltered list

Docs updated:
- `README.md`, `docs/24_CHANGE_QUEUE.md`, `docs/17_CHANGELOG.md`

Decision:
- no new architecture decision; DEC-026 dual-service boundaries remain unchanged

Risk:
- menu content remains example seed data pending founder validation; only content-matched, user-approved legacy candidate images are wired and their provenance/production optimization still require confirmation
- the production build retains the existing non-failing Customer main-chunk size warning
- CHG-0006 and CHG-0007 remain local and unmerged without Issues or Pull Requests

## 2026-10-06 — Dual Service Operations Foundation

Added:
- typed Service Context, Waiter role, table-session, Dine-in order/bill/service-request and payment-target contracts
- Customer Dine-in, Admin-hosted Waiter, Admin billing and unified KDS route shells
- Customer/Waiter/Admin API-client modules, MSW operations data/handlers and complete Dine-in scenario catalogue
- mode-aware order, KDS admission, bill-finalization, table/session and loyalty-attribution helpers/tests

Changed:
- V1 from Pickup-only to explicit payment-first Pickup plus waiter-confirmed/end-of-session-billed Dine-in
- one Order aggregate now carries immutable service context; KDS ready outcomes are `READY_FOR_PICKUP` and `READY_TO_SERVE`
- payments target either Pickup Order or Dine-in Table Bill
- Dine-in loyalty finalizes after bill payment by each authenticated order owner's eligible spend

Fixed:
- global “payment before kitchen” wording is now mode-specific across active contracts and docs
- customer submission can no longer be mistaken for Dine-in kitchen confirmation
- payer identity can no longer be mistaken for table-wide loyalty ownership

Docs updated:
- `AGENTS.md`, `README.md`, `docs/00`–`docs/21`, `docs/24_CHANGE_QUEUE.md`, `docs/27_DESIGN_SYSTEM_FOUNDATION.md`, `docs/28_UI_VISUAL_DIRECTION.md`

Decision:
- DEC-026

Risk:
- no production backend/schema exists; documented migrations, RBAC, transactions, audit, concurrency and provider verification remain future implementation work
- founder policies for payment methods, service charge/tax, timeouts, discount/void/refund authority and kitchen capacity remain open

## Initial baseline
Added:
- pickup-first architecture
- customer/KDS/counter/founder surfaces
- OTP
- pizza builder
- capacity pickup
- verified payment
- loyalty ledger
- Pizza Passport
- reorder
- analytics
- adapter-ready integration layer

Excluded:
- delivery
- drivers
- direct marketplace integration
- microservices

## 2026-10-06 — Domain Routing Freeze — Root Landing + App Subdomains

Added:
- minimal Landing application shell and a shared public surface/API URL configuration package
- per-app public environment examples for local, staging and production configuration
- Docker Compose, reusable frontend image build and Caddy host-routing configuration for the four implemented static frontend services

Changed:
- root domain responsibility to Landing/Marketing; Customer now belongs to the `app` subdomain
- KDS and Admin internal routes to root-relative paths on their own subdomains
- local frontend ports to Landing `5173`, Customer `5174`, KDS `5175` and Admin `5176`
- WhatsApp magic-link continuation target to the Customer app host

Docs updated:
- `README.md`, `docs/04_USER_FLOWS.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/10_API_CONTRACTS.md`, `docs/15_BUILD_PLAN.md`, `docs/16_DECISIONS.md`, `docs/21_DEPLOYMENT_ARCHITECTURE.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- DEC-024

Risk:
- API, worker, PostgreSQL and Redis containers remain intentionally absent until their real runtimes exist. Real DNS, session and CORS enforcement remain provider/backend work; no environment was deployed.

## 2026-10-06 — Pizza Avenue Design System Foundation

Added:
- design-system foundation covering colour roles, Phudu/Poppins typography, spacing, layout, radius, imagery, motion, accessibility and responsive principles
- visual-direction guide interpreting the four supplied references without copying their identities or layouts
- preliminary menu inventory of eight categories and 29 items, explicitly pending founder validation
- local documentation copies of the supplied references and six unique Pizza Wave food-image candidates for review only

Changed:
- frontend reading paths now include the current design foundation and visual direction
- legacy Pizza Wave component and asset reuse is documented as selective logic/content evaluation rather than direct visual reuse
- the initial typography proposal was withdrawn; typography now matches the verified primary Pizza Wave application pair: Phudu 600/700 for display and Poppins 400/500/600/700 for body/UI

Fixed:
- logo status is explicit: no mark or legacy identity may be assumed before an approved Pizza Avenue logo is supplied
- palette authority is limited to the seven official Reference 01 colours

Docs updated:
- `AGENTS.md`, `README.md`, `docs/06_DESIGN_SYSTEM.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/20_MASTER_INDEX.md`, `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`, `docs/24_CHANGE_QUEUE.md`, `docs/27_DESIGN_SYSTEM_FOUNDATION.md`, `docs/28_UI_VISUAL_DIRECTION.md`

Decision:
- DEC-025

Risk:
- candidate imagery remains exploratory until founder approval, provenance confirmation, menu-content matching and production optimization
- exact logo, final production photography and preliminary menu details remain open

## 2026-10-05 — Architecture Freeze — Node/NestJS + Hostinger + WhatsApp Magic Login

Added:
- dual passwordless auth: phone OTP plus QR → WhatsApp verified sender → one-time magic link
- shared auth identities, hashed magic tokens, QR sources and secure cookie sessions
- WhatsApp provider/auth boundaries and acquisition analytics funnel
- transactional outbox, Redis/BullMQ jobs and idempotent consumer requirements
- Hostinger KVM 2, Ubuntu 24.04, Docker Compose, Caddy and Cloudflare/R2 topology
- off-server database backup, retention and restore-testing requirements

Changed:
- backend freeze from FastAPI/Python to Node.js LTS, TypeScript, NestJS and Prisma
- production strategy from unspecified/managed-platform assumptions to a consolidated portable VPS
- KDS path to canonical `CONFIRMED → PREPARING → READY`; payment success remains separate
- pickup availability clarified as a calculation, with stored reservations beginning at `HELD`
- loyalty/Passport trigger standardized on idempotent `ORDER_COMPLETED` processing

Fixed:
- client payment success can no longer be read as operational confirmation
- duplicate WhatsApp/payment/outbox events now have explicit database and consumer idempotency rules
- session, CSRF, secret logging, webhook verification and backup boundaries are documented

Docs updated:
- `AGENTS.md`, `README.md` and `docs/00` through `docs/20`

Decision:
- DEC-003, DEC-012 through DEC-022

Risk:
- single-VPS availability remains a conscious V1 tradeoff; off-server backups, monitoring and a portable scaling path reduce but do not remove it
- WhatsApp provider onboarding/templates, precise auth durations and founder policies remain to be confirmed before implementation

## 2026-10-05 — Repository Governance and GitHub Bootstrap

Added:
- root `.gitignore` covering Node/pnpm outputs, environment secrets, private keys, logs, database dumps and local tooling
- mandatory change-queue and Git workflow references in the agent operating manual

Changed:
- master/recommended reading paths now include deployment, Git/GitHub, coding-agent and change-queue governance documents
- documented the one-time empty-remote branch-seeding exception required to establish `main` and `develop`
- future work is explicitly required to use a tracked short-lived branch and Pull Request

Fixed:
- `docs/21` through `docs/25` are now discoverable from the master index and mandatory agent instructions
- coding-agent startup instructions now require the change queue and its agent rules

Docs updated:
- `AGENTS.md`, `README.md`, `docs/17_CHANGELOG.md`, `docs/20_MASTER_INDEX.md`, `docs/22_GIT_GITHUB_WORKFLOW_RULES.md`, `docs/23_CODING_AGENT_PROMPTING_GUIDE.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- No product or application architecture decision changed

Risk:
- branch protection and required reviews remain GitHub repository settings for the owner to enable; this bootstrap does not weaken the documented rule

## 2026-10-05 — Frontend Stage 1 Architecture Foundation

Added:
- pnpm workspace with React 19/Vite/TypeScript Customer, KDS and Admin applications
- route-complete neutral shells for all requested Customer, KDS and Admin paths
- shared domain contracts for identity, store, menu, cart, pickup, order, payment, loyalty, rewards, Passport, promotions, upsells, analytics and errors
- typed `/api/v1` client modules, consistent error normalization and backend-replacement boundary
- MSW handlers, realistic Pizza Avenue fixtures, factories and switchable prototype scenarios
- TanStack Query providers/query keys, client-only Zustand scenario/builder state and React Hook Form/Zod validation foundations
- Vitest/React Testing Library/MSW tests and GitHub Actions validation for lint, typecheck, tests and builds

Changed:
- money contracts now explicitly use integer paise and `INR`
- repository README now documents app commands, validation and mock enablement
- Stage 1 mock endpoints follow the frozen API contracts rather than simplified prompt examples

Fixed:
- route modules no longer depend on page-level mock JSON or direct `fetch()` calls
- mock network interception uses a late-bound fetch implementation so browser and test transports share the same API-client boundary

Docs updated:
- `README.md`, `docs/16_DECISIONS.md`, `docs/17_CHANGELOG.md`, `docs/24_CHANGE_QUEUE.md`

Decision:
- DEC-023

Risk:
- fixture menu prices remain examples pending founder-approved production menu truth
- MSW proves frontend boundaries only; future NestJS work must still enforce pricing, permissions, state, transactions and idempotency server-side
