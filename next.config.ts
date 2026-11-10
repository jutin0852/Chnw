import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi use the dev server (dev only).
  allowedDevOrigins: ["192.168.1.10"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
