import assert from "node:assert/strict";
import { test } from "node:test";
import { jsonLd, productShareImage } from "./seo";
import cloudinaryLoader from "./cloudinary-loader";

const photo = "https://res.cloudinary.com/demo/image/upload/v1/chnw/products/gigi-pants-1.jpg";

test("share card puts the product name and NGN price on a branded Cloudinary canvas", () => {
  const url = productShareImage(photo, "The Gigi Pants, Black", "57000.00");
  assert.match(url, /\/image\/upload\/c_fill,g_auto,w_520,h_630\/c_lpad,g_east,w_1200,h_630,b_rgb:a40009\//);
  // Commas inside layer text are double-encoded so Cloudinary does not read them as separators.
  assert.match(url, /The%20Gigi%20Pants%252C%20Black/);
  assert.match(url, /NGN%2057%252C000/);
  assert.ok(url.endsWith("/v1/chnw/products/gigi-pants-1.jpg"));
});

test("share card and image loader leave non-Cloudinary images alone", () => {
  assert.equal(productShareImage("/brand/og-image.png", "X", "1"), "/brand/og-image.png");
  assert.equal(cloudinaryLoader({ src: "/brand/favicon-192.png", width: 64 }), "/brand/favicon-192.png");
});

test("image loader asks Cloudinary for the right width, format and quality", () => {
  assert.equal(cloudinaryLoader({ src: photo, width: 640, quality: 80 }), "https://res.cloudinary.com/demo/image/upload/f_auto,q_80,c_limit,w_640/v1/chnw/products/gigi-pants-1.jpg");
  assert.match(cloudinaryLoader({ src: photo, width: 1080 }), /f_auto,q_auto,c_limit,w_1080\//);
});

test("structured data cannot close its script tag", () => {
  assert.equal(jsonLd({ name: "</script><b>" }), '{"name":"\\u003c/script>\\u003cb>"}');
});
