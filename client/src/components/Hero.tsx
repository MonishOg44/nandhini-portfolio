import { useEffect, useRef, useState } from 'react';
import pressedGinkgo from '../assets/pressed-ginkgo.png';
import ledgerScrap from '../assets/ledger-scrap.png';
import pressedFern from '../assets/pressed-fern.png';
import nandhiniReal from '../assets/nandhini-real.jpg';

const BG = '#fbf8f5';

/* ─────────────────────────────────────────────────
   Canvas ripple — liquid displacement on hover.
   Uses PointerEvents for mobile, trackpad, and mouse.
   Matches the high-contrast chromatic aberration from the video.
───────────────────────────────────────────────── */
function RippleName({
  text,
  fontSize,
  centered = false,
}: {
  text: string;
  fontSize: number;
  centered?: boolean;
}) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const cvRef    = useRef<HTMLCanvasElement>(null);
  const offRef   = useRef<HTMLCanvasElement | null>(null);
  const mouse    = useRef({ x: 0, y: 0, active: false, moving: false, t: 0 });
  const str      = useRef(0);
  const tick     = useRef(0);

  const pad = Math.round(fontSize * 0.45); // Horizontal padding to prevent boundary clipping on left/right
  const H = Math.round(fontSize * 2.2);   // Large vertical padding to prevent boundary clipping on top/bottom

  useEffect(() => {
    const cv  = cvRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const off = document.createElement('canvas');
    offRef.current = off;
    const otx = off.getContext('2d'); if (!otx) return;

    let W = 0;

    const drawFlowerSticker = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
      ctx.save();
      ctx.fillStyle = '#e63b2e';
      const rx = r * 0.1875;
      const ry = r * 0.4583;
      
      [0, 30, 60, 90, 120, 150].forEach(deg => {
        ctx.beginPath();
        const rad = (deg * Math.PI) / 180;
        ctx.ellipse(cx, cy, rx, ry, rad, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.2083, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    };

    const paint = () => {
      if (W <= 0) return;
      otx.fillStyle = BG;
      otx.fillRect(0, 0, W, H);
      otx.font = `900 ${fontSize}px 'Inter', sans-serif`;
      otx.fillStyle = '#111111';
      otx.textBaseline = 'middle';

      const dotlessText = text.replace(/i/g, 'ı').replace(/I/g, 'I');

      if (centered) {
        otx.textAlign = 'center';
        otx.fillText(dotlessText, W / 2, H / 2);
      } else {
        otx.textAlign = 'left';
        otx.fillText(dotlessText, pad, H / 2);
      }

      // Draw red flower stickers for every 'i'
      const chars = text.split('');
      const textW = otx.measureText(dotlessText).width;
      const startX = centered ? (W - textW) / 2 : pad;

      chars.forEach((char, index) => {
        if (char.toLowerCase() === 'i') {
          const precedingText = dotlessText.slice(0, index);
          const precedingW = otx.measureText(precedingText).width;
          const charW = otx.measureText('ı').width;
          const cx = startX + precedingW + charW / 2;
          const cy = H / 2 - fontSize * 0.38;
          const flowerRadius = fontSize * 0.14;
          drawFlowerSticker(otx, cx, cy, flowerRadius);
        }
      });
    };

    // ResizeObserver to handle mount & layout changes
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        if (width > 0 && width !== W) {
          W = width + pad * 2;
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

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        mouse.current.active = false;
        return;
      }
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;

      // Restrict active activation only to the exact visual boundaries of the actual text characters
      const textW = otx.measureText(text).width;
      let isOverText = false;
      if (centered) {
        const sx = (W - textW) / 2;
        isOverText = mx >= sx && mx <= sx + textW && Math.abs(my - H / 2) < fontSize * 0.35;
      } else {
        isOverText = mx >= pad && mx <= pad + textW && Math.abs(my - H / 2) < fontSize * 0.35;
      }

      if (isOverText) {
        mouse.current = {
          x: mx,
          y: my,
          active: true,
          moving: true,
          t: Date.now()
        };
        // Keep strength high for responsive waves
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
      tick.current += 0.042; // Fast, energetic wave speed
      if (Date.now() - mouse.current.t > 80) {
        mouse.current.moving = false;
      }
      if (!mouse.current.active) {
        str.current *= 0.72; // Ultra fast snapback when cursor leaves the text area
      } else if (!mouse.current.moving) {
        str.current *= 0.88; // Normal decay when stationary over the text
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
                // High-frequency liquid wave formula
                const wave = Math.sin(d * 0.08 - tick.current * 4.8) * ease * amp;
                const nx = d > 0 ? dx / d : 0, ny = d > 0 ? dy / d : 0;

                // Color separation channels matching the reference video (Red, Green, Blue)
                const rx = Math.max(0, Math.min(W - 1, Math.round(cx + nx * wave)));
                const ry = Math.max(0, Math.min(H - 1, Math.round(cy + ny * wave)));

                const gx = Math.max(0, Math.min(W - 1, Math.round(cx + nx * wave * 0.72)));
                const gy = Math.max(0, Math.min(H - 1, Math.round(cy + ny * wave * 0.72)));

                const bx = Math.max(0, Math.min(W - 1, Math.round(cx + nx * wave * 0.48)));
                const by = Math.max(0, Math.min(H - 1, Math.round(cy + ny * wave * 0.48)));

                const getVal = (sx: number, sy: number, ch: number) => {
                  return sp[(sy * W + sx) * 4 + ch];
                };

                dp[i]     = getVal(rx, ry, 0); // Red
                dp[i+1]   = getVal(gx, gy, 1); // Green
                dp[i+2]   = getVal(bx, by, 2); // Blue
                dp[i+3]   = 255;               // Solid Alpha prevents fading, yielding high-contrast color fringes
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
  }, [text, fontSize, centered]);

  return (
    <div ref={wrapRef} style={{ width: '100%', position: 'relative' }}>
      <canvas
        ref={cvRef}
        style={{
          display: 'block',
          width: `calc(100% + ${pad * 2}px)`,
          height: `${H}px`,
          marginLeft: -pad,
          marginTop: -Math.round(H * 0.28), // Shift margins to balance the vertical bounding padding
          marginBottom: -Math.round(H * 0.28),
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Safety Pin SVG
───────────────────────────────────────────────── */
function SafetyPin({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 2.2} viewBox="0 0 40 88" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.22))' }}>
      <path d="M20 4 C20 4 8 4 8 18 C8 30 20 32 20 32" stroke="#555" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M20 4 C20 4 32 4 32 18 C32 30 20 32 20 32" stroke="#888" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <line x1="20" y1="32" x2="20" y2="78" stroke="#666" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="20" cy="80" rx="6" ry="5" fill="#888" stroke="#555" strokeWidth="1.5"/>
      <ellipse cx="20" cy="80" rx="3" ry="2.5" fill="#bbb"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   Red Flower / Asterisk Sticker
───────────────────────────────────────────────── */
function FlowerSticker({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.15))' }}>
      {[0,30,60,90,120,150].map(deg => (
        <ellipse
          key={deg}
          cx="24" cy="24"
          rx="4.5" ry="11"
          fill="#e63b2e"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="5" fill="#e63b2e"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   Translucent Washi / Scotch Tape
───────────────────────────────────────────────── */
function WashiTape({ rotation = -5, width = 75, height = 22 }: { rotation?: number, width?: number, height?: number }) {
  return (
    <div style={{
      width,
      height,
      background: 'rgba(238, 222, 198, 0.48)',
      backdropFilter: 'blur(1px)',
      borderLeft: '1.5px dashed rgba(0,0,0,0.06)',
      borderRight: '1.5px dashed rgba(0,0,0,0.06)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transform: `rotate(${rotation}deg)`,
      opacity: 0.85,
    }} />
  );
}

/* ─────────────────────────────────────────────────
   Ticket Stub
───────────────────────────────────────────────── */
function TicketStub() {
  return (
    <div style={{
      background: '#f8f5f0',
      border: '1px solid #e0d8cf',
      borderRadius: 4,
      padding: '8px 12px',
      fontFamily: "'Space Mono', monospace",
      fontSize: 9,
      color: '#555',
      lineHeight: 1.6,
      transform: 'rotate(2deg)',
      boxShadow: '2px 4px 10px rgba(0,0,0,0.08)',
      width: 110,
    }}>
      <div style={{ fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>NANDHINI</div>
      <div>DOB</div>
      <div style={{ fontWeight: 700 }}>16 JUN 2005</div>
      <div>ADMIN</div>
      <div style={{ marginTop: 4, borderTop: '1px dashed #ccc', paddingTop: 4, fontSize: 8 }}>Sec 0616</div>
    </div>
  );
}



/* ─────────────────────────────────────────────────
   Left Notebook Page (Sketchbook background element)
   ───────────────────────────────────────────────── */
function LeftNotebookPage({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div style={{
      position: 'absolute',
      left: -65,
      top: '12%',
      zIndex: 2,
      transform: `translate3d(${mousePos.x * -7}px, ${mousePos.y * -7}px, 0) rotate(8deg)`,
      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 200,
        height: 330,
        background: '#ffffff',
        border: '1px solid #e0d8cf',
        boxShadow: '10px 15px 35px rgba(0,0,0,0.06)',
        position: 'relative',
        padding: '24px 20px',
      }}>
        <div style={{
          position: 'absolute',
          left: 6,
          top: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '10px 0',
        }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} style={{
              width: 14,
              height: 6,
              background: '#bbb',
              borderRadius: 3,
              border: '1px solid #999',
              transform: 'rotate(-10deg)',
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          marginTop: 10,
          opacity: 0.4,
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              height: 1,
              background: '#add8e6',
              width: '100%',
            }} />
          ))}
        </div>
        <div style={{
          position: 'absolute',
          top: 80,
          left: 42,
          fontFamily: "'Satisfy', cursive",
          fontSize: 14,
          color: '#6e5a4f',
          transform: 'rotate(-5deg)',
          opacity: 0.75,
          lineHeight: 1.4,
        }}>
          "ideas &<br />
          &nbsp;&nbsp;concepts..."
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Verner Panton Red Mushroom Desk Lamp
   ───────────────────────────────────────────────── */
function MushroomLamp({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div style={{
      position: 'absolute',
      top: -30,
      left: '3.5%',
      zIndex: 3,
      transform: `translate3d(${mousePos.x * -9}px, ${mousePos.y * -9}px, 0) rotate(-6deg)`,
      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      pointerEvents: 'none',
    }}>
      <svg width="115" height="175" viewBox="0 0 120 180" fill="none">
        <ellipse cx="60" cy="175" rx="35" ry="5" fill="rgba(0,0,0,0.05)" />
        <path d="M 45 175 C 45 160, 75 160, 75 175 Z" fill="#722b1d" />
        <rect x="57" y="70" width="6" height="100" fill="#722b1d" />
        <path d="M 15 70 C 15 20, 105 20, 105 70 Z" fill="#8e3726" />
        <path d="M 30 50 C 40 32, 70 32, 80 50" stroke="rgba(255,255,255,0.22)" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="60" cy="70" rx="45" ry="12" fill="#592015" />
        <circle cx="60" cy="20" r="5" fill="#722b1d" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Aesthetic Cold Coffee Glass (Scrapbook Item)
   ───────────────────────────────────────────────── */
function ColdCoffee({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div style={{
      position: 'absolute',
      top: '16.5%',
      left: '1.2%',
      zIndex: 4,
      transform: `translate3d(${mousePos.x * -11}px, ${mousePos.y * -11}px, 0) rotate(10deg)`,
      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      pointerEvents: 'none',
    }}>
      <svg width="60" height="95" viewBox="0 0 60 95" fill="none">
        {/* Glass shadow */}
        <ellipse cx="30" cy="90" rx="14" ry="4" fill="rgba(0,0,0,0.06)" />
        
        {/* Clear Plastic Cup Body */}
        <path d="M 16 24 L 20 85 C 20 88, 40 88, 40 85 L 44 24 Z" fill="rgba(255, 255, 255, 0.2)" stroke="#ccc" strokeWidth="1.2" />
        
        {/* Layered Iced Coffee Liquid */}
        <path d="M 20.8 62 L 20 83 C 20 83, 40 83, 40 83 L 39.2 62 Z" fill="#3c220f" />
        <path d="M 18.8 40 L 20.8 62 L 39.2 62 L 41.2 40 C 41.2 40, 30 43, 18.8 40 Z" fill="#704424" />
        <path d="M 17 26 L 18.8 40 C 30 43, 41.2 40, 41.2 40 L 43 26 C 43 26, 30 29, 17 26 Z" fill="#c69e82" />

        {/* Ice Cubes */}
        <rect x="23" y="44" width="10" height="10" rx="2" transform="rotate(15, 23, 44)" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.75" />
        <rect x="32" y="58" width="9" height="9" rx="2" transform="rotate(-10, 32, 58)" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />

        {/* Starbucks Iconic Green Straw */}
        <line x1="26" y1="4" x2="31" y2="78" stroke="#006241" strokeWidth="3" strokeLinecap="round" />

        {/* Clear Dome Lid */}
        <path d="M 16 24 C 16 8, 44 8, 44 24 Z" fill="rgba(255, 255, 255, 0.22)" stroke="#ccc" strokeWidth="1" />
        <ellipse cx="30" cy="24" rx="14" ry="2.5" fill="rgba(255,255,255,0.3)" stroke="#ccc" strokeWidth="1" />

        {/* Liquid surface inside cup */}
        <ellipse cx="30" cy="26" rx="12.5" ry="2" fill="#bc9275" />

        {/* Starbucks Circular Logo Emblem */}
        <circle cx="30" cy="52" r="9" fill="#006241" />
        <circle cx="30" cy="52" r="7.5" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2 1" />
        
        {/* Siren Crown Star */}
        <polygon points="30,46.5 30.5,47.8 31.8,47.8 30.8,48.6 31.2,49.9 30,49.1 28.8,49.9 29.2,48.6 28.2,47.8 29.5,47.8" fill="#ffffff" />
        {/* Siren simplified silhouette */}
        <path d="M 28 55 C 29 52, 31 52, 32 55" stroke="#ffffff" strokeWidth="0.8" fill="none" />
        <path d="M 27 52 L 28 50 C 29 51, 31 51, 32 50 L 33 52" stroke="#ffffff" strokeWidth="0.6" fill="none" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Coffee Stain Overlay (Aesthetic Scrapbook Detail)
   ───────────────────────────────────────────────── */
function CoffeeStain({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 200 200"
      style={{
        position: 'absolute',
        left: '7%',
        top: '24%',
        opacity: 0.16,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        zIndex: 1,
        transform: `translate3d(${mousePos.x * -9}px, ${mousePos.y * -9}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      <path
        d="M 100 20 C 135 20, 175 45, 175 90 C 175 140, 130 180, 90 180 C 45 180, 25 135, 25 95 C 25 50, 60 20, 100 20 Z"
        fill="none"
        stroke="#8b5a2b"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray="300"
        strokeDashoffset="12"
        opacity="0.8"
      />
      <path
        d="M 98 25 C 130 25, 168 48, 168 88 C 168 132, 125 172, 88 172 C 48 172, 30 130, 30 92 C 30 52, 62 25, 98 25 Z"
        fill="none"
        stroke="#8b5a2b"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="150" cy="55" r="2.5" fill="#8b5a2b" opacity="0.7" />
      <circle cx="158" cy="62" r="1.2" fill="#8b5a2b" opacity="0.6" />
      <circle cx="45" cy="140" r="3" fill="#8b5a2b" opacity="0.7" />
      <circle cx="35" cy="125" r="1.5" fill="#8b5a2b" opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   Interactive Spinning Vinyl Record Player
   ───────────────────────────────────────────────── */
function VinylPlayer({ mousePos }: { mousePos: { x: number; y: number } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div style={{
      background: '#ffffff',
      border: '1.25px solid #dcd3c9',
      borderRadius: 12,
      padding: 12,
      width: 170,
      boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
      fontFamily: "'Space Mono', monospace",
      color: '#111111',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
    }}>
      {/* Album cover / Spinning vinyl record */}
      <div style={{
        position: 'relative',
        width: 144,
        height: 144,
        margin: '0 auto',
        background: '#18181b',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        transform: `rotate(${isPlaying ? progress * 15 : 0}deg)`,
        transition: isPlaying ? 'none' : 'transform 0.5s ease-out',
      }}
      onClick={() => setIsPlaying(!isPlaying)}
      >
        {/* Grooves */}
        <div style={{
          width: '85%',
          height: '85%',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'absolute',
        }} />
        <div style={{
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'absolute',
        }} />
        <div style={{
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'absolute',
        }} />
        {/* Center label */}
        <div style={{
          width: '32%',
          height: '32%',
          borderRadius: '50%',
          background: '#e63b2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ffffff',
          }} />
        </div>
      </div>

      {/* Song metadata */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 9.5, fontWeight: 700 }}>
          {isPlaying ? '📻 Playing' : '📻 Paused'}
        </div>
        <div style={{ fontSize: 8, color: '#666', marginTop: 2 }}>
          Nandhini Lofi Vol.1
        </div>
      </div>

      {/* Play/Pause control & progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1, position: 'relative' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#e63b2e' }} />
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'none',
            border: '1.25px solid #dcd3c9',
            borderRadius: 6,
            fontSize: 8.5,
            padding: '3px 0',
            cursor: 'pointer',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#111111',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e63b2e20'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          {isPlaying ? 'Pause' : 'Play Record'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Interactive macOS AirDrop Alert Card
   ───────────────────────────────────────────────── */
function AirDropCard({ mousePos }: { mousePos: { x: number; y: number } }) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');

  if (status === 'declined') return null;

  const handleAccept = () => {
    setStatus('accepted');
    // Trigger download of resume PDF after acceptance
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = `${import.meta.env.BASE_URL}resume.pdf`;
      link.download = 'Nandhini_S_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 850);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.72)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: 14,
      padding: '12px 14px',
      width: 190,
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#111',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 0)`,
      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s',
      opacity: status === 'accepted' ? 0.8 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#007aff', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          AirDrop
        </span>
      </div>

      <div style={{ fontSize: 9.5, lineHeight: 1.35, color: '#333' }}>
        {status === 'accepted' ? (
          <span style={{ fontWeight: 600, color: '#27c93f' }}>✓ Document Shared!</span>
        ) : (
          <span><strong>Nandhini</strong> wants to share <strong>Resume.pdf</strong> with you.</span>
        )}
      </div>

      <div style={{
        height: 52,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #e63b2e 0%, #ff8a00 100%)',
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: 0.5,
      }}>
        PDF Document
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setStatus('declined')}
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: 6,
            fontSize: 9.5,
            padding: '5px 0',
            fontWeight: 500,
            cursor: 'pointer',
            color: '#555',
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          disabled={status === 'accepted'}
          style={{
            flex: 1,
            background: '#007aff',
            border: 'none',
            borderRadius: 6,
            fontSize: 9.5,
            padding: '5px 0',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          {status === 'accepted' ? 'Opened' : 'Accept'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Interactive Retro Polaroid Camera & Photo Album
   ───────────────────────────────────────────────── */
interface PolaroidPhoto {
  id: string;
  type: 'growth' | 'signature' | 'leaf' | 'ledger';
  rotation: number;
  offsetX: number;
  offsetY: number;
}

function PolaroidCamera({ mousePos }: { mousePos: { x: number; y: number } }) {
  const [photos, setPhotos] = useState<PolaroidPhoto[]>([]);
  const [flash, setFlash] = useState(false);
  const [nextTypeIdx, setNextTypeIdx] = useState(0);

  const takePhoto = () => {
    if (photos.length >= 4) {
      // Clear oldest photo to avoid too much clutter
      setPhotos(prev => prev.slice(1));
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 400);

    const types: PolaroidPhoto['type'][] = ['growth', 'signature', 'leaf', 'ledger'];
    const currentType = types[nextTypeIdx];
    setNextTypeIdx((nextTypeIdx + 1) % types.length);

    // Random rotation between -15 and 15 degrees
    const rotation = (Math.random() - 0.5) * 28;
    // Offset relative to camera position
    const offsetX = -130 - Math.random() * 60;
    const offsetY = -20 + Math.random() * 110;

    const newPhoto: PolaroidPhoto = {
      id: Date.now().toString(),
      type: currentType,
      rotation,
      offsetX,
      offsetY,
    };

    setTimeout(() => {
      setPhotos(prev => [...prev, newPhoto]);
    }, 150);
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Ejected photos on the desk */}
      {photos.map((p) => {
        let photoTitle = 'PHOTO';
        let photoCaption = 'Snapshot';
        let photoContent = null;

        if (p.type === 'growth') {
          photoTitle = 'FINANCIAL TRENDS';
          photoCaption = 'Growth Curve 📈';
          photoContent = (
            <div style={{ width: '100%', height: '100%', background: '#fafaf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100%" height="100%" viewBox="0 0 100 70" fill="none">
                <line x1="10" y1="60" x2="90" y2="60" stroke="#e0dcd3" strokeWidth="0.75" />
                <line x1="10" y1="40" x2="90" y2="40" stroke="#e0dcd3" strokeWidth="0.75" />
                <line x1="10" y1="20" x2="90" y2="20" stroke="#e0dcd3" strokeWidth="0.75" />
                <path d="M10,55 L28,45 L42,50 L58,26 L72,32 L90,10" fill="none" stroke="#e63b2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="90" cy="10" r="2.5" fill="#e63b2e" />
                <text x="12" y="15" fill="#e63b2e" fontSize="7" fontWeight="bold" fontFamily="monospace">ROI +84%</text>
              </svg>
            </div>
          );
        } else if (p.type === 'signature') {
          photoTitle = 'DESK RECORD';
          photoCaption = 'Nandhini S. ✦';
          photoContent = (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#fcfaf7',
              border: '1px solid rgba(0,0,0,0.03)',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '13px',
                fontStyle: 'italic',
                color: '#111111',
                fontWeight: 'bold',
                transform: 'rotate(-3deg)',
              }}>
                Nandhini S.
              </span>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '1.25px dashed #e63b2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
                color: '#e63b2e',
                fontSize: 5,
                fontWeight: 'bold',
                fontFamily: 'monospace',
                transform: 'rotate(12deg)',
              }}>
                VERIFIED
              </div>
            </div>
          );
        } else if (p.type === 'leaf') {
          photoTitle = 'PRESSED HERBARIUM';
          photoCaption = 'Ginkgo Leaf 🍃';
          photoContent = (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#f8f9f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="70%" height="70%" viewBox="0 0 100 80" fill="none">
                <path d="M50,75 L50,55 C45,55 35,48 28,40 C20,30 25,20 35,16 C42,13 48,18 50,22 C52,18 58,13 65,16 C75,20 80,30 72,40 C65,48 55,55 50,55" fill="#ece6de" stroke="#386a54" strokeWidth="1.75" strokeLinejoin="round" />
                <path d="M50,55 C48,45 42,32 30,22" stroke="#386a54" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
                <path d="M50,55 C52,45 58,32 70,22" stroke="#386a54" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
                <path d="M50,55 L50,25" stroke="#386a54" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
              </svg>
            </div>
          );
        } else {
          photoTitle = 'LEDGER SUMMARY';
          photoCaption = 'Double Entry ⚖️';
          photoContent = (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#fcf8f2',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6px 8px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '5.5px',
              color: '#333333',
              borderRadius: 3,
            }}>
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 2, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>LEDGER // 0726</span>
                <span style={{ color: '#386a54' }}>OK</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, margin: '3px 0', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Asset Allocation</span>
                  <span style={{ fontWeight: 'bold' }}>+250k</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Audit Provisions</span>
                  <span style={{ fontWeight: 'bold' }}>-50k</span>
                </div>
              </div>
              <div style={{ borderTop: '1px dashed rgba(0,0,0,0.12)', paddingTop: 2, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#e63b2e' }}>
                <span>TOTAL:</span>
                <span>$200,000</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              width: 106,
              height: 122,
              background: '#ffffff',
              border: '1.25px solid #dcd3c9',
              boxShadow: '0 6px 16px rgba(0,0,0,0.08), 2px 4px 6px rgba(0,0,0,0.04)',
              padding: '7px 7px 18px 7px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              borderRadius: 4,
              left: p.offsetX,
              top: p.offsetY,
              transform: `rotate(${p.rotation}deg)`,
              transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: 10,
              cursor: 'default',
              userSelect: 'none',
            }}
            className="group"
          >
            {/* Close Button on Hover */}
            <button
              onClick={() => removePhoto(p.id)}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: '#e63b2e',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8,
                cursor: 'pointer',
                opacity: 0,
                transition: 'opacity 0.2s',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                zIndex: 20,
              }}
              className="group-hover:opacity-100"
            >
              ✕
            </button>

            {/* Photo Title */}
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '5px',
              letterSpacing: '0.08em',
              color: 'rgba(17, 17, 17, 0.4)',
              textTransform: 'uppercase',
              textAlign: 'center',
              borderBottom: '0.75px solid rgba(0,0,0,0.05)',
              paddingBottom: 2,
            }}>
              {photoTitle}
            </div>

            {/* Image Box with Developing Animation */}
            <div style={{
              flex: 1,
              background: '#222',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              animation: 'develop-anim 3.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            }}>
              {photoContent}
            </div>

            {/* Photo Caption */}
            <div style={{
              position: 'absolute',
              bottom: 4,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '8px',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#444444',
            }}>
              {photoCaption}
            </div>
          </div>
        );
      })}

      {/* Camera Body */}
      <div style={{
        background: '#fbf8f5',
        border: '1.25px solid #dcd3c9',
        borderRadius: 12,
        padding: '10px 8px 8px 8px',
        width: 66,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
        position: 'relative',
        zIndex: 11,
      }}>
        {/* Shutter Button & Flash Light Top Panel */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 2px', alignItems: 'center' }}>
          {/* Viewfinder window */}
          <div style={{
            width: 10,
            height: 7,
            background: '#18181b',
            border: '0.75px solid #dcd3c9',
            borderRadius: 1.5,
          }} />
          
          {/* Shutter Button */}
          <button
            onClick={takePhoto}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#e63b2e',
              border: '1.25px solid #c92f23',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(230,59,46,0.25), inset 0 1px 1px rgba(255,255,255,0.25)',
              padding: 0,
              transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            title="Snap Polaroid Photo"
          />
        </div>

        {/* Camera Lens */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#22201f',
          border: '2px solid #eccb58', // Gold ring accent
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15), inset 0 2px 5px rgba(0,0,0,0.3)',
          position: 'relative',
        }}>
          {/* Lens Glass reflection */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#151413',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #2563eb 0%, #1e3a8a 100%)',
              opacity: 0.8,
            }} />
            {/* Reflection Glare */}
            <div style={{
              position: 'absolute',
              top: 4,
              left: 4,
              width: 6,
              height: 3,
              background: '#ffffff',
              borderRadius: '50%',
              transform: 'rotate(-45deg)',
              opacity: 0.5,
            }} />
          </div>
        </div>

        {/* Iconic Polaroid Rainbow Band (CSS gradient) */}
        <div style={{
          width: '100%',
          height: 4,
          background: 'linear-gradient(to right, #ef4444 20%, #f97316 20% 40%, #eab308 40% 60%, #22c55e 60% 80%, #3b82f6 80%)',
          borderRadius: 1,
        }} />

        {/* Ejection slot */}
        <div style={{
          width: '80%',
          height: 3,
          background: '#111',
          borderRadius: 0.5,
          border: '0.5px solid rgba(255,255,255,0.08)',
        }} />
      </div>

      {/* Shutter Flash Screen Overlay */}
      {flash && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          zIndex: 99999,
          pointerEvents: 'none',
          animation: 'flash-anim 0.35s ease-out forwards',
        }} />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes flash-anim {
          0% { opacity: 0; }
          15% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes develop-anim {
          0% {
            filter: grayscale(1) contrast(0.5) brightness(0.2) blur(3px);
            opacity: 0.4;
          }
          30% {
            filter: grayscale(0.8) contrast(0.7) brightness(0.5) blur(1.5px);
            opacity: 0.7;
          }
          100% {
            filter: grayscale(0) contrast(1) brightness(1) blur(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN HERO — Shubhika Batra scrapbook style
   ───────────────────────────────────────────────── */
export function Hero() {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = () => setVw(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    // Disable parallax on mobile screens for smoothness and user comfort
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1] relative to viewport center
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const mobile   = vw < 768;
  const nameSize = mobile
    ? Math.min(84, Math.max(68, vw * 0.16))
    : Math.min(120, Math.max(52, vw * 0.09));

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      background: BG,
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>



      {/* ── Desktop Collage Details: Left Notebook, Mushroom Lamp, Cold Coffee ── */}
      {!mobile && (
        <>
          <LeftNotebookPage mousePos={mousePos} />
          <MushroomLamp mousePos={mousePos} />
          <ColdCoffee mousePos={mousePos} />
        </>
      )}

      {/* ── Floating Interactive Audio Record Player ── */}
      {!mobile && (
        <div style={{ position: 'absolute', top: 75, right: '6%', zIndex: 12 }}>
          <VinylPlayer mousePos={mousePos} />
        </div>
      )}

      {/* ── Floating Interactive Retro Polaroid Camera ── */}
      {!mobile && (
        <div style={{ position: 'absolute', top: '35%', right: '2%', zIndex: 12 }}>
          <PolaroidCamera mousePos={mousePos} />
        </div>
      )}

      {/* ── Floating macOS AirDrop Share Card ── */}
      {!mobile && (
        <div style={{ position: 'absolute', bottom: 110, right: '8%', zIndex: 12 }}>
          <AirDropCard mousePos={mousePos} />
        </div>
      )}

      {/* ── Pressed Ginkgo Leaf — top centre (replaced crumpled paper) ── */}
      {!mobile && (
        <div style={{
          position: 'absolute',
          top: -30,
          left: '50%',
          transform: `translateX(-40%) rotate(-12deg) translate3d(${mousePos.x * -24}px, ${mousePos.y * -24}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {/* Washi tape pinning the leaf stem */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 40,
            zIndex: 10,
          }}>
            <WashiTape rotation={-15} width={45} height={14} />
          </div>
          <img
            src={pressedGinkgo}
            alt=""
            aria-hidden
            style={{
              width: 210,
              mixBlendMode: 'multiply',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* ── Vintage Ledger Page — top right (replaced handwritten note) ── */}
      {!mobile && (
        <div style={{
          position: 'absolute',
          top: 40,
          right: 60,
          transform: `translate3d(${mousePos.x * 14}px, ${mousePos.y * 14}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
          zIndex: 3,
        }}>
          {/* Washi tape pinning the ledger page */}
          <div style={{
            position: 'absolute',
            top: -10,
            left: 35,
            zIndex: 10,
          }}>
            <WashiTape rotation={10} width={65} height={18} />
          </div>
          <img
            src={ledgerScrap}
            alt=""
            aria-hidden
            style={{
              width: 165,
              transform: 'rotate(6deg)',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* ── Pressed Green Fern — bottom left (replaced crumpled paper) ── */}
      <div style={{
        position: 'absolute',
        bottom: mobile ? 20 : 40,
        left: mobile ? -20 : -10,
        transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {/* Washi tape securing the fern leaf */}
        <div style={{
          position: 'absolute',
          top: mobile ? 12 : 30,
          left: mobile ? 20 : 50,
          zIndex: 10,
        }}>
          <WashiTape rotation={45} width={mobile ? 30 : 45} height={mobile ? 10 : 14} />
        </div>
        <img
          src={pressedFern}
          alt=""
          aria-hidden
          style={{
            width: mobile ? 70 : 160,
            transform: 'rotate(25deg) scaleX(-1)',
            mixBlendMode: 'multiply',
            display: 'block',
          }}
        />
      </div>

      {/* ── Main layout ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1.2fr 1fr',
        minHeight: '100vh',
        alignItems: 'center',
        padding: mobile ? '120px 24px 48px' : `0 ${Math.max(48, vw * 0.08)}px`,
        gap: mobile ? 40 : 0,
      }}>

        {/* ══ LEFT: Name + subtitle ══ */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 8,
          alignItems: mobile ? 'center' : 'stretch',
          textAlign: mobile ? 'center' : 'left',
          width: '100%',
        }}>
          {/* Name with ripple */}
          <div style={{ marginLeft: mobile ? 0 : -4, width: '100%' }}>
            <RippleName text="Nandhini" fontSize={nameSize} centered={mobile} />
          </div>

          {/* Red cursive subtitle — Snugger under the name */}
          <div style={{
            fontFamily: "'Satisfy', cursive",
            fontSize: mobile ? 28 : Math.min(34, vw * 0.026),
            color: '#e63b2e',
            marginTop: mobile ? -16 : -32,
            marginLeft: mobile ? 0 : 4,
            letterSpacing: '0.01em',
            position: 'relative',
            zIndex: 12,
            pointerEvents: 'none',
            textAlign: mobile ? 'center' : 'left',
            width: '100%',
          }}>
            finance &amp; commerce
          </div>
        </div>

        {/* ══ RIGHT: Polaroid collage ══ */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: mobile ? 400 : 520,
        }}>

          {/* Safety pin — Slipped to the top-left corner, away from her face! */}
          <div style={{
            position: 'absolute',
            top: mobile ? -15 : -25,
            left: mobile ? 'calc(50% - 105px)' : 'calc(50% - 135px)',
            transform: `rotate(-25deg) translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0)`,
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
            zIndex: 6,
          }}>
            <SafetyPin size={mobile ? 54 : 70} />
          </div>

          {/* Polaroid card */}
          <div style={{
            position: 'relative',
            background: '#ffffff',
            padding: mobile ? '10px 10px 32px' : '12px 12px 42px',
            transform: `rotate(-3deg) translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)`,
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
            boxShadow: '3px 6px 24px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 5,
            width: mobile ? 230 : 290,
          }}>
            {/* Real photo inside polaroid */}
            <div style={{
              width: '100%',
              height: mobile ? 250 : 310,
              overflow: 'hidden',
              background: '#f1f5f9',
            }}>
              <img
                src={nandhiniReal}
                alt="Nandhini"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 12%',
                  display: 'block',
                  filter: 'contrast(1.02) saturate(1.05)',
                }}
              />
            </div>
            {/* Polaroid caption & Birthdate metadata */}
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginTop: 10,
            }}>
              <div style={{
                fontFamily: "'Satisfy', cursive",
                fontSize: 14,
                color: '#222',
                letterSpacing: '0.02em',
              }}>
                Nandhini ✦
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 8.5,
                color: '#888',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                est. 16 jun 2005
              </div>
            </div>
          </div>

          {/* Ticket stub — right of polaroid */}
          <div style={{
            position: 'absolute',
            right: mobile ? 8 : 30,
            bottom: mobile ? 50 : 70,
            transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 0)`,
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
            zIndex: 4,
          }}>
            {/* Washi tape holding down the ticket stub */}
            <div style={{
              position: 'absolute',
              top: -8,
              right: 20,
              zIndex: 10,
            }}>
              <WashiTape rotation={-20} width={50} height={14} />
            </div>
            <TicketStub />
          </div>

          {/* Flower sticker — bottom left of polaroid */}
          <div style={{
            position: 'absolute',
            left: mobile ? 16 : 40,
            bottom: mobile ? 60 : 80,
            zIndex: 7,
            transform: `rotate(-15deg) translate3d(${mousePos.x * -8}px, ${mousePos.y * -8}px, 0)`,
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
          }}>
            <FlowerSticker size={mobile ? 40 : 54} />
          </div>

          {/* Small flower top right */}
          <div style={{
            position: 'absolute',
            right: mobile ? 20 : 30,
            bottom: mobile ? 170 : 200,
            zIndex: 4,
            transform: `rotate(10deg) translate3d(${mousePos.x * 15}px, ${mousePos.y * 15}px, 0)`,
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
            opacity: 0.75,
          }}>
            <FlowerSticker size={mobile ? 24 : 30} />
          </div>

        </div>
      </div>

      {/* ── Premium Editorial Scroll Down Indicator ── */}
      {!mobile && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: 0.65,
          zIndex: 15,
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#111111',
          }}>
            Scroll to begin
          </span>
          <div style={{
            width: 1,
            height: 38,
            background: 'rgba(17, 17, 17, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '100%',
              height: '40%',
              background: '#e63b2e',
              position: 'absolute',
              left: 0,
              animation: 'scroll-dot 1.8s ease-in-out infinite',
            }} />
          </div>
        </div>
      )}
      
      {/* Dynamic Keyframes injected locally */}
      <style>{`
        @keyframes scroll-dot {
          0% { top: -40%; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}
