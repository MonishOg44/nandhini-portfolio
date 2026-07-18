import { useState } from 'react';
import nandhiniCharacter from '../assets/nandhini-full-body.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Style objects for SVG icons on dark background
  const iconStyle = (id: string) => ({
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: hoveredIcon === id ? '1.5px solid #eccb58' : '1.5px solid rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: hoveredIcon === id ? '#eccb58' : 'transparent',
    color: hoveredIcon === id ? '#111111' : 'rgba(255, 255, 255, 0.85)',
    transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
    cursor: 'pointer',
  });

  return (
    <footer style={{
      backgroundColor: '#000000ff', // Matte premium dark background
      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1.2px, transparent 1.2px)',
      backgroundSize: '20px 20px',
      color: '#ffffff',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* ── TOP BAND: Animated Character & Giant Background Typography ── */}
      <div style={{
        position: 'relative',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        {/* Giant Outlined Background Text */}
        <div style={{
          position: 'absolute',
          width: '100%',
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '0.85',
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: '11vw',
            letterSpacing: '0.05em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(238, 229, 229, 0.13)',
          }}>
            NANDHINI
          </span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: '11vw',
            letterSpacing: '0.05em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.15)',
          }}>
            PORTFOLIO
          </span>
        </div>

        {/* Floating Animated Girl Character */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          animation: 'bob-character 4.5s ease-in-out infinite',
        }}>
          <img
            src={nandhiniCharacter} // The generated animated/illustrated full-body character of Nandhini
            alt="Nandhini Character"
            style={{
              height: '380px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(1px 0px 0px #ffffff) drop-shadow(-1px 0px 0px #ffffff) drop-shadow(0px 1px 0px #ffffff) drop-shadow(0px -1px 0px #ffffff) drop-shadow(5px 10px 25px rgba(0,0,0,0.5))',
            }}
          />
        </div>
      </div>

      {/* ── BOTTOM BAND: Title, Action links, Social Links ── */}
      <div style={{
        padding: '50px 8% 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-[30px]">
          {/* Action text related to commerce & finance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              Let's strategize
            </span>
            <h2 style={{
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(28px, 4.2vw, 52px)',
              fontWeight: 900,
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}>
              Beyond Numbers, <span style={{ color: '#eccb58' }}>Beyond Limits.</span>
            </h2>
          </div>

          {/* Social media icons */}
          <div className="flex flex-col items-start sm:items-end gap-[10px]">
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              Reach out
            </span>
            
            <div style={{ display: 'flex', gap: 12 }}>


              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/nandhini-s-7b0007312"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredIcon('in')}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <div style={iconStyle('in')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:nandhini796s@gmail.com"
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredIcon('mail')}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <div style={iconStyle('mail')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom meta info */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '11px',
          fontFamily: "'Space Mono', monospace",
          color: 'rgba(255, 255, 255, 0.45)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {/* SVG Copyright Symbol */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0, opacity: 0.75 }}
            >
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" />
              <path
                d="M15 9.5A4.5 4.5 0 1 0 15 14.5"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {currentYear} NANDHINI. ALL RIGHTS RESERVED.
          </span>
          <span style={{ letterSpacing: '0.15em' }}>Aspiring commerce professional with a focus on growth.</span>
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes bob-character {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.01);
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
