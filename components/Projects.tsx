import SectionWrapper from '@/components/layout/SectionWrapper';
import { projects } from '@/constants';

import ProjectsShowcase from './ProjectsShowcase';

const Projects: React.FC = () => {
  return (
    <SectionWrapper idName='projects' label='Projects'>
      <ProjectsShowcase projects={projects} />
    </SectionWrapper>
  );
};

export default Projects;
