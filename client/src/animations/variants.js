// Shared Framer Motion variants — keeps motion consistent across the homepage
// per the United Mart Sukkur design system (§12 Animations).

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Standard viewport config for scroll-triggered reveals — fires once, slightly
// before the element is fully in view so motion feels anticipatory, not late.
export const viewportOnce = { once: true, margin: "-80px" };

export const cardHover = {
  rest: { y: 0, boxShadow: "0 1px 2px rgba(30,33,31,0.06)" },
  hover: {
    y: -4,
    boxShadow: "0 2px 8px rgba(30,33,31,0.08)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const imageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.4, ease: "easeOut" } },
};

export const buttonTap = {
  scale: [1, 0.96, 1.02, 1],
  transition: { duration: 0.35 },
};
