import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "./base.type"
import { ResponseUserDataType } from "./user.type"
import { WorkspaceType } from "./workspace.type"

export interface RequestCreateProjectType {
  name: string
  description?: string
  is_public?: boolean
  members?: number[]
}

export interface RequestUpdateProjectType {
  name?: string
  description?: string
  is_public?: boolean
}

export interface ResponseProjectItemType extends BaseResponseType {
  data: ProjectType
}

export interface ResponseProjectsType extends BaseResponseType {
  data: ResponseProjectsDataType
}

export interface ResponseProjectsDataType extends ResponseWithPaginationType {
  items: ProjectType[]
}

export interface ResponseProjectInviteType extends BaseResponseType {
  data: ResponseProjectInviteDataType
}

export interface ResponseProjectInviteDataType extends ResponseWithPaginationType {
  items: ResponseProjectInviteType[]
}

export interface ResponseProjectInviteType {
  id: number
  project: ProjectType
}

export interface ProjectType {
  id: number
  user_id: number
  workspace_id: number
  name: string
  description: string
  is_public: boolean
  created_at: string
  workspace: WorkspaceType
  total_tasks: number
  members_total: number
  members: WorkspaceUserType[]
  user: ResponseUserDataType
}

interface WorkspaceUserType {
  id: 6
  first_name: string
  last_name: string
  email: string
  avatar: string
}

export interface RequestCreateTagType {
  name: string
  color: string
}

export interface RequestUpdateTagType {
  name?: string
  color?: string
}

export interface ResponseTagsType extends BaseResponseType {
  data: ResponseTagsDataType
}

export interface ResponseTagsDataType extends ResponseWithPaginationType {
  items: ResponseTagType[]
}

export interface ResponseTagItemType extends BaseResponseType {
  data: ResponseTagType;
}

export interface ResponseTagType {
  id: number
  name: string
  color: string
  priority: number
}

export interface RequestStatusListType extends RequestWithPaginationType {
  prioritySort?: "DESC" | "ASC"
}