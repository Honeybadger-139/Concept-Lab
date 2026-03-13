"use client";

/**
 * useProgress — backed by server APIs and per-user storage.
 * Keeps client components simple while ensuring progress is tied to
 * authenticated users (not browser-only localStorage).
 */

import { useState, useEffect, useCallback } from "react";

const LEGACY_STORAGE_KEY = "cl_visited";
const LEGACY_MIGRATED_FLAG = "cl_visited_migrated_v1";

function isValidSnapshot(payload) {
  return payload && typeof payload === "object" && Array.isArray(payload.visitedKeys);
}

function toVisitedSet(visitedKeys) {
  return new Set(Array.isArray(visitedKeys) ? visitedKeys.map((key) => String(key)) : []);
}

function readLegacyVisitedKeys() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((entry) => String(entry)) : [];
  } catch {
    return [];
  }
}

function readLegacyMigrationFlag() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LEGACY_MIGRATED_FLAG) === "1";
  } catch {
    return false;
  }
}

function writeLegacyMigrationFlag() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEGACY_MIGRATED_FLAG, "1");
  } catch {
    // ignore
  }
}

function clearLegacyStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function fetchProgressSnapshot() {
  const response = await fetch("/api/progress", { cache: "no-store" });
  if (!response.ok) throw new Error(`progress GET failed: ${response.status}`);
  const payload = await response.json();
  if (!isValidSnapshot(payload)) throw new Error("invalid progress payload");
  return payload;
}

function applySnapshot(setVisited, setLastVisited, setSuggestion, snapshot) {
  setVisited(toVisitedSet(snapshot.visitedKeys));
  setLastVisited(snapshot.lastVisited || null);
  setSuggestion(snapshot.suggestion || null);
}

/** Returns a nodeKey string for a given section + slug */
export function nodeKey(sectionId, slug) {
  return `${sectionId}/${slug}`;
}

export function useProgress() {
  const [visited, setVisited] = useState(() => new Set());
  const [lastVisited, setLastVisited] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const hydrate = useCallback(async () => {
    try {
      const snapshot = await fetchProgressSnapshot();
      applySnapshot(setVisited, setLastVisited, setSuggestion, snapshot);
    } catch {
      setVisited(new Set());
      setLastVisited(null);
      setSuggestion(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (readLegacyMigrationFlag()) return;

    const legacyKeys = readLegacyVisitedKeys();
    if (legacyKeys.length === 0) {
      writeLegacyMigrationFlag();
      clearLegacyStorage();
      return;
    }

    fetch("/api/progress/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitedKeys: legacyKeys }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((snapshot) => {
        if (isValidSnapshot(snapshot)) {
          applySnapshot(setVisited, setLastVisited, setSuggestion, snapshot);
        }
        writeLegacyMigrationFlag();
        clearLegacyStorage();
      })
      .catch(() => {
        // Avoid retry loops if import endpoint fails.
        writeLegacyMigrationFlag();
      });
  }, [hydrated]);

  const markVisited = useCallback((sectionId, slug, trackId = null) => {
    const key = nodeKey(sectionId, slug);
    const nowIso = new Date().toISOString();

    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      next.add(key);
      return next;
    });

    setLastVisited({ sectionId, slug, trackId: trackId || null, visitedAt: nowIso, href: trackId ? `/${sectionId}/${slug}?track=${trackId}` : `/${sectionId}/${slug}` });

    fetch("/api/progress/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, slug, trackId }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((snapshot) => {
        if (isValidSnapshot(snapshot)) {
          applySnapshot(setVisited, setLastVisited, setSuggestion, snapshot);
        }
      })
      .catch(() => {
        // Keep optimistic client state if server write fails.
      });
  }, []);

  const isVisited = useCallback(
    (sectionId, slug) => visited.has(nodeKey(sectionId, slug)),
    [visited]
  );

  const clearAll = useCallback(() => {
    setVisited(new Set());
    setLastVisited(null);
    setSuggestion(null);
    fetch("/api/progress/clear", { method: "POST" }).catch(() => {
      // noop
    });
  }, []);

  return { visited, lastVisited, suggestion, hydrated, markVisited, isVisited, clearAll };
}
