import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useTransition } from '../contexts/TransitionContext';

/* ─────────────────────────────────────────────────
   Premium Custom Cursor
   Disabled on touch screen/mobile devices to prevent glitches
───────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────
   Canvas ripple — liquid displacement on hover.
   Uses PointerEvents for mobile, trackpad, and mouse.
   Customized for the credits page.
───────────────────────────────────────────────── */
function RippleTitle({
  text,
  fontSize,
  spacing,
}: {
  text: string;
  fontSize: number;
  spacing: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, active: false, moving: false, t: 0 });
  const str = useRef(0);
  const tick = useRef(0);
  const startXRef = useRef(0);
  const totalWidthRef = useRef(0);

  const H = Math.round(fontSize * 2.2);

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const off = document.createElement('canvas');
    offRef.current = off;
    const otx = off.getContext('2d'); if (!otx) return;

    let W = 0;

    const paint = () => {
      if (W <= 0) return;
      // Draw background
      otx.fillStyle = '#000000';
      otx.fillRect(0, 0, W, H);

      // Draw text
      otx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
      otx.fillStyle = '#ffffff';
      otx.textAlign = 'left';
      otx.textBaseline = 'middle';

      const chars = text.split('');
      let totalWidth = 0;
      const charWidths = chars.map((char, index) => {
        const w = otx.measureText(char).width;
        totalWidth += w;
        if (index < chars.length - 1) {
          totalWidth += spacing;
        }
        return w;
      });

      const startX = (W - totalWidth) / 2;
      let currentX = startX;
      chars.forEach((char, index) => {
        otx.fillText(char, currentX, H / 2);
        currentX += charWidths[index] + spacing;
      });

      startXRef.current = startX;
      totalWidthRef.current = totalWidth;
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        if (width > 0 && width !== W) {
          W = width;
          cv.width = W;
          cv.height = H;
          off.width = W;
          off.height = H;
          paint();
        }
      }
    });

    if (wrapRef.current) {
      observer.observe(wrapRef.current);
    }

    // Force repaint when fonts are loaded
    document.fonts.ready.then(() => {
      paint();
    });

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        mouse.current.active = false;
        return;
      }
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;

      const sx = startXRef.current;
      const tw = totalWidthRef.current;
      const isOverText = mx >= sx && mx <= sx + tw && Math.abs(my - H / 2) < fontSize * 0.35;

      if (isOverText) {
        mouse.current = {
          x: mx,
          y: my,
          active: true,
          moving: true,
          t: Date.now()
        };
        str.current = Math.min(3.0, str.current + 0.45);
      } else {
        mouse.current.active = false;
      }
    };

    const onPointerLeave = () => {
      mouse.current.active = false;
    };

    cv.addEventListener('pointermove', onPointerMove);
    cv.addEventListener('pointerleave', onPointerLeave);
    cv.addEventListener('pointerdown', onPointerMove);

    let raf: number;
    const loop = () => {
      tick.current += 0.042;
      if (Date.now() - mouse.current.t > 80) {
        mouse.current.moving = false;
      }
      if (!mouse.current.active) {
        str.current *= 0.72;
      } else if (!mouse.current.moving) {
        str.current *= 0.88;
      }

      if (str.current < 0.01 && !mouse.current.active) {
        ctx.drawImage(off, 0, 0);
        raf = requestAnimationFrame(loop);
        return;
      }

      ctx.drawImage(off, 0, 0);
      if (W > 0) {
        const src = otx.getImageData(0, 0, W, H);
        const sp = src.data;
        const { x: mx, y: my } = mouse.current;
        const R = fontSize * 0.8;
        const amp = fontSize * 0.44 * str.current;

        const x0 = Math.max(0, Math.floor(mx - R)), x1 = Math.min(W, Math.ceil(mx + R));
        const y0 = Math.max(0, Math.floor(my - R)), y1 = Math.min(H, Math.ceil(my + R));
        const bw = x1 - x0, bh = y1 - y0;

        if (bw > 0 && bh > 0) {
          const dst = ctx.createImageData(bw, bh);
          const dp = dst.data;
          for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
              const cx = x0 + x, cy = y0 + y;
              const dx = cx - mx, dy = cy - my;
              const d = Math.sqrt(dx * dx + dy * dy);
              const i = (y * bw + x) * 4;

              if (d < R) {
                const ease = (1 - d / R) ** 2;
                const wave = Math.sin(d * 0.08 - tick.current * 4.8) * ease * amp;
                const nx = d > 0 ? dx / d : 0, ny = d > 0 ? dy / d : 0;

                const rx = Math.max(0, Math.min(W - 1, Math.round(cx + nx * wave)));
                const ry = Math.max(0, Math.min(H - 1, Math.round(cy + ny * wave)));

                const gx = Math.max(0, Math.min(W - 1, Math.round(cx + nx * wave * 0.72)));
                const gy = Math.max(0, Math.min(H - 1, Math.round(cy + ny * wave * 0.72)));

                const bx = Math.max(0, Math.min(W - 1, Math.round(cx + nx * wave * 0.48)));
                const by = Math.max(0, Math.min(H - 1, Math.round(cy + ny * wave * 0.48)));

                const getVal = (sx_val: number, sy_val: number, ch: number) => {
                  return sp[(sy_val * W + sx_val) * 4 + ch];
                };

                dp[i] = getVal(rx, ry, 0); // Red
                dp[i+1] = getVal(gx, gy, 1); // Green
                dp[i+2] = getVal(bx, by, 2); // Blue
                dp[i+3] = 255;
              } else {
                const fi = (cy * W + cx) * 4;
                dp[i]=sp[fi]; dp[i+1]=sp[fi+1]; dp[i+2]=sp[fi+2]; dp[i+3]=sp[fi+3];
              }
            }
          }
          ctx.putImageData(dst, x0, y0);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      cv.removeEventListener('pointermove', onPointerMove);
      cv.removeEventListener('pointerleave', onPointerLeave);
      cv.removeEventListener('pointerdown', onPointerMove);
    };
  }, [text, fontSize, spacing]);

  return (
    <div ref={wrapRef} style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={cvRef}
        style={{
          display: 'block',
          width: '100%',
          height: `${H}px`,
        }}
      />
    </div>
  );
}

export default function CreatorCreditsPage() {
  const [, navigate] = useLocation();
  const { triggerSlashTransition } = useTransition();
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  const rippleCount = useRef(0);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const goBack = () => {
    triggerSlashTransition('/');
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

  const mobile = vw < 768;
  const titleSize = mobile
    ? Math.min(100, Math.max(50, vw * 0.18))
    : Math.min(220, Math.max(90, vw * 0.15));
  const titleSpacing = mobile ? -2 : -6;

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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;800;900&family=Space+Mono:wght@400;700&family=Caveat:wght@400;600;700&display=swap');

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
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
          cursor: pointer;
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
          pointer-events: auto;
          z-index: 1;
          width: 100%;
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

        /* Cinematic Glitch Effect */
        .cinematic-glitch {
          position: relative;
          color: #ffffff;
          display: inline-block;
        }
        
        .cinematic-glitch::before,
        .cinematic-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000000;
          clip-path: inset(100% 0 0 0); /* Hidden by default */
        }
        
        .cinematic-glitch::before {
          text-shadow: -1.5px 0 #ff0055;
          animation: glitch-anim-1 6s infinite linear;
        }
        
        .cinematic-glitch::after {
          text-shadow: 1.5px 0 #00f0ff;
          animation: glitch-anim-2 6s infinite linear;
        }

        @keyframes glitch-anim-1 {
          0%, 80%, 100% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
          81% {
            clip-path: inset(12% 0 76% 0);
            transform: translate(-3px, -1px);
          }
          82% {
            clip-path: inset(65% 0 12% 0);
            transform: translate(2px, 2px);
          }
          83% {
            clip-path: inset(30% 0 40% 0);
            transform: translate(-1px, 1px);
          }
          84% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
          92% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
          93% {
            clip-path: inset(45% 0 35% 0);
            transform: translate(2px, -2px);
          }
          94% {
            clip-path: inset(10% 0 80% 0);
            transform: translate(-2px, 2px);
          }
          95% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
        }

        @keyframes glitch-anim-2 {
          0%, 80%, 100% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
          81% {
            clip-path: inset(55% 0 15% 0);
            transform: translate(3px, 2px);
          }
          82% {
            clip-path: inset(20% 0 68% 0);
            transform: translate(-3px, -2px);
          }
          83% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
          93% {
            clip-path: inset(5% 0 85% 0);
            transform: translate(-2px, 1px);
          }
          94% {
            clip-path: inset(75% 0 5% 0);
            transform: translate(3px, -2px);
          }
          95% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
        }

        /* ── RESPONSIVENESS MEDIA QUERIES ── */
        @media (max-width: 768px) {
          .corner-label {
            display: none !important;
          }

          .header-container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            height: auto;
            padding: 16px 20px;
            gap: 12px;
            background: rgba(0, 0, 0, 0.85);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .nav-spacer {
            display: none !important;
          }

          .close-btn {
            align-self: flex-start;
            padding: 8px 18px;
            font-size: 14px;
            letter-spacing: 1px;
            box-shadow: 2px 2px 0 #1a1a1a;
          }

          .nav-tech-list {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            width: 100%;
            gap: 16px;
            padding: 6px 12px 10px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            mask-image: linear-gradient(to right, transparent, white 24px, white calc(100% - 24px), transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, white 24px, white calc(100% - 24px), transparent);
          }

          .nav-tech-list::-webkit-scrollbar {
            display: none;
          }

          .nav-tech-list span.separator {
            color: rgba(255, 255, 255, 0.1);
          }

          .bottom-badge {
            bottom: 24px;
            padding: 10px 20px;
          }

          .bottom-badge-text {
            font-size: 9px;
            letter-spacing: 1.5px;
          }

          .bg-subtitle {
            font-size: clamp(10px, 2.5vw, 14px);
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
            transform: 'translate(-50%, -50%)',
          }}
        >
          <RippleTitle text="MONISH" fontSize={titleSize} spacing={titleSpacing} />
        </div>

      </div>

      {/* Ripples */}
      {ripples.map(r => (
        <div key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
