"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptStaffInvitation } from "@/app/actions/staff";
export function AcceptInvite({ token }: { token: string }) { const [message, setMessage] = useState(""); const [pending, startTransition] = useTransition(); const router = useRouter(); return <div><button disabled={pending} onClick={() => startTransition(async () => { try { await acceptStaffInvitation(token); router.replace("/admin"); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "We could not accept the invitation."); } })} className="pill pill--red mt-8">{pending ? "Accepting..." : "Accept invitation"}</button>{message && <p role="alert" className="notice mt-5">{message}</p>}</div>; }
