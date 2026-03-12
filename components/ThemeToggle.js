"use client";

import { useTheme } from "./ThemeProvider";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={styles.button}
    >
      <span className={styles.icon}>
        {isDark ? "☀️" : "🌙"}
      </span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
