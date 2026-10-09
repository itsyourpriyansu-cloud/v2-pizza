"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const items = [
  {
    id: 1,
    title: "Production-ready templates",
    description:
      "Seamless loops that keep content dynamic without visual jumps.",
    rating: 5,
    tags: ["testimonials"],
    name: "Ava Mitchell",
    role: "Design lead",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Smooth and performant",
    description:
      "Linear marquee motion with hover pause for better readability.",
    rating: 5,
    tags: ["Framer Motion"],
    name: "Marcus",
    role: "Frontend engineer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Built for launch pages",
    description:
      "Use for logo strips, reviews, case studies, and showcase rails.",
    rating: 4,
    tags: ["Marketing"],
    name: "Lena",
    role: "Design manager",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Trusted by teams",
    description:
      "Drop in testimonials and let them scroll on an infinite rail.",
    rating: 5,
    tags: ["reviews"],
    name: "Priya",
    role: "Product manager",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Fully configurable",
    description:
      "Control direction, speed, gap, and pause-on-hover from props.",
    rating: 5,
    tags: ["cards"],
    name: "Diego",
    role: "Software engineer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&auto=format&fit=crop&q=80",
  },
];

export default function Default() {
  return (
    <div className="flex min-h-[420px] w-full items-center bg-background py-16">
      <InfiniteMovingCards items={items} speed="normal" direction="left" />
    </div>
  );
}
