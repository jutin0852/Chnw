// First-visit loader. Progress follows REAL work (fonts + the hero films' first frames), with a
// floor so it reads as intentional and a ceiling so it never blocks shopping. Shown once per
// browser session: the head script adds html.loader-seen on repeat visits.
import { gsap } from "gsap";
import { ease, prefersReducedMotion } from "./env";

let format = (p: number) => String(Math.round(p)).padStart(3, "0");
export const setLoaderFormat = (fn: (p: number) => string) => {
  format = fn;
};
let exit: ((root: HTMLElement) => gsap.core.Timeline) | null = null;
export const setLoaderExit = (fn: (root: HTMLElement) => gsap.core.Timeline) => {
  exit = fn;
};

const MIN = 1.1;
const MAX = 2;
export const LOADER_KEY = "chnw-loader-seen";

function criticalAssets(): Promise<unknown>[] {
  const videos = [...document.querySelectorAll<HTMLVideoElement>("video[data-critical]")].map((v) =>
    v.readyState >= 2
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          v.addEventListener("loadeddata", () => resolve(), { once: true });
          v.addEventListener("error", () => resolve(), { once: true });
        }),
  );
  const imgs = [...document.querySelectorAll<HTMLImageElement>("img[data-critical]")].map((i) =>
    i.complete ? Promise.resolve() : i.decode().catch(() => {}),
  );
  return [document.fonts.ready, ...videos, ...imgs];
}

export async function runLoader(): Promise<void> {
  const root = document.getElementById("loader");
  if (!root || root.hidden || document.documentElement.classList.contains("loader-seen")) return finish(root);
  try {
    sessionStorage.setItem(LOADER_KEY, "1");
  } catch {}
  if (prefersReducedMotion()) {
    await Promise.race([Promise.all(criticalAssets()), wait(1)]);
    await gsap.to(root, { autoAlpha: 0, duration: 0.3 });
    return finish(root);
  }
  const count = root.querySelector<HTMLElement>("[data-loader-count]");
  const tasks = criticalAssets();
  let done = 0;
  const shown = { v: 0 };
  const target = { v: 0 };
  tasks.forEach((t) =>
    t.then(() => {
      done++;
      target.v = (done / tasks.length) * 100;
    }),
  );
  const start = performance.now();

  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const timeCap = Math.min(100, (elapsed / MIN) * 100);
      const goal = elapsed > MAX ? 100 : Math.min(target.v, timeCap);
      shown.v += (goal - shown.v) * 0.12;
      if (goal === 100 && shown.v > 99.5) shown.v = 100;
      if (count) count.textContent = format(shown.v);
      if (shown.v === 100) {
        gsap.ticker.remove(tick);
        resolve();
      }
    };
    gsap.ticker.add(tick);
  });

  if (exit) {
    await exit(root);
    return finish(root);
  }
  await gsap.to(root, { autoAlpha: 0, duration: 0.6, ease: ease.soft });
  finish(root);
}

// Hide rather than remove: React owns the node.
function finish(root: HTMLElement | null) {
  if (root) root.hidden = true;
  document.documentElement.classList.add("is-loaded");
}

const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
