import { useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';

export interface ItemContent {
  title: string;
  description: string;
  image: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}

interface Props {
  contentA: ItemContent;
  contentB: ItemContent;
  contentC: ItemContent;
}

const thresholds = [0, 1 / 3, 2 / 3, 1] as const;

export default function ScrollRevealContentA({ contentA, contentB, contentC }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(Math.min(1, Math.max(0, latest)));
  });

  const content = [contentA, contentB, contentC];
  const activeIndex = Math.min(2, Math.floor(scrollProgress * 3));

  return (
    <div className="story-reveal-root" ref={sectionRef}>
      <div className="story-reveal-track">
        <div className="story-reveal-sticky">
          <div className="story-reveal-columns">
            <div className="story-reveal-text-col">
              {content.map((item, index) => {
                const start = thresholds[index] ?? 0;
                const end = thresholds[index + 1] ?? 1;
                const fill = Math.min(100, Math.max(0, ((scrollProgress - start) / (end - start)) * 100));
                return (
                  <div
                    className={`story-point-item ${index === activeIndex ? 'is-current' : index < activeIndex ? 'is-done' : 'is-upcoming'}`}
                    key={item.title}
                  >
                    <div className="story-point-number-row"><span className="story-point-number">0{index + 1}</span></div>
                    <div className="story-point-body">
                      <div className="story-point-bar-track" aria-hidden="true">
                        <div className="story-point-bar-bg" />
                        <div className="story-point-bar-fill" style={{ height: `${fill}%` }} />
                      </div>
                      <div className="story-point-text">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                    <img className="story-point-mobile-image" src={item.image.url} width={item.image.width} height={item.image.height} alt={item.image.alt} loading="lazy" />
                  </div>
                );
              })}
            </div>
            <div className="story-reveal-media-col">
              <div className="story-reveal-stage">
                {content.map((item, index) => (
                  <img
                    key={item.image.url}
                    className={`story-reveal-image ${index === activeIndex ? 'is-active' : 'is-hidden'}`}
                    src={item.image.url}
                    width={item.image.width}
                    height={item.image.height}
                    alt={index === activeIndex ? item.image.alt : ''}
                    aria-hidden={index !== activeIndex}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="story-reveal-spacer" aria-hidden="true" />
      </div>
    </div>
  );
}
