import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Signs a direct browser upload of a video into chnw/video-uploads (admin only).
// The incoming transformation means Cloudinary stores only the compressed copy (720px wide,
// H.264, no audio, auto-quality), never the large original, so uploads cannot eat the storage.
export async function POST() {
  await requireAdmin();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ message: "Cloudinary is not configured" }, { status: 503 });

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "chnw/video-uploads";
  const transformation = "c_limit,w_720,vc_h264,q_auto:eco,ac_none";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder, transformation }, apiSecret);
  return NextResponse.json({ timestamp, signature, cloudName, apiKey, folder, transformation });
}
