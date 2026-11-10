"use client";
import { Engine } from "@/engine/next";
import { setupMotion } from "@/motion/setup";

export default function StoreMotion() {
  return <Engine setup={setupMotion} />;
}
