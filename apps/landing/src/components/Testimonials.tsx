import { useEffect, useRef, useState } from 'react';
import { googleMapsReviewsUrl } from '../landing-content';

const testimonials = [
  { id: 'rikitha', quote: 'Easily some of the best pizzas Sainikpuri has to offer.', name: 'Rikitha Raj', initials: 'RR', color: '#EADCC8' },
  { id: 'siddharth', quote: 'The flavors were spot on', name: 'Siddharth Illendula', initials: 'SI', color: '#A7B58B' },
  { id: 'srekar', quote: 'The garlic chicken bread was absolutely amazing.', name: 'srekar reddy', initials: 'SR', color: '#EADCC8' },
] as const;

export function Testimonials() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [stepWidth, setStepWidth] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      const card = track.querySelector<HTMLElement>('.avenue-review-card');
      if (!card) return;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      setStepWidth(card.getBoundingClientRect().width + gap);
    };

    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(viewport);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (paused || motionPreference?.matches) return;
    const timer = window.setInterval(() => setSlideIndex((index) => index + 1), 2000);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (animate) return;
    const frame = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(frame);
  }, [animate]);

  return (
    <section id="reviews" className="avenue-notes" aria-labelledby="notes-title">
      <div className="avenue-notes__heading">
        <span className="avenue-section-pill">Google Reviews</span>
        <h2 id="notes-title">REAL TALK</h2>
        <p>Pizza Avenue, in the words of our guests on Google Maps.</p>
      </div>
      <div
        className="avenue-notes__viewport"
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer reviews"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
        }}
      >
        <div
          className="avenue-notes__track"
          ref={trackRef}
          data-slide-index={slideIndex}
          style={{ transform: `translate3d(${-slideIndex * stepWidth}px, 0, 0)`, transition: animate ? undefined : 'none' }}
          onTransitionEnd={(event) => {
            if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
            if (slideIndex >= testimonials.length) {
              setAnimate(false);
              setSlideIndex(0);
            }
          }}
        >
          {[...testimonials, ...testimonials].map((review, index) => {
            const duplicate = index >= testimonials.length;
            return (
              <article className="avenue-review-card" key={`${review.id}-${index}`} aria-hidden={duplicate}>
                <div className="avenue-review-card__stars" aria-label="5 out of 5 stars" role="img">★★★★★</div>
                <blockquote>“{review.quote}”</blockquote>
                <div className="avenue-review-card__author">
                  <span className="avenue-review-card__avatar" style={{ backgroundColor: review.color }} aria-hidden="true">{review.initials}</span>
                  <div><strong>{review.name}</strong><span>Google Maps review</span></div>
                  <a href={googleMapsReviewsUrl} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label="View Pizza Avenue reviews on Google Maps">↗</a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
