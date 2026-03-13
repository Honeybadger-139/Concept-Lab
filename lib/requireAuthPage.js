import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAuthPage(callbackUrl = "/") {
  const session = await auth();
  const email = String(session?.user?.email || "").trim().toLowerCase();
  if (!email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}
