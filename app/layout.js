import "./globals.css";
import styles from "./layout.module.css";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import AuthControls from "@/components/AuthControls";

export const metadata = {
  title: "Concept Lab | Abhishek Gupta",
  description:
    "Interactive learning: RAG, ML, and more. Theory, examples, animations, and tools.",
  openGraph: {
    title: "Concept Lab | Abhishek Gupta",
    description: "Interactive learning: RAG, ML, and more. Theory, examples, animations, and tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concept Lab | Abhishek Gupta",
    description: "Interactive learning: RAG, ML, and more. Theory, examples, animations, and tools.",
  },
};

// Inline script injected into <head> before first paint to prevent flash of wrong theme
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('concept-lab-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: set theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className={styles.skipLink}>
            Skip to content
          </a>

          <header className={styles.header}>
            <div className={styles.headerInner}>
              <a href="/" className={styles.brandText}>
                ABHISHEK'S PERSONAL LEARNING HUB
              </a>

              <div className={styles.actions}>
                <AuthControls />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <div id="main-content">{children}</div>

          <footer className={styles.footer}>
            <p className={styles.footerText}>
              @2026 ABHISHEK'S PERSONAL LEARNING HUB
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
