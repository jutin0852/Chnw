import webpush from "web-push";
import { eq, inArray, or } from "drizzle-orm";
import { db } from "./db";
import { pushSubscriptions, user } from "./schema";
import { getSiteUrl } from "./site-url";
import { VAPID_PUBLIC_KEY } from "@/config/order-alerts";

// New-order alerts for the team, sent as web push notifications.
// Runs only when an order first becomes paid: one small read of the team's devices, no polling.
// The phone receives the alert from Apple's or Google's push service, not from the database.

export type OrderAlert = { orderId: string; orderNumber: string; customerName: string; totalLabel: string; itemCount: number };

export function orderAlertsConfigured() {
  return Boolean(process.env.VAPID_PRIVATE_KEY);
}

function configured() {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!privateKey) return false;
  webpush.setVapidDetails(getSiteUrl().startsWith("https://") ? getSiteUrl() : "mailto:alerts@example.com", VAPID_PUBLIC_KEY, privateKey);
  return true;
}

/** Sends a notification to every device a staff member or owner has turned alerts on for. Never throws. */
export async function sendTeamPush(payload: { title: string; body: string; url: string; tag?: string }): Promise<number> {
  let delivered = 0;
  try {
    if (!configured()) return 0;
    const devices = await db
      .select({ id: pushSubscriptions.id, endpoint: pushSubscriptions.endpoint, p256dh: pushSubscriptions.p256dh, auth: pushSubscriptions.auth })
      .from(pushSubscriptions)
      .innerJoin(user, eq(user.id, pushSubscriptions.userId))
      .where(or(eq(user.role, "owner"), eq(user.role, "staff")));
    if (!devices.length) return 0;
    const message = JSON.stringify(payload);
    const gone: string[] = [];
    await Promise.all(devices.map(async (device) => {
      try {
        await webpush.sendNotification({ endpoint: device.endpoint, keys: { p256dh: device.p256dh, auth: device.auth } }, message, { TTL: 60 * 60 * 24, urgency: "high" });
        delivered += 1;
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        // 404/410: the device turned alerts off or the app was removed.
        if (status === 404 || status === 410) gone.push(device.id);
        else console.error("Order alert failed", status ?? error);
      }
    }));
    if (gone.length) await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.id, gone));
  } catch (error) {
    console.error("Order alerts unavailable", error);
  }
  return delivered;
}

export function sendNewOrderAlert(order: OrderAlert) {
  return sendTeamPush({
    title: `New order · ${order.totalLabel}`,
    body: `${order.customerName} placed ${order.orderNumber} (${order.itemCount} ${order.itemCount === 1 ? "item" : "items"}).`,
    url: `/admin/orders/${order.orderId}`,
    tag: `order-${order.orderId}`,
  });
}
