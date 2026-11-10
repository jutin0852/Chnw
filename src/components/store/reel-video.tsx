"use client";

import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { filmPoster, filmSrc } from "@/config/films";
import { prefersReducedMotion } from "@/engine";
import { usePage } from "@/engine/next";

/**
 * A muted reel that plays only while it is on screen (saves data and battery). Under reduced
 * motion it stays on its poster with native controls, so nothing moves unless asked.
 */
export default function ReelVideo({ code, label, className = "" }: { code: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  usePage(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.controls = true;
      return;
    }
    ScrollTrigger.create({
      trigger: video,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) {
          if (!video.src) video.src = filmSrc(code);
          video.play().catch(() => {});
        } else video.pause();
      },
    });
  });

  return (
    <video
      ref={ref}
      poster={filmPoster(code)}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
