import { useEffect, useRef } from 'react';

export function RippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Ripple parameters
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    const ripples: Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
    }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 400,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    let time = 0;

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      // Draw ripples with distortion effect
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 5;

        const progress = ripple.radius / ripple.maxRadius;
        const opacity = Math.max(0, 1 - progress);

        if (opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw wavy ripple with distortion
        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.6})`;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const waveCount = 100;
        for (let j = 0; j <= waveCount; j++) {
          const angle = (j / waveCount) * Math.PI * 2;
          
          // Create wave distortion
          const waveAmplitude = 40 * opacity;
          const waveFrequency = 8;
          const distortion = Math.sin(angle * waveFrequency + time * 4) * waveAmplitude;
          
          const finalRadius = ripple.radius + distortion;
          const x = ripple.x + Math.cos(angle) * finalRadius;
          const y = ripple.y + Math.sin(angle) * finalRadius;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw inner ripple layers
        for (let layer = 1; layer <= 3; layer++) {
          const layerRadius = ripple.radius - layer * 60;
          if (layerRadius < 0) continue;

          ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.3 / layer})`;
          ctx.lineWidth = 2;
          ctx.beginPath();

          const waveFrequency = 8;
          for (let j = 0; j <= waveCount; j++) {
            const angle = (j / waveCount) * Math.PI * 2;
            const waveAmplitude = 30 * opacity * (1 - layer * 0.2);
            const distortion = Math.sin(angle * waveFrequency + time * 3) * waveAmplitude;
            
            const finalRadius = layerRadius + distortion;
            const x = ripple.x + Math.cos(angle) * finalRadius;
            const y = ripple.y + Math.sin(angle) * finalRadius;

            if (j === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }

      // Draw background flowing waves
      const flowWaveCount = 6;
      for (let w = 0; w < flowWaveCount; w++) {
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.08 - w * 0.01})`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const centerRadius = 150 + w * 120;
        const waveAmplitude = 60 - w * 8;

        for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
          const waveOffset =
            Math.sin(angle * 3 + time * 1.5 + w * 0.5) * waveAmplitude +
            Math.cos(angle * 2 + time * 0.8) * (waveAmplitude * 0.6);

          const radius = centerRadius + waveOffset;
          const x = mouseX + Math.cos(angle) * radius;
          const y = mouseY + Math.sin(angle) * radius;

          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        pointerEvents: 'none',
      }}
    />
  );
}
