import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import { BaseResponseType } from "@/types/base.type";
import { TaskType } from "@/types/task.type";
import TaskDetailView from "@/views/task/TaskDetailView";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import '../../../../../../css/pages/board.css';

interface TaskDetailPageProps {
  params: { 
    id: number
    project_id: number,
    task_id: number
  };
}

export const metadata: Metadata = {
  title: "Next Tech | Task",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Task",
  icons: {
    icon: '/logo.png'
  },
};

const TaskDetailPage: React.FC<TaskDetailPageProps> = async ({ params }) => {
  const task = await fetchTask(params.id, params.project_id, params.task_id);

  if (!task || task.code !== API_CODE.OK) {
    return <ErrorPage code={task.code} />;
  }

  return <TaskDetailView task={task.data} />
}

const fetchTask = async (workspaceId: number, projectId: number, taskId: number): Promise<BaseResponseType<TaskType>> => {
  try {
    const apiResponse = await fetch(APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId.toString() + '/' + projectId.toString() + '/' + taskId.toString(), {
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

export default TaskDetailPage;