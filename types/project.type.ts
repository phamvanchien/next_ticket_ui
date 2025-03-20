import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "./base.type"
import { ResponseUserDataType } from "./user.type"
import { WorkspaceType } from "./workspace.type"

export interface RequestAddAttributeType {
  // id: string
  name: string
  type: number
  value: string[]
}

export interface RequestUpdateAttributeType {
  id: number
  name?: string
  value?: string[]
}

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

export interface ProjectInviteType {
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
  attributes: ProjectAttributeType[]
}

export interface ProjectAttributeType {
  id: number
  name: string
  type: number
  childrens: ProjectAttributeItemType[]
}

export interface ProjectAttributeItemType {
  id: number
  value: string
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

export interface ProjectTagType {
  id: number
  name: string
  color: string
  priority: number
}

export interface RequestStatusListType extends RequestWithPaginationType {
  prioritySort?: "DESC" | "ASC"
}

export interface ReportStatusType {
  id: string
  name: string
  color: string
  total_tasks: number
  percent_tasks: number
}

export interface ReportAssigneeType {
  id: number
  first_name: string
  last_name: string
  avatar: string | null
  total_tasks: number
  percent_tasks: number
}

export interface RequestCloneProjectType {
  project_name_clone: string
  is_public_clone?: boolean
}