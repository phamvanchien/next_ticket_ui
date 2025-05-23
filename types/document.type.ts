import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "./base.type";
import { ProjectType } from "./project.type";
import { ResponseUserDataType, UserType } from "./user.type";

export interface CreateDocumentRequestType {
  title: string;
  content: string;
  public?: boolean;
  user_share?: {
    id: number
    permission: number | null
  }[]
  project_share?: number[]
}

export interface GetDocumentType extends RequestWithPaginationType {
  share_type: number
}

export interface UpdateDocumentRequestType {
  title?: string;
  content?: string;
  public?: boolean
  share_type?: number | null
  user_share?: {
    id: number
    permission: number | null
  }[]
  project_share?: number[]
}

export interface DocumentType {
  id: number
  workspace_id: number
  user_id: number
  updated_at: string
  created_at: string
  title: string
  content: string
  share_type: number
  files: DocumentFileType[]
  full_permission: boolean
  projects_share: ProjectType[]
  members_share: MemberShareType[]
  creator: ResponseUserDataType
  updator: ResponseUserDataType
}

export interface MemberShareType {
  user: UserType,
  permission: number | null
}

export interface DocumentFileType {
  id: number
  name: string
  ext: string
  size: number
  url: string
}