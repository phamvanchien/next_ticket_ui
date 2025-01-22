import { PieChart } from 'react-minimal-pie-chart';
import ProjectStatusReport from './components/ProjectStatusReport';
import { ProjectType } from '@/types/project.type';
import React from 'react';
import ProjectMemberReport from './components/ProjectMemberReport';

interface ProjectReportViewProps {
  project: ProjectType
}

const ProjectReportView: React.FC<ProjectReportViewProps> = ({ project }) => {
  return <>
    <ProjectStatusReport project={project} />
    <ProjectMemberReport project={project} />
  </>
}
export default ProjectReportView;