import { NextResponse } from "next/server";
import { getSessionUserEmail } from "@/lib/sessionUser";
import { clearUserProgress } from "@/lib/progressStore";

export const runtime = "nodejs";

export async function POST() {
  const email = await getSessionUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await clearUserProgress(email);
  return NextResponse.json(snapshot, { status: 200 });
}
