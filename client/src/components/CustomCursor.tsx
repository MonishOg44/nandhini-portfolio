import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isMobileOrTouch, setIsMobileOrTouch] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobileOrTouch(isMobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (isMobileOrTouch) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setHidden(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mx = e.touches[0].clientX;
        my = e.touches[0].clientY;
        setHidden(false);
      }
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseLeave);
    document.addEventListener('mouseleave', onMouseLeave);

    // Dynamic frame loop using lerp translation
    let rafId: number;
    const update = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      // Smooth lerp tracking for the outer ring
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    // Mouseover triggers for expanding cursor ring
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('canvas') ||
        target.getAttribute('role') === 'button';
      
      setHovered(!!isClickable);
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchend', onMouseLeave);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isMobileOrTouch || hidden) return null;

  return (
    <>
      {/* Hide native cursor on devices with mouse */}
      <style>{`
        @media (pointer: fine) {
          body, a, button, [role="button"], input, select, textarea, canvas {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Inner Dot Wrapper (Zero transition conflicts) */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2147483647,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#e63b2e',
            marginLeft: -3,
            marginTop: -3,
          }}
        />
      </div>

      {/* Trailing Outer Ring Wrapper (Split hierarchy to prevent translation vs. scaling glitching) */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2147483646,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '1.25px solid #e63b2e',
            marginLeft: -15,
            marginTop: -15,
            backgroundColor: hovered ? 'rgba(230, 59, 46, 0.12)' : 'transparent',
            transform: hovered ? 'scale(1.5)' : 'scale(1)',
            transition: 'background-color 0.22s ease-out, transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
      </div>
    </>
  );
}
export default CustomCursor;
