"use client";

import { useEffect, useRef, useState } from "react";
import { filmPoster, filmSrc, type Film } from "@/config/films";
import { prefersReducedMotion } from "@/engine";

/**
 * Three reels side by side on desktop (each at its native sharpness), the middle reel alone on
 * phones. Side films only load on wide screens. Paused by default under reduced motion, and
 * always pausable (they loop for longer than 5 seconds).
 */
export default function HeroFilms({ films }: { films: Film[] }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const wide = matchMedia("(min-width: 768px)").matches;
    refs.current.forEach((video, i) => {
      if (!video) return;
      if (i !== 1 && wide && !video.src) video.src = filmSrc(films[i].code, 540);
    });
    if (prefersReducedMotion()) {
      refs.current.forEach((v) => v?.pause());
      setPlaying(false);
    }
  }, [films]);

  function toggle() {
    const next = !playing;
    refs.current.forEach((v) => {
      if (!v || !v.src) return;
      if (next) v.play().catch(() => {});
      else v.pause();
    });
    setPlaying(next);
  }

  return (
    <>
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3" aria-hidden="true">
        {films.map((film, i) => (
          <div key={film.code} className={`relative overflow-hidden ${i === 1 ? "" : "hidden md:block"}`}>
            <video
              ref={(el) => {
                refs.current[i] = el;
              }}
              src={i === 1 ? filmSrc(film.code) : undefined}
              poster={filmPoster(film.code, i === 1 ? 720 : 540)}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 1 ? "auto" : "none"}
              data-critical={i === 1 ? "" : undefined}
              className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.85)_contrast(1.04)]"
            />
          </div>
        ))}
      </div>
      <p className="sr-only">Background films: {films.map((f) => f.alt).join(". ")}.</p>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="label draw absolute right-4 py-1 top-[104px] z-10 text-[12px] text-white sm:right-6 lg:bottom-9 lg:right-10 lg:top-auto"
      >
        {playing ? "Pause films" : "Play films"}
      </button>
    </>
  );
}
