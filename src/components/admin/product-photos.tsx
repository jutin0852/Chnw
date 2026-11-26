"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handlecloudinaryUpload } from "@/lib/cloudinary";
import { compressProductImage, MAX_PRODUCT_IMAGE_BYTES } from "@/lib/product-image-compression";
import { addProductImages, deleteProductImage, reorderProductImages, replaceProductImage } from "@/app/actions/manageProducts";

type Photo = { id: number; imageUrl: string; altText: string | null };
const MAX_PHOTOS = 5;

/** Small admin thumbnail straight from Cloudinary, so the grid loads fast. */
const thumb = (url: string) => (url.includes("res.cloudinary.com") ? url.replace("/upload/", "/upload/w_400,c_limit,q_auto,f_auto/") : url);

function checkFile(file: File) {
  if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) return "Choose a photo (JPG, PNG, WebP or HEIC).";
  if (file.size > MAX_PRODUCT_IMAGE_BYTES) return "That photo is over 30MB.";
  return "";
}

async function uploadOne(file: File) {
  const [url] = await handlecloudinaryUpload(await compressProductImage(file));
  return url;
}

/**
 * The photos of one product: replace any photo in place, change the order, make one the main
 * photo, remove or add photos. Changes save straight away and show on the store within moments.
 */
export function ProductPhotos({ productId, productName, images }: { productId: string; productName: string; images: Photo[] }) {
  const router = useRouter();
  const [photos, setPhotos] = useState(images);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [, startTransition] = useTransition();
  const replaceInput = useRef<HTMLInputElement>(null);
  const addInput = useRef<HTMLInputElement>(null);
  const replacing = useRef<number | null>(null);

  // Take fresh data from the server after each save (adjusting state during render, not in an effect).
  // Compared by content, since a parent may pass a new array with the same photos.
  const serverKey = images.map((p) => `${p.id}:${p.imageUrl}`).join("|");
  const [seenKey, setSeenKey] = useState(serverKey);
  if (seenKey !== serverKey) {
    setSeenKey(serverKey);
    setPhotos(images);
  }

  function done(text: string) {
    setMessage({ ok: true, text });
    startTransition(() => router.refresh());
  }
  function fail(error: unknown, fallback: string) {
    setMessage({ ok: false, text: error instanceof Error ? error.message : fallback });
  }

  async function replace(file: File | undefined) {
    const imageId = replacing.current;
    if (replaceInput.current) replaceInput.current.value = "";
    if (!file || imageId === null) return;
    const problem = checkFile(file);
    if (problem) return setMessage({ ok: false, text: problem });
    setBusy(`replace-${imageId}`);
    setMessage(null);
    try {
      const url = await uploadOne(file);
      const result = await replaceProductImage(imageId, url);
      if (!result.success) throw new Error(result.message);
      setPhotos((current) => current.map((p) => (p.id === imageId ? { ...p, imageUrl: url } : p)));
      done("Photo replaced.");
    } catch (error) {
      fail(error, "The photo could not be replaced.");
    } finally {
      setBusy(null);
    }
  }

  async function add(files: File[]) {
    if (addInput.current) addInput.current.value = "";
    if (!files.length) return;
    const room = MAX_PHOTOS - photos.length;
    if (files.length > room) return setMessage({ ok: false, text: room ? `You can add ${room} more photo${room === 1 ? "" : "s"}.` : "This product already has five photos. Replace or remove one first." });
    const problem = files.map(checkFile).find(Boolean);
    if (problem) return setMessage({ ok: false, text: problem });
    setBusy("add");
    setMessage(null);
    try {
      const urls = await Promise.all(files.map(uploadOne));
      const result = await addProductImages(productId, urls);
      if (!result.success) throw new Error(result.message);
      done(files.length === 1 ? "Photo added." : "Photos added.");
    } catch (error) {
      fail(error, "The photos could not be added.");
    } finally {
      setBusy(null);
    }
  }

  async function move(index: number, to: number) {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    const [photo] = next.splice(index, 1);
    next.splice(to, 0, photo);
    const before = photos;
    setPhotos(next);
    setBusy("order");
    setMessage(null);
    try {
      const result = await reorderProductImages(productId, next.map((p) => p.id));
      if (!result.success) throw new Error(result.message);
      done(to === 0 ? "Main photo updated." : "Order saved.");
    } catch (error) {
      setPhotos(before);
      fail(error, "The order could not be saved.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(photo: Photo) {
    if (photos.length === 1 && !window.confirm("This is the only photo. The product will show a placeholder until you add another. Remove it?")) return;
    if (photos.length > 1 && !window.confirm("Remove this photo?")) return;
    setBusy(`remove-${photo.id}`);
    setMessage(null);
    try {
      await deleteProductImage(photo.id);
      setPhotos((current) => current.filter((p) => p.id !== photo.id));
      done("Photo removed.");
    } catch (error) {
      fail(error, "The photo could not be removed.");
    } finally {
      setBusy(null);
    }
  }

  const locked = busy !== null;
  const button = "rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted disabled:opacity-40";

  return (
    <div className="space-y-4">
      <input ref={replaceInput} type="file" accept="image/*,.heic,.heif" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void replace(e.target.files?.[0])} />
      <input ref={addInput} type="file" accept="image/*,.heic,.heif" multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void add(Array.from(e.target.files || []))} />

      {photos.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {photos.map((photo, i) => {
            const working = busy === `replace-${photo.id}` || busy === `remove-${photo.id}`;
            return (
              <li key={photo.id} className="overflow-hidden rounded-lg border bg-card">
                <div className="relative aspect-[4/5] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(photo.imageUrl)} alt={photo.altText || `${productName}, photo ${i + 1}`} className={`h-full w-full object-cover transition-opacity ${working ? "opacity-40" : ""}`} />
                  <span className="absolute left-2 top-2 rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium">{i === 0 ? "Main photo" : `Photo ${i + 1}`}</span>
                  {working && <span className="absolute inset-0 grid place-items-center text-xs font-medium">{busy?.startsWith("replace") ? "Uploading…" : "Removing…"}</span>}
                </div>
                <div className="space-y-2 p-2">
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => {
                      replacing.current = photo.id;
                      replaceInput.current?.click();
                    }}
                    className="w-full rounded-md bg-[var(--brand)] px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
                  >
                    Replace
                  </button>
                  <div className="flex items-center justify-between gap-1">
                    <button type="button" disabled={locked || i === 0} onClick={() => void move(i, i - 1)} className={button} aria-label={`Move photo ${i + 1} earlier`}>←</button>
                    {i !== 0 && <button type="button" disabled={locked} onClick={() => void move(i, 0)} className={button}>Make main</button>}
                    <button type="button" disabled={locked || i === photos.length - 1} onClick={() => void move(i, i + 1)} className={button} aria-label={`Move photo ${i + 1} later`}>→</button>
                  </div>
                  <button type="button" disabled={locked} onClick={() => void remove(photo)} className="w-full text-xs text-destructive underline disabled:opacity-40">Remove</button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={locked || photos.length >= MAX_PHOTOS} onClick={() => addInput.current?.click()} className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-40">
          {busy === "add" ? "Uploading…" : "Add photos"}
        </button>
        <span className="text-xs text-muted-foreground">{photos.length}/{MAX_PHOTOS} photos · the main photo shows on product cards</span>
      </div>
      {message && <p role={message.ok ? "status" : "alert"} className={`text-sm ${message.ok ? "text-muted-foreground" : "text-destructive"}`}>{message.text}</p>}
    </div>
  );
}
