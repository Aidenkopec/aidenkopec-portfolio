import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Tech from '@/components/Tech';
import Projects from '@/components/Projects';
import Feedbacks from '@/components/Feedbacks';
import Contact from '@/components/Contact';
import FloatingMusicBar from '@/components/FloatingMusicBar';

export default function Home() {
  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Projects />
      <Feedbacks />
      <Contact />
      <FloatingMusicBar />
    </div>
  );
}
