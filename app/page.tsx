import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Tech from '@/components/Tech';
import Projects from '@/components/Projects';
import GitHubActivity from '@/components/GitHubActivity';
import RecentBlogs from '@/components/RecentBlogs';
import Contact from '@/components/Contact';
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
