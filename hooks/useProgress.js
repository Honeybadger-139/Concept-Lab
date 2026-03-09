"use client";

/**
 * useProgress — persists visited node IDs in localStorage so the learner
 * can always see which topics they've already opened, even after closing
 * the browser. Zero dependencies, no server needed.
 *
 * Key format: "cl_visited" → Set of "<sectionId>/<slug>" strings.
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cl_visited";

function readFromStorage() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeToStorage(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* storage full or unavailable – silently ignore */
  }
}

/** Returns a nodeKey string for a given section + slug */
export function nodeKey(sectionId, slug) {
  return `${sectionId}/${slug}`;
}

/**
 * Hook used on any client component that needs progress info.
 *
 * Returns:
 *   visited      – Set<string> of visited nodeKeys
 *   markVisited  – (sectionId, slug) => void
 *   isVisited    – (sectionId, slug) => boolean
 *   clearAll     – () => void
 */
export function useProgress() {
  const [visited, setVisited] = useState(() => readFromStorage());

  // Keep state in sync if another tab changes localStorage
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setVisited(readFromStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markVisited = useCallback((sectionId, slug) => {
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(nodeKey(sectionId, slug));
      writeToStorage(next);
      return next;
    });
  }, []);

  const isVisited = useCallback(
    (sectionId, slug) => visited.has(nodeKey(sectionId, slug)),
    [visited]
  );

  const clearAll = useCallback(() => {
    setVisited(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { visited, markVisited, isVisited, clearAll };
}
