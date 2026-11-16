import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi use the dev server (dev only).
  allowedDevOrigins: ["192.168.1.10"],
  images: {
    // Cloudinary does the resizing and AVIF/WebP conversion (see the loader file).
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    qualities: [75, 80, 85],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
