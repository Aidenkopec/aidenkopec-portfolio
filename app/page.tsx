import Image from 'next/image';
import Hero from '@/components/Hero';
import {
  Navbar,
  About,
  Experience,
  Tech,
  Projects,
  Feedbacks,
  Contact,
  StarsCanvas,
  FloatingMusicBar,
} from '@/components';
import { MusicProvider } from '@/context/MusicContext';
export default function Home() {
  return (
    <MusicProvider>
      <div className="relative z-0 bg-primary max-w-full overflow-x-hidden">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Projects />
        <Feedbacks />
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>
        <FloatingMusicBar />
      </div>
    </MusicProvider>
  );
}
