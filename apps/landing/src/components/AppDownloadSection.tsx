import { Search, ShoppingBag, Store } from 'lucide-react';

interface AppDownloadSectionProps {
  readonly customerAppUrl: string;
}

export function AppDownloadSection({ customerAppUrl }: AppDownloadSectionProps) {
  const menuUrl = new URL('menu', `${customerAppUrl.replace(/\/$/, '')}/`).toString();
  const items = [
    { name: 'Classic Margherita', image: '/assets/pizza-wave/hero-main-pizza.png' },
    { name: 'Paneer Makhani', image: '/assets/pizza-wave/paneer-cheese-pizza.png' },
    { name: 'Chicken Tikka', image: '/assets/pizza-wave/chicken-tikka-pizza.png' },
    { name: 'Cheesy Garlic Bread', image: '/assets/pizza-wave/cheesy-garlic-bread.png' },
  ];

  return (
    <section className="avenue-app-section" id="order-online" aria-labelledby="app-download-title">
      <div className="avenue-app-inner">
        <div className="avenue-phone" aria-hidden="true">
          <div className="avenue-phone__speaker" />
          <div className="avenue-phone__screen">
            <div className="avenue-phone__top"><span>9:41</span><span>●●●</span></div>
            <div className="avenue-phone__brand"><img src="/assets/logo/pizza%20avenue.jpeg" alt="" /><span>Pizza Avenue</span></div>
            <p className="avenue-phone__eyebrow">Sainikpuri pickup</p>
            <h3>What are you craving?</h3>
            <div className="avenue-phone__items">
              {items.map((item) => (
                <div key={item.name}><img src={item.image} alt="" /><span>{item.name}</span><b>＋</b></div>
              ))}
            </div>
            <div className="avenue-phone__bar"><span>Explore menu</span><span>→</span></div>
          </div>
        </div>
        <div className="avenue-app-copy">
          <span className="avenue-section-pill">Order online</span>
          <h2 id="app-download-title">ORDER IN <em>3 STEPS.</em><br />SERIOUSLY.</h2>
          <p>Browse your favourites, pick a convenient time and collect your pizza fresh from our Sainikpuri counter.</p>
          <div className="avenue-app-actions">
            <a href={menuUrl}>START AN ORDER <span aria-hidden="true">↗</span></a>
            <a href="#menu">EXPLORE THE MENU</a>
          </div>
          <ol className="avenue-app-steps">
            <li><Search aria-hidden="true" />Browse</li>
            <li><ShoppingBag aria-hidden="true" />Order</li>
            <li><Store aria-hidden="true" />Pick up</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
