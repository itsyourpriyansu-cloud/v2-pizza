"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pizza,
  Flame,
  Sparkles,
  UtensilsCrossed,
  Sandwich,
  CakeSlice,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  id: string;
  label: string;
  icon: React.ElementType;
  image: string;
  description: string;
  categoryTag?: string;
  price?: string;
}

// Ordered Best Sellers in each Pizza Avenue category (1 to 6)
const DEFAULT_CATEGORY_BESTSELLERS: FeatureItem[] = [
  {
    id: "pizzas",
    label: "Pizzas",
    categoryTag: "Best Seller • Pizzas",
    icon: Pizza,
    image: "/assets/pizza-wave/hero-main-pizza.png",
    description: "Farmhouse Sourdough (From ₹520*) — Crisp bell peppers, red onions, fresh basil & mozzarella over 72-hr fermented crust.",
  },
  {
    id: "paneer",
    label: "Paneer Craft",
    categoryTag: "Best Seller • Paneer Craft",
    icon: Flame,
    image: "/assets/pizza-wave/paneer-cheese-pizza.png",
    description: "Paneer Makhani (From ₹420*) — Charred spiced malai paneer, crunchy peppers & mozzarella on a rich makhani glaze.",
  },
  {
    id: "chicken",
    label: "Chicken Specials",
    categoryTag: "Best Seller • Chicken",
    icon: Sparkles,
    image: "/assets/pizza-wave/chicken-tikka-pizza.png",
    description: "Chicken Makhani (From ₹520*) — Charcoal-smoked chicken tikka, sweet peppers & gooey cheese on blistered sourdough.",
  },
  {
    id: "mushrooms",
    label: "Truffle Mushroom",
    categoryTag: "Best Seller • Truffle & Alfredo",
    icon: UtensilsCrossed,
    image: "/assets/pizza-wave/mushroom-cheese-pizza.png",
    description: "Mushroom Alfredo (From ₹450*) — Sautéed button mushrooms, aromatic garlic cream sauce, fresh herbs & melted mozzarella.",
  },
  {
    id: "sides",
    label: "Garlic Breads",
    categoryTag: "Best Seller • Sides",
    icon: Sandwich,
    image: "/assets/pizza-wave/cheesy-garlic-bread.png",
    description: "Cheesy Herb Bread (From ₹220*) — Freshly baked artisan loaf loaded with roasted garlic butter, parsley & molten mozzarella.",
  },
  {
    id: "desserts",
    label: "Sweet Bites",
    categoryTag: "Best Seller • Desserts",
    icon: CakeSlice,
    image: "/assets/pizza-wave/chocolate-brownie.png",
    description: "Fudge Brownie (From ₹180*) — Warm, decadent dark chocolate brownie with molten chocolate chunks and a crisp crinkle crust.",
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 54;
const ITEM_GAP = 12;
const PITCH = ITEM_HEIGHT + ITEM_GAP;
const REEL_HEIGHT = 380;
const CENTER_Y = (REEL_HEIGHT / 2) - (ITEM_HEIGHT / 2);

export interface FeatureCarouselProps {
  features?: FeatureItem[];
  autoPlayInterval?: number;
  className?: string;
  onItemSelect?: (item: FeatureItem, index: number) => void;
}

export function FeatureCarousel({
  features = DEFAULT_CATEGORY_BESTSELLERS,
  autoPlayInterval = AUTO_PLAY_INTERVAL,
  className,
  onItemSelect,
}: FeatureCarouselProps = {}) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalFeatures = features.length;
  const currentIndex =
    totalFeatures > 0 ? ((step % totalFeatures) + totalFeatures) % totalFeatures : 0;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    if (totalFeatures === 0) return;
    let diff = index - currentIndex;
    if (diff > totalFeatures / 2) diff -= totalFeatures;
    if (diff < -totalFeatures / 2) diff += totalFeatures;
    if (diff !== 0) setStep((s) => s + diff);
    const selectedItem = features[index];
    if (selectedItem && onItemSelect) {
      onItemSelect(selectedItem, index);
    }
  };

  useEffect(() => {
    if (isPaused || totalFeatures <= 1) return;
    const interval = setInterval(nextStep, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextStep, isPaused, autoPlayInterval, totalFeatures]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = totalFeatures;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div
      className={cn("feature-carousel-container", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Category Best Sellers Carousel"
    >
      <div className="feature-carousel-shell">
        {/* Left Side: Centered Vertical Carousel Reel with Equal-Width Pill Chips */}
        <div className="feature-carousel-left">
          {/* Top Fade Gradient Mask */}
          <div className="feature-carousel-fade-top" />
          {/* Bottom Fade Gradient Mask */}
          <div className="feature-carousel-fade-bottom" />

          {/* Reel Window - Centered on all viewports */}
          <div className="feature-carousel-reel">
            {/* Smooth Vertically Scrolling Track - Stretches items to equal width of largest item */}
            <motion.div
              animate={{
                y: CENTER_Y - currentIndex * PITCH,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 20,
                mass: 0.9,
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ITEM_GAP,
                width: "max-content",
                minWidth: "max-content",
                alignItems: "stretch",
              }}
              className="relative"
            >
              {features.map((feature, index) => {
                const isActive = index === currentIndex;
                const distance = Math.abs(index - currentIndex);
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.id}
                    animate={{
                      opacity: Math.max(0.28, 1 - distance * 0.28),
                      scale: isActive ? 1.02 : 0.96,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    style={{
                      width: "100%",
                      height: ITEM_HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleChipClick(index)}
                      aria-label={`View ${feature.label} best seller`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "feature-carousel-chip",
                        isActive ? "is-active" : "is-inactive"
                      )}
                      style={{
                        width: "100%",
                        minWidth: "220px",
                      }}
                    >
                      <div className="feature-carousel-chip-icon">
                        <Icon size={18} strokeWidth={2.2} />
                      </div>

                      <span className="feature-carousel-chip-label">
                        {feature.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Right Side: 3D Animated Card Stage */}
        <div className="feature-carousel-right">
          <div className="feature-carousel-stage">
            {features.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -75 : isNext ? 75 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.88 : 0.75,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className={cn(
                    "feature-carousel-card",
                    isActive ? "is-active" : "is-blurred"
                  )}
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0"
                        : "grayscale-[0.4] blur-[2px] brightness-75"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="feature-carousel-caption absolute inset-x-0 bottom-0 p-8 md:p-10 pt-28 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="feature-carousel-tag bg-background text-foreground px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] w-fit shadow-md mb-2.5 border border-border/50">
                          {feature.categoryTag || `${index + 1} • ${feature.label}`}
                        </div>
                        <p className="feature-carousel-desc text-white font-normal text-lg md:text-xl leading-snug drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "feature-carousel-live absolute top-7 left-7 flex items-center gap-2.5 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="feature-carousel-dot w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#4ade80]" />
                    <span className="feature-carousel-live-text text-white/90 text-[10px] font-bold uppercase tracking-[0.25em] font-mono">
                      Category Best Seller
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
