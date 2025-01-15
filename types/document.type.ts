import { BaseResponseType, ResponseWithPaginationType } from "./base.type";
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
  title: string
  content: string
  full_permission: boolean
  creator: ResponseUserDataType
  updator: ResponseUserDataType
}