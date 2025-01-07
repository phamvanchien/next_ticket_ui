import { API_MESSAGE } from "@/enums/api.enum"
import { APP_AUTH, APP_ERROR, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type"

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

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateInput = (
  field: string, 
  value: string | string[], 
  message: string,
  validateType: "required" | "is_email" | "is_match",
  error: AppErrorType[],
  setError: (error: AppErrorType[]) => void) => {
    if (validateType === 'required') {
      if (!value || value.length === 0 || value === '') {
        setError([...error, {
          property: field,
          message: message
        }]);
        return false;
      }
    }

    if (validateType === 'is_email') {
      if ((value && value !== '' && value.length > 0) && !validateEmail(value as string)) {
        setError([...error, {
          property: field,
          message: message
        }]);
        return false;
      }
    }

    if (validateType === 'is_match') {
      if (value[0] !== value[1]) {
        setError([...error, {
          property: field,
          message: message
        }]);
        return false;
      }
    }

    setError(error.filter(e => e.property !== field));
    return true;
}

export const validateForm = (validates: { [key: string]: any[] }, error: AppErrorType[], setError: (error: AppErrorType[]) => void) => {
  for (const key in validates) {
    if (validates.hasOwnProperty(key)) {
      for (let i = 0; i < validates[key].length; i++) {
        const validate = validates[key][i];
        const valid = validateInput(
          key, 
          validate.validateType === APP_VALIDATE_TYPE.MATCH ? [validate.value ?? '', validate.matchValue ?? ''] : validate.value ?? '', 
          validate.validateMessage, 
          validate.validateType,
          error,
          setError
        );
        if (!valid) {
          return false;
        }
      }
    }
  }
  return true;
}

export const hasError = (error: AppErrorType[], key?: string): boolean => {
  if (error.length === 0) {
    return false;
  }

  if (!key) {
    return error.length > 0 ? true : false;
  }

  const hasError = error.find(e => e.property === key);
  return hasError ? true: false;
}

export const printError = (error: AppErrorType[], key: string) => {
  const errorValue = error.find(e => e.property === key);
  return errorValue?.message;
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