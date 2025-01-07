import { APP_CONFIG } from "@/config/app.config"
import { request } from "./base.api"
import { API_METHOD_ENUM } from "@/enums/api.enum"
import { RequestAuthenticateType, RequestVerifyAccountType, ResponseAuthenticateType, ResponseAuthenticateActionType, RequestForgotPasswordType, RequestRecoveryPasswordType, RequestGoogleAuthCallback } from "@/types/authenticate.type"
import { BaseResponseType } from "@/types/base.type"

export const authenticate = async (payload: RequestAuthenticateType): Promise<ResponseAuthenticateType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.authenticate.url,
    data: payload
  });
}

export const verify = async (payload: RequestVerifyAccountType): Promise<ResponseAuthenticateActionType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.authenticate.verify,
    data: payload
  });
}

export const forgotPassword = async (payload: RequestForgotPasswordType): Promise<ResponseAuthenticateActionType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.authenticate.forgotPassword,
    data: payload
  });
}

export const recoveryPassword = async (payload: RequestRecoveryPasswordType): Promise<ResponseAuthenticateActionType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.authenticate.recoveryPassword,
    data: payload
  });
}

export const loginWithGoogle = async (): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.authenticate.googleAuth
  });
};

export const authGoogleCallback = async (payload: RequestGoogleAuthCallback): Promise<ResponseAuthenticateType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.authenticate.googleAuthCallback,
    params: payload
  });
}

export const fetchEmail = async (email: string): Promise<BaseResponseType | ResponseAuthenticateType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.authenticate.fetchEmail,
    data: {
      email: email
    }
  });
}