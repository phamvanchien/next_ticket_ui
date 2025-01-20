enum APP_AUTH {
  COOKIE_AUTH_KEY = 'auth_token',
  COOKIE_AUTH_USER = 'auth_user'
}
enum APP_LINK {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  GO_TO_WORKSPACE = '/go-to-workspace',
  WORKSPACE = '/workspace',
  CREATE_WORKSPACE = '/workspace/create',
  INVITATION = '/invitation',
  PROFILE = '/profile',
  CALENDAR = '/calendar'
}
enum APP_VALIDATE_TYPE {
  REQUIRED = 'required',
  IS_EMAIL = 'is_email',
  MATCH = 'is_match',
  IS_PHONE = 'is_phone'
}
enum APP_ERROR {
  SERVER_ERROR = 'Server error',
  SERVER_MAINTAIN = 'Maintenance in progress. We’ll be back shortly!'
}
enum APP_LOCALSTORAGE {
  WORKSPACE_STORAGE = 'workspace_storage',
  TASK_BOARD_TYPE_SHOW = 'task_board_type_show',
  TASK_RECENTLY = 'task_recently'
}
export {APP_AUTH, APP_LINK, APP_VALIDATE_TYPE, APP_ERROR, APP_LOCALSTORAGE}