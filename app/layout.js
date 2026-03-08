import "./globals.css";

export const metadata = {
  title: "Concept Lab | Abhishek Gupta",
  description:
    "Interactive learning: RAG, ML, and more. Theory, examples, animations, and tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--glass-border)" }}>
          <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
            <a href="/" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              Concept Lab
            </a>
          </div>
        </header>
        {children}
        <footer style={{ padding: "2rem", textAlign: "center", borderTop: "1px solid var(--glass-border)", marginTop: "auto", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          <p>
            Part of <a href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>Abhishek Gupta's portfolio</a>.
          </p>
        </footer>
      </body>
    </html>
  );
}
