import { BaseResponseType } from "./base.type"
import { ResponseUserDataType } from "./user.type"

export interface RequestAuthenticateType {
  email: string
  password: string
}

export interface RequestVerifyAccountType {
  hash: string
  email: string
}

export interface RequestForgotPasswordType {
  email: string
}

export interface RequestGoogleAuthCallback {
  code: string
  scope: string
  authuser: string
  prompt: string
}

export interface RequestRecoveryPasswordType {
  email: string
  hash: string
  password: string,
  confirm_password: string
}

export interface ResponseAuthenticateType extends BaseResponseType {
  data: {
    access_token: string
    user: ResponseUserDataType,
    login_type: 'nomarl' | 'google' | 'register_google'
  }
}

export interface ResponseAuthenticateActionType extends BaseResponseType {
  data: boolean
}