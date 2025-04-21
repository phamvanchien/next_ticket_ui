import { InviteType, RequestCreateWorkspaceType, WorkspaceType } from "@/types/workspace.type";
import { request } from "./base.api";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ResponseUserDataType, UserType } from "@/types/user.type";
import { APP_CONFIG } from "@/configs/app.config";

export const create = async (payload: RequestCreateWorkspaceType): Promise<BaseResponseType<WorkspaceType>> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.logo) formData.append("logo", payload.logo);

  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.workspace.url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

export const update = async (workspaceId: number, payload: RequestCreateWorkspaceType): Promise<BaseResponseType<WorkspaceType>> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.logo) formData.append("logo", payload.logo);

  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
}

export const workspaces = async (page: number = 1, size: number = 10, keyword?: string): Promise<BaseResponseType<ResponseWithPaginationType<WorkspaceType[]>>> => {
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

export const workspace = async (workspaceId: number): Promise<BaseResponseType<WorkspaceType>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId,
  });
}

export const sendInvite = async (workspaceId: number, email: string): Promise<BaseResponseType<string[]>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.workspace.url + '/' + workspaceId + '/send-invite',
    data: {
      email: email
    }
  });
}

export const userInvite = async (workspaceId: number, keyword?: string): Promise<BaseResponseType<UserType[]>> => {
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

export const inviteList = async (page: number, size: number): Promise<BaseResponseType<ResponseWithPaginationType<InviteType[]>>> => {
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

export const members = async (workspaceId: number, page: number = 1, size: number = 10, keyword?: string): Promise<BaseResponseType<ResponseWithPaginationType<UserType[]>>> => {
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