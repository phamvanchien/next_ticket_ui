import { BaseResponseType, ResponseWithPaginationType } from "./base.type";
import { ProjectType } from "./project.type";
import { ResponseUserDataType } from "./user.type";

export interface CreateDocumentRequestType {
  title: string;
  content: string;
  public?: boolean
  user_share?: {
    id: number
    permission: number
  }[]
  project_share?: number[]
}

export interface UpdateDocumentRequestType {
  title?: string;
  content?: string;
  public?: boolean
  share_type?: number | null
  user_share?: {
    id: number
    permission: number
  }[]
  project_share?: number[]
}

export interface DocumentsResponse extends BaseResponseType {
  data: DocumentsDataType
}

export interface DocumentsDataType extends ResponseWithPaginationType {
  items: DocumentType[]
}

export interface DocumentResponse extends BaseResponseType {
  data: DocumentType
}

export interface DocumentType {
  id: number
  workspace_id: number
  user_id: number
  updated_at: string
  title: string
  content: string
  is_public: boolean
  share_type: number
  full_permission: boolean
  projects_share: ProjectType[]
  members_share: MemberShareType[]
  creator: ResponseUserDataType
  updator: ResponseUserDataType
}

export interface MemberShareType {
  id: number
  first_name: string
  last_name: string
  email: string
  full_permission: boolean
}