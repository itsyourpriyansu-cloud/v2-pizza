import { useCallback, useEffect, useRef, useState } from 'react';
import { cateringPackages } from '../landing-content';

interface CateringSectionProps {
  readonly customerAppUrl: string;
}

function customerUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString();
}

export function CateringSection({ customerAppUrl }: CateringSectionProps) {
  const menuUrl = customerUrl(customerAppUrl, '/menu');
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(0);
  const isVisibleRef = useRef(true);
  const [activeCard, setActiveCard] = useState(0);

  const showCard = useCallback((index: number, manual = false) => {
    const carousel = carouselRef.current;
    const cards = carousel?.querySelectorAll<HTMLElement>('.catering-card');
    if (!carousel || !cards?.length) return;
    if (manual) lastInteractionRef.current = Date.now();
    const nextIndex = Math.max(0, Math.min(index, cards.length - 1));
    const firstCard = cards.item(0);
    const targetCard = cards.item(nextIndex);
    if (!firstCard || !targetCard) return;
    const left = targetCard.offsetLeft - firstCard.offsetLeft;
    if (typeof carousel.scrollTo === 'function') {
      carousel.scrollTo({ left, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } else {
      carousel.scrollLeft = left;
    }
    setActiveCard(nextIndex);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry?.isIntersecting ?? false;
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!window.matchMedia?.('(max-width: 900px)').matches) return;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      if (!isVisibleRef.current || document.hidden || Date.now() - lastInteractionRef.current < 8000) return;
      showCard((activeCard + 1) % cateringPackages.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [activeCard, showCard]);

  const updateActiveCard = () => {
    const carousel = carouselRef.current;
    const cards = carousel?.querySelectorAll<HTMLElement>('.catering-card');
    if (!carousel || !cards?.length) return;
    const firstCard = cards.item(0);
    if (!firstCard) return;
    const firstLeft = firstCard.offsetLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - firstLeft - carousel.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveCard(closestIndex);
  };

  return (
    <section className="catering-section" id="catering" aria-labelledby="catering-title" ref={sectionRef}>
      <div className="catering-section__container">
        <div className="catering-section__header">
          <span className="catering-badge">Catering & Events</span>
          <h2 id="catering-title" className="catering-title">
            FEED THE CROWD.
          </h2>
          <p className="catering-subtitle">
            Big gathering, bigger appetite? Start with pizza for the whole crew.
          </p>
        </div>

        <div className="catering-grid" ref={carouselRef} onScroll={updateActiveCard} onPointerDown={() => { lastInteractionRef.current = Date.now(); }} role="region" aria-label="Catering packages" tabIndex={0}>
          {cateringPackages.map((pkg) => (
            <article
              key={pkg.id}
              className="catering-card"
              aria-labelledby={`catering-title-${pkg.id}`}
            >
              <div className="catering-card__media">
                <img
                  src={pkg.imageSrc}
                  alt={pkg.imageAlt}
                  loading="lazy"
                  className="catering-card__img"
                />
              </div>

              <div className="catering-card__body" style={{ backgroundColor: pkg.cardBg, color: pkg.textColor }}>
                <div className="catering-card__header-row">
                  <h3 id={`catering-title-${pkg.id}`} className="catering-card__title">
                    {pkg.name}
                  </h3>
                  <span className="catering-card__guest-count" aria-label={`${pkg.guestCount} guests`}>{pkg.guestCount}</span>
                </div>

                <p className="catering-card__serves">{pkg.serves}</p>

                <ul className="catering-card__pills" aria-label={`Included items in ${pkg.name}`}>
                  {pkg.items.map((item) => (
                    <li key={item} className="catering-card__pill">
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={menuUrl}
                  className="catering-card__cta"
                  aria-label={`${pkg.ctaText} for ${pkg.name}`}
                >
                  {pkg.ctaText}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="catering-carousel-controls" role="group" aria-label="Catering carousel controls">
          <button type="button" className="catering-carousel-controls__arrow" aria-label="Previous catering package" onClick={() => showCard(activeCard - 1, true)} disabled={activeCard === 0}>‹</button>
          <div className="catering-carousel-controls__dots" role="group" aria-label="Choose catering package">
            {cateringPackages.map((pkg, index) => (
              <button
                key={pkg.id}
                type="button"
                aria-label={`Show ${pkg.name}`}
                aria-current={activeCard === index ? 'true' : undefined}
                onClick={() => showCard(index, true)}
              />
            ))}
          </div>
          <button type="button" className="catering-carousel-controls__arrow" aria-label="Next catering package" onClick={() => showCard(activeCard + 1, true)} disabled={activeCard === cateringPackages.length - 1}>›</button>
        </div>

        <div className="catering-custom-banner">
          <div className="catering-custom-banner__info">
            <h3 className="catering-custom-banner__title">CUSTOM EVENT CATERING</h3>
            <p className="catering-custom-banner__desc">
              Birthdays, office lunches or a night with friends. Build your order your way.
            </p>
          </div>

          <a
            href={menuUrl}
            className="catering-custom-banner__btn"
            aria-label="Build custom order for event catering"
          >
            BUILD CUSTOM ORDER
          </a>
        </div>
      </div>
    </section>
  );
}
