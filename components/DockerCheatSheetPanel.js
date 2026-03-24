"use client";

const CHEAT_SHEET_URL = "/cheatsheets/docker-cheat-sheet.pdf";

export default function DockerCheatSheetPanel() {
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <p style={{ margin: "0 0 0.85rem", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
        Open the original cheat sheet in a separate tab, download it for quick revision, or skim it inline below.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          marginBottom: "0.9rem",
        }}
      >
        <a
          href={CHEAT_SHEET_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.55rem 0.9rem",
            borderRadius: 999,
            border: "1px solid rgba(34,197,94,0.25)",
            background: "rgba(20,83,45,0.16)",
            color: "#86efac",
            fontSize: "0.8rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Open Embedded PDF
        </a>
        <a
          href={CHEAT_SHEET_URL}
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.55rem 0.9rem",
            borderRadius: 999,
            border: "1px solid rgba(6,182,212,0.25)",
            background: "rgba(8,47,73,0.18)",
            color: "#67e8f9",
            fontSize: "0.8rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Download Cheat Sheet
        </a>
      </div>

      <div
        style={{
          border: "1px solid var(--glass-border)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--bg-secondary)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
            padding: "0.85rem",
            borderBottom: "1px solid var(--glass-border)",
            background: "rgba(15,23,42,0.72)",
          }}
        >
          {[
            {
              title: "Best Use",
              detail: "Fast command recall before coding, debugging, or interview revision.",
            },
            {
              title: "Pair With",
              detail: "The Docker topic pages for architecture, tradeoffs, and operational reasoning.",
            },
            {
              title: "Data Project Angle",
              detail: "Use it while packaging APIs, notebooks, data services, and local integration stacks.",
            },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: "0.76rem", color: "var(--text-primary)", fontWeight: 800, marginBottom: "0.25rem" }}>
                {item.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>

        <iframe
          title="Docker cheat sheet PDF"
          src={`${CHEAT_SHEET_URL}#toolbar=0`}
          style={{
            width: "100%",
            height: "680px",
            border: "0",
            background: "#fff",
          }}
        />
      </div>
    </div>
  );
}
