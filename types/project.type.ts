import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "./base.type"
import { ResponseUserDataType, UserType } from "./user.type"
import { WorkspaceType } from "./workspace.type"

export interface RequestAddAttributeType {
  // id: string
  name: string
  type: number
  default_name?: string
  value: {
    value: string; 
    icon: string; 
    color: string
  }[]
  icon?: string;
}

export interface RequestUpdateAttributeType {
  name: string
  value: {
    id: number;
    value: string; 
    icon: string; 
    color: string
  }[]
  icon?: string;
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
  percent_done: number
  members_total: number
  members: UserType[]
  user: UserType
  status: ProjectStatusType[]
  attributes: ProjectAttributeType[]
}

export interface ProjectAttributeType {
  id: number
  name: string
  default_name?: string
  type: number
  icon: string
  childrens: ProjectAttributeItemType[]
}

export interface ProjectAttributeItemType {
  id: number
  value: string
  icon: string
  color: string
}

interface WorkspaceUserType {
  id: 6
  first_name: string
  last_name: string
  email: string
  avatar: string
}

export interface RequestCreateStatusType {
  name: string
  color: string
  category_id: number
}

export interface RequestCreateTagType {
  name: string
  color: string
}

export interface RequestUpdateTagType {
  name?: string
  color?: string
}

export interface ProjectStatusType {
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