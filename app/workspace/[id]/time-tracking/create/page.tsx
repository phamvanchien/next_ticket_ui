import TimeTrackingManageView from "@/views/time-tracking-manage/TimeTrackingManageView";
import { Metadata } from "next";
import React from "react";
import '../../../../css/pages/project.css';
import { BaseResponseType } from "@/types/base.type";
import { WorkspaceType } from "@/types/workspace.type";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { cookies } from "next/headers";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import ErrorPage from "@/common/layouts/ErrorPage";
import TimeTrackingCreateView from "@/views/time-tracking-manage/create/TimeTrackingCreateView";
import '../../../../css/pages/time-tracking.css';
import ComingSoonView from "@/common/layouts/ComingSoonView";

export const metadata: Metadata = {
  title: "Next Tech | Time Tracking",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Time Tracking",
  icons: {
    icon: '/logo.png'
  },
};

interface TimeTrackingCreatePageProps {
  params: {
    id: number;
  };
}

const TimeTrackingCreatePage: React.FC<TimeTrackingCreatePageProps> = async ({ params }) => {
  return <ComingSoonView />
  // const workspace = await fetchWorkspace(params.id);

  // if (!workspace || workspace.code !== API_CODE.OK) {
  //   return <ErrorPage code={workspace.code} />;
  // }
  // return <TimeTrackingCreateView workspace={workspace.data} />
}

const fetchWorkspace = async (workspaceId: number): Promise<BaseResponseType<WorkspaceType>> => {
  try {
    const apiResponse = await fetch(APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId.toString() + '/owner', {
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

export default TimeTrackingCreatePage