import { useEffect, useState } from 'react';

interface IntroPreloaderProps {
  onComplete: () => void;
}

export function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // High-end keyword cycle list matching Nandhini's themes
  const keywords = ['COMMERCE', 'FINANCE', 'STRATEGY', 'CREATIVE', 'NANDHINI'];
  const activeKeyword = keywords[Math.min(keywords.length - 1, Math.floor((progress / 100) * keywords.length))];

  // Lock body scroll on load
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const duration = 1800; // Beautifully paced 1.8s duration
    const interval = 20;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Custom easing curve for the progress count to decelerate near 100% (feels organic!)
      const progressT = step / steps;
      const easedT = 1 - Math.pow(1 - progressT, 3); // Cubic ease out
      const current = Math.min(100, Math.floor(easedT * 100));
      
      setProgress(current);

      if (step >= steps) {
        clearInterval(timer);
        setIsLoaded(true);
        // Wait for the staggered column exit slide (1.4s total transition time)
        setTimeout(() => {
          setIsHidden(true);
          document.body.style.overflow = '';
          onComplete();
        }, 1400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 99999,
      pointerEvents: 'none',
      display: 'flex',
    }}>
      {/* ── Staggered Vertical Columns ── */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '100%',
            background: '#111111', // Matte charcoal
            transition: 'transform 1.1s cubic-bezier(0.85, 0, 0.15, 1)',
            transform: isLoaded ? 'translateY(-100%)' : 'translateY(0%)',
            transitionDelay: `${i * 120}ms`, // 120ms staggered gap
          }}
        />
      ))}

      {/* ── Centered Typographic Overlay ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f5f0eb',
        zIndex: 10,
        transition: 'opacity 0.4s ease-in-out',
        opacity: isLoaded ? 0 : 1, // Smoothly fade text out before column slide begins
      }}>
        {/* Subtle Brand Title */}
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: '0.3em',
          color: 'rgba(245, 240, 235, 0.4)',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          Nandhini Portfolio
        </span>

        {/* Morphing Eased Word Reveal */}
        <div style={{
          height: '6vw',
          minHeight: 48,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2
            key={activeKeyword} // Triggers React keys for slide-up text animations
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px, 4.8vw, 72px)',
              fontStyle: 'italic',
              fontWeight: 300,
              letterSpacing: '0.12em',
              margin: 0,
              animation: 'reveal-text 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            }}
          >
            {activeKeyword}
          </h2>
        </div>

        {/* Main Monospaced Counter */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '9vw',
          fontWeight: 300,
          lineHeight: 1,
          color: '#f5f0eb',
          margin: '20px 0',
          letterSpacing: '-0.02em',
        }}>
          {progress.toString().padStart(3, '0')}%
        </h1>

        {/* Bottom Loading Progress Line */}
        <div style={{
          position: 'absolute',
          bottom: '10vh',
          width: 140,
          height: 1,
          background: 'rgba(245, 240, 235, 0.15)',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#f5f0eb',
            transition: 'width 0.1s linear',
          }} />
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes reveal-text {
          0% {
            transform: translateY(100%) skewY(4deg);
            opacity: 0;
          }
          100% {
            transform: translateY(0) skewY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default IntroPreloader;
