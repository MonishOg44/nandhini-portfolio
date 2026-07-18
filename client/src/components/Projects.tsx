import { FileText, TrendingUp, BarChart3, PieChart, Landmark, BookOpen, Users } from 'lucide-react';
import { PremiumTextRipple } from './PremiumTextRipple';
import notePng from '../assets/note.png';
import crumpledPaper from '../assets/crumpled-paper.png';
import ledgerScrap from '../assets/ledger-scrap.png';
import pressedFern from '../assets/pressed-fern.png';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
  metric?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Equity & Derivatives Market Analysis',
    description: 'My fundamental and technical analysis research conducted during my internship at Divya Swaroopa Financial Services, evaluating risk profiles and price trends.',
    tags: ['Equity Research', 'Fundamental Analysis', 'SEBI Rules', 'Risk Management'],
    type: 'Investment Analysis',
    metric: 'SEBI Compliance Ready'
  },
  {
    id: '2',
    title: 'FinTech Industry Research Paper',
    description: 'Co-authored and published the research article "A Grandeur Shift: India\'s Evolution in Fin-Tech Horizon" evaluating digital ecosystems and AI integration.',
    tags: ['FinTech Horizon', 'Digital Ecosystems', 'AI Adoption', 'India 2.0'],
    type: 'Published Research',
    metric: 'Shanlax Publications'
  },
  {
    id: '3',
    title: 'Google Data Analytics Capstone',
    description: 'A comprehensive data analytics case study executing data cleaning, transformation, and visualization processes using SQL, Python, and spreadsheets.',
    tags: ['SQL Querying', 'Python Pandas', 'Data Visualizations', 'Spreadsheets'],
    type: 'Data Analytics',
    metric: 'Google Professional Cert'
  },
  {
    id: '4',
    title: 'ACCA Financial Reporting Studies',
    description: 'Corporate reporting and financial analysis case studies constructed as part of my preparation for the ACCA (Skills Level) accounting standards modules.',
    tags: ['Financial Reporting', 'ACCA Skills', 'IFRS Standards', 'Accounting Theory'],
    type: 'ACCA Valuation',
    metric: 'ACCA Skills Level'
  },
  {
    id: '5',
    title: 'DEI Club Leadership Operations',
    description: 'Operations, budgeting, and guest coordination framework developed during my presidency of the Diversity, Equity & Inclusivity Club at college.',
    tags: ['Event Management', 'Budget Planning', 'Team Collaboration', 'Public Speaking'],
    type: 'Leadership & Operations',
    metric: 'DEI Club President'
  },
  {
    id: '6',
    title: 'Working Capital & Liquidity Optimization',
    description: 'Macroeconomic analysis of cash conversion cycles, inventory turn strategies, and corporate reserve allocation guidelines to safeguard liquidity.',
    tags: ['Working Capital', 'Cash Conversion', 'Liquidity Analysis', 'Treasury Basics'],
    type: 'Treasury Management',
    metric: 'Cash Reserve Planning'
  },
];

const getCardBackgroundStyle = (index: number) => {
  const posX = (index * 37) % 95;
  const posY = (index * 43) % 95;
  const size = 135 + (index * 15) % 45;

  switch (index % 6) {
    case 0: // Soft Warm Cream
      return {
        backgroundColor: '#fafaf2',
        backgroundImage: `linear-gradient(rgba(250, 250, 242, 0.93), rgba(250, 250, 242, 0.93)), url('${notePng}')`,
        backgroundSize: 'cover',
        backgroundPosition: `${posX}% ${posY}%`,
      };
    case 1: // Soft Sage
      return {
        backgroundColor: '#f5faf6',
        backgroundImage: `linear-gradient(rgba(245, 250, 246, 0.93), rgba(245, 250, 246, 0.93)), url('${crumpledPaper}')`,
        backgroundSize: `${size}%`,
        backgroundPosition: `${posX}% ${posY}%`,
      };
    case 2: // Soft Ivory
      return {
        backgroundColor: '#fdfaf0',
        backgroundImage: `linear-gradient(rgba(253, 250, 240, 0.91), rgba(253, 250, 240, 0.91)), url('${ledgerScrap}')`,
        backgroundSize: `${size}%`,
        backgroundPosition: `${posX}% ${posY}%`,
      };
    case 3: // Soft Off-White
      return {
        backgroundColor: '#fbfbf9',
        backgroundImage: `linear-gradient(rgba(251, 251, 249, 0.94), rgba(251, 251, 249, 0.94)), url('${notePng}')`,
        backgroundSize: 'cover',
        backgroundPosition: `${posX}% ${posY}%`,
      };
    case 4: // Soft Kraft Cream
      return {
        backgroundColor: '#f6ebd9',
        backgroundImage: `linear-gradient(rgba(246, 235, 217, 0.91), rgba(246, 235, 217, 0.91)), url('${crumpledPaper}')`,
        backgroundSize: `${size}%`,
        backgroundPosition: `${posX}% ${posY}%`,
      };
    case 5: // Soft Blush Pink
      return {
        backgroundColor: '#faf5f8',
        backgroundImage: `linear-gradient(rgba(250, 245, 248, 0.93), rgba(250, 245, 248, 0.93)), url('${ledgerScrap}')`,
        backgroundSize: `${size}%`,
        backgroundPosition: `${posX}% ${posY}%`,
      };
    default:
      return {
        backgroundColor: '#faf8f5',
        backgroundImage: `linear-gradient(rgba(250, 248, 245, 0.92), rgba(250, 248, 245, 0.92)), url('${crumpledPaper}')`,
        backgroundSize: 'cover',
      };
  }
};

export function Projects() {
  // Rotations for project cards to give a collage desk feel
  const rotations = [
    'rotate(-1deg)',
    'rotate(0.8deg)',
    'rotate(-0.5deg)',
    'rotate(1.2deg)',
    'rotate(-1.2deg)',
    'rotate(0.6deg)'
  ];

  // Helper to render type-specific icons
  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'Investment Analysis':
        return <BarChart3 className="w-6 h-6 text-[#e63b2e]" />;
      case 'Published Research':
        return <BookOpen className="w-6 h-6 text-[#386a54]" />;
      case 'Data Analytics':
        return <PieChart className="w-6 h-6 text-[#b28900]" />;
      case 'ACCA Valuation':
        return <TrendingUp className="w-6 h-6 text-[#8b5e3c]" />;
      case 'Leadership & Operations':
        return <Users className="w-6 h-6 text-[#7c533c]" />;
      case 'Treasury Management':
        return <Landmark className="w-6 h-6 text-[#e63b2e]" />;
      default:
        return <FileText className="w-6 h-6 text-foreground/75" />;
    }
  };

  return (
    <section className="py-24 bg-[#fbf8f5] border-b border-border relative overflow-hidden">
      {/* Decorative leaf overlays */}
      <img
        src={pressedFern}
        alt="Pressed Fern Background"
        className="hidden lg:block absolute left-[-40px] top-1/3 w-36 h-48 object-contain opacity-25 pointer-events-none select-none z-0 transform -rotate-45"
      />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-20 animate-fade-in text-center flex flex-col items-center justify-center">
          <PremiumTextRipple 
            text="Featured Work" 
            fontSize={64}
            height={110} 
            className="mb-3"
          />
          <p className="text-foreground/70 text-base max-w-2xl font-light mt-4 leading-relaxed font-serif italic mx-auto">
            My curated corporate case studies, investment strategies, and financial models built with strategic rigor.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => {
            const cardRotation = rotations[index % rotations.length];
            return (
              <div
                key={project.id}
                className="animate-fade-in group"
                style={{ 
                  animationDelay: `${index * 60}ms`,
                  transform: cardRotation,
                }}
              >
                {/* Physical Case File card wrapper */}
                <div 
                  className="relative border border-black/10 rounded shadow-[4px_6px_20px_rgba(0,0,0,0.06)] hover:shadow-[8px_12px_28px_rgba(0,0,0,0.1)] group-hover:scale-[1.02] group-hover:rotate-0 transition-all duration-300 h-full flex flex-col overflow-hidden"
                  style={getCardBackgroundStyle(index)}
                >
                  {/* Retro metallic paperclip graphic at top right */}
                  <div className="absolute top-2 right-6 w-3.5 h-10 rounded-full border border-black/20 bg-transparent z-20 pointer-events-none transform rotate-12 flex flex-col justify-between py-1 px-[2px]">
                    <div className="w-full h-full border border-black/10 rounded-full bg-white/45 backdrop-blur-[0.5px]"></div>
                  </div>

                  {/* Project Header representation (Torn ledger paper look) */}
                  <div 
                    className="h-28 bg-[#fdfbf6] border-b border-black/10 flex flex-col items-start justify-end p-6 relative overflow-hidden"
                    style={{
                      backgroundImage: `url('${ledgerScrap}')`,
                      backgroundSize: 'cover',
                      backgroundBlendMode: 'multiply',
                    }}
                  >
                    {/* The icon circle badge */}
                    <div className="absolute top-4 left-6 p-2 rounded-full bg-white/90 border border-black/10 shadow-sm z-10">
                      {getProjectIcon(project.type)}
                    </div>

                    {/* Subtitle / Type stamp */}
                    <div className="text-[9px] font-mono tracking-widest text-foreground/50 uppercase relative z-10 font-bold">
                      // {project.type}
                    </div>
                  </div>

                  {/* Project content */}
                  <div className="p-6 flex flex-col flex-1 relative">
                    {/* Vertical binder margin line */}
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-red-200/50" />

                    {/* Metric Badge */}
                    {project.metric && (
                      <div className="inline-block self-start px-2 py-0.5 bg-[#e63b2e]/10 border border-[#e63b2e]/20 rounded text-[9px] font-mono text-[#e63b2e] mb-3 font-semibold tracking-wider">
                        {project.metric.toUpperCase()}
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-[#e63b2e] transition-colors font-serif italic leading-snug">
                      {project.title}
                    </h3>
                    
                    <p className="text-foreground/75 text-xs mb-5 flex-1 font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6 z-10">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#ece6de]/60 text-foreground/80 text-[9px] rounded font-mono border border-black/5"
                        >
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default Projects;
