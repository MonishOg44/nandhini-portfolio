import { useEffect, useRef } from 'react';

interface LiquidRippleProps {
  width?: number;
  height?: number;
  className?: string;
}

export function LiquidRipple({ width = 400, height = 400, className = '' }: LiquidRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple particles with varied hues
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const speed = 1.5 + Math.random() * 3;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          hue: 100 + Math.random() * 80, // Green to cyan range
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
        p.vx *= 0.95; // Friction
        p.vy *= 0.95;

        if (p.life > 0) {
          const radius = (1 - p.life) * 50;
          const opacity = p.life * 0.7;

          // Draw outer glow
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 50%, ${opacity * 0.2})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius + 8, 0, Math.PI * 2);
          ctx.stroke();

          // Draw main circle
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 60%, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Draw inner highlight
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 80%, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 0.7, 0, Math.PI * 2);
          ctx.stroke();

          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={`block cursor-crosshair ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}
