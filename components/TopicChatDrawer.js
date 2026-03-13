"use client";

import { useEffect, useState } from "react";
import TopicScopedChatbot from "./TopicScopedChatbot";
import styles from "./TopicChatDrawer.module.css";

export default function TopicChatDrawer({ topic, accentColor = "#6366f1" }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function toggleDrawer() {
    setIsOpen((current) => !current);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={toggleDrawer}
        style={{ "--chat-accent": accentColor }}
        aria-controls="topic-chat-drawer"
        aria-expanded={isOpen}
      >
        {isOpen ? "Close Topic Chat" : "Ask Topic Chat"}
      </button>

      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        aria-hidden={!isOpen}
        onClick={closeDrawer}
      />

      <aside
        id="topic-chat-drawer"
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        style={{ "--chat-accent": accentColor }}
        aria-hidden={!isOpen}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.headerLabel}>Topic Assistant</p>
            <h3 className={styles.headerTitle}>{topic.title}</h3>
          </div>
          <button type="button" className={styles.closeButton} onClick={closeDrawer} aria-label="Close topic chat">
            ×
          </button>
        </header>

        <div className={styles.body}>
          <TopicScopedChatbot topic={topic} />
        </div>
      </aside>
    </>
  );
}
