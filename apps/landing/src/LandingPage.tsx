import { useState } from 'react';
import { heroCategoryCards } from './landing-content';
import { BrandHighlights } from './components/BrandHighlights';
import { CustomerFlow } from './components/CustomerFlow';
import { ComboStrip } from './components/ComboStrip';
import { CombosSection } from './components/CombosSection';
import { CateringSection } from './components/CateringSection';
import { CravingMenu } from './components/CravingMenu';
import { AppDownloadSection } from './components/AppDownloadSection';
import { Footer } from './components/Footer';
import { Testimonials } from './components/Testimonials';
import { StoryRevealSection } from './components/StoryRevealSection';

interface LandingPageProps {
  readonly customerAppUrl: string;
}

function customerUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString();
}

const logo = '/assets/logo/pizza%20avenue.jpeg';

export function LandingPage({ customerAppUrl }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('hot-selling');
  const menuUrl = customerUrl(customerAppUrl, '/menu');

  return (
    <div className="reference-landing">
      <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="site-header" id="top">
          <div className="header-inner">
            <nav id="primary-nav" className={`primary-nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
              <a href="#combos" onClick={() => setIsMenuOpen(false)}>Deals</a>
              <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Reviews</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>Find us</a>
            </nav>
            <a className="wordmark" href="#top" aria-label="Pizza Avenue home">
              <img src={logo} alt="Pizza Avenue logo" className="wordmark__logo" width={50} height={50} />
              <span className="wordmark__text"><span>Pizza</span> Avenue</span>
            </a>
            <div className="header-actions">
              <a className="header-order" href={menuUrl}>Order now</a>
              <button type="button" className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`} aria-expanded={isMenuOpen} aria-controls="primary-nav" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setIsMenuOpen((open) => !open)}>
                <span className="menu-toggle__bar" /><span className="menu-toggle__bar" /><span className="menu-toggle__bar" />
              </button>
            </div>
          </div>
        </header>
      <main id="main-content">
      <div className="hero-shell">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-center">
              <div className="hero-pill"><span aria-hidden="true">✦</span> Freshly made for Sainikpuri</div>
              <h1 id="hero-title" className="hero-title" aria-label="CRAVE IT. TAP IT. PICK IT UP."><span className="hero-title__line">CRAVE IT.</span><span className="hero-title__line">TAP IT. PICK IT UP.</span></h1>
              <div className="hero-actions">
                <a className="hero-btn--primary" href={menuUrl}>ORDER FOR PICKUP <span aria-hidden="true">↗</span></a>
                <a className="hero-btn--secondary" href="#menu">VIEW MENU</a>
              </div>
            </div>
            <div className="hero-carousel" aria-label="Explore our menu categories">
              <div className="hero-carousel__track">
                {[...heroCategoryCards, ...heroCategoryCards].map((card, index) => (
                  <a key={`${card.id}-${index}`} href="#menu" className="hero-card" style={{ backgroundColor: card.badgeBg }} tabIndex={index >= heroCategoryCards.length ? -1 : 0} aria-hidden={index >= heroCategoryCards.length ? 'true' : undefined}>
                    <div className="hero-card__media"><img src={card.imageSrc} alt={card.imageAlt} /></div>
                    <div className="hero-card__label" style={{ color: card.badgeColor }}>{card.label}</div>
                  </a>
                ))}
              </div>
            </div>
          </section>
      </div>
      <StoryRevealSection />
      <CravingMenu customerAppUrl={customerAppUrl} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      <BrandHighlights />
      <CustomerFlow customerAppUrl={customerAppUrl} />
      <ComboStrip customerAppUrl={customerAppUrl} />
      <CombosSection customerAppUrl={customerAppUrl} />
      <CateringSection customerAppUrl={customerAppUrl} />
      <Testimonials />
      <AppDownloadSection customerAppUrl={customerAppUrl} />
      </main>
      <Footer customerAppUrl={customerAppUrl} onSelectMenuCategory={setActiveCategory} />
    </div>
  );
}
