import { AppConfigType } from "@/types/config.type";

export const APP_CONFIG: AppConfigType = {
  TOKEN_EXPIRE_TIME: 28 * (24 * 60 * 60 * 1000),
  URL: process.env.NEXT_PUBLIC_URL,
  API: {
    TIMEOUT: 28 * (24 * 60 * 60 * 1000),
    URL: process.env.NEXT_PUBLIC_API_URL as string,
    PREFIX: {
      authenticate: {
        url: '/authenticate',
        verify: '/authenticate/verify-account',
        forgotPassword: '/authenticate/forgot-password',
        recoveryPassword: '/authenticate/recovery-password',
        googleAuth: '/authenticate/google',
        googleAuthCallback: '/authenticate/google/callback',
        fetchEmail: '/authenticate/fetch-email'
      },
      workspace: {
        url: '/workspace'
      },
      user: {
        url: '/user',
        changePassword: '/user/change-password',
        profile: '/user/profile',
        setPassword: '/user/set-password'
      },
      project: {
        url: '/project'
      },
      task: {
        url: '/task',
        uploadFile: '/task/upload-file',
        removeFile: '/task/remove-file',
        remove: '/task/remove-task'
      },
      comment: {
        url: '/comment'
      },
      calendar: {
        url: '/calendar'
      },
      document: {
        url: '/document'
      },
      post: {
        url: '/post',
        category: '/post/category',
        top: '/post/top-post'
      }
    }
  }
}