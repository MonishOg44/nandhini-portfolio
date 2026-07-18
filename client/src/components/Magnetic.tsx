import { useEffect, useRef, useState } from 'react';

interface MagneticProps {
  children: React.ReactNode;
}

export function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      
      // Move element 35% towards the mouse position locally
      setPosition({ x: dx * 0.35, y: dy * 0.35 });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        // Fast tracking when active, springy snap-back when mouse departs
        transition: position.x === 0 && position.y === 0 
          ? 'transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          : 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
        display: 'inline-block',
      }}
    >
      {children}
    </div>
  );
}
export default Magnetic;
