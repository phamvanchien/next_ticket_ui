import { BaseResponseType } from "./base.type";
import { ResponseUserDataType } from "./user.type";

export interface CreateDocumentRequestType {
  title: string;
  content: string;
  public?: boolean
  user_share?: {
    id: number
    permission: 1 | 2
  }[]
  project_share?: number[]
}

export interface DocumentResponse extends BaseResponseType {
  data: DocumentType
}

export interface DocumentType {
  id: number
  workspace_id: number
  title: string
  content: string
  updator: ResponseUserDataType
}