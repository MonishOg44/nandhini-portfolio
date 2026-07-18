import { useState } from 'react';
import { useLocation } from 'wouter';
import { Mail, Linkedin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PremiumTextRipple } from './PremiumTextRipple';

function FuturisticPopup({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div 
      className="absolute right-4 -top-10 z-30 flex items-center gap-2 px-3 py-1.5 rounded bg-[#e63b2e] border border-[#ff8e86] text-white text-[10px] font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(230,59,46,0.35)] animate-in fade-in zoom-in-95 duration-200"
      role="alert"
    >
      <div className="flex h-1.5 w-1.5 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
      </div>
      <span>{message}</span>
      <button 
        type="button" 
        onClick={onClose} 
        className="ml-1 text-white/60 hover:text-white transition-colors focus:outline-none text-[8.5px]"
      >
        ✕
      </button>
      {/* Speech bubble arrow pointing to input */}
      <div className="absolute bottom-[-3px] right-6 w-1.5 h-1.5 bg-[#e63b2e] border-r border-b border-[#ff8e86] transform rotate-45"></div>
    </div>
  );
}

export function Contact() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error reactively on typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the validation errors before sending.');
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Message sent! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

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
          {/* Contact Form */}
          <div className="lg:col-span-2 animate-fade-in">
            <form noValidate onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8">
              <div className="space-y-6">
                {/* Name input */}
                <div>
                  <label htmlFor="name" className="block text-foreground font-medium mb-2 text-sm">
                    Name
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`bg-secondary border-border text-foreground placeholder:text-foreground/40 transition-colors ${
                        errors.name ? 'border-[#e63b2e] focus-visible:ring-[#e63b2e]' : ''
                      }`}
                    />
                    {errors.name && (
                      <FuturisticPopup 
                        message={errors.name} 
                        onClose={() => setErrors(prev => ({ ...prev, name: undefined }))} 
                      />
                    )}
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-foreground font-medium mb-2 text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`bg-secondary border-border text-foreground placeholder:text-foreground/40 transition-colors ${
                        errors.email ? 'border-[#e63b2e] focus-visible:ring-[#e63b2e]' : ''
                      }`}
                    />
                    {errors.email && (
                      <FuturisticPopup 
                        message={errors.email} 
                        onClose={() => setErrors(prev => ({ ...prev, email: undefined }))} 
                      />
                    )}
                  </div>
                </div>

                {/* Message textarea */}
                <div>
                  <label htmlFor="message" className="block text-foreground font-medium mb-2 text-sm">
                    Message
                  </label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`bg-secondary border-border text-foreground placeholder:text-foreground/40 resize-none transition-colors ${
                        errors.message ? 'border-[#e63b2e] focus-visible:ring-[#e63b2e]' : ''
                      }`}
                    />
                    {errors.message && (
                      <FuturisticPopup 
                        message={errors.message} 
                        onClose={() => setErrors(prev => ({ ...prev, message: undefined }))} 
                      />
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-xs tracking-wider"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
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
                    href="https://www.linkedin.com/in/nandhini-s-7b0007312"
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
                <a href="/resume.pdf" download="Nandhini_S_Resume.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV / Resume
                </a>
              </Button>

              {/* Creator Credits button — notebook hand-drawn style */}
              <button
                id="creator-credits-btn"
                onClick={() => navigate('/credits')}
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
