import { UserType } from "./user.type";

export interface CommentType {
  id: number
  workspace_id: number
  project_id: number
  task_id: number
  deleted: boolean
  content: string
  created_at: string
  user: UserType
}