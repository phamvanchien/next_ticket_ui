import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import { BaseResponseType } from "@/types/base.type";
import { WorkspaceType } from "@/types/workspace.type";
import WorkspaceSettingView from "@/views/workspace-setting/WorkspaceSettingView";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import '../../../css/pages/workspace.css';

export const metadata: Metadata = {
  title: "Next Tech | Workspace setting",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Workspace setting",
  icons: {
    icon: '/logo.png'
  },
};

interface WorkspaceSettingProps {
  params: { 
    id: number
  };
}

const WorkspaceSetting: React.FC<WorkspaceSettingProps> = async ({ params }) => {
  const workspace = await fetchWorkspace(params.id);

  if (!workspace || workspace.code !== API_CODE.OK) {
    return <ErrorPage code={workspace.code} />;
  }
  return <WorkspaceSettingView workspace={workspace.data} />
}

const fetchWorkspace = async (workspaceId: number): Promise<BaseResponseType<WorkspaceType>> => {
  try {
    const apiResponse = await fetch(APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId.toString(), {
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
export default WorkspaceSetting;