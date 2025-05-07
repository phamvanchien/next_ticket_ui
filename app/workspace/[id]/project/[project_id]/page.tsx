import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import ProjectBoardView from "@/views/project-board/ProjectBoardView";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import '../../../../css/pages/board.css';
import { Metadata } from "next";

interface ProjectBoardProps {
  params: { 
    id: number
    project_id: number 
  };
}

export const metadata: Metadata = {
  title: "Next Tech | Projects",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Projects",
  icons: {
    icon: '/logo.png'
  },
};

const ProjectBoard: React.FC<ProjectBoardProps> = async ({ params }) => {
  const project = await fetchProject(params.id, params.project_id);

  if (!project || project.code !== API_CODE.OK) {
    return <ErrorPage code={project.code} />;
  }
  return <Suspense>
    <ProjectBoardView project={project.data} />
  </Suspense>
}

const fetchProject = async (workspaceId: number, projectId: number): Promise<BaseResponseType<ProjectType>> => {
  try {
    const apiResponse = await fetch(APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId.toString() + '/' + projectId.toString(), {
      method: API_METHOD_ENUM.GET,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies().get(APP_AUTH.COOKIE_AUTH_KEY)?.value}`
      }
    });
  
    return await apiResponse.json();
  } catch (error) {
    const errorRes = responseError(500);
    errorRes.error = catchError();
    return errorRes;
  }
};

export default ProjectBoard;