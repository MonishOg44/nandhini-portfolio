import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

function useParticles(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const counterRef = useRef(0);

  const spawnParticle = useCallback(() => {
    const colors = ['#d4af37', '#f0e68c', '#fffacd', '#b8860b', '#ffd700', '#ffffff'];
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.8;
    particlesRef.current.push({
      id: counterRef.current++,
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1 + Math.random() * 2.5,
      opacity: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: 120 + Math.random() * 180,
    });
  }, []);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Pre-spawn
    for (let i = 0; i < 60; i++) spawnParticle();

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new
      if (Math.random() < 0.4) spawnParticle();

      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);

      particlesRef.current.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.004; // drift up

        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.15
          ? (progress / 0.15)
          : progress > 0.75
            ? 1 - ((progress - 0.75) / 0.25)
            : 1;

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.65;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, spawnParticle]);

  return canvasRef;
}

interface CreatorCreditsProps {
  open: boolean;
  onClose: () => void;
}

const roles = [
  'Full-Stack Developer',
  'UI / UX Architect',
  'Motion Designer',
  'Creative Technologist',
];

export function CreatorCredits({ open, onClose }: CreatorCreditsProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0); // animation phase 0-4
  const [roleIdx, setRoleIdx] = useState(0);
  const canvasRef = useParticles(mounted && visible);
  const phaseTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear timers helper
  const clearTimers = () => {
    phaseTimers.current.forEach(clearTimeout);
    phaseTimers.current = [];
  };

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      setPhase(0);
      clearTimers();
      const t1 = setTimeout(() => setPhase(1), 400);
      const t2 = setTimeout(() => setPhase(2), 900);
      const t3 = setTimeout(() => setPhase(3), 1500);
      const t4 = setTimeout(() => setPhase(4), 2200);
      phaseTimers.current = [t1, t2, t3, t4];
    } else {
      setVisible(false);
      clearTimers();
      const t = setTimeout(() => {
        setMounted(false);
        setPhase(0);
      }, 700);
      phaseTimers.current = [t];
    }

    return clearTimers;
  }, [open]);

  // Cycle roles
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setRoleIdx(i => (i + 1) % roles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [visible]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: visible
      ? 'rgba(0,0,0,0.97)'
      : 'rgba(0,0,0,0)',
    transition: 'background 0.7s cubic-bezier(0.25,1,0.5,1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '0px',
    opacity: phase >= 1 ? 1 : 0,
    transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
    transition: 'opacity 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)',
    padding: '20px',
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true" aria-label="Creator Credits">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      />

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
      }} />

      {/* Radial glow behind card */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.12) 0%, transparent 70%)',
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }} />

      {/* Main card */}
      <div style={cardStyle} onClick={e => e.stopPropagation()}>

        {/* Top eyebrow label */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#d4af37',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <span style={{ display: 'block', width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #d4af37)' }} />
          BUILT WITH PASSION
          <span style={{ display: 'block', width: '40px', height: '1px', background: 'linear-gradient(to left, transparent, #d4af37)' }} />
        </div>

        {/* Award trophy SVG */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(20px)',
          transition: 'opacity 0.8s 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.8s 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          marginBottom: '36px',
          filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.6))',
        }}>
          <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="trophy-grad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fffacd" />
                <stop offset="40%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#b8860b" />
              </linearGradient>
            </defs>
            {/* Cup body */}
            <path d="M32 18 Q30 50 50 62 Q70 50 68 18 Z" fill="url(#trophy-grad)" />
            {/* Handles */}
            <path d="M32 22 Q18 22 18 38 Q18 52 32 48" stroke="url(#trophy-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M68 22 Q82 22 82 38 Q82 52 68 48" stroke="url(#trophy-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            {/* Stem */}
            <rect x="44" y="62" width="12" height="14" rx="2" fill="url(#trophy-grad)"/>
            {/* Base */}
            <rect x="34" y="76" width="32" height="6" rx="3" fill="url(#trophy-grad)"/>
            {/* Star */}
            <path d="M50 30 L52 36 L58 36 L53 40 L55 46 L50 42 L45 46 L47 40 L42 36 L48 36 Z" fill="#fffacd" opacity="0.9"/>
          </svg>
        </div>

        {/* "Crafted by" label */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          marginBottom: '10px',
        }}>
          Crafted &amp; Designed by
        </div>

        {/* BIG NAME — MONISH */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(52px, 10vw, 110px)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #fffacd 0%, #d4af37 40%, #b8860b 70%, #fffacd 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: phase >= 3 ? 'gold-shimmer 3s ease infinite' : 'none',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0) skewX(0deg)' : 'translateY(30px) skewX(-4deg)',
          transition: 'opacity 0.9s 0.1s cubic-bezier(0.25,1,0.5,1), transform 0.9s 0.1s cubic-bezier(0.25,1,0.5,1)',
          marginBottom: '8px',
          userSelect: 'none',
        }}>
          MONISH
        </div>

        {/* Cycling role tag */}
        <div style={{
          position: 'relative',
          height: '22px',
          overflow: 'hidden',
          marginBottom: '40px',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}>
          {roles.map((role, i) => (
            <div key={role} style={{
              position: 'absolute',
              inset: 0,
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: i === roleIdx ? 1 : 0,
              transform: i === roleIdx ? 'translateY(0)' : i < roleIdx ? 'translateY(-100%)' : 'translateY(100%)',
              transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.25,1,0.5,1)',
            }}>
              {role}
            </div>
          ))}
        </div>

        {/* Divider + stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
          marginBottom: '44px',
        }}>
          {[
            { value: '100%', label: 'Passion' },
            { value: '∞', label: 'Creativity' },
            { value: '1×', label: 'Original' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {i > 0 && (
                <div style={{ position: 'absolute', width: '1px', height: '32px', background: 'rgba(212,175,55,0.3)', transform: 'translateX(-20px)' }} />
              )}
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '22px',
                background: 'linear-gradient(135deg, #fffacd, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{stat.value}</span>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'italic',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.3)',
          maxWidth: '340px',
          lineHeight: 1.6,
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.7s 0.3s ease',
          marginBottom: '40px',
        }}>
          "Every pixel placed with intention, every interaction crafted with care."
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '2px',
            padding: '10px 28px',
            cursor: 'pointer',
            opacity: phase >= 4 ? 1 : 0,
            transition: 'opacity 0.5s 0.4s ease, color 0.25s ease, border-color 0.25s ease, background 0.25s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = '#d4af37';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.5)';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          Close
        </button>
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes gold-shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default CreatorCredits;
