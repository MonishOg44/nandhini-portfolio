import { useEffect, useRef, useState } from 'react';
import { PremiumTextRipple } from './PremiumTextRipple';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  char?: string;
  angle?: number;
  spin?: number;
}

export function Activities() {
  const singingCanvasRef = useRef<HTMLCanvasElement>(null);
  const dancingCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isSingingHovered, setIsSingingHovered] = useState(false);
  const [isDancingHovered, setIsDancingHovered] = useState(false);
  
  // Audio state mimic for visualizer
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioVisualizerRaf = useRef<number | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);

  // Real HTML5 audio integration
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Audio('/song.mp3');
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleAudioEnded = () => {
      setIsPlayingAudio(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAudio) {
      audio.play().catch((err) => {
        console.error('Audio playback error:', err);
      });
    } else {
      audio.pause();
      audio.currentTime = 0; // stop resets the position
    }
  }, [isPlayingAudio]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 1. Singing Canvas Animation (Floating Music Notes)
  useEffect(() => {
    const canvas = singingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = 250);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 300;
      height = canvas.height = 250;
    };
    window.addEventListener('resize', handleResize);

    const notes = ['♪', '♫', '♩', '♬', '♭', '♮'];
    let particles: Particle[] = [];
    let rafId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn notes if hovered
      if (isSingingHovered && Math.random() < 0.08) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 40,
          y: height - 60,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 10 + 16,
          opacity: 1,
          char: notes[Math.floor(Math.random() * notes.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.05,
        });
      }

      // Update and draw
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.008;
        if (p.angle !== undefined && p.spin !== undefined) {
          p.angle += p.spin;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = '#111111';
        ctx.font = `${p.size}px 'Cormorant Garamond', serif`;
        ctx.translate(p.x, p.y);
        if (p.angle !== undefined) {
          ctx.rotate(p.angle);
        }
        ctx.fillText(p.char || '♪', 0, 0);
        ctx.restore();

        return p.opacity > 0;
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSingingHovered]);

  // 2. Dancing Canvas Animation (Glimmering Sparkles & Rhythm Pulse)
  useEffect(() => {
    const canvas = dancingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = 250);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 300;
      height = canvas.height = 250;
    };
    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];
    let rafId: number;
    let pulseProgress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background rhythm pulse circles if hovered
      if (isDancingHovered) {
        pulseProgress += 0.02;
        if (pulseProgress > 1) pulseProgress = 0;

        ctx.strokeStyle = `rgba(17, 17, 17, ${0.15 * (1 - pulseProgress)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, pulseProgress * 150, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(17, 17, 17, ${0.08 * (1 - (pulseProgress + 0.5) % 1)})`;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, ((pulseProgress + 0.5) % 1) * 150, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Spawn sparkle particles on hover
      if (isDancingHovered && Math.random() < 0.2) {
        particles.push({
          x: Math.random() * width,
          y: height / 2 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0 - 0.4,
          size: Math.random() * 3 + 2,
          opacity: 1,
        });
      }

      // Update and draw sparkles
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.012;

        ctx.fillStyle = `rgba(17, 17, 17, ${p.opacity})`;
        ctx.beginPath();
        // Draw 4-point star sparkle shape
        ctx.moveTo(p.x, p.y - p.size * 2);
        ctx.lineTo(p.x + p.size / 2, p.y - p.size / 2);
        ctx.lineTo(p.x + p.size * 2, p.y);
        ctx.lineTo(p.x + p.size / 2, p.y + p.size / 2);
        ctx.moveTo(p.x, p.y + p.size * 2);
        ctx.lineTo(p.x - p.size / 2, p.y + p.size / 2);
        ctx.lineTo(p.x - p.size * 2, p.y);
        ctx.lineTo(p.x - p.size / 2, p.y - p.size / 2);
        ctx.closePath();
        ctx.fill();

        return p.opacity > 0;
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDancingHovered]);

  // 3. Mimic Audio wave visualizer loop
  useEffect(() => {
    if (!isPlayingAudio) {
      if (audioVisualizerRaf.current) cancelAnimationFrame(audioVisualizerRaf.current);
      return;
    }

    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 100);
    const height = (canvas.height = 34);
    const numBars = 10;
    const barWidth = 6;
    const gap = 3;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.12;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + gap);
        const amp = 6 + Math.sin(time + i * 0.5) * 10 + Math.cos(time * 0.8 - i * 0.4) * 6;
        const h = Math.max(2, Math.min(height, amp));

        // Draw glowing gold frequency bars
        ctx.fillStyle = '#eccb58';
        ctx.fillRect(x, (height - h) / 2, barWidth, h);
      }

      audioVisualizerRaf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (audioVisualizerRaf.current) cancelAnimationFrame(audioVisualizerRaf.current);
    };
  }, [isPlayingAudio]);

  return (
    <section 
      className="py-24 px-6 md:px-12 lg:px-24"
      style={{
        backgroundColor: '#fbf8f5', // Editorial cream canvas
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      
      {/* ── Section Title block ── */}
      <div style={{
        marginBottom: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 8,
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'rgba(17, 17, 17, 0.45)',
        }}>
          creative outlets
        </span>
        
        <div style={{ marginLeft: '0px', width: '100%' }}>
          <PremiumTextRipple 
            text="Arts &amp; Rhythm" 
            fontSize={62} 
            fontFamily="'Cormorant Garamond', serif"
            fontWeightStyle="italic 500"
          />
        </div>
      </div>

      {/* ── Scrapbook Cards Layout Grid ── */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
        style={{
          position: 'relative',
          zIndex: 5,
        }}
      >
        
        {/* CARD 1: Singing (Vocal Expression) */}
        <div 
          onMouseEnter={() => setIsSingingHovered(true)}
          onMouseLeave={() => {
            setIsSingingHovered(false);
            setIsPlayingAudio(false);
          }}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(17, 17, 17, 0.08)',
            padding: '30px',
            position: 'relative',
            boxShadow: isSingingHovered 
              ? '4px 12px 30px rgba(0,0,0,0.06)' 
              : '2px 4px 15px rgba(0,0,0,0.03)',
            transform: isSingingHovered 
              ? 'rotate(-1deg) translateY(-5px)' 
              : 'rotate(0.5deg)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            cursor: 'default',
          }}
        >
          {/* Mock Washi Tape Accent */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '30px',
            width: '80px',
            height: '22px',
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(236,203,88,0.2), rgba(236,203,88,0.2) 10px, rgba(236,203,88,0.3) 10px, rgba(236,203,88,0.3) 20px)',
            border: '1px solid rgba(236,203,88,0.4)',
            transform: 'rotate(-4deg)',
            opacity: 0.8,
            zIndex: 10,
          }} />

          {/* Interactive Singing Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(17, 17, 17, 0.4)',
            }}>
              vocal expression / 01
            </span>
            
            <button 
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              style={{
                background: isPlayingAudio ? '#111111' : 'transparent',
                color: isPlayingAudio ? '#ffffff' : '#111111',
                border: '1px solid #111111',
                borderRadius: '20px',
                padding: '4px 12px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isPlayingAudio ? '■ Stop' : '▶ Play'}
            </button>
          </div>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '32px',
            fontWeight: 500,
            fontStyle: 'italic',
            margin: '0 0 15px 0',
          }}>
            The Power of Singing
          </h3>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(17, 17, 17, 0.7)',
            margin: '0 0 20px 0',
          }}>
            Music is the core anchor of my expression. To me, singing is a form of creative meditation where I translate numerical logic and financial strategy into raw acoustic resonance. I explore classical ranges, contemporary vocals, and songwriting to balance my analytical mindset with a soulful cadence.
          </p>

          {/* Cassette Graphic / Visualizer Area */}
          <div style={{
            position: 'relative',
            background: '#faf6f0', // Soft paper texture background
            border: '1px solid rgba(17, 17, 17, 0.08)',
            padding: '24px 16px 16px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
            {/* Canvas layer for floating notes */}
            <canvas 
              ref={singingCanvasRef} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            {/* 1. PREMIUM CASSETTE TAPE STICKER */}
            <div style={{
              width: '100%',
              maxWidth: '260px',
              height: '125px',
              backgroundColor: '#262423', // Charcoal plastic shell
              borderRadius: '8px',
              border: '2.5px solid #1c1a19',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.1)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px 14px',
              zIndex: 2,
              userSelect: 'none',
            }}>
              {/* Cassette Top Label */}
              <div style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#f3ede2', // Vintage paper label
                border: '1px solid #dcd3c9',
                borderRadius: '4px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 8px',
                overflow: 'hidden',
              }}>
                {/* Horizontal red stripe accent */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#d05a3f',
                  opacity: 0.65,
                }} />
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: '#8b5a2b',
                  letterSpacing: '0.15em',
                  zIndex: 2,
                }}>
                  SIDE A // ACC. REC
                </div>
                <div style={{
                  fontFamily: "'Satisfy', cursive",
                  fontSize: '13px',
                  color: '#111111',
                  marginTop: '1px',
                  zIndex: 2,
                }}>
                  nandhini's voice notes ✦
                </div>
              </div>

              {/* Cassette Center Window with Spools */}
              <div style={{
                width: '75%',
                height: '35px',
                backgroundColor: '#151413', // Clear dark plastic window
                borderRadius: '4px',
                border: '1px solid #3c3a39',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                position: 'relative',
              }}>
                {/* Brown Tape Strip connecting spools */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '32px',
                  right: '32px',
                  height: '2px',
                  backgroundColor: '#4a3319', // Tape film
                  zIndex: 1,
                }} />

                {/* Left Spool */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: isPlayingAudio ? 'spin-reels 3.5s linear infinite' : 'none',
                  zIndex: 2,
                }}>
                  {/* Spoke Teeth */}
                  <svg width="20" height="20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="14" fill="#111111" />
                    <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 22 22 L 78 78 M 22 78 L 78 22" stroke="#111111" strokeWidth="8" />
                  </svg>
                </div>

                {/* Right Spool */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: isPlayingAudio ? 'spin-reels 3.5s linear infinite' : 'none',
                  zIndex: 2,
                }}>
                  {/* Spoke Teeth */}
                  <svg width="20" height="20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="14" fill="#111111" />
                    <path d="M 50 10 L 50 90 M 10 50 L 90 50 M 22 22 L 78 78 M 22 78 L 78 22" stroke="#111111" strokeWidth="8" />
                  </svg>
                </div>
              </div>

              {/* Tape Bottom Trapeze Outlines */}
              <div style={{
                position: 'absolute',
                bottom: '1px',
                width: '60px',
                height: '10px',
                backgroundColor: '#1c1a19',
                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              }} />
            </div>

            {/* 2. GLOWING RETRO EQUALIZER DISPLAY SCREEN */}
            <div style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#111111', // LCD panel
              border: '1.5px solid #2d2b29',
              borderRadius: '6px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2,
              boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.8)',
            }}>
              {/* Playback Indicator */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                alignItems: 'flex-start',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isPlayingAudio ? '#ef4444' : '#6b7280',
                    animation: isPlayingAudio ? 'pulse-red 1.2s infinite' : 'none',
                  }} />
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '8px',
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}>
                    {isPlayingAudio ? 'RUN' : 'STBY'}
                  </span>
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '7px',
                  color: '#ffffff',
                }}>
                  L-CH [A.REC]
                </span>
              </div>

              {/* Glowing Visualizer Canvas */}
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                height: '34px',
                opacity: isPlayingAudio ? 1 : 0.25,
                transition: 'opacity 0.3s ease',
              }}>
                <canvas 
                  ref={visualizerCanvasRef} 
                  style={{
                    width: '100px',
                    height: '34px',
                    display: 'block',
                  }} 
                />
              </div>

              {/* Glowing Tape Counter Timer */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '2px',
                minWidth: '35px',
              }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px',
                  color: isPlayingAudio ? '#ef4444' : '#6b7280',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  textShadow: isPlayingAudio ? '0 0 4px rgba(239, 68, 68, 0.4)' : 'none',
                }}>
                  {formatTime(currentTime)}
                </span>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '6px',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}>
                  INDEX
                </span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: 'rgba(17, 17, 17, 0.4)',
            textAlign: 'right',
          }}>
            ♩ Acoustic &bull; Jazz &bull; Soul
          </div>
        </div>

        {/* CARD 2: Dancing (Movement & Rhythm) */}
        <div 
          onMouseEnter={() => setIsDancingHovered(true)}
          onMouseLeave={() => setIsDancingHovered(false)}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(17, 17, 17, 0.08)',
            padding: '30px',
            position: 'relative',
            boxShadow: isDancingHovered 
              ? '4px 12px 30px rgba(0,0,0,0.06)' 
              : '2px 4px 15px rgba(0,0,0,0.03)',
            transform: isDancingHovered 
              ? 'rotate(1.2deg) translateY(-5px)' 
              : 'rotate(-0.5deg)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            cursor: 'default',
          }}
        >
          {/* Mock Washi Tape Accent */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '40px',
            width: '70px',
            height: '20px',
            background: 'rgba(17, 17, 17, 0.06)',
            border: '1px dashed rgba(17, 17, 17, 0.15)',
            transform: 'rotate(6deg)',
            opacity: 0.8,
            zIndex: 10,
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(17, 17, 17, 0.4)',
            }}>
              rhythm &amp; movement / 02
            </span>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isDancingHovered ? '#eccb58' : 'rgba(17, 17, 17, 0.15)',
              transition: 'background-color 0.3s ease',
            }} />
          </div>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '32px',
            fontWeight: 500,
            fontStyle: 'italic',
            margin: '0 0 15px 0',
          }}>
            Rhythm in Motion
          </h3>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(17, 17, 17, 0.7)',
            margin: '0 0 20px 0',
          }}>
            For me, dancing is the physical embodiment of structure and rhythm. Just as I rely on balanced flow in strategic finance, I use choreography to master timing, precision, and spatial coordination. I practice both classical and contemporary forms to keep my mind sharp and my body in sync.
          </p>

          {/* Dancing Graphic / Rhythm visualizer pad */}
          <div style={{
            position: 'relative',
            height: '110px',
            background: '#fafafa',
            border: '1px solid rgba(17, 17, 17, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <canvas 
              ref={dancingCanvasRef} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            />

            {/* Kinetic choreography grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              width: '80%',
              zIndex: 3,
            }}>
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  style={{
                    height: '24px',
                    border: '1px solid #111111',
                    borderRadius: '2px',
                    backgroundColor: isDancingHovered ? 'rgba(236,203,88,0.2)' : 'transparent',
                    transform: isDancingHovered ? `scaleY(${1 + Math.sin(i + Date.now() * 0.02) * 0.25})` : 'none',
                    transition: 'all 0.2s ease',
                    opacity: isDancingHovered ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            color: 'rgba(17, 17, 17, 0.4)',
            textAlign: 'right',
          }}>
            ♬ Contemporary &bull; Classical &bull; Choreography
          </div>
        </div>

      </div>

      {/* CSS Animation Keyframes for Tape Reels & LCD screen */}
      <style>{`
        @keyframes spin-reels {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-red {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 4px #ef4444;
          }
          50% {
            opacity: 0.3;
            box-shadow: 0 0 0px transparent;
          }
        }
      `}</style>
    </section>
  );
}

export default Activities;
