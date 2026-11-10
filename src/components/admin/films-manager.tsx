"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeHeroFilm, removeProductFilm, setHeroFilm, setProductFilm } from "../../app/actions/films";
import { filmPoster, filmSrc } from "@/config/films";

type Slot = { videoId: string | null; alt: string };
type HeroSlot = Slot & { position: number };
type ProductSlot = Slot & { id: string; name: string };

const HERO_LABELS = ["Left", "Centre (the only one shown on phones)", "Right"];
const MAX_BYTES = 100 * 1024 * 1024;

/** Signed direct upload to Cloudinary; resolves with the video's public id. */
async function uploadVideo(file: File, onProgress: (percent: number) => void): Promise<string> {
  const sig = await fetch("/api/cloudinary-video-signature", { method: "POST" });
  if (!sig.ok) throw new Error("Could not start the upload. Sign in again and retry.");
  const { timestamp, signature, cloudName, apiKey, folder, transformation } = await sig.json();
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder);
    form.append("transformation", transformation);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.public_id) resolve(data.public_id as string);
        else reject(new Error(data?.error?.message || "The upload failed."));
      } catch {
        reject(new Error("The upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("The upload failed. Check your connection."));
    xhr.send(form);
  });
}

function FilmCard({
  id,
  title,
  slot,
  onSave,
  onRemove,
  removeLabel,
}: {
  id: string;
  title: string;
  slot: Slot;
  onSave: (videoId: string, alt: string) => Promise<void>;
  onRemove: () => Promise<void>;
  removeLabel: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(slot.alt);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = progress !== null || pending;

  async function pick(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("video/")) return setError("Choose a video file (MP4 or MOV).");
    if (file.size > MAX_BYTES) return setError("That file is over 100 MB. Trim or compress it first.");
    try {
      setProgress(0);
      const videoId = await uploadVideo(file, setProgress);
      await onSave(videoId, alt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4">
      <div className="relative aspect-[9/16] w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:w-28">
        {slot.videoId ? (
          preview ? (
            <video src={filmSrc(slot.videoId, 480)} poster={filmPoster(slot.videoId, 480)} muted loop playsInline controls autoPlay className="h-full w-full object-cover" />
          ) : (
            <button type="button" onClick={() => setPreview(true)} className="group h-full w-full" aria-label={`Play ${title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={filmPoster(slot.videoId, 320)} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/30 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Play</span>
            </button>
          )
        ) : (
          <span className="absolute inset-0 grid place-items-center p-2 text-center text-xs text-muted-foreground">No film</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="font-medium">{title}</p>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Describe the film (for screen readers)
          <input value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} placeholder="A model in the crochet skirt walking" className="rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-[var(--brand)]" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input ref={input} type="file" accept="video/*" className="sr-only" id={id} onChange={(e) => void pick(e.target.files?.[0])} disabled={busy} />
          <label htmlFor={id} className={`inline-flex cursor-pointer items-center rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 ${busy ? "pointer-events-none opacity-50" : ""}`}>
            {progress !== null ? `Uploading ${progress}%` : slot.videoId ? "Replace film" : "Upload film"}
          </label>
          {slot.videoId && (
            <button type="button" disabled={busy} onClick={() => { if (window.confirm(removeLabel)) startTransition(() => void onRemove()); }} className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50">
              Remove
            </button>
          )}
          {slot.videoId && alt !== slot.alt && (
            <button type="button" disabled={busy} onClick={() => startTransition(() => void onSave(slot.videoId as string, alt))} className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50">
              Save description
            </button>
          )}
        </div>
        {progress !== null && (
          <div className="h-1.5 w-full overflow-hidden rounded bg-muted">
            <div className="h-full bg-[var(--brand)] transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}

export function FilmsManager({ hero, productFilms }: { hero: HeroSlot[]; productFilms: ProductSlot[] }) {
  const router = useRouter();
  const done = () => router.refresh();

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Home page hero</h2>
          <p className="text-sm text-muted-foreground">Three films side by side on computers. Phones show only the centre one. A slot you remove goes back to its original film.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {hero.map((slot) => (
            <FilmCard
              key={`${slot.position}-${slot.videoId}`}
              id={`hero-film-${slot.position}`}
              title={HERO_LABELS[slot.position]}
              slot={slot}
              onSave={async (videoId, alt) => {
                await setHeroFilm(slot.position, videoId, alt);
                done();
              }}
              onRemove={async () => {
                await removeHeroFilm(slot.position);
                done();
              }}
              removeLabel="Remove this film? The slot goes back to its original film."
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Product pages</h2>
          <p className="text-sm text-muted-foreground">The film appears second in each product&apos;s gallery. Products without a film show photos only.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {productFilms.map((product) => (
            <FilmCard
              key={`${product.id}-${product.videoId}`}
              id={`product-film-${product.id}`}
              title={product.name}
              slot={product}
              onSave={async (videoId, alt) => {
                await setProductFilm(product.id, videoId, alt);
                done();
              }}
              onRemove={async () => {
                await removeProductFilm(product.id);
                done();
              }}
              removeLabel={`Remove the film from ${product.name}?`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
