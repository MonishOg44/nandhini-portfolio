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
          background: 'rgba(251, 248, 245, 0.82)', // Creamy white tint to match theme
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'all' : 'none',
          transform: isMobileMenuOpen ? 'scale(1)' : 'scale(1.05)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            borderRadius: '9999px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <X className="w-4 h-4 text-[#111]" />
        </button>

        {/* Tactile Scrapbook Ticket inside the menu */}
        <div 
          className="relative max-w-[280px] w-full border border-black/10 rounded-lg p-8 shadow-[6px_10px_30px_rgba(0,0,0,0.08)] text-center overflow-hidden"
          style={{
            backgroundColor: '#faf8f5',
            backgroundImage: `url('${crumpledPaper}')`,
            backgroundBlendMode: 'multiply',
          }}
        >
          {/* Punched hole margin detail at the top */}
          <div className="absolute top-2 left-0 right-0 flex justify-around px-4 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-background border border-black/10 shadow-inner" />
            ))}
          </div>

          <div className="text-[10px] font-mono tracking-[0.25em] text-foreground/45 uppercase mb-8 mt-2">
            ✦ NAVIGATION INDEX ✦
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  fontStyle: 'italic',
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                className="hover:text-[#e63b2e] hover:scale-105 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-black/10 text-[9px] font-mono text-foreground/40 uppercase tracking-widest">
            Nandhini Portfolio
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
