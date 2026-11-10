import { BRAND } from "@/config/brand";

type EmailMessage = { to: string; subject: string; html: string; text: string };

const siteUrl = () => (process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || `https://${BRAND.domain}`).replace(/\/$/, "");

export function escapeEmailHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export function brandedEmail({ title, eyebrow, intro, body, ctaLabel, ctaUrl, expiry }: { title: string; eyebrow: string; intro: string; body?: string; ctaLabel: string; ctaUrl: string; expiry?: string }) {
  const { accent, accentStrong, tint, ink } = BRAND.colors;
  const stone = "#5e574f";
  const serif = "'Bodoni Moda','Bodoni MT',Didot,'Playfair Display',Georgia,'Times New Roman',serif";
  const mono = "'Courier Prime','Courier New',Courier,monospace";
  const sans = "'Instrument Sans',Helvetica,Arial,sans-serif";
  const host = siteUrl().replace(/^https?:\/\//, "");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeEmailHtml(title.replace(/<[^>]*>/g, ""))}</title></head>
<body style="margin:0;padding:0;background:${tint};color:${ink};font-family:${sans}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${tint}">${escapeEmailHtml(intro.replace(/<[^>]*>/g, "")).slice(0, 110)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${tint}"><tr><td align="center" style="padding:32px 14px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff">
<tr><td align="center" style="background:${accent};padding:38px 24px 34px"><a href="${siteUrl()}" style="text-decoration:none;color:#ffffff;font-family:${serif};font-size:38px;line-height:1;font-weight:600;letter-spacing:7px;padding-left:7px">${BRAND.name}</a><div style="margin-top:12px;font-family:${mono};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#f3d6d8">Handmade &middot; made to order</div></td></tr>
<tr><td style="padding:44px 36px 8px"><p style="margin:0 0 14px;font-family:${mono};font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:${accent}">${eyebrow}</p><h1 style="margin:0;font-family:${serif};font-size:38px;line-height:1.05;font-weight:500;color:${ink}">${title}</h1><p style="margin:22px 0 0;font-size:16px;line-height:1.7;color:#3d3832">${intro}</p>${body ? `<p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:${stone}">${body}</p>` : ""}</td></tr>
<tr><td style="padding:28px 36px 8px"><a href="${ctaUrl}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;font-family:${sans};font-size:15px;font-weight:600;line-height:1.2;padding:16px 30px;border-radius:999px;mso-padding-alt:0">${ctaLabel}</a></td></tr>
<tr><td style="padding:26px 36px 0"><div style="border-top:2px dashed ${accent};font-size:0;line-height:0">&nbsp;</div></td></tr>
<tr><td style="padding:20px 36px 40px">${expiry ? `<p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:${stone}">${expiry}</p>` : ""}<p style="margin:0;font-size:12px;line-height:1.6;color:${stone}">Button not working? Paste this link into your browser:<br><a href="${ctaUrl}" style="color:${accentStrong};word-break:break-all">${ctaUrl}</a></p></td></tr>
<tr><td align="center" style="background:${ink};padding:26px 24px"><div style="font-family:${serif};font-size:20px;letter-spacing:5px;color:#ffffff;padding-left:5px">${BRAND.name}</div><div style="margin-top:8px;font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#cfc8c0">${escapeEmailHtml(BRAND.tagline)}</div><div style="margin-top:12px;font-family:${mono};font-size:11px;letter-spacing:1.5px"><a href="${siteUrl()}" style="color:#ffffff;text-decoration:underline">${escapeEmailHtml(host)}</a></div></td></tr>
</table></td></tr></table></body></html>`;
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
