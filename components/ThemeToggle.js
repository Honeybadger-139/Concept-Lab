"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.75rem",
        borderRadius: "9999px",
        border: "1px solid var(--glass-border)",
        background: "var(--bg-tertiary)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        transition: "all 0.2s ease",
        userSelect: "none",
        letterSpacing: "0.02em",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = "var(--text-primary)";
        e.currentTarget.style.borderColor = "var(--accent-tertiary)";
        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(167,139,250,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.borderColor = "var(--glass-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: "1rem", lineHeight: 1 }}>
        {isDark ? "☀️" : "🌙"}
      </span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
