"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { disableOrderAlerts, enableOrderAlerts, sendTestOrderAlert } from "@/app/actions/orderAlerts";

type State = "loading" | "unsupported" | "install-first" | "blocked" | "off" | "on";

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Bell in the admin header: turns new-order notifications on or off for this device. */
export function OrderAlertsToggle() {
  const [state, setState] = useState<State>("loading");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    void (async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!supported || !publicKey) return setState(isIos() && !isInstalled() ? "install-first" : "unsupported");
      if (Notification.permission === "denied") return setState("blocked");
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const existing = await registration.pushManager.getSubscription();
      setState(existing && Notification.permission === "granted" ? "on" : "off");
    })().catch(() => setState("unsupported"));
  }, [publicKey]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!panel.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function turnOn() {
    setBusy(true);
    setMessage("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "off");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = (await registration.pushManager.getSubscription())
        ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey!) });
      const json = subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      const result = await enableOrderAlerts(json);
      setMessage(result.message);
      if (result.success) setState("on");
    } catch {
      setMessage("Could not turn on alerts on this device.");
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await disableOrderAlerts(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setState("off");
      setMessage("Order alerts are off for this device.");
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    setBusy(true);
    try {
      setMessage((await sendTestOrderAlert()).message);
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return null;
  const Icon = state === "on" ? BellRing : state === "blocked" || state === "unsupported" ? BellOff : Bell;

  return (
    <div ref={panel} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={state === "on" ? "Order alerts are on" : "Order alerts"}
        className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[var(--brand-tint)] ${state === "on" ? "text-[var(--brand)]" : "text-black/60"}`}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </button>
      {open && (
        <div role="dialog" aria-label="Order alerts" className="absolute right-0 top-11 z-50 w-[min(300px,calc(100vw-2rem))] border border-black/15 bg-white p-4 text-sm shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--brand)]">Order alerts</p>
          {state === "on" && <p className="mt-2 leading-5 text-black/70">This device gets a notification when a customer pays for an order.</p>}
          {state === "off" && <p className="mt-2 leading-5 text-black/70">Get a notification on this device when a customer pays for an order.</p>}
          {state === "install-first" && <p className="mt-2 leading-5 text-black/70">On iPhone, add CHNW to your Home Screen first: tap Share, then Add to Home Screen. Open CHNW from the Home Screen, sign in and come back here.</p>}
          {state === "blocked" && <p className="mt-2 leading-5 text-black/70">Notifications are blocked for CHNW. Allow them in this device&apos;s settings, then reopen this page.</p>}
          {state === "unsupported" && <p className="mt-2 leading-5 text-black/70">This browser cannot show notifications. Try Chrome, Edge or Safari, or the CHNW app on your Home Screen.</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {state === "off" && <button type="button" disabled={busy} onClick={turnOn} className="bg-[var(--brand)] px-3 py-2 text-xs font-semibold uppercase tracking-[.08em] text-white disabled:opacity-60">{busy ? "Turning on..." : "Turn on alerts"}</button>}
            {state === "on" && <button type="button" disabled={busy} onClick={test} className="bg-[var(--brand)] px-3 py-2 text-xs font-semibold uppercase tracking-[.08em] text-white disabled:opacity-60">Send a test</button>}
            {state === "on" && <button type="button" disabled={busy} onClick={turnOff} className="border border-black/20 px-3 py-2 text-xs font-semibold uppercase tracking-[.08em] disabled:opacity-60">Turn off</button>}
          </div>
          {message && <p role="status" className="mt-3 text-xs text-black/60">{message}</p>}
        </div>
      )}
    </div>
  );
}
