import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createSurfaceConfig } from '@pizza-avenue/config';
import '@fontsource/phudu/latin-600.css';
import '@fontsource/phudu/latin-700.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import './styles.css';

const surfaceConfig = createSurfaceConfig(import.meta.env, window.location.origin);
const orderMenuUrl = `${surfaceConfig.customerAppUrl}/menu`;

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="The Pizza Avenue home">
      <span className="wordmark__eyebrow">The</span>
      <span className="wordmark__name">Pizza Avenue</span>
    </a>
  );
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" focusable="false">
      <path d="M4 16 16 4M7 4h9v9" />
    </svg>
  );
}

function PizzaIllustration() {
  return (
    <div className="pizza-art" aria-hidden="true">
      <div className="pizza-art__sun" />
      <div className="pizza-art__plate" />
      <div className="pizza-art__pizza pizza-art__pizza--back" />
      <div className="pizza-art__pizza pizza-art__pizza--front">
        <span className="pizza-art__basil pizza-art__basil--one" />
        <span className="pizza-art__basil pizza-art__basil--two" />
        <span className="pizza-art__basil pizza-art__basil--three" />
        <span className="pizza-art__tomato pizza-art__tomato--one" />
        <span className="pizza-art__tomato pizza-art__tomato--two" />
        <span className="pizza-art__tomato pizza-art__tomato--three" />
      </div>
      <span className="pizza-art__flour pizza-art__flour--one" />
      <span className="pizza-art__flour pizza-art__flour--two" />
      <span className="pizza-art__flour pizza-art__flour--three" />
    </div>
  );
}

export function LandingPage() {
  return (
    <div id="top" className="landing-page">
      <header className="site-header">
        <Wordmark />
        <nav className="site-header__nav" aria-label="Main navigation">
          <a href="#why-pickup">Why pickup</a>
          <a href="#visit">Our avenue</a>
        </nav>
        <a className="button button--compact" href={orderMenuUrl}>
          Order pickup <ArrowUpRight />
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">Sainikpuri, Hyderabad</p>
            <h1 id="hero-title">
              Pizza made for <em>your</em> avenue.
            </h1>
            <p className="hero__intro">
              Fresh from the oven, ready when you are. Order direct and pick up a
              little neighbourhood comfort.
            </p>
            <div className="hero__actions">
              <a className="button" href={orderMenuUrl}>
                Start an order <ArrowUpRight />
              </a>
              <a className="text-link" href="#why-pickup">
                See how pickup works <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <PizzaIllustration />
            <p className="hero__visual-note">Made for the moments between plans.</p>
          </div>
        </section>

        <section id="why-pickup" className="promise" aria-labelledby="promise-title">
          <p className="eyebrow">A better way to take it home</p>
          <h2 id="promise-title">A direct route to dinner.</h2>
          <div className="promise__items">
            <p><strong>01</strong> Choose what you’re craving.</p>
            <p><strong>02</strong> We make it fresh for your pickup.</p>
            <p><strong>03</strong> Take the good part with you.</p>
          </div>
        </section>

        <section id="visit" className="visit" aria-labelledby="visit-title">
          <div>
            <p className="eyebrow">The Pizza Avenue</p>
            <h2 id="visit-title">Your new neighbourhood pizza stop.</h2>
          </div>
          <a className="button button--light" href={orderMenuUrl}>
            Explore the menu <ArrowUpRight />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <Wordmark />
        <p>Pickup-first pizza, from Sainikpuri with warmth.</p>
        <a href={orderMenuUrl}>Order pickup</a>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <LandingPage />
    </StrictMode>,
  );
}
