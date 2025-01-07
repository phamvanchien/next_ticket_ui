import { RequestCreateProjectType, RequestUpdateProjectType, ResponseProjectItemType, ResponseProjectInviteType, ResponseProjectsType, RequestCreateTagType, ResponseTagItemType, ResponseTagsType, RequestStatusListType, RequestUpdateTagType } from "@/types/project.type";
import { request } from "./base.api";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_CONFIG } from "@/config/app.config";
import { BaseResponseType, RequestWithPaginationType } from "@/types/base.type";
import { ResponseMemberWorkspaceType, ResponseUserInviteWorkspaceType } from "@/types/workspace.type";

export const create = async (workspaceId: number, payload: RequestCreateProjectType): Promise<ResponseProjectItemType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId,
    data: payload
  });
}

export const projects = async (workspaceId: number, payload: RequestWithPaginationType): Promise<ResponseProjectsType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId,
    params: payload
  });
}

export const update = async (workspaceId: number, projectId: number, payload: RequestUpdateProjectType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId,
    data: payload
  });
}

export const remove = async (workspaceId: number, projectId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId
  });
}

export const userInvite = async (workspaceId: number, projectId: number, keyword?: string): Promise<ResponseUserInviteWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/user-invite',
    params: {
      keyword: keyword,
      page: 1,
      size: 5
    }
  });
}

export const sendInvite = async (workspaceId: number, projectId: number, payload: {members: number[]}): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/send-invite',
    data: payload
  });
}

export const inviteList = async (workspaceId: number, page: number, size: number, keyword?: string): Promise<ResponseProjectInviteType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/invite-list',
    params: {
      keyword: keyword,
      page: page,
      size: size
    }
  });
}

export const joinProject = async (workspaceId: number, projectId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/join-project'
  });
}

export const removeInvite = async (workspaceId: number, projectId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/remove-invite'
  });
}

export const membersList = async (workspaceId: number, projectId: number, page: number, size: number, keyword?: string): Promise<ResponseMemberWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/member-list',
    params: {
      keyword: keyword,
      page: page,
      size: size
    }
  });
}

export const createTag = async (workspaceId: number, projectId: number, payload: RequestCreateTagType): Promise<ResponseTagItemType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/create-tag',
    data: payload
  });
}

export const tagsList = async (workspaceId: number, projectId: number, payload: RequestWithPaginationType): Promise<ResponseTagsType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/tag-list',
    params: payload
  });
}

export const createStatus = async (workspaceId: number, projectId: number, payload: RequestCreateTagType): Promise<ResponseTagItemType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/create-status',
    data: payload
  });
}

export const statusList = async (workspaceId: number, projectId: number, payload: RequestStatusListType): Promise<ResponseTagsType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/status-list',
    params: payload
  });
}

export const updateStatus = async (workspaceId: number, projectId: number, statusId: number, payload: RequestUpdateTagType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + statusId + '/update-status',
    data: payload
  });
}

export const removeStatus = async (workspaceId: number, projectId: number, statusId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + statusId + '/remove-status'
  });
}

export const changePositionStatus = async (workspaceId: number, projectId: number, statusId: number, payload: {statusTargetId: number}): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + statusId + '/change-position-status',
    data: payload
  });
}

export const removeTag = async (workspaceId: number, projectId: number, tagId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + tagId + '/remove-tag'
  });
}

export const updateTag = async (workspaceId: number, projectId: number, tagId: number, payload: RequestUpdateTagType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + tagId + '/update-tag',
    data: payload
  });
}

export const removeMember = async (workspaceId: number, projectId: number, memberId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + memberId + '/remove-member'
  });
}