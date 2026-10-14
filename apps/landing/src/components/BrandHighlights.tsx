import { brandPhotoCards, brandStatCards } from '../landing-content';

export function BrandHighlights() {
  return (
    <section className="brand-highlights-section" aria-label="Pizza Avenue Highlights and Standards">
      <div className="brand-highlights-container">
        {/* Top 4 Stat / Metric Cards */}
        <div className="brand-stats-grid" role="region" aria-label="Key Pizza Avenue metrics">
          {brandStatCards.map((stat) => (
            <div
              key={stat.id}
              className="brand-stat-card"
              style={{ backgroundColor: stat.bg, color: stat.textColor }}
              data-testid={`brand-stat-${stat.id}`}
            >
              <span className="brand-stat-card__value">{stat.value}</span>
              <span className="brand-stat-card__label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom 2 High-Impact Photo Cards */}
        <div className="brand-photos-grid" role="region" aria-label="Craft food highlights">
          {brandPhotoCards.map((photo) => (
            <div
              key={photo.id}
              className="brand-photo-card"
              data-testid={`brand-photo-${photo.id}`}
            >
              <img
                src={photo.imageSrc}
                alt={photo.imageAlt}
                loading="lazy"
                className="brand-photo-card__img"
              />
              <div className="brand-photo-card__overlay" aria-hidden="true" />
              <div className="brand-photo-card__caption">
                <h3 className="brand-photo-card__title">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
