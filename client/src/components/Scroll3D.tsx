import { useEffect, useRef, useState } from 'react';

interface Scroll3DProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Scroll3D({ children, className = '', id }: Scroll3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile viewport on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const element = ref.current;
    if (!element) return;

    let targetRatio = 1;
    let currentRatio = 1;
    let isVisible = false;
    let rafId: number;

    const updateStyles = () => {
      if (!isVisible || !element) return;

      // Butter-smooth lerp interpolation
      currentRatio += (targetRatio - currentRatio) * 0.08;

      const translateY = currentRatio * 20; 
      const scale = 1 - Math.abs(currentRatio) * 0.008;
      const opacity = 1; // Keep fully solid so previous sections never fade away or become illegible

      element.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      element.style.opacity = '1';

      if (Math.abs(targetRatio - currentRatio) > 0.001) {
        rafId = requestAnimationFrame(updateStyles);
      }
    };

    const handleScroll = () => {
      if (!element || !isVisible) return;

      const rect = element.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewHeight / 2;
      const maxDistance = viewHeight * 0.95;

      const ratio = Math.max(-1, Math.min(1, (elementCenter - viewportCenter) / maxDistance));
      targetRatio = ratio;
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateStyles);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          handleScroll();
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      {
        rootMargin: '120px 0px 120px 0px',
        threshold: 0.005,
      }
    );

    observer.observe(element);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={isMobile ? {
        opacity: 1,
        transform: 'none',
        transition: 'none',
      } : {
        willChange: 'transform, opacity',
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
      }}
    >
      {children}
    </div>
  );
}

export default Scroll3D;
