import { GraduationCap, Briefcase, BookOpen, Award, Users } from 'lucide-react';
import { PremiumTextRipple } from './PremiumTextRipple';
import crumpledPaper from '../assets/crumpled-paper.png';

interface TimelineItem {
  date: string;
  role: string;
  organization: string;
  description: string[];
  type: 'education' | 'experience' | 'research' | 'leadership' | 'certification';
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    date: 'JUN 2026',
    role: 'Google Data Analytics Professional',
    organization: 'Coursera / Google Certification',
    description: [
      'Earned professional credential covering data cleaning, analysis, SQL, Python, spreadsheets, and data visualization.',
      'Gained practical skill in transforming raw data into actionable business insights.'
    ],
    type: 'certification',
    color: '#eccb58' // Gold
  },
  {
    date: '2023 – 2026',
    role: 'Bachelor of Commerce (B. Com)',
    organization: 'Shri Shankarlal Sundarbai Shasun Jain College for Women, Chennai',
    description: [
      'Graduated with an aggregate of 75.6%.',
      'Acquired a strong foundation in accounting principles, financial reporting, and commercial law.'
    ],
    type: 'education',
    color: '#386a54' // Sage Green
  },
  {
    date: 'DEC 2023 – JAN 2024',
    role: 'Finance Intern',
    organization: 'Divya Swaroopa Financial Services Pvt. Ltd.',
    description: [
      'Assisted in technical and fundamental analysis of equity and derivatives markets.',
      'Conducted financial research and gained exposure to investment analysis and modeling.',
      'Developed understanding of SEBI regulations, compliance, and financial risk management.'
    ],
    type: 'experience',
    color: '#e63b2e' // Crimson Red
  },
  {
    date: '2024',
    role: 'Published Research Contributor',
    organization: 'Shanlax Publications',
    description: [
      'Co-authored research article: "A Grandeur Shift: India\'s Evolution in Fin-Tech Horizon."',
      'Published in India 2.0: Vision for India 2047 – Digital Ecosystem & Harnessing Artificial Intelligence.'
    ],
    type: 'research',
    color: '#7c533c' // Terracotta
  },
  {
    date: '2025 – 2026',
    role: 'President & Coordinator',
    organization: 'Diversity, Equity & Inclusivity (D.E.I.) Club',
    description: [
      'Led student initiatives, workshops, and campus awareness programs.',
      'Coordinated extensively with faculty members, student committees, and guest speakers.'
    ],
    type: 'leadership',
    color: '#b28900' // Dark Gold
  },
  {
    date: 'PURSUING',
    role: 'ACCA Candidate',
    organization: 'Association of Chartered Certified Accountants',
    description: [
      'Currently preparing for the ACCA (Skills Level) examinations to achieve international chartered qualification.'
    ],
    type: 'education',
    color: '#386a54' // Sage Green
  }
];

export function Timeline() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'experience':
        return <Briefcase className="w-5 h-5" />;
      case 'research':
        return <BookOpen className="w-5 h-5" />;
      case 'leadership':
        return <Users className="w-5 h-5" />;
      case 'certification':
        return <Award className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <section id="timeline" className="py-24 bg-[#fbf8f5] border-b border-border relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none" style={{
        backgroundImage: 'radial-gradient(#111 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-20 animate-fade-in text-center flex flex-col items-center justify-center">
          <PremiumTextRipple 
            text="Career Timeline" 
            fontSize={64}
            height={110} 
            className="mb-3"
          />
          <p className="text-foreground/70 text-base max-w-2xl font-light mt-4 leading-relaxed font-serif italic mx-auto">
            A chronological ledger of my academic foundations, corporate internship exposure, research contributions, and professional qualifications.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="relative">
          {/* Vertical central wire binder line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-dashed border-l-2 border-double border-border -translate-x-1/2 z-0" />

          <div className="space-y-16">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              const cardRotation = isEven ? 'rotate(-1.2deg)' : 'rotate(1deg)';
              const posX = (index * 41) % 95;
              const posY = (index * 29) % 95;
              const size = 130 + (index * 18) % 45;
              const tint = [
                '#faf8f5', // Warm Cream
                '#fdfaf2', // Soft Manila
                '#f5faf6', // Pale Sage
                '#faf5f8', // Soft Blush
                '#fbfbf9', // Off-White
                '#fcfaf0', // Pale Straw
              ][index % 6];

              return (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row items-start relative z-10 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Badge */}
                  <div 
                    className="absolute left-4 md:left-1/2 top-1 w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center -translate-x-1/2 z-20"
                    style={{ 
                      backgroundColor: item.color,
                      color: '#ffffff',
                      boxShadow: `0 0 10px ${item.color}35`
                    }}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Left/Right empty filler for alignment on desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Document Card Panel */}
                  <div 
                    className="w-full md:w-[45%] pl-12 md:pl-0 group transition-all duration-300"
                    style={{ transform: cardRotation }}
                  >
                    <div 
                      className="relative border border-black/10 rounded shadow-[4px_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[8px_12px_28px_rgba(0,0,0,0.09)] group-hover:scale-[1.015] group-hover:rotate-0 transition-all duration-300 p-6 overflow-hidden"
                      style={{
                        backgroundColor: tint,
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('${crumpledPaper}')`,
                        backgroundSize: `${size}%`,
                        backgroundPosition: `${posX}% ${posY}%`,
                      }}
                    >
                      {/* Paperclip header detail */}
                      <div className="absolute top-2 right-4 w-3 h-8 rounded-full border border-black/20 bg-transparent z-10 pointer-events-none transform rotate-6 flex flex-col justify-between py-0.5 px-[1.5px]">
                        <div className="w-full h-full border border-black/5 rounded-full bg-white/50 backdrop-blur-[0.5px]"></div>
                      </div>

                      {/* Red margin binder line */}
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-red-200/50" />

                      {/* Header Stamp */}
                      <div className="flex justify-between items-center mb-3">
                        <span 
                          className="font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border uppercase"
                          style={{ 
                            color: item.color, 
                            borderColor: `${item.color}30`,
                            backgroundColor: `${item.color}08`
                          }}
                        >
                          {item.date}
                        </span>
                        <span className="text-[9px] text-foreground/45 font-mono uppercase tracking-wider">
                          // {item.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-foreground mb-1 font-serif italic">
                        {item.role}
                      </h3>
                      
                      {/* Organization */}
                      <div className="text-xs text-foreground/70 font-mono mb-4">
                        {item.organization}
                      </div>

                      {/* Description Bullet points */}
                      <ul className="space-y-2 text-foreground/75 text-xs font-light leading-relaxed list-disc list-inside pl-1">
                        {item.description.map((bullet, idx) => (
                          <li key={idx} className="marker:text-foreground/30">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
export default Timeline;
