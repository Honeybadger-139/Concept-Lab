import { NextResponse } from "next/server";
import { getSessionUserEmail } from "@/lib/sessionUser";
import { importVisitedKeys } from "@/lib/progressStore";

export const runtime = "nodejs";

export async function POST(request) {
  const email = await getSessionUserEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const visitedKeys = Array.isArray(body?.visitedKeys) ? body.visitedKeys : [];
  const snapshot = await importVisitedKeys(email, visitedKeys);
  return NextResponse.json(snapshot, { status: 200 });
}
