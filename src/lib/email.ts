import { BRAND } from "@/config/brand";

type EmailMessage = { to: string; subject: string; html: string; text: string };

const siteUrl = () => (process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || `https://${BRAND.domain}`).replace(/\/$/, "");

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export function brandedEmail({ title, eyebrow, intro, body, ctaLabel, ctaUrl, expiry }: { title: string; eyebrow: string; intro: string; body?: string; ctaLabel: string; ctaUrl: string; expiry?: string }) {
  const faviconUrl = `${siteUrl()}/brand/favicon-192.png`;
  const { accent, tint, ink } = BRAND.colors;
  return `<!doctype html><html><body style="margin:0;background:#f5f5f3;color:${ink};font-family:Arial,Helvetica,sans-serif"><div style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #171717"><tr><td style="padding:28px 32px;border-bottom:1px solid #171717"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding-right:14px;vertical-align:middle"><img src="${faviconUrl}" alt="${BRAND.name}" width="56" height="56" style="display:block;width:56px;height:56px;border-radius:12px"></td><td style="vertical-align:middle"><span style="font-size:28px;font-weight:900;letter-spacing:6px">${BRAND.name}</span></td></tr></table></td></tr><tr><td style="padding:42px 32px"><p style="margin:0 0 16px;color:${accent};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">${eyebrow}</p><h1 style="margin:0;font-size:36px;line-height:1.05;font-weight:500;letter-spacing:-1px">${title}</h1><p style="margin:24px 0 0;font-size:16px;line-height:1.7">${intro}</p>${body ? `<p style="margin:16px 0 0;color:#555;font-size:14px;line-height:1.7">${body}</p>` : ""}<p style="margin:30px 0"><a href="${ctaUrl}" style="display:inline-block;background:${accent};color:#fff;text-decoration:none;padding:15px 22px;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase">${ctaLabel}</a></p>${expiry ? `<p style="margin:0;color:#555;font-size:13px;line-height:1.6">${expiry}</p>` : ""}</td></tr><tr><td style="padding:22px 32px;background:${tint};font-size:12px;line-height:1.6;color:#555">${BRAND.name} · ${BRAND.tagline}<br><a href="${siteUrl()}" style="color:${ink}">${BRAND.domain}</a></td></tr></table></div></body></html>`;
}

export async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("Email delivery is not configured yet.");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...message }),
  });
  if (!response.ok) throw new Error("We could not send that email. Please try again shortly.");
}
