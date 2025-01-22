export interface RequestCreateWorkspaceType {
  name: string;
  description?: string;
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
  user?: WorkspaceUserType
}

export interface WorkspaceUserType {
  id: 6
  first_name: string
  last_name: string
  email: string
  avatar: string
}