import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAuthEnabled } from "@/lib/authMode";

export async function requireAuthPage(callbackUrl = "/") {
  if (!isAuthEnabled()) return null;

  const session = await auth();
  const email = String(session?.user?.email || "").trim().toLowerCase();
  if (!email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}
