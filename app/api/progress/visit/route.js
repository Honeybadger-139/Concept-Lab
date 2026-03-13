import { NextResponse } from "next/server";
import { getNode, getNodesByTrack, getTrack } from "@/data/curriculumData";
import { getSessionUserEmail } from "@/lib/sessionUser";
import { recordTopicVisit } from "@/lib/progressStore";

export const runtime = "nodejs";

function sanitizeTrackId(trackId, sectionId, slug) {
  const normalized = String(trackId || "").trim();
  if (!normalized) return null;

  const track = getTrack(normalized);
  if (!track || track.sectionId !== sectionId) return null;

  const nodes = getNodesByTrack(normalized);
  const inTrack = nodes.some((node) => node.slug === slug && node.sectionId === sectionId);
  if (!inTrack) return null;

  return normalized;
}

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

  const sectionId = String(body?.sectionId || "").trim();
  const slug = String(body?.slug || "").trim();
  const rawTrackId = String(body?.trackId || "").trim();

  if (!sectionId || !slug) {
    return NextResponse.json({ error: "sectionId and slug are required" }, { status: 400 });
  }

  const node = getNode(sectionId, slug);
  if (!node) {
    return NextResponse.json({ error: "Unknown topic node" }, { status: 404 });
  }

  const trackId = sanitizeTrackId(rawTrackId, sectionId, slug);

  const snapshot = await recordTopicVisit(email, {
    sectionId,
    slug,
    trackId,
  });

  return NextResponse.json(snapshot, { status: 200 });
}
