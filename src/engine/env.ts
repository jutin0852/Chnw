export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
export const isMobile = () => matchMedia("(max-width: 767px)").matches;

// Shared easing vocabulary for the store. "Settle like cloth": long expo outs, nothing bouncy.
export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;
