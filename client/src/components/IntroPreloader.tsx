import { useEffect, useState } from 'react';

interface IntroPreloaderProps {
  onComplete: () => void;
}

/**
 * IntroPreloader — Awwwards-grade cinematic intro.
 *
 * Sequence:
 *   0 ms  → panel appears (instant, black)
 *  350ms  → corner label fades in
 *  700ms  → letters flip up one-by-one (overflow:hidden clip technique)
 * 1700ms  → "PORTFOLIO" subtitle expands in
 * 2000ms  → red rule line draws from center outward
 * 3200ms  → hold complete, begin exit
 * 3200ms  → single panel translates Y(-100%) with silky spring curve
 * 4400ms  → done, onComplete fires
 */

const NAME = 'NANDHINI';
const LETTER_STAGGER = 100; // ms between each letter (was 68)
const LETTER_DUR = 850;     // ms for each letter's translateY transition (was 700)

// Timing milestones (ms from mount)
const T_LABEL    = 500;
const T_LETTERS  = 900;
const T_SUBTITLE = T_LETTERS + NAME.length * LETTER_STAGGER + 250;
const T_LINE     = T_SUBTITLE + 400;
const T_EXIT     = T_LINE    + 1500;
const T_DONE     = T_EXIT    + 1400;

// Spring curve used everywhere for that "buttery" feel
const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SILKY  = 'cubic-bezier(0.76, 0, 0.24, 1)';

export function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  const [showLabel,    setShowLabel]    = useState(false);
  const [showLetters,  setShowLetters]  = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLine,     setShowLine]     = useState(false);
  const [isExiting,    setIsExiting]    = useState(false);
  const [isDone,       setIsDone]       = useState(false);

  // ── lock scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── master timeline ───────────────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowLabel(true),    T_LABEL),
      setTimeout(() => setShowLetters(true),  T_LETTERS),
      setTimeout(() => setShowSubtitle(true), T_SUBTITLE),
      setTimeout(() => setShowLine(true),     T_LINE),
      setTimeout(() => setIsExiting(true),    T_EXIT),
      setTimeout(() => {
        setIsDone(true);
        document.body.style.overflow = '';
        onComplete();
      }, T_DONE),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          THE PANEL — single element that slides up on exit
      ════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: '#000000',
          transform: isExiting ? 'translateY(-100%)' : 'translateY(0%)',
          transition: isExiting
            ? `transform 1.3s ${SILKY}`
            : 'none',
          willChange: 'transform',
        }}
      >

        {/* ── year / index label — bottom center ───────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.32em',
            color: 'rgba(245,240,235,0.45)',
            opacity: showLabel && !isExiting ? 1 : 0,
            transition: `opacity 0.7s ease 0.15s`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          2026
        </div>

        {/* ── centre stage ─────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* ── NAME letters — each wrapped in overflow:hidden mask ───── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              // Slight breathing space between letters
              gap: 'clamp(1px, 0.5vw, 7px)',
            }}
          >
            {NAME.split('').map((char, i) => {
              const delay = i * LETTER_STAGGER;
              const visible = showLetters;
              return (
                <div
                  key={i}
                  style={{
                    overflow: 'hidden',
                    // height mask — clip exactly to cap height
                    lineHeight: 1,
                    paddingBottom: '0.08em', // show descenders cleanly
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(56px, 9.5vw, 130px)',
                      fontWeight: 300,
                      letterSpacing: '0.06em',
                      color: '#f5f0eb',
                      lineHeight: 1,
                      transform: visible
                        ? 'translateY(0px)'
                        : 'translateY(108%)',
                      transition: visible
                        ? `transform ${LETTER_DUR}ms ${SPRING} ${delay}ms`
                        : 'none',
                      willChange: 'transform',
                      userSelect: 'none',
                    }}
                  >
                    {char}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Red rule line ─────────────────────────────────────────── */}
          <div
            style={{
              marginTop: 18,
              height: 1,
              width: showLine ? 'clamp(200px, 32vw, 480px)' : '0px',
              background: 'linear-gradient(90deg, transparent 0%, #e63b2e 35%, #e63b2e 65%, transparent 100%)',
              transition: showLine
                ? `width 0.95s ${SPRING} 0.05s`
                : 'none',
              willChange: 'width',
            }}
          />

          {/* ── PORTFOLIO subtitle ────────────────────────────────────── */}
          <div
            style={{
              marginTop: 16,
              overflow: 'hidden',
              lineHeight: 1,
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(9px, 0.85vw, 12px)',
                fontWeight: 400,
                letterSpacing: showSubtitle ? '0.55em' : '0.1em',
                color: 'rgba(245,240,235,0.38)',
                textTransform: 'uppercase',
                transform: showSubtitle ? 'translateY(0)' : 'translateY(120%)',
                opacity: showSubtitle ? 1 : 0,
                transition: showSubtitle
                  ? `transform 0.65s ${SPRING} 0.05s,
                     opacity   0.5s  ease     0.05s,
                     letter-spacing 0.9s ${SPRING} 0.05s`
                  : 'none',
                willChange: 'transform, opacity, letter-spacing',
                userSelect: 'none',
              }}
            >
              PORTFOLIO
            </span>
          </div>
        </div>
      </div>

      {/* ── Keyframes injected once ─────────────────────────────────────────── */}
      <style>{`
        @keyframes ip-noop { from {} to {} }
      `}</style>
    </>
  );
}

export default IntroPreloader;
