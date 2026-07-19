import { useState, useEffect } from 'react';
import { Magnetic } from './Magnetic';
import { Menu, X } from 'lucide-react';
import crumpledPaper from '../assets/crumpled-paper.png';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'ABOUT', href: '#skills' },
    { label: 'TIMELINE', href: '#timeline' },
    { label: 'PORTFOLIO', href: '#projects' },
    { label: 'INSIGHTS', href: '#blog' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const rect = element.getBoundingClientRect();
      // Offset by floating navbar height (approx 85px) to center sections correctly
      const scrollTarget = window.scrollY + rect.top - 85;
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────
         Desktop/Tablet Navigation Bar (Wide & Spacious)
         ───────────────────────────────────────────────── */}
      <nav
        className="hidden md:flex"
        style={{
          position: 'fixed',
          top: isScrolled ? '16px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '680px', // Increased from 480px for extra breathing room
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: '9999px',
          // Rich, highly visible glassmorphism
          background: isScrolled ? 'rgba(255, 255, 255, 0.38)' : 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(40px) saturate(220%)',
          WebkitBackdropFilter: 'blur(40px) saturate(220%)',
          border: 'none',
          boxShadow: isScrolled
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.08)'
            : '0 8px 24px -12px rgba(0, 0, 0, 0.03)',
          padding: '8px 24px 8px 30px', // More vertical and horizontal spacing
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand logo link */}
        <span
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: '20px', // Slightly larger
            fontStyle: 'italic',
            color: '#111111',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Nandhini.
        </span>

        {/* Spacious menu items */}
        <div className="flex items-center gap-6"> {/* Increased gap for layout clarity */}
          {navItems.map((item) => (
            <Magnetic key={item.label}>
              <button
                onClick={() => handleNavClick(item.href)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 600,
                  color: 'rgba(17, 17, 17, 0.72)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                className="text-[9.5px] tracking-widest px-2 py-1.5 hover:text-[#e63b2e] hover:scale-105"
              >
                {item.label}
              </button>
            </Magnetic>
          ))}
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────
         Mobile Navigation Bar (Compact Capsule)
         ───────────────────────────────────────────────── */}
      <nav
        className="flex md:hidden"
        style={{
          position: 'fixed',
          top: isScrolled ? '8px' : '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '88%',
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: '9999px',
          background: isScrolled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.22)',
          backdropFilter: 'blur(32px) saturate(220%)',
          WebkitBackdropFilter: 'blur(32px) saturate(220%)',
          border: 'none',
          boxShadow: '0 12px 28px -10px rgba(0, 0, 0, 0.06)',
          padding: '4px 10px 4px 14px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand logo link */}
        <span
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: '15px',
            fontStyle: 'italic',
            color: '#111111',
            cursor: 'pointer',
          }}
        >
          Nandhini.
        </span>

        {/* Menu toggle button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            background: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '9999px',
            padding: '4px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span className="text-[7.5px] font-mono tracking-widest font-bold text-foreground/80">MENU</span>
          <Menu className="w-3 h-3 text-foreground/80" />
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────
         Mobile Full-Screen Glassmorphic Drawer
         ───────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: '#f7f5f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'all' : 'none',
          transform: isMobileMenuOpen ? 'scale(1)' : 'scale(1.05)',
          padding: '40px 24px',
          overflow: 'hidden',
        }}
      >
        {/* Clean graph paper grid background only */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 390 844"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(17,17,17,0.08)" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="390" height="844" fill="url(#grid)" />
        </svg>

        {/* CSS styles for animations inside the menu drawer */}
        <style>{`
          @keyframes menuLinkFadeIn {
            0% {
              opacity: 0;
              transform: translate3d(0, 30px, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          .mobile-menu-link-animate {
            opacity: 0;
            animation: menuLinkFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Close Button & Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '320px', zIndex: 2 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(17, 17, 17, 0.5)',
              fontWeight: 600,
            }}
          >
            MENU.
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: 'rgba(17, 17, 17, 0.05)',
              border: '1px solid rgba(17, 17, 17, 0.12)',
              borderRadius: '9999px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="hover:bg-black/10 active:scale-95"
          >
            <X className="w-4 h-4 text-neutral-800" />
          </button>
        </div>

        {/* Vertical Links List */}
        <div
          style={{
            width: '100%',
            maxWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'flex-start',
            paddingLeft: '10px',
            margin: 'auto 0',
            zIndex: 2,
          }}
        >
          {[
            { label: 'ABOUT', href: '#skills', type: 'link' },
            { label: 'TIMELINE', href: '#timeline', type: 'link' },
            { label: 'PORTFOLIO', href: '#projects', type: 'link' },
            { label: 'INSIGHTS', href: '#blog', type: 'link' },
            { label: 'CONTACT', href: '#contact', type: 'link' },
            { label: 'RESUME', href: `${import.meta.env.BASE_URL}resume.pdf`, type: 'external' },
            { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/nandhini-s-7b0007312?utm_source=share_via&utm_content=profile&utm_medium=member_ios', type: 'external' },
          ].map((item, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            const delay = isMobileMenuOpen ? `${0.1 + idx * 0.07}s` : '0s';
            return (
              <div
                key={item.label}
                className={isMobileMenuOpen ? 'mobile-menu-link-animate' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '16px',
                  animationDelay: delay,
                }}
              >
                {/* Number index */}
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '11px',
                    color: 'rgba(17, 17, 17, 0.4)',
                    fontWeight: 500,
                  }}
                >
                  {numStr}
                </span>

                {item.type === 'link' ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#111111',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '26px',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="hover:text-[#e63b2e] hover:translate-x-2 active:scale-95"
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#111111',
                      textDecoration: 'none',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '26px',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      textAlign: 'left',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="hover:text-[#e63b2e] hover:translate-x-2 active:scale-95"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div
          style={{
            width: '100%',
            maxWidth: '320px',
            borderTop: '1px solid rgba(17, 17, 17, 0.08)',
            paddingTop: '20px',
            fontSize: '8px',
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(17, 17, 17, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          EST. 2026 / NANDHINI PORTFOLIO
        </div>
      </div>
    </>
  );
}

export default Navigation;
