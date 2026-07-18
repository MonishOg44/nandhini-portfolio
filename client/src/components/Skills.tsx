import { PremiumTextRipple } from './PremiumTextRipple';
import pressedGinkgo from '../assets/pressed-ginkgo.png';
import pressedFern from '../assets/pressed-fern.png';
import ledgerScrap from '../assets/ledger-scrap.png';
import notePng from '../assets/note.png';
import crumpledPaper from '../assets/crumpled-paper.png';

interface Skill {
  category: string;
  items: Array<{
    name: string;
    proficiency: number;
  }>;
}

const skills: Skill[] = [
  {
    category: 'Finance & Accounting',
    items: [
      { name: 'Financial Analysis & Research', proficiency: 90 },
      { name: 'Accounting Fundamentals', proficiency: 95 },
      { name: 'Financial Reporting & Basics', proficiency: 88 },
      { name: 'Financial Markets & Investment Analysis', proficiency: 86 },
      { name: 'SEBI Compliance & Risk Management', proficiency: 80 },
    ],
  },
  {
    category: 'Technical & Data Tools',
    items: [
      { name: 'MS Excel (V/XLOOKUP, Pivot Tables)', proficiency: 95 },
      { name: 'Google Sheets Data Modeling', proficiency: 90 },
      { name: 'Data Analysis & Cleaning', proficiency: 88 },
      { name: 'Executive Presentations (MS PPT/Word)', proficiency: 92 },
      { name: 'Business Reporting Systems', proficiency: 85 },
    ],
  },
];

export function Skills() {
  // Rotations for Core Competency tags to look hand-placed
  const rotations = [
    'rotate(-1.8deg)',
    'rotate(1.5deg)',
    'rotate(-2.2deg)',
    'rotate(2deg)',
    'rotate(-1.2deg)',
    'rotate(2.6deg)',
    'rotate(-1.5deg)',
    'rotate(1.9deg)',
  ];

  // Distinct primary warm tones for each ledger sheet
  const groupThemes: Record<string, { color: string; border: string; bg: string }> = {
    'Finance & Accounting': { color: '#e63b2e', border: '#fcdcdb', bg: '#fdfbf9' },
    'Technical & Data Tools': { color: '#386a54', border: '#dbece4', bg: '#f8faf7' },
  };

  return (
    <section className="py-24 bg-[#fbf8f5] border-b border-border relative overflow-hidden">
      {/* Decorative botanical collage elements */}
      <img
        src={pressedGinkgo}
        alt="Pressed Ginkgo Leaf"
        className="hidden lg:block absolute left-8 bottom-12 w-28 h-28 object-contain opacity-55 pointer-events-none select-none z-0 transform -rotate-12"
      />
      <img
        src={pressedFern}
        alt="Pressed Fern Leaf"
        className="hidden lg:block absolute right-8 top-16 w-24 h-36 object-contain opacity-45 pointer-events-none select-none z-0 transform rotate-45"
      />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-20 animate-fade-in text-center flex flex-col items-center justify-center">
          <PremiumTextRipple 
            text="Skills & Expertise" 
            fontSize={64}
            height={110} 
            className="mb-3"
          />
          <p className="text-foreground/70 text-base max-w-2xl font-light mt-4 leading-relaxed font-serif italic mx-auto">
            My specialized competence and practical expertise in corporate finance, ledger architecture, auditing rules, and professional tools.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {skills.map((skillGroup, groupIndex) => {
            const theme = groupThemes[skillGroup.category] || { color: '#7C3AED', border: '#e8e2f7', bg: '#ffffff' };
            return (
              <div
                key={skillGroup.category}
                className="animate-fade-in"
                style={{ animationDelay: `${groupIndex * 80}ms` }}
              >
                {/* Physical Ledger Page card */}
                <div 
                  className="relative border border-black/10 rounded-md p-8 pl-12 shadow-[4px_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[6px_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  style={groupIndex === 0 ? {
                    backgroundColor: '#fdfbf9', // Warm Cream
                    backgroundImage: `linear-gradient(rgba(253, 251, 249, 0.93), rgba(253, 251, 249, 0.93)), url('${ledgerScrap}')`,
                    backgroundSize: '140%',
                    backgroundPosition: '15% 25%',
                  } : {
                    backgroundColor: '#f8faf7', // Pale Sage
                    backgroundImage: `linear-gradient(rgba(248, 250, 247, 0.93), rgba(248, 250, 247, 0.93)), url('${notePng}')`,
                    backgroundSize: '150%',
                    backgroundPosition: '65% 45%',
                  }}
                >
                  {/* Binder punches on the left edge to look like notebook sheets */}
                  <div className="absolute left-3 top-0 bottom-0 flex flex-col justify-around py-6 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-background border border-black/10 shadow-inner" />
                    ))}
                  </div>

                  {/* Red Double Margin Line of Ledger sheet */}
                  <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-red-300/40" />

                  {/* Header Title with custom theme color */}
                  <h3 
                    className="text-base font-bold mb-8 font-mono tracking-widest uppercase pb-2 border-b border-dashed"
                    style={{ 
                      color: theme.color,
                      borderColor: `${theme.color}25`
                    }}
                  >
                    {skillGroup.category}
                  </h3>

                  <div className="space-y-6">
                    {skillGroup.items.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-foreground/90 font-medium text-sm font-sans">
                            {skill.name}
                          </span>
                          <span 
                            className="text-xs font-mono font-bold"
                            style={{ color: theme.color }}
                          >
                            {skill.proficiency}%
                          </span>
                        </div>
                        {/* Custom visual progress bar track */}
                        <div className="h-[5px] bg-[#ece9df] rounded-full overflow-hidden relative">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out relative"
                            style={{ 
                              width: `${skill.proficiency}%`,
                              backgroundColor: theme.color,
                            }}
                          >
                            {/* Ink marker cap at progress head */}
                            <div 
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: theme.color }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Competencies Styled as Hand-placed collage ticket stubs */}
        <div className="mt-20 relative">
          {/* Subtle grid backing decoration behind competencies section */}
          <div className="absolute inset-0 bg-[#ece6de]/50 border border-dashed border-border rounded-lg -rotate-1 pointer-events-none z-0" />
          
          <div 
            className="relative border border-border rounded-lg p-8 md:p-10 animate-fade-in z-10"
            style={{
              background: `linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)), url('${crumpledPaper}')`,
              backgroundSize: 'cover',
            }}
          >
            {/* Washi Tape holding section down */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%) rotate(-2deg)',
              width: '110px',
              height: '24px',
              backgroundColor: 'rgba(230, 215, 195, 0.72)',
              backdropFilter: 'blur(1px)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              borderLeft: '1.5px dashed rgba(0,0,0,0.08)',
              borderRight: '1.5px dashed rgba(0,0,0,0.08)',
              zIndex: 12,
            }} />

            <h3 className="text-sm font-bold text-foreground/90 mb-8 font-mono tracking-widest uppercase text-center">
              ✦ CORE COMPETENCIES ✦
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
              {[
                'Analytical Thinking',
                'Attention to Detail',
                'Communication',
                'Problem Solving',
                'Team Collaboration',
                'Time Management',
                'Fin-Tech Research',
                'DEI Leadership',
              ].map((competency, idx) => {
                const rotationStyle = rotations[idx % rotations.length];
                const baseColor = [
                  '250, 248, 245', // Warm Cream
                  '253, 250, 242', // Soft Manila
                  '245, 250, 246', // Pale Sage
                  '250, 245, 248', // Soft Blush
                  '251, 251, 249', // Off-White
                  '252, 250, 240', // Pale Straw
                ][idx % 6];
                
                return (
                  <div
                    key={competency}
                    style={{ transform: rotationStyle }}
                    className="relative group transition-all duration-300"
                  >
                    {/* Tiny tape strip at the top of each ticket */}
                    <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-7 h-2.5 bg-[#eccb58]/40 border-x border-dashed border-black/5 z-20" />
                    
                    <div
                      className="px-4 py-3 text-foreground font-semibold rounded border border-black/10 text-center text-xs font-mono shadow-[2px_3px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[3px_6px_12px_rgba(0,0,0,0.08)] group-hover:scale-105 group-hover:rotate-0 transition-all duration-300 cursor-default"
                      style={{
                        backgroundImage: `linear-gradient(rgba(${baseColor}, 0.94), rgba(${baseColor}, 0.94)), url('${crumpledPaper}')`,
                        backgroundSize: 'cover',
                      }}
                    >
                      {competency}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Skills;
