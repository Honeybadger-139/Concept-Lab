"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./FlashCardDeck.module.css";

/**
 * FlashCardDeck
 * An interactive 3D flip-card revision tool.
 *
 * Props:
 *   cards  — array of { q: string, a: string }
 *
 * Features:
 *   • 3D CSS flip animation (front = question, back = answer)
 *   • Prev / Next navigation resets flip state
 *   • Keyboard: Space or Enter to flip, ← → to navigate
 *   • Progress counter + dots indicator
 */
export default function FlashCardDeck({ cards = [] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(new Set());

  const current = cards[index];

  const flip = useCallback(() => {
    setFlipped((f) => {
      const next = !f;
      // mark as answered once revealed
      if (next) setAnswered((prev) => new Set([...prev, index]));
      return next;
    });
  }, [index]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
    setFlipped(false);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(cards.length - 1, i + 1));
    setFlipped(false);
  }, [cards.length]);

  const reset = useCallback(() => {
    setIndex(0);
    setFlipped(false);
    setAnswered(new Set());
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      // Only intercept when user isn't typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, prev, next]);

  if (!cards.length) return null;

  const pct = Math.round((answered.size / cards.length) * 100);

  return (
    <div className={styles.deck}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.labelRow}>
          <span className={styles.label}>🃏 Flash Cards</span>
          <span className={styles.subtitle}>Tap a card to reveal the answer</span>
        </div>
        <span className={styles.counter}>
          {index + 1} <span className={styles.sep}>/</span> {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.progressLabel}>
        {answered.size === 0
          ? "Start flipping cards to track your progress"
          : answered.size === cards.length
          ? "🎉 All cards reviewed!"
          : `${answered.size} of ${cards.length} reviewed (${pct}%)`}
      </p>

      {/* 3D Card */}
      <div
        className={styles.scene}
        onClick={flip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Answer side. Press space to flip back." : "Question side. Press space to reveal answer."}
        onKeyDown={(e) => e.key === "Enter" && flip()}
      >
        <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
          {/* Front — Question */}
          <div className={styles.face}>
            <span className={styles.faceBadge}>Question</span>
            <p className={styles.cardText}>{current.q}</p>
            <span className={styles.tapHint}>
              {flipped ? "" : "tap to reveal →"}
            </span>
          </div>

          {/* Back — Answer */}
          <div className={`${styles.face} ${styles.back}`}>
            <span className={`${styles.faceBadge} ${styles.answerBadge}`}>Answer</span>
            <p className={styles.cardText}>{current.a}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          onClick={prev}
          disabled={index === 0}
          className={styles.btn}
          aria-label="Previous card"
        >
          ← Prev
        </button>

        <button
          onClick={flip}
          className={`${styles.btn} ${styles.flipBtn}`}
          aria-label={flipped ? "Show question" : "Reveal answer"}
        >
          {flipped ? "Show Question" : "Reveal Answer"}
        </button>

        <button
          onClick={next}
          disabled={index === cards.length - 1}
          className={styles.btn}
          aria-label="Next card"
        >
          Next →
        </button>
      </div>

      {/* Dot navigation */}
      <div className={styles.dots} role="tablist" aria-label="Card selector">
        {cards.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Card ${i + 1}${answered.has(i) ? " (reviewed)" : ""}`}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""} ${answered.has(i) ? styles.dotDone : ""}`}
            onClick={() => { setIndex(i); setFlipped(false); }}
          />
        ))}
      </div>

      {/* Reset + keyboard hint */}
      <div className={styles.footer}>
        <span className={styles.keyHint}>⌨ Space to flip · ← → to navigate</span>
        <button onClick={reset} className={styles.resetBtn}>Reset all</button>
      </div>
    </div>
  );
}
