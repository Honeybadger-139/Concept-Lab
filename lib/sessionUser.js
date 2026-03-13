import { auth } from "@/auth";

export async function getSessionUserEmail() {
  const session = await auth();
  const email = String(session?.user?.email || "").trim().toLowerCase();
  return email || null;
}
