import { proofPoints, signaturePizzas } from './landing-content';

interface LandingPageProps {
  readonly customerAppUrl: string;
}

function customerUrl(baseUrl: string, path: string): string {
  return new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/$/, '')}/`).toString();
}

export function LandingPage({ customerAppUrl }: LandingPageProps) {
  const menuUrl = customerUrl(customerAppUrl, '/menu');
  const rewardsUrl = customerUrl(customerAppUrl, '/rewards');

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="utility-strip" role="note" aria-label="Store pickup information">
        <span>Sainikpuri</span>
        <span aria-hidden="true">·</span>
        <span>Pickup available today</span>
        <span aria-hidden="true">·</span>
        <span>Order direct</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="Pizza Avenue home">
            <span>Pizza</span> Avenue
          </a>

          <nav className="primary-nav" aria-label="Primary navigation">
            <a href={menuUrl}>Menu</a>
            <a href="#signatures">Our Pizzas</a>
            <a href={rewardsUrl}>Pizza Passport</a>
          </nav>

          <a className="button button--primary header-order" href={menuUrl}>
            Order pizza
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Neighbourhood pizza · Sainikpuri</p>
            <h1 id="hero-title">Pizza made the way evenings deserve.</h1>
            <p className="hero-description">
              Handcrafted pizzas, fresh toppings and comforting Italian favourites — made for
              easy evenings, long conversations and one more slice.
            </p>

            <div className="hero-actions" aria-label="Order actions">
              <a className="button button--primary" href={menuUrl}>
                Order for pickup
              </a>
              <a className="button button--secondary" href="#signatures">
                Explore the menu
              </a>
            </div>

            <p className="pickup-note">
              <span className="pickup-note__mark" aria-hidden="true" />
              Pickup from Pizza Avenue · Sainikpuri
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-visual__frame">
              <img
                src="/assets/pizza-wave/hero-main-pizza.png"
                alt="A hand lifting a cheese-topped vegetable pizza slice from a freshly baked pizza"
                fetchPriority="high"
              />
            </div>
            <p className="hero-visual__caption">Made fresh. Best shared.</p>
            <span className="hero-visual__stamp" aria-hidden="true">
              Sainikpuri
            </span>
          </div>
        </section>

        <section className="proof-strip" aria-label="Pizza Avenue promises">
          <div className="proof-strip__inner">
            {proofPoints.map((point, index) => (
              <div className="proof-point" key={point}>
                <span className="proof-point__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="signatures" id="signatures" aria-labelledby="signatures-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The first round</p>
              <h2 id="signatures-title">Start with the favourites.</h2>
            </div>
            <p>
              The pizzas people come back for. Pick one now, then customise it in the ordering
              app.
            </p>
          </div>

          <div className="pizza-grid">
            {signaturePizzas.map((pizza, index) => (
              <article className="pizza-card" key={pizza.name}>
                <div className="pizza-card__media">
                  <img
                    src={pizza.imageSrc}
                    alt={pizza.imageAlt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <span
                    className={`dietary-badge dietary-badge--${pizza.dietaryLabel === 'Veg' ? 'veg' : 'non-veg'}`}
                  >
                    {pizza.dietaryLabel}
                  </span>
                </div>
                <div className="pizza-card__content">
                  <div>
                    <h3>{pizza.name}</h3>
                    <p>{pizza.description}</p>
                  </div>
                  <div className="pizza-card__footer">
                    <span className="pizza-price">{pizza.price}</span>
                    <a href={menuUrl} aria-label={`Choose ${pizza.name} in the ordering app`}>
                      Choose pizza <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="menu-note">
            <p>*Prototype menu pricing; final availability and totals are confirmed in checkout.</p>
            <a className="text-link" href={menuUrl}>
              View the full ordering menu <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
