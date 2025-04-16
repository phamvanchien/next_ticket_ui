import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "@/types/base.type";
import { APP_CONFIG } from "@/configs/app.config";
import { HistoryType, RequestCreateTaskType, RequestGetTaskType, RequestUpdateTaskType, ResponseTaskBoardDataType, TaskFileType, TaskType } from "@/types/task.type";

export const create = async (workspaceId: number, projectId: number, payload: RequestCreateTaskType): Promise<BaseResponseType<TaskType>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId,
    data: payload
  });
}

export const tasks = async (workspaceId: number, projectId: number, payload: RequestGetTaskType): Promise<BaseResponseType<ResponseWithPaginationType<TaskType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId,
    params: payload
  });
}

export const tasksBoard = async (workspaceId: number, projectId: number, payload: RequestGetTaskType): Promise<BaseResponseType<ResponseTaskBoardDataType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/board',
    params: payload
  });
}

export const update = async (workspaceId: number, projectId: number, taskId: number, payload: RequestUpdateTaskType): Promise<BaseResponseType<TaskType>> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId,
    data: payload
  });
}

export const task = async (workspaceId: number, projectId: number, taskId: number): Promise<BaseResponseType<TaskType>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId
  });
}

export const subTask = async (workspaceId: number, projectId: number, taskId: number, payload: RequestGetTaskType): Promise<BaseResponseType<ResponseWithPaginationType<TaskType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId + '/subtask',
    params: payload
  });
}

export const removeSubTask = async (workspaceId: number, projectId: number, taskId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId + '/remove-subtask'
  });
}

export const removeTask = async (workspaceId: number, projectId: number, taskId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId
  });
}

export const taskHistory = async (workspaceId: number, projectId: number, taskId: number, payload: RequestWithPaginationType): Promise<BaseResponseType<ResponseWithPaginationType<HistoryType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId + '/history',
    params: payload
  });
}

export const uploadFiles = async (
  workspaceId: number,
  projectId: number,
  taskId: number,
  files: File[]
): Promise<BaseResponseType<ResponseWithPaginationType<TaskType[]>>> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append("files", file);
  });

  return request({
    method: API_METHOD_ENUM.POST,
    url: `${APP_CONFIG.API.PREFIX.task.url}/${workspaceId}/${projectId}/${taskId}/upload-files`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const taskFiles = async (workspaceId: number, projectId: number, taskId: number, payload: RequestWithPaginationType): Promise<BaseResponseType<ResponseWithPaginationType<TaskFileType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId + '/files',
    params: payload
  });
}

export const removeFile = async (workspaceId: number, projectId: number, taskId: number, fileId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.task.url + '/' + workspaceId + '/' + projectId + '/' + taskId + '/' + fileId + '/remove-file'
  });
}