"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type InfiniteMovingCardItem = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  avatar?: string;
  name?: string;
  role?: string;
  rating?: number;
  tags?: readonly string[] | string[];
};

export type InfiniteMovingCardsProps<
  T extends InfiniteMovingCardItem = InfiniteMovingCardItem,
> = {
  items: readonly T[] | T[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  className?: string;
  cardClassName?: string;
  gap?: number;
  loop?: boolean;
  showGradientMask?: boolean;
  renderItem?: (item: T, index: number) => React.ReactNode;
};

const SPEED_PX_PER_SEC: Record<
  NonNullable<InfiniteMovingCardsProps["speed"]>,
  number
> = {
  slow: 26,
  normal: 44,
  fast: 74,
};

function renderStars(rating: number) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  return Array.from({ length: stars }, (_, i) => (
    <span key={`star-${i}`} className="text-amber-400">
      ★
    </span>
  ));
}

export function InfiniteMovingCards<
  T extends InfiniteMovingCardItem = InfiniteMovingCardItem,
>({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  cardClassName,
  gap = 20,
  loop = true,
  showGradientMask = true,
  renderItem,
}: InfiniteMovingCardsProps<T>) {
  const reduceMotion = useReducedMotion() === true;
  const x = useMotionValue(0);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [singleWidth, setSingleWidth] = React.useState(0);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);

  const safeItems = items ?? [];
  const renderedItems = loop ? [...safeItems, ...safeItems] : safeItems;

  React.useLayoutEffect(() => {
    const viewportNode = viewportRef.current;
    const trackNode = trackRef.current;
    if (!viewportNode || !trackNode) return;

    const measure = () => {
      const full = trackNode.scrollWidth;
      const widthPerSet = loop ? full / 2 : full;
      setSingleWidth(widthPerSet);
      setViewportWidth(viewportNode.clientWidth);
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewportNode);
    observer.observe(trackNode);
    return () => observer.disconnect();
  }, [gap, loop, safeItems.length]);

  React.useEffect(() => {
    if (singleWidth <= 0) return;
    x.set(direction === "right" ? -singleWidth : 0);
  }, [direction, singleWidth, x]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || safeItems.length <= 1) return;
    if (pauseOnHover && hovered) return;
    if (singleWidth <= 0) return;

    const velocity = SPEED_PX_PER_SEC[speed] * (delta / 1000);
    const nextRaw = x.get() + (direction === "left" ? -velocity : velocity);

    if (loop) {
      let wrapped = nextRaw;
      if (direction === "left" && wrapped <= -singleWidth)
        wrapped += singleWidth;
      if (direction === "right" && wrapped >= 0) wrapped -= singleWidth;
      x.set(wrapped);
      return;
    }

    if (direction === "left") {
      const limit = -Math.max(0, singleWidth - viewportWidth);
      x.set(Math.max(limit, nextRaw));
    } else {
      x.set(Math.min(0, nextRaw));
    }
  });

  return (
    <div
      data-slot="infinite-cards-root"
      className={cn("relative w-full infinite-cards-root", className)}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovered(false) : undefined}
    >
      <div
        ref={viewportRef}
        data-slot="infinite-cards-viewport"
        className="overflow-hidden infinite-cards-viewport"
      >
        <motion.div
          ref={trackRef}
          data-slot="infinite-cards-track"
          className="flex w-max py-1 infinite-cards-track"
          style={{
            x: reduceMotion ? 0 : x,
            gap,
          }}
        >
          {renderedItems.map((item, idx) => {
            const key = `${item.id ?? "item"}-${idx}`;
            if (renderItem) {
              return (
                <div key={key} className={cn("shrink-0", cardClassName)}>
                  {renderItem(item, idx)}
                </div>
              );
            }

            return (
              <article
                key={key}
                data-slot="infinite-card"
                className={cn(
                  "shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-0.5 infinite-card",
                  cardClassName,
                )}
              >
                {item.image ? (
                  <div
                    data-slot="infinite-card-media"
                    className="h-36 w-full overflow-hidden border-b border-border infinite-card-media"
                  >
                    <img
                      src={item.image}
                      alt={item.title ?? "Card image"}
                      className="h-full w-full object-cover infinite-card-image"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div
                  data-slot="infinite-card-body"
                  className="space-y-3 p-4 infinite-card-body"
                >
                  {item.title ? (
                    <h3
                      data-slot="infinite-card-title"
                      className="text-base font-semibold tracking-tight text-foreground infinite-card-title"
                    >
                      {item.title}
                    </h3>
                  ) : null}
                  {item.description ? (
                    <p
                      data-slot="infinite-card-desc"
                      className="text-sm leading-relaxed text-muted-foreground infinite-card-desc"
                    >
                      {item.description}
                    </p>
                  ) : null}

                  {typeof item.rating === "number" ? (
                    <div
                      data-slot="infinite-card-rating"
                      className="flex items-center gap-0.5 text-sm infinite-card-rating"
                    >
                      {renderStars(item.rating)}
                    </div>
                  ) : null}

                  {item.tags?.length ? (
                    <div
                      data-slot="infinite-card-tags"
                      className="flex flex-wrap gap-1.5 infinite-card-tags"
                    >
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          data-slot="infinite-card-tag"
                          className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground infinite-card-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {item.avatar || item.name || item.role ? (
                    <div
                      data-slot="infinite-card-author"
                      className="flex items-center gap-2 pt-1 infinite-card-author"
                    >
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name ?? "Avatar"}
                          data-slot="infinite-card-avatar"
                          className="size-8 rounded-full border border-border object-cover infinite-card-avatar"
                          loading="lazy"
                        />
                      ) : null}
                      <div
                        data-slot="infinite-card-meta"
                        className="infinite-card-meta"
                      >
                        {item.name ? (
                          <p
                            data-slot="infinite-card-name"
                            className="text-sm font-medium text-foreground infinite-card-name"
                          >
                            {item.name}
                          </p>
                        ) : null}
                        {item.role ? (
                          <p
                            data-slot="infinite-card-role"
                            className="text-xs text-muted-foreground infinite-card-role"
                          >
                            {item.role}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </motion.div>
      </div>

      {showGradientMask ? (
        <>
          <div
            data-slot="gradient-mask-left"
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-background/70 to-transparent infinite-cards-mask-left"
          />
          <div
            data-slot="gradient-mask-right"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/70 to-transparent infinite-cards-mask-right"
          />
        </>
      ) : null}
    </div>
  );
}

export default InfiniteMovingCards;
