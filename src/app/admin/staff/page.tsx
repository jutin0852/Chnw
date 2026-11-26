import { getStaffData } from "@/app/actions/staff";
import { StaffManagement } from "@/components/admin/staff-management";

export default async function StaffPage() {
  const { members, invitations } = await getStaffData();
  // Invitations need a working email sender (Resend).
  const emailReady = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
  return <StaffManagement members={members} invitations={invitations} emailReady={emailReady} />;
}
