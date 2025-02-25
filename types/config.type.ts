import { AxiosRequestConfig, Method } from "axios";

export interface AppConfigType {
  TOKEN_EXPIRE_TIME: number,
  URL?: string,
  API: {
    TIMEOUT: number
    URL: string,
    PREFIX: {
      authenticate: {
        url: string
        verify: string
        forgotPassword: string
        recoveryPassword: string
        googleAuth: string
        googleAuthCallback: string
        fetchEmail: string
      },
      workspace: {
        url: string
      },
      user: {
        url: string
        changePassword: string
        profile: string
        setPassword: string
      },
      project: {
        url: string
      },
      task: {
        url: string,
        uploadFile: string
        removeFile: string
        remove: string
      },
      comment: {
        url: string
      },
      calendar: {
        url: string
      },
      document: {
        url: string
      },
      post: {
        url: string
        category: string
        top: string
        categoryWithPost: string
      }
    }
  }
}

export interface RequestApiWithTokenType extends AxiosRequestConfig {
  method: Method;
  url: string;
  data?: any;
}