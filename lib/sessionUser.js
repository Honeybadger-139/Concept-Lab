import { auth } from "@/auth";
import { getLocalFallbackUserId, isAuthEnabled } from "@/lib/authMode";

export async function getSessionUserEmail() {
  if (!isAuthEnabled()) return getLocalFallbackUserId();

  const session = await auth();
  const email = String(session?.user?.email || "").trim().toLowerCase();
  return email || null;
}
