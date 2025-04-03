import { API_MESSAGE } from "@/enums/api.enum";
import { APP_ERROR } from "@/enums/app.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type";

export const responseError = (code: number, field?: string, message?: string): BaseResponseType => {
  return {
    code: code,
    message: API_MESSAGE.VALIDATE_FAILED,
    data: null,
    error: {
      property: field,
      message: message ?? 'Server error'
    }
  }
}

export const catchError = (response?: BaseResponseType): AppErrorType | null => {
  if (!response || !response.error?.message) {
    return {
      property: null,
      message: APP_ERROR.SERVER_MAINTAIN
    }
  }
  return response.error;
}