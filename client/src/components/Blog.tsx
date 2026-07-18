import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import notePng from '../assets/note.png';
import crumpledPaper from '../assets/crumpled-paper.png';
import ledgerScrap from '../assets/ledger-scrap.png';
import pressedGinkgo from '../assets/pressed-ginkgo.png';
import { PremiumTextRipple } from './PremiumTextRipple';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  tags: string[];
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: "A Grandeur Shift: India's Evolution in Fin-Tech Horizon",
    excerpt: 'Published article studying digital ecosystems, payments evolution, UPI infrastructure, and artificial intelligence integration in the Indian fintech horizon.',
    date: 'Feb 15, 2024',
    readTime: 6,
    tags: ['FinTech', 'Digital Payments', 'India 2.0'],
    slug: 'india-fintech-evolution',
  },
  {
    id: '2',
    title: 'Translating Complex Data to Actionable Corporate Decisions',
    excerpt: 'A business intelligence case brief executing data cleaning, transformation, and visualization patterns using Google Data Analytics guidelines.',
    date: 'Jun 10, 2026',
    readTime: 8,
    tags: ['Data Analytics', 'SQL Queries', 'MS Excel'],
    slug: 'business-data-analytics',
  },
  {
    id: '3',
    title: 'Practical Exposure in Equity and Derivatives Risk Assessments',
    excerpt: 'A review of stock market analysis patterns, risk assessments, and compliance processes gained during my internship at Divya Swaroopa Financial Services.',
    date: 'Jan 22, 2024',
    readTime: 7,
    tags: ['Equity Analysis', 'Risk Management', 'Internship'],
    slug: 'equity-derivatives-analysis',
  },
  {
    id: '4',
    title: 'ACCA Standards in Modern Corporate Ledger Systems',
    excerpt: 'Analyzing corporate governance, IFRS guidelines, and financial disclosure integrity in preparation for the ACCA professional qualification.',
    date: 'Dec 12, 2025',
    readTime: 10,
    tags: ['ACCA Qualification', 'Corporate Reporting', 'Accounting'],
    slug: 'acca-corporate-reporting',
  },
];

const getCardBackgroundStyle = (index: number) => {
  const posX = (index * 29) % 95;
  const posY = (index * 53) % 95;
  const size = 145 + (index * 17) % 35;

  switch (index % 4) {
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
    default:
      return {
        backgroundColor: '#faf8f5',
        backgroundImage: `linear-gradient(rgba(250, 248, 245, 0.92), rgba(250, 248, 245, 0.92)), url('${crumpledPaper}')`,
        backgroundSize: 'cover',
      };
  }
};

export function Blog() {
  // Alternating tilts to mimic collage clippings
  const rotations = [
    'rotate(0.6deg)',
    'rotate(-0.8deg)',
    'rotate(0.4deg)',
    'rotate(-0.5deg)',
  ];

  return (
    <section className="py-24 bg-[#fbf8f5] border-b border-border relative overflow-hidden">
      {/* Decorative leaf overlays */}
      <img
        src={pressedGinkgo}
        alt="Pressed Ginkgo Leaf"
        className="hidden lg:block absolute right-[-20px] bottom-12 w-32 h-32 object-contain opacity-25 pointer-events-none select-none z-0 transform rotate-12"
      />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-20 animate-fade-in text-center flex flex-col items-center justify-center">
          <PremiumTextRipple 
            text="Financial Insights" 
            fontSize={64}
            height={110} 
            className="mb-3"
          />
          <p className="text-foreground/70 text-base max-w-2xl font-light mt-4 leading-relaxed font-serif italic mx-auto">
            Analysis on macroeconomic trends, taxation regulations, and corporate investment strategies.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogPosts.map((post, index) => {
            const cardRotation = rotations[index % rotations.length];
            return (
              <article
                key={post.id}
                className="group animate-fade-in"
                style={{ 
                  animationDelay: `${index * 60}ms`,
                  transform: cardRotation,
                }}
              >
                {/* Vintage Journal Scrap clipping card */}
                <div 
                  className="relative border border-black/10 rounded shadow-[4px_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[8px_12px_28px_rgba(0,0,0,0.09)] group-hover:scale-[1.015] group-hover:rotate-0 transition-all duration-300 h-full flex flex-col p-8 overflow-hidden"
                  style={getCardBackgroundStyle(index)}
                >
                  {/* Small piece of washi tape at top left corner */}
                  <div className="absolute top-[-8px] left-6 w-12 h-4 bg-[#eccb58]/35 border-x border-dashed border-black/5 transform -rotate-3 z-10" />

                  {/* Red Notebook Margin line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-red-200/50" />

                  {/* Header: Date Archive Stamp and read time */}
                  <div className="flex justify-between items-center mb-4 pl-2">
                    {/* Archival Ink Stamp */}
                    <div className="border border-red-800/25 text-red-800/75 font-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase font-semibold">
                      FILE // {post.date.toUpperCase()}
                    </div>
                    <span className="text-[10px] text-foreground/50 font-mono tracking-wider">
                      {post.readTime} MIN READ
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-[#e63b2e] transition-colors line-clamp-2 font-serif italic pl-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-foreground/75 text-xs mb-5 flex-1 line-clamp-3 font-light leading-relaxed pl-2">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6 pl-2 z-10">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#ece6de]/60 text-foreground/75 text-[9px] rounded font-mono border border-black/5"
                      >
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>

                  {/* Read article link */}
                  <div className="pl-2 pt-4 border-t border-dashed border-black/10 mt-auto z-10">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:text-[#e63b2e] hover:bg-[#e63b2e]/5 pl-0 font-mono text-[9px] tracking-widest uppercase rounded-none transition-colors"
                      onClick={() => alert(`Opening analysis: ${post.title}`)}
                    >
                      Read Case Brief Summary
                      <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default Blog;
