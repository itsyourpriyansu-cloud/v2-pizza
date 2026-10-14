import { useState, useRef, useEffect, useCallback } from 'react';
import {
  cravingCategories,
  cravingMenuItems,
  CravingMenuItem,
} from '../landing-content';

interface CravingMenuProps {
  readonly customerAppUrl: string;
  readonly activeCategory: string;
  readonly onSelectCategory: (categoryId: string) => void;
}

function customerUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString();
}

export function CravingMenu({ customerAppUrl, activeCategory, onSelectCategory }: CravingMenuProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const menuUrl = customerUrl(customerAppUrl, '/menu');

  const filteredItems: readonly CravingMenuItem[] = cravingMenuItems.filter(
    (item) => item.category === activeCategory,
  );

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollLeft = 0;
    }
    checkScroll();
  }, [activeCategory, checkScroll]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    checkScroll();
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, filteredItems]);

  const scroll = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.craving-card') as HTMLElement | null;
    const gap = Number.parseFloat(window.getComputedStyle(el).columnGap) || 16;
    const scrollAmount = card ? card.offsetWidth + gap : (el.clientWidth || 300) * 0.7;
    const delta = direction === 'next' ? scrollAmount : -scrollAmount;
    if (typeof el.scrollBy === 'function') {
      el.scrollBy({
        left: delta,
        behavior: 'smooth',
      });
    } else {
      el.scrollLeft += delta;
    }
  };

  return (
    <section
      className="craving-menu-section"
      id="menu"
      aria-labelledby="craving-menu-title"
    >
      <div className="craving-menu-inner">
        <div className="craving-menu-header">
          <span className="craving-menu-pill">Menu</span>
          <h2 id="craving-menu-title" className="craving-menu-title">
            PICK YOUR CRAVING
          </h2>
          <p className="craving-menu-subtitle">
            Every bite hits different. Choose your category and feast.
          </p>

          <div
            className="craving-tabs"
            role="tablist"
            aria-label="Food Categories"
          >
            {cravingCategories.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="craving-menu-panel"
                  className={`craving-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="craving-carousel-wrapper">
          <div
            id="craving-menu-panel"
            className="craving-carousel-track"
            ref={trackRef}
            tabIndex={0}
            role="tabpanel"
            aria-label="Craving menu dishes"
          >
            {filteredItems.map((item) => (
              <article className="craving-card" key={item.id}>
                <div className="craving-card__media">
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="craving-card__img"
                  />
                  {item.dietaryLabel && (
                    <span
                      className={`craving-card__dietary craving-card__dietary--${
                        item.dietaryLabel === 'Veg' ? 'veg' : 'non-veg'
                      }`}
                      aria-label={item.dietaryLabel}
                    >
                      <span className="craving-card__dietary-dot" />
                    </span>
                  )}
                </div>

                <div className="craving-card__content">
                  <h3 className="craving-card__name">{item.name}</h3>
                  <p className="craving-card__desc">{item.description}</p>

                  <div className="craving-card__bottom">
                    <span className="craving-card__price">{item.price}</span>
                    <a
                      href={menuUrl}
                      className="craving-card__action"
                      aria-label={`Order ${item.name} in the customer app`}
                    >
                      ORDER NOW
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="craving-nav" aria-label="Menu carousel navigation">
          <button
            type="button"
            className="craving-nav__btn"
            onClick={() => scroll('prev')}
            disabled={!canScrollLeft}
            aria-label="Previous dishes"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="craving-nav__btn"
            onClick={() => scroll('next')}
            disabled={!canScrollRight}
            aria-label="Next dishes"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <p className="craving-menu-note">
          *Prototype menu pricing; final availability and totals are confirmed in checkout.
        </p>
      </div>
    </section>
  );
}
