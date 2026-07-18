import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

// Premium Custom Cursor
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      left: position.x,
      top: position.y,
      width: '28px',
      height: '36px',
      pointerEvents: 'none',
      zIndex: 99999,
      transform: `translate(-2px, -2px) scale(${clicked ? 0.8 : 1})`,
      transition: 'transform 0.1s ease-out',
    }}>
      <svg viewBox="0 0 32 32" width="100%" height="100%" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
        <defs>
          <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <path d="M 2,2 L 14,28 L 17,17 L 28,14 Z" fill="url(#cursorGrad)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};





export default function CreatorCreditsPage() {
  const [, navigate] = useLocation();
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  const rippleCount = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => navigate('/'), 600);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize to -1 to 1
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    const newRipple = { x: e.clientX, y: e.clientY, id: rippleCount.current++ };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
        opacity: leaving ? 0 : entered ? 1 : 0,
        background: '#000000',
        color: '#ffffff',
        transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        cursor: 'none',
        fontFamily: "'Space Mono', monospace",
        userSelect: 'none',
      }}
    >
      <CustomCursor />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;800;900&family=Space+Mono:wght@400;700&family=Caveat:wght@400;600;700&display=swap');

        .paper-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          z-index: 999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          background-position: center;
          pointer-events: none;
          z-index: 2;
        }
        
        .float-anim {
          animation: floatFloat 6s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes floatFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.4);
          animation: rippleEffect 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          pointer-events: none;
          z-index: 150;
        }
        @keyframes rippleEffect {
          0% { width: 0; height: 0; opacity: 1; margin-left: 0; margin-top: 0; }
          100% { width: 120px; height: 120px; opacity: 0; margin-left: -60px; margin-top: -60px; border-width: 0px; }
        }

        /* Blueprint Labels */
        .corner-label {
          position: absolute;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 2px;
          z-index: 100;
          pointer-events: none;
        }
        .corner-label.top-left { top: 40px; left: 5%; }
        .corner-label.bottom-left { bottom: 40px; left: 5%; }
        .corner-label.bottom-right { bottom: 40px; right: 5%; }

        .header-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          display: grid;
          grid-template-columns: 150px 1fr 150px;
          align-items: center;
          padding: 0 5%;
          z-index: 300;
          pointer-events: auto;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-tech-list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #888888;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .nav-tech-list span:not(.separator),
        .nav-tech-list a {
          text-decoration: none;
          color: inherit;
          transition: color 0.3s ease;
          cursor: pointer;
        }

        .nav-tech-list span:not(.separator):hover,
        .nav-tech-list a:hover {
          color: #ffffff;
        }

        .nav-tech-list .separator {
          color: rgba(255, 255, 255, 0.15);
          user-select: none;
        }

        .close-btn {
          justify-self: start;
          background: #fffdf8;
          color: #1a1a1a;
          border-radius: 0px;
          padding: 8px 18px;
          font-size: 16px;
          font-family: 'Caveat', cursive;
          font-weight: 600;
          cursor: none;
          pointer-events: auto;
          box-shadow: 4px 4px 0 #1a1a1a;
          border: 2px solid #1a1a1a;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .close-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 #1a1a1a;
          background: #fffdf8;
          color: #1a1a1a;
        }

        .bottom-badge {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
          z-index: 300;
          pointer-events: none;
          white-space: nowrap;
        }

        .bottom-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
          opacity: 0.8;
        }

        .bottom-badge-text {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #ffffff;
        }

        .central-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
        }

        .parallax-bg-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          white-space: nowrap;
          text-align: center;
          pointer-events: none;
          z-index: 1;
          width: 100%;
        }

        .bg-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(90px, 16vw, 220px);
          line-height: 0.8;
          letter-spacing: -6px;
          color: #ffffff;
          text-transform: uppercase;
          margin: 0;
        }

        .bg-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: clamp(12px, 2vw, 16px);
          font-weight: 700;
          letter-spacing: 12px;
          color: #ffffff;
          text-transform: uppercase;
          margin-top: 15px;
          margin-left: 12px;
        }

        /* ── RESPONSIVENESS MEDIA QUERIES ── */
        @media (max-width: 768px) {
          .corner-label {
            display: none !important;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            height: 90px;
            padding: 0 4%;
          }

          .nav-tech-list {
            gap: 12px;
            font-size: 10px;
          }

          .close-btn {
            padding: 10px 24px;
            font-size: 10px;
            letter-spacing: 2px;
          }

          .bottom-badge {
            bottom: 24px;
            padding: 10px 20px;
          }

          .bottom-badge-text {
            font-size: 9px;
            letter-spacing: 1.5px;
          }

          .bg-title {
            font-size: clamp(60px, 12vw, 140px);
            letter-spacing: -4px;
          }

          .bg-subtitle {
            font-size: clamp(8px, 1.8vw, 12px);
            letter-spacing: 8px;
            margin-top: 10px;
            margin-left: 8px;
          }
        }

        @media (max-width: 600px) {
          .header-container {
            display: flex;
            flex-direction: column;
            height: auto;
            padding: 20px 4% 15px;
            gap: 12px;
            align-items: center;
          }

          .nav-tech-list {
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
          }

          .close-btn {
            width: 100%;
            text-align: center;
            padding: 10px 0;
          }
        }
      `}</style>

      {/* Premium Visual Layers */}
      <div className="paper-grain" />
      <div className="grid-overlay" />

      {/* Blueprint Editorial Details (Hidden on mobile) */}
      <div className="corner-label top-left">
        [ SEC_01 // LAB // CREDITS ]
      </div>
      <div className="corner-label bottom-left">
        [ NANDHINI'S ARCHIVE ©2026 ]
      </div>
      <div className="corner-label bottom-right">
        [ CC_DIR // MONISH_DEV ]
      </div>

      {/* ── HEADER ── */}
      <div className="header-container">
        <button 
          onClick={goBack} 
          className="close-btn"
        >
          ✦ CLOSE X
        </button>
        <div className="nav-tech-list">
          <span>React</span>
          <span className="separator">/</span>
          <span>TypeScript</span>
          <span className="separator">/</span>
          <span>Tailwind CSS</span>
          <span className="separator">/</span>
          <span>Wouter</span>
          <span className="separator">/</span>
          <span>Vite</span>
          <span className="separator">/</span>
          <a 
            href="https://www.linkedin.com/in/monish-n-24bba330b?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
        <div className="nav-spacer" style={{ width: '150px' }} />
      </div>

      {/* ── PREMIUM BOTTOM CREDITS BADGE ── */}
      <div className="bottom-badge">
        <div className="bottom-badge-dot" />
        <span className="bottom-badge-text">
          SITE MADE BY <span style={{ color: '#ffffff', fontWeight: 900 }}>MONISH CREATIVE DEVELOPER</span>
        </span>
      </div>

      {/* ── CENTRAL INTERACTIVE CANVAS ── */}
      <div className="central-container">
        
        {/* Massive Background Typography Parallax */}
        <div 
          className="parallax-bg-wrapper"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 12}px), calc(-50% + ${mousePos.y * 12}px))`,
          }}
        >
          <h1 className="bg-title">
            MONISH
          </h1>
          <div className="bg-subtitle">
            CREATIVE DEVELOPER
          </div>
        </div>

      </div>

      {/* Ripples */}
      {ripples.map(r => (
        <div key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
