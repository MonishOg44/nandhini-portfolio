import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { SectionDivider } from '@/components/SectionDivider';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { Timeline } from '@/components/Timeline';
import { Blog } from '@/components/Blog';
import { Activities } from '@/components/Activities';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Scroll3D } from '@/components/Scroll3D';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />
      <Hero />
      <SectionDivider />
      <Scroll3D id="projects">
        <Projects />
      </Scroll3D>
      <SectionDivider />
      <Scroll3D id="skills">
        <Skills />
      </Scroll3D>
      <SectionDivider />
      <Scroll3D id="timeline">
        <Timeline />
      </Scroll3D>
      <SectionDivider />
      <Scroll3D id="blog">
        <Blog />
      </Scroll3D>
      <SectionDivider />
      <Scroll3D id="activities">
        <Activities />
      </Scroll3D>
      <SectionDivider />
      <Scroll3D id="contact">
        <Contact />
      </Scroll3D>
      <Footer />
    </div>
  );
}
