import { useEffect, useState } from 'react';

interface ComboStripProps {
  readonly customerAppUrl: string;
}

const slides = [
  {
    title: 'COMBO MADNESS',
    subtitle: 'Pizza, sides and something sweet together',
    theme: 'brown',
    images: [
      '/assets/pizza-wave/paneer-cheese-pizza.png',
      '/assets/pizza-wave/chicken-tikka-pizza.png',
      '/assets/pizza-wave/cheesy-garlic-bread.png',
      '/assets/pizza-wave/chocolate-brownie.png',
      '/assets/pizza-wave/mushroom-cheese-pizza.png',
    ],
  },
  {
    title: 'PIZZA NIGHT',
    subtitle: 'Choose your favourites and make it a feast',
    theme: 'sand',
    images: [
      '/assets/pizza-wave/mushroom-cheese-pizza.png',
      '/assets/pizza-wave/cheesy-garlic-bread.png',
      '/assets/pizza-wave/paneer-cheese-pizza.png',
      '/assets/pizza-wave/chocolate-brownie.png',
      '/assets/pizza-wave/chicken-tikka-pizza.png',
    ],
  },
  {
    title: 'PICKUP, SORTED',
    subtitle: 'Order ahead and collect your Pizza Avenue picks',
    theme: 'sage',
    images: [
      '/assets/pizza-wave/chicken-tikka-pizza.png',
      '/assets/pizza-wave/paneer-cheese-pizza.png',
      '/assets/pizza-wave/chocolate-brownie.png',
      '/assets/pizza-wave/cheesy-garlic-bread.png',
      '/assets/pizza-wave/mushroom-cheese-pizza.png',
    ],
  },
] as const;

function PromoSlide({ slide, menuUrl, active }: {
  readonly slide: (typeof slides)[number];
  readonly menuUrl: string;
  readonly active: boolean;
}) {
  return (
    <div className={`combo-strip__slide combo-strip__slide--${slide.theme}`} aria-hidden={!active}>
      {slide.images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          className={`combo-strip__food combo-strip__food--${index + 1}`}
          src={src}
          alt=""
          loading="lazy"
          draggable="false"
        />
      ))}
      <a
        href={menuUrl}
        className="combo-strip__content"
        aria-label={`${slide.title} — Explore Pizza Avenue combos`}
        tabIndex={active ? 0 : -1}
      >
        <h2>{slide.title}</h2>
        <p>{slide.subtitle}</p>
      </a>
    </div>
  );
}

export function ComboStrip({ customerAppUrl }: ComboStripProps) {
  const menuUrl = customerAppUrl ? `${customerAppUrl.replace(/\/$/, '')}/menu` : '#menu';
  const [slideIndex, setSlideIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setSlideIndex((current) => current + 1), 2500);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const currentIndex = slideIndex % slides.length;
  return (
    <section
      className="combo-strip-section"
      aria-label="Pizza Avenue combo highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="combo-strip__viewport" aria-roledescription="carousel">
        <div
          className="combo-strip__track"
          data-slide-index={slideIndex}
          style={{ transform: `translateX(-${slideIndex * 100}%)`, transitionDuration: animate && !reducedMotion ? undefined : '0ms' }}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
            if (slideIndex >= slides.length) {
              setAnimate(false);
              setSlideIndex(0);
              window.requestAnimationFrame(() => setAnimate(true));
            }
          }}
        >
          {slides.map((slide, index) => (
            <PromoSlide key={slide.title} slide={slide} menuUrl={menuUrl} active={currentIndex === index && slideIndex < slides.length} />
          ))}
          <PromoSlide slide={slides[0]} menuUrl={menuUrl} active={false} />
        </div>
      </div>
    </section>
  );
}
