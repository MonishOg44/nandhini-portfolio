import { useTransition } from '../contexts/TransitionContext';
import { Mail, Linkedin, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumTextRipple } from './PremiumTextRipple';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdDcK1Eqq2I7DU5XZivsB33QCMqumLoWVTdE2Hcx1g67pgRZQ/viewform?usp=header';

export function Contact() {
  const { triggerSlashTransition } = useTransition();

  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-16 animate-fade-in text-center flex flex-col items-center justify-center">
          <PremiumTextRipple 
            text="Get In Touch" 
            fontSize={64}
            height={110} 
            className="mb-3"
          />
          <p className="text-foreground/60 text-base max-w-2xl mx-auto font-light leading-relaxed">
            Analyzing financial data and designing business strategies requires precision. Let's discuss corporate finance, valuation models, accounting compliance, or advisory opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Google Form CTA Card */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center justify-center text-center gap-6" style={{ minHeight: 280 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e63b2e 0%, #ff6b5e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(230,59,46,0.25)',
                }}
              >
                <Mail style={{ width: 24, height: 24, color: '#ffffff' }} />
              </div>
              <div>
                <h3 className="text-foreground font-semibold text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Have a question or want to connect?
                </h3>
                <p className="text-foreground/50 text-sm font-light max-w-md leading-relaxed">
                  Fill out a quick form and I'll get back to you as soon as possible. Looking forward to hearing from you!
                </p>
              </div>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full max-w-xs px-6 py-3 rounded-md text-white font-mono text-xs tracking-wider uppercase transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e63b2e 0%, #c9302a 100%)',
                  boxShadow: '0 4px 14px rgba(230,59,46,0.3)',
                }}
              >
                <ExternalLink style={{ width: 14, height: 14 }} />
                Send a Message
              </a>
            </div>
          </div>

          {/* Contact Info & Links */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="space-y-6">
              {/* Direct contact */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-bold text-accent mb-4 font-mono tracking-widest">
                  DIRECT CONTACT
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:nandhini796s@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                  >
                    <Mail className="w-4 h-4 text-accent" />
                    <span className="text-sm font-light">nandhini796s@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-sm font-bold text-accent mb-4 font-mono tracking-widest">
                  SOCIAL
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://www.linkedin.com/in/nandhini-s-7b0007312?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-accent" />
                    <span className="text-sm font-light">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Resume download */}
              <Button
                className="w-full bg-secondary text-foreground hover:bg-secondary/80 font-mono border border-border text-xs tracking-wider"
                variant="outline"
                asChild
              >
                <a href={`${import.meta.env.BASE_URL}resume.pdf`} download="Nandhini_S_Resume.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV / Resume
                </a>
              </Button>

              {/* Creator Credits button — notebook hand-drawn style */}
              <button
                id="creator-credits-btn"
                onClick={() => triggerSlashTransition('/credits')}
                style={{
                  width: '100%',
                  background: '#fffdf8',
                  border: '2px solid #1a1a1a',
                  fontFamily: "'Caveat', cursive",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0 #1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  letterSpacing: '0.01em',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #1a1a1a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
                }}
              >
                ✦ Creator Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

