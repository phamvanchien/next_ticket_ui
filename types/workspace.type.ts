import { BaseResponseType, ResponseWithPaginationType } from "./base.type";
import { ResponseUserDataType } from "./user.type";

export interface RequestCreateWorkspaceType {
  name: string;
  description?: string;
}

export interface ResponseWorkspaceType extends BaseResponseType {
  data: WorkspaceType
}

export interface ResponseWorkspacesType extends BaseResponseType {
  data: ResponseWorkspacesDataType
}

export interface ResponseWorkspacesDataType extends ResponseWithPaginationType {
  items: WorkspaceType[]
}

export interface ResponseSendInviteWorkspaceType extends BaseResponseType {
  data: string[]
}

export interface ResponseUserInviteWorkspaceType extends BaseResponseType {
  data: ResponseUserDataType[]
}

export interface ResponseInviteType extends BaseResponseType {
  data: ResponseInviteListDataType
}

export interface ResponseInviteListDataType extends ResponseWithPaginationType {
  items: InviteType[]
}

export interface InviteType {
  id: number
  created_at: string,
  workspace: WorkspaceType
}

export interface WorkspaceType {
  id: number
  user_id: number
  name: string
  description?: string
  logo?: string
  created_at: string
  user?: WorkspaceUserType
}

export interface ResponseMemberWorkspaceType extends BaseResponseType {
  data: ResponseMemberWorkspaceDataType
}

export interface ResponseMemberWorkspaceDataType extends ResponseWithPaginationType {
  items: ResponseUserDataType[]
}

export interface WorkspaceUserType {
  id: 6
  first_name: string
  last_name: string
  email: string
  avatar: string
}