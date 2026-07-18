import { useEffect, useRef } from 'react';

export function ChromaticRipple() {
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
        maxRadius: 500,
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

      // Draw ripples with chromatic aberration effect
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 6;

        const progress = ripple.radius / ripple.maxRadius;
        const opacity = Math.max(0, 1 - progress);

        if (opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw wavy ripple with chromatic aberration (RGB separation)
        const colors = [
          { name: 'red', offset: -3 },
          { name: 'blue', offset: 0 },
          { name: 'yellow', offset: 3 },
        ];

        colors.forEach((color) => {
          const colorMap: { [key: string]: string } = {
            red: `rgba(255, 0, 100, ${opacity * 0.5})`,
            blue: `rgba(0, 150, 255, ${opacity * 0.5})`,
            yellow: `rgba(255, 200, 0, ${opacity * 0.5})`,
          };

          ctx.strokeStyle = colorMap[color.name];
          ctx.lineWidth = 3;
          ctx.beginPath();

          const waveCount = 120;
          const waveFrequency = 10;
          const waveAmplitude = 50 * opacity;

          for (let j = 0; j <= waveCount; j++) {
            const angle = (j / waveCount) * Math.PI * 2;

            // Create distortion wave
            const distortion =
              Math.sin(angle * waveFrequency + time * 5) * waveAmplitude +
              Math.cos(angle * 5 + time * 3) * (waveAmplitude * 0.6);

            const finalRadius = ripple.radius + distortion + color.offset * 5;
            const x = ripple.x + Math.cos(angle) * finalRadius;
            const y = ripple.y + Math.sin(angle) * finalRadius;

            if (j === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        });

        // Draw inner distorted layers with chromatic effect
        for (let layer = 1; layer <= 2; layer++) {
          const layerRadius = ripple.radius - layer * 80;
          if (layerRadius < 0) continue;

          colors.forEach((color) => {
            const colorMap: { [key: string]: string } = {
              red: `rgba(255, 0, 100, ${(opacity * 0.3) / layer})`,
              blue: `rgba(0, 150, 255, ${(opacity * 0.3) / layer})`,
              yellow: `rgba(255, 200, 0, ${(opacity * 0.3) / layer})`,
            };

            ctx.strokeStyle = colorMap[color.name];
            ctx.lineWidth = 2;
            ctx.beginPath();

            const waveFrequency = 10;
            for (let j = 0; j <= 80; j++) {
              const angle = (j / 80) * Math.PI * 2;
              const waveAmplitude = 35 * opacity * (1 - layer * 0.2);
              const distortion =
                Math.sin(angle * waveFrequency + time * 4) * waveAmplitude;

              const finalRadius = layerRadius + distortion + color.offset * 3;
              const x = ripple.x + Math.cos(angle) * finalRadius;
              const y = ripple.y + Math.sin(angle) * finalRadius;

              if (j === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
          });
        }
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
