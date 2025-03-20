import { RequestCreateProjectType, RequestUpdateProjectType, RequestCreateTagType, RequestStatusListType, RequestUpdateTagType, ProjectTagType, ProjectType, ProjectInviteType, ReportStatusType, ReportAssigneeType, RequestCloneProjectType, RequestAddAttributeType, ProjectAttributeType, RequestUpdateAttributeType } from "@/types/project.type";
import { request } from "./base.api";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_CONFIG } from "@/config/app.config";
import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "@/types/base.type";
import { ResponseUserDataType } from "@/types/user.type";
import { WorkspaceUserType } from "@/types/workspace.type";

export const create = async (workspaceId: number, payload: RequestCreateProjectType): Promise<BaseResponseType<ProjectType>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId,
    data: payload
  });
}

export const projects = async (workspaceId: number, payload: RequestWithPaginationType): Promise<BaseResponseType<ResponseWithPaginationType<ProjectType[]>>> => {
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

export const userInvite = async (workspaceId: number, projectId: number, keyword?: string): Promise<BaseResponseType<ResponseUserDataType[]>> => {
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

export const inviteList = async (workspaceId: number, page: number, size: number, keyword?: string): Promise<BaseResponseType<ResponseWithPaginationType<ProjectInviteType[]>>> => {
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

export const membersList = async (workspaceId: number, projectId: number, page: number, size: number, keyword?: string): Promise<BaseResponseType<ResponseWithPaginationType<ResponseUserDataType[]>>> => {
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

export const createTag = async (workspaceId: number, projectId: number, payload: RequestCreateTagType): Promise<BaseResponseType<ProjectTagType>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/create-tag',
    data: payload
  });
}

export const tagsList = async (workspaceId: number, projectId: number, payload: RequestWithPaginationType): Promise<BaseResponseType<ResponseWithPaginationType<ProjectTagType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/tag-list',
    params: payload
  });
}

export const createStatus = async (workspaceId: number, projectId: number, payload: RequestCreateTagType): Promise<BaseResponseType<ProjectTagType>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/create-status',
    data: payload
  });
}

export const statusList = async (workspaceId: number, projectId: number, payload: RequestStatusListType): Promise<BaseResponseType<ResponseWithPaginationType<ProjectTagType[]>>> => {
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

export const reportByStatus = async (workspaceId: number, projectId: number): Promise<BaseResponseType<ReportStatusType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/report-by-status'
  });
}

export const reportByAssignee = async (workspaceId: number, projectId: number): Promise<BaseResponseType<ReportAssigneeType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/report-by-assignee'
  });
}

export const reportByPriority = async (workspaceId: number, projectId: number): Promise<BaseResponseType<ReportStatusType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/report-by-priority'
  });
}

export const reportByType = async (workspaceId: number, projectId: number): Promise<BaseResponseType<ReportStatusType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/report-by-type'
  });
}

export const reportByTag = async (workspaceId: number, projectId: number): Promise<BaseResponseType<ReportStatusType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/report-by-tag'
  });
}

export const cloneProject = async (workspaceId: number, projectId: number, payload: RequestCloneProjectType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/clone',
    data: payload
  });
}

export const addAttribute = async (workspaceId: number, projectId: number, payload: RequestAddAttributeType): Promise<BaseResponseType<ProjectAttributeType>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/add-attribute',
    data: payload
  });
}

export const deleteAttribute = async (workspaceId: number, projectId: number, attributeId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/' + attributeId + '/delete-attribute'
  });
}

export const updateAttribute = async (workspaceId: number, projectId: number, payload: RequestUpdateAttributeType): Promise<BaseResponseType<ProjectAttributeType>> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.project.url + '/' + workspaceId + '/' + projectId + '/update-attribute',
    data: payload
  });
}