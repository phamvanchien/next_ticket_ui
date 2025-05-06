import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { APP_CONFIG } from "@/configs/app.config";
import { BaseResponseType, RequestWithPaginationType, ResponseWithPaginationType } from "@/types/base.type";
import { NotificationType } from "@/types/notification.type";

export const notifications = async (payload: RequestWithPaginationType): Promise<BaseResponseType<ResponseWithPaginationType<NotificationType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.notification.url,
    params: payload
  });
}