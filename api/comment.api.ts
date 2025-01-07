import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { APP_CONFIG } from "@/config/app.config";
import { BaseResponseType, RequestWithPaginationType } from "@/types/base.type";
import { ResponseCommentsType, ResponseCommentType } from "@/types/comment.type";

export const comments = async (workspaceId: number, projectId: number, taskId: number, payload: RequestWithPaginationType): Promise<ResponseCommentsType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.comment.url + '/' + workspaceId + '/' + projectId + '/' + taskId,
    params: payload
  });
}

export const create = async (workspaceId: number, projectId: number, taskId: number, payload: {content: string}): Promise<ResponseCommentType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.comment.url + '/' + workspaceId + '/' + projectId + '/' + taskId,
    data: payload
  });
}

export const update = async (workspaceId: number, projectId: number, taskId: number, commentId: number, payload: {content?: string}): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.comment.url + '/' + workspaceId + '/' + projectId + '/' + taskId + '/' + commentId,
    data: payload
  });
}