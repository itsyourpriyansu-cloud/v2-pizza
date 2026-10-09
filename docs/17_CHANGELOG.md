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

## 2026-10-09 — Publish assembled Landing chapters for review

Changed:
- Collected the Landing chapters, UI primitives, styling, image assets, logo, responsive work and test updates tracked by CHG-0005 through CHG-0019 on `feature/landing-initial-ui` for review in Pull Request #13.
- Corrected the change queue to show the existing review state and the current verification result.

Docs updated:
- `docs/17_CHANGELOG.md`
- `docs/24_CHANGE_QUEUE.md`

Verification:
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (6 files, 44 tests) and `pnpm build` passed locally.

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
