import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "./base.type"

export interface RequestCreateUserType {
  first_name: string,
  last_name: string,
  phone?: string,
  password: string,
  confirm_password: string,
  email: string,
  birthdate?: Date | null,
  salary?: string
}

export interface RequestUpdateUserType {
  first_name?: string,
  last_name?: string,
  phone?: string,
}

export interface RequestGetUsersType extends RequestWithPaginationType {
  id_not_in: string
  keyword?: string
}

export interface RequestUpdateUserType {
  first_name?: string;
  last_name?: string;
  birthDate?: Date;
  email?: string;
  phone?: string
  address?: string;
  salary?: number;
  social_link?: string;
  avatar_url?: string;
}

export interface RequestChangePasswordType {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface RequestSetPasswordType {
  password: string
  confirm_password: string
}

export interface ResponseUsersType extends BaseResponseType {
  data: ResponseUsersDataType
}

export interface ResponseUsersDataType extends ResponseWithPaginationType {
  items: ResponseUserDataType[]
}

export interface ResponseUserType extends BaseResponseType {
  data: ResponseUserDataType
}

export interface ResponseUsersListType extends BaseResponseType {
  data: ResponseUserDataType[]
}

export interface ResponseUserDataType {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar: string
  created_at: string
  login_type: "common" | "google_only"
}

export interface UserType {
  id: number
  first_name: string
  last_name: string
  email: string
  avatar: string
  phone: string
  created_at: string
}