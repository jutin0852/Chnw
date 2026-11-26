// Phone photos are stored at up to 2560px and high quality, so they stay sharp on large and
// high-density screens. Shoppers never download this copy: Cloudinary serves each screen a
// resized AVIF/WebP (see cloudinary-loader.ts), which keeps pages fast.
const MAX_PRODUCT_IMAGE_DIMENSION = 2560;
const PRODUCT_IMAGE_QUALITY = 0.92;
/** Largest photo accepted from the phone, before it is resized. */
export const MAX_PRODUCT_IMAGE_BYTES = 30 * 1024 * 1024;
/** Cloudinary's per-image upload limit on the free plan. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be prepared for upload."));
    };
    image.src = url;
  });
}

function canvasToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image compression failed."))),
      "image/webp",
      PRODUCT_IMAGE_QUALITY,
    );
  });
}

/**
 * Creates the only product-photo copy that is sent to Cloudinary: a high-quality WebP up to 2560px.
 * If the browser cannot read the photo (e.g. an iPhone HEIC photo outside Safari), the original is
 * sent as it is and Cloudinary converts it, as long as it is within the upload limit.
 */
export async function compressProductImage(file: File): Promise<File> {
  let image: HTMLImageElement;
  try {
    image = await loadImage(file);
  } catch (error) {
    if (file.size <= MAX_UPLOAD_BYTES) return file;
    throw error;
  }
  const scale = Math.min(1, MAX_PRODUCT_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image compression is unavailable in this browser.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToWebp(canvas);
  if (blob.size >= file.size && scale === 1) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export async function compressProductImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressProductImage));
}
