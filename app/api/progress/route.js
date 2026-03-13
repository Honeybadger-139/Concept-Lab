import { NextResponse } from "next/server";
import { getSessionUserEmail } from "@/lib/sessionUser";
import { getUserProgress } from "@/lib/progressStore";

export const runtime = "nodejs";

export async function GET() {
  const email = await getSessionUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getUserProgress(email);
  return NextResponse.json(snapshot, { status: 200 });
}
