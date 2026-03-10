"use client";
import { useState, useEffect } from "react";

/**
 * Returns a tokens object whose values are read from the CSS custom properties
 * defined in globals.css under :root / [data-theme="light"].
 * Re-reads whenever the data-theme attribute on <html> changes.
 */
export function useChartTheme() {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    function read() {
      const s = getComputedStyle(document.documentElement);
      const v = (name) => s.getPropertyValue(name).trim();
      setTokens({
        bg:         v("--chart-bg"),
        border:     v("--chart-border"),
        grid:       v("--chart-grid"),
        gridMid:    v("--chart-grid-mid"),
        tick:       v("--chart-tick"),
        label:      v("--chart-label"),
        labelMid:   v("--chart-label-mid"),
        surface:    v("--chart-surface"),
        surface2:   v("--chart-surface-2"),
        surface3:   v("--chart-surface-3"),
        muted:      v("--chart-muted"),
        muted2:     v("--chart-muted-2"),
        muted3:     v("--chart-muted-3"),
        rule:       v("--chart-rule"),
        btnBg:      v("--chart-btn-bg"),
        btnBorder:  v("--chart-btn-border"),
        btnText:    v("--chart-btn-text"),
      });
    }

    read();

    // Watch for theme toggle (MutationObserver on <html> data-theme)
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return tokens;
}
