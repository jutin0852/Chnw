"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { orderAlertsConfigured, sendTeamPush } from "@/lib/push";
import { pushSubscriptions } from "@/lib/schema";

type DeviceSubscription = { endpoint: string; keys: { p256dh: string; auth: string } };

function valid(subscription: DeviceSubscription) {
  return /^https:\/\//.test(subscription.endpoint) && subscription.endpoint.length < 1000
    && typeof subscription.keys?.p256dh === "string" && subscription.keys.p256dh.length < 200
    && typeof subscription.keys?.auth === "string" && subscription.keys.auth.length < 100;
}

/** Saves this device so it receives new-order alerts. Only staff and the owner can turn alerts on. */
export async function enableOrderAlerts(subscription: DeviceSubscription) {
  const admin = await requireAdmin();
  if (!valid(subscription)) return { success: false, message: "This device could not be set up for alerts." };
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) || null;
  await db.insert(pushSubscriptions)
    .values({ userId: admin.id, endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, userAgent })
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: { userId: admin.id, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, userAgent } });
  return {
    success: true,
    message: orderAlertsConfigured()
      ? "Order alerts are on for this device."
      : "This device is saved, but alerts will only start once VAPID_PRIVATE_KEY is added in Vercel.",
  };
}

export async function disableOrderAlerts(endpoint: string) {
  const admin = await requireAdmin();
  await db.delete(pushSubscriptions).where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.userId, admin.id)));
  return { success: true, message: "Order alerts are off for this device." };
}

export async function sendTestOrderAlert() {
  await requireAdmin();
  if (!orderAlertsConfigured()) return { success: false, message: "Alerts are not finished on the server yet: VAPID_PRIVATE_KEY is missing in Vercel." };
  const delivered = await sendTeamPush({ title: "Order alerts are working", body: "You will get a notification like this when a customer pays for an order.", url: "/admin/orders", tag: "test-alert" });
  return delivered
    ? { success: true, message: `Test alert sent to ${delivered} ${delivered === 1 ? "device" : "devices"}. It should arrive in a few seconds.` }
    : { success: false, message: "The test alert could not be delivered. Turn alerts off and on again on this device." };
}
