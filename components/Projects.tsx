import { Suspense } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import ProjectsServer from './ProjectsServer';

// Loading fallback component
const ProjectsLoading = () => (
  <div className="w-full min-h-[800px] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-color-variable)] mx-auto mb-4"></div>
      <p className="text-secondary text-lg">
        Loading Projects & GitHub Data...
      </p>
    </div>
  </div>
);

// Main Projects component using Next.js 15.4.6 Server/Client architecture
const Projects: React.FC = () => {
  return (
    <SectionWrapper idName="projects">
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsServer />
      </Suspense>
    </SectionWrapper>
  );
};

export default Projects;
