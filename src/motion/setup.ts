// Global storefront motion. Runs once on the client, before the first page initializes.
import { gsap } from "gsap";
import { ease, setLoaderExit } from "@/engine";

export function setupMotion() {
  // Loader → hero: the letters drop out, the photo window closes, then the black screen lifts away
  // to reveal the films already playing underneath. No colour wipe in between.
  setLoaderExit((root) =>
    gsap
      .timeline()
      .to(root.querySelectorAll("[data-loader-out]"), { yPercent: -110, duration: 0.5, ease: ease.inOut, stagger: 0.04 })
      .to(root.querySelector(".loader__window"), { scaleY: 0, duration: 0.45, ease: ease.inOut }, "<")
      .to(root.querySelectorAll(".loader__meta"), { autoAlpha: 0, duration: 0.25 }, "<")
      .to(root, { yPercent: -100, duration: 0.7, ease: ease.inOut }, "-=0.1"),
  );
}
