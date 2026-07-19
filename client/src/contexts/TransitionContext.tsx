import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface TransitionContextType {
  slashState: 'idle' | 'slashing-in' | 'closed' | 'slashing-out';
  triggerSlashTransition: (targetPath: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

function NinjaSlashOverlay({ state }: { state: 'slashing-in' | 'closed' | 'slashing-out' }) {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (state === 'slashing-in') {
      setAnimationClass('in');
    } else if (state === 'slashing-out') {
      setAnimationClass('out');
    }
  }, [state]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        pointerEvents: 'all',
        overflow: 'hidden',
      }}
    >
      {/* Styles for premium 60fps hardware-accelerated animations */}
      <style>{`
        @keyframes slash-top-in {
          0% { transform: translate3d(-105%, -105%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes slash-bottom-in {
          0% { transform: translate3d(105%, 105%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes slash-top-out {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-105%, -105%, 0); }
        }
        @keyframes slash-bottom-out {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(105%, 105%, 0); }
        }
        @keyframes blade-strike {
          0% { transform: translate3d(0, -50%, 0) rotate(16.7deg) scaleX(0); opacity: 0; transform-origin: left; }
          15% { transform: translate3d(0, -50%, 0) rotate(16.7deg) scaleX(1); opacity: 1; transform-origin: left; }
          35% { transform: translate3d(0, -50%, 0) rotate(16.7deg) scaleX(1); opacity: 1; transform-origin: right; }
          100% { transform: translate3d(0, -50%, 0) rotate(16.7deg) scaleX(0); opacity: 0; transform-origin: right; }
        }
        @keyframes katana-sweep {
          0% { transform: translate3d(-450px, 150px, 0) rotate(16.7deg) scale(1.5); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate3d(calc(100vw + 100px), -150px, 0) rotate(16.7deg) scale(1.5); opacity: 0; }
        }
        
        .panel-top-in {
          animation: slash-top-in 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
        .panel-bottom-in {
          animation: slash-bottom-in 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
        .panel-top-out {
          animation: slash-top-out 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
        .panel-bottom-out {
          animation: slash-bottom-out 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
        .blade-line-active {
          animation: blade-strike 1.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .katana-active {
          animation: katana-sweep 1.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Top Left Panel Half (1.5% overlap down to prevent subpixel hairline gap bugs) */}
      <div
        className={animationClass === 'in' ? 'panel-top-in' : animationClass === 'out' ? 'panel-top-out' : ''}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#111111', // Matte black
          clipPath: 'polygon(0 0, 100% 0, 100% 66.5%, 0 36.5%)',
          transform: state === 'closed' || state === 'slashing-out' ? 'translate3d(0, 0, 0)' : 'translate3d(-105%, -105%, 0)',
        }}
      />

      {/* Bottom Right Panel Half (1.5% overlap up to prevent subpixel hairline gap bugs) */}
      <div
        className={animationClass === 'in' ? 'panel-bottom-in' : animationClass === 'out' ? 'panel-bottom-out' : ''}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#111111', // Matte black
          clipPath: 'polygon(0 33.5%, 100% 63.5%, 100% 100%, 0 100%)',
          transform: state === 'closed' || state === 'slashing-out' ? 'translate3d(0, 0, 0)' : 'translate3d(105%, 105%, 0)',
        }}
      />

      {/* Blade trail cut flash & flying katana */}
      {state === 'slashing-in' && (
        <>
          {/* Razor-thin, elegant glowing slash line */}
          <div
            className="blade-line-active"
            style={{
              position: 'absolute',
              left: '-25%',
              top: '50%',
              width: '150vw',
              height: '2px',
              background: '#ffffff',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.95), 0 0 18px rgba(255, 255, 255, 0.7)',
              transform: 'translate3d(0, -50%, 0) rotate(16.7deg)',
              zIndex: 10,
            }}
          />

          {/* Flying Katana Sword */}
          <div
            className="katana-active"
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              width: '420px',
              height: '100px',
              zIndex: 11,
              pointerEvents: 'none',
            }}
          >
            {/* Cartoon Styled Katana SVG matching reference image */}
            <svg 
              width="420" 
              height="100" 
              viewBox="0 0 420 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
              }}
            >
              {/* Glow behind blade - Updated to clean white glow */}
              <path 
                d="M70 30 C140 27, 240 24, 270 21 C250 30, 150 33, 70 33 Z" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="8" 
                filter="blur(5px)"
                opacity="0.9"
              />
              {/* Blade outline & body */}
              <path 
                d="M120 42 C 200 37, 300 28, 380 18 C 390 16, 400 12, 405 8 C 400 16, 380 28, 300 40 C 200 48, 120 46, 120 46 Z" 
                fill="#d1d5db" 
                stroke="#1f2937" 
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Hamon wave line on blade */}
              <path 
                d="M125 44 Q 150 40, 175 43 T 225 40 T 275 37 T 325 32 T 375 25 T 403 10" 
                stroke="#9ca3af" 
                strokeWidth="2.5" 
                fill="none"
              />
              {/* Circular golden guard (Tsuba) */}
              <ellipse cx="115" cy="45" rx="16" ry="24" fill="#fbbf24" stroke="#1f2937" strokeWidth="3.5"/>
              <ellipse cx="115" cy="45" rx="6" ry="10" fill="#d97706" />
              
              {/* Collar (Habaki) */}
              <path d="M120 37 L132 36 L130 46 L120 46 Z" fill="#f59e0b" stroke="#1f2937" strokeWidth="2" />

              {/* Wrapped Handle (Tsuka) */}
              <path 
                d="M20 54 L100 48 C 102 48, 104 46, 104 44 L101 40 C 101 38, 99 36, 97 36 L18 42 C 16 42, 14 44, 14 46 L17 50 C 17 52, 19 54, 20 54 Z" 
                fill="#4b5563" 
                stroke="#1f2937" 
                strokeWidth="3.5"
              />
              {/* Cross wraps */}
              <path d="M28 42 L34 53 M38 41 L44 52 M48 40 L54 51 M58 39 L64 50 M68 38 L74 49 M78 37 L84 48 M88 36 L94 47 M98 35 L104 46" stroke="#1f2937" strokeWidth="3"/>
              <path d="M34 42 L28 53 M44 41 L38 52 M54 40 L48 51 M64 39 L58 50 M74 38 L68 49 M84 37 L78 48 M94 36 L88 47 M104 35 L98 46" stroke="#1f2937" strokeWidth="3"/>
              
              {/* Pommel Cap (Kashira) */}
              <path 
                d="M14 41 C 12 41, 10 43, 10 45 L13 49 C 13 51, 15 53, 17 53 L18 48 Z" 
                fill="#fbbf24" 
                stroke="#1f2937" 
                strokeWidth="3"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [slashState, setSlashState] = useState<'idle' | 'slashing-in' | 'closed' | 'slashing-out'>('idle');
  const [, navigate] = useLocation();

  const triggerSlashTransition = (targetPath: string) => {
    if (slashState !== 'idle') return;

    // 1. Kick off slash close
    setSlashState('slashing-in');

    // 2. Once screens hit center and meet (1800ms), perform wouter navigation
    setTimeout(() => {
      navigate(targetPath);
      setSlashState('slashing-out');

      // 3. Allow slide out to finish (1800ms) and reset back to idle
      setTimeout(() => {
        setSlashState('idle');
      }, 1800);
    }, 1800);
  };

  return (
    <TransitionContext.Provider value={{ slashState, triggerSlashTransition }}>
      {children}
      {slashState !== 'idle' && <NinjaSlashOverlay state={slashState} />}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error('useTransition must be used within a TransitionProvider');
  return context;
}
