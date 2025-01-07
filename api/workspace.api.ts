import { RequestCreateWorkspaceType, ResponseInviteType, ResponseMemberWorkspaceType, ResponseSendInviteWorkspaceType, ResponseUserInviteWorkspaceType, ResponseWorkspacesType, ResponseWorkspaceType } from "@/types/workspace.type";
import { request } from "./base.api";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_CONFIG } from "@/config/app.config";
import { BaseResponseType } from "@/types/base.type";

export const create = async (payload: RequestCreateWorkspaceType): Promise<ResponseWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.workspace.url,
    data: payload
  });
}

export const update = async (workspaceId: number, payload: RequestCreateWorkspaceType): Promise<ResponseWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId,
    data: payload
  });
}

export const workspaces = async (page: number = 1, size: number = 10, keyword?: string): Promise<ResponseWorkspacesType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.workspace.url,
    params: {
      keyword: keyword,
      page: page,
      size: size
    }
  });
}

export const workspace = async (workspaceId: number): Promise<ResponseWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId,
  });
}

export const sendInvite = async (workspaceId: number, email: string): Promise<ResponseSendInviteWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/send-invite',
    data: {
      email: email
    }
  });
}

export const userInvite = async (workspaceId: number, keyword?: string): Promise<ResponseUserInviteWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/user-invite',
    params: {
      keyword: keyword,
      page: 1,
      size: 5
    }
  });
}

export const inviteList = async (page: number, size: number): Promise<ResponseInviteType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/invite-list',
    params: {
      page: page,
      size: size
    }
  });
}

export const acceptInvite = async (workspaceId: number, inviteId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/' + inviteId + '/accept-invite',
  });
}

export const removeInvite = async (workspaceId: number, inviteId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/' + inviteId + '/remove-invite',
  });
}

export const members = async (workspaceId: number, page: number = 1, size: number = 10, keyword?: string): Promise<ResponseMemberWorkspaceType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/member',
    params: {
      keyword: keyword,
      page: page,
      size: size
    }
  });
}

export const removeMember = async (workspaceId: number, memberId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/' + memberId + '/remove-member',
  });
}

export const removeWorkspace = async (workspaceId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId
  });
}