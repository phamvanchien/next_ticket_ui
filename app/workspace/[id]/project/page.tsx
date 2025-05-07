import ProjectView from "@/views/project/ProjectView";
import '../../../css/pages/project.css';
import '../../../css/pages/workspace.css';
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Tech | Projects",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Projects",
  icons: {
    icon: '/logo.png'
  },
};

interface ProjectPageProps {
  params: { id: number };
}

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  return <ProjectView workspaceId={params.id} />
}
export default ProjectPage;