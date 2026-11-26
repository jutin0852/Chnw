import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  await requireAdmin();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary is not configured" },
      { status: 503 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Stored copy: up to 2560px at high quality (the phone upload is already resized). Shoppers get
  // smaller AVIF/WebP versions made from it per screen, so this does not slow pages down.
  const transformation = "c_limit,w_2560,q_auto:best";
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: "uploads",
      transformation,
    },
    apiSecret,
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName,
    apiKey,
    transformation,
  });
}
