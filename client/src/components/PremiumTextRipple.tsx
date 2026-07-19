import { useEffect, useRef, useState } from 'react';

interface PremiumTextRippleProps {
  text: string;
  className?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  bgColor?: string;
  fontWeightStyle?: string; // e.g. "bold", "italic 600", etc.
  height?: number;
}

export function PremiumTextRipple({
  text,
  className = '',
  fontSize = 64,
  fontFamily = "'Cormorant Garamond', serif",
  textColor,
  bgColor,
  fontWeightStyle = "italic 600",
}: PremiumTextRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const mouseRef = useRef({ x: 0, y: 0, active: false, moving: false, lastMoveTime: 0 });
  const rippleStrengthRef = useRef(0);
  const timeRef = useRef(0);

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

  // Responsive metrics ref
  const metricsRef = useRef({
    fontSize: fontSize,
    pad: Math.round(fontSize * 0.45),
    H: Math.round(fontSize * 1.4)
  });

  const pad = metricsRef.current.pad;
  const H = metricsRef.current.H;

  useEffect(() => {
    if (isMobileOrTouch) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const textCanvas = document.createElement('canvas');
    textCanvasRef.current = textCanvas;
    const textCtx = textCanvas.getContext('2d'); if (!textCtx) return;

    let width = 0;

    const resolveColors = () => {
      let bg = bgColor;
      let fg = textColor;

      if (!bg && containerRef.current) {
        let parent = containerRef.current.parentElement;
        while (parent) {
          const parentBg = window.getComputedStyle(parent).backgroundColor;
          if (parentBg && parentBg !== 'rgba(0, 0, 0, 0)' && parentBg !== 'transparent') {
            bg = parentBg;
            break;
          }
          parent = parent.parentElement;
        }
      }

      if (!bg) {
        bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
      }
      if (!fg) {
        fg = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
      }

      bg = bg || '#f5f0eb';
      fg = fg || '#111111';

      return { bg, fg };
    };

    const drawStaticText = () => {
      if (width <= 0) return;
      const { bg, fg } = resolveColors();
      const currentH = metricsRef.current.H;
      const currentFontSize = metricsRef.current.fontSize;
      const currentPad = metricsRef.current.pad;

      textCtx.fillStyle = bg;
      textCtx.fillRect(0, 0, width, currentH);

      // Set letter spacing for premium typography look if supported
      try {
        (textCtx as any).letterSpacing = '0.03em';
      } catch (e) {}

      textCtx.font = `${fontWeightStyle} ${currentFontSize}px ${fontFamily}`;
      textCtx.fillStyle = fg;
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      
      // Draw centered vertically and horizontally
      const textX = width / 2;
      const textY = currentH / 2;
      textCtx.fillText(text, textX, textY);

      // Draw a highly creative, thin editorial underline that also ripples
      const textW = textCtx.measureText(text).width;
      textCtx.strokeStyle = fg;
      textCtx.lineWidth = 1.2;
      textCtx.beginPath();
      // Position the line slightly below the text baseline
      const lineY = textY + (currentFontSize * 0.44);
      const startX = textX - textW / 2;
      const endX = textX + textW / 2;
      textCtx.moveTo(startX, lineY);
      textCtx.lineTo(endX, lineY);
      textCtx.stroke();

      // Add a small elegant square block/dot at the end of the line
      textCtx.fillStyle = fg;
      textCtx.fillRect(endX + 8, lineY - 1.5, 3, 3);
    };

    // ResizeObserver to handle width reliably and dynamically resize text for mobile
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerW = Math.floor(entry.contentRect.width);
        if (containerW > 0) {
          let targetFontSize = fontSize;
          if (containerW < 375) {
            targetFontSize = Math.min(fontSize, 32);
          } else if (containerW < 480) {
            targetFontSize = Math.min(fontSize, 38);
          } else if (containerW < 768) {
            targetFontSize = Math.min(fontSize, 46);
          }

          metricsRef.current.fontSize = targetFontSize;
          metricsRef.current.pad = Math.round(targetFontSize * 0.45);
          metricsRef.current.H = Math.round(targetFontSize * 1.4);

          const currentPad = metricsRef.current.pad;
          const currentH = metricsRef.current.H;

          width = containerW + currentPad * 2;
          canvas.width = width;
          canvas.height = currentH;
          textCanvas.width = width;
          textCanvas.height = currentH;

          // Direct DOM style updates to keep layout styling in sync with the current metrics
          canvas.style.width = `calc(100% + ${currentPad * 2}px)`;
          canvas.style.height = `${currentH}px`;
          canvas.style.marginLeft = `${-currentPad}px`;
          canvas.style.marginTop = '0px';
          canvas.style.marginBottom = '0px';

          drawStaticText();
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        drawStaticText();
      });
    }

    // Pointer listeners for modern touch/mouse support
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const currentPad = metricsRef.current.pad;
      const currentH = metricsRef.current.H;
      const currentFontSize = metricsRef.current.fontSize;

      // Restrict active activation only to the exact visual boundaries of the actual text characters (centered)
      const textW = textCtx.measureText(text).width;
      const textX = width / 2;
      const startX = textX - textW / 2;
      const isOverText = mx >= startX && mx <= startX + textW && Math.abs(my - currentH / 2) < currentFontSize * 0.55;

      if (isOverText) {
        mouseRef.current.x = mx;
        mouseRef.current.y = my;
        mouseRef.current.active = true;
        mouseRef.current.moving = true;
        mouseRef.current.lastMoveTime = Date.now();
        rippleStrengthRef.current = Math.min(2.5, rippleStrengthRef.current + 0.35);
      } else {
        mouseRef.current.active = false;
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('pointerdown', handlePointerMove);

    let animationId: number;
    const animate = () => {
      timeRef.current += 0.038;

      const timeSinceLastMove = Date.now() - mouseRef.current.lastMoveTime;
      if (timeSinceLastMove > 80) {
        mouseRef.current.moving = false;
      }

      if (!mouseRef.current.active) {
        rippleStrengthRef.current *= 0.72; // Ultra fast snapback when cursor leaves the text area
      } else if (!mouseRef.current.moving) {
        rippleStrengthRef.current *= 0.88; // Normal decay when stationary over the text
      }

      if (rippleStrengthRef.current < 0.01 && !mouseRef.current.active) {
        ctx.drawImage(textCanvas, 0, 0);
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.drawImage(textCanvas, 0, 0);

      if (width > 0) {
        const currentH = metricsRef.current.H;
        const currentFontSize = metricsRef.current.fontSize;

        const fullSrcData = textCtx.getImageData(0, 0, width, currentH);
        const fullSrcPixels = fullSrcData.data;

        const R = currentFontSize * 0.8;
        const maxStrength = currentFontSize * 0.44;
        const strength = maxStrength * rippleStrengthRef.current;

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        const startX = Math.max(0, Math.floor(mx - R));
        const endX = Math.min(width, Math.ceil(mx + R));
        const startY = Math.max(0, Math.floor(my - R));
        const endY = Math.min(currentH, Math.ceil(my + R));

        const boxW = endX - startX;
        const boxH = endY - startY;

        if (boxW > 0 && boxH > 0) {
          const dstData = ctx.createImageData(boxW, boxH);
          const dstPixels = dstData.data;

          for (let y = 0; y < boxH; y++) {
            const canvasY = startY + y;
            const dy = canvasY - my;

            for (let x = 0; x < boxW; x++) {
              const canvasX = startX + x;
              const dx = canvasX - mx;

              const dist = Math.sqrt(dx * dx + dy * dy);
              const dstIdx = (y * boxW + x) * 4;

              if (dist < R) {
                const progress = dist / R;
                const ease = (1 - progress) * (1 - progress);
                const wave = Math.sin(dist * 0.08 - timeRef.current * 4.8) * ease * strength;

                const nx = dist > 0 ? dx / dist : 0;
                const ny = dist > 0 ? dy / dist : 0;

                // High-contrast chromatic aberration color separation matching the video
                const rx = Math.max(0, Math.min(width - 1, Math.round(canvasX + nx * wave)));
                const ry = Math.max(0, Math.min(currentH - 1, Math.round(canvasY + ny * wave)));

                const gx = Math.max(0, Math.min(width - 1, Math.round(canvasX + nx * wave * 0.72)));
                const gy = Math.max(0, Math.min(currentH - 1, Math.round(canvasY + ny * wave * 0.72)));

                const bx = Math.max(0, Math.min(width - 1, Math.round(canvasX + nx * wave * 0.48)));
                const by = Math.max(0, Math.min(currentH - 1, Math.round(canvasY + ny * wave * 0.48)));

                const sample = (cx: number, cy: number, chIdx: number) => {
                  const idx = (cy * width + cx) * 4;
                  return fullSrcPixels[idx + chIdx];
                };

                dstPixels[dstIdx]     = sample(rx, ry, 0); // Red
                dstPixels[dstIdx + 1] = sample(gx, gy, 1); // Green
                dstPixels[dstIdx + 2] = sample(bx, by, 2); // Blue
                dstPixels[dstIdx + 3] = 255;               // Solid Alpha for sharp aberration edges
              } else {
                const fullIdx = (canvasY * width + canvasX) * 4;
                dstPixels[dstIdx]     = fullSrcPixels[fullIdx];
                dstPixels[dstIdx + 1] = fullSrcPixels[fullIdx + 1];
                dstPixels[dstIdx + 2] = fullSrcPixels[fullIdx + 2];
                dstPixels[dstIdx + 3] = fullSrcPixels[fullIdx + 3];
              }
            }
          }
          ctx.putImageData(dstData, startX, startY);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      observer.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointerdown', handlePointerMove);
      cancelAnimationFrame(animationId);
    };
  }, [text, fontSize, fontFamily, textColor, bgColor, fontWeightStyle, isMobileOrTouch]);

  if (isMobileOrTouch) {
    const resolvedFg = textColor || 'var(--foreground)';
    const fontW = fontWeightStyle.includes('600') ? 600 : fontWeightStyle.includes('bold') ? 'bold' : 'normal';
    const fontS = fontWeightStyle.includes('italic') ? 'italic' : 'normal';
    
    // Scale font size down slightly on very small screens to fit perfectly
    const finalSize = fontSize < 64 ? fontSize : 'clamp(32px, 8vw, 48px)';
    
    return (
      <div 
        className={`w-full text-center relative select-none ${className}`}
        style={{
          fontFamily,
          fontSize: finalSize,
          color: resolvedFg,
          fontWeight: fontW,
          fontStyle: fontS,
          padding: '12px 0',
          position: 'relative',
        }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {text}
          <span 
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              width: '100%',
              height: '1.2px',
              backgroundColor: resolvedFg,
            }}
          />
          <span 
            style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-11px',
              width: '3px',
              height: '3px',
              backgroundColor: resolvedFg,
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full relative select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          width: `calc(100% + ${pad * 2}px)`,
          height: `${H}px`,
          marginLeft: -pad,
          marginTop: 0,
          marginBottom: 0,
        }}
      />
    </div>
  );
}
