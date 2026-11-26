"use server";
import { createHash, randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { transactionDb } from "@/lib/transaction-db";
import { account, staffInvitations, user } from "@/lib/schema";
import { sendEmail } from "@/lib/email";
import { getSessionUser, requireOwner } from "@/lib/admin-auth";
import { hashPassword } from "better-auth/crypto";

const hash = (token: string) => createHash("sha256").update(token).digest("hex");
export async function inviteStaff(email: string) { const owner = await requireOwner(); if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error("Email sending is not set up yet. Use \u201cAdd a staff member\u201d instead."); const normalizedEmail = email.trim().toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error("Enter a valid email address."); const token = randomBytes(32).toString("hex"); await db.insert(staffInvitations).values({ email: normalizedEmail, role: "staff", tokenHash: hash(token), invitedByUserId: owner.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL; if (!baseUrl) throw new Error("Set BETTER_AUTH_URL before sending staff invitations."); const url = `${baseUrl}/account/accept-invite?token=${token}`; await sendEmail({ to: normalizedEmail, subject: "You have been invited to CHNW admin", text: `Accept your staff invitation: ${url}`, html: `<p>You have been invited to help run CHNW.</p><p><a href="${url}">Accept staff invitation</a></p><p>This link expires in seven days.</p>` }); revalidatePath("/admin/staff"); }
export async function acceptStaffInvitation(token: string) { const currentUser = await getSessionUser(); if (!currentUser) throw new Error("Sign in to the account that received this invitation."); const [invite] = await db.select().from(staffInvitations).where(and(eq(staffInvitations.tokenHash, hash(token)), eq(staffInvitations.email, currentUser.email.toLowerCase()), isNull(staffInvitations.acceptedAt), isNull(staffInvitations.revokedAt))).limit(1); if (!invite || invite.expiresAt < new Date()) throw new Error("This invitation is invalid or has expired."); await transactionDb.transaction(async (tx) => { await tx.update(user).set({ role: "staff", isAdmin: true, updatedAt: new Date() }).where(eq(user.id, currentUser.id)); await tx.update(staffInvitations).set({ acceptedAt: new Date() }).where(eq(staffInvitations.id, invite.id)); }); revalidatePath("/admin/staff"); }
export async function revokeInvitation(inviteId: string) { await requireOwner(); await db.update(staffInvitations).set({ revokedAt: new Date() }).where(and(eq(staffInvitations.id, inviteId), isNull(staffInvitations.acceptedAt))); revalidatePath("/admin/staff"); }
export async function getStaffData() { await requireOwner(); const members = await db.select({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }).from(user).where(or(eq(user.role, "staff"), eq(user.role, "owner"))).orderBy(user.role, user.name); const invitations = await db.select().from(staffInvitations).orderBy(desc(staffInvitations.createdAt)); return { members, invitations }; }

/**
 * Adds a staff member without email. The owner sets a temporary password and shares it with them
 * (e.g. on WhatsApp); the account is marked verified because the owner vouches for the address.
 * If an account with that email already exists, it is promoted to staff and verified, and its
 * password is left unchanged.
 */
export async function addStaffDirectly(input: { name: string; email: string; password: string }) {
  await requireOwner();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim().slice(0, 120);
  const password = input.password;
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
  const [existing] = await db.select({ id: user.id, role: user.role }).from(user).where(eq(user.email, email)).limit(1);
  if (existing) {
    if (existing.role === "owner") throw new Error("That email is already the store owner.");
    await db.update(user).set({ role: "staff", isAdmin: true, emailVerified: true, updatedAt: new Date() }).where(eq(user.id, existing.id));
    revalidatePath("/admin/staff");
    return { created: false };
  }
  if (!name) throw new Error("Enter their name.");
  if (password.length < 8) throw new Error("The temporary password needs at least 8 characters.");
  if (password.length > 128) throw new Error("That password is too long.");
  // Same hashing Better Auth uses for sign-up, so they sign in with the normal form.
  const hashed = await hashPassword(password);
  await transactionDb.transaction(async (tx) => {
    const [created] = await tx.insert(user).values({ name, email, emailVerified: true, role: "staff", isAdmin: true }).returning({ id: user.id });
    await tx.insert(account).values({ userId: created.id, accountId: created.id, providerId: "credential", password: hashed });
  });
  revalidatePath("/admin/staff");
  return { created: true };
}

/** Owner-only: take staff access away (the account stays, as a customer). */
export async function removeStaff(userId: string) {
  const owner = await requireOwner();
  if (userId === owner.id) throw new Error("You cannot remove yourself.");
  await db.update(user).set({ role: "customer", isAdmin: false, updatedAt: new Date() }).where(and(eq(user.id, userId), eq(user.role, "staff")));
  revalidatePath("/admin/staff");
}
