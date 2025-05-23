import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import { BaseResponseType } from "@/types/base.type";
import { TimeTrackingType } from "@/types/time-tracking.type";
import TimeTrackingView from "@/views/time-tracking/TimeTrackingView";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import '../../../../css/pages/time-tracking.css';
import TimeTrackingNoData from "@/views/time-tracking/TimeTrackingNoData";
import TimeTrackingReportView from "@/views/time-tracking/TimeTrackingReportView";
import ComingSoonView from "@/common/layouts/ComingSoonView";

export const metadata: Metadata = {
  title: "Next Tech | Time Tracking",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Time Tracking",
  icons: {
    icon: '/logo.png'
  },
};

interface TimeTrackingReportPageProps {
  params: {
    id: number;
  };
}

const TimeTrackingReportPage: React.FC<TimeTrackingReportPageProps> = async ({ params }) => {
  return <ComingSoonView />
  const memberTracking = await fetchWorkspace(params.id);

  if (!memberTracking || memberTracking.code !== API_CODE.OK) {
    return <ErrorPage code={memberTracking.code} />;
  }

  if (memberTracking.code === API_CODE.OK && !memberTracking.data) {
    return <TimeTrackingNoData />
  }

  return <TimeTrackingReportView timeTracking={memberTracking.data} />
}

const fetchWorkspace = async (workspaceId: number): Promise<BaseResponseType<TimeTrackingType>> => {
  try {
    const apiResponse = await fetch(APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId.toString() + '/member', {
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

export default TimeTrackingReportPage