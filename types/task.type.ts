import { ProjectAttributeType, ProjectStatusType, ProjectType } from "./project.type";
import { ResponseUserDataType } from "./user.type";
import { WorkspaceType } from "./workspace.type";

export interface RequestCreateTaskType {
  parent_id?: number
  status_id: number
  type_id?: number
  title: string
  description?: string
  priority?: number
  due?: Date
  tags?: number[]
  assigns?: number[]
  attributes: TaskAttributeType[]
}

export interface RequestUpdateTaskType {
  parent_id?: number
  status_id?: number
  type_id?: number
  title?: string
  description?: string
  priority?: number
  due?: Date | null
  tags?: number[]
  assigns?: number[]
  attributes?: TaskAttributeType[]
}

export interface RequestGetTaskType {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  tags?: string;
  assignee?: string;
  creator?: string;
  priority?: string;
  type?: string;
  attributes?: string;
  fromDue?: string;
  toDue?: string;
  fromCreated?: string;
  toCreated?: string;
  sortPriority?: "DESC" | "ASC";
  sortDue?: "DESC" | "ASC";
  sortCreatedAt?: "DESC" | "ASC";
}

export interface ResponseTaskBoardDataType {
  id: number
  name: string
  color: string
  priority: number
  tasks: TaskType[]
}

export interface TaskType {
  id: number
  workspace_id: number
  project_id: number
  title: string
  description: string
  due: string
  created_at: string,
  priority: TaskPriorityType
  user: ResponseUserDataType,
  assign: ResponseUserDataType[]
  status: ProjectStatusType,
  type: TaskTypeItem
  tags: ProjectStatusType[]
  project: ProjectType
  workspace: WorkspaceType
  attributes: TaskAttributeType[]
}

export interface TaskAttributeType {
  id: number
  task_id?: number
  value: any
  default_name?: string
  attribute: ProjectAttributeType
}

export interface TaskProjectType {
  id: number
  user_id: number
  workspace_id: number
  name: string
  description: string
  is_public: boolean
  created_at: string
  user: ResponseUserDataType
}

export interface TaskTypeItem {
  id: number
  title: string
}

export interface TaskPriorityType {
  id: number
  title: string
  color: string
}

export interface HistoryType {
  id: number
  user: ResponseUserDataType
  content: HistoryContentType[]
  created_at: string
}

export interface HistoryContentType {
  field: string
  before: string
  after: string
}