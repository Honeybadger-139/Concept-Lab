"use client";

/**
 * NodeShell — wraps the node page so it can call markVisited() on mount.
 * The node page itself is a Server Component; this is the minimal
 * "client island" that handles the side-effect of recording progress.
 */

import { useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";

export default function NodeShell({ sectionId, slug, trackId = null, children }) {
  const { markVisited } = useProgress();

  useEffect(() => {
    markVisited(sectionId, slug, trackId);
  }, [sectionId, slug, trackId, markVisited]);

  return <>{children}</>;
}
