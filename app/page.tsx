import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Tech from '@/components/Tech';
import Projects from '@/components/Projects';
import GitHubActivity from '@/components/GitHubActivity';
import RecentBlogs from '@/components/RecentBlogs';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import FloatingMusicBar from '@/components/FloatingMusicBar';
import StarsBackdrop from '@/components/StarsBackdrop';
import WavyLines from '@/components/canvas/WavyLines';

export default function Home() {
  return (
    <div className='relative z-0 max-w-full overflow-x-hidden bg-primary'>
      <div className='relative'>
        <WavyLines className='-z-10' />
        <Navbar />
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Projects />
      <GitHubActivity />
      <RecentBlogs />
      <Testimonials />
      <div className='relative z-0'>
        <Contact />
        <StarsBackdrop />
      </div>
      <FloatingMusicBar />
    </div>
  );
}
