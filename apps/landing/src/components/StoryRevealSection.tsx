import ScrollRevealContentA, { type ItemContent } from './ui/scroll-reveal-content-a';

const stories: [ItemContent, ItemContent, ItemContent] = [
  {
    title: 'IT STARTED WITH A CART',
    description: 'Pizza Avenue began as a kiosk cart with a simple idea: make pizza people would want to come back for.',
    image: {
      url: '/assets/story/kiosk-cart.png',
      width: 1024,
      height: 1024,
      alt: 'Illustration of a small pizza kiosk cart serving a guest',
    },
  },
  {
    title: 'THE IDEA GREW',
    description: 'What began at the cart grew into something bigger, with the same hands-on care for every pizza.',
    image: {
      url: '/assets/story/craft-grows.png',
      width: 1024,
      height: 1024,
      alt: 'Illustration of pizzas being prepared by hand in a small kitchen',
    },
  },
  {
    title: 'NOW A PIZZERIA',
    description: 'Today, Pizza Avenue welcomes guests at its Sainikpuri pizzeria, where the story continues with every fresh pizza.',
    image: {
      url: '/assets/story/pizzeria.png',
      width: 1024,
      height: 1024,
      alt: 'Illustration of guests being served pizza inside a neighborhood pizzeria',
    },
  },
];

export function StoryRevealSection() {
  return (
    <section className="story-reveal-section" aria-labelledby="story-reveal-heading">
      <div className="story-reveal-header">
        <span className="story-reveal-eyebrow">OUR STORY</span>
        <h2 id="story-reveal-heading">FROM CART TO PIZZERIA.</h2>
        <p>From a humble kiosk cart to a place to gather over pizza. This is the Pizza Avenue journey.</p>
      </div>
      <ScrollRevealContentA contentA={stories[0]} contentB={stories[1]} contentC={stories[2]} />
    </section>
  );
}
