import { UserType } from "./user.type";

export interface RequestCreateWorkspaceType {
  name: string;
  description?: string;
  logo?: File;
}

export interface InviteType {
  id: number
  created_at: string,
  workspace: WorkspaceType
}

export interface WorkspaceType {
  id: number
  user_id: number
  name: string
  description?: string
  logo?: string
  created_at: string
  user?: UserType
  members: UserType[]
}