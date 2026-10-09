import { cravingCategories } from '../landing-content';

interface FooterProps {
  readonly customerAppUrl: string;
  readonly onSelectMenuCategory: (categoryId: string) => void;
}

const locationQuery =
  'Pizza Avenue, Plot 807, Ground Floor, Defence Colony, Sainikpuri, Secunderabad, Telangana 500094';
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=16&output=embed`;

export function Footer({ customerAppUrl, onSelectMenuCategory }: FooterProps) {
  const menuUrl = new URL('menu', `${customerAppUrl.replace(/\/$/, '')}/`).toString();
  const webAppUrl = `${customerAppUrl.replace(/\/$/, '')}/`;

  return (
    <footer className="avenue-footer" id="contact" aria-label="Site Footer">
      <div className="avenue-footer__grid">
        <div className="avenue-footer__left">
          <div className="avenue-footer__links">
            <nav aria-label="Footer quick links">
              <h3>QUICK LINKS</h3>
              <a href="#menu">MENU</a>
              <a href="#combos">DEALS</a>
              <a href="#reviews">REVIEWS</a>
              <a href="#contact">FIND US</a>
            </nav>
            <div className="avenue-footer__categories">
              <h3>MENU CATEGORIES</h3>
              {cravingCategories.map((category) => (
                <a key={category.id} href="#menu" onClick={() => onSelectMenuCategory(category.id)}>{category.label}</a>
              ))}
            </div>
            <div className="avenue-footer__webapp">
              <h3>GET THE APP</h3>
              <a href={webAppUrl} aria-label="Open the Pizza Avenue web app">
                <span className="avenue-footer__webapp-icon" aria-hidden="true">↗</span>
                <span><small>ORDER ON THE</small><strong>Web App</strong></span>
              </a>
            </div>
          </div>

          <div className="avenue-footer__promo">
            <h3>NEVER MISS A GOOD SLICE</h3>
            <p>Explore the latest pickup picks and offers in the web app.</p>
            <a href={menuUrl}>EXPLORE THE MENU <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="avenue-footer__map-wrap">
          <div className="avenue-footer__map">
            <iframe
              title="Map of Pizza Avenue in Sainikpuri"
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="avenue-footer__map-link">
            OPEN IN GOOGLE MAPS <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="avenue-footer__contact">
          <h3>COME SAY HI</h3>
          <div className="avenue-footer__contact-row">
            <span className="avenue-footer__contact-icon" aria-hidden="true">⌖</span>
            <p><strong>PIZZA AVENUE</strong><br />Plot 807, Ground Floor<br />Defence Colony, Sainikpuri<br />Secunderabad, Telangana 500094</p>
          </div>
          <div className="avenue-footer__contact-row">
            <span className="avenue-footer__contact-icon" aria-hidden="true">↗</span>
            <p><strong>PICKUP IN SAINIKPURI</strong><br />Order ahead and collect fresh at the counter.</p>
          </div>
          <a className="avenue-footer__directions" href={mapsUrl} target="_blank" rel="noopener noreferrer">
            GET DIRECTIONS <span aria-hidden="true">↗</span>
          </a>
          <div className="avenue-footer__social">
            <span>FOLLOW US</span>
            <a href="https://www.instagram.com/the.pizza.avenue/" target="_blank" rel="noopener noreferrer" aria-label="Pizza Avenue on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="avenue-footer__bottom"><span>THE ONLY ROUTE TO REAL FLAVOR</span><span>© {new Date().getFullYear()} Pizza Avenue</span></div>
      <div className="avenue-footer__banner" aria-hidden="true"><span>PIZZA</span><img src="/assets/logo/pizza%20avenue.jpeg" alt="" /><span>AVENUE</span></div>
    </footer>
  );
}
