import { BaseResponseType } from "@/types/base.type";
import { RequestChangePasswordType, RequestCreateUserType, RequestGetUsersType, RequestSetPasswordType, RequestUpdateUserType, ResponseUserDataType, ResponseUsersType, ResponseUserType, UserType } from "@/types/user.type";
import { request } from "./base.api";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_CONFIG } from "@/configs/app.config";
export const changePassword = async (payload: RequestChangePasswordType): Promise<ResponseUserType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.user.changePassword,
    data: payload
  });
}

export const setPassword = async (payload: RequestSetPasswordType): Promise<ResponseUserType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.user.setPassword,
    data: payload
  });
}

export const create = async (payload: RequestCreateUserType): Promise<ResponseUserType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.user.url,
    data: payload
  });
}

export const update = async (payload: RequestUpdateUserType): Promise<ResponseUserType> => {
  return request({
    method: API_METHOD_ENUM.PUT,
    url: APP_CONFIG.API.PREFIX.user.url + '/profile',
    data: payload
  });
}

export const users = async (payload: RequestGetUsersType): Promise<ResponseUsersType> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.user.url,
    params: payload
  });
}

export const updateAvatar = async (image: File): Promise<BaseResponseType<ResponseUserDataType>> => {
  const formData = new FormData();
  formData.append("image", image);
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.user.url + '/avatar',
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
}

export const user = async (userId: number): Promise<BaseResponseType<UserType>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.user.url + '/' + userId,
  });
}