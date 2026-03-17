import fs from "node:fs/promises";
import path from "node:path";
import { getNode, getNodesBySection, getNodesByTrack } from "@/data/curriculumData";

const isVercel = process.env.VERCEL || process.env.NODE_ENV === "production";
const STORE_DIR = isVercel ? path.join("/tmp", ".conceptlab") : path.join(process.cwd(), ".conceptlab");
const STORE_FILE = path.join(STORE_DIR, "user-progress.json");
const DEFAULT_STORE = { users: {} };

let writeChain = Promise.resolve();

function normalizeUserId(userId) {
  return String(userId || "").trim().toLowerCase();
}

function normalizeTrackId(trackId) {
  const trimmed = String(trackId || "").trim();
  return trimmed || null;
}

function toNodeKey(sectionId, slug) {
  return `${sectionId}/${slug}`;
}

async function ensureStore() {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.users && typeof parsed.users === "object") {
      return parsed;
    }
  } catch {
    // fall through to default object on malformed file.
  }
  return { ...DEFAULT_STORE, users: {} };
}

async function writeStore(store) {
  const next = JSON.stringify(store, null, 2);
  const tempFile = `${STORE_FILE}.tmp`;
  await fs.writeFile(tempFile, next, "utf8");
  await fs.rename(tempFile, STORE_FILE);
}

function withWriteLock(task) {
  const run = writeChain.then(task, task);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function getUserRecord(store, userId) {
  const key = normalizeUserId(userId);
  if (!key) throw new Error("User id is required");
  if (!store.users[key]) {
    store.users[key] = {
      lastVisited: null,
      visitedOrder: [],
      topics: {},
    };
  }
  const user = store.users[key];
  if (!Array.isArray(user.visitedOrder)) user.visitedOrder = [];
  if (!user.topics || typeof user.topics !== "object") user.topics = {};
  if (!user.lastVisited || typeof user.lastVisited !== "object") user.lastVisited = null;
  return user;
}

function sequenceFromLastVisited(lastVisited) {
  if (!lastVisited?.sectionId || !lastVisited?.slug) return [];
  if (lastVisited.trackId) {
    const trackNodes = getNodesByTrack(lastVisited.trackId);
    if (trackNodes.length > 0) return trackNodes;
  }
  return getNodesBySection(lastVisited.sectionId);
}

function buildSuggestion(user) {
  const visited = new Set(Object.keys(user.topics || {}));
  const lastVisited = user.lastVisited;

  if (!lastVisited) {
    const firstMlNode = getNodesBySection("ml")[0];
    if (!firstMlNode) return null;
    return {
      sectionId: firstMlNode.sectionId,
      slug: firstMlNode.slug,
      title: firstMlNode.title,
      trackId: null,
      href: `/${firstMlNode.sectionId}/${firstMlNode.slug}`,
      reason: "start_path",
    };
  }

  const sequence = sequenceFromLastVisited(lastVisited);
  if (sequence.length === 0) return null;

  const lastKey = toNodeKey(lastVisited.sectionId, lastVisited.slug);
  const lastIndex = sequence.findIndex((node) => toNodeKey(node.sectionId, node.slug) === lastKey);
  const startIndex = lastIndex >= 0 ? lastIndex + 1 : 0;

  for (let i = startIndex; i < sequence.length; i += 1) {
    const node = sequence[i];
    const key = toNodeKey(node.sectionId, node.slug);
    if (visited.has(key)) continue;
    const href = lastVisited.trackId
      ? `/${node.sectionId}/${node.slug}?track=${lastVisited.trackId}`
      : `/${node.sectionId}/${node.slug}`;
    return {
      sectionId: node.sectionId,
      slug: node.slug,
      title: node.title,
      trackId: lastVisited.trackId || null,
      href,
      reason: "next_unvisited",
    };
  }

  return null;
}

function toSnapshot(user) {
  const ordered = user.visitedOrder.filter((key) => Boolean(user.topics[key]));
  const visitedKeys = ordered.length > 0 ? ordered : Object.keys(user.topics || {});
  const lastVisited = user.lastVisited || null;
  const enrichedLastVisited = lastVisited
    ? {
        ...lastVisited,
        title: getNode(lastVisited.sectionId, lastVisited.slug)?.title || null,
        href: lastVisited.trackId
          ? `/${lastVisited.sectionId}/${lastVisited.slug}?track=${lastVisited.trackId}`
          : `/${lastVisited.sectionId}/${lastVisited.slug}`,
      }
    : null;

  return {
    visitedKeys,
    visitedCount: visitedKeys.length,
    lastVisited: enrichedLastVisited,
    suggestion: buildSuggestion(user),
  };
}

export async function getUserProgress(userId) {
  const id = normalizeUserId(userId);
  if (!id) return { visitedKeys: [], visitedCount: 0, lastVisited: null, suggestion: null };

  const store = await readStore();
  const user = getUserRecord(store, id);
  return toSnapshot(user);
}

export async function recordTopicVisit(userId, payload) {
  const id = normalizeUserId(userId);
  const sectionId = String(payload?.sectionId || "").trim();
  const slug = String(payload?.slug || "").trim();
  const trackId = normalizeTrackId(payload?.trackId);

  if (!id || !sectionId || !slug) {
    throw new Error("Invalid visit payload");
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const user = getUserRecord(store, id);
    const key = toNodeKey(sectionId, slug);
    const now = new Date().toISOString();

    const prev = user.topics[key];
    user.topics[key] = {
      sectionId,
      slug,
      trackId,
      firstSeenAt: prev?.firstSeenAt || now,
      lastSeenAt: now,
      visitCount: Number(prev?.visitCount || 0) + 1,
      completed: true,
    };

    user.visitedOrder = user.visitedOrder.filter((entry) => entry !== key);
    user.visitedOrder.push(key);
    user.lastVisited = { sectionId, slug, trackId, visitedAt: now };

    await writeStore(store);
    return toSnapshot(user);
  });
}

export async function importVisitedKeys(userId, visitedKeys = []) {
  const id = normalizeUserId(userId);
  if (!id || !Array.isArray(visitedKeys) || visitedKeys.length === 0) {
    return getUserProgress(id);
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const user = getUserRecord(store, id);
    const now = new Date().toISOString();

    for (const rawKey of visitedKeys) {
      const key = String(rawKey || "").trim();
      if (!key.includes("/")) continue;
      const [sectionId, ...slugParts] = key.split("/");
      const slug = slugParts.join("/").trim();
      if (!sectionId || !slug) continue;

      if (!getNode(sectionId, slug)) continue;

      const nodeKey = toNodeKey(sectionId, slug);
      const prev = user.topics[nodeKey];
      user.topics[nodeKey] = {
        sectionId,
        slug,
        trackId: null,
        firstSeenAt: prev?.firstSeenAt || now,
        lastSeenAt: prev?.lastSeenAt || now,
        visitCount: Number(prev?.visitCount || 0) + 1,
        completed: true,
      };

      user.visitedOrder = user.visitedOrder.filter((entry) => entry !== nodeKey);
      user.visitedOrder.push(nodeKey);
      user.lastVisited = { sectionId, slug, trackId: null, visitedAt: now };
    }

    await writeStore(store);
    return toSnapshot(user);
  });
}

export async function clearUserProgress(userId) {
  const id = normalizeUserId(userId);
  if (!id) return { visitedKeys: [], visitedCount: 0, lastVisited: null, suggestion: null };

  return withWriteLock(async () => {
    const store = await readStore();
    store.users[id] = {
      lastVisited: null,
      visitedOrder: [],
      topics: {},
    };
    await writeStore(store);
    return toSnapshot(store.users[id]);
  });
}
