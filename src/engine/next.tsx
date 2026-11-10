"use client";
// Next.js App Router adapter, scoped to the storefront. Render <Engine /> once as the LAST child
// of <body>. The engine boots only on storefront routes; admin, checkout and account pages keep
// native scrolling and plain navigation. Storefront navigation is instant (no cover between pages).
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { boot, cleanup, enter, isBooted, onPage, type PageFn } from "./index";

const NON_STORE = /^\/(admin|login|checkout|account|unauthorised|api)(\/|$)/;
export const isStorePath = (path: string) => !NON_STORE.test(path);

export function Engine({ setup }: { setup?: () => void }) {
  const pathname = usePathname();
  const mode = useRef<"idle" | "pop">("idle");
  const last = useRef<string | null>(null);

  // No click interception and no cover: links navigate instantly through Next's own router, and the
  // engine re-initialises the page once the new route is in the DOM.
  useEffect(() => {
    const onPop = () => {
      mode.current = "pop";
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const previous = last.current;
    last.current = pathname;
    const store = isStorePath(pathname);
    if (!isBooted()) {
      if (store) boot(setup);
      return;
    }
    if (previous === pathname) return;
    if (!store) {
      cleanup();
      mode.current = "idle";
      return;
    }
    const pop = mode.current === "pop";
    mode.current = "idle";
    enter({ transition: false, scrollTop: !pop });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

/** Component-level page code: runs when the page is ready (after the loader), reverted on leave. */
export function usePage(fn: PageFn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onPage(fn), []);
}
