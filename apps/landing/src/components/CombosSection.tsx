import { comboOffers } from '../landing-content';

interface CombosSectionProps {
  readonly customerAppUrl: string;
}

function customerUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString();
}

export function CombosSection({ customerAppUrl }: CombosSectionProps) {
  const menuUrl = customerUrl(customerAppUrl, '/menu');

  return (
    <section className="combos-section" id="combos" aria-labelledby="combos-title">
      <div className="combos-section__container">
        {/* Section Header */}
        <div className="combos-section__header">
          <span className="combos-badge">Deals</span>
          <h2 id="combos-title" className="combos-title">
            COMBOS THAT MAKE SENSE
          </h2>
          <p className="combos-subtitle">
            Pizza, sides and something sweet. Find your kind of feast.
          </p>
        </div>

        {/* 2x2 Combos Grid */}
        <div className="combos-grid">
          {comboOffers.map((combo) => (
            <article
              key={combo.id}
              className="combo-card"
              style={{ backgroundColor: combo.cardBg, color: combo.textColor }}
              aria-labelledby={`combo-title-${combo.id}`}
            >
              <div className="combo-card__media">
                <img
                  src={combo.imageSrc}
                  alt={combo.imageAlt}
                  loading="lazy"
                  className="combo-card__img"
                />
              </div>

              <div className="combo-card__content">
                <div className="combo-card__top">
                  <span
                    className="combo-card__save-badge"
                    style={{
                      backgroundColor: combo.badgeBg,
                      color: combo.badgeColor,
                    }}
                  >
                    {combo.badgeText}
                  </span>
                  <h3 id={`combo-title-${combo.id}`} className="combo-card__title">
                    {combo.name}
                  </h3>
                </div>

                <ul className="combo-card__items" aria-label={`Included in ${combo.name}`}>
                  {combo.items.map((item) => (
                    <li key={item} className="combo-card__item">
                      <span className="combo-card__bullet" aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="combo-card__footer">
                  <div className="combo-card__pricing"><span className="combo-card__discount-price">Pickup ready</span></div>

                  <a
                    href={menuUrl}
                    className="combo-card__cta"
                    aria-label={`${combo.ctaText} for ${combo.name}`}
                  >
                    {combo.ctaText}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* See More Action */}
        <div className="combos-section__action">
          <a
            href={menuUrl}
            className="combos-see-more-btn"
            aria-label="See more deals and combos in the menu"
          >
            SEE MORE
          </a>
        </div>
      </div>
    </section>
  );
}
