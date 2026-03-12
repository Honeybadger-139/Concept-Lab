import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Concept Lab | Abhishek Gupta",
  description:
    "Interactive learning: RAG, ML, and more. Theory, examples, animations, and tools.",
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
          <header
            style={{
              padding: "0.85rem 1.5rem",
              borderBottom: "1px solid var(--glass-border)",
              background: "var(--bg-secondary)",
              position: "sticky",
              top: 0,
              zIndex: 100,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div
              className="container"
              style={{
                maxWidth: 900,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a
                href="/"
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  textDecoration: "none",
                }}
              >
                Concept Lab
              </a>

              <ThemeToggle />
            </div>
          </header>

          {children}

          <footer
            style={{
              padding: "2rem",
              textAlign: "center",
              borderTop: "1px solid var(--glass-border)",
              marginTop: "auto",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              background: "var(--bg-secondary)",
            }}
          >
            <p style={{ margin: 0 }}>
              <a href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>
                Concept Lab
              </a>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
