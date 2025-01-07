import { BaseResponseType, ResponseWithPaginationType } from "./base.type";
import { ResponseUserDataType } from "./user.type";

export interface ResponseCommentsType extends BaseResponseType {
  data: ResponseCommentsDataType
}

export interface ResponseCommentsDataType extends ResponseWithPaginationType {
  items: CommentType[]
}

export interface ResponseCommentType extends BaseResponseType {
  data: CommentType
}

export interface CommentType {
  id: number
  project_id: number
  task_id: number
  deleted: boolean
  content: string
  created_at: string
  user: ResponseUserDataType
}