import Hero from '@/components/sections/Hero';
import Navbar from '@/components/layout/Navbar';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Tech from '@/components/sections/Tech';
import Projects from '@/components/sections/Projects';
import GitHubActivity from '@/components/sections/GitHubActivity';
import RecentBlogs from '@/components/sections/RecentBlogs';
import Contact from '@/components/sections/Contact';
import FlightPath from '@/components/chart/FlightPath';
import SwarmStage from '@/components/swarm/SwarmStage';

export default function Home() {
  return (
    <div className='relative z-0 max-w-full overflow-x-hidden bg-primary'>
      <SwarmStage />
      <div className='relative'>
        <Navbar />
        <Hero />
      </div>
      {/* Everything after the hero is one route, drawn under the sections. */}
      <div className='relative'>
        <FlightPath />
        <About />
        <Experience />
        <Tech />
        <Projects />
        <GitHubActivity />
        <RecentBlogs />
        <Contact />
      </div>
    </div>
  );
}
